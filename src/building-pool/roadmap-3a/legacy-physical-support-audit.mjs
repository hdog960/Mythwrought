// Fail-closed, read-only physical support audit for the exact source-preserved
// 15 legacy blacksmiths. Does NOT mutate geometry, add supports or write world.
import {createLegacyBlacksmithPool} from './legacy-blacksmiths.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';

const key=(x,y,z)=>[x,y,z].join(',');
export function auditLegacyBlacksmithSupports(){
 const buildings=[];
 for(const b of createLegacyBlacksmithPool()){
  const occupied=new Set(b.modules.flatMap(m=>m.cells.map(c=>key(...c.slice(0,3)))));
  const unresolved=[];
  for(const module of b.modules)for(const [x,y,z,ref] of module.cells){
   if(ref!=='pack4:063'&&ref!=='pack4:064')continue;
   const physical=resolveManualFivePackAsset(ref,{orientation:'north'});
   for(const [dx,dy,dz] of physical.supportOffsets){
    const at=[x+dx,y+dy,z+dz];
    if(!occupied.has(key(...at)))unresolved.push(Object.freeze({
     ref,position:Object.freeze([x,y,z]),requiredSupport:Object.freeze(at),
     sourcePhysicalSupportPolicy:physical.supportPolicy,
     classification:'missing-authored-source-support',
     repairStatus:'BLOCKED_PRESERVE_ORIGINAL_PR122_GEOMETRY'
    }));
   }
  }
  buildings.push(Object.freeze({id:b.id,biome:b.biome,size:b.size,
   geometryPreserved:true,creatorApproved:false,worldIntegrated:false,
   missingSupportCount:unresolved.length,unresolved:Object.freeze(unresolved)}));
 }
 const count=buildings.reduce((n,b)=>n+b.missingSupportCount,0);
 const refs=Object.freeze(Object.fromEntries(['pack4:063','pack4:064'].map(ref=>
  [ref,buildings.reduce((n,b)=>n+b.unresolved.filter(x=>x.ref===ref).length,0)])));
 return Object.freeze({
  schema:'mythwrought.builder-3a.legacy-support-blockers.v1',
  originalPR:122,blueprintCount:buildings.length,
  missingSupports:count,byFamily:refs,
  sourceShapeCertified:false,worldPlacementAllowed:false,
  repairsApplied:false,legacyGeometryChanged:false,
  buildings:Object.freeze(buildings)
 });
}
