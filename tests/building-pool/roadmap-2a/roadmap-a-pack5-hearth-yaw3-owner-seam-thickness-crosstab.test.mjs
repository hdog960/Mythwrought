import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {
 auditOriginalHearthYaw3SourceFirstFaceOwnership,
 createOriginalHearthYaw3SourceFaceProbe
} from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-hearth-yaw3-face-occlusion-audit.mjs';
import {auditOriginalHearthYaw3Full208CrossTab} from
 '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-hearth-yaw3-owner-seam-thickness-crosstab.mjs';
const report=auditOriginalHearthYaw3Full208CrossTab(),t=report.totals,b=report.originalEightBinCrossTab;
test('unchanged original source 208 warning ledger is available opt-in and baseline remains light',()=>{
 const baseline=auditOriginalHearthYaw3SourceFirstFaceOwnership();
 const full=auditOriginalHearthYaw3SourceFirstFaceOwnership({includeFullWarningRows:true});
 assert.equal(Object.hasOwn(baseline,'fullWarningRows'),false);
 assert.equal(full.fullWarningRows.length,208);
 assert.equal(full.totals.rays,2610);
 assert.equal(baseline.totals.bothHitWarnings,full.totals.bothHitWarnings);
 assert.ok(full.fullWarningRows.every(x=>
  Number.isInteger(x.originalGridYIndex)&&x.originalGridYIndex>=0&&
  Number.isInteger(x.originalGridZIndex)&&x.originalGridZIndex>=0&&
  [-.000002,0,.000002].includes(x.originalOffsetSourceY)&&
  x.mathematicallyStrictSourceOnly&&x.actualGpuRasterPixelMeasured===false));
 assert.throws(()=>auditOriginalHearthYaw3SourceFirstFaceOwnership({includeFullWarningRows:'all'}),/first-face ownership/);
});
test('source scope exactly one original Pack5 hearth-running-bond yaw3 and original live layer real six-block gate',()=>{
 assert.equal(report.exactSource.originalVariant,'hearth-running-bond');
 assert.equal(report.exactSource.originalBrick,'pack5:080');
 assert.equal(report.exactSource.yaw,3);
 assert.deepEqual(report.exactSource.originalSourceRigEye,[.5,13.55,.5]);
 assert.deepEqual(report.exactSource.authoringAnchor,[3,14,0]);
 assert.equal(report.exactSource.originalGPUWorldFloat32Vertices,1512);
 assert.equal(report.exactSource.authoredBoxes,42);
 assert.equal(report.exactSource.sourceRayGrid,2610);
 assert.equal(report.exactSource.originalReadOnlyWorld,true);
});
test('all original 208 both-hit warnings reconcile original three independent source categories',()=>{
 assert.equal(t.warnings,208);
 assert.equal(t.differentOwner,97);
 assert.equal(t.sameOwner,111);
 assert.equal(t.nearSeam,93);
 assert.equal(t.nonSeam,115);
 assert.equal(t.thin,48);
 assert.equal(t.robust,160);
 assert.equal(t.selectedFirst,139);
 assert.equal(t.triangleFirst,69);
 assert.equal(t.differentOwner+t.sameOwner,208);
 assert.equal(t.nonSeam+t.nearSeam,208);
 assert.equal(t.robust+t.thin,208);
 assert.equal(t.selectedFirst+t.triangleFirst,208);
});
test('all eight original owner/seam/thickness source bins have complete signed-depth accounting',()=>{
 assert.equal(Object.keys(b).length,8);
 assert.equal(Object.values(b).reduce((n,v)=>n+v.count,0),208);
 for(const [key,v] of Object.entries(b)){
  assert.match(key,/^(same|different)\|(near|far)\|(thin|robust)$/);
  assert.equal(v.count,v.selectedFirst+v.triangleFirst);
  assert.ok(Number.isFinite(v.signedDepthSum));
  assert.ok(Number.isFinite(v.maxAbsSignedDepth)&&v.maxAbsSignedDepth>=0);
  assert.ok(v.uniqueSourceYZGroups>=0&&v.uniqueSourceYZGroups<=v.count);
 }
 assert.equal(b['same|near|thin'].count+
  b['same|near|robust'].count+
  b['different|near|thin'].count+
  b['different|near|robust'].count,93);
 assert.equal(b['different|near|thin'].count+
  b['different|near|robust'].count+
  b['different|far|thin'].count+
  b['different|far|robust'].count,97);
 console.log('ROADMAP_A_HEARTH_208_ORIGINAL_CROSSTAB '+JSON.stringify({
  eightSourceBins:b,qualifiedRows:report.result.qualifiedOriginalSourceCandidateRows,
  robustDifferentFar:t.differentAndNonSeamAndRobust,
  thin:t.thin,robust:t.robust,
  allNineteenStableThreeY:t.stableThreeYOffsetOwnerGroups
 }));
});
test('original nested cross categories and signed first-face subsets remain exact arithmetic without inventing counts',()=>{
 assert.ok(t.differentAndNonSeam<=97&&t.differentAndNonSeam<=115);
 assert.ok(t.differentAndRobust<=97&&t.differentAndRobust<=160);
 assert.ok(t.robustAndNonSeam<=160&&t.robustAndNonSeam<=115);
 assert.equal(t.differentAndNonSeamAndRobust,b['different|far|robust'].count);
 assert.equal(t.selectedFirstAndRobustDifferentNonSeam+t.triangleFirstAndRobustDifferentNonSeam,
  t.differentAndNonSeamAndRobust);
 assert.ok(t.robustNonSeamDifferentWithNonTinyStrictMargin<=t.differentAndNonSeamAndRobust);
});
test('all nineteen authentic three-Y source warning groups preserve strict physical owner/face/sign',()=>{
 assert.equal(t.stableThreeYOffsetOwnerGroups,19);
 assert.equal(t.stableThreeOffsetWarnings,57);
 assert.equal(report.allNineteenStableThreeYOffsetGroups.length,19);
 assert.equal(new Set(report.allNineteenStableThreeYOffsetGroups.map(x=>x.originalSourceGroup)).size,19);
 assert.ok(report.allNineteenStableThreeYOffsetGroups.every(g=>
  g.allOffsetsIdenticalOwnerFaceAndDistanceSign&&g.warningRowCount===3&&
  Number.isInteger(g.sourceSelectedBox)&&Number.isInteger(g.sourceStrictTriangleBox)&&
  g.sourceTriangleFace>=0&&g.sourceTriangleFace<6));
 assert.ok(t.stableOwnerGroupsContainingRobustDifferentNonSeam>=0&&
  t.stableOwnerGroupsContainingRobustDifferentNonSeam<=19);
});
test('bounded 3x3 Y/Z source perturbation probes only original valid reach/owner/triangle face',()=>{
 const samples=report.boundedNineRaySourcePerturbationResults;
 assert.ok(samples.length<=6);
 assert.equal(samples.length,report.result.distinctNineRayCandidates);
 assert.ok(report.result.originalNineRayCandidatesStable<=samples.length);
 assert.ok(samples.every(w=>w.nineProbeOriginalSourceRows.length===9&&
  w.selectedBox!==w.triangleBox&&
  w.sourceSelectedBoxThickness>1e-5&&
  w.selectedBoxTangentialMargin>2e-6&&
  w.strictBarycentricMargin>=1e-5&&
  Math.abs(w.signedDepth)>=.002&&
  w.actualGameGpuFragmentsOrPlayerHudObserved===false));
 for(const w of samples){
  assert.equal(w.stableAllNine,
   w.nineProbeOriginalSourceRows.every(x=>x.originalFaceOwnerAndSignPreserved));
  assert.deepEqual(w.nineProbeOriginalSourceRows.map(x=>[x.dy,x.dz]),[
   [-.000002,-.000002],[-.000002,0],[-.000002,.000002],
   [0,-.000002],[0,0],[0,.000002],
   [.000002,-.000002],[.000002,0],[.000002,.000002]]);
 }
 console.log('ROADMAP_A_HEARTH_SOURCE_NINE_RAY_STABILITY '+JSON.stringify({
  selectedSourceCandidates:samples.length,
  nineRayOriginalSourceStable:report.result.originalNineRayCandidatesStable,
  retainedOriginalSourceEvidence:samples.map(x=>({localTarget:x.originalAuthoredLocalCenter,
   selectedBox:x.selectedBox,triangleBox:x.triangleBox,face:x.triangleFace,
   distanceDifference:x.signedDepth,stableAllNine:x.stableAllNine}))
 }));
});
test('original read-only evaluator rejects invalid rays and reports strict renderer-stage/selection ownership without edits',()=>{
 const evaluate=createOriginalHearthYaw3SourceFaceProbe();
 assert.throws(()=>evaluate([0,NaN,.5]),/first-face ownership/);
 assert.throws(()=>evaluate([1,.5,.5]),/first-face ownership/);
 assert.throws(()=>evaluate([0,2,.5]),/first-face ownership/);
 const shot=evaluate([0,.5,.5]);
 assert.equal(shot.sourceOnly,true);
 assert.equal(shot.actualGPUOrOriginalWorldPixelsMeasured,false);
 assert.equal(shot.sameHitMembership,true);
 assert.ok(shot.selected>0&&shot.selected<=6);
 assert.ok(shot.rendered>0&&shot.rendered<=6);
});
test('all 50 robust-different-box-away-from-seam warnings receive exact strict triangle barycentric margin classification',()=>{
 const d=report.separatelyLabeledMarginalBarycentricExploration;
 assert.equal(d.assessedOriginalRobustDifferentNonSeamRows,50);
 assert.equal(d.anyCandidateActuallyStrongEnough,false);
 assert.equal(d.marginBuckets.atLeast1e5,0);
 assert.equal(Object.values(d.marginBuckets).reduce((n,v)=>n+v,0),50);
 assert.ok(Number.isFinite(d.firstTriangleStrictBarycentricMarginMin)&&
  d.firstTriangleStrictBarycentricMarginMin>=0);
 assert.ok(Number.isFinite(d.firstTriangleStrictBarycentricMarginMax)&&
  d.firstTriangleStrictBarycentricMarginMax<1e-5);
 assert.equal(d.originalStrongStrictMarginThreshold,1e-5);
 assert.equal(report.result.qualifiedOriginalSourceCandidateRows,0);
 assert.equal(d.theseAreNotStrongBrowserAcceptanceCandidates,true);
 console.log('ROADMAP_A_HEARTH_WEAK_50_STRICT_SOURCE_MARGIN_DISTRIBUTION '+JSON.stringify({
  count:d.assessedOriginalRobustDifferentNonSeamRows,
  marginMin:d.firstTriangleStrictBarycentricMarginMin,
  marginMax:d.firstTriangleStrictBarycentricMarginMax,
  marginBuckets:d.marginBuckets,sourceOnly:true
 }));
});
test('no relaxed exploratory 3x3 owner stability result can override the unchanged strong barycentric gate',()=>{
 const d=report.separatelyLabeledMarginalBarycentricExploration;
 assert.ok(d.exploratoryNineRayOriginalCandidateGroups<=4);
 assert.equal(d.exploratoryNineRayOriginalCandidateGroups,d.exploratoryNineRaySourceOnly.length);
 assert.ok(d.exploratoryNineRayOwnerStableIgnoringStrictMargin<=d.exploratoryNineRayOriginalCandidateGroups);
 for(const candidate of d.exploratoryNineRaySourceOnly){
  assert.equal(candidate.nineProbeOriginalSourceRows.length,9);
  assert.equal(candidate.actualGameGpuFragmentsOrPlayerHudObserved,false);
  assert.equal(candidate.stableAllNine,false);
  assert.equal(candidate.ownerStableAllNineIgnoringStrongBarycentricRequirement,
   candidate.nineProbeOriginalSourceRows.every(x=>
    x.ownerFaceAndDepthSignPreservedEvenIfBarycentricMarginal));
 }
 assert.equal(report.result.distinctNineRayCandidates,0);
 assert.equal(report.result.originalNineRayCandidatesStable,0);
 console.log('ROADMAP_A_HEARTH_WEAK_50_EXPLORATORY_NINE_RAY '+JSON.stringify({
  originalSourceCandidateGroups:d.exploratoryNineRayOriginalCandidateGroups,
  ownerStableIgnoringStrongMargin:d.exploratoryNineRayOwnerStableIgnoringStrictMargin,
  candidates:d.exploratoryNineRaySourceOnly.map(x=>({
   center:x.originalAuthoredLocalCenter,
   ownerStableAllNine:x.ownerStableAllNineIgnoringStrongBarycentricRequirement,
   signedDepth:x.signedDepth,barycentricMargin:x.strictBarycentricMargin
  })),
  originalGpuObserved:false,realGameBrowserRun:false
 }));
});
test('source-only candidate cannot be labeled as real browser pixel, terrain, mobile or production selection validation',()=>{
 const flags=report.result;
 assert.equal(flags.genuineStrictTriangleOnlyOriginalSelectionMisses,0);
 assert.equal(flags.originalSourceSelectionVsIndependentBoxParityDifferences,0);
 assert.equal(flags.originalNineRayClaimsAreSourceMathOnly,true);
 assert.equal(flags.actualWebGL2RasterAndDepthUnobserved,true);
 assert.equal(flags.actualPlayerMineHudUnobserved,true);
 assert.equal(flags.realTerrainNonAirOcclusionUnobserved,true);
 assert.equal(flags.actualPhysicalIphoneHomeScreenPwaUnobserved,true);
 assert.equal(flags.noProductionGeometryOrRaycasterChange,true);
 assert.equal(flags.noProductionArtYawDecision,true);
 assert.equal(flags.noUserWorldOrSaveWrites,true);
 assert.equal(flags.noMergeOrDeploy,true);
});
test('research source preserves original true mesh/selection and contains no renderer or user save changes',()=>{
 const file=readFileSync(new URL('../../../src/building-pool/roadmap-2a/roadmap-a-pack5-hearth-yaw3-face-occlusion-audit.mjs',import.meta.url),'utf8');
 assert.ok(file.includes('createOriginalHearthYaw3SourceFaceProbe'));
 assert.ok(file.includes('includeFullWarningRows=false'));
 assert.ok(file.includes('fullWarningRows.push'));
 assert.ok(file.includes('source.layer.raycast(eye,vector,6)'));
 assert.ok(!file.includes('window.localStorage.'));
 assert.ok(!file.includes('WebGLRenderingContext'));
});
