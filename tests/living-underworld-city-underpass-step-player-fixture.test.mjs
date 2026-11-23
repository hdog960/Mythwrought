import test from 'node:test';
import assert from 'node:assert/strict';
import {STEP_HEIGHT,stepPlayer} from '../src/physics.mjs';
import {BLOCK,BODY_RADIUS,BODY_HEIGHT,collides} from '../src/voxel.mjs';
import {auditCandidateUnderpassStepPlayer}
 from '../src/living-underworld/city-underpass-step-player-fixture.mjs';
const p=(x,y,z)=>({x,y,z});
const route=(...points)=>({ok:true,segments:points.slice(1).map((b,i)=>({
 a:p(...points[i]),b:p(...b),radius:3.8
}))});
const given=(height=-9,diagonal=false)=>({
 accessProposal:route([0,-10,0],[10,-10,0]),
 underpassProposal:diagonal?
  route([10,-10,0],[20,height,10]):
  route([10,-10,0],[20,height,0]),
 centerSidePad:p(20,height,diagonal?10:0),floorY:height-1
});
test('original game control constants and actual module contracts remain required',()=>{
 assert.equal(BODY_RADIUS,.28);assert.equal(BODY_HEIGHT,1.78);
 assert.equal(STEP_HEIGHT,1.01);assert.equal(BLOCK.AIR,0);
 assert.equal(typeof stepPlayer,'function');
 assert.equal(collides({get:()=>BLOCK.STONE},.5,-10,.5),true);
});
test('sealed one-rise stair traverses both directions without teleporting or jumping',()=>{
 const r=auditCandidateUnderpassStepPlayer(given());
 assert.equal(r.ok,true);
 assert.equal(r.elevationEdges,1);
 assert.equal(r.forwardChecks,1);assert.equal(r.reverseChecks,1);
 assert.equal(r.totalFrames,49);assert.equal(r.totalStepEvents,1);
 assert.equal(r.actualOriginalStepPlayerInvoked,true);
 assert.equal(r.outsideStagedClearanceConservativelySolid,true);
 assert.equal(r.originalM7SourceAuthenticated,false);
 assert.equal(r.genuineWorldWalkingProven,false);
 assert.equal(r.noWorldWrites,true);
});
test('two distinct one-cell steps get four bidirectional real stepPlayer traversals',()=>{
 const r=auditCandidateUnderpassStepPlayer(given(-8));
 assert.equal(r.ok,true);assert.equal(r.elevationEdges,2);
 assert.equal(r.forwardChecks,2);assert.equal(r.reverseChecks,2);
 assert.equal(r.totalFrames,98);assert.equal(r.totalStepEvents,2);
});
test('real diagonal movement is independently traversed in both directions',()=>{
 const r=auditCandidateUnderpassStepPlayer(given(-9,true));
 assert.equal(r.ok,true);assert.equal(r.elevationEdges,1);
 assert.equal(r.forwardChecks,1);assert.equal(r.reverseChecks,1);
 assert.equal(r.totalFrames,60);
});
test('fully flat candidate cannot claim original stepPlayer actually ran',()=>{
 const r=auditCandidateUnderpassStepPlayer(given(-10));
 assert.equal(r.ok,true);assert.equal(r.elevationEdges,0);
 assert.equal(r.actualOriginalStepPlayerInvoked,false);
 assert.equal(r.originalCollidesUsedForEveryMovementFrame,false);
 assert.equal(r.totalFrames,0);
});
test('tight but allowed frame limit refuses premature collision-only success',()=>{
 const r=auditCandidateUnderpassStepPlayer({
  ...given(),maxFramesPerEdge:12
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'STEP_ORIGINAL_MOVEMENT_DID_NOT_REACH_TARGET');
 assert.equal(r.edgeIndex,15);assert.equal(r.direction,'forward');
 assert.equal(r.frames,12);assert.equal(r.noWorldWrites,true);
});
test('bounded elevation-edge budget refuses without invoking physics',()=>{
 const r=auditCandidateUnderpassStepPlayer({
  ...given(-8),maxElevationEdges:1
 });
 assert.equal(r.ok,false);assert.equal(r.reason,'STEP_GRADE_EDGE_BUDGET');
 assert.equal(r.elevationEdges,2);
});
test('bad seam and unsupported vertical-only move remain refused by original AABB gate',()=>{
 const wrong=auditCandidateUnderpassStepPlayer({
  ...given(),underpassProposal:route([11,-10,0],[20,-9,0])
 });
 assert.equal(wrong.ok,false);assert.equal(wrong.reason,'STEP_REQUIRES_ORIGINAL_AABB_PASS');
 const vertical=auditCandidateUnderpassStepPlayer({
  ...given(),underpassProposal:route([10,-10,0],[10,-9,0]),
  centerSidePad:p(10,-9,0)
 });
 assert.equal(vertical.ok,false);
 assert.equal(vertical.reason,'STEP_REQUIRES_ORIGINAL_AABB_PASS');
});
test('nonsensical time slice, invalid pad height or excessive budgets throw before simulation',()=>{
 assert.throws(()=>auditCandidateUnderpassStepPlayer({
  ...given(),frameDt:.1
 }),/Invalid original-stepPlayer sealed fixture inputs/);
 assert.throws(()=>auditCandidateUnderpassStepPlayer({
  ...given(),maxFramesPerEdge:1000
 }),/Invalid original-stepPlayer sealed fixture inputs/);
 assert.throws(()=>auditCandidateUnderpassStepPlayer({
  ...given(),floorY:-99
 }),/Invalid original-stepPlayer sealed fixture inputs/);
});
test('repeatable read-only results do not authenticate old caves, world placement or PWA',()=>{
 const a=auditCandidateUnderpassStepPlayer(given());
 const b=auditCandidateUnderpassStepPlayer(given());
 assert.deepEqual(a,b);
 assert.equal(a.worldChanged,false);
 assert.equal(a.genuineWorldWalkingProven,false);
 assert.equal(a.installedPwaAccepted,false);
 assert.equal(a.existingBlockShapeOverlaysNotSimulated,true);
});
