import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,collides} from '../src/voxel.mjs';
import {recordRealStepTrace,compareRealStepCadences} from '../src/movement12/real-step-trace.mjs';
import {auditStepEvents} from '../src/movement12/step-event-audit.mjs';

// Actual stepPlayer-backed ledge and cadence evidence; no game registration.
const key=(x,y,z)=>`${x},${y},${z}`;
function terrain({ledge=false}={}){
 const cells=new Map();
 for(let x=-12;x<=12;x++)for(let z=-12;z<=12;z++)
  if(!ledge||x<2)cells.set(key(x,0,z),BLOCK.STONE);
 return {get(x,y,z){return cells.get(key(x,y,z))??BLOCK.AIR;}};
}
function hero(){return {x:.5,z:.5,feet:1,yaw:Math.PI/2,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:.09,jumpBuffer:0};}
test('real ledge: forward travel eventually descends after losing support',()=>{
 const world=terrain({ledge:true});
 const r=recordRealStepTrace({world,initial:hero(),inputAt:()=>({forward:1}),hz:60,duration:2});
 assert.ok(r.samples.some(s=>s.position.x>2),'player must reach the ledge');
 assert.ok(r.samples.some(s=>s.position.feet<.95),'player must fall beyond the ledge');
 assert.ok(r.samples.every(s=>!collides(world,s.position.x,s.position.feet,s.position.z)));
 assert.equal(auditStepEvents(r).ok,true);
});
test('real level walking does not descend through solid support',()=>{
 const world=terrain();
 const r=recordRealStepTrace({world,initial:hero(),inputAt:()=>({forward:1}),hz:60,duration:2});
 assert.ok(r.samples.every(s=>s.position.feet>=1-1e-5));
 assert.ok(r.samples.every(s=>!collides(world,s.position.x,s.position.feet,s.position.z)));
});
test('real stationary traces are deterministic across independent recordings',()=>{
 const opts={world:terrain(),initial:hero(),inputAt:()=>({forward:0,strafe:0}),hz:60,duration:1};
 const a=recordRealStepTrace(opts),b=recordRealStepTrace(opts);
 assert.deepEqual(a.samples,b.samples);
 assert.deepEqual(a.events,b.events);
});
test('real recorder fails closed for embedded ledge starting state',()=>{
 assert.throws(()=>recordRealStepTrace({world:terrain(),initial:{...hero(),feet:.5},inputAt:()=>({}),hz:60,duration:1}),RangeError);
});
test('real multi-cadence stationary comparison produces complete genuine engine recordings',()=>{
 const world=terrain();
 const r=compareRealStepCadences({world,initial:hero(),inputAt:()=>({forward:0,strafe:0}),cadences:[30,60,120],duration:1,tolerance:.08});
 assert.equal(r.recordings.length,3);
 assert.deepEqual(r.recordings.map(x=>x.events.length),[30,60,120]);
 assert.ok(r.recordings.every(x=>x.source==='src/physics.mjs:stepPlayer'&&x.live===false));
 assert.equal(r.audit.safe,true,`real cadence audit: ${r.audit.reason}; worst divergence ${r.audit.worstDivergence}`);
 assert.equal(r.audit.reason,'consistent');
 assert.equal(r.audit.collisionAudits.length,3);
 assert.ok(r.audit.collisionAudits.every(a=>a.safe));
});
