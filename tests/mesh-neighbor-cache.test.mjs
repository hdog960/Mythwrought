import test from 'node:test';
import assert from 'node:assert/strict';
import {meshChunk,VoxelWorld,CHUNK_SIZE,WORLD_MIN_Y,WORLD_MAX_Y,BLOCK} from '../src/voxel.mjs';

const makeCounted=(world)=>{
  let reads=0;
  return {seed:world.seed,get(x,y,z){reads++;return world.get(x,y,z);},reads:()=>reads};
};

test('meshing samples each voxel at most once, including cross-chunk and vertical halo',()=>{
  const world=new VoxelWorld(179), counted=makeCounted(world);
  const mesh=meshChunk(counted,-2,3);
  assert.ok(mesh.length>0);
  const halo=(CHUNK_SIZE+2)**2*(WORLD_MAX_Y-WORLD_MIN_Y+3);
  assert.ok(counted.reads()<=halo, 'a voxel was queried more than once');
  assert.ok(counted.reads()<CHUNK_SIZE*CHUNK_SIZE*(WORLD_MAX_Y-WORLD_MIN_Y+1)*3,
    'neighbor sampling did not reduce repeated world queries');
});

test('cached mesh exactly matches ordinary world for saved edits and cave-adjacent chunks',()=>{
  const world=new VoxelWorld(179);
  for(const [x,y,z,id] of [[-1,4,0,BLOCK.AIR],[0,4,0,BLOCK.CRYSTAL],[15,5,15,BLOCK.WOOD],[16,5,15,BLOCK.AIR]])
    assert.equal(world.set(x,y,z,id),true);
  const restored=VoxelWorld.restore(world.save());
  for(const [cx,cz] of [[0,0],[1,0],[-1,0],[-2,3]]){
    const direct=meshChunk(world,cx,cz);
    const loaded=meshChunk(restored,cx,cz);
    assert.deepEqual(loaded,direct);
    assert.deepEqual(meshChunk(makeCounted(restored),cx,cz),direct);
  }
});
