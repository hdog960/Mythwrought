import test from 'node:test';
import assert from 'node:assert/strict';
import {meshChunk,VoxelWorld,BLOCK,CHUNK_SIZE} from '../src/voxel.mjs';

test('typed solid mesh grows past initial capacity without dropping vertices',()=>{
  // A deliberately exposed vertical wall creates more than the initial 16K
  // float capacity; each triangle vertex retains the 9-float GPU layout.
  const world=new VoxelWorld(179);
  for(let x=0;x<CHUNK_SIZE;x++)for(let z=0;z<CHUNK_SIZE;z++)
    for(let y=2;y<=12;y++)world.set(x,y,z,BLOCK.AIR);
  for(let z=0;z<CHUNK_SIZE;z++)for(let y=2;y<=12;y++)
    world.set(7,y,z,BLOCK.CRYSTAL);
  const mesh=meshChunk(world,0,0);
  assert.ok(mesh instanceof Float32Array);
  assert.equal(mesh.length%9,0);
  assert.ok(mesh.length>16384,'fixture must exercise typed-buffer growth');
  assert.ok(mesh.every(Number.isFinite));
  const crystalVertices=[];
  for(let i=0;i<mesh.length;i+=9)if(mesh[i+8]===BLOCK.CRYSTAL)crystalVertices.push(i);
  assert.ok(crystalVertices.length>=CHUNK_SIZE*11*6);
  assert.deepEqual(meshChunk(VoxelWorld.restore(world.save()),0,0),mesh);
});

test('chunk rebuild after mining retains exact stable vertex layout',()=>{
  const world=new VoxelWorld(179),original=meshChunk(world,-1,0);
  assert.equal(world.set(-1,4,1,BLOCK.CRYSTAL),true);
  const changed=meshChunk(world,-1,0);
  assert.notDeepEqual(changed,original);
  assert.deepEqual(changed,meshChunk(VoxelWorld.restore(world.save()),-1,0));
  assert.equal(world.set(-1,4,1,world.get(-1,4,1)),true);
  assert.deepEqual(meshChunk(world,-1,0),changed);
});
