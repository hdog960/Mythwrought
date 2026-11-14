import test from 'node:test';
import assert from 'node:assert/strict';
import {DESERT_ORGANIC_IDS,desertOrganic,desertOrganicMesh,desertOrganicFixture} from '../../../src/auto-block-catalog/biome130/desert-organics.mjs';
test('three ordered unique desert organics and provisional IDs only',()=>{
 assert.deepEqual(DESERT_ORGANIC_IDS,['biome130:013','biome130:014','biome130:015']);
 for(let i=0;i<3;i++){const d=desertOrganic(DESERT_ORGANIC_IDS[i]);assert.equal(d.proposedFutureId,268+i);
 assert.equal(d.status,'BLOCKED BY ENGINE');assert.equal(d.physical.selectable,true);assert.equal(d.physical.removable,true);
 assert.equal(d.texture.faces.length,6);assert.ok(d.shape.boxes.length>=5);
 for(const b of d.shape.boxes){assert.equal(b.length,6);for(const x of b)assert.ok(x>=0&&x<=1);assert.ok(b[3]>b[0]&&b[4]>b[1]&&b[5]>b[2]);}}
});
test('four rotations retain unit-cell bounds, deterministic geometry and outward triangle winding',()=>{
 for(const id of DESERT_ORGANIC_IDS)for(let r=0;r<4;r++){
 const a=desertOrganic(id,r),b=desertOrganic(id,r);assert.deepEqual(a,b);
 for(const n of a.shape.bounds)assert.ok(n>=0&&n<=1);
 const m=desertOrganicMesh(id,r);assert.ok(m.triangleCount>0&&m.triangleCount<=72);
 assert.equal(m.positions.length,m.vertexCount*3);assert.equal(m.indices.length,m.triangleCount*3);
 for(let i=0;i<m.indices.length;i+=3){const p=k=>m.positions.slice(m.indices[i+k]*3,m.indices[i+k]*3+3);
 const [a,b,c]=[p(0),p(1),p(2)],u=b.map((x,j)=>x-a[j]),v=c.map((x,j)=>x-a[j]);
 const cross=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
 const normal=m.normals.slice(m.indices[i]*3,m.indices[i]*3+3);
 assert.ok(cross.reduce((s,x,j)=>s+x*normal[j],0)>0,'outward winding');}
 }
});
test('isolated place/select/remove and orientation snapshot never mutate schema-1 world',()=>{
 const a=desertOrganicFixture();assert.equal(a.place(2,3,4,'biome130:013',2),true);
 assert.equal(a.place(2,3,4,'biome130:014',1),false);
 assert.equal(a.place(-1,0,0,'biome130:015',3),true);
 const s=a.snapshot(),b=desertOrganicFixture();b.restore(s);assert.equal(b.snapshot(),s);
 assert.deepEqual(b.select(2,3,4),{id:'biome130:013',rotation:2});
 assert.deepEqual(b.remove(-1,0,0),{id:'biome130:015',rotation:3});
 assert.equal(b.select(-1,0,0),null);assert.throws(()=>b.restore('[["0,0,0",{"id":"biome130:999","rotation":0}]]'));
 assert.throws(()=>desertOrganic('biome130:013',4));
});
