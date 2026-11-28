import test from 'node:test';
import assert from 'node:assert/strict';
import {auditProtectedEntranceEnvelope,isCandidateGeologyMaterial}
 from '../src/living-underworld/protected-entrance-envelope.mjs';
import {planUnderworldSurfaceEntrance}
 from '../src/living-underworld/surface-entrance-proposal.mjs';

const proposal=()=>planUnderworldSurfaceEntrance(179,0,0,
 {surfaceHeightAt:()=>8,biomeAt:()=> 'snow'});
test('read-only 3D entrance envelope checks complete surface cross-section',()=>{
 const q=auditProtectedEntranceEnvelope(proposal(),{naturalAt:()=>3});
 assert.equal(q.ok,true);
 assert.ok(q.checkedCells>50);
 assert.equal(q.authorizedToCarve,false);
});
test('original authored stone, edits, protected landmark and nonterrain canopy must reject',()=>{
 const p=proposal(),at=p.mouth;
 for(const opt of [
  {naturalAt:()=>3,authoredAt:(x,y,z)=>x===at.x&&y===at.y&&z===at.z?3:undefined},
  {naturalAt:()=>3,editedAt:(x,y,z)=>x===at.x&&y===at.y&&z===at.z},
  {naturalAt:()=>3,protectedAt:(x,y,z)=>x===at.x&&y===at.y&&z===at.z},
  {naturalAt:(x,y,z)=>x===at.x&&y===at.y&&z===at.z?7:3}
 ]){
  const q=auditProtectedEntranceEnvelope(p,opt);
  assert.equal(q.ok,false,JSON.stringify(q));
  assert.ok(q.examples.length>0);
 }
 assert.equal(isCandidateGeologyMaterial(403),true);
 assert.equal(isCandidateGeologyMaterial(410),false);
 assert.equal(isCandidateGeologyMaterial(76),false);
 assert.throws(()=>auditProtectedEntranceEnvelope(p,{}),/Invalid/);
});
test('candidate envelope scan refuses insufficient budget without claiming a safe mouth',()=>{
 const q=auditProtectedEntranceEnvelope(proposal(),{naturalAt:()=>3,maxChecks:12});
 assert.equal(q.ok,false);
 assert.equal(q.reason,'CHECK_BUDGET_EXCEEDED');
});
test('the requested biome is checked at the actual cave mouth, not the region center',()=>{
 const p=planUnderworldSurfaceEntrance(179,0,0,{surfaceHeightAt:()=>8,
  biomeAt:()=> 'plains',requiredBiome:'enchanted'});
 assert.equal(p.ok,false);
 assert.ok(p.rejectionHistory.every(s=>s.includes('biome')));
});
