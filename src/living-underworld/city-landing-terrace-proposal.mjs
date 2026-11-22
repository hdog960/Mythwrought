// Read-only source-aware ALTERNATE TERRACE proposal around a rare cavern's
// existing detached landing. NOT a replacement for the historical city pad,
// not a settlement, and not proof of a linked, walkable world.
// Search largest safe radius first; never waive source/gallery/budget gates.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {compileMainGalleryPedestrianClearance}
 from './combined-stair-footprints.mjs';
import {isCandidateGeologyMaterial}
 from './protected-entrance-envelope.mjs';
const INT=Number.isSafeInteger;
const ROLES=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const RADII=Object.freeze([16,12,8,6,4]);
const key=(x,y,z)=>x+','+y+','+z;
export function proposeProtectedCityLandingTerrace(seed,rx,rz,{
 source,maxSourceChecks=60000
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !source||typeof source!=='object'||
  ROLES.some(k=>typeof source[k]!=='function')||
  !INT(maxSourceChecks)||maxSourceChecks<100||maxSourceChecks>100000)
  throw TypeError('Invalid source-aware detached terrace search');
 const city=planUnderworldRegion(seed,rx,rz).cityCandidate;
 if(!city)return Object.freeze({sitePresent:false,seed,rx,rz,
  worldChanged:false});
 const floorY=city.y-8,center=Object.freeze({
  x:city.x+20,y:floorY+1,z:city.z+20
 });
 const index=compileMainGalleryPedestrianClearance(seed,rx,rz);
 if(!index.ok)return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
  reason:index.reason,inspectedRadii:0,sourceChecks:0,
  worldChanged:false});
 const cache=new Map(),attempts=[];
 let sourceChecks=0;
 for(const radius of RADII){
  const columns=[];
  let invalid=null;
  outer:for(let dx=-radius;dx<=radius;dx++)
   for(let dz=-radius;dz<=radius;dz++){
    if(dx*dx+dz*dz>radius*radius)continue;
    const x=center.x+dx,z=center.z+dz;
    const nx=(x-city.x)/(city.rx*.55),nz=(z-city.z)/(city.rz*.55);
    if(nx*nx+nz*nz>1){
     invalid='TERRACE_OUTSIDE_DETACHED_CITY_ENVELOPE';break outer;
    }
    columns.push(Object.freeze({x,z}));
    for(let y=floorY-5;y<=floorY+9;y++){
     const kind=y<=floorY?'support':'clearance';
     const clash=index.inspectCell(x,y,z,kind);
     if(clash){invalid='TERRACE_BLOCKS_HORIZONTAL_GALLERY';break outer;}
    }
   }
  if(invalid){
   attempts.push(Object.freeze({radius,ok:false,reason:invalid,
    columnsInspected:columns.length}));
   continue;
  }
  let refusal=null,firstRejectedCell=null;
  scan:for(const {x,z} of columns)for(let y=floorY-5;y<=floorY+9;y++){
   const k=key(x,y,z),kind=y<=floorY?'support':'clearance';
   let validation=cache.get(k);
   if(validation===undefined){
    if(sourceChecks>=maxSourceChecks){
     refusal='TERRACE_ORIGINAL_SOURCE_BUDGET';break scan;
    }
    sourceChecks++;
    let reason=null;
    if(y< -210||y>19)reason='WORLD_BOUNDS';
    else if(source.editedAt(x,y,z))reason='PLAYER_EDIT';
    else{
     const owner=source.authoredAt(x,y,z);
     if(owner!==undefined&&(!INT(owner)||owner<0))reason='INVALID_AUTHORED_SOURCE';
     else if(owner!==undefined&&owner!==0)reason='AUTHORED_SOURCE';
     else if(source.protectedAt(x,y,z))reason='PROTECTED_LANDMARK';
     else{
      const block=source.naturalAt(x,y,z);
      if(!isCandidateGeologyMaterial(block))reason='UNSAFE_MATERIAL';
      else if(owner===0&&block!==0)reason='AUTHORED_AIR_MISMATCH';
      else if(kind==='support'&&block===0)
       reason=owner===0?'AUTHORED_AIR_SUPPORT':'NATURAL_AIR_SUPPORT';
     }
    }
    validation=Object.freeze({ok:reason===null,reason});
    cache.set(k,validation);
   }
   if(!validation.ok){
    refusal=validation.reason;
    firstRejectedCell=Object.freeze({x,y,z,kind});
    break scan;
   }
  }
  attempts.push(Object.freeze({radius,ok:refusal===null,
   reason:refusal,columnsInspected:columns.length,
   firstRejectedCell}));
  if(refusal===null)return Object.freeze({
   sitePresent:true,ok:true,seed,rx,rz,center,floorY,
   radius,columns:columns.length,sourceChecks,
   inspectedRadii:attempts.length,attempts:Object.freeze(attempts),
   corridorMutualClearanceWith16MainGalleries:true,
   allSupportAndNineHeadroomSourceOwned:true,
   oldWholeCityPadNotApproved:true,
   entranceRampSourceNotYetApproved:true,
   interlevelStairMutualClearanceNotYetApproved:true,
   terrainActuallyModified:false,worldChanged:false,
   originalM7ReaderIdentityVerifiedByCallerOnly:true});
  if(refusal==='TERRACE_ORIGINAL_SOURCE_BUDGET')break;
 }
 return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
  reason:attempts.at(-1)?.reason??'NO_TERRACE_GEOMETRY',
  center,floorY,inspectedRadii:attempts.length,sourceChecks,
  attempts:Object.freeze(attempts),
  wholeCityPadNotApproved:true,worldChanged:false});
}
