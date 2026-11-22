// Detached rare-cavern terrace AND access route acceptance, read-only.
// Neither a beautiful future floor nor individually valid stairs certify a
// connected pedestrian route. All source provenance stays caller-bound to the
// original M7 reader; no edits, biome or settlement placement ever occur.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {auditSelectedInterlevelTopology}
 from './source-network-topology.mjs';
import {auditCityAccessRamp} from './city-access-proposal.mjs';
import {auditProtectedSubsurfaceStairs} from './protected-subsurface-stairs.mjs';
import {compileMainGalleryPedestrianClearance,
 compileSelectedStairPedestrianClearance} from './combined-stair-footprints.mjs';
import {proposeProtectedCityLandingTerrace}
 from './city-landing-terrace-proposal.mjs';

const INT=Number.isSafeInteger;
const ROLES=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const same=(a,b)=>a&&b&&a.x===b.x&&a.y===b.y&&a.z===b.z;

export function auditSourceProtectedCityTerraceAccess(seed,rx,rz,{
 source,additionalStairProposals=[],requireCompleteDeepLinks=false,
 maxTotalSourceChecks=60000
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !source||typeof source!=='object'||ROLES.some(k=>typeof source[k]!=='function')||
  !Array.isArray(additionalStairProposals)||additionalStairProposals.length>7||
  typeof requireCompleteDeepLinks!=='boolean'||
  !INT(maxTotalSourceChecks)||maxTotalSourceChecks<1000||
  maxTotalSourceChecks>100000)
  throw TypeError('Invalid protected rare-cavern pedestrian link');
 const city=planUnderworldRegion(seed,rx,rz).cityCandidate;
 if(!city)return Object.freeze({sitePresent:false,seed,rx,rz,worldChanged:false});
 // A partial set of arbitrary stairway proposals is never equivalent to
 // three real interlevel links joining all four source-network hubs.
 const topology=requireCompleteDeepLinks?
  auditSelectedInterlevelTopology(seed,rx,rz,additionalStairProposals):null;
 if(topology&&!topology.ok)return Object.freeze({sitePresent:true,
  ok:false,seed,rx,rz,reason:'DEEP_INTERLEVEL_TOPOLOGY_UNSAFE',
  topologyRefusal:topology.reason,sourceChecks:0,
  worldChanged:false,playerWalkingUnverified:true});
 const access=auditCityAccessRamp(seed,rx,rz);
 if(access.ok!==true||access.sitePresent!==true||!access.hub||!access.landing||
  access.candidateStairDeckValid!==true||access.routeAirFaceConnected!==true||
  access.landing3WideClearance!==true||access.landingSolidSupport!==true)
  return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
   reason:'DETACHED_CITY_ACCESS_GEOMETRY_UNSAFE',
   accessReasons:access.reasons??[],sourceChecks:0,worldChanged:false});
 const landing={x:city.x+20,y:city.y-7,z:city.z+20};
 if(!planUnderworldRegion(seed,rx,rz).layers.some(l=>same(l.hub,access.hub)))
  return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
   reason:'CITY_ACCESS_NOT_JOINED_TO_SOURCE_HUB',
   sourceChecks:0,worldChanged:false});
 if(!same(access.landing,landing))
  return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
   reason:'CITY_LANDING_MISMATCH',sourceChecks:0,worldChanged:false});
 const route=Object.freeze({ok:true,segments:Object.freeze([
  Object.freeze({a:access.hub,b:access.landing})
 ])});
 const selected=[route,...additionalStairProposals];
 const combined=compileSelectedStairPedestrianClearance(selected,{maxCells:50000});
 if(!combined.ok)return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
  reason:'CITY_LINK_AND_SELECTED_STAIRS_UNSAFE',
  refusal:combined.reason,sourceChecks:0,worldChanged:false});
 const galleries=compileMainGalleryPedestrianClearance(seed,rx,rz);
 if(!galleries.ok)return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
  reason:'CITY_GALLERY_INDEX_UNSAFE',
  refusal:galleries.reason,sourceChecks:0,worldChanged:false});
 for(let i=0;i<selected.length;i++){
  const collision=galleries.inspect(selected[i]);
  if(!collision.ok)return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
   reason:'CITY_LINK_OR_SELECTED_STAIRS_BLOCK_GALLERY',
   routeIndex:i,blockedCells:collision.blockedCells??null,
   sourceChecks:0,worldChanged:false});
 }
 // Inspect ORIGINAL M7 ownership of the actual approach and ALL caller
 // selected stairways, not just the future terrace. A user supplied
 // materialAllowed cannot override the fixed original safe-geology allowlist.
 let inspected=0;
 for(let i=0;i<selected.length;i++){
  const r=auditProtectedSubsurfaceStairs(selected[i],{
   naturalAt:source.naturalAt,authoredAt:source.authoredAt,
   editedAt:source.editedAt,protectedAt:source.protectedAt,
   minY:-210,maxY:19,maxCells:20000,stopOnFirstUnsafe:true
  });
  inspected+=r.sourceChecks??0;
  if(inspected>maxTotalSourceChecks)
   return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
    reason:'CITY_LINK_TOTAL_SOURCE_BUDGET',
    sourceChecks:inspected,worldChanged:false});
  if(!r.ok)return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
   reason:'CITY_LINK_OR_SELECTED_STAIRS_SOURCE_UNSAFE',
   routeIndex:i,firstRefusal:r.firstRefusal??r.reason??null,
   sourceChecks:inspected,worldChanged:false});
 }
 // Already checked the access route as selected[0]. Use the same source
 // protection for the terrace, including BOTH directions of cross-route
 // floor/air collision.
 const remaining=maxTotalSourceChecks-inspected;
 if(remaining<100)return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
  reason:'CITY_LINK_TOTAL_SOURCE_BUDGET',sourceChecks:inspected,
  maxTotalSourceChecks,worldChanged:false});
 const terrace=proposeProtectedCityLandingTerrace(seed,rx,rz,{
  source,selectedStairProposals:selected,
  maxSourceChecks:Math.min(60000,remaining)
 });
 const sourceChecks=inspected+(terrace.sourceChecks??0);
 if(!terrace.ok)return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
  reason:'CITY_TERRACE_SOURCE_OR_GEOMETRY_UNSAFE',
  refusal:terrace.reason??null,sourceChecks,
  terraceAttempts:terrace.attempts??[],
  worldChanged:false});
 return Object.freeze({sitePresent:true,ok:true,seed,rx,rz,
  terraceRadius:terrace.radius,terraceColumns:terrace.columns,
  sourceChecks,selectedStairCount:selected.length,
  requireCompleteDeepLinks,
  completeFourHubCandidateTopologyVerified:topology?.ok===true,
  completeDeepLinkSourceOwnershipVerified:topology?.ok===true,
  fourHubRouteNotYetPlayerWalkable:true,
  combinedStairAndTerraceMutualClearanceChecked:true,
  mainGalleryMutualClearanceChecked:true,
  originalM7SourceProvenanceCheckedByCaller:true,
  originalM7ReaderIdentityVerifiedByCallerOnly:true,
  allWorldRegionsConnected:false,
  playerWalkabilityAndMovementUnverified:true,
  actualVoxelEditsOrTerracePlacement:false,
  settlementsPlaced:false,worldChanged:false});
}
