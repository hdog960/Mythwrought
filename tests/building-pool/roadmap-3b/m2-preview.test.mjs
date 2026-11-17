import test from 'node:test';
import assert from 'node:assert/strict';
import {createM2IndustryPool} from '../../../src/building-pool/roadmap-3b/m2-industry.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera} from './preview-camera.mjs';
const sizes=[[667,375],[844,390],[932,430]];
test('12 original M2 industry geometry × diagnostic cutaway × landscape camera combinations fit real authored cells',()=>{
 let checked=0;
 for(const b of createM2IndustryPool()){
  for(const cutaway of [false,true]){
   const mesh=createPreviewMesh(b,{cutaway});
   assert.ok(mesh.triangleCount>200&&mesh.triangleCount<25000,b.id+' diagnostic triangle budget');
   assert.equal(mesh.triangleCount*18,mesh.vertices.length);
   assert.equal(mesh.isDiagnosticEnvelope,true);
   assert.equal(mesh.notAssetShapeProof,true);
   assert.ok(mesh.sourceCells>1000);
   for(const [w,h] of sizes){
    const camera=fitPreviewCamera(b.envelope,mesh.vertices,w-16,h-127);
    assert.ok(camera.projectedHalfWidth<=.865&&camera.projectedHalfHeight<=.865,b.id+' camera clip '+w+'x'+h);
    assert.ok(Math.max(camera.projectedHalfWidth,camera.projectedHalfHeight)>.8,b.id+' undersized '+w+'x'+h);
    checked++;
   }
  }
 }
 assert.equal(checked,12);
});
test('industry cutaway exposes interior rather than claiming real physical-block rendering',()=>{
 for(const b of createM2IndustryPool()){
  const ext=createPreviewMesh(b),cut=createPreviewMesh(b,{cutaway:true});
  assert.equal(ext.sourceCells,b.architecture.occupiedCoordinates);
  assert.ok(cut.sourceCells<ext.sourceCells);
  assert.equal(cut.cutaway,true);
  assert.equal(cut.notAssetShapeProof,true);
 }
});
