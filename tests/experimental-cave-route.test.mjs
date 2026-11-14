import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,terrainHeight,WORLD_MIN_Y,collides} from '../src/voxel.mjs';
import {experimentalCaveWorld,caveRoute,CAVE_CANDIDATE} from '../src/experimental-cave-route.mjs';

for(const seed of [179,1,2026,-77]){
 test('opt-in cave route is physically open, descending, and deterministic for seed '+seed,()=>{
  const base=new VoxelWorld(seed), cave=experimentalCaveWorld(base);
  const {x,z,length}=CAVE_CANDIDATE,{floorAt}=caveRoute(seed);
  assert.equal(cave.get(x,terrainHeight(x,z,seed),z),BLOCK.AIR,'surface entrance breached');
  for(let t=0;t<=length;t++){
   const floor=floorAt(t);
   assert.equal(cave.get(x+t,floor,z),BLOCK.STONE,'solid walking floor at '+t);
   for(let y=floor+1;y<=floor+2;y++)for(let dz=-1;dz<=1;dz++)
    assert.equal(cave.get(x+t,y,z+dz),BLOCK.AIR,'two-block corridor clearance at '+t);
   assert.equal(collides(cave,x+t+.5,floor+1,z+.5),false,'player fits at '+t);
   if(t)assert.ok(Math.abs(floor-floorAt(t-1))<=1,'no impassable vertical step');
  }
  assert.ok(floorAt(length)<floorAt(0),'corridor descends underground');
  for(let dz=-3;dz<=3;dz++)for(let dy=1;dy<=4;dy++)
   assert.equal(cave.get(x+length-2,floorAt(length-2)+dy,z+dz),BLOCK.AIR,'chamber space');
  assert.deepEqual(base.save(),new VoxelWorld(seed).save(),'default world untouched');
 });
}
test('explicit saved player blocks and mined cells override candidate cave',()=>{
 const world=new VoxelWorld(179),{x,z}=CAVE_CANDIDATE;
 const y=caveRoute(179).floorAt(8)+1;
 assert.equal(world.set(x+8,y,z,BLOCK.WOOD),true);
 const cave=experimentalCaveWorld(world);
 assert.equal(cave.get(x+8,y,z),BLOCK.WOOD);
 const saved=world.save(),restored=VoxelWorld.restore(saved);
 assert.equal(experimentalCaveWorld(restored).get(x+8,y,z),BLOCK.WOOD);
});
test('candidate leaves all ordinary world positions untouched outside route',()=>{
 const world=new VoxelWorld(179),cave=experimentalCaveWorld(world);
 for(const [x,y,z] of [[0,0,0],[64,-3,80],[99,8,64],[65,7,75],[-17,2,6]])
  assert.equal(cave.get(x,y,z),world.get(x,y,z));
});
