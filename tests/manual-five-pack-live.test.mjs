import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {createPack3LiveBridge} from '../src/builder-assets/pack3-live.mjs';
import {createManual14SavedBridge} from '../src/builder-assets/manual14-layer.mjs';
import {createPack5LiveAdapter} from '../src/pack5-integration/live-adapter.mjs';
import {createManualFivePackLiveBuilder} from '../src/builder-assets/manual-five-pack-live.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../src/builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../src/pack5-integration/catalog.mjs';
const row=id=>MANUAL_FIVE_PACK_CATALOG.find(x=>x.numericId===id);
function memory(){const m=new Map();return {getItem:k=>m.get(k)??null,
 setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),
 keys:()=>[...m.keys()]};}
function prepare(){
 const world=new Pack2LiveWorld(new VoxelWorld(179)),storage=memory();
 const player={x:1000,feet:19,z:1000};
 for(const at of [[500,19,500],[510,19,500],[520,19,500],
                   [530,19,500],[540,19,500]])
  assert.equal(world.get(...at),BLOCK.AIR);
 assert.equal(world.set(540,18,500,BLOCK.STONE),true);
 const pack3=createPack3LiveBridge(world,storage);
 const manual14=createManual14SavedBridge(world,storage);
 world.manual14Layer=manual14.layer;world.manual14Collision=b=>manual14.collision(b);
 const pack5=createPack5LiveAdapter(world,{storage});
 world.pack5Layer=pack5.layer;world.pack5Collision=b=>pack5.collision(b);
 const counts={p2:0,p3:0,p5:0};
 const builder=createManualFivePackLiveBuilder({getWorld:()=>world,
  getManual14:()=>manual14,getPack3:()=>pack3,getPack5:()=>pack5,getPlayer:()=>player,
  storage,canEdit:()=>true,rebuildPack2:()=>{counts.p2++},
  rebuildPack3:()=>{counts.p3++},rebuildPack5:()=>{counts.p5++}});
 return {world,storage,pack3,pack5,manual14,counts,builder};
}
test('one Builder AI interface places real source geometry from all five independent owners',async()=>{
 const {world,pack3,pack5,manual14,counts,storage,builder}=prepare();
 const original=JSON.stringify(world.save());
 const v=PACK5_BUILDER_CATALOG.find(x=>x.symbolicId==='pack5:080')?.variants[0];
 assert.ok(v,'Need actual Pack 5 authored variant');
 const rows=[{asset:row(9).symbol,numericId:9,at:[500,19,500]},
  {asset:row(159).symbol,numericId:159,at:[510,19,500]},
  {asset:row(59).symbol,numericId:59,at:[520,19,500]},
  {asset:row(116).symbol,numericId:116,at:[530,19,500]},
  {asset:'pack5:080',numericId:209,at:[540,19,500],variant:v}];
 for(const item of rows){
  const result=await builder.place(item);
  assert.equal(result.ok,true,'Five-pack builder rejected '+item.asset+': '+result.reason);
  assert.equal(result.worldSchema,1);
 }
 assert.equal(manual14.layer.size(),2);
 assert.equal(world.get(520,19,500),59);
 assert.equal(pack3.getAt(530,19,500).id,116);
 assert.equal(pack5.layer.count(),1);
 assert.deepEqual(counts,{p2:1,p3:1,p5:1});
 assert.equal(JSON.stringify(world.save()),original,
  'Original schema-1 save unchanged by separate authored physical objects');
 assert.equal(storage.keys().filter(k=>k.includes('manual14.seed.')).length>=1,true);
 assert.equal(storage.keys().some(k=>k.includes('pack3-construction')),true);
 assert.equal(storage.keys().some(k=>k.includes('pack5.builder')),true);
});
test('the same builder refuses cross-pack overlapping cells without any source save mutation',async()=>{
 const {world,storage,builder}=prepare();
 const base=await builder.place({asset:row(9).symbol,numericId:9,at:[500,19,500]});
 assert.equal(base.ok,true);
 const before=JSON.stringify(world.save());
 const raw=storage.getItem('mythwrought.manual14.seed.179');
 const p3=await builder.place({asset:row(116).symbol,numericId:116,at:[500,19,500]});
 assert.equal(p3.ok,false);
 const pack5=await builder.place({asset:'pack5:080',numericId:209,at:[500,19,500],
  variant:PACK5_BUILDER_CATALOG.find(x=>x.symbolicId==='pack5:080').variants[0]});
 assert.equal(pack5.ok,false);
 assert.equal(storage.getItem('mythwrought.manual14.seed.179'),raw);
 assert.equal(JSON.stringify(world.save()),before);
});
test('Pack 1/4 atomic builder batch accepts both owners, but cannot pretend a mixed five-pack batch is atomic',()=>{
 const {builder,manual14}=prepare();
 const r=builder.placeManual14Batch([{asset:row(9).symbol,numericId:9,at:[500,19,500]},
  {asset:row(159).symbol,numericId:159,at:[510,19,500]}]);
 assert.equal(r.ok,true);
 assert.equal(r.count,2);
 assert.equal(manual14.layer.size(),2);
 const failed=builder.placeManual14Batch([{asset:row(59).symbol,numericId:59,at:[520,19,500]}]);
 assert.equal(failed.ok,false);
 assert.match(failed.reason,/mixed|transaction/i);
 assert.equal(manual14.layer.size(),2);
 assert.equal(builder.mixedPackAtomicBatchSupported,false);
});
test('protected game state and corrupted symbolic references fail closed without placing anything',async()=>{
 const {world,storage,manual14,pack3,pack5}=prepare();
 const bridge=createManualFivePackLiveBuilder({getWorld:()=>world,
  getManual14:()=>manual14,getPack3:()=>pack3,getPack5:()=>pack5,
  getPlayer:()=>({x:1000,feet:19,z:1000}),storage,canEdit:()=>false});
 const before=JSON.stringify(world.save());
 assert.equal((await bridge.place({asset:row(9).symbol,numericId:9,at:[500,19,500]})).ok,false);
 assert.equal(manual14.layer.size(),0);
 assert.equal(JSON.stringify(world.save()),before);
});
