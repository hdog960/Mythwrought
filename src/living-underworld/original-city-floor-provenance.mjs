// Complete detached rare-city pad source ownership preflight. Read-only.
// Original M7 material and authoring are inspected at every proposed floor
// support + nine headroom cells; budget exhaustion is a refusal, not approval.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {isCandidateGeologyMaterial} from './protected-entrance-envelope.mjs';
import {compileMainGalleryPedestrianClearance}
 from './combined-stair-footprints.mjs';
const INT=Number.isSafeInteger;
const FIELDS=['naturalAt','authoredAt','editedAt','protectedAt'];
export function auditOriginalCityFloorProvenance(seed,rx,rz,{
 source,maxColumns=25000,maxSourceChecks=150000
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !source||typeof source!=='object'||FIELDS.some(k=>typeof source[k]!=='function')||
  !INT(maxColumns)||maxColumns<1||maxColumns>40000||
  !INT(maxSourceChecks)||maxSourceChecks<1||maxSourceChecks>400000)
  throw TypeError('Invalid original city floor provenance audit');
 const city=planUnderworldRegion(seed,rx,rz).cityCandidate;
 if(!city)return Object.freeze({sitePresent:false,seed,rx,rz,worldChanged:false});
 const minX=Math.ceil(city.x-city.rx*.55),maxX=Math.floor(city.x+city.rx*.55);
 const minZ=Math.ceil(city.z-city.rz*.55),maxZ=Math.floor(city.z+city.rz*.55);
 const floorY=city.y-8;
 let columns=0;
 for(let z=minZ;z<=maxZ;z++)for(let x=minX;x<=maxX;x++){
  const nx=(x-city.x)/(city.rx*.55),nz=(z-city.z)/(city.rz*.55);
  if(nx*nx+nz*nz<=1)columns++;
 }
 if(columns>maxColumns||columns*15>maxSourceChecks)return Object.freeze({
  sitePresent:true,ok:false,seed,rx,rz,
  reason:'CITY_ORIGINAL_SOURCE_PREFLIGHT_BUDGET',columns,
  requiredSourceChecks:columns*15,maxColumns,maxSourceChecks,
  sourceChecks:0,worldChanged:false
 });
 const galleries=compileMainGalleryPedestrianClearance(seed,rx,rz);
 if(!galleries.ok)return Object.freeze({sitePresent:true,ok:false,
  seed,rx,rz,reason:'CITY_MAIN_GALLERY_INDEX_UNSAFE',
  galleryReason:galleries.reason,sourceChecks:0,
  worldChanged:false});
 let checked=0,solidSupport=0,existingHeadroomAir=0,excavation=0;
 for(let z=minZ;z<=maxZ;z++)for(let x=minX;x<=maxX;x++){
  const nx=(x-city.x)/(city.rx*.55),nz=(z-city.z)/(city.rz*.55);
  if(nx*nx+nz*nz>1)continue;
  for(let y=floorY-5;y<=floorY+9;y++){
   const type=y<=floorY?'support':'clearance';
   // A solid city pad cannot consume an original gallery's walking AIR,
   // and city headroom cannot consume any existing gallery's deck.
   const conflict=galleries.inspectCell(x,y,z,type);
   if(conflict)return Object.freeze({sitePresent:true,ok:false,
    seed,rx,rz,reason:'CITY_PAD_CONFLICTS_WITH_MAIN_GALLERY',
    horizontalPairIndex:conflict.horizontalPairIndex,
    firstRejectedCell:Object.freeze({x,y,z,type}),columns,
    sourceChecks:checked,worldChanged:false,
    cityPadAndOriginalGalleryMutualClearanceVerified:false});
   checked++;
   let refusal=null;
   if(y< -210||y>19)refusal='WORLD_BOUNDS';
   else if(source.editedAt(x,y,z))refusal='PLAYER_EDIT';
   else{
    const owner=source.authoredAt(x,y,z);
    if(owner!==undefined&&(!INT(owner)||owner<0))refusal='INVALID_AUTHORED_SOURCE';
    else if(owner!==undefined&&owner!==0)refusal='AUTHORED_SOURCE';
    else if(source.protectedAt(x,y,z))refusal='PROTECTED_LANDMARK';
    else{
     const material=source.naturalAt(x,y,z);
     if(!isCandidateGeologyMaterial(material))refusal='UNSAFE_MATERIAL';
     else if(owner===0&&material!==0)refusal='AUTHORED_AIR_MISMATCH';
     else if(type==='support'){
      if(material===0)refusal=owner===0?'AUTHORED_AIR_SUPPORT':'NATURAL_AIR_SUPPORT';
      else solidSupport++;
     }else if(material===0)existingHeadroomAir++;
     else excavation++;
    }
   }
   if(refusal)return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
    reason:'ORIGINAL_CITY_PAD_SOURCE_UNSAFE',firstRefusal:refusal,
    firstRejectedCell:Object.freeze({x,y,z,type}),columns,
    sourceChecks:checked,originalSourceOwned:true,
    floorActuallyConstructed:false,worldChanged:false});
  }
 }
 return Object.freeze({sitePresent:true,ok:true,seed,rx,rz,columns,
  sourceChecks:checked,solidSupport,existingHeadroomAir,excavation,
  fullFootprintChecked:true,originalSourceOwned:true,
  cityPadAndOriginalGalleryMutualClearanceVerified:true,
  floorActuallyConstructed:false,worldChanged:false,
  genuineM7ReaderIdentityVerifiedByCallerOnly:true,
  livePlayerWalkingVerified:false});
}
