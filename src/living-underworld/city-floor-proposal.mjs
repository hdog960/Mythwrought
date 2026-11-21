// City-grade plateau candidate: physical solid floor under a clear-air volume.
// Pure detached planning; no settlements, terrain writes or save side effects.
import {planUnderworldRegion,networkAirAt,UNDERWORLD_REGION_SIDE}
 from './worldwide-network.mjs';
import {candidateCaveAt} from './procedural-core.mjs';
const integer=n=>Number.isSafeInteger(n);
function neighboringCitySites(seed,x,z){
 const rx=Math.floor(x/UNDERWORLD_REGION_SIDE),rz=Math.floor(z/UNDERWORLD_REGION_SIDE);
 const out=[];
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
  const candidate=planUnderworldRegion(seed,rx+dx,rz+dz).cityCandidate;
  if(candidate&&Math.abs(x-candidate.x)<=candidate.rx*.57&&
    Math.abs(z-candidate.z)<=candidate.rz*.57)out.push(candidate);
 }
 return out;
}
export function cityFloorAt(seed,x,y,z){
 if(!integer(seed)||seed!==(seed|0)||![x,y,z].every(integer))
  throw new TypeError('Invalid city-floor candidate voxel');
 if(y<-210||y>-4)return false;
 for(const city of neighboringCitySites(seed,x,z)){
  const nx=(x-city.x)/(city.rx*.55),nz=(z-city.z)/(city.rz*.55);
  if(nx*nx+nz*nz>1)continue;
  const floorY=city.y-8;
  if(y>=floorY-5&&y<=floorY)return true;
 }
 return false;
}
export function detachedUnderworldAirAt(seed,x,y,z){
 if(!integer(seed)||seed!==(seed|0)||![x,y,z].every(integer))
  throw new TypeError('Invalid detached-world voxel');
 if(y<-210||y>-4)return false;
 if(cityFloorAt(seed,x,y,z))return false;
 // Floor clearance is a deliberate air-envelope over an actual solid pad.
 for(const city of neighboringCitySites(seed,x,z)){
  const nx=(x-city.x)/(city.rx*.55),nz=(z-city.z)/(city.rz*.55);
  if(nx*nx+nz*nz<=1&&y>=city.y-7&&y<=city.y+4)return true;
 }
 return networkAirAt(seed,x,y,z)||candidateCaveAt(seed,x,y,z);
}
export function auditDetachedCityFloor(seed,rx,rz,{sampleStep=3}={}){
 if(!integer(seed)||seed!==(seed|0)||![rx,rz].every(integer)||
    !integer(sampleStep)||sampleStep<1||sampleStep>8)throw new TypeError('Invalid city floor audit');
 const city=planUnderworldRegion(seed,rx,rz).cityCandidate;
 if(!city)return Object.freeze({candidatePresent:false,seed,rx,rz});
 const floorY=city.y-8;
 let samples=0,confirmed=0;
 for(let x=Math.floor(city.x-city.rx*.55);x<=city.x+city.rx*.55;x+=sampleStep)
  for(let z=Math.floor(city.z-city.rz*.55);z<=city.z+city.rz*.55;z+=sampleStep){
   const nx=(x-city.x)/(city.rx*.55),nz=(z-city.z)/(city.rz*.55);
   if(nx*nx+nz*nz>1)continue;
   samples++;
   let good=cityFloorAt(seed,x,floorY,z);
   for(let y=floorY+1;y<=floorY+9&&good;y++)
    good=detachedUnderworldAirAt(seed,x,y,z);
   if(good)confirmed++;
  }
 return Object.freeze({candidatePresent:true,seed,rx,rz,floorY,
  sampledSites:samples,fullyClearSamples:confirmed,
  estimatedContiguousFloorCells:confirmed*sampleStep*sampleStep,
  floorAndClearanceConfirmedAtSampledCells:confirmed===samples,
  actualPlayerWalkabilityNotYetValidated:true,
  settlementPlacementNotPerformed:true});
}
