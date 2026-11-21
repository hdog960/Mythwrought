import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldSurfaceEntrance} from '../src/living-underworld/surface-entrance-proposal.mjs';
import {searchProtectedEntranceCandidates} from '../src/living-underworld/entrance-candidate-search.mjs';

const inputs={surfaceHeightAt:()=>8,biomeAt:()=> 'snow',requiredBiome:'snow',
 naturalAt:()=>3};
test('search is deterministic and never changes the first original proposal',()=>{
 const first=planUnderworldSurfaceEntrance(179,0,0,inputs);
 const another=planUnderworldSurfaceEntrance(179,0,0,{...inputs,searchStart:0});
 assert.deepEqual(first,another);
 const one=searchProtectedEntranceCandidates(179,0,0,inputs);
 const two=searchProtectedEntranceCandidates(179,0,0,inputs);
 assert.deepEqual(one,two);
 assert.equal(one.ok,true);
 assert.equal(one.accepted.proposal.direction,first.direction);
 assert.equal(one.accepted.envelope.ok,true);
 assert.equal(one.accepted.stairs.ok,true);
 assert.equal(one.accepted.geometry.pass,true);
});
test('strict source protection cannot be bypassed by alternate directions',()=>{
 for(const blocked of [
  {naturalAt:()=>6},
  {naturalAt:()=>3,editedAt:()=>true},
  {naturalAt:()=>3,existingLandmarkAt:()=>true},
  {naturalAt:()=>3,authoredAt:()=>3}
 ]){
  const result=searchProtectedEntranceCandidates(179,0,0,{...inputs,...blocked});
  assert.equal(result.ok,false);
  assert.equal(result.accepted,null);
  assert.ok(result.tested>=1);
  assert.ok(result.examined.some(e=>e.stage==='STRICT_SOURCE_REJECTED'));
 }
});
test('bounded alternatives can reach a different compass mouth without weakening source rules',()=>{
 const first=planUnderworldSurfaceEntrance(179,0,0,inputs);
 const result=searchProtectedEntranceCandidates(179,0,0,{
   ...inputs,existingLandmarkAt:(x,y,z)=>x===first.mouth.x&&z===first.mouth.z
 });
 assert.equal(result.ok,true,JSON.stringify(result.examined));
 assert.ok(result.tested>1);
 assert.notEqual(result.accepted.proposal.direction,first.direction);
 assert.equal(result.noOriginalCellsChanged,true);
 assert.equal(result.worldCarved,false);
});
test('invalid option values fail without altering the historical planner',()=>{
 assert.throws(()=>searchProtectedEntranceCandidates(179,0,0,{...inputs,maxCandidates:5}),/Invalid/);
 assert.throws(()=>planUnderworldSurfaceEntrance(179,0,0,{...inputs,searchStart:4}),/Invalid/);
});
