// Unified per-asset live placement contract for future village/town/city builders.
// One exact source catalog; five distinct, verified save owners. Deliberately
// NO cross-pack multi-edit transaction: builders must not claim an all-or-none
// settlement until a transaction coordinator owns that stronger guarantee.
// Never changes biome130 generation, IDs, source files or schema-1 save format.
import {BLOCK} from '../voxel.mjs';
import {PACK2_LIVE_IDS,pack2NormalizeState} from '../pack2-integration.mjs';
import {Pack2LiveWorld,savePack2LiveWorld} from '../pack2-world.mjs';
import {resolveManualFivePackAsset,planManualFivePackBlueprint,
  MANUAL_FIVE_PACK_FAMILY_SYMBOLS,MANUAL_FIVE_PACK_COUNTS} from './manual-five-pack.mjs';
const integerCell=at=>Array.isArray(at)&&at.length===3&&at.every(Number.isSafeInteger);
const playerBox=p=>p&&[p.x,p.feet,p.z].every(Number.isFinite)?
 [p.x-.28,p.feet,p.z-.28,p.x+.28,p.feet+1.78,p.z+.28]:null;
const validApi=(x,method)=>x&&typeof x[method]==='function';
const failure=(reason,extra={})=>Object.freeze({ok:false,reason:String(reason),...extra});
const success=(asset,at,kind='placed')=>Object.freeze({ok:true,kind,asset:asset.symbol,
 numericId:asset.numericId,pack:asset.sourcePack,at:Object.freeze([...at]),
 sourceExact:true,verifiedSave:true,worldSchema:1});

export function createManualFivePackLiveBuilder({
 getWorld,getManual14,getPack3,getPack5=()=>null,loadPack5=null,getPlayer=()=>null,
 storage,canEdit=()=>false,rebuildPack2=null,rebuildPack3=null,rebuildPack5=null
}={}){
 if(typeof getWorld!=='function'||typeof getManual14!=='function'||
    typeof getPack3!=='function'||typeof getPack5!=='function'||
    (loadPack5!==null&&typeof loadPack5!=='function')||
    typeof getPlayer!=='function'||typeof canEdit!=='function'||
    !validApi(storage,'getItem')||!validApi(storage,'setItem'))
  throw TypeError('Invalid five-pack host or storage callbacks');

 const ensureAvailable=(world,at)=>{
  if(world.get(...at)!==BLOCK.AIR||world.pack3Runtime?.get?.(at)||
     world.manual14Layer?.get?.(at)||world.pack5Layer?.cell?.(at))
   throw Error('Manual builder placement overlaps live terrain or another physical pack');
 };
 const requireRebuild=(callback,label)=>{
  if(typeof callback!=='function')throw Error(label+' requires a real GPU chunk rebuild callback');
  return callback;
 };
 const getAsset=record=>{
  if(!record||typeof record!=='object'||!integerCell(record.at))
   throw TypeError('Builder placement requires integer at:[x,y,z]');
  return resolveManualFivePackAsset(record.asset,{
   numericId:record.numericId??null,orientation:record.orientation??0,
   variant:record.variant??null,state:record.state??{}
  });
 };
 async function place(record){
  let asset;
  try{
   if(!canEdit())return failure('Live builder is read-only; protected world or graphics state');
   asset=getAsset(record);
   const world=getWorld(),at=[...record.at];
   if(!world||typeof world.save!=='function'||world.save().schema!==1)
    throw Error('Builder requires authoritative schema-1 world');
   ensureAvailable(world,at);
   const body=playerBox(getPlayer());
   if(asset.sourcePack===1||asset.sourcePack===4){
    const bridge=getManual14();
    if(!validApi(bridge,'placeMany')||bridge.layer?.world!==world)
     throw Error('Source-backed Pack1/4 seed layer is not mounted in this world');
    const row={asset:asset.symbol,numericId:asset.numericId,at,
     orientation:asset.orientation,
     ...(asset.sourcePack===1?{variant:asset.variant}:{})};
    if(record.supportAt!==undefined)row.supportAt=record.supportAt;
    const r=bridge.placeMany([row],{playerBody:body});
    if(!r.ok)return failure(r.reason);
    return success(asset,at);
   }
   if(asset.sourcePack===2){
    if(!(world instanceof Pack2LiveWorld)||!PACK2_LIVE_IDS.includes(asset.numericId))
     throw Error('Physical Pack2 production sidecar is not mounted');
    const rebuild=requireRebuild(rebuildPack2,'Pack2');
    const normalized=pack2NormalizeState(asset.numericId,record.state??{});
    if(!world.placePack2(...at,asset.numericId,normalized))
     return failure('Rejected Pack2 authored placement');
    let result;
    try{
     result=savePack2LiveWorld(storage,world);
     if(!result.ok)throw Error(result.reason||'Pack2 separate save rejected');
     rebuild(at[0],at[2],at[1]);
    }catch(error){
     // This exact cell was empty before this call. No generic data edits.
     const reversed=world.set(...at,BLOCK.AIR);
     const restored=reversed&&savePack2LiveWorld(storage,world);
     try{if(reversed)rebuild(at[0],at[2],at[1]);}catch{}
     return failure('Pack2 live placement failed: '+String(error),{
       storageUncertain:!restored?.ok,requiresRecovery:!restored?.ok});
    }
    return success(asset,at);
   }
   if(asset.sourcePack===3){
    const bridge=getPack3();
    if(!validApi(bridge,'mutate')||bridge.runtime?.size===undefined)
     throw Error('Pack3 source runtime is not mounted');
    const rebuild=requireRebuild(rebuildPack3,'Pack3');
    const player=getPlayer();
    if(!playerBox(player))throw Error('Pack3 builder requires actual current player bounds');
    const r=bridge.mutate({mode:'place',cell:at,id:asset.numericId,
      orientation:asset.orientation,player,rebuild});
    return r.ok?success(asset,at):failure(r.reason);
   }
   if(asset.sourcePack===5){
    let bridge=getPack5();
    if(!bridge&&loadPack5){
     const loaded=await loadPack5();
     if(!loaded||world!==getWorld())return failure('World changed before Pack5 was ready');
     bridge=getPack5();
    }
    if(!bridge||!validApi(bridge,'save')||!bridge.layer)
     throw Error('Pack5 source layer not loaded; enable/restore it before construction');
    const rebuild=requireRebuild(rebuildPack5,'Pack5');
    const previous=bridge.snapshot();
    const placed=bridge.layer.place(asset.symbol,at,asset.orientation,asset.variant,
     {playerBox:body});
    if(!placed.ok)return failure(placed.reason);
    try{bridge.save();rebuild();}
    catch(error){
     let recovery=null;
     try{
      bridge.layer.restore(previous);
      bridge.save();
      rebuild();
     }catch(err){recovery=String(err);}
     return failure('Pack5 live placement rolled back: '+String(error),
      recovery?{storageUncertain:true,requiresRecovery:true,detail:recovery}:{});
    }
    return success(asset,at);
   }
   return failure('Unrecognized source owner');
  }catch(error){return failure(error?.message??error)}
 }
 function placeManual14Batch(records,{player=null}={}){
  try{
   if(!canEdit())return failure('Live builder is read-only');
   if(!Array.isArray(records)||records.length<1||records.length>2048)
    throw Error('Invalid physical Pack1/4 builder batch');
   const world=getWorld(),bridge=getManual14();
   if(!bridge||bridge.layer?.world!==world)
    throw Error('Pack1/4 seed layer is not mounted');
   const rows=records.map(record=>{
    const a=getAsset(record);
    if(a.sourcePack!==1&&a.sourcePack!==4)
     throw Error('Mixed five-pack batch requires future multi-owner transaction approval');
    return {asset:a.symbol,numericId:a.numericId,at:[...record.at],
      orientation:a.orientation,...(a.sourcePack===1?{variant:a.variant}:{}),
      ...(record.supportAt!==undefined?{supportAt:record.supportAt}:{})};
   });
   const result=bridge.placeMany(rows,{playerBody:playerBox(player??getPlayer())});
   if(!result.ok)return failure(result.reason);
   return Object.freeze({ok:true,kind:'pack1-pack4-atomic-batch',
    count:rows.length,sourceExact:true,verifiedSave:true,worldSchema:1});
  }catch(err){return failure(err?.message??err)}
 }
 return Object.freeze({
  format:'mythwrought.manual-five-pack-live-builder.v1',
  supportedFamilies:MANUAL_FIVE_PACK_FAMILY_SYMBOLS,
  inventory:MANUAL_FIVE_PACK_COUNTS,
  resolve:(asset,opts)=>resolveManualFivePackAsset(asset,opts),
  dryRun:(rows,opts)=>planManualFivePackBlueprint(rows,opts),
  place,placeManual14Batch,
  // Intentionally no unsafe "place all five packs atomically" method.
  mixedPackAtomicBatchSupported:false,
  schema1WorldPreserved:true
 });
}
