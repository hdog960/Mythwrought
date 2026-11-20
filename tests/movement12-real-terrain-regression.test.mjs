// Source-only real-physics regression scenarios. Never registered in production.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,collides} from '../src/voxel.mjs';
import {recordRealStepTrace} from '../src/movement12/real-step-trace.mjs';

const key=(x,y,z)=>[x,y,z].join(',');
function worldWithFloor({edge=null}={}){
 const cells=new Map();
 const world={
  get(x,y,z){return cells.get(key(x,y,z))??BLOCK.AIR;},
  set(x,y,z,id){cells.set(key(x,y,z),id);}
 };
 for(let x=-8;x<=8;x++)for(let z=-8;z<=8;z++)
  if(edge===null||x<edge)world.set(x,0,z,BLOCK.STONE);
 return world;
}
function hero(overrides={}){
 return {x:.5,z:.5,feet:1,yaw:Math.PI/2,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:.09,jumpBuffer:0,...overrides};
}
function trace(world,initial,inputAt=()=>({forward:1}),duration=1,hz=60){
 return recordRealStepTrace({world,initial,inputAt,duration,hz});
}
function assertClear(world,result){
 for(const sample of result.samples){
  const p=sample.position;
  assert.ok(Object.values(p).every(Number.isFinite),'finite trajectory');
  assert.equal(collides(world,p.x,p.feet,p.z),false,'no sampled body penetration');
 }
}
test('real physics: full-block step is bounded by authored STEP_HEIGHT',()=>{
 const w=worldWithFloor();
 for(let z=-3;z<=3;z++)w.set(2,1,z,BLOCK.STONE);
 const r=trace(w,hero(),()=>({forward:1}),1.25);
 assertClear(w,r);
 assert.ok(r.events.some(e=>e.stepped),'real step event');
 assert.ok(r.final.feet>1.9&&r.final.feet<2.1,'single block step');
});
test('real physics: two-block wall cannot be climbed by step resolver',()=>{
 const w=worldWithFloor();
 for(let z=-3;z<=3;z++)for(let y=1;y<=2;y++)w.set(2,y,z,BLOCK.STONE);
 const r=trace(w,hero(),()=>({forward:1}),1.25);
 assertClear(w,r);
 assert.ok(r.events.some(e=>e.hitWall),'wall reported');
 assert.ok(r.final.x<2,'wall stops forward motion');
 assert.ok(r.final.feet<1.1,'wall cannot be stepped');
});
test('real physics: edge walk eventually loses support and falls',()=>{
 const w=worldWithFloor({edge:2});
 const r=trace(w,hero(),()=>({forward:1}),1.25);
 assertClear(w,r);
 assert.ok(r.samples.some(s=>s.position.x>2),'crossed platform edge');
 assert.ok(r.samples.some(s=>s.position.feet<.8),'gravity acts beyond ledge');
});
test('real physics: finger release reduces horizontal displacement',()=>{
 const w=worldWithFloor();
 const r=trace(w,hero(),t=>({forward:t<.3?1:0}),1);
 assertClear(w,r);
 const at=t=>r.samples.reduce((best,s)=>Math.abs(s.time-t)<Math.abs(best.time-t)?s:best);
 const early=at(.3).position.x-at(.1).position.x;
 const late=at(.9).position.x-at(.7).position.x;
 assert.ok(early>.1,'initial motion');
 assert.ok(late<early*.2,'release stops promptly');
});
test('real physics: deterministic repeat preserves event and position traces',()=>{
 const w=worldWithFloor(),input=t=>({forward:t<.4?1:0,strafe:t>.4&&t<.7?1:0});
 const a=trace(w,hero(),input),b=trace(w,hero(),input);
 assert.deepEqual(a.samples,b.samples);
 assert.deepEqual(a.events,b.events);
 assertClear(w,a);
});
