import test from 'node:test';
import assert from 'node:assert/strict';
import {planDetachedPedestrianSwitchback,
 optimizeDetachedPedestrianSwitchback}
 from '../src/living-underworld/pedestrian-switchback.mjs';
import {auditSupportedEntranceStairs}
 from '../src/living-underworld/walkable-entrance-stairs.mjs';
import {auditCombinedStairFootprints}
 from '../src/living-underworld/combined-stair-footprints.mjs';
import {selectSourceProtectedInterlevelRamps}
 from '../src/living-underworld/source-aware-ramp-selection.mjs';
const stone=Object.freeze({naturalAt:()=>3,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false});
test('original single-route grade can pass while combined stairs block headroom',()=>{
 const seed=179,rx=-7,rz=13;
 const stairs=[16,25,34,35].map(index=>{
  const q=optimizeDetachedPedestrianSwitchback(seed,rx,rz,index);
  return planDetachedPedestrianSwitchback(seed,rx,rz,index,{
   radius:q.selectedRadius,cornerFlat:q.selectedCornerFlat
  });
 });
 assert.ok(stairs.every(p=>auditSupportedEntranceStairs(p).ok));
 const combined=auditCombinedStairFootprints(stairs);
 assert.equal(combined.ok,false);
 assert.equal(combined.reason,'CROSS_ROUTE_SUPPORT_BLOCKS_CLEARANCE');
 assert.ok(combined.crossRouteBlockedCells>0);
 assert.equal(combined.existingM7Modified,false);
});
test('source-safe quarter-turn alternatives never fill adjacent stairway headroom across 24 regions',()=>{
 let regions=0,links=0,originalSupport=0,selectedSupport=0;
 for(const seed of [179,-17,2026,314159,8675309,13579])
  for(const [rx,rz] of [[0,0],[-7,13],[300,-302],[-300,250]]){
   const q=selectSourceProtectedInterlevelRamps(seed,rx,rz,{
    source:stone,includeSocket:true
   });
   assert.equal(q.ok,true,JSON.stringify({seed,rx,rz,q}));
   assert.equal(q.combined.crossRouteBlockedCells,0);
   assert.equal(q.approvedLinkCount,4);
   assert.equal(q.completeNetworkCollisionFree,true);
   assert.equal(q.allSelectedCandidateVoxelAirFaceConnected,true);
   assert.equal(q.linkSourceOwnershipChecked,true);
   assert.ok(q.distinctProposedSupportCells<=q.sumProposedSupportCells);
   assert.ok(q.sourceCellsChecked<=q.maxSourceChecks);
   for(const link of q.links){
    assert.ok(link.selected.sourceSafe);
    assert.equal(link.selected.candidateSixFaceVoxelAirContinuous,true);
    assert.ok(link.selected.quarterTurns>=0&&link.selected.quarterTurns<=3);
    assert.equal(link.selected.stepsActuallyPlaced,false);
   }
   regions++;links+=q.approvedLinkCount;
   selectedSupport+=q.sumProposedSupportCells;
   for(const index of [16,25,34,35])
    originalSupport+=optimizeDetachedPedestrianSwitchback(seed,rx,rz,index).optimizedSupportCells;
  }
 assert.equal(regions,24);
 assert.equal(links,96);
 assert.equal(originalSupport,45866);
 assert.equal(selectedSupport,42103);
});
test('zero-turn explicit and previous defaults preserve the original geometry contract',()=>{
 const q=planDetachedPedestrianSwitchback(179,0,0,16);
 assert.deepEqual(q,planDetachedPedestrianSwitchback(179,0,0,16,{
  quarterTurns:0
 }));
 assert.throws(()=>planDetachedPedestrianSwitchback(179,0,0,16,{
  quarterTurns:4
 }),/Invalid/);
});
test('combined-volume budgets refuse without editing any source world',()=>{
 const p=planDetachedPedestrianSwitchback(179,0,0,16);
 const r=auditCombinedStairFootprints([p],{maxCells:100});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'COMBINED_FOOTPRINT_BUDGET');
 assert.equal(r.worldChanged,false);
});
