// Original M7 Upper24 vaulted interior, exactly as authored by the old
// upperCaveCells ellipse, AFTER the physically verified 34-cell mineral
// side corridor. Unchanged real stepPlayer travels from outside through
// main and side branch, 5 owner-authored interior cells, return 5, reverse
// the 34-cell branch, and complete original main route step120.
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
const seed=-88;
const world=tree=>new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR),
 tree?{experimentalEnchantedTrees:true}:{});
test('genuine original upper Windcut and Hollowbend mineral VAULT interior 5 cells, return and finish main route in one player state',()=>{
 const original=world(false),prototype=world(true),cases=[];
 for(const name of ['upper24-windcut','upper24-hollowbend']){
  const a=surveyOriginalM7UpperMineralSideReturn(original,name,{
   sideSteps:34,vaultSteps:5});
  const b=surveyOriginalM7UpperMineralSideReturn(prototype,name,{
   sideSteps:34,vaultSteps:5});
  cases.push({name,original:{
   ok:a.ok,reason:a.reason??null,
   actuallyWalkedIntoVault:a.physicallyVisitedRealVaultInterior??false,
   actualTicks:a.realPlayer?.ticks??null,
   realVaultEndpoint:a.sourcePlan?.authenticVaultInteriorEnd??null,
   physicalLegs:a.realPlayer?.walkedLegs??null,
   signedChunkSeams:a.realPlayer?.realChunkSeams??null
   },experimental:{ok:b.ok,actualTicks:b.realPlayer?.ticks??null}});
  assert.equal(a.ok,true,'original old-source cavern room must truly physically permit a 5-cell excursion: '+JSON.stringify(a));
  assert.equal(b.ok,true);
  assert.equal(a.physicallyVisitedRealVaultInterior,true);
  assert.equal(a.physicallyReturnedToOriginalUpperMain,true);
  assert.equal(a.physicallyFinishedOriginalUpperMain120,true);
  assert.equal(a.sourcePlan.originalAuthenticatedVaultInteriorFloors.length,5);
  assert.equal(a.sourcePlan.completeContinuousSourcePlan.originalVaultRoomOutAndBack,10);
  assert.equal(a.realPlayer.ticks,b.realPlayer.ticks);
  assert.equal(a.realPlayer.walkedLegs,a.sourcePlan.completeContinuousSourcePlan.path.length-1);
  assert.equal(a.wholeUpperNetworkAccepted,false);
 }
 console.log('# ENCHANTED ORIGINAL M7 UPPER AUTHORED MINERAL VAULT ROOM OUT AND BACK REAL PHYSICS '+JSON.stringify({
  cases,actualOriginalCaveWrites:0,roomEntireVolumeNotClaimed:true}));
 assert.deepEqual(original.save(),{schema:1,seed,edits:[]});
 assert.throws(()=>prototype.save(),/cannot be saved as historical M7/);
});
test('mining a truly original VAULT interior support blocks complete precomputed source route with zero player ticks',()=>{
 const w=world(false),p=planOriginalM7UpperMineralSideReturn(w,
  'upper24-hollowbend',{sideSteps:34,vaultSteps:5});
 assert.equal(p.ok,true);
 const v=p.originalAuthenticatedVaultInteriorFloors.at(-1);
 assert.deepEqual([v.x,v.surface,v.z],p.authenticVaultInteriorEnd);
 assert.ok(originalM7UpperOwnedPhysicalFloor(w,'upper24-hollowbend',
  v.x,v.surface,v.z));
 assert.equal(w.set(v.x,v.surface,v.z,BLOCK.AIR),true);
 assert.equal(originalM7UpperOwnedPhysicalFloor(w,'upper24-hollowbend',
  v.x,v.surface,v.z),null);
 const denied=replayFullOriginalM7CaveAnchorWalk(w,p.completeContinuousSourcePlan);
 assert.equal(denied.ok,false);
 assert.equal(denied.reason,'original-authored-source-was-edited');
 assert.equal(denied.ticks,0);
 console.log('# ENCHANTED ORIGINAL UPPER MINERAL REAL VAULT FLOOR AIR MINING VETO '+JSON.stringify({
  originalAuthorVoxel:[v.x,v.surface,v.z],acceptedPhysicsTicksAfterEdit:denied.ticks,
  userWorldSavesUntouched:true}));
});
