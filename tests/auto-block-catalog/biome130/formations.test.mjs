import test from 'node:test';
import assert from 'node:assert/strict';
import {FORMATION_IDS,desertFormation,formationMesh,formationFixture} from '../../../src/auto-block-catalog/biome130/formations.mjs';
test('three distinct physical desert formations have bounded rotated selection boxes',()=>{
 assert.deepEqual(FORMATION_IDS,['biome130:010','biome130:011','biome130:012']);
 for(let i=0;i<3;i++){const id=FORMATION_IDS[i],base=desertFormation(id);assert.equal(base.proposedFutureId,265+i);assert.equal(base.physical.selectable,true);
  assert.ok(base.shape.boxes.length>=3);for(let r=0;r<4;r++){const d=desertFormation(id,r);assert.equal(d.shape.boxes.length,base.shape.boxes.length);for(const b of d.shape.boxes){assert.ok(b.every(v=>v>=0&&v<=1));assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}}}
});
test('mesh triangles have nonzero area and consistent outward normals',()=>{
 for(const id of FORMATION_IDS)for(let r=0;r<4;r++){const m=formationMesh(id,r);assert.equal(m.indices.length,m.triangleCount*3);assert.ok(m.vertexCount<=120);
  for(let i=0;i<m.indices.length;i+=3){const pts=m.indices.slice(i,i+3).map(j=>m.positions.slice(j*3,j*3+3));const a=pts[0],u=pts[1].map((v,k)=>v-a[k]),v=pts[2].map((w,k)=>w-a[k]);const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];const n=m.normals.slice(m.indices[i]*3,m.indices[i]*3+3);assert.ok(cross.reduce((s,x,k)=>s+x*n[k],0)>0);}}
});
test('isolated reversible place/remove/rotation snapshot without schema-1 writes',()=>{
 const a=formationFixture();for(let i=0;i<3;i++)assert.equal(a.place(i,0,-i,FORMATION_IDS[i],i),true);
 assert.equal(a.place(0,0,0,FORMATION_IDS[1]),false);
 const b=formationFixture();b.restore(a.snapshot());assert.equal(b.snapshot(),a.snapshot());assert.deepEqual(b.select(2,0,-2),{id:FORMATION_IDS[2],rotation:2});
 assert.deepEqual(b.remove(2,0,-2),{id:FORMATION_IDS[2],rotation:2});assert.equal(b.select(2,0,-2),null);
 assert.throws(()=>b.place(0,0,0,'biome130:999'),RangeError);assert.throws(()=>b.restore('[["0,0,0",{"id":"biome130:999","rotation":0}]]'),RangeError);
});
