// PHASE 19 — read-only, three-wide THIN-DECK pedestrian underpass.
// The original 6-support+9-headroom full city ellipse is unsafe across
// existing horizontal galleries. This candidate uses only ONE support
// and THREE clearance cells per three-wide walk step, potentially passing
// BENEATH the untouched gallery without intersecting its footprint.
// It does not construct a floor, authorize a settlement or alter original M7.
import {planUnderworldRegion,UNDERWORLD_REGION_SIDE}
 from './worldwide-network.mjs';
import {auditSupportedEntranceStairs}
 from './walkable-entrance-stairs.mjs';
import {auditCaveCenterline}
 from './physical-connectivity-audit.mjs';
import {detachedCalibratedUnderworldAirAt}
 from './depth-calibrated-proposal.mjs';
import {auditSelectedInterlevelTopology}
 from './source-network-topology.mjs';
import {compileMainGalleryPedestrianClearance,
 compileSelectedStairPedestrianClearance,auditCombinedStairFootprints}
 from './combined-stair-footprints.mjs';
import {auditProtectedSubsurfaceStairs}
 from './protected-subsurface-stairs.mjs';
import {isCandidateGeologyMaterial}
 from './protected-entrance-envelope.mjs';
const INT=Number.isSafeInteger;
const EQ=(a,b)=>a&&b&&['x','y','z'].every(k=>a[k]===b[k]);
const ROLES=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
const MAX_PATHS=290; // one direct + 17*17 bounded two-segment routes
const failure=(seed,rx,rz,reason,extra={})=>Object.freeze({
 ok:false,sitePresent:true,seed,rx,rz,reason,...extra,
 existingMainGalleryModified:false,existingM7Modified:false,
 cityFloorApproved:false,settlementPlaced:false,
 actualPlayerWalkingVerified:false,worldChanged:false
});
const cityEllipse=(c,x,z)=>{
 const nx=(x-c.x)/(c.rx*.55),nz=(z-c.z)/(c.rz*.55);
 return nx*nx+nz*nz<=1;
};
function candidateFootprint(proposal,grade,rx,rz,city,main,selected){
 const support=new Set(),air=new Set();let previous=null;
 const key=(x,y,z)=>x+','+y+','+z;
 for(const {a,b} of proposal.segments){
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  const horizontal=Math.max(Math.abs(dx),Math.abs(dz)),
   alongX=Math.abs(dx)>=Math.abs(dz);
  for(let i=0;i<=horizontal;i++){
   const f=i/horizontal,x=Math.round(a.x+dx*f),
    y=Math.round(a.y+dy*f),z=Math.round(a.z+dz*f);
   if(previous&&previous.x===x&&previous.z===z)continue;
   for(const [ox,oz] of (alongX?[[0,-1],[0,0],[0,1]]:
    [[-1,0],[0,0],[1,0]])){
    const sx=x+ox,sz=z+oz;
    if(Math.floor(sx/UNDERWORLD_REGION_SIDE)!==rx||
     Math.floor(sz/UNDERWORLD_REGION_SIDE)!==rz||
     !cityEllipse(city,sx,sz)||
     y-1< -210||y+2>19)
     return Object.freeze({ok:false,reason:'UNDERPASS_CITY_OR_WORLD_BOUNDS'});
    const floor=key(sx,y-1,sz);
    if(main.inspectCell(sx,y-1,sz,'support')||
       selected.inspectCell(sx,y-1,sz,'support'))
     return Object.freeze({ok:false,reason:'UNDERPASS_SUPPORT_BLOCKS_EXISTING_AIR'});
    support.add(floor);
    for(let h=0;h<3;h++){
     const yy=y+h,k=key(sx,yy,sz);
     if(main.inspectCell(sx,yy,sz,'clearance')||
        selected.inspectCell(sx,yy,sz,'clearance'))
      return Object.freeze({ok:false,
       reason:'EXISTING_ROUTE_SUPPORT_BLOCKS_UNDERPASS_AIR'});
     air.add(k);
    }
   }
   previous={x,y,z};
  }
 }
 if(support.size!==grade.supportCells||
    air.size!==grade.clearanceCells)
  throw Error('Underpass footprint diverges from original strict stair census');
 for(const k of support)if(air.has(k))
  throw Error('Underpass support/air overlap escaped grade checks');
 return Object.freeze({ok:true,supportCells:support.size,
  clearanceCells:air.size});
}
function admitDeepSelection(seed,rx,rz,deep,city){
 if(!deep||deep.ok!==true||deep.seed!==seed||deep.rx!==rx||
  deep.rz!==rz||deep.joined?.ok!==true||
  deep.joined.completeFourHubCandidateTopologyVerified!==true||
  deep.joined.completeDeepLinkSourceOwnershipVerified!==true||
  !Array.isArray(deep.deepProposals)||deep.deepProposals.length!==3||
  !INT(deep.sourceChecks)||deep.sourceChecks<1||
  deep.joined.sourceAuditedCityAccessRouteGeometry?.ok!==true)
  return null;
 const topology=auditSelectedInterlevelTopology(
  seed,rx,rz,deep.deepProposals);
 if(!topology.ok)return null;
 const access=deep.joined.sourceAuditedCityAccessRouteGeometry,
  segments=access.segments,original=planUnderworldRegion(seed,rx,rz);
 const hub=original.layers.find(l=>Math.abs(l.hub.y-city.y)<=4)?.hub;
 const landing={x:city.x+20,y:city.y-7,z:city.z+20};
 if(!hub||!Array.isArray(segments)||segments.length<1||
  !EQ(segments[0]?.a,hub)||!EQ(segments.at(-1)?.b,landing))
  return null;
 const selectedRoutes=[...deep.deepProposals,access];
 const index=compileSelectedStairPedestrianClearance(selectedRoutes);
 if(!index.ok)return null;
 return {topology,landing,index,selectedRoutes};
}
export function planGradeSeparatedCityUnderpass(seed,rx,rz,{
 sourceOwnedDeepSelection,maxCandidates=MAX_PATHS
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !INT(maxCandidates)||maxCandidates<1||maxCandidates>MAX_PATHS)
  throw TypeError('Invalid original-gallery pedestrian underpass planning');
 const city=planUnderworldRegion(seed,rx,rz).cityCandidate;
 if(!city)return Object.freeze({sitePresent:false,seed,rx,rz,
  worldChanged:false,originalM7SourceNotQueried:true});
 const admitted=admitDeepSelection(seed,rx,rz,
  sourceOwnedDeepSelection,city);
 if(!admitted)return failure(seed,rx,rz,
  'FOUR_HUB_SOURCE_AUDITED_APPROACH_REQUIRED');
 const main=compileMainGalleryPedestrianClearance(seed,rx,rz);
 if(!main.ok)return failure(seed,rx,rz,'MAIN_GALLERY_INDEX_UNSAFE',{
  galleryReason:main.reason});
 for(const p of admitted.selectedRoutes)if(!main.inspect(p).ok)
  return failure(seed,rx,rz,'PRIOR_APPROACH_BLOCKS_MAIN_GALLERY');

 // The city-center point is NOT a valid 3x3 full-depth landing at these
 // historical sites. Search an actual three-wide pad with a one-cell
 // unbuilt margin over the SAME 6 support + 9 clearance courses.
 const floorY=city.y-8,centerPads=[];
 for(let dx=-12;dx<=12;dx++)for(let dz=-12;dz<=12;dz++){
  const x=city.x+dx,z=city.z+dz;
  let blocked=false;
  pad:for(let ox=-2;ox<=2;ox++)for(let oz=-2;oz<=2;oz++){
   const xx=x+ox,zz=z+oz;
   if(!cityEllipse(city,xx,zz)||
    Math.floor(xx/UNDERWORLD_REGION_SIDE)!==rx||
    Math.floor(zz/UNDERWORLD_REGION_SIDE)!==rz){
    blocked=true;break pad;
   }
   for(let y=floorY-5;y<=floorY+9;y++){
    const kind=y<=floorY?'support':'clearance';
    if(y< -210||y>19||
     main.inspectCell(xx,y,zz,kind)||
     admitted.index.inspectCell(xx,y,zz,kind)){
     blocked=true;break pad;
    }
   }
  }
  if(!blocked)centerPads.push(Object.freeze({
   x,y:floorY+1,z,dx,dz,distanceSquared:dx*dx+dz*dz
  }));
 }
 centerPads.sort((a,b)=>a.distanceSquared-b.distanceSquared||
  a.x-b.x||a.z-b.z);
 if(!centerPads.length)return failure(seed,rx,rz,
  'NO_SAFE_THREE_WIDE_CENTER_SIDE_PAD',{
   searchedCenterPadOffsets:625,sourceTerrainNotQueried:true
  });
 const centerPad=centerPads[0];
 const from=admitted.landing,to=Object.freeze({
  x:centerPad.x,y:centerPad.y,z:centerPad.z
 });
 const mid={x:Math.round((from.x+to.x)/2),z:
  Math.round((from.z+to.z)/2)};
 // Exactly one direct candidate and the 17x17 bounded offsets.
 const offsets=[null];
 for(let ox=-16;ox<=16;ox+=2)for(let oz=-16;oz<=16;oz+=2)
  offsets.push(Object.freeze({ox,oz}));
 const refusals={grade:0,bounds:0,oldRoutes:0,
  detachedAir:0,strictCombined:0};
 let considered=0,safeCount=0,best=null;
 for(const offset of offsets){
  if(considered>=maxCandidates)break;
  considered++;
  const pivot=offset?Object.freeze({x:mid.x+offset.ox,
   y:from.y,z:mid.z+offset.oz}):null;
  const points=pivot?[from,pivot,to]:[from,to];
  const segments=points.slice(1).map((p,i)=>Object.freeze({
   a:points[i],b:p,radius:3.8
  })).filter(({a,b})=>!EQ(a,b));
  const proposal=Object.freeze({ok:true,seed,rx,rz,
   kind:'source-protected-thin-city-gallery-underpass',
   from,to,segments:Object.freeze(segments)});
  const grade=auditSupportedEntranceStairs(proposal,{
   maxCells:20000
  });
  if(!grade.ok){refusals.grade++;continue}
  const footprint=candidateFootprint(proposal,grade,rx,rz,city,
   main,admitted.index);
  if(!footprint.ok){
   if(footprint.reason==='UNDERPASS_CITY_OR_WORLD_BOUNDS')
    refusals.bounds++;
   else refusals.oldRoutes++;
   continue;
  }
  const air=segments.every(({a,b})=>
   auditCaveCenterline(a,b,(x,y,z)=>
    detachedCalibratedUnderworldAirAt(seed,x,y,z)).ok);
  if(!air){refusals.detachedAir++;continue}
  const coupled=auditCombinedStairFootprints([
   ...admitted.selectedRoutes,proposal
  ],{maxCells:50000});
  if(!coupled.ok){refusals.strictCombined++;continue}
  safeCount++;
  const candidate=Object.freeze({proposal,
   pivot:pivot?Object.freeze({...pivot}):null,
   grade,footprint,connectedRouteCount:coupled.routeCount});
  if(!best||candidate.grade.supportCells<best.grade.supportCells||
    candidate.grade.supportCells===best.grade.supportCells&&
     candidate.grade.clearanceCells<best.grade.clearanceCells||
    candidate.grade.supportCells===best.grade.supportCells&&
    candidate.grade.clearanceCells===best.grade.clearanceCells&&
    candidate.proposal.segments.length<best.proposal.segments.length)
   best=candidate;
 }
 if(!best)return failure(seed,rx,rz,
  considered<offsets.length?'UNDERPASS_SEARCH_LIMIT_REACHED':
   'NO_GEOMETRICALLY_SAFE_UNDERPASS_FOUND',{
    examinedCandidates:considered,safeCandidates:0,
    globalSearchComplete:considered===offsets.length,
    rejectionCounts:Object.freeze(refusals),
    originalM7SourceNotQueried:true
   });
 return Object.freeze({ok:true,sitePresent:true,seed,rx,rz,
  kind:'three-wide-thin-deck-underpass-below-historical-galleries',
  floorY,from,to,
  originalCityCenter:Object.freeze({x:city.x,y:floorY+1,z:city.z}),
  centerSidePad:to,
  centerSidePadOriginalSourceVisitsRequired:135,
  centerPadSearchCandidates:625,
  centerPadGeometricallyEligible:centerPads.length,
  centerPadOffsetSquared:centerPad.distanceSquared,
  centerPadThreeWideFullDepthAndOneCellEasementSafe:true,
  originalCityCenterThreeWidePadNotAssumed:true,
  pivot:best.pivot,proposal:best.proposal,
  segments:best.proposal.segments.length,
  inspectedCandidates:considered,safeCandidates:safeCount,
  globalSearchComplete:considered===offsets.length,
  rejectionCounts:Object.freeze(refusals),
  threeWideSupportCells:best.grade.supportCells,
  threeHighClearanceCells:best.grade.clearanceCells,
  originalVoxelSourceVisitsRequired:
   best.grade.supportCells+best.grade.clearanceCells,
  originalStrictStairGradeSafe:best.grade.ok,
  selectedFourHubPlusAccessRouteCount:admitted.selectedRoutes.length,
  historicalLandingPreservedAndCenterSidePadChecked:true,
  exactOriginalCityCenterWalkableLandingNotCertified:true,
  all16MainGalleryFootprintsUnmodified:true,
  existingSelectedFourHubAndAccessFootprintsUnmodified:true,
  detachedAirCenterlineVerified:true,
  originalM7SourceOwnershipNotYetVerified:true,
  originalM7TerrainUnqueried:true,
  oldFullCityFloorNotApproved:true,
  noSettlementOrCityBuilt:true,actualPlayerWalkingUnverified:true,
  worldChanged:false});
}
export function auditSourceProtectedCityUnderpass(seed,rx,rz,{
 source,sourceOwnedDeepSelection,maxTotalSourceChecks=150000,
 maxCandidates=MAX_PATHS
}={}){
 if(!source||typeof source!=='object'||
  ROLES.some(k=>typeof source[k]!=='function')||
  !INT(maxTotalSourceChecks)||maxTotalSourceChecks<1000||
  maxTotalSourceChecks>150000)
  throw TypeError('Invalid original M7 pedestrian underpass reader');
 const planned=planGradeSeparatedCityUnderpass(seed,rx,rz,{
  sourceOwnedDeepSelection,maxCandidates
 });
 if(!planned.ok)return planned;
 const previous=sourceOwnedDeepSelection.sourceChecks;
 const requiredAdditional=planned.originalVoxelSourceVisitsRequired+
  planned.centerSidePadOriginalSourceVisitsRequired;
 if(previous>maxTotalSourceChecks||
  requiredAdditional>maxTotalSourceChecks-previous)
  return failure(seed,rx,rz,'UNDERPASS_ORIGINAL_SOURCE_BUDGET',{
   sourceChecks:previous,requiredAdditionalVisits:
    requiredAdditional,
   maxTotalSourceChecks,originalM7ReaderIdentityByCallerOnly:true
  });
 const audited=auditProtectedSubsurfaceStairs(planned.proposal,{
  naturalAt:source.naturalAt,authoredAt:source.authoredAt,
  editedAt:source.editedAt,protectedAt:source.protectedAt,
  maxCells:Math.min(20000,maxTotalSourceChecks-previous),
  minY:-210,maxY:19,stopOnFirstUnsafe:true
 });
 const total=previous+(audited.sourceChecks??0);
 if(!audited.ok||total>maxTotalSourceChecks)
  return failure(seed,rx,rz,
   audited.reason==='SOURCE_QUERY_BUDGET_EXCEEDED'||
   total>maxTotalSourceChecks?'UNDERPASS_ORIGINAL_SOURCE_BUDGET':
    'UNDERPASS_ORIGINAL_SOURCE_UNSAFE',{
     firstRefusal:audited.firstRefusal??audited.reason??null,
     firstRejectedCell:audited.examples?.[0]??null,
     sourceChecks:total,underpassSourceVisits:audited.sourceChecks??0,
     originalM7ReaderIdentityByCallerOnly:true
   });
 if(audited.sourceChecks!==planned.originalVoxelSourceVisitsRequired)
  throw Error('Thin underpass original-source and geometry census differ');
 return Object.freeze({ok:true,sitePresent:true,seed,rx,rz,
  kind:planned.kind,pivot:planned.pivot,segments:planned.segments,
  sourceChecks:total,originalFourHubSourceChecks:previous,
  underpassSourceVisits:audited.sourceChecks,
  gradeSupportCells:planned.threeWideSupportCells,
  gradeClearanceCells:planned.threeHighClearanceCells,
  originalSourceCounts:audited.counts,
  historicalCityCenterJoinedByCandidatePedestrianUnderpass:true,
  onlyCandidateDeckAndAIRNotActuallyBuilt:true,
  selectedFourHubAndCityApproachSourceProofProvidedByCallerOnly:true,
  originalM7ReaderIdentityByCallerOnly:true,
  originalWorldUnchanged:true,actualPlayerWalkingUnverified:true,
  iPhoneGpuAndInstalledPwaUnverified:true,
  oldFullCityFloorStillRejected:true,
  releaseApproved:false,worldChanged:false});
}
