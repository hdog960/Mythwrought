import test from 'node:test';
import assert from 'node:assert/strict';
import {searchWideProtectedEntrances}
 from '../src/living-underworld/entrance-candidate-search.mjs';
import {auditProtectedUnderworldWalkingChain}
 from '../src/living-underworld/protected-walking-chain.mjs';
import {auditProtectedSubsurfaceStairs}
 from '../src/living-underworld/protected-subsurface-stairs.mjs';
import {selectSourceProtectedInterlevelRamps}
 from '../src/living-underworld/source-aware-ramp-selection.mjs';
import {planDetachedPedestrianSwitchback}
 from '../src/living-underworld/pedestrian-switchback.mjs';
const stone=Object.freeze({naturalAt:()=>3,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false});
const entrance=()=>searchWideProtectedEntrances(179,0,0,{
 surfaceHeightAt:()=>8,biomeAt:()=>'plains',requiredBiome:'plains',
 naturalAt:stone.naturalAt,authoredAt:stone.authoredAt,
 editedAt:stone.editedAt,existingLandmarkAt:stone.protectedAt
});
test('surface mouth to lowest depth is source-checkable and cross-route clearance-safe as a dry run',()=>{
 const entry=entrance();
 assert.equal(entry.ok,true);
 const out=auditProtectedUnderworldWalkingChain(179,0,0,{
  entrance:entry,source:stone
 });
 // Three mutually safe stairs do NOT yet imply preserved horizontal galleries.
 assert.equal(out.ok,false,JSON.stringify(out));
 assert.equal(out.reason,'MAIN_GALLERY_CLEARANCE_BLOCKED');
 assert.ok(out.mainGalleryBlockedCells>0);
 assert.equal(out.mainGalleryPairsChecked,16);
 assert.equal(out.routeCount,4);
 assert.equal(out.sourceProtectedRoutes,4);
 assert.equal(out.combinedNetworkSupportAndHeadroomSafe,true);
 assert.equal(out.combinedStairwayCollisions,0);
 assert.ok(out.originalM7SourceChecks>6000);
 assert.equal(out.stairsActuallyPlaced,false);
 assert.equal(out.realPlayerWalkingVerified,false);
});
test('old deep ore cannot be authorized by expanding the material whitelist',()=>{
 const entry=entrance();
 const out=auditProtectedUnderworldWalkingChain(179,0,0,{
  entrance:entry,source:{...stone,naturalAt:(x,y,z)=>y<-110?6:3,
   materialAllowed:()=>true}
 });
 assert.equal(out.ok,false);
 assert.ok(out.connectors.some(c=>c.rejectsOreOrUnsafe>0));
 assert.ok(out.originalM7SourceChecks<=30000+20000);
 assert.equal(out.noOriginalWorldEdits,true);
});
test('source AIR at a shared hub fails closed without filling original passages',()=>{
 const q=selectSourceProtectedInterlevelRamps(179,0,0,{
  source:{...stone,naturalAt:(x,y,z)=>
   x===119&&y===-26&&z===153?0:3,
   authoredAt:(x,y,z)=>x===119&&y===-26&&z===153?0:undefined}
 });
 assert.equal(q.ok,false);
 assert.ok(q.sourceRejected>0);
 assert.ok(q.sourceCellsChecked<=q.maxSourceChecks+20000);
 assert.equal(q.noWorldEdits,true);
});
test('early-stop protection cannot report success and preserves source refusal',()=>{
 const p=planDetachedPedestrianSwitchback(179,0,0,16,{radius:14,cornerFlat:6});
 const full=auditProtectedSubsurfaceStairs(p,{naturalAt:()=>6});
 const fast=auditProtectedSubsurfaceStairs(p,{naturalAt:()=>6,
  stopOnFirstUnsafe:true});
 assert.equal(full.ok,false);
 assert.equal(fast.ok,false);
 assert.equal(fast.haltedEarly,true);
 assert.equal(fast.firstRefusal,'UNSAFE_MATERIAL');
 assert.ok(fast.sourceChecks<full.sourceChecks);
 assert.equal(fast.sourceTerrainNeverWritten,true);
});
test('source readers and work budget remain validated and bounded',()=>{
 assert.throws(()=>selectSourceProtectedInterlevelRamps(179,0,0,{
  source:{naturalAt:()=>3,materialAllowed:()=>true}
 }),/Invalid/);
 assert.throws(()=>selectSourceProtectedInterlevelRamps(179,0,0,{
  source:stone,maxSourceChecks:100
 }),/Invalid/);
});

test('direct provenance audit cannot substitute an ore-friendly geology whitelist or out-of-world bounds',()=>{
 const p=planDetachedPedestrianSwitchback(179,0,0,16,{
  radius:14,cornerFlat:6
 });
 assert.throws(()=>auditProtectedSubsurfaceStairs(p,{
  naturalAt:()=>6,materialAllowed:()=>true
 }),/Invalid/);
 assert.throws(()=>auditProtectedSubsurfaceStairs(p,{
  naturalAt:()=>3,minY:-999,maxY:999
 }),/Invalid/);
});

test('localized historic landmark on first ramp selects a different source-safe geometry',()=>{
 const first=planDetachedPedestrianSwitchback(179,0,0,16,{
  radius:14,cornerFlat:6,quarterTurns:0
 });
 const hit=first.segments[0].b;
 const q=selectSourceProtectedInterlevelRamps(179,0,0,{
  source:{...stone,protectedAt:(x,y,z)=>
   x===hit.x&&y===hit.y&&z===hit.z}
 });
 assert.equal(q.ok,true,JSON.stringify(q));
 assert.ok(q.sourceRejected>0);
 assert.equal(q.approvedLinkCount,3);
 assert.ok(q.links[0].selected.quarterTurns!==0||
  q.links[0].selected.radius!==14);
 assert.equal(q.combined.crossRouteBlockedCells,0);
 assert.equal(q.noWorldEdits,true);
});
test('a strict global source audit budget fails closed even for otherwise benign geology',()=>{
 const q=selectSourceProtectedInterlevelRamps(179,0,0,{
  source:stone,maxSourceChecks:1000
 });
 assert.equal(q.ok,false);
 assert.equal(q.refusal,'SOURCE_AUDIT_WORK_BUDGET');
 assert.equal(q.noWorldEdits,true);
 assert.equal(q.stepsActuallyPlaced,false);
});
