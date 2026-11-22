// Isolated read-only, SOURCE-PROTECTED alternative to the historical straight
// city access. A short level departure can avoid gallery support under a
// descending stair's headroom. Existing city-access API is NOT modified.
// Approved candidate is unbuilt M7 geology, never a placed or walked route.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {auditCityAccessRamp} from './city-access-proposal.mjs';
import {auditCaveCenterline} from './physical-connectivity-audit.mjs';
import {detachedCalibratedUnderworldAirAt}
 from './depth-calibrated-proposal.mjs';
import {auditSupportedEntranceStairs} from './walkable-entrance-stairs.mjs';
import {compileMainGalleryPedestrianClearance,
 auditCombinedStairFootprints} from './combined-stair-footprints.mjs';
import {auditProtectedSubsurfaceStairs}
 from './protected-subsurface-stairs.mjs';

const INT=Number.isSafeInteger;
const DIRS=Object.freeze([
 [1,1],[0,1],[1,0],[-1,1],[1,-1],[-1,0],[0,-1],[-1,-1]
].map(v=>Object.freeze(v)));
const DISTANCES=Object.freeze([4,6,8,10,12,16,20,24,28,32]);
const ROLES=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const eq=(a,b)=>a&&b&&a.x===b.x&&a.y===b.y&&a.z===b.z;
export function searchSourceProtectedCityDetours(seed,rx,rz,{
 source,selectedStairProposals=[],maxCandidates=80,
 maxSourceChecks=30000,maxExamples=10
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !source||typeof source!=='object'||ROLES.some(k=>typeof source[k]!=='function')||
  !Array.isArray(selectedStairProposals)||selectedStairProposals.length>7||
  !INT(maxCandidates)||maxCandidates<1||maxCandidates>80||
  !INT(maxSourceChecks)||maxSourceChecks<100||maxSourceChecks>100000||
  !INT(maxExamples)||maxExamples<1||maxExamples>24)
  throw TypeError('Invalid protected rare-cavern city detour search');
 const region=planUnderworldRegion(seed,rx,rz),city=region.cityCandidate;
 if(!city)return Object.freeze({sitePresent:false,seed,rx,rz,
  worldChanged:false,sourceChecks:0});
 const previous=auditCityAccessRamp(seed,rx,rz);
 const level=region.layers.find(x=>Math.abs(x.hub.y-city.y)<=4);
 const end={x:city.x+20,y:city.y-7,z:city.z+20},start=level?.hub;
 // Do not hide an invalid historical city/landing or try a wholly different
 // city anchor. An alternate detour only changes the corridor between them.
 if(previous.sitePresent!==true||!previous.hub||!previous.landing||
  !eq(previous.hub,start)||!eq(previous.landing,end))
  return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
   reason:'CITY_SOURCE_HUB_OR_LANDING_MISMATCH',
   tested:0,sourceChecks:0,worldChanged:false});
 const gallery=compileMainGalleryPedestrianClearance(seed,rx,rz);
 if(!gallery.ok)return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
  reason:gallery.reason,tested:0,sourceChecks:0,worldChanged:false});
 let tested=0,sourceChecks=0,lastRefusal=null;
 const refusals={grade:0,gallery:0,crossRoute:0,air:0,source:0,budget:0};
 const examples=[];
 for(const [dx,dz] of DIRS)for(const distance of DISTANCES){
  if(tested>=maxCandidates)break;
  tested++;
  const mid={x:start.x+dx*distance,y:start.y,z:start.z+dz*distance};
  const p=Object.freeze({ok:true,seed,rx,rz,
   kind:'detached-source-protected-city-detour',
   from:start,to:end,
   bearing:Object.freeze({dx,dz}),departureBlocks:distance,
   segments:Object.freeze([
    Object.freeze({a:start,b:Object.freeze(mid),radius:3.8}),
    Object.freeze({a:Object.freeze(mid),b:end,radius:3.8})
   ])});
  let reason=null,grade=null;
  if(![start,mid,end].every(q=>
   Math.floor(q.x/256)===rx&&Math.floor(q.z/256)===rz&&
   q.y>=-210&&q.y<=-4))reason='REGION_OR_WORLD_BOUNDS';
  if(!reason){
   grade=auditSupportedEntranceStairs(p,{maxCells:20000});
   if(!grade.ok){reason='DETOUR_GRADE_UNSAFE';refusals.grade++;}
  }
  if(!reason){
   const fit=gallery.inspect(p);
   if(!fit.ok){reason='DETOUR_BLOCKS_MAIN_GALLERY';refusals.gallery++;}
  }
  if(!reason&&selectedStairProposals.length){
   const both=auditCombinedStairFootprints(
    [p,...selectedStairProposals],{maxCells:50000});
   if(!both.ok){reason='DETOUR_BLOCKS_SELECTED_STAIRS';refusals.crossRoute++;}
  }
  if(!reason){
   const connected=p.segments.every(({a,b})=>auditCaveCenterline(a,b,
    (x,y,z)=>detachedCalibratedUnderworldAirAt(seed,x,y,z)).ok);
   if(!connected){reason='DETOUR_CANDIDATE_AIR_DISCONNECTED';refusals.air++;}
  }
  if(!reason){
   const audited=auditProtectedSubsurfaceStairs(p,{
    naturalAt:source.naturalAt,authoredAt:source.authoredAt,
    editedAt:source.editedAt,protectedAt:source.protectedAt,
    minY:-210,maxY:19,maxCells:20000,stopOnFirstUnsafe:true
   });
   sourceChecks+=audited.sourceChecks??0;
   if(sourceChecks>maxSourceChecks){
    reason='DETOUR_SOURCE_QUERY_BUDGET';refusals.budget++;
   }else if(!audited.ok){
    reason=audited.firstRefusal??audited.reason??'DETOUR_SOURCE_UNSAFE';
    refusals.source++;
   }
  }
  if(!reason)return Object.freeze({sitePresent:true,ok:true,
   seed,rx,rz,proposal:p,departureBlocks:distance,
   bearing:p.bearing,
   supportCells:grade.supportCells,clearanceCells:grade.clearanceCells,
   tested,sourceChecks,refusals:Object.freeze({...refusals}),
   examples:Object.freeze(examples),
   exactHistoricalHubAndLandingPreserved:true,
   16GalleryMutualClearanceVerified:true,
   selectedStairMutualClearanceVerified:selectedStairProposals.length>0,
   detachedActualAIRCenterlineVerified:true,
   originalM7SourceCheckedByCaller:true,
   originalM7ReaderIdentityNotAuthenticated:true,
   realOriginalM7PlayerWalkingUnverified:true,
   stepsActuallyPlaced:false,worldChanged:false});
  lastRefusal=reason;
  if(examples.length<maxExamples)examples.push(Object.freeze({
   bearing:Object.freeze({dx,dz}),distance,reason
  }));
  if(reason==='DETOUR_SOURCE_QUERY_BUDGET')break;
 }
 return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
  reason:lastRefusal??'NO_SAFE_CITY_DETOUR',
  tested,sourceChecks,refusals:Object.freeze(refusals),
  examples:Object.freeze(examples),worldChanged:false,
  originalM7PlayerWalkingUnverified:true});
}
