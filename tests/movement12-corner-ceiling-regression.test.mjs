// Isolated :12 regression: actual production stepPlayer, no runtime registration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,collides} from '../src/voxel.mjs';
import {recordRealStepTrace,compareRealStepCadences} from '../src/movement12/real-step-trace.mjs';

function makeWorld(solids=[]){
 const cells=new Set(solids.map(p=>p.join(',')));
 return {get(x,y,z){return cells.has([x,y,z].join(','))?BLOCK.STONE:BLOCK.AIR;}};
}
function floor({min=-8,max=8}={}){
 const a=[];for(let x=min;x<=max;x++)for(let z=min;z<=max;z++)a.push([x,0,z]);return a;
}
const player=(extra={})=>({x:.5,z:.5,feet:1,yaw:Math.PI/2,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:.09,jumpBuffer:0,...extra});
const forward=()=>({forward:1});
function safe(world,run){
 for(const s of run.samples){
  assert.ok([s.position.x,s.position.feet,s.position.z].every(Number.isFinite));
  assert.equal(collides(world,s.position.x,s.position.feet,s.position.z),false);
 }
}
test('real physics: diagonally driven player never penetrates an L-corner',()=>{
 const solids=floor();
 for(let y=1;y<=3;y++)for(let i=-2;i<=4;i++){solids.push([2,y,i]);solids.push([i,y,2]);}
 const world=makeWorld(solids);
 const run=recordRealStepTrace({world,initial:player({yaw:Math.PI/4}),inputAt:forward,duration:1,hz:60});
 safe(world,run);
 assert.ok(run.events.some(e=>e.hitWall),'corner collision must be reported');
 assert.ok(run.final.x<2&&run.final.z<2,'corner walls cannot be crossed');
});
test('real physics: ceiling prevents a jump from passing through a roof',()=>{
 const solids=floor();
 for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++)solids.push([x,3,z]);
 const world=makeWorld(solids);
 const run=recordRealStepTrace({world,initial:player(),inputAt:t=>({jump:t<.05}),duration:.7,hz:60});
 safe(world,run);
 assert.ok(run.events.some(e=>e.jumped),'jump must initiate');
 assert.ok(run.events.some(e=>e.ceiling),'roof must report ceiling contact');
 assert.ok(run.samples.every(s=>s.position.feet<1.25),'player cannot cross roof');
});
test('real physics: wall collision does not cancel movement parallel to wall',()=>{
 const solids=floor();
 for(let z=-8;z<=8;z++)for(let y=1;y<=3;y++)solids.push([2,y,z]);
 const world=makeWorld(solids);
 const run=recordRealStepTrace({world,initial:player({x:1.4,yaw:Math.PI/4}),inputAt:forward,duration:.8,hz:60});
 safe(world,run);
 assert.ok(run.events.some(e=>e.hitWall),'normal collision must be reported');
 assert.ok(run.final.x<2,'wall cannot be crossed');
 assert.ok(run.final.z>run.samples[0].position.z+.3,'tangential movement should survive');
});
test('real physics: fixed input has reproducible traces across repeated runs',()=>{
 const world=makeWorld(floor());
 const options={world,initial:player(),inputAt:t=>({forward:t<.4?1:0,strafe:t>=.4&&t<.8?1:0}),duration:1,hz:60};
 const a=recordRealStepTrace(options),b=recordRealStepTrace(options);
 assert.deepEqual(a.samples,b.samples);
 assert.deepEqual(a.events,b.events);
 safe(world,a);
});
test('real physics: cadence audit reports source-only and never production-hooked',()=>{
 const world=makeWorld(floor());
 const result=compareRealStepCadences({world,initial:player(),inputAt:forward,duration:1,cadences:[30,60,120],tolerance:.5});
 assert.equal(result.live,false);
 assert.equal(result.productionHooked,false);
 assert.deepEqual(result.recordings.map(r=>r.hz),[30,60,120]);
 for(const run of result.recordings)safe(world,run);
});
