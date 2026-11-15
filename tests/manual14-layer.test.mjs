import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../src/builder-assets/manual-five-pack.mjs';
import {PACK1_BUILDER_CATALOG} from '../src/block-packs/pack-1/builder-handoff.mjs';
import {createManual14Layer,createManual14SavedBridge,MANUAL14_FORMAT} from '../src/builder-assets/manual14-layer.mjs';

const selected=(pack,id)=>MANUAL_FIVE_PACK_CATALOG.find(x=>x.pack===pack&&x.numericId===id);
function store(){const data=new Map();return {
 getItem:k=>data.has(k)?data.get(k):null,
 setItem:(k,v)=>data.set(k,String(v)),
 removeItem:k=>data.delete(k)
};}
function fixture(){
 const world=new VoxelWorld(179),storage=store();
 const masonry=selected(1,9),barrel=selected(4,169),glass=selected(4,163);
 assert.ok(masonry&&barrel&&glass);
 for(const at of [[500,19,500],[502,19,500],[504,19,500]])
  assert.equal(world.get(...at),BLOCK.AIR);
 assert.equal(world.set(502,18,500,BLOCK.STONE),true);
 // Pack4 authored oak shutters are wall-face mounted and need a real north backing wall.
 assert.equal(world.set(504,19,501,BLOCK.STONE),true);
 return {world,storage,masonry,barrel,glass};
}
test('Pack 1 and 4 53 authored variant IDs expose a buildable independent physical layer',()=>{
 const {world,masonry,barrel}=fixture();
 const layer=createManual14Layer(world);
 const before=JSON.stringify(world.save());
 assert.equal(layer.placeMany([{asset:masonry.symbol,numericId:masonry.numericId,at:[500,19,500]},
  {asset:barrel.symbol,numericId:barrel.numericId,at:[502,19,500]}]),2);
 assert.equal(layer.size(),2);
 assert.equal(layer.get([500,19,500]).numericId,9);
 assert.equal(layer.get([502,19,500]).numericId,169);
 assert.equal(layer.collision([500.1,19.1,500.1,500.9,19.9,500.9]),true);
 assert.equal(layer.target([500.5,19.5,498.5],[0,0,1],6)?.cell.join(','),'500,19,500');
 assert.equal(JSON.stringify(world.save()),before,'schema-1 world never gains fake manual14 IDs');
 assert.deepEqual(layer.snapshot().entries.map(e=>e.numericId),[9,169]);
});
test('mounted Pack4 requires true backing, and duplicate cells roll back whole batch',()=>{
 const {world,masonry,glass}=fixture();
 const layer=createManual14Layer(world);
 assert.equal(layer.placeMany([{asset:glass.symbol,numericId:glass.numericId,
  at:[504,19,500],orientation:0}]),1);
 assert.deepEqual(layer.get([504,19,500]).supports.map(p=>[...p]),[[504,19,501]]);
 assert.equal(layer.get([504,19,500]).numericId,163);
 assert.throws(()=>layer.placeMany([{asset:masonry.symbol,numericId:9,at:[510,19,500]},
  {asset:masonry.symbol,numericId:9,at:[510,19,500]}]),/Overlapping/);
 assert.equal(layer.size(),1,'no partial batch writes');
 assert.throws(()=>layer.placeMany([{asset:glass.symbol,numericId:163,
  at:[515,19,500]}]),/Missing certified/);
 assert.equal(layer.size(),1);
});
test('source-authored Pack1 wall mount cannot be invented from an absent wall',()=>{
 const {world}=fixture();
 const candidate=PACK1_BUILDER_CATALOG.find(x=>x.support==='vertical-face');
 if(!candidate)return; // Source-owned mounted family is optional in future catalogs.
 const wall={symbol:candidate.symbolicRef,numericId:candidate.id};
 const layer=createManual14Layer(world);
 assert.throws(()=>layer.placeMany([{asset:wall.symbol,numericId:wall.numericId,
  at:[520,19,500]}]),/wall support|Missing certified/);
 assert.equal(layer.size(),0);
});
test('seed-specific previous-good save persists and safely restores Pack 1/4 without schema migration',()=>{
 const {world,storage,masonry,barrel}=fixture();
 const bridge=createManual14SavedBridge(world,storage);
 assert.equal(bridge.placeMany([{asset:masonry.symbol,numericId:9,at:[500,19,500]}]).ok,true);
 const original=bridge.lastRaw;
 assert.equal(JSON.parse(original).format,MANUAL14_FORMAT);
 assert.equal(bridge.placeMany([{asset:barrel.symbol,numericId:169,at:[502,19,500]}]).ok,true);
 assert.equal(storage.getItem(bridge.key+':previous-good'),original);
 const reloaded=createManual14SavedBridge(world,storage);
 assert.equal(reloaded.layer.size(),2);
 assert.equal(reloaded.layer.get([500,19,500]).numericId,9);
 assert.equal(reloaded.layer.get([502,19,500]).numericId,169);
 assert.equal(world.save().schema,1);
});
test('external-tab and damaged manual14 sidecars fail closed without overwriting bytes',()=>{
 const {world,storage,masonry}=fixture();
 const bridge=createManual14SavedBridge(world,storage);
 const forced='UNTRUSTED JSON';
 storage.setItem(bridge.key,forced);
 const before=JSON.stringify(world.save());
 const failed=bridge.placeMany([{asset:masonry.symbol,numericId:9,at:[500,19,500]}]);
 assert.equal(failed.ok,false);
 assert.equal(storage.getItem(bridge.key),forced);
 assert.equal(JSON.stringify(world.save()),before);
 const damaged=createManual14SavedBridge(world,storage);
 assert.match(damaged.blocked,/Protected/);
 assert.equal(damaged.placeMany([{asset:masonry.symbol,numericId:9,at:[500,19,500]}]).ok,false);
});
