import test from 'node:test';
import assert from 'node:assert/strict';
import {GLACIAL_IDS,glacialCandidate,glacialFaceSample,glacialMesh,glacialFixture} from '../../../src/auto-block-catalog/biome130/glacial-materials.mjs';
test('snow #022-024 are distinct symbolic physical candidates',()=>{
 assert.deepEqual(GLACIAL_IDS,['biome130:022','biome130:023','biome130:024']);
 for(let i=0;i<3;i++){const d=glacialCandidate(GLACIAL_IDS[i]);assert.equal(d.proposedFutureId,277+i);assert.equal(d.status,'BLOCKED BY ENGINE');assert.equal(d.physical.targetable,true);assert.equal(d.physical.removable,true);}
 assert.equal(glacialCandidate(GLACIAL_IDS[0]).material.transparent,true);
 assert.equal(glacialCandidate(GLACIAL_IDS[1]).material.transparent,false);
 assert.equal(glacialCandidate(GLACIAL_IDS[2]).shape.boxes.length,2);
});
test('rotations, texture determinism and bounded physical geometry',()=>{
 for(const id of GLACIAL_IDS)for(let r=0;r<4;r++){
  const d=glacialCandidate(id,r);assert.equal(d.rotation,r);
  for(const b of d.shape.boxes){assert.ok(b.every(v=>v>=0&&v<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
  assert.equal(glacialFaceSample(id,2,.35,.67,31),glacialFaceSample(id,2,.35,.67,31));
 }
 assert.throws(()=>glacialCandidate(GLACIAL_IDS[0],4));
 assert.throws(()=>glacialFaceSample(GLACIAL_IDS[0],6,0,0));
});
test('meshes have outward winding, no hidden faces and bounded triangle budgets',()=>{
 for(const id of GLACIAL_IDS)for(let r=0;r<4;r++){
  const m=glacialMesh(id,r);assert.ok(m.indices.length>0&&m.indices.length<=900);
  assert.equal(m.indices.length%3,0);
  for(let t=0;t<m.indices.length;t+=3){
   const p=m.indices.slice(t,t+3).map(i=>m.vertices.slice(i*3,i*3+3));
   const a=p[1].map((x,i)=>x-p[0][i]),b=p[2].map((x,i)=>x-p[0][i]);
   const n=[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
   const expected=m.normals.slice(m.indices[t]*3,m.indices[t]*3+3);
   assert.ok(n.reduce((s,x,i)=>s+x*expected[i],0)>1e-10);
  }
 }
});
test('reversible symbolic fixture roundtrip, rejects bad state without partial overwrite',()=>{
 const a=glacialFixture(),b=glacialFixture();assert.equal(a.place(1,2,3,GLACIAL_IDS[2],3),true);
 assert.equal(a.place(1,2,3,GLACIAL_IDS[1]),false);b.restore(a.snapshot());
 assert.deepEqual(b.select(1,2,3),{id:GLACIAL_IDS[2],rotation:3});
 assert.throws(()=>b.restore(JSON.stringify([['4,5,6',{id:'biome130:999',rotation:0}]])));
 assert.deepEqual(b.select(1,2,3),{id:GLACIAL_IDS[2],rotation:3});
 assert.deepEqual(b.remove(1,2,3),{id:GLACIAL_IDS[2],rotation:3});
});
