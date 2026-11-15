// Pack 3 readiness gate: every approved physical family, every certified yaw,
// complete sidecar preservation, collision/mesh compatibility, and boundedness.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld} from '../src/voxel.mjs';
import {resolvePack3BuilderAsset,PACK3_BUILDER_SYMBOLS} from '../src/builder-assets/pack3.mjs';
import {meshPack3PhysicalAsset,PACK3_RUNTIME_LIMIT} from '../src/builder-assets/pack3-runtime.mjs';
import {createPack3LiveBridge,isPack3BlockId,pack3OverlayKey,PACK3_OVERLAY_PREVIOUS_GOOD_SUFFIX,
  combinePack3ChunkMesh,PACK3_MAX_ADDED_VERTICES_PER_CHUNK} from '../src/builder-assets/pack3-live.mjs';
const air=seed=>({seed,edits:new Map(),get:()=>BLOCK.AIR});
const disk=()=>{const values=new Map();return {
 values,getItem:key=>values.get(key)??null,
 setItem:(key,value)=>values.set(key,String(value)),
 removeItem:key=>values.delete(key)
};};
const player={x:1024,feet:18,z:1024};
const put=(b,id,cell,yaw=0,rebuild=()=>{})=>b.mutate({
 mode:'place',id,cell,orientation:yaw,player,rebuild
});
test('all 17 unique physical IDs 109–125 place, orient, persist and restore without schema-1 migration',()=>{
 const w=air(179),store=disk(),live=createPack3LiveBridge(w,store);
 assert.equal(PACK3_BUILDER_SYMBOLS.length,17);
 const ids=[],places=[];
 for(let i=0;i<17;i++){
  const id=109+i,cell=[16+(i%9),10,16+Math.floor(i/9)],yaw=id<=112?0:i%4;
  const placement=put(live,id,cell,yaw);
  assert.equal(placement.ok,true,JSON.stringify({id,placement}));
  assert.equal(live.getAt(...cell)?.id,id);
  assert.equal(live.getAt(...cell)?.yaw,yaw);
  assert.equal(live.runtime.readShape(...cell).boxes.length,
   resolvePack3BuilderAsset(PACK3_BUILDER_SYMBOLS[i],yaw).shape.boxes.length);
  assert.equal(isPack3BlockId(id),true);
  ids.push(id);places.push({id,cell,yaw});
 }
 assert.deepEqual(ids,Array.from({length:17},(_,i)=>109+i));
 const sidecar=JSON.parse(store.getItem(pack3OverlayKey(179)));
 assert.equal(sidecar.entries.length,17);
 assert.equal(sidecar.seed,179);
 assert.ok(sidecar.entries.every(e=>e.asset.startsWith('pack3:')));
 const restored=createPack3LiveBridge(air(179),store);
 assert.equal(restored.blocked,null);
 for(const {id,cell,yaw} of places){
  assert.equal(restored.getAt(...cell)?.id,id);
  assert.equal(restored.getAt(...cell)?.yaw,yaw);
  assert.ok(restored.runtime.readShape(...cell).boxes.length>0);
 }
 assert.equal(createPack3LiveBridge(air(180),store).runtime.size(),0,
  'A different world seed must not inherit saved physical construction');
});
test('all 56 certified physical shape/yaw meshes have finite source-true geometry and 9-float GPU layout',()=>{
 let count=0;
 const hashes=new Map();
 for(const symbol of PACK3_BUILDER_SYMBOLS){
  const asset=resolvePack3BuilderAsset(symbol);
  const allowed=asset.blockId<=112?[0]:[0,1,2,3];
  for(const yaw of allowed){
   const expected=resolvePack3BuilderAsset(symbol,yaw);
   const mesh=meshPack3PhysicalAsset(symbol,yaw);
   assert.equal(mesh.blockId,expected.blockId);
   assert.equal(mesh.yaw,yaw);
   assert.ok(mesh.vertexCount>0&&mesh.vertexCount<=PACK3_MAX_ADDED_VERTICES_PER_CHUNK);
   assert.equal(mesh.vertices.length,mesh.vertexCount*9);
   assert.equal(mesh.triangleCount*3,mesh.vertexCount);
   assert.ok(mesh.vertices.every(Number.isFinite));
   for(let n=0;n<mesh.vertices.length;n+=9){
    for(let xyz=0;xyz<3;xyz++){
     assert.ok(mesh.vertices[n+xyz]>=-1e-6&&mesh.vertices[n+xyz]<=1+1e-6,
      'Mesh escaped its voxel cell');
    }
   }
   count++;
  }
  hashes.set(asset.blockId,asset.shape.boxes.length);
 }
 assert.equal(count,56);
 assert.equal(hashes.size,17);
 assert.throws(()=>meshPack3PhysicalAsset('pack3:023',1),RangeError);
});
test('construction occupies physical chunk with one combined GPU buffer and bounded vertex budget',()=>{
 const world=air(19),bridge=createPack3LiveBridge(world,disk());
 const positions=[];
 for(let i=0;i<17;i++){
  const cell=[16+i%9,10,16+Math.floor(i/9)];
  assert.equal(put(bridge,109+i,cell,(i<4?0:i%4)).ok,true);
  positions.push(cell);
 }
 const original=new Float32Array([1,2,3,4,5,6,0,0,3]);
 const buffer=combinePack3ChunkMesh(original,bridge.runtime,1,1);
 assert.ok(buffer.length>original.length,'No physical GPU triangles emitted');
 assert.deepEqual([...buffer.slice(0,original.length)],[...original],
  'Legacy mesh changed when physical construction appended');
 assert.equal(buffer.length%9,0);
 const unrelated=combinePack3ChunkMesh(original,bridge.runtime,3,3);
 assert.strictEqual(unrelated,original,'Unoccupied chunks should allocate nothing');
 assert.throws(()=>bridge.runtime.chunkMesh(1,1,0,{maxVertices:8}),RangeError);
 assert.ok(buffer.length/9-original.length/9<=PACK3_MAX_ADDED_VERTICES_PER_CHUNK);
});
test('previous-good sidecar saved and verified before overwrite, with no schema-1 edits',()=>{
 const world=new VoxelWorld(179),canonical=JSON.stringify(world.save());
 const store=disk(),bridge=createPack3LiveBridge(world,store);
 const key=pack3OverlayKey(world.seed),backup=key+PACK3_OVERLAY_PREVIOUS_GOOD_SUFFIX;
 assert.equal(put(bridge,116,[70,18,70],1).ok,true);
 const prior=store.getItem(key);
 assert.equal(put(bridge,117,[71,18,70],2).ok,true);
 assert.equal(store.getItem(backup),prior);
 assert.equal(JSON.stringify(world.save()),canonical);
 assert.equal(JSON.parse(store.getItem(key)).entries.length,2);
 assert.equal(JSON.parse(store.getItem(backup)).entries.length,1);
});
test('concurrent-tab updates fail closed and never overwrite a newer saved construction',()=>{
 const store=disk(),world=air(17),a=createPack3LiveBridge(world,store);
 assert.equal(put(a,116,[8,10,8],2).ok,true);
 const stale=createPack3LiveBridge(air(17),store);
 assert.equal(put(a,117,[9,10,8],1).ok,true);
 const newest=store.getItem(pack3OverlayKey(17));
 const blocked=put(stale,118,[10,10,8],1);
 assert.equal(blocked.ok,false);
 assert.match(blocked.reason,/outside this session/);
 assert.equal(store.getItem(pack3OverlayKey(17)),newest);
 assert.equal(stale.runtime.size(),1);
});
test('bad source sidecar remains untouched while previous-good survives for explicit recovery',()=>{
 const store=disk(),seed=49,bridge=createPack3LiveBridge(air(seed),store);
 assert.equal(put(bridge,116,[5,10,5],1).ok,true);
 assert.equal(put(bridge,117,[6,10,5],2).ok,true);
 const key=pack3OverlayKey(seed),previous=store.getItem(key+PACK3_OVERLAY_PREVIOUS_GOOD_SUFFIX);
 store.setItem(key,'{damaged-data');
 const failed=createPack3LiveBridge(air(seed),store);
 assert.match(failed.blocked,/saved overlay protected/);
 assert.equal(put(failed,118,[7,10,5]).ok,false);
 assert.equal(store.getItem(key),'{damaged-data');
 assert.equal(store.getItem(key+PACK3_OVERLAY_PREVIOUS_GOOD_SUFFIX),previous);
 const recoveryStore=disk();
 recoveryStore.setItem(key,previous);
 const explicit=createPack3LiveBridge(air(seed),recoveryStore);
 assert.equal(explicit.blocked,null);
 assert.equal(explicit.runtime.size(),1);
});
test('previous-good verification failures never commit a second physical placement',()=>{
 const store=disk(),world=air(50),bridge=createPack3LiveBridge(world,store);
 assert.equal(put(bridge,116,[5,10,5],0).ok,true);
 const key=pack3OverlayKey(50),previous=store.getItem(key);
 const backup=key+PACK3_OVERLAY_PREVIOUS_GOOD_SUFFIX,realGet=store.getItem;
 store.getItem=key=>key===backup?null:realGet(key);
 const failed=put(bridge,117,[6,10,5],2);
 assert.equal(failed.ok,false);
 assert.match(failed.reason,/previous-good backup readback mismatch/);
 assert.equal(store.getItem(key),previous);
 assert.equal(bridge.runtime.size(),1);
});
test('atomic multi-placement cap and foreign-world orientation snapshots still rejected',()=>{
 const b=createPack3LiveBridge(air(99),disk());
 assert.equal(PACK3_RUNTIME_LIMIT,4096);
 const cell=[0,10,0];
 assert.equal(put(b,109,cell,1).ok,false,'North-only roof material must reject rotation');
 assert.equal(b.runtime.size(),0);
 assert.equal(put(b,109,cell,0).ok,true);
 assert.equal(put(b,110,cell,0).ok,false,'No duplicate physical cells');
 assert.equal(b.runtime.size(),1);
});
