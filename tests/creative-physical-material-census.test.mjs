// Actual source owners and save readers, independent world per material.
// Native physical source census; GPU rebuild notifications only are no-ops.
// Does not assert all materials were individually placed via browser UI.
import test from 'node:test';
import assert from 'node:assert/strict';
import {buildCreativeCatalog} from '../src/creative-integration/creative-catalog.mjs';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {Pack2LiveWorld,loadPack2LiveWorld,savePack2LiveWorld} from '../src/pack2-world.mjs';
import {pack2NormalizeState} from '../src/pack2-integration.mjs';
import {saveWorldSafe,loadWorldSafe} from '../src/persistence.mjs';
import {createPack3LiveBridge} from '../src/builder-assets/pack3-live.mjs';
import {createManual14SavedBridge} from '../src/builder-assets/manual14-layer.mjs';
import {createPack5LiveAdapter} from '../src/pack5-integration/live-adapter.mjs';
import {createManualFivePackLiveBuilder} from '../src/builder-assets/manual-five-pack-live.mjs';
import {resolveManualFivePackAsset} from '../src/builder-assets/manual-five-pack.mjs';
const catalog=buildCreativeCatalog();assert.equal(catalog.blocks.length,241);
function memory(){const m=new Map();return {getItem:k=>m.get(k)??null,setItem:(k,v)=>m.set(k,String(v)),removeItem:k=>m.delete(k),keys:()=>[...m.keys()]};}
test('241 physical materials place and reload via real installed owners',async()=>{
 const owners={},failures=[];
 for(const item of catalog.blocks){
  try{
   const storage=memory(),world=new Pack2LiveWorld(new VoxelWorld(179)),at=[500,15,500];
   const shape=item.symbol?resolveManualFivePackAsset(item.symbol,{numericId:item.id,orientation:0,variant:item.owner==='pack5'?item.variants[0]:null}):null;
   for(let x=497;x<=503;x++)for(let z=497;z<=503;z++)for(let y=12;y<=19;y++)
     if(world.get(x,y,z)!==BLOCK.AIR)assert.equal(world.set(x,y,z,BLOCK.AIR),true);
   const support=shape?.supportPolicy==='vertical-face'?[501,15,500]:null;
   const supports=[...(shape?.supportOffsets??[]).map(o=>at.map((v,i)=>v+o[i])),...(support?[support]:[])];
   for(const p of [[500,14,500],...supports])if(world.get(...p)!==BLOCK.STONE)assert.equal(world.set(...p,BLOCK.STONE),true);
   assert.equal(world.get(...at),BLOCK.AIR);
   const p3=createPack3LiveBridge(world,storage),p14=createManual14SavedBridge(world,storage),p5=createPack5LiveAdapter(world,{storage});
   world.manual14Layer=p14.layer;world.manual14Collision=b=>p14.collision(b);
   world.pack5Layer=p5.layer;world.pack5Collision=b=>p5.collision(b);
   const builder=createManualFivePackLiveBuilder({getWorld:()=>world,getPack3:()=>p3,getManual14:()=>p14,getPack5:()=>p5,getPlayer:()=>({x:1000,feet:15,z:1000}),storage,canEdit:()=>true,rebuildPack2:()=>{},rebuildPack3:()=>{},rebuildPack5:()=>{}});
   if(item.owner==='core'||item.owner==='biome130')assert.equal(world.set(...at,item.id),true);
   else if(item.owner==='pack2'){
     assert.equal(world.placePack2(...at,item.id,pack2NormalizeState(item.id)),true);
     assert.equal(savePack2LiveWorld(storage,world).ok,true);
   }else{
     const row={asset:item.symbol,numericId:item.id,at,orientation:0,...(item.owner==='pack5'?{variant:item.variants[0]}:{}),...(support?{supportAt:support}:{})};
     const result=await builder.place(row);assert.equal(result.ok,true,result.reason);
   }
   const saved=saveWorldSafe(storage,world,{select:false});assert.equal(saved.ok,true,saved.detail||saved.reason);
   const restored=loadPack2LiveWorld(storage,loadWorldSafe(storage,179).world).world;
   if(item.owner==='pack1'||item.owner==='pack4')assert.equal(createManual14SavedBridge(restored,storage).layer.get(at)?.numericId,item.id);
   else if(item.owner==='pack3')assert.equal(createPack3LiveBridge(restored,storage).getAt(...at)?.id,item.id);
   else if(item.owner==='pack5')assert.equal(createPack5LiveAdapter(restored,{storage}).layer.cell(at)?.symbolicId,item.symbol);
   else assert.equal(restored.get(...at),item.id);
   owners[item.owner]=(owners[item.owner]??0)+1;
  }catch(error){failures.push({key:item.key,owner:item.owner,reason:String(error.message||error)});}
 }
 console.log('PHYSICAL_MATERIAL_CENSUS '+JSON.stringify({passed:Object.values(owners).reduce((a,b)=>a+b,0),owners,failures}));
 assert.deepEqual(failures,[]);
});
