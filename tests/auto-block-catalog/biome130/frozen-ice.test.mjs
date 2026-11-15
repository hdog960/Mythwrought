import test from 'node:test';
import assert from 'node:assert/strict';
import {FROZEN_IDS,frozenCandidate,frozenFaceSample,frozenMesh,frozenFixture} from '../../../src/auto-block-catalog/biome130/frozen-ice.mjs';
test('three distinct reserved candidates, no runtime IDs assigned',()=>{
 assert.deepEqual(FROZEN_IDS,['biome130:019','biome130:020','biome130:021']);
 for(let i=0;i<3;i++){const d=frozenCandidate(FROZEN_IDS[i]);assert.equal(d.proposedFutureId,274+i);assert.equal(d.status,'BLOCKED BY ENGINE');assert.equal(d.physical.targetable,true);assert.equal(d.physical.removable,true);assert.equal(d.shape.boxes.length,1);}
 assert.equal(frozenCandidate(FROZEN_IDS[0]).shape.bounds[4],.18);
 assert.equal(frozenCandidate(FROZEN_IDS[1]).material.transparent,true);
 assert.equal(frozenCandidate(FROZEN_IDS[2]).material.renderPass,'transparent');
});
test('four rotations retain bounded shape and deterministic textures',()=>{
 for(const id of FROZEN_IDS)for(let r=0;r<4;r++){
  const d=frozenCandidate(id,r);for(const b of d.shape.boxes){assert.ok(b.every(x=>x>=0&&x<=1));assert.ok(b[0]<b[3]&&b[1]<b[4]&&b[2]<b[5]);}
  assert.equal(frozenFaceSample(id,3,.3,.6,42),frozenFaceSample(id,3,.3,.6,42));
 }
 assert.throws(()=>frozenCandidate(FROZEN_IDS[0],4));
});
test('mesh is outward wound, bounded, and limited to 12 triangles',()=>{
 for(const id of FROZEN_IDS)for(let r=0;r<4;r++){
  const m=frozenMesh(id,r);assert.equal(m.vertices.length,72);assert.equal(m.indices.length,36);
  for(let t=0;t<m.indices.length;t+=3){
   const p=m.indices.slice(t,t+3).map(i=>m.vertices.slice(i*3,i*3+3));
   const u=p[1].map((x,i)=>x-p[0][i]),v=p[2].map((x,i)=>x-p[0][i]);
   const n=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
   const declared=m.normals.slice(m.indices[t]*3,m.indices[t]*3+3);
   assert.ok(n.reduce((s,x,i)=>s+x*declared[i],0)>0);
  }
 }
});
test('isolated place/remove and serialization roundtrip',()=>{
 const a=frozenFixture(),b=frozenFixture();
 assert.equal(a.place(1,2,3,FROZEN_IDS[1],3),true);
 assert.equal(a.place(1,2,3,FROZEN_IDS[2]),false);
 b.restore(a.snapshot());assert.deepEqual(b.select(1,2,3),{id:FROZEN_IDS[1],rotation:3});
 assert.deepEqual(b.remove(1,2,3),{id:FROZEN_IDS[1],rotation:3});
 assert.equal(b.select(1,2,3),null);
 assert.throws(()=>b.restore(JSON.stringify([['1,2,3',{id:'biome130:999',rotation:0}]])));
});
