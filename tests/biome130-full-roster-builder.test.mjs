// Exact-source acceptance for automated physical biome130 families 081–130.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BIOME130_LIVE_COUNT,BIOME130_REGISTERED_IDS,BIOME130_REGISTERED_SYMBOLS,
  biome130Block,biome130Color,isBiome130BlockId} from '../src/biome130-registry.mjs';
import {resolveBiome130BuilderAsset,BIOME130_BUILDER_SYMBOLS,
  BIOME130_BUILDER_AVAILABILITY,planBiome130BuilderStructure,
  placeBiome130BuilderStructure} from '../src/builder-assets/biome130.mjs';
import {VoxelWorld,BLOCK,meshChunk,raycast,collides} from '../src/voxel.mjs';
import {meshDepthSection} from '../src/depth-mesh.mjs';
import {BUILD_MATERIALS,BLOCK_NAMES} from '../src/blocks.mjs';

test('130 physical catalog IDs are contiguous, unique, source-backed and builder-visible',()=>{
  assert.equal(BIOME130_LIVE_COUNT,130);
  assert.equal(BIOME130_REGISTERED_IDS.length,130);
  assert.equal(new Set(BIOME130_REGISTERED_IDS).size,130);
  assert.equal(new Set(BIOME130_REGISTERED_SYMBOLS).size,130);
  assert.deepEqual(BIOME130_BUILDER_SYMBOLS,BIOME130_REGISTERED_SYMBOLS);
  assert.equal(BIOME130_BUILDER_AVAILABILITY.families,130);
  for(let n=1;n<=130;n++){
    const id=255+n,symbol='biome130:'+String(n).padStart(3,'0');
    assert.equal(isBiome130BlockId(id),true);
    assert.equal(BIOME130_REGISTERED_IDS[n-1],id);
    assert.equal(BIOME130_REGISTERED_SYMBOLS[n-1],symbol);
    const definition=biome130Block(symbol),builder=resolveBiome130BuilderAsset(symbol,'west');
    assert.equal(definition.blockId,id);
    assert.equal(builder.blockId,id);
    assert.equal(builder.worldRegistered,true);
    assert.equal(builder.builderUsable,true);
    assert.equal(builder.yaw,3);
    assert.deepEqual(builder.shape.boxes,biome130Block(id,3).boxes);
    assert.ok(BUILD_MATERIALS.includes(id));
    assert.equal(BLOCK_NAMES[id],definition.name);
    assert.ok(definition.boxes.length>0&&definition.boxes.length<=32);
    assert.ok(definition.boxes.every(b=>b.length===6&&b.every(Number.isFinite)));
    assert.ok(biome130Color(id,n,18,n,4).every(v=>v>=0&&v<=1));
    if(n>=122){
      assert.equal(definition.solid,false,'Natural foliage must not block player movement');
      assert.equal(definition.alphaMode,'cutout');
    }
    if(n>=81&&n<=90)assert.equal(definition.solid,true);
  }
  for(const id of [255,386,65535,9,109,159,209]){
    assert.equal(isBiome130BlockId(id),false);
  }
  assert.throws(()=>resolveBiome130BuilderAsset('biome130:131'),RangeError);
});

test('every new family 081–130 can be physically edited, restored and removed in schema-1',()=>{
  const world=new VoxelWorld(179),original=world.save();
  for(let n=81;n<=130;n++){
    const x=8000+n,y=18,z=8100,id=255+n,turn=n%4;
    assert.equal(world.set(x,y,z,id,turn),true);
    assert.equal(world.get(x,y,z),id);
    assert.equal(world.rotationAt(x,y,z),turn);
  }
  assert.equal(world.biomeCellCount,50);
  const snapshot=JSON.parse(JSON.stringify(world.save()));
  assert.equal(snapshot.schema,1);
  assert.equal(snapshot.edits.length,50);
  const restored=VoxelWorld.restore(snapshot);
  assert.deepEqual(restored.save(),snapshot);
  assert.equal(restored.biomeCellCount,50);
  for(let n=81;n<=130;n++)assert.equal(restored.set(8000+n,18,8100,BLOCK.AIR),true);
  assert.equal(restored.biomeCellCount,0);
  assert.deepEqual(VoxelWorld.restore(original).save(),original);
  assert.equal(restored.set(9999,18,9999,386),false);
});

test('source geometry physically meshes in surface and deep world for new IDs',()=>{
  const world=new VoxelWorld(179);
  for(let n=81;n<=130;n++){
    assert.equal(world.set(9500+n,18,9500,255+n,n%4),true);
  }
  for(let cx=Math.floor(9581/16);cx<=Math.floor(9630/16);cx++){
    const vertices=meshChunk(world,cx,Math.floor(9500/16));
    assert.equal(vertices.length%9,0);
    assert.ok(vertices.every(Number.isFinite));
  }
  assert.equal(world.set(9600,-60,9600,385,2),true);
  const underground=meshDepthSection(world,600,600,-4);
  assert.ok(underground.length>0);
  assert.ok(underground.every(Number.isFinite));
});

test('physical builder can plan, persist, and restore dungeon, stone, raw log and foliage',()=>{
  const world=new VoxelWorld(179);
  const origin=[9000,18,9000],symbols=[81,91,101,113,122,130];
  const placements=symbols.map((n,i)=>({
    at:[i,0,0],asset:'biome130:'+String(n).padStart(3,'0'),orientation:i%4
  }));
  const plan=planBiome130BuilderStructure(placements,{origin});
  assert.equal(plan.builderReady,true);
  assert.equal(plan.cells.length,6);
  assert.ok(plan.worldBoxes.length>6);
  assert.equal(placeBiome130BuilderStructure(world,plan),true);
  assert.equal(placeBiome130BuilderStructure(world,plan),false);
  assert.deepEqual(VoxelWorld.restore(world.save()).save(),world.save());
  for(let i=0;i<symbols.length;i++){
    assert.equal(world.get(origin[0]+i,18,origin[2]),255+symbols[i]);
    assert.equal(world.rotationAt(origin[0]+i,18,origin[2]),i%4);
  }
  const leafId=385,leafX=origin[0]+5;
  assert.equal(world.get(leafX,18,origin[2]),leafId);
  assert.equal(collides(world,leafX+.5,18,origin[2]+.5),false);
  const hit=raycast(world,[leafX+.5,18.5,origin[2]-1],[0,0,1],4);
  assert.ok(hit,'Foliage must remain selectable even when non-solid');
});
