import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {stepPlayer,waterImmersion} from '../src/physics.mjs';
import {waterCell} from '../src/block-packs/pack-2/water.mjs';
const Y=-30,dt=1/90;
const player=(o={})=>({x:.5,z:.5,feet:Y,yaw:0,pitch:0,vX:0,vY:0,vZ:0,onGround:false,coyote:0,jumpBuffer:0,...o});
function room(){
 const base=new VoxelWorld(179);
 for(let x=-2;x<=2;x++)for(let z=-2;z<=3;z++){
  assert.equal(base.set(x,Y-2,z,BLOCK.STONE),true);
  for(let y=Y-1;y<=Y+4;y++)assert.equal(base.set(x,y,z,BLOCK.AIR),true);
 }
 return new Pack2LiveWorld(base);
}
function fill(world,ys,state=waterCell()){
 for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++)for(const y of ys)
  assert.equal(world.placePack2(x,y,z,76,state),true);
 return world;
}
function tick(world,p,input={},n=1){
 for(let i=0;i<n;i++){stepPlayer(world,p,input,dt);assert.equal(collides(world,p.x,p.feet,p.z),false);}
}
test('actual Pack2 world water levels, slopes, and save-sidecar state',()=>{
 const world=room();fill(world,[Y],waterCell({level:7,flow:'east'}));
 const a=waterImmersion(world,player({x:.1})),b=waterImmersion(world,player({x:.9}));
 assert.ok(a>b&&b>0&&a<.1);
 const restored=new Pack2LiveWorld(VoxelWorld.restore(world.save()),world.pack2Snapshot().cells);
 assert.equal(waterImmersion(restored,player({x:.1})),a);
 assert.equal(waterImmersion(world,player({feet:Y+1})),0);
});
test('actual deep water: buoyancy, sustained ascent, descent and bounded falling',()=>{
 const world=fill(room(),[Y-1,Y,Y+1,Y+2,Y+3]);
 const a=player(),b=player(),c=player(),fall=player({vY:-28});
 assert.equal(waterImmersion(world,a),1);
 const before=JSON.stringify(world.pack2Snapshot());
 tick(world,a,{},20);tick(world,b,{jump:true},20);tick(world,c,{swimDown:true},20);
 tick(world,fall);
 assert.ok(a.feet>Y&&b.feet>a.feet&&c.feet<Y);
 assert.ok(fall.vY>=-4&&fall.feet>Y-.05);
 assert.equal(JSON.stringify(world.pack2Snapshot()),before);
});
test('actual shallow water: normal dry walking trajectory',()=>{
 const wet=fill(room(),[Y],waterCell({level:7})),dry=room();
 for(const world of [wet,dry])for(let x=-2;x<=2;x++)for(let z=-2;z<=3;z++)
  assert.equal(world.set(x,Y-1,z,BLOCK.STONE),true);
 const a=player({onGround:true}),b={...a};
 tick(wet,a,{forward:1},20);tick(dry,b,{forward:1},20);
 assert.deepEqual(a,b);
});
test('actual Pack2 lower stair climbs both authored treads without penetration',()=>{
 const world=room();
 for(let x=-2;x<=2;x++)for(let z=-2;z<=3;z++)assert.equal(world.set(x,Y-1,z,BLOCK.STONE),true);
 assert.equal(world.placePack2(0,Y,1,64,{rotation:0,variant:'lower'}),true);
 const p=player({z:.65,onGround:true,coyote:.09}),levels=[];
 for(let i=0;i<40;i++){
  const e=stepPlayer(world,p,{forward:1},dt);
  if(e.stepped)levels.push(p.feet);
  assert.equal(collides(world,p.x,p.feet,p.z),false);
 }
 assert.ok(levels.some(y=>Math.abs(y-Y-.5)<.002));
 assert.ok(levels.some(y=>Math.abs(y-Y-1)<.002));
});
test('existing climb hook retains precedence over water and jump',()=>{
 const world=fill(room(),[Y-1,Y,Y+1,Y+2,Y+3]);world.stagedNonblockClimb=()=>true;
 const p=player(),e=stepPlayer(world,p,{forward:1,jump:true},dt);
 assert.equal(e.jumped,false);assert.equal(p.vY,2);assert.equal(p.z,.5);assert.equal(p.jumpBuffer,0);
 assert.equal(collides(world,p.x,p.feet,p.z),false);
});
