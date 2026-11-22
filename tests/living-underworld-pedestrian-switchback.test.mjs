import test from 'node:test';
import assert from 'node:assert/strict';
import {planUnderworldRegion} from '../src/living-underworld/worldwide-network.mjs';
import {auditDetachedPedestrianSwitchback,
 auditDetachedNetworkPedestrianReadiness,planDetachedPedestrianSwitchback}
 from '../src/living-underworld/pedestrian-switchback.mjs';

test('historical steep inter-level links fail the original walking grade, not source voxel connectivity',()=>{
 const a=auditDetachedNetworkPedestrianReadiness(179,0,0);
 assert.equal(a.horizontalPairedTotal,16);
 assert.equal(a.horizontalPairedPassed,16);
 assert.equal(a.directConnectorTotal,4);
 assert.ok(a.directConnectorPassed<4,'must retain true old vertical grade failures');
 assert.equal(a.proposedSwitchbackPassed,4,JSON.stringify(a.switchbacks));
 assert.equal(a.actualM7AirCarved,false);
});
test('all three level links plus the protected under-surface socket have 3-wide nonintersecting dry-run steps',()=>{
 for(const seed of [179,-17,2026,314159])for(const [rx,rz] of [
  [0,0],[-7,13],[300,-302],[-300,250]]){
  const plan=planUnderworldRegion(seed,rx,rz);
  for(const index of [16,25,34,35]){
   const candidate=planDetachedPedestrianSwitchback(seed,rx,rz,index);
   const check=auditDetachedPedestrianSwitchback(seed,rx,rz,index);
   assert.equal(check.ok,true,JSON.stringify({seed,rx,rz,index,check}));
   assert.equal(check.proposedStairGeometryPass,true);
   assert.equal(check.conflicts,0);
   assert.ok(check.maximumStepRise<=1);
   assert.ok(check.candidateSupportCells>100);
   assert.ok(check.withinOriginalRegion);
   assert.equal(check.stepsActuallyPlaced,false);
   if(index===35){
    assert.equal(candidate.to.y,-7);
    assert.equal(candidate.remainingOriginalSocketRise,3);
    assert.equal(candidate.stopsBeforeProtectedSurface,true);
   }else{
    assert.deepEqual(candidate.to,plan.capsules[index].b);
    assert.equal(candidate.stopsBeforeProtectedSurface,false);
   }
  }
 }
});
test('proposed 3D tunnel volume is face-connected but still requires carving and source checks',()=>{
 const q=auditDetachedPedestrianSwitchback(179,0,0,16,
  {validateCandidateAir:true});
 assert.equal(q.ok,true);
 assert.equal(q.candidateRouteFaceConnected,true);
 assert.equal(q.caveVolumeActuallyCarved,false);
 assert.equal(q.originalM7ProtectionAudited,false);
});
test('invalid switchback coordinates, index and AIR flags refuse construction',()=>{
 assert.throws(()=>planDetachedPedestrianSwitchback(2147483648,0,0,16),/Invalid/);
 assert.throws(()=>planDetachedPedestrianSwitchback(179,0,0,10),/Invalid/);
 assert.throws(()=>auditDetachedPedestrianSwitchback(179,0,0,16,
  {validateCandidateAir:'true'}),/Invalid/);
});
