// Optional, bounded rare-city-aware deep-ramp selection. Historical
// source-aware-ramp-selection.mjs stays EXACTLY unchanged. Candidate
// geometry first, then the UNWEAKENED complete original-source city/terrace
// and three-hub-link admission for each bounded combination. Never carves.
import {planUnderworldRegion,UNDERWORLD_REGION_SIDE}
 from './worldwide-network.mjs';
import {planDetachedPedestrianSwitchback}
 from './pedestrian-switchback.mjs';
import {auditSupportedEntranceStairs}
 from './walkable-entrance-stairs.mjs';
import {auditCaveCenterline} from './physical-connectivity-audit.mjs';
import {proposedSurfaceAirAt} from './surface-entrance-proposal.mjs';
import {compileMainGalleryPedestrianClearance,
 compileSelectedStairPedestrianClearance}
 from './combined-stair-footprints.mjs';
import {auditSourceProtectedCityTerraceAccess}
 from './source-protected-city-terrace-access.mjs';
import {bindCityDeepSourceReaderCohort}
 from './source-reader-cohort-provenance.mjs';

const INT=Number.isSafeInteger;
const INDICES=Object.freeze([16,25,34]);
const RADII=Object.freeze([14,16,18,20,22,24,26,28,30,32,34,36,38,40,42,44]);
const FLATS=Object.freeze([6,8,10,4]);
const ROLES=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const eq=(a,b)=>a&&b&&a.x===b.x&&a.y===b.y&&a.z===b.z;

export function selectCityCompatibleDeepLinks(seed,rx,rz,{
 source,maxCandidatesPerLink=64,maxSuitablePerLink=8,
 maxCombinations=160,maxTotalSourceChecks=60000,
 minTerraceRadius=8
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !source||typeof source!=='object'||
  ROLES.some(k=>typeof source[k]!=='function')||
  !INT(maxCandidatesPerLink)||maxCandidatesPerLink<4||
   maxCandidatesPerLink>128||
  !INT(maxSuitablePerLink)||maxSuitablePerLink<1||maxSuitablePerLink>16||
  !INT(maxCombinations)||maxCombinations<1||maxCombinations>500||
  !INT(maxTotalSourceChecks)||maxTotalSourceChecks<1000||
   maxTotalSourceChecks>200000||
  !INT(minTerraceRadius)||![4,6,8,12].includes(minTerraceRadius))
  throw TypeError('Invalid rare-city deep ramp source selection');
 const region=planUnderworldRegion(seed,rx,rz),city=region.cityCandidate;
 if(!city)return Object.freeze({sitePresent:false,seed,rx,rz,
  worldChanged:false,sourceChecks:0});
 const gallery=compileMainGalleryPedestrianClearance(seed,rx,rz);
 if(!gallery.ok)return Object.freeze({sitePresent:true,ok:false,
  reason:gallery.reason,inspectedCombinations:0,worldChanged:false});
 const floorY=city.y-8,center={x:city.x+20,z:city.z+20};
 const disk=[];
 for(let dx=-minTerraceRadius;dx<=minTerraceRadius;dx++)
  for(let dz=-minTerraceRadius;dz<=minTerraceRadius;dz++){
   if(dx*dx+dz*dz>minTerraceRadius*minTerraceRadius)continue;
   const x=center.x+dx,z=center.z+dz;
   const nx=(x-city.x)/(city.rx*.55),
    nz=(z-city.z)/(city.rz*.55);
   if(nx*nx+nz*nz>1)return Object.freeze({sitePresent:true,
    ok:false,reason:'MIN_TERRACE_OUTSIDE_CITY_ENVELOPE',
    worldChanged:false});
   disk.push(Object.freeze({x,z}));
  }
 const options=[],examined=[];
 for(let i=0;i<3;i++){
  const index=INDICES[i],choices=[];
  let attempted=0,gradeRejected=0,galleryRejected=0,
   terraceRejected=0,airRejected=0,boundsRejected=0;
  outer:for(const radius of RADII)for(const cornerFlat of FLATS){
   if(radius<cornerFlat+5)continue;
   for(let quarterTurns=0;quarterTurns<4;quarterTurns++){
    if(attempted>=maxCandidatesPerLink||
     choices.length>=maxSuitablePerLink)break outer;
    attempted++;
    const p=planDetachedPedestrianSwitchback(seed,rx,rz,index,{
     radius,cornerFlat,quarterTurns
    });
    if(!eq(p.from,region.layers[i].hub)||
       !eq(p.to,region.layers[i+1].hub)||
       !p.segments.every(({a,b})=>[a,b].every(v=>
        Math.floor(v.x/UNDERWORLD_REGION_SIDE)===rx&&
        Math.floor(v.z/UNDERWORLD_REGION_SIDE)===rz&&
        v.y>=-210&&v.y<=-4))){
     boundsRejected++;continue;
    }
    const grade=auditSupportedEntranceStairs(p,{maxCells:20000});
    if(!grade.ok){gradeRejected++;continue;}
    if(!gallery.inspect(p).ok){galleryRejected++;continue;}
    const indexer=compileSelectedStairPedestrianClearance([p]);
    if(!indexer.ok){gradeRejected++;continue;}
    let obstructed=false;
    for(const {x,z} of disk){
     for(let y=floorY-5;y<=floorY+9;y++)
      if(indexer.inspectCell(x,y,z,y<=floorY?'support':'clearance')){
       obstructed=true;break;
      }
     if(obstructed)break;
    }
    if(obstructed){terraceRejected++;continue;}
    const air=p.segments.every(({a,b})=>auditCaveCenterline(a,b,
     (x,y,z)=>proposedSurfaceAirAt(p,x,y,z)).ok);
    if(!air){airRejected++;continue;}
    choices.push(Object.freeze({proposal:p,index,radius,cornerFlat,
     quarterTurns,supportCells:grade.supportCells}));
   }
  }
  options.push(Object.freeze(choices));
  examined.push(Object.freeze({index,attempted,gradeRejected,
   galleryRejected,terraceRejected,airRejected,boundsRejected,
   eligible:choices.length}));
  if(!choices.length)return Object.freeze({sitePresent:true,ok:false,
   seed,rx,rz,reason:'NO_TERRACE_COMPATIBLE_INTERLEVEL_GEOMETRY',
   failedIndex:index,examined:Object.freeze(examined),
   sourceChecks:0,worldChanged:false});
 }
 let combinations=0,sourceChecks=0,lastRefusal=null;
 let sourceBudgetHit=false,combinationBudgetHit=false;
 // A source refusal never gets converted into an approved answer. Explore
 // only mutually compatible alternatives and cap the SUM of actual queries.
 search:for(const a of options[0])for(const b of options[1])for(const c of options[2]){
  if(combinations>=maxCombinations){
   combinationBudgetHit=true;break search;
  }
  combinations++;
  const chosen=[a,b,c],proposals=chosen.map(x=>x.proposal);
  const coupled=compileSelectedStairPedestrianClearance(proposals);
  if(!coupled.ok){lastRefusal='DEEP_RAMPS_MUTUALLY_BLOCKED';continue;}
  const remaining=maxTotalSourceChecks-sourceChecks;
  if(remaining<1000){
   sourceBudgetHit=true;break search;
  }
  const joined=auditSourceProtectedCityTerraceAccess(seed,rx,rz,{
   source,additionalStairProposals:proposals,
   requireCompleteDeepLinks:true,useSourceAwareDetour:true,
   maxTotalSourceChecks:Math.min(60000,remaining)
  });
  sourceChecks+=joined.sourceChecks??0;
  if(sourceChecks>maxTotalSourceChecks){
   sourceBudgetHit=true;lastRefusal='CITY_SOURCE_QUERY_BUDGET';
   break search;
  }
  if(!joined.ok){lastRefusal=joined.reason;continue;}
  return bindCityDeepSourceReaderCohort(Object.freeze({sitePresent:true,ok:true,seed,rx,rz,
   chosen:Object.freeze(chosen.map(x=>Object.freeze({
    index:x.index,radius:x.radius,cornerFlat:x.cornerFlat,
    quarterTurns:x.quarterTurns,supportCells:x.supportCells
   }))),
   deepProposals:Object.freeze(proposals),
   joined,terraceRadius:joined.terraceRadius,
   sourceChecks,inspectedCombinations:combinations,
   maxCombinations,examined:Object.freeze(examined),
   originalM7ReaderIdentityAuthenticatedByCallerOnly:true,
   originalM7VoxelMutations:false,playerWalkingUnverified:true,
   settlementsPlaced:false,worldChanged:false}),source);
 }
 return Object.freeze({sitePresent:true,ok:false,seed,rx,rz,
  reason:sourceBudgetHit||sourceChecks>=maxTotalSourceChecks?
   'CITY_SOURCE_QUERY_BUDGET':
   combinationBudgetHit?'CITY_COMBINATION_SEARCH_BUDGET':
   lastRefusal??'NO_CONNECTED_DEEP_CITY_ROUTE',
  sourceBudgetHit,combinationBudgetHit,
  searchFullyExhausted:!sourceBudgetHit&&!combinationBudgetHit,
  sourceChecks,inspectedCombinations:combinations,
  examined:Object.freeze(examined),worldChanged:false,
  originalM7PlayerWalkingUnverified:true});
}
