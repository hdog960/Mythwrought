import test from 'node:test';
import assert from 'node:assert/strict';
import {createM1Pool} from '../../../src/building-pool/roadmap-3/m1.mjs';
import {createPreviewMesh} from './preview-mesh.mjs';

const key=(x,y,z)=>`${x},${y},${z}`;
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];

// A face is front-facing iff its normal points away from its occupied voxel.
// This catches the gallery's earlier all-inward winding (hidden by disabled culling).
test('all 30 exterior meshes have outward CCW normals and neighboring empty air',()=>{
 for(const blueprint of createM1Pool()){
  const solid=new Set(blueprint.modules.flatMap(m=>m.cells.map(([x,y,z])=>key(x,y,z))));
  const {vertices:v,triangleCount}=createPreviewMesh(blueprint);
  assert.ok(triangleCount>0,blueprint.id);
  for(let i=0;i<v.length;i+=36){ // two triangles per exposed rectangular face
   const p=[v[i],v[i+1],v[i+2]];
   const q=[v[i+6],v[i+7],v[i+8]];
   const r=[v[i+12],v[i+13],v[i+14]];
   const normal=cross(q.map((n,j)=>n-p[j]),r.map((n,j)=>n-p[j]));
   assert.equal(normal.map(Math.abs).reduce((a,b)=>a+b,0),1,`${blueprint.id}: degenerate/nonaxis triangle`);
   const center=p.map((n,j)=>(n+q[j]+r[j])/3);
   const rear=center.map((n,j)=>Math.floor(n-normal[j]*.01));
   const front=center.map((n,j)=>Math.floor(n+normal[j]*.01));
   assert.ok(solid.has(key(...rear)),`${blueprint.id}: inward face at ${rear} ${normal}`);
   assert.ok(!solid.has(key(...front)),`${blueprint.id}: solid neighbor behind outward face at ${front}`);
  }
 }
});
test('all 30 cutaway meshes also carry nondegenerate outward winding',()=>{
 for(const blueprint of createM1Pool()){
  const {vertices:v,triangleCount}=createPreviewMesh(blueprint,{cutaway:true});
  assert.ok(triangleCount>0);
  for(let i=0;i<v.length;i+=36){
   const p=[v[i],v[i+1],v[i+2]],q=[v[i+6],v[i+7],v[i+8]],r=[v[i+12],v[i+13],v[i+14]];
   const normal=cross(q.map((n,j)=>n-p[j]),r.map((n,j)=>n-p[j]));
   assert.equal(normal.map(Math.abs).reduce((a,b)=>a+b,0),1,blueprint.id);
  }
 }
});
