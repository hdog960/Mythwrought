import test from 'node:test';
import assert from 'node:assert/strict';
import {orientedParts} from '../../../src/block-packs/pack-5/fixture.mjs';
import {
 ORIGINAL_HEARTH_YAW3_SOURCE,buildOriginalHearthYaw3ReadOnlyLayer,
 attestOriginalHearthYaw3AllGpuVerticesBelongToAuthoredBoxCorners,
 attestUnchangedOriginalHearthYaw3Producer,
 auditOriginalHearthYaw3StrictWorldRayGrid
} from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-hearth-yaw3-strict-world-ray-audit.mjs';

const out=auditOriginalHearthYaw3StrictWorldRayGrid();

test('unmodified original real meshAt, ray normalization, terrain occlusion and six-block source contracts',()=>{
 const c=attestUnchangedOriginalHearthYaw3Producer();
 assert.equal(c.authenticatedOriginalSourceContracts,8);
 assert.equal(c.originalRuntimeRendererMeshAtSelected,true);
 assert.equal(c.originalTerrainOcclusionGateSourcePreserved,true);
 assert.equal(c.originalMaxReachUnchanged,true);
});
test('only one genuine original HEARTH variant/yaw THREE, never an A5 authoring decision',()=>{
 const c=ORIGINAL_HEARTH_YAW3_SOURCE;
 assert.equal(c.symbol,'pack5:080');
 assert.equal(c.variant,'hearth-running-bond');
 assert.equal(c.rotation,3);
 assert.deepEqual([...c.anchor],[3,14,0]);
 assert.deepEqual([...c.originalR3EyeOnlyAsResearchPose],[.5,13.55,.5]);
 assert.equal(c.maxDistance,6);
 assert.equal(c.sourceOnlyNoA5VariantOrYawDecision,true);
 assert.equal(out.identity.sourceVariant,c.variant);
 assert.equal(out.identity.researchYaw,3);
 assert.equal(out.identity.samePoseAsR3ButNewVariant,true);
});
test('original construction layer creates one nonpersistent original brick and yields genuine GPU-world Float32 vertices',()=>{
 const s=buildOriginalHearthYaw3ReadOnlyLayer();
 assert.equal(s.layer.count(),1);
 assert.equal(s.inMemoryOriginalPack5Count,1);
 assert.equal(s.asset.descriptor.variant,'hearth-running-bond');
 assert.equal(s.originalParts[0].collisionBoxes.length,1);
 assert.deepEqual(s.originalParts[0].collisionBoxes[0],[0,0,0,1,1,1]);
 assert.equal(s.trueWorldStage.constructor,Float32Array);
 assert.equal(s.trueWorldStage.length,s.localStage.length);
 assert.equal(s.independentOriginalGpuWorldXYZDifferences,0);
 assert.ok(s.trueWorldStage.byteLength>0&&s.trueWorldStage.byteLength<=384*1024);
 assert.ok(s.trueWorldStage.length/9===36*s.boxes.length);
 assert.equal(s.getReadCount()>0,true);
});
test('EVERY original world-F32 triangle vertex belongs to a face corner of exactly its source-owned rotated box',()=>{
 const s=buildOriginalHearthYaw3ReadOnlyLayer();
 const c=attestOriginalHearthYaw3AllGpuVerticesBelongToAuthoredBoxCorners(s);
 assert.equal(c.sourceAuthoredBoxCount,s.boxes.length);
 assert.equal(c.actualWorldGpuVerticesChecked,s.trueWorldStage.length/9);
 assert.equal(c.actualWorldGpuTriangleCount,s.trueWorldStage.length/27);
 assert.equal(c.originalBoxAndWorldFloat32FaceEndpointsIdentical,true);
 assert.equal(out.actualWorldGpuVerticesChecked,c.actualWorldGpuVerticesChecked);
 assert.equal(out.actualWorldGpuTriangleCount,c.actualWorldGpuTriangleCount);
});
test('research yaw THREE truly alters originally-authored wall face orientation versus prior yaw TWO',()=>{
 const s=buildOriginalHearthYaw3ReadOnlyLayer();
 const old=orientedParts(s.asset.descriptor,2);
 assert.notDeepEqual(old.map(p=>p.boxes),s.originalParts.map(p=>p.boxes));
 assert.equal(old[0].boxes.length,s.originalParts[0].boxes.length);
 assert.ok(s.originalParts[0].boxes.some(b=>b[0]===0));
});
test('source-driven Y/Z grid samples are bounded without hardcoding invented future ray counts',()=>{
 assert.ok(out.sourceRayGrid.yLevels>=10&&out.sourceRayGrid.yLevels<=30);
 assert.ok(out.sourceRayGrid.zLevels>=10&&out.sourceRayGrid.zLevels<=30);
 assert.deepEqual(out.sourceRayGrid.sourceOffsets,[-.000002,0,.000002]);
 assert.equal(out.sourceRayGrid.exactRayCount,out.sourceRayGrid.yLevels*out.sourceRayGrid.zLevels*3);
 assert.equal(out.rays,out.sourceRayGrid.exactRayCount);
 assert.ok(out.rays>=300&&out.rays<=2700);
 assert.equal(out.originalLiveLayerCount,1);
});
test('original live construction-layer selection and independently-normalized physical authored box ray agree for entire new grid',()=>{
 assert.equal(out.originalAndIndependentBoxDistanceDisagreements,0);
 assert.equal(out.bothStrictAndDetailedHits+out.bothStrictAndDetailedMisses+
  out.strictTriangleOnlySelectionMisses+out.detailedSelectionOnlyAgainstStrict,out.rays);
 assert.equal(out.strictTriangleHits,out.bothStrictAndDetailedHits+
  out.strictTriangleOnlySelectionMisses);
 assert.ok(out.strictTriangleHits<=out.rays);
 assert.ok(out.tolerantTriangleHits<=out.rays);
 assert.ok(out.originalDetailedHits<=out.rays);
 assert.equal(out.actualOriginalConstructionLayerWorldFloat32,true);
});
test('if strict gaps exist, each is a literal ORIGINAL Float32 triangle intersection with no detailed hit, not relaxed epsilon-only',()=>{
 assert.equal(out.firstStrictGaps.length,Math.min(out.strictTriangleOnlySelectionMisses,12));
 assert.ok(out.firstStrictGaps.every(w=>w.originalSourceSelectionDistance===null&&
  Number.isFinite(w.strictTriangleDistance)&&w.strictTriangleDistance<=6&&
  w.strictMinimumBarycentric>=0&&
  Number.isFinite(w.nearestOriginalAuthoredBoxSeparation)&&
  w.nearestOriginalAuthoredBoxSeparation>=0&&
  w.triangleIndex>=0));
 assert.ok(out.strictGapWithMarginAtLeast1e5<=out.strictTriangleOnlySelectionMisses);
 assert.ok(out.strictGapWithBoxSeparationOver1e5<=out.strictTriangleOnlySelectionMisses);
 assert.ok(out.firstSourceHitDistanceWarnings.length<=12);
 console.log('ROADMAP_A_NEW_HEARTH_YAW3_TRUE_RENDERER_STRICT_RAY_COUNTS '+JSON.stringify({
  identity:out.identity,originalPartBoxes:out.sourceAuthoredOriginalPartBoxes,
  originalGPUVertices:out.actualWorldGpuVerticesChecked,
  gpuBytes:out.originalOnePageGpuBytes,grid:out.sourceRayGrid,
  sourceCounts:{rays:out.rays,strictTriangleHits:out.strictTriangleHits,
   detailedSelectionHits:out.originalDetailedHits,
   strictTriangleOnlySelectionMisses:out.strictTriangleOnlySelectionMisses,
   strictDistanceWarnings:out.strictDistanceWarningsOver2e7,
   originalStrictMarginPositive:out.strictGapWithMarginAtLeast1e5,
   originalRealSpatialGap:out.strictGapWithBoxSeparationOver1e5,
   relaxedOnlySelectionMisses:out.sourceToleranceOnlySelectionMisses,
   trueOriginalRayVsIndependentBoxDisagreement:out.originalAndIndependentBoxDistanceDisagreements},
  firstStrictWitnesses:out.firstStrictGaps.slice(0,5),
  firstToleranceOnly:out.firstToleranceOnly.slice(0,5),
  firstDistanceWarnings:out.firstSourceHitDistanceWarnings.slice(0,3),
  actualGpuRasterExecuted:false
 }));
});
test('permissive source-only ray hits remain separate from strict real mesh hits and are not turned into false production bugs',()=>{
 assert.ok(out.sourceToleranceOnlySelectionMisses<=out.rays);
 assert.ok(out.firstToleranceOnly.every(w=>
  w.relaxedTriangleDistance>=0&&w.negativeBarycentricMargin<0&&
  w.negativeBarycentricMargin>=-1e-7));
 assert.equal(out.firstToleranceOnly.length,Math.min(12,out.sourceToleranceOnlySelectionMisses));
});
test('six-block reach, original air-occlusion contract and valid center/away controls hold in source-only host',()=>{
 assert.ok(Number.isFinite(out.originalSelectionCenteredRayDistance));
 assert.ok(out.originalSelectionCenteredRayDistance>0&&out.originalSelectionCenteredRayDistance<=6);
 assert.equal(out.originalSelectionAimAwayDistance,null);
 assert.ok(out.originalReadOnlyWorldGetCount>0);
 assert.equal(out.realWorldTerrainOcclusionTested,false);
});
test('no original world, production shader, player renderer or actual iPhone use can be implied by this source-native experiment',()=>{
 assert.equal(out.originalUserWorldReadOrWritten,false);
 assert.equal(out.sourceOnlyMathNotActualGpuPixelProof,true);
 assert.equal(out.realGameChromiumRunPerformedNow,false);
 assert.equal(out.realIphoneHomeScreenPwaTested,false);
 assert.equal(out.noProductionSelectionChanges,true);
 assert.equal(out.noA5VariantYawOrStructuralDecision,true);
 assert.equal(out.noMergeOrDeployment,true);
});
