// Builder 3B M2 variant-3-second-batch source physical-family ABI dependency report.
// This reads main's real merged builder interfaces; no world registration, saves or placement.
import {createVariant3FinalPool} from './m2-variant3-final.mjs';
import {MANUAL_FIVE_PACK_COUNTS,manualFivePackVariants,resolveManualFivePackAsset}
 from '../../builder-assets/manual-five-pack.mjs';
import {BIOME130_REGISTERED_SYMBOLS,biome130Block} from '../../biome130-registry.mjs';

export function reviewVariant3FinalPhysicalDependencies(){
 const pool=createVariant3FinalPool(),refs=new Map(),symbolic=new Set();
 for(const building of pool){
  for(const m of building.modules)for(const cell of m.cells){
   const [x,y,z,ref]=cell;
   if(![x,y,z].every(Number.isSafeInteger))throw Error('Invalid original industry coordinate');
   if(!refs.has(ref))refs.set(ref,{count:0,buildings:new Set()});
   const entry=refs.get(ref);entry.count++;entry.buildings.add(building.id);
  }
  for(const raw of building.dependencies){
   if(typeof raw!=='string')throw Error('Invalid 3B dependency');
   for(const m of raw.matchAll(/biome130:\d{3}/g))symbolic.add(m[0]);
  }
 }
 const assets=[...refs.entries()].sort(([a],[b])=>a.localeCompare(b)).map(([symbol,info])=>{
  const identity={symbol,used:info.count,usedBy:[...info.buildings].sort(),physicalFinalApproved:false};
  if(symbol.startsWith('builtin:'))return Object.freeze({...identity,origin:'core',status:'builtin-block-symbol'});
  if(symbol.startsWith('biome130:')){
   if(!BIOME130_REGISTERED_SYMBOLS.includes(symbol))
    return Object.freeze({...identity,origin:'biome130',status:'not-live-registered',numericId:null});
   const shape=biome130Block(symbol,0);
   return Object.freeze({...identity,origin:'biome130',status:'source-registered-diagnostic-only',
    numericId:shape.blockId,shapeBoxCount:shape.boxes.length,rotationCount:shape.rotationCount,
    attachment:shape.attachment});
  }
  if(!/^pack[1-5]:\d{3}$/.test(symbol))throw Error('Unexpected unresolved family '+symbol);
  const variants=manualFivePackVariants(symbol);
  if(!Array.isArray(variants)||!variants.length)throw Error('Missing integrated physical family '+symbol);
  const numericIds=variants.map(v=>v.numericId);
  if(numericIds.length!==1)return Object.freeze({...identity,origin:'manual-five-pack',
   status:'numerical-variant-ambiguous',numericIds,needsVariantSelection:true});
  try{
   const shape=resolveManualFivePackAsset(symbol,{numericId:numericIds[0],orientation:'north',state:{}});
   return Object.freeze({...identity,origin:'manual-five-pack',status:'default-north-shape-inspected',
    numericIds,visibleBoxCount:shape.visibleBoxes.length,collisionBoxCount:shape.collisionBoxes.length,
    selectionBoxCount:shape.selectionBoxes.length,physicalOccupancyOffsets:shape.occupiedOffsets.length,
    physicalSupportOffsets:shape.supportOffsets.length,supportPolicy:shape.supportPolicy,
    needsVariantSelection:true,needsYawSelection:true,needsPerCellFootprint:true});
  }catch(e){return Object.freeze({...identity,origin:'manual-five-pack',
   status:'requires-explicit-variant-state',numericIds,needsVariantSelection:true,error:String(e.message)});}
 });
 const symbolicDependencies=[...symbolic].sort().map(symbol=>Object.freeze({symbol,
  registeredNow:BIOME130_REGISTERED_SYMBOLS.includes(symbol),
  placedAsBuiltVoxel:refs.has(symbol),
  status:refs.has(symbol)?'physically-referenced':'symbolic-only'}));
 return Object.freeze({
  schema:'mythwrought.builder-3b.m2-variant3-final-dependency-audit.v1',
  authored:pool.length,occupiedConceptualPositions:assets.reduce((n,a)=>n+a.used,0),
  families:Object.freeze({...MANUAL_FIVE_PACK_COUNTS}),
  assets:Object.freeze(assets),symbolicDependencies:Object.freeze(symbolicDependencies),
  perCellNumericVariantSelected:false,perCellYawSelected:false,
  realSelectionAndCollisionCertified:false,realMountAndSupportCertified:false,
  multiVoxelReservationCertified:false,creatorApproved:0,worldIntegrated:0,
  productionReady:false,readOnly:true
 });
}
