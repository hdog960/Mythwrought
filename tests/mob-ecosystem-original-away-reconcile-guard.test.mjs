// Original-repository integration proof: the detached read-only preflight
// must never claim that it owns PopulationManager's private six-second #away.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';
import {inspectOriginalReconcileReadiness}
  from '../src/mobs/ecosystem-reconcile-readiness.mjs';

const near=[8,4,8],far=[100,4,8];
function fixture(species='deer') {
  let resident=true;
  const world={revision:()=>0,residentAt:()=>resident,
    volume:p=>p[1]<4?'solid':'clear',
    grounded:p=>p[1]>=4&&p[1]<4.04,
    environment:()=>({biome:'meadow',light:.8,hazard:false}),
    medium:()=> 'air'};
  const engine=new MobEngine(world,179,{maxEntities:32,maxActive:8});
  const id=engine.spawn(species,[9,4,8]);
  assert.ok(id);
  const manager=new PopulationManager(engine,world);
  return {engine,world,id,manager,setResident:v=>resident=v,
    inspect:observer=>inspectOriginalReconcileReadiness({engine,world,observer}),
    advance:(observer,n=1)=>{for(let i=0;i<n;i++)manager.advance(.5,observer,[])},
    close(){engine.dispose()}};
}

test('read-only reconcile stays on HOLD throughout original six-second far-away ledger',()=>{
  const f=fixture();
  const before=f.inspect(far);
  assert.equal(before.ready,false);
  assert.deepEqual(before.required.map(x=>x.kind),
    ['sleep-dormant','unprotected-away-ledger']);
  f.advance(far,12);
  assert.equal(f.engine.get(f.id)?.state,'dormant');
  const pending=f.inspect(far);
  assert.equal(pending.ready,false);
  assert.deepEqual(pending.required.map(x=>x.kind),['unprotected-away-ledger']);
  f.advance(far);
  assert.equal(f.engine.get(f.id),undefined);
  const resolved=f.inspect(far);
  assert.equal(resolved.ready,true);
  assert.equal(resolved.inspected,0);
  f.close();
});

test('near return to original manager allows inspector to certify observed idle state',()=>{
  const f=fixture();
  f.advance(far,8);
  assert.equal(f.inspect(near).ready,false);
  assert.deepEqual(f.inspect(near).required.map(x=>x.kind),['wake-idle']);
  f.advance(near);
  assert.equal(f.engine.get(f.id)?.state,'idle');
  assert.equal(f.inspect(near).ready,true);
  f.close();
});

test('protected far mob remains on conservative preflight HOLD even if engine survives',()=>{
  const f=fixture('glownewt');
  assert.equal(f.engine.protectIdentity(f.id),true);
  f.advance(far,20);
  assert.ok(f.engine.get(f.id));
  const result=f.inspect(far);
  assert.equal(result.ready,false);
  assert.deepEqual(result.required.map(x=>x.kind),['protected-away-state']);
  f.close();
});

test('unloaded nearby mob cannot be incorrectly certified as resident',()=>{
  const f=fixture();
  f.setResident(false);
  assert.equal(f.inspect(near).ready,false);
  assert.deepEqual(f.inspect(near).required.map(x=>x.kind),
    ['sleep-dormant','unprotected-away-ledger']);
  f.advance(near);
  assert.equal(f.engine.get(f.id)?.state,'dormant');
  assert.deepEqual(f.inspect(near).required.map(x=>x.kind),['unprotected-away-ledger']);
  f.close();
});
