import test from 'node:test';
import assert from 'node:assert/strict';
import {createRoadmapCFirstFortificationHandoffs} from '../../../src/building-pool/roadmap-3b/c-settlement-handoff.mjs';

test('C7 exports exact, immutable settlement-ready envelopes and physical occupancy fingerprints for 2 C source candidates',()=>{
 const initial=createRoadmapCFirstFortificationHandoffs();
 const again=createRoadmapCFirstFortificationHandoffs();
 assert.equal(initial.length,2);
 assert.deepEqual(initial,again);
 assert.deepEqual(initial.map(m=>m.id),[
  'r3:gatehouse:temperate:small:1','r3:city-wall:temperate:small:1'
 ]);
 for(const b of initial){
  assert.match(b.sourceFingerprint.value,/^[a-f0-9]{64}$/);
  assert.ok(b.sourceFingerprint.sourceVoxelCount>1000);
  assert.equal(b.sourceFingerprint.sourceVoxelCount,b.renderingAndCollision.sourceVoxelCount);
  assert.ok(b.occupiedFoundationFootprint.occupiedFootprintColumns>500);
  assert.ok(b.occupiedFoundationFootprint.width<=b.envelope.width);
  assert.ok(b.occupiedFoundationFootprint.depth<=b.envelope.depth);
  assert.equal(b.sourceOnly,true);
  assert.equal(b.approvedForProduction,false);
  assert.equal(b.registeredInGame,false);
  assert.equal(b.webgl2Evidence.verifiedCaptures,0);
  assert.equal(b.webgl2Evidence.galleryAcceptancePending,true);
  assert.equal(b.producerFit.manualFivePackPhysicalApproval,false);
  assert.ok(b.dependencies.length>=5);
  assert.ok(b.supportAudit.actualPhysicalStairVoxels>=8);
  assert.ok(b.gateway.clearRoute.length>=7);
  assert.ok(b.gateway.width>=2&&b.gateway.height>=3);
  assert.ok(Object.isFrozen(b));
 }
 assert.equal(new Set(initial.map(x=>x.sourceFingerprint.value)).size,2);
});
test('C7 wall exposes real 148-element defended ring and four source-corner interfaces; gatehouse exposes both road faces',()=>{
 const [gate,wall]=createRoadmapCFirstFortificationHandoffs();
 assert.equal(gate.closedPerimeter,null);
 assert.equal(gate.roadSockets.length,2);
 assert.equal(gate.wallJoinSockets.length,1);
 assert.equal(gate.gateway.sourceRouteLength,28);
 assert.equal(wall.defendedRampart.length,148);
 assert.equal(wall.closedPerimeter.length,5);
 assert.equal(wall.wallJoinSockets.length,4);
 assert.equal(wall.roadSockets.length,2);
 assert.equal(wall.gateway.sourceRouteLength,7);
 assert.deepEqual(wall.closedPerimeter[0],wall.closedPerimeter.at(-1));
});
