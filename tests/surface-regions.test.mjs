import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,terrainHeight,BLOCK} from '../src/voxel.mjs';
import {surfaceRegionAt,surfaceHeightAt,surfaceRegionWorld,SURFACE_REGIONS} from '../src/surface-regions.mjs';
import {LEGACY_WORLD_MIN_Y} from '../src/depth.mjs';
for(const seed of [179,1,42,909]){
 test('four physical multi-chunk surface regions seed '+seed,()=>{
  const world=new VoxelWorld(seed),candidate=surfaceRegionWorld(world,{newWorld:true});
  for(const region of SURFACE_REGIONS){
   for(const [dx,dz] of [[0,0],[16,0],[-16,0],[0,16],[0,-16]]){
    const x=region.x+dx,z=region.z+dz,h=surfaceHeightAt(x,z,seed);
    assert.equal(surfaceRegionAt(x,z,seed).name,region.name);
    assert.equal(candidate.get(x,h,z),region.top);
    assert.equal(candidate.get(x,h+1,z),BLOCK.AIR);
    assert.notEqual(candidate.get(x,h-1,z),BLOCK.AIR);
   }
  }
 });
 test('save edits override region and deep/legacy seed untouched '+seed,()=>{
  const world=new VoxelWorld(seed),x=192,z=0,h=surfaceHeightAt(x,z,seed);
  assert.throws(()=>surfaceRegionWorld(world),/opt-in/);
  assert.equal(world.set(x,h,z,BLOCK.CRYSTAL),true);
  const candidate=surfaceRegionWorld(world,{newWorld:true});
  assert.equal(candidate.get(x,h,z),BLOCK.CRYSTAL);
  assert.equal(candidate.get(x,LEGACY_WORLD_MIN_Y-1,z),world.get(x,LEGACY_WORLD_MIN_Y-1,z));
  const restored=VoxelWorld.restore(world.save());
  assert.equal(surfaceRegionWorld(restored,{newWorld:true}).get(x,h,z),BLOCK.CRYSTAL);
  for(const [px,pz] of [[0,0],[5,8],[64,64]]){
   for(let y=LEGACY_WORLD_MIN_Y;y<=terrainHeight(px,pz,seed)+2;y++)
    assert.equal(candidate.get(px,y,pz),world.get(px,y,pz));
  }
 });
 test('same-seed boundaries are stable '+seed,()=>{
  const a=surfaceRegionAt(240,22,seed),b=surfaceRegionAt(240,22,seed);
  assert.deepEqual(a,b);
  assert.equal(surfaceHeightAt(240,22,seed),surfaceHeightAt(240,22,seed));
 });
}
