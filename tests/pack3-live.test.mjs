import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {createPack3LiveBridge,pack3OverlayKey,pack3SymbolForId,isPack3BlockId,
  combinePack3ChunkMesh,PACK3_MAX_ADDED_VERTICES_PER_CHUNK} from '../src/builder-assets/pack3-live.mjs';
import {meshChunk} from '../src/voxel.mjs';
import {inspectBlockTarget} from '../src/blocks.mjs';
const storage=()=>{
 const data=new Map();
 return {data,getItem:k=>data.get(k)??null,setItem:(k,v)=>{data.set(k,String(v));},
   removeItem:k=>data.delete(k)};
};
const actor={x:100,feet:12,z:100};
const placed=(bridge,cell,id=116,yaw=0,rebuild=()=>{})=>
 bridge.mutate({mode:'place',cell,id,orientation:yaw,player:actor,rebuild});

test('Pack 3 physical IDs 109–125 resolve uniquely without changing legacy IDs',()=>{
 assert.equal(pack3SymbolForId(109),'pack3:023');
 assert.equal(pack3SymbolForId(125),'pack3:078');
 assert.equal(pack3SymbolForId(3),null);
 assert.ok(Array.from({length:17},(_,i)=>109+i).every(isPack3BlockId));
 assert.equal(isPack3BlockId(255),false);
 assert.equal(BLOCK.STONE,3);assert.equal(BLOCK.DEEPSTONE,8);
});
test('lived construction persists rotated physical boxes independently from schema 1',()=>{
 const w=new VoxelWorld(179),s=storage(),original=JSON.stringify(w.save());
 const live=createPack3LiveBridge(w,s);
 const cell=[70,17,70];
 assert.equal(placed(live,cell,116,3).ok,true);
 assert.equal(live.getAt(...cell).id,116);
 assert.equal(live.getAt(...cell).yaw,3);
 assert.equal(JSON.stringify(w.save()),original);
 const reloadedWorld=VoxelWorld.restore(w.save());
 const reloaded=createPack3LiveBridge(reloadedWorld,s);
 assert.equal(reloaded.getAt(...cell).yaw,3);
 assert.deepEqual(reloaded.runtime.readShape(...cell).boxes,live.runtime.readShape(...cell).boxes);
 assert.equal(s.data.has(pack3OverlayKey(w.seed)),true);
});
test('physical geometry is appended to one existing chunk mesh without extra chunks',()=>{
 const w=new VoxelWorld(179),live=createPack3LiveBridge(w,storage());
 assert.equal(placed(live,[64,18,64],115,2).ok,true);
 const base=meshChunk(w,4,4),combined=combinePack3ChunkMesh(base,live.runtime,4,4);
 assert.ok(combined.length>base.length);
 assert.deepEqual([...combined.slice(0,base.length)],[...base]);
 assert.equal(combined.length%9,0);
 assert.strictEqual(combinePack3ChunkMesh(base,live.runtime,3,3),base);
 assert.equal(PACK3_MAX_ADDED_VERTICES_PER_CHUNK,12000);
});
test('atomic rollback on GPU rebuild failure preserves previous persisted state and schema-1',()=>{
 const w=new VoxelWorld(179),s=storage(),live=createPack3LiveBridge(w,s);
 const before=JSON.stringify(w.save()),key=pack3OverlayKey(w.seed);
 const first=placed(live,[80,17,80],116,1);
 assert.equal(first.ok,true);
 const snap=s.getItem(key);
 const failure=placed(live,[81,17,80],117,1,()=>{throw Error('GPU staging fault')});
 assert.equal(failure.ok,false);
 assert.equal(live.getAt(81,17,80),null);
 assert.equal(s.getItem(key),snap);
 assert.equal(JSON.stringify(w.save()),before);
});
test('rollback on storage write/readback failure and protected corrupt overlays',()=>{
 const w=new VoxelWorld(179),s=storage(),live=createPack3LiveBridge(w,s);
 const set=s.setItem;
 s.setItem=()=>{throw Error('quota')};
 const result=placed(live,[82,17,80],116,1);
 assert.equal(result.ok,false);
 assert.equal(live.runtime.size(),0);
 s.setItem=set;
 const corrupt=storage();
 corrupt.setItem(pack3OverlayKey(w.seed),'not-json');
 const protectedWorld=new VoxelWorld(179);
 const protectedBridge=createPack3LiveBridge(protectedWorld,corrupt);
 assert.match(protectedBridge.blocked,/protected/);
 assert.equal(placed(protectedBridge,[82,17,80]).ok,false);
 assert.equal(corrupt.getItem(pack3OverlayKey(w.seed)),'not-json');
});
test('removal and rollback of rotated block leave old legacy saves intact',()=>{
 const w=new VoxelWorld(179),s=storage(),live=createPack3LiveBridge(w,s);
 const cell=[84,17,84],before=JSON.stringify(w.save());
 assert.equal(placed(live,cell,124,2).ok,true);
 const old=s.getItem(pack3OverlayKey(w.seed));
 assert.equal(live.mutate({mode:'mine',cell,rebuild:()=>{throw Error('GPU lost')}}).ok,false);
 assert.equal(s.getItem(pack3OverlayKey(w.seed)),old);
 assert.equal(live.getAt(...cell).yaw,2);
 assert.equal(live.mutate({mode:'mine',cell,rebuild:()=>{}}).ok,true);
 assert.equal(live.getAt(...cell),null);
 assert.equal(JSON.stringify(w.save()),before);
});
