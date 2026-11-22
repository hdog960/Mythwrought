// Builder 4A M1: read-only merged five-pack physical ABI audit.
// Resolving a source shape is NOT choosing a buildable/saved world placement.
import {validateBlueprint} from './schema.mjs';
import {allM1} from './m1-blueprints.mjs';
import {MANUAL_FIVE_PACK_COUNTS,manualFivePackVariants,resolveManualFivePackAsset}
 from '../../builder-assets/manual-five-pack.mjs';

const material=/^pack[1-5]:\d{3}$/;
const biome=/^biome130:\d{3}$/;
export function auditBlueprintMaterials(b){
 validateBlueprint(b);
 const groups=new Map();
 for(const c of b.cells){
  if(!material.test(c.asset)&&!biome.test(c.asset))continue;
  const k=[c.asset,c.facing,c.role].join('|');
  const row=groups.get(k)??{ref:c.asset,facing:c.facing,role:c.role,cells:0};
  row.cells++;groups.set(k,row);
 }
 const entries=[...groups.values()].sort((a,b)=>[a.ref,a.facing,a.role].join('|').localeCompare([b.ref,b.facing,b.role].join('|'))).map(g=>{
  if(biome.test(g.ref))return {...g,status:'unregistered-biome130-symbol',chosenNumericId:null,
   blockedBy:['asset-specific live registration and full shape/collision verification','future schema and support integration']};
  const available=manualFivePackVariants(g.ref);
  if(available.length!==1)return {...g,status:'numeric-variant-choice-required',variantChoices:available.length,chosenNumericId:null,
   blockedBy:['explicit variant choice from merged catalog','exact orientation, attachment and saved-state acceptance']};
  if(available[0].pack===5)return {...g,status:'authored-variant-choice-required',variantChoices:1,chosenNumericId:null,
   blockedBy:['explicit Pack 5 authored variant','occupied footprint, support and saved-state acceptance']};
  try{
   const shape=resolveManualFivePackAsset(g.ref,{numericId:available[0].numericId,orientation:g.facing});
   if(!shape.physical||!shape.builderResolvable||shape.livePlaceable||shape.saveWritten)
     throw Error('unsafe or non-source-confirmed physical result');
   return {...g,status:'source-shape-resolved-for-review',variantChoices:1,chosenNumericId:null,
     visibleAABBs:shape.visibleBoxes.length,selectionAABBs:shape.selectionBoxes.length,
     collisionAABBs:shape.collisionBoxes.length,
     occupiedOffsets:shape.occupiedOffsets.length,
     supportOffsets:shape.supportOffsets.length,supportPolicy:shape.supportPolicy,
     blockedBy:['verify full-building support, joints and oriented roof/window mounts','validate actual player-body clearance, persistent rotation and world-height limits']};
  }catch(e){
   return {...g,status:'source-shape-resolution-failed',variantChoices:1,chosenNumericId:null,
    blockedBy:[String(e?.message??e)]};
  }
 });
 return Object.freeze({id:b.id,biome:b.biome,size:b.size,kind:b.type,
   structuralCells:b.cells.length,bounds:b.bounds,worldHeightPreflightRequired:true,
   symbolicCells:entries.reduce((n,e)=>n+e.cells,0),
   shapeSampleGroups:entries.filter(e=>e.status==='source-shape-resolved-for-review').length,
   blockedGroups:entries.filter(e=>e.status!=='source-shape-resolved-for-review').length,
   entries,productionReady:false,worldPlaced:false,saveWritten:false,
   realIphoneTested:false,creatorVisualApproved:false});
}
export function auditAllM1Materials(){
 if(MANUAL_FIVE_PACK_COUNTS.families!==96||MANUAL_FIVE_PACK_COUNTS.numericVariants!==106)
   throw Error('Manual catalog ABI was changed; stop 4A review');
 const reports=allM1().map(auditBlueprintMaterials);
 return Object.freeze({designs:reports.length,manualFamilies:96,manualVariants:106,
  physicalShapeSampleGroups:reports.reduce((sum,x)=>sum+x.shapeSampleGroups,0),
  blockedGroups:reports.reduce((sum,x)=>sum+x.blockedGroups,0),
  totalGroups:reports.reduce((sum,x)=>sum+x.entries.length,0),
  allReadyForWorld:false,reports});
}
