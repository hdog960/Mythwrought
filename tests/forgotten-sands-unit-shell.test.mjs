import test from 'node:test';
import assert from 'node:assert/strict';
import {prepareP0MixedGroup,p0BenchmarkMesh} from '../src/manual-biomes/forgotten-sands-mixed-mesh-audit.mjs';
import {p0BenchmarkWindow} from '../src/manual-biomes/forgotten-sands-second-site.mjs';
import {buildP0GroundedVista,planP0FarSlot} from '../src/manual-biomes/forgotten-sands-grounded-vista.mjs';
test('monument unit-grid option preserves exact compressed coverage and shared budget',()=>{
 for(const index of [1,3]){
  const {world,spec,group}=prepareP0MixedGroup(index),mid=spec.modules[1],results=[];
  for(const distance of [48,40,32,25,16]){
   const eye=[mid.x-distance,17,mid.z],near=p0BenchmarkWindow(Math.floor(eye[0]/16),Math.floor(eye[2]/16),15);
   const a=buildP0GroundedVista(world,group.view,spec.modules,near,{eye}),b=buildP0GroundedVista(world,group.view,spec.modules,near,{eye,unitMonuments:true});
   const expected=new Set(),seen=new Set();
   for(const r of a.rectangles)if(r.kind===0)for(let row=r.row;row<r.end;row++)for(let u=r.a;u<r.b;u++)expected.add([r.id,r.d,r.p,row,u].join(','));
   for(const r of b.rectangles)if(r.kind===0){assert.equal(r.end-r.row,1);assert.equal(r.b-r.a,1);const k=[r.id,r.d,r.p,r.row,r.a].join(',');assert.ok(!seen.has(k));seen.add(k);}
   assert.deepEqual(seen,expected);assert.deepEqual(b.rectangles.filter(r=>r.kind===1),a.rectangles.filter(r=>r.kind===1));
   const nearBytes=near.reduce((n,k)=>n+p0BenchmarkMesh(group.view,k.cx,k.cz,k.s).byteLength,0),plan=planP0FarSlot(near,{feet:15,nearBytes,farBytes:b.vertices.byteLength});
   assert.equal(plan.allowed,true);assert.equal(plan.buffers,19);
   results.push({distance,monumentInstances:b.monumentRects,terrainInstances:b.terrainRects,compressedBytes:a.vertices.byteLength,unitBytes:b.vertices.byteLength,plan});
  }
  assert.deepEqual(world.save().edits,[]);
  console.log('P0 UNIT SHELL',JSON.stringify({index,seed:spec.seed,results}));
 }
});
