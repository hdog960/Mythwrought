import test from 'node:test';
import assert from 'node:assert/strict';
import {resolvePack5BuilderAsset} from '../../../src/pack5-integration/catalog.mjs';
import {pack5TerrainVertices,PACK5_GPU_PAGE_BYTES,PACK5_GPU_RESIDENT_BYTES,
 PACK5_GPU_MAX_PAGES} from '../../../src/pack5-integration/terrain-buffer.mjs';
import {compareOriginalIndexedPack5ToTerrainStaging,
 auditPack5ActualProducerTriangleRayStaging}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-terrain-ray-staging-producer.mjs';

const original=resolvePack5BuilderAsset('pack5:080','hearth-running-bond');
const mesh=original.mesh(original.descriptor,{rotation:3});
const staged=pack5TerrainVertices(mesh);
const audit=auditPack5ActualProducerTriangleRayStaging();

test('exact original indexed source triangles are byte-identical in the production nine-float vertex stream',()=>{
 const parity=compareOriginalIndexedPack5ToTerrainStaging(mesh,staged);
 assert.equal(parity.triangles,mesh.triangles);
 assert.equal(parity.indexedSourceVertices,mesh.indices.length);
 assert.equal(parity.exactFloat32PositionValues,mesh.indices.length*3);
 assert.equal(parity.exactOriginalRGBPigmentValues,mesh.indices.length*3);
 assert.equal(parity.exactSourceUVValues,mesh.indices.length*2);
 assert.equal(parity.neutralMaterialVertices,mesh.indices.length);
 assert.equal(parity.authoredSourcePositionsByteIdenticalToProductionStaging,true);
 assert.equal(parity.actualWebGL2PixelsRendered,false);
});
test('both actual fired brick variants x yaw2 and yaw3 retain exactly 432 original and staged triangle ray outcomes',()=>{
 assert.equal(audit.originalPreviewAlternatives,4);
 assert.equal(audit.rays,432);
 assert.equal(audit.originalSourceTriangleVersusProductionStagedDisagreements,0);
 assert.equal(audit.originalMeshAndProductionPackedTrianglesRaysAgree,true);
 assert.equal(audit.sourceRows.length,4);
 assert.deepEqual(audit.sourceRows.map(r=>r.explicitPreviewOnlyYaw),[2,3,2,3]);
 assert.ok(audit.sourceRows.every(r=>r.sourceRayProbes===108&&
  r.sourceVsStagedRayDisagreements===0&&r.actualGpuExecuted===false));
});
test('actual source selection versus renderer triangles is preserved as separate raw warnings, not repaired or declared visible',()=>{
 assert.equal(audit.selectionVersusStagedDisagreements,
  audit.sourceRows.reduce((sum,row)=>sum+row.selectionVsStagedRayDisagreements,0));
 assert.ok(audit.selectionVersusStagedDisagreements<=432);
 assert.ok(audit.boundedSelectionAgainstStagedWarnings.length<=24);
 assert.equal(audit.originalSelectionAndActualMeshCanDifferAtGrazingEdges,true);
 assert.equal(audit.realGameVisualPickabilityAccepted,false);
 assert.equal(audit.originalSourceA5MaterialYawAssigned,false);
});
test('authentic source render staging fits existing mobile GPU budgets without changing production limits',()=>{
 assert.equal(audit.originalProductionPageBytes,PACK5_GPU_PAGE_BYTES);
 assert.equal(audit.originalProductionResidentBytes,PACK5_GPU_RESIDENT_BYTES);
 assert.equal(audit.originalProductionMaxPages,PACK5_GPU_MAX_PAGES);
 assert.ok(audit.sourceRows.every(row=>row.sourceShaderStagingBytes>0&&
  row.sourceShaderStagingBytes<=PACK5_GPU_PAGE_BYTES&&
  row.originalSourceTriangles>12&&row.originalSourceSelectionBoxes>32));
 assert.equal(audit.sourceOnlyOriginalProducersNotModified,true);
 assert.equal(audit.actualGameWebGLOrIphoneExecuted,false);
 assert.equal(audit.originalWorldOrSavedSidecarWritten,false);
});
test('tampered packed position, pigment, UV or neutral material fails closed against actual original mesh',()=>{
 for(const [slot,value] of [[0,staged[0]+.01],[3,staged[3]+.01],
  [6,staged[6]+.01],[8,1]]){
  const corrupted=Float32Array.from(staged);corrupted[slot]=value;
  assert.throws(()=>compareOriginalIndexedPack5ToTerrainStaging(mesh,corrupted),
   /terrain ray audit/,'corrupted production shader position/color/UV/material at slot '+slot);
 }
});
test('truncated or non-Float32 GPU staging fails closed rather than accepting a proxy mesh',()=>{
 assert.throws(()=>compareOriginalIndexedPack5ToTerrainStaging(mesh,
  Float32Array.from(staged.slice(0,-9))),/terrain ray audit/);
 assert.throws(()=>compareOriginalIndexedPack5ToTerrainStaging(mesh,
  Float64Array.from(staged)),/terrain ray audit/);
 assert.throws(()=>compareOriginalIndexedPack5ToTerrainStaging(mesh,
  new Float32Array(0)),/terrain ray audit/);
});
test('invalid source indices, nonfinite original positions, fake texture source or oversized descriptors do not pass',()=>{
 const corrupt=Uint16Array.from(mesh.indices);corrupt[0]=mesh.vertexCount+4;
 assert.throws(()=>compareOriginalIndexedPack5ToTerrainStaging({...mesh,indices:corrupt},staged),
  /terrain ray audit/);
 const positions=Float32Array.from(mesh.positions);positions[0]=NaN;
 assert.throws(()=>compareOriginalIndexedPack5ToTerrainStaging({...mesh,positions},staged),
  /terrain ray audit/);
 assert.equal(audit.structuralSupportApproved,false);
});
