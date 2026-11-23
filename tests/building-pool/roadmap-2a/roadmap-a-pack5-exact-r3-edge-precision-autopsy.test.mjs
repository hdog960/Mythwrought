import test from 'node:test';
import assert from 'node:assert/strict';
import {forwardVector} from '../../../src/camera.mjs';
import {
 ORIGINAL_R3_REAL_GAME_EDGE,pureOriginalRayBoxDistance,
 originalTriangleBarycentric,buildOriginalR3BrickSourcePreview,
 auditExactOriginalR3MeshBoxPrecision,attestUnchangedOriginalRayImplementations
} from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-exact-r3-edge-precision-autopsy.mjs';

const evidence=auditExactOriginalR3MeshBoxPrecision();

test('authenticates unchanged original Pack5 slab, barycentric edge and real Float32 source vertex contracts',()=>{
 const c=attestUnchangedOriginalRayImplementations();
 assert.equal(c.contractCount,4);
 assert.equal(c.originalAuthoredSelectionSlabsUnchanged,true);
 assert.equal(c.originalBarycentricToleranceExactlyRead,true);
 assert.equal(c.originalMeshFloat32PositionsExactlyRead,true);
});
test('reconstructs exact genuine R3 original-game eye/rotated brick/selected source ray',()=>{
 assert.equal(evidence.authenticatedOriginalActionRun,45092582089);
 assert.equal(evidence.originalGithubArtifact,14782385585);
 assert.equal(evidence.originalEvidenceJsonSha256,
  '62708fb82618278225cbc1b092ba68e4ff204ced436fed2fa30f2de2e6d5103d');
 assert.deepEqual(evidence.originalWitness.eye,[.5,13.55,.5]);
 assert.deepEqual(evidence.originalWitness.anchor,[3,14,0]);
 assert.equal(evidence.originalWitness.variant,'kiln-soldier-course');
 assert.equal(evidence.originalWitness.rotation,2);
 assert.equal(evidence.originalDetailedRayDistance,null);
 assert.equal(evidence.independentOriginalAuthoredBoxRay.distance,null);
 assert.ok(evidence.originalSourceTriangleWithBarycentricTolerance!==null);
 assert.ok(Math.abs(evidence.originalSourceTriangleWithBarycentricTolerance.distance-
  evidence.originalWitness.previouslyMeasuredOriginalTriangleDistance)<2e-6);
});
test('original emitted R3 brick source has exact authenticated 1908 Float32 GPU triangles plus real physical authored boxes',()=>{
 const s=buildOriginalR3BrickSourcePreview();
 assert.equal(evidence.originalGpuStagedVertices,1908);
 assert.equal(evidence.originalStagedTriangles,636);
 assert.equal(s.staged.length,1908*9);
 assert.equal(s.boxes.length,evidence.authenticPartBoxes);
 assert.ok(s.boxes.length>20&&s.boxes.length<=64);
 assert.equal(s.float32Boxes.length,s.boxes.length);
 assert.ok(s.boxes.some((b,i)=>b.some((v,k)=>v!==s.float32Boxes[i][k])),
  'expected at least one original authored decimal coordinate to quantize in GPU Float32');
});
test('source-strict triangle and original tolerant barycentric hit are distinguished, never asserted equivalent',()=>{
 const x=evidence.originalSourceTriangleWithBarycentricTolerance;
 const y=evidence.strictlyInsideAuthoredFloat32SourceTriangle;
 assert.ok(x&&Number.isFinite(x.distance)&&x.distance>0&&x.distance<=6);
 assert.ok(x.barycentric!==null);
 assert.equal(x.barycentric.originalSourceToleranceAdmits,true);
 assert.ok(Number.isFinite(x.barycentric.minimumBarycentric));
 if(y!==null){
  assert.equal(y.barycentric.strictlyInsideTriangle,true);
  assert.ok(y.distance>0&&y.distance<=6);
 }
 assert.ok([
  'relaxed-barycentric-original-source-only-hit',
  'float32-box-intersects-but-original-authored-aabb-misses',
  'strict-float32-triangle-versus-box-union-gap',
  'unresolved-original-boundary-numerical-condition'
 ].includes(evidence.diagnosedSourceRayClassification));
 console.log('ROADMAP_A_ORIGINAL_R3_EXACT_EDGE_PRECISION_CLASSIFICATION '+JSON.stringify({
  classification:evidence.diagnosedSourceRayClassification,
  relaxedOriginalSourceTriangleDistance:x.distance,
  exactTriangleDistance:y?.distance??null,
  float32BoxDistance:evidence.float32QuantizedAuthoredBoxRay.distance,
  originalSelectionBoxDistance:evidence.originalDetailedRayDistance,
  relaxedTriangleMinimumBarycentric:x.barycentric.minimumBarycentric,
  originalSourcePoint:evidence.originalSourceTriangleContact,
  originalBoxUnionSeparation:evidence.originalContactVsAuthoredSelectionBoxUnion.distance,
  float32BoxUnionSeparation:evidence.originalContactVsFloat32BoxUnion.distance
 }));
});
test('exact original R3 rare edge is a relaxed-barycentric false-positive rather than a strict rendered triangle hit',()=>{
 assert.equal(evidence.diagnosedSourceRayClassification,
  'relaxed-barycentric-original-source-only-hit');
 assert.equal(evidence.originalDetailedRayDistance,null);
 assert.equal(evidence.independentOriginalAuthoredBoxRay.distance,null);
 assert.equal(evidence.float32QuantizedAuthoredBoxRay.distance,null);
 assert.equal(evidence.strictlyInsideAuthoredFloat32SourceTriangle,null);
 assert.ok(evidence.originalSourceTriangleWithBarycentricTolerance?.distance>0);
 assert.ok(evidence.relaxedOriginalTriangleHitBarycentricMargin<0);
 assert.ok(evidence.relaxedOriginalTriangleHitBarycentricMargin>=-1e-7);
 assert.ok(Math.abs(evidence.relaxedOriginalTriangleHitBarycentricMargin-
  (-3.367090616210211e-9))<2e-12);
 assert.ok(evidence.originalContactVsAuthoredSelectionBoxUnion.distance<1e-9);
 assert.ok(evidence.originalContactVsFloat32BoxUnion.distance<1e-8);
 assert.equal(evidence.exactOriginalEdgeShiftGrid[3].strictTriangleOnly,false);
});
test('original independent source slab ray is strict and non-padding; ray math rejects bogus inputs',()=>{
 assert.equal(pureOriginalRayBoxDistance([-.5,.5,.5],[1,0,0],[0,0,0,1,1,1]),.5);
 assert.equal(pureOriginalRayBoxDistance([-.5,2,.5],[1,0,0],[0,0,0,1,1,1]),null);
 assert.equal(pureOriginalRayBoxDistance([0,.5,.5],[1,0,0],[0,0,0,1,1,1]),0);
 assert.throws(()=>pureOriginalRayBoxDistance([NaN,0,0],[1,0,0],[0,0,0,1,1,1]),/edge diagnosis/);
 assert.throws(()=>pureOriginalRayBoxDistance([0,0,0],[0,0,0],[0,0,0,1,1,1]),/edge diagnosis/);
});
test('native original exact plane triangle barycentrics detect strict interior, outside and degenerate directions',()=>{
 const a=[0,0,0],b=[1,0,0],c=[0,1,0];
 const inside=originalTriangleBarycentric([.2,.2,2],[0,0,-1],a,b,c);
 assert.ok(inside.strictlyInsideTriangle&&inside.originalSourceToleranceAdmits);
 assert.ok(Math.abs(inside.t-2)<1e-12);
 const outside=originalTriangleBarycentric([1.1,1.1,2],[0,0,-1],a,b,c);
 assert.equal(outside.strictlyInsideTriangle,false);
 assert.equal(outside.originalSourceToleranceAdmits,false);
 const parallel=originalTriangleBarycentric([.2,.2,2],[1,0,0],a,b,c);
 assert.equal(parallel,null);
});
test('seven exact authored seam micro-shifts preserve original-vs-F32 slab-vs-barycentric classifications without silently repairing selection',()=>{
 assert.equal(evidence.exactOriginalEdgeShiftGrid.length,7);
 assert.deepEqual(evidence.exactOriginalEdgeShiftGrid.map(x=>x.originalFaceTargetYShift),
  [-.00001,-.000002,-.000001,0,.000001,.000002,.00001]);
 for(const point of evidence.exactOriginalEdgeShiftGrid){
  assert.equal(typeof point.sourceRelaxedTriangleOnly,'boolean');
  assert.equal(typeof point.strictTriangleOnly,'boolean');
  for(const key of ['originalAuthoredSelectionDistance',
   'originalFloat32BoxSourceDistance',
   'originalTriangleWithPreviousBarycentricTolerance',
   'originalStrictBarycentricTriangleDistance'])
   assert.ok(point[key]===null||Number.isFinite(point[key]));
 }
 assert.equal(evidence.exactOriginalEdgeShiftGrid[3].originalAuthoredSelectionDistance,null);
 assert.equal(evidence.exactOriginalEdgeShiftGrid[3].sourceRelaxedTriangleOnly,true);
 console.log('ROADMAP_A_ORIGINAL_R3_EDGE_SEAM_SHIFT_GRID '+JSON.stringify(
  evidence.exactOriginalEdgeShiftGrid));
});
test('diagnostic read-only proposed alternatives never modify production geometry, physical supports, saves, reach or structural approvals',()=>{
 assert.equal(evidence.sourceOnly,true);
 assert.equal(evidence.productionReady,false);
 assert.equal(evidence.originalGameWebgl2ExecutedInThisAudit,false);
 assert.equal(evidence.actualGpuPixelCenterCoverageMeasuredInThisAudit,false);
 assert.equal(evidence.originalPhysicalIphoneTested,false);
 assert.equal(evidence.originalSourceAssetOrBuildingEdited,false);
 assert.equal(evidence.creatorApprovedStructuralLoad,false);
 assert.equal(evidence.repairProposals.artificialPaddingOfSelectionBoxesRejected,true);
 assert.equal(evidence.repairProposals.candidateA_readonlyExactFloat32TriangleRayModelOnly,true);
 assert.equal(evidence.repairProposals.candidateB_readonlyFloat32SlabQuantizationModelOnly,true);
 assert.equal(evidence.repairProposals.noProductionSelectionImplementationChanged,true);
});
