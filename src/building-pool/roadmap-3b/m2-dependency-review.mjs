// Builder 3B M2 industry-only dependency inspection. NO placement or ID registration.
// Uses the actual merged five-pack builder ABI and current biome130 registry.
import {createM2IndustryPool} from './m2-industry.mjs';
import {createRegionalIndustryPool} from './m2-regional.mjs';
import {MANUAL_FIVE_PACK_COUNTS,manualFivePackVariants,resolveManualFivePackAsset}
 from '../../builder-assets/manual-five-pack.mjs';
import {BIOME130_REGISTERED_SYMBOLS,biome130Block} from '../../biome130-registry.mjs';

export function reviewM2IndustryDependencies(){
 const blueprints=[...createM2IndustryPool(),...createRegionalIndustryPool()];
 const usage=new Map(),usedBy=new Map();
 for(const b of blueprints){
  for(const module of b.modules)for(const [x,y,z,ref] of module.cells){
   if(![x,y,z].every(Number.isSafeInteger))throw Error('Non-coordinate source building '+b.id);
   usage.set(ref,(usage.get(ref)??0)+1);
   if(!usedBy.has(ref))usedBy.set(ref,new Set());usedBy.get(ref).add(b.id);
  }
 }
 const assets=[...usage].sort(([a],[b])=>a.localeCompare(b)).map(([symbol,occupiedPositions])=>{
  const where=[...usedBy.get(symbol)].sort();
  if(symbol.startsWith('builtin:'))
   return Object.freeze({symbol,occupiedPositions,usedBy:where,source:'builtin',
    status:'base-game-symbol',explicitPlacementVariant:false,physicalReady:false});
  if(symbol.startsWith('biome130:')){
   if(!BIOME130_REGISTERED_SYMBOLS.includes(symbol))
    return Object.freeze({symbol,occupiedPositions,usedBy:where,source:'biome130',
     status:'unregistered-symbolic-dependency',numericId:null,physicalReady:false});
   const definition=biome130Block(symbol,0);
   return Object.freeze({symbol,occupiedPositions,usedBy:where,source:'biome130',
    status:'registry-shape-inspected',numericId:definition.blockId,
    rotationCount:definition.rotationCount,shapeBoxCount:definition.boxes.length,
    attachment:definition.attachment,explicitPlacementVariant:false,physicalReady:false});
  }
  if(!/^pack[1-5]:\d{3}$/.test(symbol))throw Error('Unscoped industry family '+symbol);
  let variants;
  try{variants=manualFivePackVariants(symbol);}
  catch(error){return Object.freeze({symbol,occupiedPositions,usedBy:where,source:'manual-five-pack',
   status:'family-not-present',error:String(error.message),numericIds:[],physicalReady:false});}
  const numericIds=variants.map(x=>x.numericId);
  if(numericIds.length!==1)return Object.freeze({symbol,occupiedPositions,usedBy:where,
   source:'manual-five-pack',status:'numeric-variant-ambiguous',numericIds,
   explicitPlacementVariant:false,physicalReady:false});
  try{
   const diagnostic=resolveManualFivePackAsset(symbol,{numericId:numericIds[0],orientation:'north'});
   return Object.freeze({symbol,occupiedPositions,usedBy:where,source:'manual-five-pack',
    status:'default-north-shape-diagnostic-only',numericIds,
    visibleBoxes:diagnostic.visibleBoxes.length,
    selectionBoxes:diagnostic.selectionBoxes.length,
    collisionBoxes:diagnostic.collisionBoxes.length,
    requiredSupportOffsets:diagnostic.supportOffsets.length,
    occupiedOffsets:diagnostic.occupiedOffsets.length,
    supportPolicy:diagnostic.supportPolicy,
    explicitPlacementVariant:false,physicalReady:false});
  }catch(error){return Object.freeze({symbol,occupiedPositions,usedBy:where,source:'manual-five-pack',
   status:'requires-explicit-variant-or-shape-state',numericIds,error:String(error.message),
   explicitPlacementVariant:false,physicalReady:false});}
 });
 return Object.freeze({
  schema:'mythwrought.builder-3b.m2-industry-physical-dependency-audit.v1',
  authoredIndustryBlueprints:blueprints.length,
  totalAuthoredCoordinateSlots:assets.reduce((n,a)=>n+a.occupiedPositions,0),
  manualCatalog:Object.freeze({...MANUAL_FIVE_PACK_COUNTS}),
  assets:Object.freeze(assets),
  perCellNumericVariantResolved:false,perCellYawResolved:false,perCellSupportProven:false,
  collisionAgainstActualPhysicalAABBsCertified:false,livePlacementReady:false,
  noWorldWrites:true,creatorAccepted:0,integrated:0
 });
}
