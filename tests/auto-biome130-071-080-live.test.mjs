// Automation-only live physical block acceptance, underground families 071–080.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BIOME130_REGISTERED_IDS,biome130Block} from '../src/biome130-registry.mjs';
import {VoxelWorld,meshChunk,BLOCK} from '../src/voxel.mjs';
import {resolveBiome130BuilderAsset,planBiome130BuilderStructure,
  placeBiome130BuilderStructure} from '../src/builder-assets/biome130.mjs';
test('all ten underground families register distinct physical shapes and builder rotations',()=>{
 assert.equal(BIOME130_REGISTERED_IDS.length,80);
 for(let n=71;n<=80;n++){
  const id=255+n,symbol='biome130:'+String(n).padStart(3,'0');
  const asset=biome130Block(symbol),builder=resolveBiome130BuilderAsset(symbol,'east');
  assert.equal(asset.blockId,id);assert.equal(builder.blockId,id);
  assert.equal(asset.solid,true);assert.equal(asset.opacity,1);
  assert.equal(builder.livePlaceable,true);
  assert.ok(asset.boxes.length>1,'non-cube source shape '+symbol);
  assert.ok(asset.boxes.every(b=>b.length===6&&b.every(Number.isFinite)));
  assert.deepEqual(biome130Block(id,1).boxes,builder.shape.boxes);
 }
 assert.equal(new Set(BIOME130_REGISTERED_IDS).size,80);
});
test('all underground family blocks persist through schema-1 saves and real chunk meshing',()=>{
 const world=new VoxelWorld(179),legacy=world.save();
 assert.deepEqual(legacy,{schema:1,seed:179,edits:[]});
 for(let n=71;n<=80;n++){
  const x=830+n,id=255+n,rotation=n%4;
  assert.equal(world.get(x,16,850),BLOCK.AIR);
  assert.equal(world.set(x,16,850,id,rotation),true);
  assert.equal(world.get(x,16,850),id);
  assert.equal(world.rotationAt(x,16,850),rotation);
 }
 const snapshot=world.save(),restored=VoxelWorld.restore(JSON.parse(JSON.stringify(snapshot)));
 assert.equal(snapshot.schema,1);assert.deepEqual(restored.save(),snapshot);
 assert.equal(restored.biomeCellCount,10);
 assert.equal(restored.set(901,16,850,BLOCK.AIR),true);
 assert.equal(restored.rotationAt(901,16,850),0);
 assert.equal(restored.biomeCellCount,9);
 assert.equal(restored.set(999,16,999,255),false);
 assert.equal(restored.set(999,16,999,336),false);
 assert.deepEqual(VoxelWorld.restore(legacy).save(),legacy);
 meshChunk(world,56,53);
});
test('four independent underground authored geometries are buildable without overwriting',()=>{
 const world=new VoxelWorld(2026);
 const plan=planBiome130BuilderStructure([
  {at:[0,0,0],asset:'biome130:071',orientation:'north'},
  {at:[1,0,0],asset:'biome130:074',orientation:'east'},
  {at:[2,0,0],asset:'biome130:077',orientation:'south'},
  {at:[3,0,0],asset:'biome130:080',orientation:'west'}
 ],{origin:[960,16,960]});
 assert.equal(plan.cells.length,4);assert.ok(plan.worldBoxes.length>12);
 assert.equal(placeBiome130BuilderStructure(world,plan),true);
 assert.equal(placeBiome130BuilderStructure(world,plan),false);
 for(let i=0;i<4;i++){
  assert.equal(world.get(960+i,16,960),[326,329,332,335][i]);
  assert.equal(world.rotationAt(960+i,16,960),i);
 }
 assert.deepEqual(VoxelWorld.restore(world.save()).save(),world.save());
});
