import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';
import {inspectOriginalReconcileReadiness,ORIGINAL_ACTIVE_RADIUS,
  ORIGINAL_AWAY_GRACE} from '../src/mobs/ecosystem-reconcile-readiness.mjs';
const observer=[8,4,8];
function world(){
  return {revision(){return 0;},residentAt(){return true;},
    volume(p){return p[1]<4?'solid':'clear';},
    grounded(p){return p[1]>=4&&p[1]<4.04;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';}};
}
test('clean nearby original MobEngine is source reconcile-ready',()=>{
  assert.equal(ORIGINAL_ACTIVE_RADIUS,18);assert.equal(ORIGINAL_AWAY_GRACE,6);
  const w=world(),engine=new MobEngine(w,179);
  const id=engine.spawn('deer',[9,4,8]);
  assert.ok(id);
  const p=inspectOriginalReconcileReadiness({engine,world:w,observer});
  assert.equal(p.ready,true);assert.equal(p.required.length,0);
  assert.equal(engine.get(id).state,'idle');engine.dispose();
});
test('source original manager wakes nearby dormant animal',()=>{
  const w=world(),engine=new MobEngine(w,179),id=engine.spawn('deer',[9,4,8]);
  assert.equal(engine.transition(id,'dormant'),true);
  assert.deepEqual(inspectOriginalReconcileReadiness({
    engine,world:w,observer
  }).required.map(x=>x.kind),['wake-idle']);
  assert.equal(engine.get(id).state,'dormant');
  new PopulationManager(engine,w).advance(.5,observer,[]);
  assert.equal(engine.get(id).state,'idle');engine.dispose();
});
test('source original manager sleeps far idle animal and tracks six-second away',()=>{
  const w=world(),engine=new MobEngine(w,179),id=engine.spawn('deer',[35,4,8]);
  assert.deepEqual(inspectOriginalReconcileReadiness({
    engine,world:w,observer
  }).required.map(x=>x.kind),['sleep-dormant','unprotected-away-ledger']);
  assert.equal(engine.get(id).state,'idle');
  new PopulationManager(engine,w).advance(.5,observer,[]);
  assert.equal(engine.get(id).state,'dormant');engine.dispose();
});
test('important far source mob requires original protected bookkeeping',()=>{
  const w=world(),engine=new MobEngine(w,179);
  const id=engine.spawn('glownewt',[35,4,8],{dormant:true});
  assert.ok(id);assert.equal(engine.protectIdentity(id),true);
  assert.deepEqual(inspectOriginalReconcileReadiness({
    engine,world:w,observer
  }).required.map(x=>x.kind),['protected-away-state']);
  engine.dispose();
});
test('unknown residency, invalid protection and edited voxel revision refuse',()=>{
  const w=world(),engine=new MobEngine(w,179);
  engine.spawn('deer',[35,4,8]);
  assert.throws(()=>inspectOriginalReconcileReadiness({
    engine,world:{...w,residentAt:()=>undefined},observer
  }),/Unknown original mob residency/);
  assert.throws(()=>inspectOriginalReconcileReadiness({
    engine,world:w,observer,isProtected:()=>undefined
  }),/Unknown original mob protection/);
  let revision=0;
  assert.throws(()=>inspectOriginalReconcileReadiness({
    engine,world:{...w,revision:()=>revision,
      residentAt:()=>{revision++;return true;}},observer
  }),/World revision changed/);
  engine.dispose();
});
