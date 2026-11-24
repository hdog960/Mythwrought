// Actual original MobEngine + PopulationManager native integration contract.
// The source engine and private #away ledger own every state transition.
// No live world, spawning, PWA, biome, or save source is changed by this test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';

const near = [8,4,8], far = [100,4,8];
function world() {
  let resident = true;
  return {
    revision(){return 0;},
    residentAt(){return resident;},
    setResident(value){resident = value;},
    volume(p){return p[1] < 4 ? 'solid' : 'clear';},
    grounded(p){return p[1] >= 4 && p[1] < 4.04;},
    environment(){return {biome:'meadow', light:.8, hazard:false};},
    medium(){return 'air';},
    set(){throw Error('No original terrain write allowed');},
    save(){throw Error('No Schema-1 write allowed');}
  };
}
function harness({species='deer', protection=()=>false}={}) {
  const w=world(),engine=new MobEngine(w,179,{maxEntities:32,maxActive:8});
  const id=engine.spawn(species,[9,4,8]);
  assert.ok(id,'Real original engine must admit source creature');
  const manager=new PopulationManager(engine,w,{isProtected:protection});
  const step=(o=far,n=1,seconds=.5)=>{
    for(let i=0;i<n;i++) {
      const result=manager.advance(seconds,o,[]);
      assert.equal(result.spawned,null);
      assert.equal(result.evaluated,0);
    }
  };
  return {w,engine,id,manager,step,finish(){engine.dispose()}};
}

test('original six-second away grace begins on first due far tick, never one tick early',()=>{
  const h=harness();
  h.step(far);
  assert.equal(h.engine.get(h.id)?.state,'dormant');
  h.step(far,11);
  assert.equal(h.engine.get(h.id)?.state,'dormant',
    'At source time 6.0 the away time is only 5.5 seconds');
  h.step(far);
  assert.equal(h.engine.get(h.id),undefined,
    'At source time 6.5 the private #away timer reaches 6.0s');
  h.finish();
});

test('original nearby return wakes and resets six-second hidden history',()=>{
  const h=harness();
  h.step(far,9);
  assert.equal(h.engine.get(h.id)?.state,'dormant');
  h.step(near);
  assert.equal(h.engine.get(h.id)?.state,'idle');
  h.step(far);
  h.step(far,11);
  assert.ok(h.engine.get(h.id),'Old away history cannot remove the returned mob');
  h.step(far);
  assert.equal(h.engine.get(h.id),undefined);
  h.finish();
});

test('original isProtected suppresses removal and clears previous away grace',()=>{
  let protectedFlag=false;
  const h=harness({protection:()=>protectedFlag});
  h.step(far,9);
  protectedFlag=true;
  h.step(far,25);
  assert.ok(h.engine.get(h.id),'Protected source mob survives past six seconds');
  protectedFlag=false;
  h.step(far);
  h.step(far,11);
  assert.ok(h.engine.get(h.id),'Unprotection must start a fresh grace window');
  h.step(far);
  assert.equal(h.engine.get(h.id),undefined);
  h.finish();
});

test('original important glownewt remains protected when far or unloaded',()=>{
  const h=harness({species:'glownewt'});
  assert.equal(h.engine.protectIdentity(h.id),true);
  h.w.setResident(false);
  h.step(far,20);
  assert.equal(h.engine.get(h.id)?.important,true);
  assert.equal(h.engine.get(h.id)?.state,'dormant');
  h.finish();
});

test('original unloaded nearby mob enters away history despite distance',()=>{
  const h=harness();
  h.w.setResident(false);
  h.step(near);
  assert.equal(h.engine.get(h.id)?.state,'dormant');
  h.step(near,11);
  assert.ok(h.engine.get(h.id));
  h.step(near);
  assert.equal(h.engine.get(h.id),undefined);
  h.finish();
});

test('original restored residency wakes mob and cancels unload-away history',()=>{
  const h=harness();
  h.w.setResident(false);
  h.step(near,10);
  h.w.setResident(true);
  h.step(near);
  assert.equal(h.engine.get(h.id)?.state,'idle');
  h.w.setResident(false);
  h.step(near);
  h.step(near,11);
  assert.ok(h.engine.get(h.id),'Restored original residency resets grace');
  h.step(near);
  assert.equal(h.engine.get(h.id),undefined);
  h.finish();
});

test('original empty region list still runs due global reconciliation',()=>{
  const h=harness();
  h.step(far,1,.49);
  assert.equal(h.engine.get(h.id)?.state,'idle');
  h.step(far,1,.01);
  assert.equal(h.engine.get(h.id)?.state,'dormant');
  h.finish();
});

test('original capped 1-second time advance governs away history',()=>{
  const h=harness();
  h.step(far,6,30);
  assert.ok(h.engine.get(h.id));
  h.step(far,1,30);
  assert.equal(h.engine.get(h.id),undefined);
  h.finish();
});

test('invalid original observer or negative time must not advance away history',()=>{
  const h=harness();
  assert.deepEqual(h.manager.advance(.5,[NaN,4,8],[]),
    {evaluated:0,spawned:null});
  assert.deepEqual(h.manager.advance(-1,far,[]),
    {evaluated:0,spawned:null});
  assert.equal(h.engine.get(h.id)?.state,'idle');
  h.step(far);
  assert.equal(h.engine.get(h.id)?.state,'dormant');
  h.finish();
});

test('original two creatures maintain independent private away start times',()=>{
  const h=harness();
  const second=h.engine.spawn('deer',[50,4,8]);
  assert.ok(second);
  h.step(far,7);
  assert.equal(h.engine.get(h.id)?.state,'dormant');
  assert.equal(h.engine.get(second)?.state,'dormant');
  // Within 18 of [50,4,8] only the second original creature returns.
  h.step([50,4,8]);
  assert.equal(h.engine.get(h.id)?.state,'dormant');
  assert.equal(h.engine.get(second)?.state,'idle');
  h.step(far,5);
  assert.equal(h.engine.get(h.id),undefined,
    'Original first away timer still expires at source time 6.5');
  assert.equal(h.engine.get(second)?.state,'dormant');
  h.step(far,7);
  assert.ok(h.engine.get(second),'Second private timer only reaches 5.5s');
  h.step(far);
  assert.equal(h.engine.get(second),undefined,
    'Second independent private away timer expires at source time 10.5');
  h.finish();
});
