import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyOriginalPack5SourceWarning,attestOriginalPack5HudFocusOwnership,
 auditOriginalPack5CameraWarningForensics}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-camera-warning-forensics-producer.mjs';

const evidence=auditOriginalPack5CameraWarningForensics();
const totalCounts=()=>Object.values(evidence.categories).reduce((sum,n)=>sum+n,0);

test('classifies each exact authenticated earlier 420-ray camera warning without manufacturing or dropping any',()=>{
 assert.equal(evidence.originalAuthenticatedBaselineRays,420);
 assert.equal(evidence.originalAuthenticatedSourceVsShaderDisagreements,0);
 assert.equal(evidence.originalSourceSelectionWarnings,12);
 assert.equal(evidence.individuallyReconstructedWarnings,12);
 assert.equal(evidence.warningRows.length,12);
 assert.equal(totalCounts(),12);
 assert.equal(evidence.categories['both-miss-not-a-warning'],0);
});
test('warning taxonomy independently distinguishes source selection-only, staged triangle-only and depth offsets',()=>{
 assert.equal(classifyOriginalPack5SourceWarning(null,1),'staged-triangle-only');
 assert.equal(classifyOriginalPack5SourceWarning(1,null),'detailed-selection-only');
 assert.equal(classifyOriginalPack5SourceWarning(1,1.2),'different-hit-distance');
 assert.equal(classifyOriginalPack5SourceWarning(null,null),'both-miss-not-a-warning');
 for(const bad of [-.01,NaN,Infinity,-Infinity,'1',undefined])
  assert.throws(()=>classifyOriginalPack5SourceWarning(bad,1),/forensic/);
});
test('retains all exact original authored variant/yaw/camera look coordinates and distance provenance',()=>{
 const known=['hearth-running-bond','kiln-soldier-course'];
 const x=[.01999995,.02,.02000005,.5,.97999995,.98,.98000005];
 for(const r of evidence.warningRows){
  assert.equal(r.symbol,'pack5:080');
  assert.ok(known.includes(r.variant));
  assert.ok([2,3].includes(r.yaw));
  assert.ok(x.includes(r.eyeX));
  assert.ok([-2,-1,0,1,2].includes(r.originalLookDelta[0]));
  assert.ok([-2,0,2].includes(r.originalLookDelta[1]));
  assert.ok(Number.isFinite(r.originalSelectionDistance)||
   r.originalSelectionDistance===null);
  assert.ok(Number.isFinite(r.originalProjectedShaderDistance)||
   r.originalProjectedShaderDistance===null);
  assert.notEqual(r.classification,'both-miss-not-a-warning');
  assert.equal(r.originalSourceMeshModified,false);
 }
});
test('four small eye-position offsets per warning are executed and independently counted',()=>{
 assert.equal(evidence.totalSourceOnlyOffsetProbes,48);
 assert.equal(evidence.fourOffsetsPerWarning,4);
 assert.equal(evidence.mismatchEliminatedByAtLeastOneMicrounitCameraOffset+
  evidence.mismatchSurvivedAllFourMicrounitCameraOffsets,12);
 assert.ok(evidence.allFourShiftOffsetsWereMatching<=
  evidence.mismatchEliminatedByAtLeastOneMicrounitCameraOffset);
 for(const r of evidence.warningRows){
  assert.deepEqual(r.sourceOnlyMicroEyeOffsets.map(x=>x.eyeXShift),
   [-.000002,-.000001,.000001,.000002]);
  assert.equal(r.atLeastOneOffsetEliminatesWarning,
   r.sourceOnlyMicroEyeOffsets.some(x=>x.selectionVsShaderWarning===false));
 }
});
test('source-only near authored tangential seam and projected triangle-edge labels are not conflated',()=>{
 assert.ok(evidence.sourceNearAuthoredTangentialPlane>=0&&
  evidence.sourceNearAuthoredTangentialPlane<=12);
 assert.ok(evidence.originalNearProjectedTriangleEdgeWarningCount>=0&&
  evidence.originalNearProjectedTriangleEdgeWarningCount<=12);
 assert.equal(evidence.sourceNearAuthoredTangentialPlane,
  evidence.warningRows.filter(x=>x.withinTwoMicrounitsOfOriginalXOrYSeam).length);
 assert.equal(evidence.originalNearProjectedTriangleEdgeWarningCount,
  evidence.warningRows.filter(x=>x.previouslyReportedNearProjectedTriangleEdge).length);
 for(const r of evidence.warningRows)if(r.sourceTriangleRenderedHit)
  assert.ok(Number.isFinite(r.closestAuthoredTangentialSeamDistance));
});
test('original game HUD target outline remains distinct from opt-in Pack5 edit ray ownership',()=>{
 const focus=attestOriginalPack5HudFocusOwnership();
 assert.equal(focus.originalMainSourceAnchors,8);
 assert.equal(focus.originalGameHudWorldBlockTargetOwner,'inspectBlockTarget');
 assert.equal(focus.originalHudDirectPack5LayerRaycastInOutlineRegion,false);
 assert.equal(focus.originalPack5EditsUseSeparateModeAndLayer,true);
 assert.equal(focus.originalHudPixelOrPack5InteractionObserved,false);
 assert.equal(focus.sourceOnly,true);
});
test('native CI logs original source mismatch taxonomy without erasing the previous independent 88 warnings',()=>{
 assert.equal(evidence.historicalDifferentGridRawWarnings,88);
 assert.ok(evidence.categories['staged-triangle-only']+
  evidence.categories['detailed-selection-only']+
  evidence.categories['different-hit-distance']===12);
 console.log('ROADMAP_A_PACK5_ORIGINAL_CAMERA_WARNING_FORENSICS '+JSON.stringify({
  baselineRays:evidence.originalAuthenticatedBaselineRays,
  exactWarnings:evidence.originalSourceSelectionWarnings,
  classification:evidence.categories,
  nearAuthoredXYPlane:evidence.sourceNearAuthoredTangentialPlane,
  warningNearProjectedTriangleEdge:evidence.originalNearProjectedTriangleEdgeWarningCount,
  stabilizedByOneSmallOffset:evidence.mismatchEliminatedByAtLeastOneMicrounitCameraOffset,
  persistsAfterFourSmallOffsets:evidence.mismatchSurvivedAllFourMicrounitCameraOffsets,
  offsetRays:evidence.totalSourceOnlyOffsetProbes
 }));
});
test('all original game and source designs remain untouched and no GPU/structural approval is inferred',()=>{
 assert.equal(evidence.originalSourceMathAndPhysicalMeshesUntouched,true);
 assert.equal(evidence.noNewA5BuildingVariantYawChoice,true);
 assert.equal(evidence.noRealGameCameraOrHudExecuted,true);
 assert.equal(evidence.noActualGpuRasterPixels,true);
 assert.equal(evidence.noWorldOrSaveOrSidecarModified,true);
 assert.equal(evidence.structuralOrCreatorApproval,false);
 assert.equal(evidence.readyForProduction,false);
});
