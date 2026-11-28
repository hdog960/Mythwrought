// Detached mega-cavern access RAMP design, not live-world terrain carving.
// The future city floor cannot be described as accessible just because it is flat.
// This audits an intended, supported approach from the network hub to the pad.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {detachedCalibratedUnderworldAirAt} from './depth-calibrated-proposal.mjs';
import {auditCaveCenterline} from './physical-connectivity-audit.mjs';
import {auditSupportedEntranceStairs} from './walkable-entrance-stairs.mjs';
const int=Number.isSafeInteger;
export function auditCityAccessRamp(seed,rx,rz){
 if(!int(seed)||seed!==(seed|0)||![rx,rz].every(int))
  throw new TypeError('Invalid candidate city access survey');
 const plan=planUnderworldRegion(seed,rx,rz),city=plan.cityCandidate;
 if(!city)return Object.freeze({sitePresent:false,seed,rx,rz});
 const level=plan.layers.find(x=>x.hub.y>=city.y-4&&x.hub.y<=city.y+4);
 if(!level)return Object.freeze({sitePresent:true,ok:false,reason:'CITY_LEVEL_HUB_NOT_FOUND'});
 // The plateau center is guaranteed within the oval; the landing is offset
 // to leave enough horizontal travel for a safe max-rise-of-one descent.
 const floorY=city.y-8;
 const destination=Object.freeze({x:city.x+20,y:floorY+1,z:city.z+20});
 const from=level.hub;
 const proposal=Object.freeze({ok:true,segments:Object.freeze([
  Object.freeze({a:from,b:destination,radius:3.8})
 ])});
 const air=(x,y,z)=>detachedCalibratedUnderworldAirAt(seed,x,y,z);
 const route=auditCaveCenterline(from,destination,air);
 const stairs=auditSupportedEntranceStairs(proposal,{maxCells:20000});
 let clearance=true,support=true;
 const landingSample=Object.freeze({x:destination.x,y:destination.y,z:destination.z});
 for(let dz=-1;dz<=1;dz++)for(let dx=-1;dx<=1;dx++){
  const x=destination.x+dx,z=destination.z+dz;
  for(let y=floorY+1;y<=floorY+3;y++)if(!air(x,y,z))clearance=false;
  if(air(x,floorY,z))support=false;
 }
 return Object.freeze({sitePresent:true,ok:route.ok&&stairs.ok&&clearance&&support,
  seed,rx,rz,hub:from,landing:landingSample,floorY,
  routeAirFaceConnected:route.ok,routeFaceSteps:route.faceSteps??0,
  candidateStairDeckValid:stairs.ok,
  stairCells:stairs.supportCells,
  maximumStepRise:stairs.maximumStepRise,
  landing3WideClearance:clearance,
  landingSolidSupport:support,
  reasons:Object.freeze([!route.ok?'AIR_GAP':null,!stairs.ok?'STAIR_INVALID':null,
   !clearance?'HEADROOM_MISSING':null,!support?'LANDING_FLOOR_MISSING':null].filter(Boolean)),
  deckPlaced:false,physicsTested:false,surfaceEntranceJoined:false,
  originalM7Edited:false});
}
