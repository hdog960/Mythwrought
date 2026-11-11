import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,CHUNK_SIZE,chunkCoord,terrainHeight,baseBlock,meshChunk,raycast,collides,WORLD_MAX_Y} from '../src/voxel.mjs';

test('deterministic positive and negative coordinates',()=>{
  const a=new VoxelWorld(917),b=new VoxelWorld(917);
  for(let x=-39;x<39;x+=7)for(let z=-29;z<29;z+=9){
    assert.equal(terrainHeight(x,z,a.seed),terrainHeight(x,z,b.seed));
    for(let y=-3;y<19;y+=3)assert.equal(a.get(x,y,z),b.get(x,y,z));
  }
});
test('negative chunk boundaries use floor division',()=>{
  assert.equal(chunkCoord(-1),-1);assert.equal(chunkCoord(-16),-1);
  assert.equal(chunkCoord(-17),-2);assert.equal(chunkCoord(16),1);
});
test('edits survive restore and original values revert cleanly',()=>{
  const a=new VoxelWorld(440);
  const original=a.get(-5,15,19);
  assert.equal(original,BLOCK.AIR);
  a.set(-5,15,19,BLOCK.WOOD);
  a.set(5,2,5,BLOCK.AIR);
  const restored=VoxelWorld.restore(JSON.parse(JSON.stringify(a.save())));
  assert.equal(restored.get(-5,15,19),BLOCK.WOOD);
  assert.equal(restored.get(5,2,5),BLOCK.AIR);
  restored.set(-5,15,19,original);
  assert.equal(restored.edits.has('-5,15,19'),false);
});
test('invalid saves and out of bounds edits are rejected',()=>{
  const w=new VoxelWorld(1);
  assert.equal(w.set(0,WORLD_MAX_Y+1,0,BLOCK.STONE),false);
  assert.throws(()=>VoxelWorld.restore({schema:2,seed:1,edits:[]}));
  assert.throws(()=>VoxelWorld.restore({schema:1,seed:1,edits:[[0,20,0,3]]}));
});
test('chunk mesh has valid triangles and non-empty geometry',()=>{
  const a=new VoxelWorld(179);
  const mesh=meshChunk(a,-1,0);
  assert.ok(mesh.length>100);
  assert.equal(mesh.length%18,0);
  assert.ok([...mesh.slice(0,60)].every(Number.isFinite));
});
test('raycasts meet real block and report prior adjacent air',()=>{
  const a=new VoxelWorld(4);
  a.set(0,15,0,BLOCK.STONE);
  const hit=raycast(a,[.5,16.5,.5],[0,-1,0],6);
  assert.deepEqual(hit.hit,[0,15,0]);
  assert.deepEqual(hit.adjacent,[0,16,0]);
});
test('collision detects solid voxels without treating air as solid',()=>{
  const w=new VoxelWorld(4);
  w.set(0,15,0,BLOCK.STONE);
  assert.equal(collides(w,.5,15,.5),true);
  assert.equal(collides(w,.5,17,.5),false);
});
