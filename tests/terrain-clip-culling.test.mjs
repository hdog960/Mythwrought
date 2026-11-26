import test from 'node:test';
import assert from 'node:assert/strict';
import {terrainMeshBounds,terrainClipPlanes,terrainBoundsOutside} from '../src/terrain-clip-culling.mjs';
const clip=terrainClipPlanes([0,0,0],[0,0,1],[1,0,0],[0,1,0],1,1);
const b=(min,max)=>({min,max});
test('unknown geometry fails open',()=>{
 assert.equal(terrainMeshBounds(new Float32Array(0)),null);
 assert.equal(terrainMeshBounds(new Float32Array([NaN,0,0,0,0,0,0,0,0])),null);
 assert.equal(terrainBoundsOutside(null,clip),false);
 assert.equal(terrainBoundsOutside(b([0,0,0],[1,1,1]),null),false);
});
test('exact packed vertex bounds, including authored overhangs',()=>{
 const v=new Float32Array([20,-30,2,0,0,0,0,0,0,-2,9,8,0,0,0,0,0,0]);
 assert.deepEqual(terrainMeshBounds(v),b([-2,-30,2],[20,9,8]));
});
test('four outside planes, behind, intersecting and boundary geometry',()=>{
 for(const bounds of [b([4,-1,1],[5,1,2]),b([-5,-1,1],[-4,1,2]),b([-1,4,1],[1,5,2]),b([-1,-5,1],[1,-4,2]),b([-1,-1,-4],[1,1,-2])])assert.equal(terrainBoundsOutside(bounds,clip),true);
 for(const bounds of [b([-1,-1,1],[1,1,2]),b([1,-1,1],[4,1,2]),b([2,-1,2],[4,1,3]),b([-4,-4,-4],[4,4,4])])assert.equal(terrainBoundsOutside(bounds,clip),false);
});
test('bounded independent corner proof for rotated cameras and varied bounds',()=>{
 let state=123;const rng=()=>((state=Math.imul(state,1664525)+1013904223>>>0)/4294967296);
 let rejected=0;
 for(let i=0;i<20000;i++){
  const yaw=rng()*Math.PI*2,pitch=(rng()-.5)*2.6;
  const eye=[rng()*200-100,rng()*400-210,rng()*200-100],f=[Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),Math.cos(yaw)*Math.cos(pitch)],r=[-Math.cos(yaw),0,Math.sin(yaw)],u=[-Math.sin(pitch)*Math.sin(yaw),Math.cos(pitch),-Math.sin(pitch)*Math.cos(yaw)],aspect=.8+rng()*3,tan=Math.tan(Math.PI/5);
  const min=eye.map(n=>n+rng()*120-60),max=min.map(n=>n+rng()*22);
  const c=terrainClipPlanes(eye,f,r,u,aspect,tan);
  if(!terrainBoundsOutside(b(min,max),c))continue;
  rejected++;
  const corners=[];
  for(let k=0;k<8;k++){const p=min.map((n,j)=>(k&(1<<j)?max[j]:n)-eye[j]),dot=q=>p.reduce((s,n,j)=>s+n*q[j],0),z=dot(f),x=dot(r)/(aspect*tan),y=dot(u)/tan;corners.push([z+x,z-x,z+y,z-y]);}
  assert.ok([0,1,2,3].some(j=>corners.every(c=>c[j]<0)));
 }
 assert.ok(rejected>1000);
});
test('large coordinate and near plane uncertainty remains visible',()=>{
 const c=terrainClipPlanes([40000000,0,40000000],[0,0,1],[1,0,0],[0,1,0],1,1);
 assert.equal(terrainBoundsOutside(b([40000002,0,40000001],[40000003,1,40000002]),c),false);
});
