// Builder 2A read-only physical-family geometry and conceptual support diagnostics.
// The shapes are producer-backed; world support / save ABI is never self-certified.
import {M1_GENERAL_STORES} from './m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from './m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from './m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from './m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from './m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from './m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from './m1-market-fronts.mjs';
import {M1_COURTYARD_SHOPS} from './m1-courtyard-shops.mjs';
import {manualFivePackVariants,resolveManualFivePackAsset,MANUAL_FIVE_PACK_FAMILY_SYMBOLS} from '../../builder-assets/manual-five-pack.mjs';
const blueprints=Object.freeze([...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS]);
const families=new Set(MANUAL_FIVE_PACK_FAMILY_SYMBOLS);
const key=(x,y,z)=>[x,y,z].join(',');
const bearingKind=v=>v&&['roof','wall','foundation','floor'].includes(v.kind);
const physical=(symbol,orientation,variant)=>{
 const versions=manualFivePackVariants(symbol);
 if(symbol.startsWith('pack5:')&&!variant)return {pending:'Pack5 authored variant unresolved; no default chosen'};
 if(versions.length!==1)return {pending:'Ambiguous numeric variant, no default selected',choices:versions.map(x=>x.numericId)};
 try{
  const r=resolveManualFivePackAsset(symbol,{numericId:versions[0].numericId,orientation,variant:variant??null});
  return {valid:true,numericId:r.numericId,sourcePack:r.sourcePack,orientation:r.orientation,
    visibleBoxes:r.visibleBoxes.length,selectionBoxes:r.selectionBoxes.length,collisionBoxes:r.collisionBoxes.length,
    occupiedOffsets:r.occupiedOffsets,supportOffsets:r.supportOffsets,supportPolicy:r.supportPolicy};
 }catch(e){return{pending:'physical source descriptor rejected configuration: '+e.message};}
};
export function inspect2ARoofAndWindows(books=blueprints){
 if(!Array.isArray(books)||books.length<1)throw new TypeError('one or more coordinate blueprints required');
 const facade=[],roofs=[],pending=[],unsupportedSamples=[],gables=[],materialUse=new Map();
 let roofCells=0,rootPlateMissingSupport=0,raisedMissingVerticalSupport=0,facadeMountWarnings=0,totalWindows=0;
 for(const b of books){
  const cell=new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));
  if(cell.size!==b.voxels.length)throw Error('duplicate source coordinate '+b.id);
  const roof=b.voxels.filter(v=>v.kind==='roof');
  roofCells+=roof.length;
  const roofBySymbol=new Map();
  for(const v of roof){
   const below=cell.get(key(v.x,v.y-1,v.z)),bearing=bearingKind(below);
   if(!bearing){
    if(v.roofBearing)raisedMissingVerticalSupport++;else rootPlateMissingSupport++;
    if(unsupportedSamples.length<40)unsupportedSamples.push({id:b.id,at:[v.x,v.y,v.z],material:v.material,role:v.architecturalRole??null,reason:'no source load-bearing cell directly below; real span analysis required'});
   }
   roofBySymbol.set(v.material,(roofBySymbol.get(v.material)??0)+1);
   materialUse.set(v.material,(materialUse.get(v.material)??0)+1);
  }
  for(const [symbol,count] of roofBySymbol){
   const proof=families.has(symbol)?physical(symbol,'north',null):{pending:'not a verified manual family'};
   const row={id:b.id,symbol,count,...proof,certifiedLoadBearing:false};
   roofs.push(row);
   if(proof.pending)pending.push({id:b.id,symbol,reason:proof.pending,usage:'roof'});
  }
  const raised=b.voxels.filter(v=>v.architecturalRole);
  if(raised.length)gables.push({id:b.id,roles:[...new Set(raised.map(v=>v.architecturalRole))],cells:raised.length,highest:Math.max(...raised.map(v=>v.y))});
  for(const v of b.voxels.filter(v=>v.kind==='window')){
   totalWindows++;
   const yaw=v.z===0?'north':v.z===b.extents.z-1?'south':v.x===0?'west':v.x===b.extents.x-1?'east':null;
   if(!yaw){pending.push({id:b.id,symbol:v.material,at:[v.x,v.y,v.z],reason:'glazing not on known exterior facade',usage:'window'});continue;}
   const proof=families.has(v.material)?physical(v.material,yaw,null):{pending:'window family missing'};
   const required=(proof.supportOffsets??[]).map(off=>[v.x+off[0],v.y+off[1],v.z+off[2]]);
   const lacking=required.filter(pos=>!bearingKind(cell.get(key(...pos))));
   if(lacking.length)facadeMountWarnings++;
   const row={id:b.id,symbol:v.material,at:[v.x,v.y,v.z],orientation:yaw,
    registeredOpening:b.openings.some(o=>o.type==='window'&&o.x===v.x&&o.y===v.y&&o.z===v.z&&o.material===v.material),
    producer:proof,requiredSupports:required,uncertifiedSupports:lacking,physicalGlassAndMountAccepted:false};
   facade.push(row);
   if(!row.registeredOpening)pending.push({id:b.id,symbol:v.material,at:row.at,reason:'physical window not represented by matching material opening',usage:'window'});
   if(proof.pending)pending.push({id:b.id,symbol:v.material,at:row.at,reason:proof.pending,usage:'window'});
  }
 }
 return Object.freeze({designs:books.length,roofCells,totalWindows,
  rootPlateMissingSupport,raisedMissingVerticalSupport,facadeMountWarnings,
  uniqueRoofMaterials:[...materialUse].sort(),
  roofSourceDescriptors:roofs,facadePhysicalChecks:facade,
  raisedGabledSourceDesigns:gables,unsupportedSamples,pending,
  physicalFamilyMeshesRendered:false,worldSupportCertified:false,windowTransparencyApproved:false,
  creatorApproved:false,worldPlaced:false,saveWritten:false});
}
