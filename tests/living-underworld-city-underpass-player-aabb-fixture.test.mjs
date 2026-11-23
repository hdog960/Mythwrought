import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,BODY_RADIUS,BODY_HEIGHT,collides}
 from '../src/voxel.mjs';
import {STEP_HEIGHT} from '../src/physics.mjs';
import {auditCandidateUnderpassPlayerAabb}
 from '../src/living-underworld/city-underpass-player-aabb-fixture.mjs';

const p=(x,y,z)=>({x,y,z});
const route=segments=>({ok:true,segments:segments.map(([a,b])=>({
 a:p(...a),b:p(...b),radius:3.8
}))});
const access=()=>route([[[0,-10,0],[10,-10,0]]]);
const straight=()=>route([[[10,-10,0],[20,-10,0]]]);
const input=()=>({accessProposal:access(),underpassProposal:straight(),
 centerSidePad:p(20,-10,0),floorY:-11});

test('physical fixture imports exact original player size and actual collider, not a new approximation',()=>{
 assert.equal(BODY_RADIUS,.28);
 assert.equal(BODY_HEIGHT,1.78);
 assert.equal(STEP_HEIGHT,1.01);
 assert.equal(BLOCK.AIR,0);
 assert.equal(collides({get:()=>BLOCK.AIR},.5,-10,.5),false);
 assert.equal(collides({get:()=>BLOCK.STONE},.5,-10,.5),true);
});

test('straight three-wide future deck and full-depth pad permit actual original player-sized AABB',()=>{
 const r=auditCandidateUnderpassPlayerAabb(input());
 assert.equal(r.ok,true);
 assert.equal(r.radius,.28);assert.equal(r.height,1.78);
 assert.equal(r.routeThreeWideSections,22);
 assert.equal(r.fullLandingFeet,9);
 assert.equal(r.sweptFlatEdges,21);
 assert.equal(r.skippedElevationEdges,0);
 assert.equal(r.sampledBodyPositions,257);
 assert.equal(r.groundProbes,257);
 assert.equal(r.originalCollidesFunctionUsed,true);
 assert.equal(r.outsideStagedClearanceConservativelySolid,true);
 assert.equal(r.realPlayerCollisionAndInstalledPwaNotApproved,true);
 assert.equal(r.noWorldWrites,true);
});

test('true 90-degree underpass junction preserves sealed three-wide player AABB clearance',()=>{
 const q={...input(),underpassProposal:route([
  [[10,-10,0],[15,-10,0]],[[15,-10,0],[15,-10,5]]
 ]),centerSidePad:p(15,-10,5)};
 const r=auditCandidateUnderpassPlayerAabb(q);
 assert.equal(r.ok,true);
 assert.equal(r.sweptFlatEdges,21);
 assert.equal(r.skippedElevationEdges,0);
});

test('diagonal underpass samples fractional real BODY_RADIUS near corners',()=>{
 const q={...input(),underpassProposal:route([
  [[10,-10,0],[15,-10,5]]
 ]),centerSidePad:p(15,-10,5)};
 const r=auditCandidateUnderpassPlayerAabb(q);
 assert.equal(r.ok,true);
 assert.equal(r.sweptFlatEdges,16);
 assert.equal(r.skippedElevationEdges,0);
 assert.equal(r.sampledBodyPositions,217);
});

test('seam mismatch blocks unconnected full body even with 3-wide voxel support in each separate segment',()=>{
 const r=auditCandidateUnderpassPlayerAabb({
  ...input(),underpassProposal:route([[[11,-10,0],[20,-10,0]]])
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'AABB_ACCESS_BRIDGE_OR_PAD_ENDPOINT_DISCONTINUITY');
 assert.equal(r.noWorldWrites,true);
});

test('no unproved source-budget truncation may pass body collision sampling',()=>{
 const r=auditCandidateUnderpassPlayerAabb({
  ...input(),maxCandidateCells:100
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'AABB_STAGED_VOXEL_BUDGET');
});

test('wrong center pad and floor elevation are independently fail-closed',()=>{
 const r=auditCandidateUnderpassPlayerAabb({
  ...input(),centerSidePad:p(21,-10,0)
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'AABB_ACCESS_BRIDGE_OR_PAD_ENDPOINT_DISCONTINUITY');
 assert.throws(()=>auditCandidateUnderpassPlayerAabb({
  ...input(),floorY:-12
 }),/Invalid original-game-player AABB fixture inputs/);
});

test('unsupported vertical-only step cannot be excused by the collision fixture',()=>{
 const r=auditCandidateUnderpassPlayerAabb({
  ...input(),underpassProposal:route([[[10,-10,0],[10,-9,0]]]),
  centerSidePad:p(10,-9,0),floorY:-10
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'ORIGINAL_THREE_WIDE_STAIR_GRADE_UNSAFE');
});

test('sample density must stay within bounded physical sweep resolution',()=>{
 assert.throws(()=>auditCandidateUnderpassPlayerAabb({
  ...input(),interpolationStep:.5
 }),/Invalid original-game-player AABB fixture inputs/);
 assert.throws(()=>auditCandidateUnderpassPlayerAabb({
  ...input(),interpolationStep:.01
 }),/Invalid original-game-player AABB fixture inputs/);
});

test('a proposed deck never implies old M7 geology, real stepPlayer stair traversal or installation',()=>{
 const r=auditCandidateUnderpassPlayerAabb(input());
 assert.equal(r.ok,true);
 assert.equal(r.noOriginalM7TerrainRead,true);
 assert.equal(r.noOriginalM7VoxelEdit,true);
 assert.equal(r.noNativeStepPlayerSimulation,true);
 assert.equal(r.existingAdditionalBlockShapeOverlaysNotSimulated,true);
 assert.equal(r.realPlayerCollisionAndInstalledPwaNotApproved,true);
});
