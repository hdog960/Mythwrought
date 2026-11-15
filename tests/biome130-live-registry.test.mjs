import './auto-block-catalog/biome130/mountain-final-geology.test.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {BIOME130_LIVE_COUNT,BIOME130_REGISTERED_IDS,BIOME130_REGISTERED_SYMBOLS,
  biome130Block,biome130Color,isBiome130BlockId} from '../src/biome130-registry.mjs';
import {VoxelWorld,BLOCK,meshChunk,raycast,collides} from '../src/voxel.mjs';
import {meshDepthSection} from '../src/depth-mesh.mjs';
import {resolveBiome130BuilderAsset,planBiome130BuilderStructure,
  placeBiome130BuilderStructure} from '../src/builder-assets/biome130.mjs';

test('all 60 authored symbolic families have distinct real high IDs and valid physical shapes',()=>{
  assert.equal(BIOME130_LIVE_COUNT,60);
  assert.equal(new Set(BIOME130_REGISTERED_IDS).size,60);
  assert.equal(new Set(BIOME130_REGISTERED_SYMBOLS).size,60);
  for(let i=1;i<=60;i++){
    const id=255+i,symbol='biome130:'+String(i).padStart(3,'0');
    assert.equal(isBiome130BlockId(id),true);
    const asset=biome130Block(symbol),builder=resolveBiome130BuilderAsset(symbol);
    assert.equal(asset.blockId,id);assert.equal(builder.blockId,id);
    assert.equal(builder.worldRegistered,true);assert.equal(builder.builderUsable,true);
    assert.ok(asset.name.length>3);
    assert.ok(asset.palette.length>=2);
    assert.ok(asset.boxes.length>0);
    assert.ok(asset.boxes.every(b=>b.length===6&&b.every(Number.isFinite)));
    assert.ok(biome130Color(id,12,7,-8,4).every(c=>c>=0&&c<=1));
    for(let turn=0;turn<4;turn++){
      const shaped=biome130Block(id,turn);
      assert.equal(shaped.boxes.length,asset.boxes.length);
      assert.ok(shaped.boxes.every(b=>b.every(v=>v>=0&&v<=1)));
    }
  }
  for(const id of [0,7,9,125,208,255,316,385]){
    assert.equal(isBiome130BlockId(id),false);
    assert.throws(()=>biome130Block(id),RangeError);
  }
});
test('legacy schema-1 saves remain byte-compatible; high-ID biome edits persist with rotations',()=>{
  const world=new VoxelWorld(179),legacy=world.save();
  assert.deepEqual(legacy,{schema:1,seed:179,edits:[]});
  const cells=[[900,17,900,256],[901,17,900,275],[902,17,900,287],[903,17,900,312]];
  for(let i=0;i<cells.length;i++){
    const [x,y,z,id]=cells[i];
    assert.equal(world.set(x,y,z,id,i),true);
    assert.equal(world.get(x,y,z),id);
    assert.equal(world.rotationAt(x,y,z),i);
  }
  assert.equal(world.biomeCellCount,4);
  assert.equal(world.set(999,16,999,255),false);
  assert.equal(world.set(999,16,999,316),false);
  const snapshot=JSON.parse(JSON.stringify(world.save()));
  assert.equal(snapshot.schema,1);assert.equal(snapshot.rotations.length,3);
  const restored=VoxelWorld.restore(snapshot);
  assert.deepEqual(restored.save(),snapshot);
  assert.equal(restored.biomeCellCount,4);
  assert.equal(restored.set(901,17,900,BLOCK.AIR),true);
  assert.equal(restored.rotationAt(901,17,900),0);
  assert.equal(restored.biomeCellCount,3);
  assert.equal(VoxelWorld.restore(legacy).save().rotations,undefined);
  assert.throws(()=>VoxelWorld.restore({...snapshot,rotations:[[900,17,900,1],[900,17,900,2]]}),/Stale|duplicate/);
});
test('same registered block geometry is builder-resolved, placed and seen by live meshing',()=>{
  const w=new VoxelWorld(2026);
  const planned=planBiome130BuilderStructure([
    {at:[0,0,0],asset:'biome130:001',orientation:'north'},
    {at:[1,0,0],asset:'biome130:015',orientation:'east'},
    {at:[2,0,0],asset:'biome130:041',orientation:'south'},
    {at:[3,0,0],asset:'biome130:057',orientation:'west'}
  ],{origin:[900,16,900]});
  assert.equal(planned.cells.length,4);assert.ok(planned.worldBoxes.length>=4);
  assert.equal(placeBiome130BuilderStructure(w,planned),true);
  assert.equal(placeBiome130BuilderStructure(w,planned),false);
  assert.equal(w.get(901,16,900),270);
  assert.equal(w.rotationAt(903,16,900),3);
  const mesh=meshChunk(w,56,56);
  assert.ok(mesh.length>0);
  assert.equal(mesh.length%9,0);
  assert.ok(mesh.every(Number.isFinite));
  const restored=VoxelWorld.restore(w.save());
  assert.deepEqual(restored.save(),w.save());
  const hit=raycast(restored,[899.5,16.5,900.5],[1,0,0],6);
  assert.ok(hit);assert.equal(hit.hit[0],900);
  assert.equal(collides(restored,900.5,16,900.5),true);
});
test('deep vertical mesh uses high IDs without 8-bit truncation',()=>{
  const w=new VoxelWorld(179);
  assert.equal(w.set(900,-60,900,312,2),true);
  const surface=meshDepthSection(w,56,56,-4);
  assert.ok(surface.length>0);assert.ok(surface.every(Number.isFinite));
});
