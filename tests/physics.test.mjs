import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides,BODY_RADIUS,BODY_HEIGHT} from '../src/voxel.mjs';
import {newPlayer,findSafeSpawn,stepPlayer} from '../src/physics.mjs';

function fixture(){
  const cells=new Map();
  const key=(x,y,z)=>[x,y,z].join(',');
  const world={
    get(x,y,z){return cells.get(key(x,y,z))??BLOCK.AIR;},
    set(x,y,z,id){if(id===BLOCK.AIR)cells.delete(key(x,y,z));else cells.set(key(x,y,z),id);}
  };
  function areaFloor(y=0,size=15){
    for(let x=-size;x<=size;x++)for(let z=-size;z<=size;z++)world.set(x,y,z,BLOCK.STONE);
  }
  return {world,areaFloor};
}
function hero(x=.5,z=.5,feet=1,yaw=Math.PI/2){
  return {x,z,feet,yaw,pitch:0,vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
}
function progress(w,p,input,frames=60,dt=1/60){
  const outcomes=[],positions=[];
  for(let n=0;n<frames;n++){
    outcomes.push(stepPlayer(w,p,{...input,jump:n===0&&!!input.jump},dt));
    positions.push({x:p.x,z:p.z,feet:p.feet});
  }
  return {outcomes,positions};
}
test('full-body AABB rejects corners, head contact and foot contact',()=>{
  const {world}=fixture();
  world.set(1,1,0,BLOCK.STONE);
  assert.equal(collides(world,1-BODY_RADIUS+.003,1,.5),true);
  assert.equal(collides(world,1-BODY_RADIUS-.005,1,.5),false);
  world.set(0,2,0,BLOCK.CRYSTAL);
  assert.equal(collides(world,.5,.5,.5),true,'head must contact voxel underside');
  assert.equal(collides(world,.5,.2,.5),false,'head under ceiling clear when separated');
  assert.ok(BODY_HEIGHT>1.7 && BODY_HEIGHT<2);
});
test('safe spawn finds a solid surface without embedding in edited terrain',()=>{
  const w=new VoxelWorld(179);
  const s=findSafeSpawn(w);
  assert.equal(collides(w,s.x,s.feet,s.z),false);
  assert.equal(collides(w,s.x,s.feet-.065,s.z),true);
  const p=newPlayer(w);
  assert.deepEqual([p.x,p.z,p.feet],[s.x,s.z,s.feet]);
  assert.ok(p.onGround);
  for(let y=13;y<=18;y++)w.set(0,y,0,BLOCK.STONE);
  const post=findSafeSpawn(w);
  assert.equal(collides(w,post.x,post.feet,post.z),false);
  assert.equal(collides(w,post.x,post.feet-.065,post.z),true);
});
test('standing ground remains stable for 300 frames',()=>{
  const {world,areaFloor}=fixture();areaFloor();
  const p=hero();
  progress(world,p,{forward:0,strafe:0},300);
  assert.ok(Math.abs(p.feet-1)<.002,'Feet drifted to '+p.feet);
  assert.equal(p.onGround,true);
  assert.equal(collides(world,p.x,p.feet,p.z),false);
});
test('a falling hero never hovers above ground while within support probe distance',()=>{
  const {world,areaFloor}=fixture();areaFloor();
  const p=hero(.5,.5,1.045);
  p.onGround=false;p.vY=-.25;
  progress(world,p,{forward:0,strafe:0},70);
  assert.ok(Math.abs(p.feet-1)<.002,'early ground contact stopped fall at '+p.feet);
  assert.equal(p.onGround,true);
});
test('jump leaves ground, peaks and lands without tunneling',()=>{
  const {world,areaFloor}=fixture();areaFloor();
  const p=hero();
  const heights=[p.feet];
  for(let i=0;i<140;i++){
    const result=stepPlayer(world,p,{forward:0,strafe:0,jump:i===0},1/60);
    heights.push(p.feet);
    if(i===0)assert.equal(result.jumped,true);
    assert.equal(collides(world,p.x,p.feet,p.z),false,'jump cannot clip into floor');
  }
  assert.ok(Math.max(...heights)>2,'jump apex must clear a single block');
  assert.ok(Math.abs(p.feet-1)<.002);
  assert.equal(p.onGround,true);
});
test('horizontal traversal stops at tall wall and slides along it',()=>{
  const {world,areaFloor}=fixture();areaFloor();
  for(let z=-6;z<=6;z++)for(let y=1;y<=4;y++)world.set(2,y,z,BLOCK.STONE);
  const p=hero(.5,.5,1,Math.PI/2);
  progress(world,p,{forward:1,strafe:.3},105);
  assert.ok(p.x<=2-BODY_RADIUS+.002,'clipped tall wall at x='+p.x);
  assert.ok(Math.abs(p.z-.5)>.4,'wall should allow tangential slide');
  assert.equal(collides(world,p.x,p.feet,p.z),false);
});
test('one-block step climbs with clear head and actual support',()=>{
  const {world,areaFloor}=fixture();areaFloor();
  for(let z=-2;z<=2;z++)world.set(2,1,z,BLOCK.STONE);
  const p=hero(.5,.5);
  const out=progress(world,p,{forward:1,strafe:0},55);
  assert.ok(out.outcomes.some(r=>r.stepped),'expected a one-block ascent');
  assert.ok(out.positions.some(r=>r.x>1.75&&r.feet>1.8),'hero should travel on top of the step');
  assert.equal(collides(world,p.x,p.feet,p.z),false);
});
test('two-block wall and low ceiling cannot be climbed',()=>{
  const {world,areaFloor}=fixture();areaFloor();
  for(let z=-3;z<=3;z++)for(let y=1;y<=2;y++)world.set(2,y,z,BLOCK.STONE);
  const p=hero();
  const out=progress(world,p,{forward:1,strafe:0},140);
  assert.equal(out.outcomes.some(r=>r.stepped),false);
  assert.ok(p.x<=2-BODY_RADIUS+.002);
  assert.ok(Math.abs(p.feet-1)<.002);
  for(let z=-3;z<=3;z++){world.set(2,2,z,BLOCK.AIR);world.set(1,3,z,BLOCK.STONE);}
  p.x=.5;p.vX=0;p.onGround=true;
  const out2=progress(world,p,{forward:1,strafe:0},100);
  assert.equal(out2.outcomes.some(r=>r.stepped),false);
  assert.ok(p.x<=2-BODY_RADIUS+.002);
});
test('walking off ledge falls; removing support block also falls',()=>{
  const {world}=fixture();
  for(let x=-4;x<=0;x++)for(let z=-3;z<=3;z++)world.set(x,0,z,BLOCK.STONE);
  const p=hero(-1.5,.5);
  progress(world,p,{forward:1,strafe:0},80);
  assert.ok(p.x>0,'should travel beyond platform edge');
  assert.ok(p.feet<.5,'player must fall after ledge');
  const {world:w,areaFloor}=fixture();areaFloor(0,2);
  const another=hero();
  w.set(0,0,0,BLOCK.AIR);
  progress(w,another,{forward:0,strafe:0},40);
  assert.ok(another.feet<.5,'mined support should let player fall');
});
test('jump under low ceiling stops without penetrating',()=>{
  const {world,areaFloor}=fixture();areaFloor();
  for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++)world.set(x,3,z,BLOCK.CRYSTAL);
  const p=hero();
  const out=progress(world,p,{forward:0,strafe:0,jump:true},70);
  assert.ok(out.outcomes.some(r=>r.ceiling),'head impact expected');
  assert.ok(p.feet<1.3);
  assert.equal(collides(world,p.x,p.feet,p.z),false);
});
test('large frame is clamped; invalid time rejected',()=>{
  const {world,areaFloor}=fixture();areaFloor();
  const p=hero();
  stepPlayer(world,p,{forward:1,strafe:0},3);
  assert.ok(p.x<1,'resumed frame must not teleport forward');
  assert.throws(()=>stepPlayer(world,p,{},NaN));
  assert.throws(()=>stepPlayer(world,p,{},-.01));
});
test('frame rate maintains similar travel within tolerance',()=>{
  const {world,areaFloor}=fixture();areaFloor();
  const a=hero(),b=hero();
  progress(world,a,{forward:1,strafe:.5},120,1/120);
  progress(world,b,{forward:1,strafe:.5},30,1/30);
  assert.ok(Math.hypot(a.x-b.x,a.z-b.z)<.22,'Frame-rate movement divergence');
});
test('seeded terrain movement remains outside solids across chunk boundaries',()=>{
  const w=new VoxelWorld(9062);
  const p=newPlayer(w);
  for(let i=0;i<300;i++){
    p.yaw=Math.PI/2+(i%60)/150;
    stepPlayer(w,p,{forward:1,strafe:i%4===0?.1:0,jump:i%80===0},1/60);
    assert.equal(collides(w,p.x,p.feet,p.z),false,'Embedded in voxel frame '+i);
  }
});
