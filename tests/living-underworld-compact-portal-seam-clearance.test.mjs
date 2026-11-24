import test from 'node:test';
import assert from 'node:assert/strict';
import {compactPortalChunkPair,auditCompactPortalSeam}
 from '../src/living-underworld/compact-portal-seam-clearance.mjs';
import {summarizeSourceProtectedChunkRisk}
 from '../src/living-underworld/source-protected-chunk-aggregate.mjs';
const stone=Object.freeze({naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false});
const opts={seed:179,rx:-9,rz:0,direction:'east'};
test('east and south original shared portal addresses have two disjoint aligned owned chunks',()=>{
 for(const direction of ['east','south']){
  const p=compactPortalChunkPair(179,-9,0,direction);
  assert.equal(p.origins[1][p.axis]-p.origins[0][p.axis],16);
  assert.equal(p.origins[1][p.axis],p.portal[p.axis]);
  for(const o of p.origins)for(const a of ['x','y','z'])assert.equal(Math.abs(o[a]%16),0);
 }
 assert.throws(()=>compactPortalChunkPair(179,-9,0,'west'),TypeError);
});
test('two original halo snapshots reuse exactly their 648 shared coordinate reads',()=>{
 let calls=0;
 const r=auditCompactPortalSeam({...opts,source:{...stone,
  naturalAt:()=>{calls++;return 1}}});
 assert.equal(r.aggregate.ok,true);
 assert.equal(r.reportedHaloVisits,11664);
 assert.equal(r.uniqueNaturalCells,11016);
 assert.equal(r.sharedHaloCells,648);
 assert.equal(calls,11016);
 assert.equal(r.originalRoleInvocations.naturalAt,calls);
 assert.equal(r.worldChanged,false);
 assert.equal(r.liveWalkingVerified,false);
});
test('source edits and unsafe ore at the proposed portal hard refuse before movement',()=>{
 const p=compactPortalChunkPair(179,-9,0,'east').portal;
 for(const source of [
  {...stone,naturalAt:(x,y,z)=>x===p.x&&y===p.y&&z===p.z?999:1},
  {...stone,editedAt:(x,y,z)=>x===p.x&&y===p.y&&z===p.z}
 ]){
  const r=auditCompactPortalSeam({...opts,source});
  assert.equal(r.ok,false);
  assert.equal(r.reason,'SEAM_SOURCE_OR_BUDGET_HOLD');
  assert.ok(r.aggregate.unsafeCarves>0);
  assert.equal(r.constructedSupportCells,0);
 }
});
test('original authored solids and landmark vetoes survive compact seam projection',()=>{
 const p=compactPortalChunkPair(179,-9,0,'east').portal;
 for(const source of [
  {...stone,authoredAt:(x,y,z)=>x===p.x&&y===p.y&&z===p.z?1:undefined},
  {...stone,protectedAt:(x,y,z)=>x===p.x&&y===p.y&&z===p.z}
 ]){
  const r=auditCompactPortalSeam({...opts,source});
  assert.equal(r.ok,false);
  assert.ok(r.aggregate.unsafeCarves>0);
 }
});
test('no artificial retained floor may be inferred from an all-air sampled world',()=>{
 const r=auditCompactPortalSeam({...opts,source:{...stone,naturalAt:()=>0}});
 assert.equal(r.aggregate.ok,true);
 assert.equal(r.ok,false);
 assert.equal(r.reason,'COMPACT_SEAM_SUPPORTED_CONTROLLER_ROUTE_HOLD');
 assert.equal(r.constructedSupportCells,0);
});
test('the same aggregate policy refuses combined pairs above the strict total cap',()=>{
 const one=auditCompactPortalSeam({...opts,source:stone});
 const two=auditCompactPortalSeam({seed:179,rx:-6,rz:3,direction:'south',source:stone});
 const all=[...one.chunks,...two.chunks];
 const limit=summarizeSourceProtectedChunkRisk(all,{expectedChunks:4,
  requireInteriorEvidence:true,maxTotalApprovedCarves:0});
 assert.equal(limit.ok,false);
 assert.equal(limit.reason,'AGGREGATE_APPROVED_CARVE_BUDGET');
});
