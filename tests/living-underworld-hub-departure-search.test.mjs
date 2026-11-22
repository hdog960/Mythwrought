import test from 'node:test';
import assert from 'node:assert/strict';
import {searchWideProtectedEntrances}
 from '../src/living-underworld/entrance-candidate-search.mjs';
import {planUnderworldRegion}
 from '../src/living-underworld/worldwide-network.mjs';
import {planHubDepartingSurfaceEntrance}
 from '../src/living-underworld/surface-entrance-proposal.mjs';
import {auditSupportedEntranceStairs}
 from '../src/living-underworld/walkable-entrance-stairs.mjs';
import {compileMainGalleryPedestrianClearance,
 auditProposedSupportsAgainstMainGalleries}
 from '../src/living-underworld/combined-stair-footprints.mjs';
import {auditProtectedUnderworldWalkingChain}
 from '../src/living-underworld/protected-walking-chain.mjs';
const readers=Object.freeze({
 naturalAt:()=>3,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false
});
const sourceOptions=Object.freeze({
 surfaceHeightAt:()=>8,biomeAt:()=>'plains',requiredBiome:'plains',
 naturalAt:readers.naturalAt,authoredAt:readers.authoredAt,
 editedAt:readers.editedAt,existingLandmarkAt:readers.protectedAt
});
const historical=()=>searchWideProtectedEntrances(179,0,0,sourceOptions);
const stricter=()=>searchWideProtectedEntrances(179,0,0,{
 ...sourceOptions,avoidMainGalleryInterference:true
});
test('original 64-way search remains the unchanged two-segment historical proposal',()=>{
 const old=historical();
 assert.equal(old.ok,true);
 assert.deepEqual(old.accepted.proposal.mouth,{x:203,y:9,z:153});
 assert.equal(old.totalAttempts,1);
 assert.equal(old.accepted.proposal.segments.length,2);
 assert.equal('horizontalGalleryFilterApplied' in old,false);
 assert.deepEqual(Object.keys(old.accepted).sort(),
  ['envelope','geometry','proposal','stairs']);
});
test('protected optional hub exit retains the original mouth but avoids all 16 horizontal galleries',()=>{
 const before=historical(),after=stricter();
 assert.equal(after.ok,true);
 assert.equal(after.horizontalGalleryFilterApplied,true);
 assert.deepEqual(after.accepted.proposal.mouth,before.accepted.proposal.mouth);
 assert.deepEqual(after.accepted.proposal.start,before.accepted.proposal.start);
 assert.equal(after.totalAttempts,2);
 assert.equal(after.accepted.proposal.segments.length,3);
 assert.equal(after.accepted.proposal.hubDeparture.flatBlocks,4);
 assert.equal(after.accepted.envelope.ok,true);
 assert.equal(after.accepted.stairs.ok,true);
 assert.equal(after.accepted.geometry.pass,true);
 const index=compileMainGalleryPedestrianClearance(179,0,0);
 assert.equal(index.ok,true);
 assert.equal(index.inspect(before.accepted.proposal).blockedCells,18);
 assert.equal(index.inspect(after.accepted.proposal).blockedCells,0);
 assert.equal(index.pedestrianHorizontalPairsChecked,16);
 assert.equal(after.accepted.proposal.actualM7WorldUnmodified,true);
});
test('four-stage candidate chain rejects old hub route and accepts source-safe level departure',()=>{
 const old=auditProtectedUnderworldWalkingChain(179,0,0,{
  entrance:historical(),source:readers
 });
 assert.equal(old.ok,false);
 assert.equal(old.reason,'MAIN_GALLERY_CLEARANCE_BLOCKED');
 assert.ok(old.mainGalleryBlockedCells>0);
 const proposed=auditProtectedUnderworldWalkingChain(179,0,0,{
  entrance:stricter(),source:readers
 });
 assert.equal(proposed.ok,true,JSON.stringify(proposed));
 assert.equal(proposed.sourceProtectedRoutes,4);
 assert.equal(proposed.routeCount,4);
 assert.equal(proposed.mainGalleryBlockedCells,0);
 assert.equal(proposed.mainGalleryPairsChecked,16);
 assert.equal(proposed.stairsActuallyPlaced,false);
 assert.equal(proposed.realPlayerWalkingVerified,false);
});
test('fixed deep ore protection is never overridden by a caller-injected material allowlist',()=>{
 const proposed=auditProtectedUnderworldWalkingChain(179,0,0,{
  entrance:stricter(),source:{...readers,
   naturalAt:(x,y,z)=>y<-110?6:3,
   materialAllowed:()=>true
  }
 });
 assert.equal(proposed.ok,false);
 assert.equal(proposed.reason,'DEEP_LINKS_SOURCE_UNSAFE');
 assert.ok(proposed.connectors.some(c=>c.rejectsOreOrUnsafe>0));
 assert.equal(proposed.noOriginalWorldEdits,true);
});
test('old horizontal gallery support may not enter a new lower proposed corridor',()=>{
 const world=planUnderworldRegion(179,0,0);
 const lower=Object.freeze({ok:true,segments:[0,1].map(i=>{
  const v=world.capsules[i],lowerPoint=p=>({
   x:p.x,y:p.y-1,z:p.z
  });
  return {a:lowerPoint(v.a),b:lowerPoint(v.b),radius:v.radius};
 })});
 assert.equal(auditSupportedEntranceStairs(lower).ok,true);
 const index=compileMainGalleryPedestrianClearance(179,0,0);
 const q=index.inspect(lower);
 assert.equal(q.ok,false);
 assert.ok(q.examples.some(x=>x.type===
  'GALLERY_SUPPORT_IN_PROPOSED_HEADROOM'));
 const full=auditProposedSupportsAgainstMainGalleries(179,0,0,[lower]);
 assert.equal(full.ok,false);
 assert.equal(full.blockedCells,q.blockedCells);
 assert.equal(full.worldChanged,false);
});
test('protected hub departure rejects unsupported coordinates and stale shaped proposals',()=>{
 const old=historical().accepted.proposal;
 assert.throws(()=>planHubDepartingSurfaceEntrance(old,{bearing:8}),/Invalid/);
 assert.throws(()=>planHubDepartingSurfaceEntrance(old,{flatBlocks:0}),/Invalid/);
 assert.throws(()=>planHubDepartingSurfaceEntrance({...old,
  segments:[]}),/Invalid/);
 assert.equal(compileMainGalleryPedestrianClearance(179,0,0,{
  maxCells:1000}).ok,false);
});
