// Cross-owner 584-object actual physical staging, independent sidecar readbacks
// and direct lower-level placement guard. CI-native, not a physical iPhone test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {Pack2LiveWorld,savePack2LiveWorld,loadPack2LiveWorld} from '../src/pack2-world.mjs';
import {pack2NormalizeState} from '../src/pack2-integration.mjs';
import {createPack3LiveBridge} from '../src/builder-assets/pack3-live.mjs';
import {createManual14SavedBridge} from '../src/builder-assets/manual14-layer.mjs';
import {validateManual14ChunkBudgets} from '../src/builder-assets/manual14-mesh.mjs';
import {createPack5LiveAdapter} from '../src/pack5-integration/live-adapter.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../src/builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../src/pack5-integration/catalog.mjs';

function memory(){
 const m=new Map();
 return {getItem:k=>m.has(k)?m.get(k):null,
  setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),
  keys:()=>[...m.keys()]};
}
function selectAir(world,start,count){
 const out=[];
 for(let i=0;i<4096&&out.length<count;i++){
  const at=[start+5*(i%64),19,500+5*Math.floor(i/64)];
  if(world.get(...at)===BLOCK.AIR)out.push(at);
 }
 assert.equal(out.length,count,'Insufficient source-authentic empty world cells');
 return out;
}
const material=id=>{
 const row=MANUAL_FIVE_PACK_CATALOG.find(x=>x.numericId===id);
 assert.ok(row,'Missing manually owned physical block '+id);
 return row;
};
test('584 real manual physical objects coexist across 5 owners, 4 sidecars, untouched biome130 and schema-1',()=>{
 const world=new Pack2LiveWorld(new VoxelWorld(179)),storage=memory();
 const manualCells=selectAir(world,500,512),
       pack2Cells=selectAir(world,1200,24),
       pack3Cells=selectAir(world,1800,24),
       pack5Cells=selectAir(world,2400,24);
 for(const [x,y,z] of pack5Cells){
  assert.equal(world.set(x,y-1,z,BLOCK.STONE),true,'Pack5 furnishing needs real floor support');
 }
 const legacySave=JSON.stringify(world.save());
 const pack3=createPack3LiveBridge(world,storage);
 const manual=createManual14SavedBridge(world,storage);
 world.manual14Layer=manual.layer;
 world.manual14Collision=b=>manual.collision(b);
 const pack5=createPack5LiveAdapter(world,{storage});
 world.pack5Layer=pack5.layer;
 world.pack5Collision=b=>pack5.collision(b);
 const p1=material(9),p4=material(159);
 const authored=manualCells.map((at,i)=>{
  const asset=i%2?p4:p1;
  return {asset:asset.symbol,numericId:asset.numericId,at,orientation:i%4};
 });
 const placed=manual.placeMany(authored);
 assert.equal(placed.ok,true,placed.reason);
 const budget=validateManual14ChunkBudgets(manual.layer.entries());
 assert.equal(budget.instances,512);
 assert.equal(budget.allSectionsWithinBudget,true);
 assert.ok(budget.busiestVertices<=12000);
 for(const at of pack2Cells){
  assert.equal(world.placePack2(...at,59,pack2NormalizeState(59)),true,'Pack2 physical overlay rejected');
 }
 assert.equal(savePack2LiveWorld(storage,world).ok,true);
 for(const at of pack3Cells){
  const r=pack3.mutate({mode:'place',cell:at,id:116,orientation:0,
   player:{x:1e6,feet:19,z:1e6},rebuild:()=>{}});
  assert.equal(r.ok,true,r.reason);
 }
 const variant=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId==='pack5:080')?.variants[0];
 assert.ok(variant,'Missing real Pack5 authored variant');
 for(const at of pack5Cells){
  const r=pack5.layer.place('pack5:080',at,0,variant);
  assert.equal(r.ok,true,r.reason);
 }
 pack5.save();
 assert.equal(manual.layer.size(),512);
 assert.equal(world.pack2Cells.size,24);
 assert.equal(pack3.runtime.size(),24);
 assert.equal(pack5.layer.count(),24);
 assert.equal(512+world.pack2Cells.size+pack3.runtime.size()+pack5.layer.count(),584);
 assert.equal(world.get(...manualCells[0]),BLOCK.AIR);
 assert.equal(world.get(...pack2Cells[0]),59);
 assert.equal(world.get(...pack3Cells[0]),BLOCK.AIR);
 assert.equal(world.get(...pack5Cells[0]),BLOCK.AIR);
 assert.equal(collides(world,manualCells[0][0]+.5,19,manualCells[0][2]+.5),true);
 assert.equal(JSON.stringify(world.save()),legacySave,
  'Overlay save routines never mutate authoritative schema-1 terrain edits');
 // Exercise the bypass-prone low-level Pack2 setter, not only the facade.
 assert.equal(world.placePack2(...manualCells[0],59,pack2NormalizeState(59)),false);
 assert.equal(world.set(...manualCells[0],BLOCK.STONE),false);
 assert.throws(()=>pack3.runtime.placeMany([{
  at:manualCells[0],asset:material(116).symbol,orientation:0
 }]),/Occupied|occupied|player-edited/);
 assert.equal(pack5.layer.place('pack5:080',manualCells[0],0,variant).ok,false);
 const before=JSON.stringify(world.save());
 assert.equal(createManual14SavedBridge(world,storage).layer.size(),512);
 assert.equal(createPack3LiveBridge(world,storage).runtime.size(),24);
 assert.equal(createPack5LiveAdapter(world,{storage}).layer.count(),24);
 const originalPack2=loadPack2LiveWorld(storage,world.base);
 assert.equal(originalPack2.world.pack2Cells.size,24);
 assert.equal(JSON.stringify(world.save()),before);
 assert.ok(storage.keys().some(k=>k.includes('manual14.seed.')));
 assert.ok(storage.keys().some(k=>k.includes('pack3-construction')));
 assert.ok(storage.keys().some(k=>k.includes('pack5.builder')));
 assert.ok(storage.keys().some(k=>k.endsWith('-pack2-live-v1')));
});
