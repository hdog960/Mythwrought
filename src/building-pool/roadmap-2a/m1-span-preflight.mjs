// Builder 2A independent conceptual roof-span / spandrel acceptance preflight.
// Lateral distances are VOXEL COUNTS, NOT physical engineering load ratings.
import {M1_GENERAL_STORES} from './m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from './m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from './m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from './m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from './m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from './m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from './m1-market-fronts.mjs';
import {M1_COURTYARD_SHOPS} from './m1-courtyard-shops.mjs';
import {M1_U_COURT_SHOPS} from './m1-u-court-shops.mjs';
export const SPAN_CANDIDATES=Object.freeze([...M1_GENERAL_STORES,...M1_SPECIALIST_EXEMPLARS,...M1_NEW_MERCHANTS,...M1_REGIONAL_SHOPS,...M1_BIOME_EXPANSION,...M1_CATEGORY_ARCADES,...M1_MARKET_FRONTS,...M1_COURTYARD_SHOPS,...M1_U_COURT_SHOPS]);
const key=(x,y,z)=>[x,y,z].join(',');
const bearing=v=>v&&['wall','floor','foundation','roof'].includes(v.kind);
export function inspect2AConceptualRoofSpans(books=SPAN_CANDIDATES){
 if(!Array.isArray(books)||!books.length)throw TypeError('must inspect source blueprint array');
 const records=[],notRooted=[],spanWarnings=[];let directlySupported=0,withoutDirectSupport=0,unrootedElevations=0,unknownSpandrels=0;
 for(const b of books){
  const map=new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));if(map.size!==b.voxels.length)throw Error('overlapping source coordinates');
  const byLevel=new Map();
  for(const v of b.voxels.filter(v=>v.kind==='roof')){
   if(!byLevel.has(v.y))byLevel.set(v.y,[]);
   byLevel.get(v.y).push(v);
  }
  const levels=[];let buildingUnsupported=0,maxRoofReach=0;
  for(const [y,roof] of byLevel){
   const level=new Map(roof.map(v=>[v.x+','+v.z,v])),queue=[],distance=new Map(),unattached=[];
   for(const v of roof)if(bearing(map.get(key(v.x,v.y-1,v.z)))){
    directlySupported++;distance.set(v.x+','+v.z,0);queue.push([v.x,v.z]);
   }else{
    withoutDirectSupport++;buildingUnsupported++;
    if(v.roofBearing){unrootedElevations++;notRooted.push({id:b.id,at:[v.x,v.y,v.z],reason:'raised roof lacks direct root support'});}
   }
   for(let i=0;i<queue.length;i++){
    const [x,z]=queue[i],d=distance.get(x+','+z);
    for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
     const at=(x+dx)+','+(z+dz);
     if(level.has(at)&&!distance.has(at)){distance.set(at,d+1);queue.push([x+dx,z+dz]);}
    }
   }
   let farthest=0,unsupported=0,unreachable=0;
   for(const v of roof){
    const d=distance.get(v.x+','+v.z);
    if(d===undefined){unreachable++;unattached.push([v.x,v.y,v.z]);}
    else if(d>0){unsupported++;if(d>farthest)farthest=d;}
   }
   maxRoofReach=Math.max(maxRoofReach,farthest);
   if(unreachable)spanWarnings.push({id:b.id,level:y,reason:'roof patch has no connected direct-bearing root',unreachable,samples:unattached.slice(0,6)});
   levels.push({level:y,cells:roof.length,notDirectlySupported:unsupported,unreachable,maxNearestBearingDistance:farthest});
  }
  const weakSpandrels=b.voxels.filter(v=>v.structuralSpanUnverified);
  unknownSpandrels+=weakSpandrels.length;
  records.push({id:b.id,roofCells:levels.reduce((a,v)=>a+v.cells,0),withoutDirectSupport:buildingUnsupported,maxNearestBearingDistance:maxRoofReach,unapprovedSpandrels:weakSpandrels.length,levels});
 }
 return Object.freeze({buildings:books.length,directlySupportedRoofCells:directlySupported,roofCellsWithoutDirectBearing:withoutDirectSupport,
  unrootedElevations,unapprovedSpandrelCells:unknownSpandrels,unrootedSamples:notRooted.slice(0,50),
  maximumLateralCellsToNearestBearing:Math.max(...records.map(x=>x.maxNearestBearingDistance)),
  spans:records,warnings:spanWarnings,physicalRoofLoadCertified:false,structuralEngineeringPerformed:false,worldPlaced:false});
}
