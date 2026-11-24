// Exact original author-source-only M7 upper mineral 34-block lateral
// excursion and return; original full-body physics, true author-air floor,
// original/candidate parity, and actual mined support veto. No repeat of
// prior standalone 120-step tests.
import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {originalM7UpperOwnedPhysicalFloor}
 from '../../src/manual-biomes/enchanted-original-upper-owner-walk-audit.mjs';
import {replayFullOriginalM7CaveAnchorWalk}
 from '../../src/manual-biomes/enchanted-original-full-anchor-continuity.mjs';
import {planOriginalM7UpperMineralSideReturn,
 surveyOriginalM7UpperMineralSideReturn}
 from '../../src/manual-biomes/enchanted-original-upper-mineral-lateral-return.mjs';
const seed=-88,names=['upper24-windcut','upper24-hollowbend'];
const make=(tree=false)=>new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 tree?{experimentalEnchantedTrees:true}:{});
const brief=x=>x.ok?{
  originalMainJunction:x.sourcePlan.realJunction,
  genuinelyAuthorOwnedSideEnd:x.sourcePlan.authenticSideEnd,
  sideSteps:x.sideSteps,
  outAndBack:x.sourcePlan.completeContinuousSourcePlan.originalSideBranchOutAndBack,
  actualRealPlayerTicks:x.realPlayer.ticks,
  physicallyCompletedLegs:x.realPlayer.walkedLegs,
  actualPlayerNetDescent:x.realPlayer.actualPlayerFeetDrop,
  signedChunkSeams:x.realPlayer.realChunkSeams,
  acceptedSidePath:x.physicallyVisitedOriginalVaultBranch,
  acceptedMainReturn:x.physicallyReturnedToOriginalUpperMain
}:x;
test('both real ORIGINAL upper galleries walk 34 authored lateral mineral cells, reverse, and finish original main 120 without player reset',()=>{
 const original=make(),trees=make(true),results=[];
 for(const name of names){
  const a=surveyOriginalM7UpperMineralSideReturn(original,name,{sideSteps:34});
  const b=surveyOriginalM7UpperMineralSideReturn(trees,name,{sideSteps:34});
  results.push({name,original:brief(a),prototype:brief(b)});
  assert.equal(a.ok,true,'source and true original player physics must authenticate lateral walk: '+JSON.stringify(brief(a)));
  assert.equal(b.ok,true,'experimental tree original cave physics parity: '+JSON.stringify(brief(b)));
  assert.deepEqual(a.sourcePlan.authenticSideEnd,b.sourcePlan.authenticSideEnd);
  assert.equal(a.realPlayer.ticks,b.realPlayer.ticks);
  assert.equal(a.realPlayer.walkedLegs,a.sourcePlan.completeContinuousSourcePlan.path.length-1);
  assert.equal(a.sourcePlan.completeContinuousSourcePlan.originalSideBranchOutAndBack,68);
  assert.equal(a.physicallyReturnedToOriginalUpperMain,true);
  assert.equal(a.physicallyFinishedOriginalUpperMain120,true);
  assert.equal(a.realPlayer.sourceAnchorActuallyWalked,true);
  assert.equal(a.wholeUpperNetworkAccepted,false);
 }
 console.log('# ENCHANTED ORIGINAL M7 TRUE UPPER AUTHOR MINERAL GALLERY 34 OUT AND BACK '+JSON.stringify({
  results,originalCaveWrites:0,originalPhysicsChanged:false,
  fullCaveBranchVolumeAccepted:false}));
 assert.deepEqual(original.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>trees.save(),/cannot be saved as historical M7/);
});
test('original author lateral mineral support mined to AIR rejects entire source-authentic walk without fabricating a corridor',()=>{
 const original=make();
 const p=planOriginalM7UpperMineralSideReturn(original,'upper24-windcut',{sideSteps:34});
 assert.equal(p.ok,true);
 const center=p.originalAuthenticatedSideFloors[20];
 assert.ok(originalM7UpperOwnedPhysicalFloor(original,'upper24-windcut',
  center.x,center.surface,center.z));
 assert.equal(original.set(center.x,center.surface,center.z,BLOCK.AIR),true);
 assert.equal(originalM7UpperOwnedPhysicalFloor(original,'upper24-windcut',
  center.x,center.surface,center.z),null);
 const r=replayFullOriginalM7CaveAnchorWalk(original,p.completeContinuousSourcePlan);
 assert.equal(r.ok,false);
 assert.equal(r.reason,'original-authored-source-was-edited');
 assert.equal(r.ticks,0);
 console.log('# ENCHANTED ORIGINAL M7 MINERAL SIDE FLOOR SOURCE EDIT VETO '+JSON.stringify({
  originalMinedSupport:[center.x,center.surface,center.z],
  originalPhysicsAfterEdit:r.ticks,realUserSaveUntouched:true}));
});
