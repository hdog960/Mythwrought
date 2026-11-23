import test from 'node:test';
import assert from 'node:assert/strict';
import {
 HEARTH_SOURCE_FACE_STUDY,originalSourceBoxInterval,
 auditOriginalHearthYaw3SourceFirstFaceOwnership,
 attestOriginalNearestFaceSourceOwnership
} from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-hearth-yaw3-face-occlusion-audit.mjs';

const evidence=auditOriginalHearthYaw3SourceFirstFaceOwnership();
const t=evidence.totals;

test('unchanged ORIGINAL physical renderer, six-block ray and authentic face winding source contracts',()=>{
 const guard=attestOriginalNearestFaceSourceOwnership();
 assert.equal(guard.unchangedOriginalSourceContracts,7);
 assert.equal(guard.originalTriangleBoxGroupingTwelveTrianglesPerAuthoredBox,true);
 assert.equal(guard.sourceMathAndGpuPixelEvidenceAreNeverEquated,true);
});
test('original changed study is one test-only hearth running bond rotation THREE, not A5 authoring',()=>{
 assert.equal(HEARTH_SOURCE_FACE_STUDY.symbolicId,'pack5:080');
 assert.equal(HEARTH_SOURCE_FACE_STUDY.variant,'hearth-running-bond');
 assert.equal(HEARTH_SOURCE_FACE_STUDY.yaw,3);
 assert.deepEqual([...HEARTH_SOURCE_FACE_STUDY.anchor],[3,14,0]);
 assert.deepEqual([...HEARTH_SOURCE_FACE_STUDY.eye],[.5,13.55,.5]);
 assert.equal(HEARTH_SOURCE_FACE_STUDY.maxRayReach,6);
 assert.deepEqual([...HEARTH_SOURCE_FACE_STUDY.sampleOffsets],[-.000002,0,.000002]);
});
test('independent exact source box ray interval identifies entry/exit, physical thickness and axis',()=>{
 const x=originalSourceBoxInterval([-1,.5,.5],[1,0,0],[0,0,0,1,1,1]);
 assert.equal(x.enter,1);
 assert.equal(x.exit,2);
 assert.equal(x.throughThickness,1);
 assert.equal(x.entryAxis,0);
 assert.equal(x.entryNormalDirection,'-axis');
 const reversed=originalSourceBoxInterval([2,.5,.5],[-1,0,0],[0,0,0,1,1,1]);
 assert.equal(reversed.enter,1);
 assert.equal(reversed.exit,2);
 assert.equal(reversed.entryNormalDirection,'+axis');
 assert.equal(originalSourceBoxInterval([-1,2,.5],[1,0,0],[0,0,0,1,1,1]),null);
 assert.equal(originalSourceBoxInterval([-1,.5,.5],[-1,0,0],[0,0,0,1,1,1]),null);
});
test('strict source interval model rejects NaN, zero directions and malformed physical geometry',()=>{
 assert.throws(()=>originalSourceBoxInterval([NaN,0,0],[1,0,0],[0,0,0,1,1,1]),/first-face ownership/);
 assert.throws(()=>originalSourceBoxInterval([0,0,0],[0,0,0],[0,0,0,1,1,1]),/first-face ownership/);
 assert.throws(()=>originalSourceBoxInterval([0,0,0],[1,0,0],[1,0,0,0,1,1]),/first-face ownership/);
});
test('exact same 2610 original pose rays and all 208 source-only distance warnings independently reconciled',()=>{
 assert.equal(t.rays,2610);
 assert.equal(t.bothHitWarnings,208);
 assert.equal(t.strictSourceHits,2472);
 assert.equal(t.originalDetailedHits,2472);
 assert.equal(t.actualStrictMeshVsOriginalSelectionHitMissDisagreement,0);
 assert.equal(t.exactOriginalSelectionVsIndependentFirstBoxDisagreement,0);
 assert.equal(evidence.originalRayGrid.originalYLevels,29);
 assert.equal(evidence.originalRayGrid.originalZLevels,30);
 assert.deepEqual(evidence.originalRayGrid.originalOffsets,[-.000002,0,.000002]);
 assert.equal(evidence.originalGpuWorldFloat32Vertices,1512);
 assert.equal(evidence.originalAuthenticatedWorldGpuBytes,54432);
 assert.equal(evidence.originalAuthoredPhysicalBoxes,42);
});
test('all 208 original warnings preserve three independent source owner/face/seam partitions',()=>{
 assert.equal(t.selectedBoxAhead,139);
 assert.equal(t.triangleAhead,69);
 assert.equal(t.samePhysicalBox,111);
 assert.equal(t.differentPhysicalBox,97);
 assert.equal(t.nearOriginalSelectedBoxTangentialSeam,93);
 assert.equal(t.farFromOriginalSelectedBoxTangentialSeam,115);
 assert.equal(t.selectedBoxAhead+t.triangleAhead,208);
 assert.equal(t.samePhysicalBox+t.differentPhysicalBox,208);
 assert.equal(t.nearOriginalSelectedBoxTangentialSeam+
  t.farFromOriginalSelectedBoxTangentialSeam,208);
});
test('every differing hit is classified by original selected AABB segment thickness and strict triangle facing',()=>{
 assert.equal(t.selectedBoxThinRayIntersectionUnder1e5+
  t.selectedBoxRobustRayIntersectionAtLeast1e5,208);
 assert.equal(t.firstStrictTriangleFacesTowardEye+
  t.firstStrictTriangleFacesAwayFromEye,208);
 assert.ok(Number.isFinite(t.maxPhysicalIntervalThickness)&&t.maxPhysicalIntervalThickness>0);
});
test('all source-owned face contact classifications distinguish geometry BEFORE a triangle from true GPU occlusion',()=>{
 assert.ok(t.strictTrianglePointWithinSameSourceBoxBeforeContact>=0&&
  t.strictTrianglePointWithinSameSourceBoxBeforeContact<=208);
 assert.ok(t.strictTrianglePointWithoutBoxInteriorBeforeContact>=0&&
  t.strictTrianglePointWithoutBoxInteriorBeforeContact<=208);
 assert.equal(t.selectedAheadButTriangleAlreadyInsideBoxUnion+
  t.selectedAheadAndTriangleOutsideAllBoxInteriors,139);
 assert.equal(t.triangleAheadAndPriorAuthoredBoxInterior+
  t.triangleAheadAndNoPriorAuthoredBoxInterior,69);
 assert.ok(t.strictTrianglePointWithinOtherSourceBoxBeforeContact<=208);
 assert.ok(t.firstStrictTriangleWorldPointOutsideOwnAuthoredBoxOver1e5<=208);
 assert.ok(t.firstStrictTriangleWorldPointOutsideOwnAuthoredBoxOver1e7<=208);
 assert.ok(Number.isFinite(t.maxTriangleContactDistanceOutsideOwnAuthoredBox));
 assert.ok(t.maxTriangleContactDistanceOutsideOwnAuthoredBox>=0);
});
test('source warning triplets are tracked by exact original Y/Z/offset ownership, never conflated as independent camera defects',()=>{
 assert.ok(t.warningGroups>0&&t.warningGroups<=29*30);
 assert.ok(t.threeShiftsWarnSameFaceOwner>=0&&t.threeShiftsWarnSameFaceOwner<=t.warningGroups);
 assert.ok(t.threeShiftsWarnSameFaceOwner*3<=208);
 assert.equal(evidence.originalRayGrid.total,2610);
});
test('true source first-face exemplars expose authored box and triangle face ownership, ray direction and physical segment',()=>{
 assert.deepEqual(Object.keys(evidence.examples).sort(),[
 'differentBox','priorBoxInterior','sameBox','selectionAhead','triangleAhead',
 'unoccludedTriangle'
 ].sort());
 assert.equal(evidence.examples.differentBox.length,8);
 assert.equal(evidence.examples.sameBox.length,8);
 assert.equal(evidence.examples.triangleAhead.length,8);
 assert.equal(evidence.examples.selectionAhead.length,8);
 for(const group of Object.values(evidence.examples))for(const row of group){
  assert.equal(row.mathematicallyStrictSourceOnly,true);
  assert.equal(row.actualGpuRasterPixelMeasured,false);
  assert.ok(Number.isInteger(row.originalSelectionSourceBox)&&row.originalSelectionSourceBox>=0);
  assert.ok(Number.isInteger(row.originalTriangleSourceBox)&&row.originalTriangleSourceBox>=0);
  assert.ok(Number.isInteger(row.boxFaceIndex)&&row.boxFaceIndex>=0&&row.boxFaceIndex<6);
  assert.ok(Number.isFinite(row.sourceTriangleNormalDotRay));
  assert.ok(Number.isFinite(row.originalSelectedBoxTangentialClearance));
  assert.ok(row.authoredSelectedBoxThicknessAlongRay>=0);
  assert.ok(Number.isFinite(row.originalTriangleHitpointOutsideOwnAuthoredBoxDistance));
  assert.ok(Number.isFinite(row.strictOriginalGpuWorldTriangleDistance)&&
   Number.isFinite(row.originalDetailedDistance));
 }
 console.log('ROADMAP_A_ORIGINAL_HEARTH_YAW3_208_FIRST_FACE_SOURCE_OCCLUSION '+JSON.stringify({
  totals:t,
  compactExamples:Object.fromEntries(Object.entries(evidence.examples).map(([k,v])=>[
   k,v.slice(0,2)
  ])),
  sourceOnlyNotActualGPU:true
 }));
});
test('all provisional hidden-face names are SOURCE VOLUME samples, not WebGL depth/culling/pixel claims',()=>{
 const limits=evidence.interpretation;
 assert.equal(limits.insideOtherBoxBeforeTriangleIsSourceVolumeOcclusionOnlyNotGPUVisibility,true);
 assert.equal(limits.strictTrianglePointMayBeOnAuthoredFaceButNotRenderedFragment,true);
 assert.equal(limits.originalShaderCullingAndDepthNotExecuted,true);
 assert.equal(limits.originalTerrainOcclusionNotTestedInAllAirHost,true);
 assert.equal(limits.noRealUserWorldOrSavedStateReadOrWritten,true);
 assert.equal(limits.noCreatorA5ArtYawOrStructuralDecision,true);
 assert.equal(limits.noProductionPlayerMineOrRaycasterChange,true);
 assert.equal(limits.noActualIphoneOrBrowserRunNow,true);
 assert.equal(limits.noMergeOrDeploy,true);
});
