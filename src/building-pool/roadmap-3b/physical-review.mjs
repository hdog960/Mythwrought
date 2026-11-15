// M1 read-only inspection of real main-branch physical family contracts.
// This is neither an integrator nor a world mutator. No permanent orientation/variant
// decisions are made on behalf of the creator.
import {createLegacyWatchtowerPool} from './legacy-watchtowers.mjs';
import {MANUAL_FIVE_PACK_COUNTS,manualFivePackVariants,resolveManualFivePackAsset}
 from '../../builder-assets/manual-five-pack.mjs';
import {BIOME130_REGISTERED_SYMBOLS,biome130Block} from '../../biome130-registry.mjs';

const ownedRef=/^(builtin:[a-z]+|pack[1-5]:\d{3}|biome130:\d{3})$/;
export function reviewM1PhysicalDependencies(){
 const buildings=createLegacyWatchtowerPool(),occurrences=new Map();
 for(const b of buildings)for(const m of b.modules)for(const [x,y,z,ref] of m.cells){
  if(!ownedRef.test(ref))throw Error('Unrecognized source asset ref '+ref);
  if(![x,y,z].every(Number.isSafeInteger))throw Error('Nonintegral blueprint coordinate');
  occurrences.set(ref,(occurrences.get(ref)??0)+1);
 }
 const symbols=[...occurrences.keys()].sort();
 const assets=symbols.map(symbol=>{
  const uses=occurrences.get(symbol);
  if(symbol.startsWith('builtin:'))
   return Object.freeze({symbol,uses,source:'builtin',status:'base-block-referenced',
    needsPlacementOrientation:false,finalWorldProof:false});
  if(symbol.startsWith('biome130:')){
   if(!BIOME130_REGISTERED_SYMBOLS.includes(symbol))
    return Object.freeze({symbol,uses,source:'biome130',status:'not-registered-in-current-main',
     numericId:null,explicitlyUnresolved:true,finalWorldProof:false});
   const block=biome130Block(symbol,0);
   return Object.freeze({symbol,uses,source:'biome130',status:'registry-shape-available',
    numericId:block.blockId,shapeBoxCount:block.boxes.length,
    solid:block.solid,attachment:block.attachment,rotationCount:block.rotationCount,
    needsPlacementOrientation:true,finalWorldProof:false});
  }
  let family;
  try{family=manualFivePackVariants(symbol)}
  catch(error){return Object.freeze({symbol,uses,source:'manual-five-pack',status:'missing-family',
     error:String(error.message),numericIds:[],explicitlyUnresolved:true,finalWorldProof:false});}
  const numericIds=family.map(x=>x.numericId);
  if(numericIds.length!==1)
   return Object.freeze({symbol,uses,source:'manual-five-pack',status:'numeric-variant-unselected',
    numericIds,needsPlacementOrientation:true,explicitlyUnresolved:true,finalWorldProof:false});
  try{
   // Default north and default state are diagnostic ONLY. Blueprints have not selected
   // per-cell numeric variant, rotation, state, multivoxel footprint or support.
   const resolved=resolveManualFivePackAsset(symbol,{numericId:numericIds[0],
    orientation:'north',variant:null,state:{}});
   return Object.freeze({symbol,uses,source:'manual-five-pack',status:'default-shape-inspected',
    numericIds,diagnosticBoxCount:resolved.visibleBoxes.length,
    diagnosticSelectionBoxCount:resolved.selectionBoxes.length,
    diagnosticCollisionBoxCount:resolved.collisionBoxes.length,
    diagnosticOccupiedCells:resolved.occupiedOffsets.length,
    diagnosticSupportOffsets:resolved.supportOffsets.length,
    supportPolicy:resolved.supportPolicy,needsPlacementOrientation:true,
    explicitlyUnresolved:true,finalWorldProof:false,livePlaceable:resolved.livePlaceable});
  }catch(error){
   return Object.freeze({symbol,uses,source:'manual-five-pack',status:'shape-needs-explicit-variant-or-state',
    numericIds,error:String(error.message),needsPlacementOrientation:true,
    explicitlyUnresolved:true,finalWorldProof:false});
  }
 });
 const occupancy=assets.reduce((n,r)=>n+r.uses,0);
 return Object.freeze({
  schema:'mythwrought.roadmap-3b.m1-physical-abi-review.v1',
  authored:buildings.length,occupancy,sourceAssetRefs:symbols.length,assets:Object.freeze(assets),
  manualCatalog:Object.freeze({...MANUAL_FIVE_PACK_COUNTS}),
  hasFinalPerCellOrientation:false,hasFinalMultiCellReservations:false,
  physicalPreviewApproved:false,creatorApproved:0,worldPlaced:0,
  readyForPhysicalConstruction:false,
  proof:'source-exact conceptual coordinates + read-only ABI inspection only; NOT live collision/renderer approval'
 });
}
