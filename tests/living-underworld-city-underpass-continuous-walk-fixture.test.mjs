import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,BODY_RADIUS,BODY_HEIGHT,collides} from '../src/voxel.mjs';
import {WALK_SPEED,STEP_HEIGHT,stepPlayer} from '../src/physics.mjs';
import {auditCandidateUnderpassContinuousStepPlayer}
 from '../src/living-underworld/city-underpass-continuous-walk-fixture.mjs';
const p=(x,y,z)=>({x,y,z});
const route=(...points)=>({ok:true,segments:points.slice(1).map((b,i)=>({
 a:p(...points[i]),b:p(...b),radius:3.8
}))});
const sample=(height=-10,kind='direct')=>({
 accessProposal:route([0,-10,0],[10,-10,0]),
 underpassProposal:kind==='corner'?
  route([10,-10,0],[15,height,0],[15,height,5]):
  route([10,-10,0],[20,height,kind==='diagonal'?10:0]),
 centerSidePad:kind==='corner'?p(15,height,5):
  p(20,height,kind==='diagonal'?10:0),
 floorY:height-1
});
test('actual original game movement functions and constants are required',()=>{
 assert.equal(BODY_RADIUS,.28);assert.equal(BODY_HEIGHT,1.78);
 assert.equal(STEP_HEIGHT,1.01);assert.equal(WALK_SPEED,4.25);
 assert.equal(BLOCK.AIR,0);
 assert.equal(typeof stepPlayer,'function');
 assert.equal(collides({get:()=>BLOCK.STONE},.5,-10,.5),true);
});
test('complete flat forward and reverse crossing never resets between waypoints',()=>{
 const r=auditCandidateUnderpassContinuousStepPlayer(sample());
 assert.equal(r.ok,true);
 assert.equal(r.routeWaypoints,21);
 assert.equal(r.gradeElevationEdges,0);
 assert.equal(r.totalFrames,568);
 assert.equal(r.directions[0].frames,284);
 assert.equal(r.directions[1].frames,284);
 assert.equal(r.completeForwardAndReverseWithoutPositionReset,true);
 assert.equal(r.originalStepPlayerExecuted,true);
 assert.equal(r.noWorldWrites,true);
});
test('continuous real controller rises and descends across a one-block step',()=>{
 const r=auditCandidateUnderpassContinuousStepPlayer(sample(-9));
 assert.equal(r.ok,true);
 assert.equal(r.gradeElevationEdges,1);
 assert.equal(r.totalFrames,588);
 assert.equal(r.stepEvents,1);
 assert.equal(r.landings,1);
 assert.equal(r.directions[0].waypointsReached,20);
 assert.equal(r.directions[1].waypointsReached,20);
});
test('two original voxel height changes remain traversable continuously both ways',()=>{
 const r=auditCandidateUnderpassContinuousStepPlayer(sample(-8));
 assert.equal(r.ok,true);
 assert.equal(r.gradeElevationEdges,2);
 assert.equal(r.totalFrames,607);
 assert.equal(r.stepEvents,2);
 assert.equal(r.landings,2);
});
test('real axis-separated player movement handles original right-angle joint',()=>{
 const r=auditCandidateUnderpassContinuousStepPlayer(sample(-10,'corner'));
 assert.equal(r.ok,true);
 assert.equal(r.routeWaypoints,21);
 assert.equal(r.totalFrames,573);
});
test('real diagonal steering and falling do not teleport through the stair',()=>{
 const r=auditCandidateUnderpassContinuousStepPlayer(sample(-9,'diagonal'));
 assert.equal(r.ok,true);
 assert.equal(r.gradeElevationEdges,1);
 assert.equal(r.totalFrames,705);
 assert.equal(r.stepEvents,1);assert.equal(r.landings,1);
});
test('too few frames per waypoint refuse instead of inventing motion',()=>{
 const r=auditCandidateUnderpassContinuousStepPlayer({
  ...sample(-9),maxFramesPerWaypoint:10
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CONTINUOUS_PHYSICS_WAYPOINT_UNREACHABLE');
 assert.equal(r.physicsInvoked,true);
 assert.equal(r.noWorldWrites,true);
});
test('independent aggregate frame and path bounds refuse before unbounded work',()=>{
 const r=auditCandidateUnderpassContinuousStepPlayer({
  ...sample(),maxTotalFrames:20
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CONTINUOUS_TOTAL_FRAME_BUDGET');
 const w=auditCandidateUnderpassContinuousStepPlayer({
  ...sample(),maxWaypoints:2
 });
 assert.equal(w.ok,false);
 assert.equal(w.reason,'CONTINUOUS_WAYPOINT_BUDGET');
 assert.equal(w.physicsInvoked,false);
});
test('failed AABB seam and invalid grade never reach original player movement',()=>{
 const seam=auditCandidateUnderpassContinuousStepPlayer({
  ...sample(),underpassProposal:route([11,-10,0],[20,-10,0])
 });
 assert.equal(seam.ok,false);
 assert.equal(seam.reason,'CONTINUOUS_PRECONDITION_AABB_REFUSED');
 assert.equal(seam.physicsInvoked,false);
 const vertical=auditCandidateUnderpassContinuousStepPlayer({
  ...sample(),underpassProposal:route([10,-10,0],[10,-9,0]),
  centerSidePad:p(10,-9,0),floorY:-10
 });
 assert.equal(vertical.ok,false);
 assert.equal(vertical.reason,'CONTINUOUS_PRECONDITION_AABB_REFUSED');
});
test('invalid physically meaningful bounds are rejected',()=>{
 assert.throws(()=>auditCandidateUnderpassContinuousStepPlayer({
  ...sample(),frameDt:.2
 }),/Invalid original continuous stepPlayer research fixture/);
 assert.throws(()=>auditCandidateUnderpassContinuousStepPlayer({
  ...sample(),maxWaypoints:1000
 }),/Invalid original continuous stepPlayer research fixture/);
 assert.throws(()=>auditCandidateUnderpassContinuousStepPlayer({
  ...sample(),maxTotalFrames:20000
 }),/Invalid original continuous stepPlayer research fixture/);
 assert.throws(()=>auditCandidateUnderpassContinuousStepPlayer({
  ...sample(),floorY:-20
 }),/Invalid original continuous stepPlayer research fixture/);
});
test('identical staged inputs are deterministic and neither real-world nor PWA certified',()=>{
 const a=auditCandidateUnderpassContinuousStepPlayer(sample(-9));
 const b=auditCandidateUnderpassContinuousStepPlayer(sample(-9));
 assert.deepEqual(a,b);
 assert.equal(a.authenticOriginalM7WorldTested,false);
 assert.equal(a.realWorldWalkabilityProven,false);
 assert.equal(a.installedHomeScreenPwaTested,false);
 assert.equal(a.sourceMaterialAndOwnershipNotAuditedHere,true);
 assert.equal(a.livePack2Biome130Pack3Pack5NonblockCollidersNotSimulated,true);
 assert.equal(a.originalWorldModified,false);
});
