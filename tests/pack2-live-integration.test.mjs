import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {WORLD_MIN_Y} from '../src/depth.mjs';
import {PACK2_LIVE_IDS,pack2NormalizeState,pack2ShapeOf,pack2AuthoredMesh,
  pack2WorldVertices,pack2BodyIntersects,pack2RayHit,pack2CycleState,
  isPack2LiveId,pack2IsFluid} from '../src/pack2-integration.mjs';
import {Pack2LiveWorld,pack2StorageKey,loadPack2LiveWorld,savePack2LiveWorld,
  pack2ExportBundle,pack2ImportBundle} from '../src/pack2-world.mjs';

const store=()=>{const entries=new Map();return {
  getItem:k=>entries.has(k)?entries.get(k):null,
  setItem:(k,v)=>entries.set(k,String(v)),
  removeItem:k=>entries.delete(k),
  entries
}};
const point=i=>[400+i,19,140];
test('all 18 creator-approved candidate IDs remain distinct and original VoxelWorld stays unchanged',()=>{
  assert.deepEqual(PACK2_LIVE_IDS,Array.from({length:18},(_,i)=>i+59));
  assert.equal(new Set(PACK2_LIVE_IDS).size,18);
  const base=new VoxelWorld(179);
  for(const id of PACK2_LIVE_IDS){
    assert.equal(isPack2LiveId(id),true);
    assert.equal(base.set(...point(id),id),false,'legacy engine cannot silently accept IDs');
    const state=pack2NormalizeState(id);
    assert.equal(state.id,id);
    const mesh=pack2AuthoredMesh(id,state);
    assert.ok(mesh.triangles>=12&&mesh.indices.length/3===mesh.triangles,id);
    const raw=pack2WorldVertices(id,state,[0,0,0]);
    assert.equal(raw.length,mesh.indices.length*9);
    assert.ok([...raw].every(Number.isFinite));
    for(let i=8;i<raw.length;i+=9)
      assert.equal(Math.floor(raw[i]),id===76?20:21,'candidate material must not alias legacy ID');
  }
  assert.deepEqual(base.save(),{schema:1,seed:179,edits:[]});
});
test('approved opaque profiles have actual physical parts and transparent water is passable',()=>{
  for(const id of PACK2_LIVE_IDS){
    const state=pack2NormalizeState(id),shape=pack2ShapeOf(id,state);
    if(pack2IsFluid(id)){
      assert.equal(shape.solidCollision,false);
      assert.equal(shape.boxes.length,0);
      assert.equal(pack2BodyIntersects(id,state,[0,0,0],
        {x:.5,z:.5,feet:0,radius:.28,height:1.78}),false);
    }else{
      assert.ok(shape.boxes.length>=1);
      assert.ok(shape.boxes.length<=32);
    }
  }
  assert.ok(pack2RayHit(76,pack2NormalizeState(76,{level:4,flow:'north'}),
    [.5,2,.5],[0,-1,0],[0,0,0],6));
  assert.equal(pack2BodyIntersects(63,pack2NormalizeState(63,{variant:'lower'}),
    [0,0,0],{x:.5,z:.5,feet:.65,radius:.28,height:.2}),false);
  assert.equal(pack2BodyIntersects(63,pack2NormalizeState(63,{variant:'upper'}),
    [0,0,0],{x:.5,z:.5,feet:.65,radius:.28,height:.2}),true);
});
test('four rotations, hinges, water level and infrastructure variants cycle without consuming new IDs',()=>{
  let fence=pack2NormalizeState(65);
  for(let i=0;i<4;i++)fence=pack2CycleState(65,fence,'rotate');
  assert.equal(fence.rotation,0);
  let gate=pack2CycleState(66,pack2NormalizeState(66),'toggle');
  assert.equal(gate.open,true);
  gate=pack2CycleState(66,gate,'toggle');assert.equal(gate.open,false);
  const next=pack2CycleState(73,pack2NormalizeState(73),'variant');
  assert.equal(next.variant,'terminal');
  const water=pack2CycleState(76,pack2NormalizeState(76),'water-level');
  assert.equal(water.level,1);assert.equal(water.source,false);
  assert.equal(pack2CycleState(76,water,'water-flow').flow,'north');
  for(const id of PACK2_LIVE_IDS)assert.equal(pack2CycleState(id,pack2NormalizeState(id),'rotate').id,id);
});
test('Pack 2 overlay places, targets, changes state and removes real candidate cells without schema-1 mutations',()=>{
  const base=new VoxelWorld(179),before=JSON.stringify(base.save());
  const live=new Pack2LiveWorld(base);
  assert.equal(live.set(...point(0),65),true);
  assert.equal(live.get(...point(0)),65);
  assert.equal(base.get(...point(0)),BLOCK.AIR);
  assert.equal(JSON.stringify(live.save()),before);
  const door=pack2NormalizeState(67,{rotation:1,open:true});
  assert.equal(live.placePack2(...point(1),67,door),true);
  assert.deepEqual(live.getPack2State(...point(1)),door);
  assert.equal(live.updatePack2State(...point(1),{...door,open:false}),true);
  assert.equal(live.getPack2State(...point(1)).open,false);
  assert.equal(live.set(...point(0),BLOCK.AIR),true);
  assert.equal(live.get(...point(0)),BLOCK.AIR);
  assert.equal(JSON.stringify(live.save()),before);
});
test('all 18 candidate shapes and states round-trip through independent verified per-seed sidecar',()=>{
  const storage=store(),base=new VoxelWorld(179),world=new Pack2LiveWorld(base);
  for(const [i,id] of PACK2_LIVE_IDS.entries())
    assert.equal(world.set(...point(i),id),true,'candidate placement failed '+id);
  assert.equal(world.pack2Cells.size,18);
  const written=savePack2LiveWorld(storage,world);
  assert.equal(written.ok,true,JSON.stringify(written));
  const key=pack2StorageKey(179);
  assert.ok(storage.getItem(key));
  assert.ok(storage.getItem(key+'-journal'));
  const loaded=loadPack2LiveWorld(storage,VoxelWorld.restore(base.save()));
  assert.equal(loaded.recovered,false);
  assert.deepEqual(loaded.world.pack2Snapshot(),world.pack2Snapshot());
  assert.equal(loaded.world.pack2Cells.size,18);
  assert.deepEqual(loaded.world.save(),{schema:1,seed:179,edits:[]});
  const exportBlob=pack2ExportBundle(world);
  const imported=pack2ImportBundle(exportBlob,VoxelWorld.restore(base.save()));
  assert.deepEqual(imported.pack2Snapshot(),world.pack2Snapshot());
  assert.deepEqual(imported.save(),base.save());
});
test('corrupt primary cannot silently erase saved Pack 2 work; verified journal rescues exact cells',()=>{
  const storage=store(),base=new VoxelWorld(179),world=new Pack2LiveWorld(base);
  world.set(...point(0),76);
  assert.equal(savePack2LiveWorld(storage,world).ok,true);
  const key=pack2StorageKey(base.seed),original=storage.getItem(key);
  storage.setItem(key,'{corrupted');
  const restored=loadPack2LiveWorld(storage,new VoxelWorld(base.seed));
  assert.equal(restored.recovered,true);
  assert.equal(restored.world.get(...point(0)),76);
  world.set(...point(1),65);
  assert.equal(savePack2LiveWorld(storage,world).ok,false);
  assert.equal(storage.getItem(key),'{corrupted','must not overwrite damaged bytes');
  storage.setItem(key,original);
  assert.equal(loadPack2LiveWorld(storage,new VoxelWorld(base.seed)).recovered,false);
});
test('no live overlay or sidecar writes occur for untouched legacy worlds',()=>{
  const storage=store(),base=new VoxelWorld(179);
  const wrapped=loadPack2LiveWorld(storage,base).world;
  assert.equal(wrapped.pack2Cells.size,0);
  assert.deepEqual(wrapped.save(),base.save());
  const wrote=savePack2LiveWorld(storage,wrapped);
  assert.deepEqual(wrote,{ok:true,unchanged:true});
  assert.equal(storage.entries.size,0);
});
test('rejects invalid IDs, edited solid terrain and unsafe/duplicate sidecar coordinates',()=>{
  const base=new VoxelWorld(179),world=new Pack2LiveWorld(base);
  assert.equal(world.set(0,WORLD_MIN_Y-1,0,59),false);
  assert.equal(world.set(...point(0),255),false);
  assert.equal(world.set(...point(0),-5),false);
  assert.equal(base.set(...point(2),BLOCK.STONE),true);
  assert.equal(world.set(...point(2),59),false,'must not overwrite old-world edits');
  const a={kind:'mythwrought-pack2-overlay',version:1,seed:179,
    cells:[[...point(0),59,pack2NormalizeState(59)]]};
  assert.equal(pack2ImportBundle({schema:1,seed:179,edits:[],pack2:a},base).get(...point(0)),59);
  for(const bad of [
    {...a,cells:[a.cells[0],a.cells[0]]},
    {...a,cells:[[...point(0),58,{id:58,rotation:0}]]},
    {...a,cells:[[1,WORLD_MIN_Y-1,1,59,pack2NormalizeState(59)]]},
    {...a,cells:[[...point(2),59,pack2NormalizeState(59)]]}
  ])assert.throws(()=>pack2ImportBundle({pack2:bad},base));
});
