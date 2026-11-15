import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides,meshChunk,raycast} from '../src/voxel.mjs';
import {Pack2LiveWorld,savePack2LiveWorld,loadPack2LiveWorld} from '../src/pack2-world.mjs';
import {isPack2LiveId,PACK2_LIVE_IDS,pack2NormalizeState} from '../src/pack2-integration.mjs';
import {BIOME130_REGISTERED_IDS,BIOME130_REGISTERED_SYMBOLS}
  from '../src/biome130-registry.mjs';
import {PACK2_BUILDER_SYMBOLS,resolvePack2BuilderAsset}
  from '../src/builder-assets/pack2.mjs';
import {BIOME130_BUILDER_SYMBOLS,resolveBiome130BuilderAsset}
  from '../src/builder-assets/biome130.mjs';
import {PACK3_BUILDER_SYMBOLS} from '../src/builder-assets/pack3.mjs';
const memory=()=>{const cells=new Map();return {
  getItem:k=>cells.has(k)?cells.get(k):null,
  setItem:(k,v)=>cells.set(k,String(v))
}};
test('60 incorporated biome, 18 Pack 2 and Pack 3 roster symbols remain distinct',()=>{
  assert.equal(BIOME130_REGISTERED_IDS.length,60);
  assert.deepEqual([...PACK2_LIVE_IDS].sort((a,b)=>a-b),
    Array.from({length:18},(_,i)=>59+i));
  assert.equal(new Set([...BIOME130_REGISTERED_IDS,...PACK2_LIVE_IDS]).size,78);
  assert.ok(BIOME130_REGISTERED_IDS.every(id=>id>255));
  assert.ok(PACK2_LIVE_IDS.every(id=>id<255&&isPack2LiveId(id)));
  const symbols=[...PACK2_BUILDER_SYMBOLS,...BIOME130_BUILDER_SYMBOLS,...PACK3_BUILDER_SYMBOLS];
  assert.equal(new Set(symbols).size,symbols.length);
  assert.equal(resolvePack2BuilderAsset('pack2:013').blockId,59);
  assert.equal(resolveBiome130BuilderAsset('biome130:001').blockId,256);
  assert.equal(BIOME130_REGISTERED_SYMBOLS[0],'biome130:001');
});
test('mixed biome rotation and Pack 2 overlay preserve original schema-1 save plus sidecar',()=>{
  const base=new VoxelWorld(179),world=new Pack2LiveWorld(base);
  const timber=[500,19,500],modern=[503,19,500],water=[506,19,500];
  for(const p of [timber,modern,water])assert.equal(base.get(...p),BLOCK.AIR);
  assert.equal(world.set(...modern,BIOME130_REGISTERED_IDS[0],3),true);
  assert.equal(world.rotationAt(...modern),3);
  assert.equal(world.biomeCellCount,1);
  assert.equal(world.set(...timber,59),true);
  assert.equal(world.placePack2(...water,76,
    pack2NormalizeState(76,{level:4,flow:'east'})),true);
  assert.equal(world.get(...timber),59);
  assert.equal(base.get(...timber),BLOCK.AIR);
  const old=world.save();
  assert.equal(old.schema,1);
  assert.deepEqual(old.edits.map(row=>row[3]),[BIOME130_REGISTERED_IDS[0]]);
  assert.deepEqual(old.rotations,[[...modern,3]]);
  const store=memory();
  assert.equal(savePack2LiveWorld(store,world).ok,true);
  const restored=loadPack2LiveWorld(store,VoxelWorld.restore(old)).world;
  assert.deepEqual(restored.save(),old);
  assert.equal(restored.rotationAt(...modern),3);
  assert.equal(restored.biomeCellCount,1);
  assert.equal(restored.get(...timber),59);
  assert.equal(restored.get(...water),76);
  assert.deepEqual(restored.getPack2State(...water),
    pack2NormalizeState(76,{level:4,flow:'east'}));
  assert.equal(restored.set(...modern,59),false,
    'Manual candidate must never silently replace saved biome geometry');
});
test('mixed-world fluid targeting and solid geometry remain shape-aware',()=>{
  const base=new VoxelWorld(179),world=new Pack2LiveWorld(base);
  const water=[500,19,500],solid=[500,19,501];
  assert.equal(base.get(...water),BLOCK.AIR);
  assert.equal(base.get(...solid),BLOCK.AIR);
  assert.equal(world.set(...water,76),true);
  assert.equal(world.set(...solid,BIOME130_REGISTERED_IDS[0],0),true);
  const origin=[500.5,19.5,498.5],direction=[0,0,1];
  assert.deepEqual(raycast(world,origin,direction,6)?.hit,water,
    'Water exact surface is nearer than solid modern voxel');
  assert.equal(collides(world,500.5,19,500.5),false,
    'Static manual water must be non-solid even with biome blocks present');
  assert.equal(world.set(...water,BLOCK.AIR),true);
  assert.deepEqual(raycast(world,origin,direction,6)?.hit,solid,
    'Biome material remains targetable without manual overlay');
  const vertices=meshChunk(world,31,31);
  assert.ok(vertices.length>0&&vertices.length%9===0);
});
