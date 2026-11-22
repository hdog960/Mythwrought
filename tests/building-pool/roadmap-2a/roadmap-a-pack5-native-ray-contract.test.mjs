import test from 'node:test';
import assert from 'node:assert/strict';
import {auditOriginalPack5GrazingRayEngineCrosswalk}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-native-ray-crosswalk-producer.mjs';
import {auditOriginalPack5LiveAdapterRayPrecedence}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-native-ray-occlusion-producer.mjs';
const sum=(rows,key)=>rows.reduce((s,row)=>s+row[key],0);
test('unmodified original fixture and canonical voxel-shape raycasters execute on 432 edge-neighbor probes',()=>{
 const r=auditOriginalPack5GrazingRayEngineCrosswalk();
 assert.equal(r.originalSourceCases,4);
 assert.equal(r.testOnlyInMemoryFixtures,4);
 assert.equal(r.analyticalRays,432);
 assert.equal(r.exactProbeCoordinateEvents,144);
 assert.equal(r.perturbedProbeCoordinateEvents,288);
 assert.equal(r.perOriginalVariantYaw.length,4);
 assert.equal(r.originalFixtureAndCanonicalColliderRaycastersExecuted,true);
 assert.equal(r.canonicalSelectionShapeCapExceededCases,4);
 assert.equal(r.canonicalRaycasterComparedOriginalFullCubeColliderNotManyBoxSelection,true);
 assert.equal(r.actualLiveGameWorldConstructed,false);
 assert.equal(r.originalPack5VariantYawChoicesForA5,false);
 assert.equal(r.permittedToPlaceActualWorldBlocks,false);
});
test('original brick yaw2/yaw3 edge witnesses cover both independent source variants with no invented selections',()=>{
 const r=auditOriginalPack5GrazingRayEngineCrosswalk();
 assert.deepEqual(r.perOriginalVariantYaw.map(x=>[x.explicitTestOnlyVariant,x.explicitTestOnlyYaw]),
  [['hearth-running-bond',2],['hearth-running-bond',3],
   ['kiln-soldier-course',2],['kiln-soldier-course',3]]);
 assert.ok(r.perOriginalVariantYaw.every(x=>x.rays===108&&x.testOnlyFixturePlaced&&
  x.originalSelectionFitsCanonicalShapeRegistry===false&&
  x.actualBuildingOrWorldPlacement===false&&x.sourceBoxCount>1&&x.meshTriangleCount>12));
 assert.equal(sum(r.perOriginalVariantYaw,'fixtureVsCollider'),
  r.originalFixtureVersusCanonicalColliderDisagreements);
 assert.equal(sum(r.perOriginalVariantYaw,'fixtureVsTriangles'),
  r.originalFixtureVersusTriangleDisagreements);
 assert.equal(sum(r.perOriginalVariantYaw,'colliderVsTriangles'),
  r.canonicalColliderVersusTriangleDisagreements);
 assert.ok(r.witnesses.length<=36);
});
test('original ray disagreements are preserved in independent fixture-versus-triangle census',()=>{
 const r=auditOriginalPack5GrazingRayEngineCrosswalk();
 assert.ok(r.originalFixtureVersusTriangleDisagreements>0,
  'previous original 88 source grazing disagreements should produce at least one focused near-edge case');
 assert.ok(r.originalFixtureVersusTriangleDisagreements<=432);
 for(const row of r.witnesses){
  assert.ok([2,3].includes(row.yaw));
  assert.ok(['hearth-running-bond','kiln-soldier-course'].includes(row.variant));
  assert.ok(row.edgeCoordinate>=0&&row.edgeCoordinate<=1);
  assert.ok(row.fixtureDistanceBlockUnits===null||Number.isFinite(row.fixtureDistanceBlockUnits));
  assert.ok(row.canonicalFullColliderDistanceBlockUnits===null||Number.isFinite(row.canonicalFullColliderDistanceBlockUnits));
  assert.ok(row.sourceTriangleDistanceBlockUnits===null||Number.isFinite(row.sourceTriangleDistanceBlockUnits));
 }
 assert.equal(r.sourceBoundaryDisagreementIsNotVerifiedGameplayBug,true);
});
test('original opt-in live adapter targets a synthetic brick without obstructing legacy terrain',()=>{
 const r=auditOriginalPack5LiveAdapterRayPrecedence();
 assert.equal(r.testOnlyReadOnlySyntheticWorldCases,4);
 const row=r.probes.find(x=>x.case==='unobstructed-front');
 assert.ok(row);
 assert.equal(row.originalLegacyHitCell,null);
 assert.ok(row.originalPack5VisibleSelectionDistance!==null);
 assert.equal(row.targetedPack5WithoutOriginalWorldPlacement,true);
 assert.equal(row.originalLiveAdapterButNotRunningGame,true);
 assert.equal(r.originalGameMainInputLoopExecuted,false);
});
test('authentic original voxel.raycast hides shaped furniture behind a front or rear legacy voxel',()=>{
 const r=auditOriginalPack5LiveAdapterRayPrecedence();
 const back=r.probes.find(x=>x.case==='legacy-obscures-rear-approach');
 const front=r.probes.find(x=>x.case==='legacy-front-face-occlusion-tie');
 assert.equal(back.originalPack5VisibleSelectionDistance,null);
 assert.equal(front.originalPack5VisibleSelectionDistance,null);
 assert.deepEqual(back.originalLegacyHitCell,[0,0,-1]);
 assert.deepEqual(front.originalLegacyHitCell,[0,0,1]);
 assert.ok(r.probes.every(x=>x.totalSourceWorldReadCalls>0));
 assert.equal(r.actualVoxelWorldMutated,false);
 assert.equal(r.actualSaveOrSchema1Written,false);
});
test('original live adapter gives closer Pack5 relief priority over more distant legacy terrain',()=>{
 const r=auditOriginalPack5LiveAdapterRayPrecedence();
 const row=r.probes.find(x=>x.case==='brick-closer-than-rear-legacy');
 assert.ok(row.originalPack5VisibleSelectionDistance<row.originalLegacyDistance);
 assert.deepEqual(row.originalLegacyHitCell,[0,0,-1]);
 assert.equal(row.originalPack5VisibleSelectionHitCell?.join(','),'0,0,0');
 assert.equal(r.originalA5MaterialYawAssigned,false);
 assert.equal(r.readyForProduction,false);
});
