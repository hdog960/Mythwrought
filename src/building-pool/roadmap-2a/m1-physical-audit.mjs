// Read-only producer-backed ABI audit, isolated to Roadmap 2A. Never writes
// production geometry, placement IDs, editor state or schema-1 saves.
import {M1_GENERAL_STORES} from './m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from './m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from './m1-additional-shops.mjs';
import {
 MANUAL_FIVE_PACK_COUNTS,MANUAL_FIVE_PACK_FAMILY_SYMBOLS,
 manualFivePackVariants,resolveManualFivePackAsset
} from '../../builder-assets/manual-five-pack.mjs';
const buildings=Object.freeze([...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS]);
const known=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS);
const faces=(v,b)=>{
 if(v.z===0)return 'north';
 if(v.z===b.extents.z-1)return 'south';
 if(v.x===0)return 'west';
 if(v.x===b.extents.x-1)return 'east';
 return null;
};
export function inspect2APhysicalReadiness(){
 const unresolved=[],resolvedFixtures=[],symbolUse=new Map(),shapedWindows=[],roofSymbols=new Set();
 for(const b of buildings){
  const occupied=new Set(b.voxels.map(v=>[v.x,v.y,v.z].join(',')));
  for(const v of b.voxels){
   symbolUse.set(v.material,(symbolUse.get(v.material)||0)+1);
   if(v.kind==='roof')roofSymbols.add(v.material);
   if(v.material.startsWith('biome130:')){
    unresolved.push({id:b.id,at:[v.x,v.y,v.z],symbol:v.material,reason:'biome130-live-registration-and-shape-not-proven'});
    continue;
   }
   if(!known.has(v.material)){
    unresolved.push({id:b.id,at:[v.x,v.y,v.z],symbol:v.material,reason:'missing-manual-family'});
    continue;
   }
   if(v.kind==='window'){
    const facing=faces(v,b);
    if(!facing){unresolved.push({id:b.id,at:[v.x,v.y,v.z],symbol:v.material,reason:'window-has-no-facade-facing'});continue;}
    // These are REAL producer descriptors; the original 2-cell vertical
    // glazing records do not by themselves certify glass thickness, mounts
    // and real edge-to-frame fit across the two physical cells.
    const variants=manualFivePackVariants(v.material);
    if(variants.length!==1){unresolved.push({id:b.id,at:[v.x,v.y,v.z],symbol:v.material,reason:'window-family-needs-explicit-variant-id'});continue;}
    try{
     const physical=resolveManualFivePackAsset(v.material,{numericId:variants[0].numericId,orientation:facing});
     shapedWindows.push({id:b.id,at:[v.x,v.y,v.z],symbol:v.material,facing,collisionBoxes:physical.collisionBoxes.length,selectionBoxes:physical.selectionBoxes.length,occupiedOffsets:physical.occupiedOffsets.length});
    }catch(e){unresolved.push({id:b.id,at:[v.x,v.y,v.z],symbol:v.material,reason:'window-producer-error: '+e.message});}
   }
   if(v.kind==='fixture'&&v.material.startsWith('pack5:')){
    if(!v.physicalVariant||v.physicalVariant==='unresolved'){
     unresolved.push({id:b.id,at:[v.x,v.y,v.z],symbol:v.material,reason:'pack5-variant-not-authored'});
     continue;
    }
    try{
     const physical=resolveManualFivePackAsset(v.material,{variant:v.physicalVariant,orientation:v.intendedFacing??'north'});
     const overlapped=physical.occupiedOffsets.map(d=>[v.x+d[0],v.y+d[1],v.z+d[2]])
       .filter(pos=>pos.join(',')!==[v.x,v.y,v.z].join(',')&&occupied.has(pos.join(',')));
     resolvedFixtures.push({id:b.id,at:[v.x,v.y,v.z],symbol:v.material,variant:v.physicalVariant,orientation:physical.orientation,
       occupiedOffsets:physical.occupiedOffsets.length,collisionBoxes:physical.collisionBoxes.length,
       selectionBoxes:physical.selectionBoxes.length,supportOffsets:physical.supportOffsets.length,
       overlappedConceptualCells:overlapped});
    }catch(e){unresolved.push({id:b.id,at:[v.x,v.y,v.z],symbol:v.material,reason:'fixture-producer-error: '+e.message});}
   }
  }
 }
 return Object.freeze({
  authoredBlueprints:buildings.length,manualFamilies:MANUAL_FIVE_PACK_COUNTS.families,
  manualVariants:MANUAL_FIVE_PACK_COUNTS.numericVariants,productionRegistered:MANUAL_FIVE_PACK_COUNTS.productionRegistered,
  manualSymbolUse:Object.freeze([...symbolUse].filter(([key])=>key.startsWith('pack')).sort()),
  biome130VoxelUses:unresolved.filter(x=>x.reason==='biome130-live-registration-and-shape-not-proven').length,
  unknownManualSymbols:Object.freeze(unresolved.filter(x=>x.reason==='missing-manual-family')),
  resolvedFixtureCandidates:Object.freeze(resolvedFixtures),
  physicallyInspectedWindows:Object.freeze(shapedWindows),
  roofSymbols:Object.freeze([...roofSymbols].sort()),
  pending:Object.freeze(unresolved),
  hasFinalPhysicalFamilyAcceptance:false,worldPlaced:false,saveWritten:false
 });
}