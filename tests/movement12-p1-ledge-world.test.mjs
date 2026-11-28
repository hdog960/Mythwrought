import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {stepPlayer} from '../src/physics.mjs';
import {resolveDodgeDisplacement} from '../src/movement12/dodge-displacement.mjs';
const feet=-30,dt=1/90;
function fixture(kind){
 const world=new VoxelWorld(179);
 for(let x=-1;x<=4;x++)for(let z=-1;z<=3;z++){
  for(let y=feet-1;y<=feet+3;y++)assert.equal(world.set(x,y,z,BLOCK.AIR),true);
  if(kind==='step'||kind==='flat'||kind==='ceiling'||kind==='shape'||x===0)
   assert.equal(world.set(x,feet-1,z,BLOCK.STONE),true);
 }
 if(kind==='corner')assert.equal(world.set(1,feet,1,BLOCK.STONE),true);
 if(kind==='step'||kind==='ceiling')for(let x=-1;x<=2;x++)assert.equal(world.set(x,feet,1,BLOCK.STONE),true);
 if(kind==='ceiling')for(let x=-1;x<=2;x++)assert.equal(world.set(x,feet+2,0,BLOCK.STONE),true);
 const edge=kind==='corner'||kind==='ledge';
 const p={x:edge?1.27:.5,z:.70,feet,yaw:0,pitch:0,vX:edge?3:0,vZ:kind==='ledge'?0:3,onGround:true,vY:0,coyote:.09,jumpBuffer:0};
 const input=kind==='corner'?{strafe:1,forward:1}:kind==='ledge'?{strafe:1}:{forward:1};
 return {world,p,input};
}
test('original VoxelWorld: diagonal ledge cannot provide an airborne auto-step',()=>{
 const {world,p,input}=fixture('corner');assert.equal(collides(world,p.x,p.feet,p.z),false);
 assert.equal(collides(world,p.x,p.feet-.002,p.z),true);
 const e=stepPlayer(world,p,input,dt);
 assert.equal(e.stepped,false);assert.equal(e.hitWall,true);
 assert.ok(p.x>1.28);assert.ok(p.z<.721);assert.ok(p.feet<feet);
 assert.equal(p.onGround,false);assert.equal(collides(world,p.x,p.feet,p.z),false);
});
test('original VoxelWorld: gravity acts in ledge departure substep; coyote jump survives',()=>{
 const {world,p,input}=fixture('ledge');
 stepPlayer(world,p,input,dt);assert.ok(p.feet<feet);assert.equal(p.onGround,false);assert.ok(p.coyote>0);
 assert.equal(stepPlayer(world,p,{jump:true},dt).jumped,true);assert.ok(p.vY>0);
});
test('original VoxelWorld: ordinary step and ceiling behavior retained',()=>{
 for(const kind of ['step','ceiling','flat']){
  const {world,p,input}=fixture(kind);const e=stepPlayer(world,p,input,dt);
  assert.equal(e.stepped,kind==='step');assert.equal(e.hitWall,kind==='ceiling');
  assert.ok(Math.abs(p.feet-(feet+(kind==='step'?1:0)))<.002);
  assert.equal(collides(world,p.x,p.feet,p.z),false);
 }
});
test('original VoxelWorld: rotated registered architecture and schema-1 restore protect dodge',()=>{
 const {world}=fixture('shape');
 // biome130:092 sandstone windcatcher grille, registered live ID 347.
 for(const turn of [0,1,2,3]){
  assert.equal(world.set(2,feet,0,347,turn),true);
  assert.equal(world.set(2,feet+1,0,347,turn),true);
  const restored=VoxelWorld.restore(world.save());
  assert.equal(restored.rotationAt(2,feet,0),turn);
  const start={x:.5,feet,z:.5};
  const opts={start,desired:{x:3,z:0},regionReady:()=>true,geometryReady:()=>true};
  const result=resolveDodgeDisplacement({...opts,world});
  assert.equal(result.reason,'collision');assert.equal(result.status,'partial');
  assert.deepEqual(resolveDodgeDisplacement({...opts,world:restored}),result);
  assert.equal(collides(world,result.pose.x,feet,result.pose.z),false);
 }
});
test('original VoxelWorld: additive collision callback is not bypassed by dodge',()=>{
 const {world}=fixture('shape');
 // Controlled callback exercises the real original collides overlay dispatch,
 // not an assertion that the production overlay geometry is complete.
 world.manual14Collision=body=>body[3]>2&&body[0]<2.1&&body[4]>feet&&body[1]<feet+2;
 const result=resolveDodgeDisplacement({world,start:{x:.5,feet,z:.5},desired:{x:3,z:0},regionReady:()=>true,geometryReady:()=>true});
 assert.equal(result.reason,'collision');assert.equal(result.status,'partial');
 assert.equal(collides(world,result.pose.x,feet,result.pose.z),false);
});
