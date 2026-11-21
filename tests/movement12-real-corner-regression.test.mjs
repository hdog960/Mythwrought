// Source-only real stepPlayer corner regressions; no production registration.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,collides} from '../src/voxel.mjs';
import {recordRealStepTrace} from '../src/movement12/real-step-trace.mjs';

const key=(x,y,z)=>`${x},${y},${z}`;
function cornerWorld(){
 const cells=new Map();
 for(let x=-10;x<=10;x++)for(let z=-10;z<=10;z++)cells.set(key(x,0,z),BLOCK.STONE);
 // Two perpendicular, two-block-high walls, meeting at (3,3).
 for(let y=1;y<=2;y++){
  for(let z=-5;z<=3;z++)cells.set(key(3,y,z),BLOCK.STONE);
  for(let x=-5;x<=3;x++)cells.set(key(x,y,3),BLOCK.STONE);
 }
 return {get(x,y,z){return cells.get(key(x,y,z))??BLOCK.AIR;}};
}
const initial=()=>({x:.5,z:.5,feet:1,yaw:Math.PI/4,pitch:0,vX:0,vY:0,vZ:0,onGround:true,coyote:.09,jumpBuffer:0});
const run=(world,inputAt,hz=60)=>recordRealStepTrace({world,initial:initial(),inputAt,hz,duration:1.5});
function assertSafe(world,record){
 assert.ok(record.samples.length>1);
 for(const s of record.samples){
  assert.ok(Number.isFinite(s.position.x)&&Number.isFinite(s.position.z)&&Number.isFinite(s.position.feet));
  assert.equal(collides(world,s.position.x,s.position.feet,s.position.z),false,`body penetration at t=${s.time}`);
 }
}
test('real corner: diagonal input cannot penetrate two perpendicular tall walls',()=>{
 const world=cornerWorld(),r=run(world,()=>({forward:1}));
 assertSafe(world,r);
 assert.ok(r.events.some(e=>e.hitWall),'expected actual wall collision event');
 assert.ok(r.final.x<3&&r.final.z<3,'cannot cross either wall');
});
test('real corner: repeated diagonal run has identical samples and collision events',()=>{
 const world=cornerWorld(),a=run(world,()=>({forward:1})),b=run(world,()=>({forward:1}));
 assert.deepEqual(a.samples,b.samples);
 assert.deepEqual(a.events,b.events);
 assertSafe(world,a);
});
test('real corner: release after contact remains nonpenetrating',()=>{
 const world=cornerWorld(),r=run(world,t=>({forward:t<.8?1:0}));
 assertSafe(world,r);
 assert.ok(r.final.x<3&&r.final.z<3);
});
test('real corner: collision safety at 30, 60, and 120 Hz',()=>{
 const world=cornerWorld();
 for(const hz of [30,60,120]){
  const r=run(world,()=>({forward:1}),hz);
  assert.equal(r.events.length,Math.round(1.5*hz));
  assertSafe(world,r);
  assert.ok(r.final.x<3&&r.final.z<3,`wall bypass at ${hz}Hz`);
 }
});
