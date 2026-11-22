import test from 'node:test';
import assert from 'node:assert/strict';
import {forwardVector} from '../../../src/camera.mjs';
import {sourceRayTriangleDistance} from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-ray-selection-core.mjs';
import {attestOriginalGamePack5TerrainProjection,
 originalGameProjectVertex,originalShaderCenterTriangleDistance,
 auditPack5OriginalGameCenterScreenProjection}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-game-camera-projection-producer.mjs';

const summary=auditPack5OriginalGameCenterScreenProjection();

test('exact original main terrain shader projection and full Pack5 draw/depth layout are source-authenticated',()=>{
 const v=attestOriginalGamePack5TerrainProjection();
 assert.equal(v.originalMainShaderExpressionsAuthenticated,11);
 assert.equal(v.originalGpuDepthTestAndDoubleSidedGeometryRead,true);
 assert.equal(v.shaderCompileOrWebGLExecution,false);
 assert.equal(summary.originalMainCameraPerspectiveFormulaEvaluated,true);
 assert.equal(summary.actualPack5DrawOrDepthTestExecuted,false);
});
test('source-shader perspective projects original first-person forward center to NDC x/y zero',()=>{
 for(const [yaw,pitch] of [[Math.PI,0],[2.7,.18],[-1.5,-.28],[0,.4]]){
  const eye=[.5,.5,2],forward=forwardVector(yaw,pitch);
  const at=eye.map((v,i)=>v+2*forward[i]);
  const screen=originalGameProjectVertex(at,eye,yaw,pitch);
  assert.ok(screen);
  assert.ok(Math.abs(screen.x)<1e-12,'center shader projection x');
  assert.ok(Math.abs(screen.y)<1e-12,'center shader projection y');
  assert.ok(Math.abs(screen.z-2)<1e-12,'camera forward distance');
  assert.ok(screen.depth>-1&&screen.depth<1,'original depth clip');
 }
});
test('original shader projected center triangle perspective depth agrees with original source 3D ray hit',()=>{
 const eye=[.5,.5,2],yaw=Math.PI,pitch=0,dir=forwardVector(yaw,pitch);
 const a=[0,0,0],b=[1,0,0],c=[.5,1,0];
 const triangle=sourceRayTriangleDistance(eye,dir,a,b,c);
 const projected=originalShaderCenterTriangleDistance(a,b,c,eye,yaw,pitch);
 assert.ok(triangle!==null&&projected!==null);
 assert.ok(Math.abs(triangle-2)<1e-10);
 assert.ok(Math.abs(triangle-projected.distance)<1e-10);
 assert.ok(projected.margin>.01);
 assert.ok(projected.ndcDepth>-1&&projected.ndcDepth<1);
});
test('original source camera shader projection rejects points behind the observer and nonfinite input',()=>{
 assert.equal(originalGameProjectVertex([.5,.5,3],[.5,.5,2],Math.PI,0),null);
 assert.throws(()=>originalGameProjectVertex([Infinity,0,0],[0,0,0],0,0),/projection witness/);
 assert.throws(()=>originalGameProjectVertex([0,0,0],[0,0,0],0,0,0),/projection witness/);
});
test('both original Pack5 brick variants at both original yaw2/yaw3 use 420 source camera projection probes',()=>{
 assert.equal(summary.originalTestOnlyAlternatives,4);
 assert.equal(summary.sourceCameraRayProbes,420);
 assert.equal(summary.rows.length,4);
 assert.ok(summary.rows.every(r=>r.rays===105&&r.independentResearchOnly&&
  r.sourceVsProjectedCenter>=0&&r.selectionVsProjectedCenter>=0));
 assert.deepEqual(summary.rows.map(x=>x.previewYaw),[2,3,2,3]);
 assert.deepEqual([...new Set(summary.rows.map(x=>x.variant))],
  ['hearth-running-bond','kiln-soldier-course']);
});
test('retains actual source-vs-screen and selection-vs-screen differences as unapproved evidence',()=>{
 const sums=(key)=>summary.rows.reduce((n,r)=>n+r[key],0);
 assert.equal(sums('sourceVsProjectedCenter'),
  summary.originalMeshRayVsShaderProjectionDisagreements);
 assert.equal(sums('selectionVsProjectedCenter'),
  summary.originalSelectionVsShaderProjectionWarnings);
 assert.equal(sums('nearProjectedTriangleEdges'),
  summary.nearProjectedTriangleEdgeWarnings);
 assert.ok(summary.nonNearEdgeSourceShaderProjectionDisagreements>=0);
 assert.ok(summary.witnesses.length<=24);
 for(const witness of summary.witnesses){
  assert.ok([2,3].includes(witness.yaw));
  assert.ok([-.016,-.008,0,.008,.016].includes(witness.pointerDelta[0]*.008));
  assert.ok(typeof witness.nearNdcTriangleEdge==='boolean');
 }
 console.log('ROADMAP_A_ORIGINAL_MAIN_SHADER_RAY_COUNTS '+JSON.stringify({
  rays:summary.sourceCameraRayProbes,
  sourceTriangleVsMainShaderDisagreements:summary.originalMeshRayVsShaderProjectionDisagreements,
  originalSelectionVsMainShaderWarnings:summary.originalSelectionVsShaderProjectionWarnings,
  nearNdcTriangleEdgeWarnings:summary.nearProjectedTriangleEdgeWarnings,
  nonNearEdgeSourceVsShader:summary.nonNearEdgeSourceShaderProjectionDisagreements,
  sourceTriangleHits:summary.sourceMeshRayHits,
  projectedCenterHits:summary.originalShaderProjectedCenterHits,
  selectionHits:summary.originalDetailedPack5SelectionHits
 }));
});
test('no shader/GPU gameplay, actual world construction, sidecar, A5 authorship or creator approval claimed',()=>{
 assert.equal(summary.actualGLTriangleRasterizationVerified,false);
 assert.equal(summary.actualPack5DrawOrDepthTestExecuted,false);
 assert.equal(summary.originalGameDomEventOrPlayerSelectionExecuted,false);
 assert.equal(summary.realWorldOrSidecarSaved,false);
 assert.equal(summary.A5SourceMaterialYawAssigned,false);
 assert.equal(summary.userApprovedActualBuildingOrSupport,false);
 assert.equal(summary.iphoneOrPwaVerified,false);
 assert.equal(summary.realGameplayVisualPickabilityReady,false);
});
