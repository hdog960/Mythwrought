// Mythwrought roadmap #240 C5: REAL production movement controller acceptance.
// No interpolation, fake passable-world status or per-point teleporting.
// The avatar walks each cardinal source-authored connector forward and back.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides,worldKey} from '../src/voxel.mjs';
import {stepPlayer,COYOTE_TIME} from '../src/physics.mjs';
import {auditCaveSourceCells} from '../src/manual-caves/source-composition.mjs';
import {planDeepVaultConnections} from '../src/manual-caves/deep-vault-bridges.mjs';
import {createStagedCaveRuntime} from '../src/manual-caves/opt-in-runtime.mjs';

function walkRealController(world,route,label){
 const first=route[0];
 const p={x:first.x+.5,z:first.z+.5,feet:first.feet,yaw:0,pitch:0,
   vX:0,vZ:0,vY:0,onGround:true,coyote:COYOTE_TIME,jumpBuffer:0};
 assert.equal(collides(world,p.x,p.feet,p.z),false,label+' blocked origin');
 let ticks=0,everOffGround=false;
 function reach(q,i){
  let steps=0;
  while(Math.hypot(p.x-q.x-.5,p.z-q.z-.5)>.23&&steps<75){
   p.yaw=Math.atan2(q.x+.5-p.x,q.z+.5-p.z);
   const r=stepPlayer(world,p,{forward:1,strafe:0,jump:false},1/60);
   everOffGround||=!p.onGround;
   assert.equal(collides(world,p.x,p.feet,p.z),false,label+' body clipped at '+i);
   assert.ok(p.feet>=q.floor+.89&&p.feet<=q.floor+1.11,
     label+' player fell/rose unexpectedly at '+i+' '+p.feet+' vs '+q.floor);
   steps++;ticks++;
  }
  assert.ok(steps<75,label+' hit real wall before '+i+': '+JSON.stringify({
    x:p.x,z:p.z,feet:p.feet,target:q}));
  assert.ok(Math.hypot(p.x-q.x-.5,p.z-q.z-.5)<.24,
   label+' did not reach real target '+i);
  // Release thumb to stop before the next cardinal turn, like actual rails.
  for(let i=0;i<4;i++)stepPlayer(world,p,{forward:0,strafe:0,jump:false},1/60);
 }
 for(let i=1;i<route.length;i++)reach(route[i],i);
 const originalTicks=ticks;
 for(let i=route.length-2;i>=0;i--)reach(route[i],i);
 assert.ok(originalTicks>0,'No real movement frames were run');
 assert.ok(Math.abs(p.x-first.x-.5)<.25&&Math.abs(p.z-first.z-.5)<.25,
   label+' avatar cannot return along connector');
 return {ticks,legs:route.length*2-2,everOffGround};
}
for(const seed of [179,1,2026,-77]){
 test('real game controller traverses historic -75 vault connector out and back seed '+seed,()=>{
  const old=new VoxelWorld(seed),originalSave=JSON.stringify(old.save());
  const runtime=createStagedCaveRuntime(seed,null,{approved:true});
  const source=auditCaveSourceCells(seed);
  assert.ok(source.ok);
  const links=planDeepVaultConnections({sourceCells:source.cells,seed});
  assert.ok(links.ok,JSON.stringify(links.failures));
  const band=links.bridges.find(b=>b.floor===-75);
  assert.ok(band&&band.route.length>=2);
  const result=walkRealController(runtime.world,band.route,'seed '+seed+' -75');
  assert.ok(result.ticks>band.route.length-1);
  assert.equal(JSON.stringify(old.save()),originalSave);
  assert.equal(runtime.registeredInHomeScreen,false,'physical test cannot claim live Pages');
 });
}
