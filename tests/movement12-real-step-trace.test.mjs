import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,collides} from '../src/voxel.mjs';
import {recordRealStepTrace,compareRealStepCadences,REAL_STEP_TRACE_CONTRACT} from '../src/movement12/real-step-trace.mjs';
function fixture(){
 const cells=new Map(),key=(x,y,z)=>[x,y,z].join(',');
 const world={get(x,y,z){return cells.get(key(x,y,z))??BLOCK.AIR;},set(x,y,z,id){cells.set(key(x,y,z),id);}};
 for(let x=-12;x<=12;x++)for(let z=-12;z<=12;z++)world.set(x,0,z,BLOCK.STONE);
 return world;
}
const hero=()=>({x:.5,z:.5,feet:1,yaw:Math.PI/2,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:.09,jumpBuffer:0});
test('contract explicitly source-only',()=>assert.equal(REAL_STEP_TRACE_CONTRACT,'movement12-real-step-trace-v1'));
test('real stepPlayer stationary traces are time-aligned',()=>{
 const w=fixture(),r=compareRealStepCadences({world:w,initial:hero(),inputAt:()=>({forward:0,strafe:0}),duration:1});
 assert.equal(r.audit.safe,true);assert.equal(r.productionHooked,false);
 assert.deepEqual(r.recordings.map(x=>x.samples.length),[31,61,121]);
});
test('real stepPlayer walking trace retains finite nonembedded state',()=>{
 const w=fixture(),r=recordRealStepTrace({world:w,initial:hero(),inputAt:()=>({forward:1,strafe:0}),hz:60,duration:1});
 assert.ok(r.final.x>hero().x);assert.equal(collides(w,r.final.x,r.final.feet,r.final.z),false);
 assert.equal(r.events.length,60);assert.equal(r.live,false);
});
test('real stepPlayer jump trace rises and lands',()=>{
 const w=fixture(),r=recordRealStepTrace({world:w,initial:hero(),inputAt:(_t,i)=>({jump:i===0}),hz:60,duration:2});
 assert.ok(Math.max(...r.samples.map(s=>s.position.feet))>2);
 assert.ok(Math.abs(r.final.feet-1)<.005);
});
test('real stepPlayer wall blocks penetration',()=>{
 const w=fixture();for(let z=-4;z<=4;z++)for(let y=1;y<=4;y++)w.set(2,y,z,BLOCK.STONE);
 const r=recordRealStepTrace({world:w,initial:hero(),inputAt:()=>({forward:1}),hz:60,duration:1});
 assert.ok(r.events.some(e=>e.hitWall));assert.equal(collides(w,r.final.x,r.final.feet,r.final.z),false);
});
test('rejects malformed source inputs and unrepresentable cadence',()=>{
 const w=fixture();
 assert.throws(()=>recordRealStepTrace({world:w,initial:hero(),inputAt:()=>null}),TypeError);
 assert.throws(()=>recordRealStepTrace({world:w,initial:hero(),inputAt:()=>({}),hz:17,duration:.1}),RangeError);
 assert.throws(()=>compareRealStepCadences({world:w,initial:hero(),inputAt:()=>({}),cadences:[60,60]}),RangeError);
});
test('does not mutate supplied initial state',()=>{
 const w=fixture(),p=hero(),before=structuredClone(p);
 recordRealStepTrace({world:w,initial:p,inputAt:()=>({forward:1}),duration:.5});
 assert.deepEqual(p,before);
});
