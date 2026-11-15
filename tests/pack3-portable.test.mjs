// Pack 3 portable backup and restore tests. Never alter canonical schema-1.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {createPack3LiveBridge,pack3OverlayKey} from '../src/builder-assets/pack3-live.mjs';
import {PACK3_PORTABLE_FORMAT,PACK3_PRE_IMPORT_SUFFIX,PACK3_PORTABLE_MAX_BYTES,
 exportPack3Portable,inspectPack3Portable,restorePack3Portable} from '../src/builder-assets/pack3-portable.mjs';

const store=()=>{
 const map=new Map();
 return {map,getItem:k=>map.get(k)??null,
 setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};
};
const air=seed=>({seed,edits:new Map(),get:()=>BLOCK.AIR});
const put=(bridge,id,cell,yaw=0)=>bridge.mutate({mode:'place',
 id,cell,orientation:yaw,player:{x:500,feet:17,z:500},rebuild:()=>{}});
test('explicit separate archive preserves 17 physical IDs and rotations without changing legacy schema-1',()=>{
 const world=new VoxelWorld(179),storage=store(),bridge=createPack3LiveBridge(world,storage);
 const before=JSON.stringify(world.save());
 for(let i=0;i<17;i++){
  const result=put(bridge,109+i,[75+i,18,70],i<4?0:i%4);
  assert.equal(result.ok,true,JSON.stringify({id:109+i,result}));
 }
 const archive=exportPack3Portable(bridge,world,storage);
 const decoded=JSON.parse(archive);
 assert.equal(decoded.format,PACK3_PORTABLE_FORMAT);
 assert.equal(decoded.schema,1);assert.equal(decoded.seed,179);
 assert.equal(decoded.overlay.entries.length,17);
 assert.ok(archive.length<PACK3_PORTABLE_MAX_BYTES);
 const info=inspectPack3Portable(archive,world);
 assert.equal(info.count,17);
 const freshStore=store(),freshWorld=VoxelWorld.restore(world.save());
 const fresh=createPack3LiveBridge(freshWorld,freshStore);
 const imported=restorePack3Portable(archive,fresh,freshWorld,freshStore,{approved:true});
 assert.equal(imported.requiresReload,true);
 const reloaded=createPack3LiveBridge(VoxelWorld.restore(freshWorld.save()),freshStore);
 assert.equal(reloaded.runtime.size(),17);
 for(let i=0;i<17;i++){
  assert.equal(reloaded.getAt(75+i,18,70)?.id,109+i);
  assert.equal(reloaded.getAt(75+i,18,70)?.yaw,i<4?0:i%4);
 }
 assert.equal(JSON.stringify(world.save()),before);
 assert.equal(JSON.stringify(freshWorld.save()),before);
});
test('wrong seed, malformed JSON, unknown symbols and invalid rotation reject before any storage write',()=>{
 const world=air(10),storage=store(),bridge=createPack3LiveBridge(world,storage);
 const valid=exportPack3Portable(bridge,world,storage);
 for(const malformed of [
  '{not-json',
  JSON.stringify({...JSON.parse(valid),seed:11}),
  JSON.stringify({...JSON.parse(valid),format:'other'}),
  JSON.stringify({...JSON.parse(valid),overlay:{
   ...JSON.parse(valid).overlay,entries:[{at:[0,10,0],asset:'pack3:099',orientation:0}]
  }}),
  JSON.stringify({...JSON.parse(valid),overlay:{
   ...JSON.parse(valid).overlay,entries:[{at:[0,10,0],asset:'pack3:023',orientation:3}]
  }})
 ]){
  assert.throws(()=>inspectPack3Portable(malformed,world));
  assert.throws(()=>restorePack3Portable(malformed,bridge,world,storage,{approved:true}));
 }
 assert.equal(storage.map.size,0);
});
test('explicit approval and verified pre-import copy protect current physical data',()=>{
 const world=air(12),storage=store(),bridge=createPack3LiveBridge(world,storage);
 assert.equal(put(bridge,116,[0,10,0],1).ok,true);
 const old=storage.getItem(pack3OverlayKey(12)),newStorage=store();
 const newWorld=air(12),candidate=createPack3LiveBridge(newWorld,newStorage);
 assert.equal(put(candidate,117,[1,10,0],3).ok,true);
 const archive=exportPack3Portable(candidate,newWorld,newStorage);
 assert.throws(()=>restorePack3Portable(archive,bridge,world,storage),/Explicit/);
 assert.equal(storage.getItem(pack3OverlayKey(12)),old);
 const imported=restorePack3Portable(archive,bridge,world,storage,{approved:true});
 assert.equal(imported.requiresReload,true);
 assert.equal(storage.getItem(pack3OverlayKey(12)+PACK3_PRE_IMPORT_SUFFIX),old);
 assert.equal(createPack3LiveBridge(air(12),storage).getAt(1,10,0).id,117);
 assert.equal(createPack3LiveBridge(air(12),storage).getAt(0,10,0),null);
});
test('corrupt Pack 3 primary is retained exactly before an explicitly approved recovery',()=>{
 const world=air(14),disk=store(),bridge=createPack3LiveBridge(world,disk);
 assert.equal(put(bridge,116,[0,10,0],1).ok,true);
 const valid=exportPack3Portable(bridge,world,disk);
 const key=pack3OverlayKey(14);disk.setItem(key,'{damaged');
 const protectedBridge=createPack3LiveBridge(air(14),disk);
 assert.match(protectedBridge.blocked,/protected/);
 assert.throws(()=>exportPack3Portable(protectedBridge,world,disk));
 const info=restorePack3Portable(valid,protectedBridge,world,disk,{approved:true});
 assert.equal(info.requiresReload,true);
 assert.equal(disk.getItem(key+PACK3_PRE_IMPORT_SUFFIX),'{damaged');
 assert.equal(createPack3LiveBridge(air(14),disk).getAt(0,10,0).yaw,1);
});
test('concurrent tab write prevents import and preserves newer data',()=>{
 const world=air(18),disk=store(),older=createPack3LiveBridge(world,disk);
 const concurrent=createPack3LiveBridge(air(18),disk);
 assert.equal(put(concurrent,116,[0,10,0],1).ok,true);
 const bytes=disk.getItem(pack3OverlayKey(18));
 const archive=exportPack3Portable(concurrent,air(18),disk);
 assert.throws(()=>restorePack3Portable(archive,older,world,disk,{approved:true}),/outside this tab/);
 assert.equal(disk.getItem(pack3OverlayKey(18)),bytes);
});
test('storage quota or readback failure during import restores previous physical sidecar',()=>{
 const world=air(19),disk=store(),bridge=createPack3LiveBridge(world,disk);
 assert.equal(put(bridge,116,[0,10,0],1).ok,true);
 const before=disk.getItem(pack3OverlayKey(19));
 const otherDisk=store(),other=createPack3LiveBridge(air(19),otherDisk);
 assert.equal(put(other,117,[1,10,0],3).ok,true);
 const archive=exportPack3Portable(other,air(19),otherDisk);
 const originalSet=disk.setItem;
 let first=true;
 disk.setItem=(k,v)=>{
  if(k===pack3OverlayKey(19)&&first){first=false;throw Error('simulated quota');}
  return originalSet(k,v);
 };
 assert.throws(()=>restorePack3Portable(archive,bridge,world,disk,{approved:true}),/quota/);
 assert.equal(disk.getItem(pack3OverlayKey(19)),before);
 assert.equal(createPack3LiveBridge(air(19),disk).getAt(0,10,0).yaw,1);
});
test('physical backup import fails on a player-edited cell without changing stored world',()=>{
 const original=air(21),storage=store(),bridge=createPack3LiveBridge(original,storage);
 const sourceStore=store(),sourceWorld=air(21),source=createPack3LiveBridge(sourceWorld,sourceStore);
 assert.equal(put(source,116,[5,10,5],1).ok,true);
 const archive=exportPack3Portable(source,sourceWorld,sourceStore);
 original.edits.set('5,10,5',BLOCK.STONE);
 assert.throws(()=>restorePack3Portable(archive,bridge,original,storage,{approved:true}),/Occupied/);
 assert.equal(storage.map.size,0);
});
