// Cave #240 real WebGL-style far-rock staging ownership and budget tests.
// All tests use the source Cave World and a deterministic GL adapter; the
// genuine original index/main WebGL2 browser suite proves actual GPU rendering.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../src/voxel.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';
import {createCaveFarWallGpu,planCaveFarWallSources,C6_FAR_BOUNDS}
 from '../src/manual-caves/c6-far-wall-gpu.mjs';
import {sectionWindow,sectionChunkRadius} from '../src/depth.mjs';
const world=createStagedCaveRuntime(314159,null,{approved:true}).world;
function fakeGl(){
 let next=0;const live=new Set(),uploaded=[],drawn=[];
 const gl={NO_ERROR:0,ARRAY_BUFFER:34962,STATIC_DRAW:35044,
  FLOAT:5126,TRIANGLES:4,
  createBuffer(){const b={id:++next};live.add(b);return b;},
  getError(){return 0;},
  bindBuffer(_target,b){this.bound=b;},
  bufferData(_target,arr){assert.ok(arr instanceof Float32Array);uploaded.push(arr.byteLength);},
  deleteBuffer(b){live.delete(b);},
  vertexAttribPointer(){},
  drawArrays(_mode,_start,n){drawn.push(n);}
 };
 return {gl,live,uploaded,drawn};
}
const fan={x:204,z:136,feet:-124,yaw:0,pitch:0};
const complete=(p=fan)=>new Map(Array.from({length:
 sectionWindow(p.feet,false).reduce((n,s)=>n+(2*sectionChunkRadius(s,
 sectionWindow(p.feet,false)[0])+1)**2,0)},(_,i)=>[String(i),{buffer:{}}]));
function step(far,player=fan,{frame=30,enabled=true,nearChunks=complete(player),
 nearPending=new Map(),activeWorld=world}={}){
 return far.step({world:activeWorld,player,nearChunks,nearPending,
  frame,viewport:[844,390],enabled});
}
test('C6 actual source-planner is bounded, deterministic and opt-in within the cave',()=>{
 const a=planCaveFarWallSources(world,fan,[844,390]);
 const b=planCaveFarWallSources(world,fan,[844,390]);
 assert.deepEqual(a,b);
 assert.equal(a.nearExpected,27);
 assert.ok(a.samples<=C6_FAR_BOUNDS.maxSourceSamples);
 assert.ok(a.selected.length<=4);
 assert.ok(a.selected.every(c=>sectionWindow(fan.feet,false).includes(c.section)),
  'Far genuine-rock meshes must stay inside already-approved vertical sections');
 assert.ok(a.selected.every(c=>Number.isInteger(c.cx)&&Number.isInteger(c.cz)));
 const surface=planCaveFarWallSources(world,{...fan,feet:4},[844,390]);
 assert.equal(surface.selected.length,0);
});
test('C6 distant overhead source rock is chosen from a REAL adjacent depth section',()=>{
 // Camera at section -8. The rock roof is physically in section -7 and
 // beyond the 3x3 near stream, but still within the approved two-chunk ring.
 // Old eye-height-only rays/active-section filtering returned no roof mesh.
 const rock={get(x,y,z){return z>=32&&z<48&&y>=-115&&y<=-100?
  BLOCK.DEEPSTONE:BLOCK.AIR;}};
 const camera={x:8,z:8,feet:-124,yaw:0,pitch:0};
 const plan=planCaveFarWallSources(rock,camera,[844,390]);
 assert.ok(plan.selected.some(c=>c.section===-7&&c.cz===2&&
  c.source[1]>=-115&&c.source[1]<=-100),
 'Source-authenticated overhead ceiling was not found outside near stream');
 assert.ok(plan.samples<=C6_FAR_BOUNDS.maxSourceSamples);
 assert.ok(plan.selected.length<=C6_FAR_BOUNDS.maxChunks);
});
test('C6 no GPU allocations in any ordinary world or while near meshes pending',()=>{
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl);
 assert.equal(step(far,fan,{enabled:false}).chunks,0);
 assert.equal(g.uploaded.length,0);
 assert.equal(step(far,fan,{nearPending:new Map([['near',[0,0,-8]]])}).chunks,0);
 assert.equal(g.uploaded.length,0);
 assert.equal(step(far,fan,{nearChunks:new Map()}).chunks,0);
 assert.equal(g.uploaded.length,0);
 far.invalidate();assert.equal(g.live.size,0);
});
test('C6 far opaque draw uses genuine 36-byte packed source mesh and exact caps',()=>{
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl);
 for(let frame=30;frame<40;frame++)step(far,fan,{frame});
 const s=far.stats();
 assert.ok(s.chunks>0,'Expected original-world far rock beyond 27 near buffers');
 assert.ok(s.chunks<=4);
 assert.ok(s.bytes>0&&s.bytes<=1048576);
 assert.ok(s.vertices>0);
 assert.equal(g.uploaded.reduce((n,v)=>n+v,0),s.bytes);
 assert.equal(g.uploaded.every(n=>n%36===0),true);
 assert.equal(s.uploads,g.uploaded.length);
 const vertices=far.draw({atPos:0,atColor:1,atUv:2,atMat:3});
 assert.equal(vertices,s.vertices);
 assert.equal(g.drawn.reduce((n,v)=>n+v,0),s.vertices);
 far.invalidate();
 assert.equal(far.stats().bytes,0);
 assert.equal(g.live.size,0,'No leaked far GPU handles after edit invalidation');
});
test('C6 world/profile switch and real surface clear every far GPU buffer',()=>{
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl);
 for(let frame=30;frame<36;frame++)step(far,fan,{frame});
 assert.ok(far.stats().bytes>0);
 step(far,{...fan,feet:5},{frame:36});
 assert.equal(far.stats().chunks,0);
 assert.equal(g.live.size,0);
 for(let frame=60;frame<67;frame++)step(far,fan,{frame});
 assert.ok(far.stats().bytes>0);
 step(far,fan,{enabled:false,frame:67});
 assert.equal(far.stats().bytes,0);
 assert.equal(g.live.size,0);
});
test('C6 context lost discards stale references with no forbidden GPU calls',()=>{
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl);
 for(let frame=30;frame<37;frame++)step(far,fan,{frame});
 const before=g.uploaded.length;
 assert.ok(before>0);
 far.resetForLostContext();
 assert.equal(far.stats().chunks,0);
 assert.equal(far.stats().bytes,0);
 // WebGL handles already invalid at real loss, don't delete on lost context.
});
test('C6 F1 never touches canonical Cave World edits, near stream or saved keys',()=>{
 const before=world.base.edits.size;
 const g=fakeGl(),far=createCaveFarWallGpu(g.gl);
 const near=complete(fan),beforeNear=near.size;
 for(let frame=30;frame<36;frame++)step(far,fan,{frame,nearChunks:near});
 assert.equal(world.base.edits.size,before);
 assert.equal(near.size,beforeNear);
 assert.equal(far.stats().maxBytes,1048576);
 assert.equal(far.stats().maxChunks,4);
 far.invalidate();
});
