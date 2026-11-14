import test from 'node:test';
import assert from 'node:assert/strict';
import {shapeDescriptor,prototypeMesh,prototypeSurfaceMesh} from '../src/shape-prototypes.mjs';

const kinds=['slab','stairs','slope','post','rail'];
test('surface mesh removes internal faces without modifying descriptor occupancy',()=>{
 for(const kind of kinds)for(const variant of ['lower','upper'])for(let rotation=0;rotation<4;rotation++){
  const d=shapeDescriptor(kind,{variant,rotation});
  const before=JSON.stringify(d.boxes);
  const old=prototypeMesh(d),mesh=prototypeSurfaceMesh(d);
  assert.equal(JSON.stringify(d.boxes),before);
  assert.ok(mesh.triangles>0&&mesh.triangles<=old.triangles);
  assert.equal(mesh.indices.length,mesh.triangles*3);
  assert.ok(mesh.positions.every(Number.isFinite));
  assert.ok(mesh.indices.every(i=>i<mesh.positions.length/3));
  assert.deepEqual(mesh,prototypeSurfaceMesh(d));
 }
});
test('adjacent unit halves share no internal face and preserve exterior winding',()=>{
 const d={prototypeOnly:true,boxes:[[0,0,0,.5,1,1],[.5,0,0,1,1,1]]};
 const mesh=prototypeSurfaceMesh(d);
 assert.equal(mesh.triangles,12); // 6 merged exterior quads; no face at shared x=.5
 for(let i=0;i<mesh.indices.length;i+=3){
  const v=j=>Array.from(mesh.positions.slice(mesh.indices[i+j]*3,mesh.indices[i+j]*3+3));
  const a=v(0),b=v(1),c=v(2);
  const u=b.map((x,k)=>x-a[k]),w=c.map((x,k)=>x-a[k]);
  const cross=[u[1]*w[2]-u[2]*w[1],u[2]*w[0]-u[0]*w[2],u[0]*w[1]-u[1]*w[0]];
  const n=Array.from(mesh.normals.slice(mesh.indices[i]*3,mesh.indices[i]*3+3));
  assert.ok(cross.reduce((s,x,k)=>s+x*n[k],0)>0);
  assert.ok(!(n[0]!==0&&a[0]===.5),'internal x face');
 }
});
test('shape meshing budget remains bounded for all generic prototypes',()=>{
 for(const kind of kinds)for(let r=0;r<4;r++){
  const mesh=prototypeSurfaceMesh(shapeDescriptor(kind,{rotation:r}));
  assert.ok(mesh.triangles<=400,kind+' triangle budget');
  assert.ok(mesh.positions.byteLength+mesh.normals.byteLength+mesh.indices.byteLength<=30000);
 }
});
test('surface mesher rejects invalid descriptor',()=>assert.throws(()=>prototypeSurfaceMesh({}),TypeError));
