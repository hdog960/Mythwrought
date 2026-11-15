// Pack 1 source-specific WebGL2 geometry contract: genuine Node, no fake cube substitutions.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
 PACK1_GPU_IDS,PACK1_GPU_FACES,candidateParts,candidateFaceTexture,candidateSurface
} from '../../../src/block-packs/pack-1/webgl2-candidates.mjs';

test('WebGL2 source inputs cover 30 distinct candidate IDs 9..38 exactly',()=>{
 assert.deepEqual(PACK1_GPU_IDS,Array.from({length:30},(_,i)=>i+9));
 assert.equal(new Set(PACK1_GPU_IDS).size,30);
 assert.deepEqual(PACK1_GPU_FACES,['west','east','bottom','top','north','south']);
});

test('all source-origin rotated faces have finite, non-degenerate physical geometry',()=>{
 let cases=0,faces=0;
 for(const id of PACK1_GPU_IDS)for(let rotation=0;rotation<4;rotation++){
  const original=candidateParts(id,rotation),mesh=candidateSurface(id,rotation);
  assert.equal(mesh.id,id);assert.equal(mesh.rotation,rotation);
  assert.equal(mesh.partsCount,original.parts.length);
  assert.equal(mesh.triangles,mesh.quads.length*2);
  assert.ok(mesh.triangles>=12&&mesh.triangles<=15000,'triangles '+id+'/'+rotation);
  for(const q of mesh.quads){
   assert.equal(q.positions.length,6);assert.equal(q.uv.length,6);
   assert.ok(PACK1_GPU_FACES.includes(q.face));
   for(const p of q.positions){
    assert.equal(p.length,3);
    assert.ok(p.every(n=>Number.isFinite(n)&&n>=0&&n<=1));
   }
   assert.ok(original.parts.some(p=>p.role===q.role));
  }
  cases++;faces+=mesh.quads.length;
 }
 assert.equal(cases,120);assert.ok(faces>120);
});

test('every exposed quad follows the actual union of authored AABBs, not a cosmetic cube',()=>{
 const inside=(parts,p)=>parts.some(({box:b})=>
  p.every((v,i)=>v>=b[i]-1e-9&&v<=b[i+3]+1e-9));
 for(const id of PACK1_GPU_IDS)for(let rotation=0;rotation<4;rotation++){
  const parts=candidateParts(id,rotation).parts,mesh=candidateSurface(id,rotation);
  for(const q of mesh.quads){
   const mid=[0,1,2].map(axis=>q.positions.reduce((sum,p)=>sum+p[axis],0)/6);
   const inward=mid.map((v,i)=>v-q.normal[i]*1e-5);
   const outward=mid.map((v,i)=>v+q.normal[i]*1e-5);
   assert.ok(inside(parts,inward),'missing interior '+id+'/'+rotation+'/'+q.face);
   assert.ok(!inside(parts,outward),'fake or buried exterior '+id+'/'+rotation+'/'+q.face);
  }
 }
});

test('all original visible part roles provide actual source-authored RGBA face art',()=>{
 for(const id of PACK1_GPU_IDS){
  const faces=new Set(candidateSurface(id).quads.map(q=>q.role+'|'+q.face));
  for(const key of faces){
   const [role,face]=key.split('|'),tex=candidateFaceTexture(id,role,face,24);
   assert.equal(tex.id,id);assert.equal(tex.width,24);assert.equal(tex.height,24);
   assert.equal(tex.pixels.length,24*24*4);
   assert.ok(tex.pixels.every(n=>Number.isInteger(n)&&n>=0&&n<=255));
   assert.ok(new Set(Array.from(tex.pixels).filter((_,i)=>i%4!==3)).size>8);
  }
 }
});

test('candidate renderer preserves soft plant passability and true partial shapes',()=>{
 for(const id of [15,16,17,18,19,20,21,22,23,24,27,32,35,38]){
  const mesh=candidateSurface(id);
  const cubeFaces=new Set(mesh.quads.map(q=>q.face));
  assert.ok(mesh.partsCount>0);
  assert.ok(cubeFaces.size>=3);
  assert.ok(mesh.occupiedCells>0);
 }
 assert.equal(candidateSurface(9).triangles,12,'full masonry must remain a genuine cube');
 for(const invalid of [0,8,39,99])assert.throws(()=>candidateSurface(invalid));
});
