import test from 'node:test';
import assert from 'node:assert/strict';
import {auditThinUnderpassPedestrianConnectivity}
 from '../src/living-underworld/city-underpass-pedestrian-footgraph.mjs';

const pos=(x,y,z)=>({x,y,z});
const route=(segments)=>({ok:true,segments:segments.map(([a,b])=>({
 a:pos(...a),b:pos(...b),radius:3.8
}))});
const access=()=>route([[[0,-10,0],[10,-10,0]]]);
const bridge=()=>route([[[10,-10,0],[20,-10,0]]]);
const input=()=>({
 accessProposal:access(),underpassProposal:bridge(),
 centerSidePad:pos(20,-10,0),floorY:-11
});

test('independent source-only three-wide graph connects original approach through a thin bridge to nine pad feet',()=>{
 const r=auditThinUnderpassPedestrianConnectivity(input());
 assert.equal(r.ok,true);
 assert.equal(r.originalCityApproachThreeWideConnected,true);
 assert.equal(r.underpassAllThreeWideSectionsReached,true);
 assert.equal(r.centerSideLandingAllNineFootPositionsReached,true);
 assert.equal(r.fourNeighborFootstepsWithAtMostOneRiseVerified,true);
 assert.equal(r.fullWidthSections,22);
 assert.ok(r.accessToPadMinSteps>=20);
 assert.equal(r.originalM7VoxelSourceUnverified,true);
 assert.equal(r.actualThreeWidePlayerAabbCollisionUnverified,true);
 assert.equal(r.worldChanged,false);
});

test('a 90-degree bend retains side-to-side walkable foot-voxel connection',()=>{
 const r=auditThinUnderpassPedestrianConnectivity({
  accessProposal:access(),
  underpassProposal:route([
   [[10,-10,0],[15,-10,0]],
   [[15,-10,0],[15,-10,5]]
  ]),
  centerSidePad:pos(15,-10,5),floorY:-11
 });
 assert.equal(r.ok,true);
 assert.equal(r.centerSideLandingAllNineFootPositionsReached,true);
});

test('an endpoint shift that merely looks near the original landing is NOT accepted',()=>{
 const r=auditThinUnderpassPedestrianConnectivity({
  ...input(),
  underpassProposal:route([[[11,-10,0],[20,-10,0]]])
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_APPROACH_UNDERPASS_PAD_ENDPOINT_DISCONTINUITY');
});

test('a mismatched destination pad refuses even when the thin bridge has a sound centerline',()=>{
 const r=auditThinUnderpassPedestrianConnectivity({
  ...input(),centerSidePad:pos(21,-10,0)
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_APPROACH_UNDERPASS_PAD_ENDPOINT_DISCONTINUITY');
});

test('unwalkable rise between consecutive underpass steps is rejected by the real grade authority',()=>{
 const r=auditThinUnderpassPedestrianConnectivity({
  ...input(),underpassProposal:route([[[10,-10,0],[11,-6,0]]]),
  centerSidePad:pos(11,-6,0),floorY:-7
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'ORIGINAL_THREE_WIDE_GRADE_VETO');
});

test('a total voxel-mask budget never truncates a bridge and falsely claims connection',()=>{
 const r=auditThinUnderpassPedestrianConnectivity({
  ...input(),maxVoxelCells:100
 });
 assert.equal(r.ok,false);
 assert.ok(['WALKABLE_NETWORK_VOXEL_BUDGET',
  'COMBINED_UNDERPASS_AND_PAD_VOXEL_BUDGET'].includes(r.reason));
});

test('graph size budget must refuse rather than silently drop walkable nodes',()=>{
 const r=auditThinUnderpassPedestrianConnectivity({
  ...input(),maxWalkNodes:9
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'WALKABLE_NETWORK_NODE_BUDGET');
});

test('full landing-pad floor y mismatch is refused before any source or geometry',()=>{
 assert.throws(()=>auditThinUnderpassPedestrianConnectivity({
  ...input(),floorY:-12
 }),/Invalid read-only three-wide physical connectivity proof/);
});

test('a walking graph is not original M7 player collision, source authorization, or release',()=>{
 const r=auditThinUnderpassPedestrianConnectivity(input());
 assert.equal(r.ok,true);
 assert.equal(r.sourceTerrainNeverRead,undefined);
 assert.equal(r.originalM7VoxelSourceUnverified,true);
 assert.equal(r.actualThreeWidePlayerAabbCollisionUnverified,true);
 assert.equal(r.actualPlayerWalkingUnverified,true);
 assert.equal(r.renderGeometryAndGpuUnverified,true);
 assert.equal(r.worldChanged,false);
});
