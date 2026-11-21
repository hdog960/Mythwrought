import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,collides} from '../src/voxel.mjs';
import {recordRealStepTrace} from '../src/movement12/real-step-trace.mjs';
import {auditTraceContinuity} from '../src/movement12/trace-continuity.mjs';

// Actual stepPlayer traces, never a simulated movement implementation.
const key=(x,y,z)=>`${x},${y},${z}`;
function fixture({wall=false,ledge=false}={}){
 const cells=new Map();
 for(let x=-12;x<=12;x++)for(let z=-12;z<=12;z++)
  if(!ledge||x<2)cells.set(key(x,0,z),BLOCK.STONE);
 if(wall)for(let y=1;y<=4;y++)for(let z=-4;z<=4;z++)cells.set(key(2,y,z),BLOCK.STONE);
 return {get(x,y,z){return cells.get(key(x,y,z))??BLOCK.AIR;}};
}
const hero=()=>({x:.5,z:.5,feet:1,yaw:Math.PI/2,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:.09,jumpBuffer:0});
const scenarios=[
 ['stationary',{},()=>({forward:0,strafe:0}),1],
 ['forward ground',{},()=>({forward:1}),1],
 ['wall contact',{wall:true},()=>({forward:1}),1],
 ['ledge descent',{ledge:true},()=>({forward:1}),2],
 ['jump and land',{},(_t,i)=>({jump:i===0}),2],
];
for(const [name,terrain,inputAt,duration] of scenarios){
 for(const hz of [30,60,120]){
  test(`real stepPlayer continuity: ${name} at ${hz} FPS`,()=>{
   const world=fixture(terrain);
   const trace=recordRealStepTrace({world,initial:hero(),inputAt,hz,duration});
   assert.equal(trace.source,'src/physics.mjs:stepPlayer');
   assert.equal(trace.live,false);
   assert.equal(trace.samples.length,hz*duration+1);
   assert.ok(trace.samples.every(s=>!collides(world,s.position.x,s.position.feet,s.position.z)));
   const result=auditTraceContinuity(trace,{maxHorizontalSpeed:100,maxVerticalSpeed:200,maxGapSeconds:.05});
   assert.deepEqual(result,{safe:true,reason:'continuous',index:-1});
   if(terrain.ledge)assert.ok(trace.samples.some(s=>s.position.feet<.95));
  });
 }
}
test('real stepPlayer recording rejects a tampered intermediate teleport',()=>{
 const trace=recordRealStepTrace({world:fixture(),initial:hero(),inputAt:()=>({forward:1}),hz:60,duration:1});
 const samples=trace.samples.map(s=>({time:s.time,position:{...s.position}}));
 samples[20].position.x+=8;
 assert.deepEqual(auditTraceContinuity({samples},{maxHorizontalSpeed:100,maxVerticalSpeed:200,maxGapSeconds:.05}),
  {safe:false,reason:'horizontal-discontinuity',index:20});
});
test('real stepPlayer recording rejects missing intermediate evidence',()=>{
 const trace=recordRealStepTrace({world:fixture(),initial:hero(),inputAt:()=>({forward:1}),hz:60,duration:1});
 const samples=trace.samples.filter((_s,i)=>i!==20&&i!==21&&i!==22&&i!==23);
 assert.deepEqual(auditTraceContinuity({samples},{maxHorizontalSpeed:100,maxVerticalSpeed:200,maxGapSeconds:.05}),
  {safe:false,reason:'missing-interval',index:20});
});
