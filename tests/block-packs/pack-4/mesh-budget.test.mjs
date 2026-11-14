import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK4_WINDOW_ASSETS,windowPreviewMesh} from '../../../src/block-packs/pack-4/windows.mjs';
import {PACK4_LIGHT_ASSETS,lightingPreviewMesh} from '../../../src/block-packs/pack-4/lighting.mjs';
import {PACK4_FURNISHING_ASSETS,furnishingPreviewMesh} from '../../../src/block-packs/pack-4/furnishings.mjs';
import {PACK4_CIVIC_ASSETS,civicPreviewMesh} from '../../../src/block-packs/pack-4/hearth-civic.mjs';

const all=[...PACK4_WINDOW_ASSETS,...PACK4_LIGHT_ASSETS,
 ...PACK4_FURNISHING_ASSETS,...PACK4_CIVIC_ASSETS];
function mesh(id,r){
 return id<=164?windowPreviewMesh(id,r):id<=168?lightingPreviewMesh(id,r):
   id<=175?furnishingPreviewMesh(id,r):civicPreviewMesh(id,r);
}
function signature(m){
 let h=2166136261;
 for(const stream of [m.opaque,m.translucent]){
  const u32=new Uint32Array(stream.buffer,stream.byteOffset,stream.length);
  for(const n of u32)h=Math.imul(h^n,16777619)>>>0;
 }
 return h;
}
test('all 23 physical candidates fit a bounded shared-gallery mesh budget',()=>{
 assert.equal(all.length,23);
 let total=0,peak=0;
 for(const a of all){
  const m=mesh(a.id,0),vertex=(m.opaque.length+m.translucent.length)/m.stride;
  assert.ok(vertex>=36&&vertex<=1500,'model '+a.id+' over budget: '+vertex);
  total+=vertex;peak=Math.max(peak,vertex);
 }
 // Gallery draws one at a time into one WebGL2 buffer and snapshots into 2D cards.
 assert.ok(total<=16000,'cumulative authored asset complexity exceeds target');
 assert.ok(peak<=1300,'single model is too heavy for phone preview');
});
test('23 candidates remain deterministic and finite across all four orientations',()=>{
 for(const a of all)for(let r=0;r<4;r++){
  const m=mesh(a.id,r),again=mesh(a.id,r);
  assert.equal(m.stride,10);
  assert.equal(m.opaque.length%10,0);
  assert.equal(m.translucent.length%10,0);
  assert.equal(signature(m),signature(again),'nondeterministic mesh '+a.id);
  for(const stream of [m.opaque,m.translucent])
   for(const v of stream)assert.ok(Number.isFinite(v),'nonfinite '+a.id);
 }
});
test('albedo alpha splits are real, never fake opaque glass',()=>{
 for(const id of [159,160,161,165,166,167,168]){
  const m=mesh(id,0);
  assert.ok(m.translucent.length>0,'glass or lantern expected translucency '+id);
  for(let i=9;i<m.translucent.length;i+=10)
   assert.ok(m.translucent[i]>0&&m.translucent[i]<1);
 }
 for(const a of [...PACK4_FURNISHING_ASSETS,...PACK4_CIVIC_ASSETS]){
  const m=mesh(a.id,0);
  assert.equal(m.translucent.length,0,'solid furniture may not add alpha pass');
 }
});
test('all preview streams use expected XYZ normal and RGBA attribute layout',()=>{
 for(const a of all){
  const m=mesh(a.id,3);
  for(const stream of [m.opaque,m.translucent]){
   for(let i=0;i<stream.length;i+=10){
    for(let j=0;j<3;j++)assert.ok(stream[i+j]>=0&&stream[i+j]<=1);
    for(let j=3;j<6;j++)assert.ok(Math.abs(stream[i+j])<=1);
    for(let j=6;j<10;j++)assert.ok(stream[i+j]>=0&&stream[i+j]<=1);
   }
  }
 }
});
