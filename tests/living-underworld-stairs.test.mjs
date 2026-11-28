import test from 'node:test';
import assert from 'node:assert/strict';
import {auditSupportedEntranceStairs}
 from '../src/living-underworld/walkable-entrance-stairs.mjs';
import {planUnderworldSurfaceEntrance}
 from '../src/living-underworld/surface-entrance-proposal.mjs';
test('real deterministic detached descent proposal can reserve a continuous three-wide stair deck',()=>{
 for(const seed of [179,-17,2026])for(const [rx,rz] of [[0,0],[-300,150]]){
  const p=planUnderworldSurfaceEntrance(seed,rx,rz,
   {surfaceHeightAt:()=>8,biomeAt:()=> 'plains'});
  assert.equal(p.ok,true);
  const r=auditSupportedEntranceStairs(p);
  assert.equal(r.ok,true,JSON.stringify({seed,rx,rz,reason:r.failures,
   conflicts:r.conflictExamples}));
  assert.ok(r.length>50);
  assert.ok(r.supportCells>100);
  assert.equal(r.conflictCells,0);
  assert.ok(r.maximumStepRise<=1);
  assert.equal(r.worldCarved,false);
 }
});
test('steep unsupported galleries and invalid candidate inputs are never certified walkable',()=>{
 const bad={ok:true,segments:[{a:{x:0,y:-35,z:0},b:{x:4,y:10,z:0}}]};
 const q=auditSupportedEntranceStairs(bad);
 assert.equal(q.ok,false);
 assert.ok(q.failures.includes('UNSUPPORTED_GRADE'));
 assert.throws(()=>auditSupportedEntranceStairs(null),/Invalid/);
});
