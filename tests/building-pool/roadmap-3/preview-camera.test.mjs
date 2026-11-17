import test from 'node:test';
import assert from 'node:assert/strict';
import {createM1Pool} from '../../../src/building-pool/roadmap-3/m1.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';
import {fitPreviewCamera,projectPoint} from './preview-camera.mjs';
const pool=createM1Pool();
const screens=[[667,375,651,248],[844,390,828,263],[932,430,916,303]];

test('all 180 geometry/view/landscape viewport combinations fit inside a readable canvas with no clipping',()=>{
 let checked=0;
 for(const b of pool)for(const cutaway of [false,true]){
  const m=createPreviewMesh(b,{cutaway});
  for(const [ww,hh,w,h] of screens){
   const camera=fitPreviewCamera(b.envelope,m.vertices,w,h);
   assert.ok(camera.projectedHalfWidth<=.864&&camera.projectedHalfHeight<=.864,`${b.id} ${cutaway} ${ww}x${hh}: camera margin lost`);
   // At least one axis should occupy the frame meaningfully, unlike the
   // old camera that left most of the viewport empty on narrow devices.
   assert.ok(Math.max(camera.projectedHalfWidth,camera.projectedHalfHeight)>.82,`${b.id} ${cutaway} ${ww}x${hh}: undersized structure`);
   assert.equal(camera.matrix.length,16);
   for(let i=0;i<m.vertices.length;i+=6){
    const p=projectPoint(camera.matrix,[...m.vertices.slice(i,i+3)]);
    assert.ok(p.every(Number.isFinite),`${b.id}: non-finite projected vertex`);
    assert.ok(Math.abs(p[0])<=.865&&Math.abs(p[1])<=.865,`${b.id} ${ww}x${hh}: vertex outside frame ${p}`);
    assert.ok(Math.abs(p[2])<1,`${b.id}: invalid clip depth ${p[2]}`);
   }
   checked++;
  }
 }
 assert.equal(checked,180);
});
test('camera uses visible cutaway bounds rather than oversized theoretical envelope',()=>{
 for(const b of pool){
  const exterior=fitPreviewCamera(b.envelope,createPreviewMesh(b).vertices,651,248);
  const cutaway=fitPreviewCamera(b.envelope,createPreviewMesh(b,{cutaway:true}).vertices,651,248);
  assert.ok(cutaway.span<=exterior.span*1.01,`${b.id} cutaway zoom not improved or stable`);
 }
});
test('camera rejects empty, corrupt or nonfinite mesh and invalid viewport without inventing a render',()=>{
 const b=pool[0],mesh=createPreviewMesh(b);
 assert.throws(()=>fitPreviewCamera(b.envelope,new Float32Array(),651,248),/mesh/);
 assert.throws(()=>fitPreviewCamera(b.envelope,mesh.vertices,0,248),/canvas/);
 assert.throws(()=>fitPreviewCamera(b.envelope,mesh.vertices,651,NaN),/canvas/);
 const malformed=new Float32Array(18);malformed[0]=NaN;
 assert.throws(()=>fitPreviewCamera(b.envelope,malformed,651,248),/non-finite/);
});
