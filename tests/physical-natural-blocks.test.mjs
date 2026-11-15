import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,meshChunk,WORLD_MIN_Y,WORLD_MAX_Y,baseBlock,raycast,collides} from '../src/voxel.mjs';
import {BUILD_MATERIALS,BLOCK_NAMES,applyBlockAction} from '../src/blocks.mjs';
import {WORLD_MIN_Y as EDITABLE_WORLD_MIN_Y,LEGACY_WORLD_MIN_Y} from '../src/depth.mjs';
import {STORYBOOK_MATERIAL_FRAGMENT_SHADER as FS,STORYBOOK_ART_RULES as ART} from '../src/storybook-materials.mjs';

test('stable natural block allocation keeps legacy IDs and independent render-only tags',()=>{
 assert.deepEqual([BLOCK.AIR,BLOCK.GRASS,BLOCK.DIRT,BLOCK.STONE,BLOCK.WOOD,BLOCK.CRYSTAL,BLOCK.ORE],[0,1,2,3,4,5,6]);
 assert.equal(BLOCK.LEAVES,7);assert.equal(BLOCK.DEEPSTONE,8);
 assert.deepEqual(ART.physicalNaturalMaterials,{leaves:{blockId:7,shaderTag:18},deepstone:{blockId:8,shaderTag:19}});
 assert.match(FS,/vMat==18/);assert.match(FS,/vMat==19/);
 assert.match(FS,/float leafCluster=/);assert.match(FS,/float seam=/);
 assert.doesNotMatch(FS,/sampler2D|discard;/);
});
test('new natural voxels are actual solid editable raycastable and save-restorable blocks',()=>{
 for(const seed of [179,0,-184]){
  const world=new VoxelWorld(seed);
  for(const [id,x] of [[BLOCK.LEAVES,35],[BLOCK.DEEPSTONE,37]]){
   const y=16,z=33;
   assert.equal(baseBlock(x,y,z,seed),BLOCK.AIR);
   assert.equal(world.set(x,y,z,id),true);
   assert.equal(world.get(x,y,z),id);
   assert.equal(collides(world,x+.5,y,z+.5),true);
   assert.deepEqual(raycast(world,[x+.5,y+.5,z-2],[0,0,1],6)?.hit,[x,y,z]);
  }
  const saved=world.save();assert.equal(saved.schema,1);
  const restored=VoxelWorld.restore(saved);
  assert.deepEqual(restored.save(),saved);
  assert.equal(restored.get(35,16,33),BLOCK.LEAVES);
  assert.equal(restored.get(37,16,33),BLOCK.DEEPSTONE);
  assert.equal(restored.set(35,16,33,BLOCK.AIR),true);
  assert.equal(restored.get(35,16,33),BLOCK.AIR);
  assert.equal(world.set(35,WORLD_MAX_Y+1,33,BLOCK.LEAVES),false);
  // The preserved cave-generation floor is -3, but engine-owned edits now
  // extend to -210; reject exactly below the NEW editable floor, not -4.
  assert.equal(WORLD_MIN_Y,LEGACY_WORLD_MIN_Y);
  assert.equal(world.set(35,EDITABLE_WORLD_MIN_Y,33,BLOCK.DEEPSTONE),true);
  assert.equal(world.set(35,EDITABLE_WORLD_MIN_Y-1,33,BLOCK.DEEPSTONE),false);
 }
});
test('physical leaf and deepstone faces are meshed using distinct shader tags',()=>{
 const w=new VoxelWorld(179);
 w.set(0,16,0,BLOCK.LEAVES);w.set(1,16,0,BLOCK.DEEPSTONE);
 const mesh=meshChunk(w,0,0);
 assert.ok(mesh instanceof Float32Array&&mesh.length%9===0);
 const ids=new Set();
 for(let i=8;i<mesh.length;i+=9)ids.add(mesh[i]);
 assert.ok(ids.has(18),'leaf faces missing from chunk mesh');
 assert.ok(ids.has(19),'deepstone faces missing from chunk mesh');
 assert.ok(!ids.has(255));
});
test('legacy seeded terrain and existing save edits remain unchanged',()=>{
 for(const seed of [179,0,-184]){
  const w=new VoxelWorld(seed);
  const original=baseBlock(4,3,4,seed);
  assert.equal(w.get(4,3,4),original);
  assert.equal(w.set(4,3,4,BLOCK.ORE),true);
  assert.equal(VoxelWorld.restore(w.save()).get(4,3,4),BLOCK.ORE);
 }
});

test('physical natural blocks can be placed through the existing reversible edit API',()=>{
 for(const id of [BLOCK.LEAVES,BLOCK.DEEPSTONE]){
  assert.ok(BUILD_MATERIALS.includes(id));
  assert.ok(BLOCK_NAMES[id]);
  const world=new VoxelWorld(179);
  assert.equal(world.set(0,16,0,BLOCK.STONE),true);
  let rebuilt=0;
  const result=applyBlockAction(world,[.5,16.5,-2],[0,0,1],'place',id,
    {x:5,feet:16,z:5},()=>{rebuilt++;});
  assert.equal(result.ok,true,result.reason);
  assert.deepEqual(result.cell,[0,16,-1]);
  assert.equal(world.get(0,16,-1),id);
  assert.equal(rebuilt,1);
  assert.equal(VoxelWorld.restore(world.save()).get(0,16,-1),id);
 }
});
