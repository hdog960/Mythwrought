import test from 'node:test';
import assert from 'node:assert/strict';
import {createLegacyWatchtowerPool} from '../../../src/building-pool/roadmap-3b/legacy-watchtowers.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
const all=createLegacyWatchtowerPool();
test('all 15 inherited watchtowers generate real geometry for exterior and interior cutaway',()=>{
 for(const b of all){
  const ext=createPreviewMesh(b),cut=createPreviewMesh(b,{cutaway:true});
  assert.equal(ext.sourceCells,b.architecture.physicalCellSlots,b.id);
  assert.ok(cut.sourceCells<ext.sourceCells,b.id);
  assert.ok(ext.triangleCount>500&&cut.triangleCount>500,b.id);
  assert.equal(ext.triangleCount,ext.faceCount*2);
  assert.equal(ext.vertices.length,ext.triangleCount*3*6);
  assert.equal(cut.vertices.length,cut.triangleCount*3*6);
  assert.ok(ext.triangleCount<25000,`${b.id}: over isolated preview mesh budget`);
  assert.ok(cut.triangleCount<25000,`${b.id}: cutaway exceeds preview mesh budget`);
  assert.equal(ext.notAssetShapeProof,true);
  assert.equal(cut.isDiagnosticEnvelope,true);
  assert.ok((cut.facesByRole.stair||0)>0,`${b.id} cutaway hides the stairs`);
 }
});
test('rendered coordinate bounds and RGB channels stay physically finite and within authored envelope',()=>{
 for(const b of all){
  const m=createPreviewMesh(b),v=m.vertices;
  for(let i=0;i<v.length;i+=6){
   assert.ok(v[i]>=0&&v[i]<=b.envelope.width,`${b.id} x`);
   assert.ok(v[i+1]>=0&&v[i+1]<=b.envelope.height,`${b.id} y`);
   assert.ok(v[i+2]>=0&&v[i+2]<=b.envelope.depth,`${b.id} z`);
   for(let j=3;j<6;j++)assert.ok(Number.isFinite(v[i+j])&&v[i+j]>=0&&v[i+j]<=1,`${b.id} RGB`);
  }
 }
});
test('preview excludes concealed internal faces and never claims a finished candidate asset',()=>{
 for(const b of all){
  const m=createPreviewMesh(b);
  assert.ok(m.faceCount<6*m.sourceCells,`${b.id} hidden-face culling absent`);
  assert.equal(m.notAssetShapeProof,true);
  assert.ok(Object.keys(m.facesByRole).includes('foundation'),`${b.id} missing structural faces`);
 }
});
