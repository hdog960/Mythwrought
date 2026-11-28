import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,collides} from '../src/voxel.mjs';
import {recordRealStepTrace} from '../src/movement12/real-step-trace.mjs';
import {auditStepEvents} from '../src/movement12/step-event-audit.mjs';

// Genuine engine-backed integration fixtures; no browser or production registration.
function worldFixture({wall=false,ledge=false}={}){
 const cells=new Map(),key=(x,y,z)=>[x,y,z].join(',');
 const world={get(x,y,z){return cells.get(key(x,y,z))??BLOCK.AIR;}};
 for(let x=-12;x<=12;x++)for(let z=-12;z<=12;z++){
  if(!ledge||x<3)cells.set(key(x,0,z),BLOCK.STONE);
 }
 if(wall)for(let y=1;y<=4;y++)for(let z=-4;z<=4;z++)cells.set(key(2,y,z),BLOCK.STONE);
 return world;
}
const hero=()=>({x:.5,z:.5,feet:1,yaw:Math.PI/2,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:.09,jumpBuffer:0});
function trace(options={}){return recordRealStepTrace({world:worldFixture(),initial:hero(),inputAt:()=>({forward:0,strafe:0}),hz:60,duration:1,...options});}
test('real stationary stepPlayer frames satisfy event audit',()=>{
 const r=trace(),a=auditStepEvents(r);
 assert.equal(a.ok,true);assert.equal(a.frames,60);assert.equal(a.productionHooked,false);
});
test('real forward walking frames satisfy event audit without synthetic events',()=>{
 const r=trace({inputAt:()=>({forward:1})}),a=auditStepEvents(r);
 assert.equal(a.ok,true);assert.equal(a.frames,r.events.length);
});
test('real wall collision trace preserves full-body collision safety',()=>{
 const world=worldFixture({wall:true});
 const r=trace({world,inputAt:()=>({forward:1})}),a=auditStepEvents(r);
 assert.equal(a.ok,true);assert.ok(a.walls>0);
 assert.ok(r.samples.every(s=>!collides(world,s.position.x,s.position.feet,s.position.z)));
});
test('real jump trace contains upward and downward motion with bounded event audit',()=>{
 const r=trace({duration:2,inputAt:(_t,i)=>({jump:i===0})}),a=auditStepEvents(r,{maxRise:1.1,maxDrop:100});
 assert.equal(a.ok,true);assert.ok(a.descendingFrames>0);
 assert.ok(Math.max(...r.samples.map(s=>s.position.feet))>1);
});
test('real engine recorder does not mutate original player input',()=>{
 const initial=hero(),before=structuredClone(initial);
 const r=trace({initial,inputAt:()=>({forward:1})});
 assert.deepEqual(initial,before);assert.equal(auditStepEvents(r).ok,true);
});
test('real recorder and event auditor reject truncated frame evidence',()=>{
 const r=trace(),broken={...r,events:r.events.slice(1)};
 assert.throws(()=>auditStepEvents(broken),TypeError);
});
