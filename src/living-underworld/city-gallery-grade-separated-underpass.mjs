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
import {auditThinUnderpassPedestrianConnectivity}
 from './city-underpass-pedestrian-footgraph.mjs';
import {auditCandidateUnderpassPlayerAabb}
 from './city-underpass-player-aabb-fixture.mjs';
import {auditCandidateUnderpassStepPlayer}
 from './city-underpass-step-player-fixture.mjs';
import {auditCandidateUnderpassContinuousStepPlayer}
 from './city-underpass-continuous-walk-fixture.mjs';
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
  detachedAir:0,strictCombined:0,footgraph:0};
 let considered=0,safeCount=0,best=null;
 const geometricallyApproved=[];
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
  // A non-overlapping voxel mask and safe stair grade alone cannot
  // establish a walkable junction, especially around diagonal pivots.
  // Independently require each of THREE lateral walking cells per
  // original access+thin bridge section to edge-connect to the entire
  // 3x3 full-depth destination pad, without diagonal corner shortcuts.
  const footgraph=auditThinUnderpassPedestrianConnectivity({
   accessProposal:admitted.selectedRoutes[3],
   underpassProposal:proposal,centerSidePad:to,floorY
  });
  if(!footgraph.ok){refusals.footgraph++;continue}
  safeCount++;
  const candidate=Object.freeze({proposal,footgraph,
   pivot:pivot?Object.freeze({...pivot}):null,
   grade,footprint,connectedRouteCount:coupled.routeCount});
  geometricallyApproved.push(candidate);
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
   'NO_SAFE_UNDERPASS_TO_NEAREST_CENTER_SIDE_PAD',{
    examinedCandidates:considered,safeCandidates:0,
    globalSearchComplete:considered===offsets.length,
    // Complete OFFSET search for ONE nearest full-depth pad only;
    // never claim no future bridge to another safe center-side pad.
    onlyNearestCenterPadExamined:true,
    furtherCenterPadAlternativesUnsearched:centerPads.length>1,
    rejectionCounts:Object.freeze(refusals),
    originalM7SourceNotQueried:true
   });
 // A geometry pass is not sufficient to call a passage player-sized.
 // Independently re-run the EXACT original collides() .28x1.78 AABB on
 // sealed, hypothetical future candidate voxels; unverified outside
 // voxels are solid. Only grade-safe and collision-safe candidates survive.
 geometricallyApproved.sort((a,b)=>
  a.grade.supportCells-b.grade.supportCells||
  a.grade.clearanceCells-b.grade.clearanceCells||
  a.proposal.segments.length-b.proposal.segments.length);
 let bodyProbes=0,bodyRefusals=0,accepted=null;
 for(const candidate of geometricallyApproved){
  bodyProbes++;
  const body=auditCandidateUnderpassPlayerAabb({
   accessProposal:admitted.selectedRoutes[3],
   underpassProposal:candidate.proposal,
   centerSidePad:to,floorY
  });
  if(!body.ok){bodyRefusals++;continue}
  accepted={...candidate,body};
  break;
 }
 if(!accepted)return failure(seed,rx,rz,
  'NO_ORIGINAL_PLAYER_AABB_CLEAR_UNDERPASS_TO_NEAREST_PAD',{
   geometrySafeCandidates:safeCount,originalAabbProbed:bodyProbes,
   originalAabbRefused:bodyRefusals,
   originalM7SourceNotQueried:true});
 best=accepted;
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
  onlyNearestCenterPadExamined:true,
  furtherCenterPadAlternativesUnsearched:centerPads.length>1,
  rejectionCounts:Object.freeze(refusals),
  threeWideSupportCells:best.grade.supportCells,
  threeHighClearanceCells:best.grade.clearanceCells,
  physicalFootgraphSupportCells:best.footgraph.supportCells,
  physicalFootgraphClearanceCells:best.footgraph.clearanceCells,
  physicalFootgraphSections:best.footgraph.fullWidthSections,
  physicalFootgraphReachableNodes:best.footgraph.reachableNodes,
  physicalFootgraphMinAccessToPadSteps:
   best.footgraph.accessToPadMinSteps,
  originalPlayerAabbRadius:best.body.radius,
  originalPlayerAabbHeight:best.body.height,
  originalPlayerAabbFixtureBodySamples:
   best.body.sampledBodyPositions,
  originalPlayerAabbFixtureGroundProbes:best.body.groundProbes,
  originalPlayerAabbFixtureFlatSweeps:best.body.sweptFlatEdges,
  originalPlayerAabbFixtureSkippedElevationEdges:
   best.body.skippedElevationEdges,
  originalPlayerAabbCandidateProbes:bodyProbes,
  originalPlayerAabbCandidateRefusals:bodyRefusals,
  originalPlayerColliderAgainstConservativelySealedFixturePassed:true,
  originalPlayerStepPlayerMovementNotYetSimulated:true,
  threeWideFootgraphEdgeConnectivityVerified:true,
  fullNineCellDestinationPadFootgraphConnected:true,
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
 maxCandidates=MAX_PATHS,auditHypotheticalMovement=false
}={}){
 if(!source||typeof source!=='object'||
  ROLES.some(k=>typeof source[k]!=='function')||
  typeof auditHypotheticalMovement!=='boolean'||
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
 // Each old-world bridge and pad callback now has an observable role count.
 // Reader identity remains caller-verified: this is not a native M7 claim.
 const sourceRoleCalls={naturalAt:0,authoredAt:0,editedAt:0,protectedAt:0};
 // Take one stable per-role callback snapshot before the first voxel read.
 // Dynamic replacements on the caller object cannot silently switch
 // geology/edit/landmark authorities halfway through this source census.
 const originalRoleReaders=Object.freeze({
  naturalAt:source.naturalAt,authoredAt:source.authoredAt,
  editedAt:source.editedAt,protectedAt:source.protectedAt
 });
 const read=(role,x,y,z)=>{
  sourceRoleCalls[role]++;
  return originalRoleReaders[role](x,y,z);
 };
 const observed=Object.freeze({
  naturalAt:(x,y,z)=>read('naturalAt',x,y,z),
  authoredAt:(x,y,z)=>read('authoredAt',x,y,z),
  editedAt:(x,y,z)=>read('editedAt',x,y,z),
  protectedAt:(x,y,z)=>read('protectedAt',x,y,z)
 });
 const snapshot=()=>Object.freeze({...sourceRoleCalls});
 const audited=auditProtectedSubsurfaceStairs(planned.proposal,{
  naturalAt:observed.naturalAt,authoredAt:observed.authoredAt,
  editedAt:observed.editedAt,protectedAt:observed.protectedAt,
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
     underpassActualReaderCallsByRole:snapshot(),
     originalM7ReaderIdentityByCallerOnly:true
   });
 if(audited.sourceChecks!==planned.originalVoxelSourceVisitsRequired)
  throw Error('Thin underpass original-source and geometry census differ');
 // The destination is a REAL 3x3 future landing, not an isolated safe
 // point. Its complete 6-support+9-headroom footprint and one-cell
 // no-build margin were vetted against old gallery and selected stairs.
 const center=planned.centerSidePad;
 let padSourceVisits=0,padSupport=0,padHeadroomAir=0,
  padExcavation=0;
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
  for(let y=planned.floorY-5;y<=planned.floorY+9;y++){
   const x=center.x+dx,z=center.z+dz;
   padSourceVisits++;
   const support=y<=planned.floorY;
   const edited=observed.editedAt(x,y,z);
   if(typeof edited!=='boolean')
    throw TypeError('Nonboolean original M7 underpass landing edit source');
   let refusal=null;
   if(edited)refusal='PLAYER_EDIT';
   else{
    const owner=observed.authoredAt(x,y,z);
    if(owner!==undefined&&(!INT(owner)||owner<0))
     throw TypeError('Invalid original M7 underpass landing authored material');
    if(owner!==undefined&&owner!==0)refusal='AUTHORED_SOURCE';
    else if(support&&owner===0)refusal='AUTHORED_AIR_SUPPORT';
    else{
     const protectedOriginal=observed.protectedAt(x,y,z);
     if(typeof protectedOriginal!=='boolean')
      throw TypeError('Nonboolean original M7 underpass landing landmark source');
     if(protectedOriginal)refusal='PROTECTED_LANDMARK';
     else{
      const material=observed.naturalAt(x,y,z);
      if(!INT(material)||material<0)
       throw TypeError('Invalid original M7 underpass landing material');
      if(!isCandidateGeologyMaterial(material))
       refusal='UNSAFE_MATERIAL';
      else if(owner===0&&material!==0)
       refusal='AUTHORED_AIR_MISMATCH';
      else if(support){
       if(material===0)refusal='OLD_NATURAL_AIR_SUPPORT';
       else padSupport++;
      }else if(material===0)padHeadroomAir++;
      else padExcavation++;
     }
    }
   }
   if(refusal)return failure(seed,rx,rz,
    'CENTER_SIDE_PAD_ORIGINAL_SOURCE_UNSAFE',{
     firstRefusal:refusal,
     firstRejectedCell:Object.freeze({x,y,z,
      kind:support?'support':'clearance'}),
     originalFourHubSourceChecks:previous,
     underpassSourceVisits:audited.sourceChecks,
     centerPadSourceVisits:padSourceVisits,
     sourceChecks:total+padSourceVisits,
     underpassActualReaderCallsByRole:snapshot(),
     oldM7ReaderIdentityByCallerOnly:true
    });
  }
 if(padSourceVisits!==planned.centerSidePadOriginalSourceVisitsRequired)
  throw Error('Three-wide full-depth center landing pad source census drifted');
 // Strict source-role completeness: every safe audited bridge/pad voxel
 // must have been observed by all FOUR original reader methods.
 const sourceCallsBeforeMotion=snapshot();
 const expectedRoleCalls=audited.sourceChecks+padSourceVisits;
 if(ROLES.some(role=>sourceCallsBeforeMotion[role]!==expectedRoleCalls))
  return failure(seed,rx,rz,'UNDERPASS_ORIGINAL_READER_ROLE_PARITY_REFUSED',{
   sourceChecks:total+padSourceVisits,expectedCallsPerRole:expectedRoleCalls,
   underpassActualReaderCallsByRole:sourceCallsBeforeMotion,
   readerIdentityCallerAuthenticatedOnly:true
  });
 const sourceCallsUnchanged=()=>ROLES.every(role=>
  sourceRoleCalls[role]===sourceCallsBeforeMotion[role]);
 const sourceCallsTotal=ROLES.reduce((sum,role)=>
  sum+sourceCallsBeforeMotion[role],0);
 // No extra original-M7 reader calls: the old four-hub selection, full
 // strict bridge source, and every full-depth landing cell have ALREADY
 // passed before invoking either prospective movement fixture. This
 // opt-in walks a HYPOTHETICAL STONE/AIR construction, never the actual M7
 // collision world. An unsafe old-world cell blocks before movement.
 let motionGrade=null,motionWalk=null;
 const sourceChecks=total+padSourceVisits;
 if(auditHypotheticalMovement){
  const args={
   accessProposal:sourceOwnedDeepSelection.joined.sourceAuditedCityAccessRouteGeometry,
   underpassProposal:planned.proposal,
   centerSidePad:planned.centerSidePad,floorY:planned.floorY
  };
  motionGrade=auditCandidateUnderpassStepPlayer(args);
  if(!sourceCallsUnchanged())
   return failure(seed,rx,rz,'HYPOTHETICAL_GRADE_TOUCHED_ORIGINAL_READER',{
    originalSourceChecksPassed:true,sourceChecks,
    underpassActualReaderCallsByRole:snapshot(),
    sourceCallsBeforeMovement:sourceCallsBeforeMotion,
    oldWorldPhysicalMotionUnverified:true
   });
  if(!motionGrade.ok||
     motionGrade.elevationEdges!==planned.originalPlayerAabbFixtureSkippedElevationEdges)
   return failure(seed,rx,rz,'SOURCE_SAFE_HYPOTHETICAL_STEP_PLAYER_GRADE_REFUSED',{
    originalSourceChecksPassed:true,sourceChecks,
    hypotheticalOriginalMotionSimulated:motionGrade.actualOriginalStepPlayerInvoked===true,
    gradeMovementReason:motionGrade.reason??'ELEVATION_CENSUS_DRIFT',
    gradeMovementFirstRefusal:motionGrade.ok?null:motionGrade,
    gradeElevationEdges:motionGrade.elevationEdges??null,
    extraOriginalSourceVisitsChargedForMovement:0,
    oldWorldReaderCallsNotInstrumentedHere:true,
    oldWorldPhysicalMotionUnverified:true
   });
  motionWalk=auditCandidateUnderpassContinuousStepPlayer(args);
  if(!sourceCallsUnchanged())
   return failure(seed,rx,rz,'HYPOTHETICAL_WALK_TOUCHED_ORIGINAL_READER',{
    originalSourceChecksPassed:true,sourceChecks,
    underpassActualReaderCallsByRole:snapshot(),
    sourceCallsBeforeMovement:sourceCallsBeforeMotion,
    oldWorldPhysicalMotionUnverified:true
   });
  if(!motionWalk.ok||motionWalk.gradeElevationEdges!==motionGrade.elevationEdges)
   return failure(seed,rx,rz,'SOURCE_SAFE_HYPOTHETICAL_CONTINUOUS_PLAYER_REFUSED',{
    originalSourceChecksPassed:true,sourceChecks,
    hypotheticalOriginalMotionSimulated:motionWalk.originalStepPlayerExecuted===true||
      motionWalk.physicsInvoked===true,
    continuousMovementReason:motionWalk.reason??'ELEVATION_CENSUS_DRIFT',
    continuousMovementFirstRefusal:motionWalk.ok?null:motionWalk,
    gradeElevationEdges:motionGrade.elevationEdges,
    extraOriginalSourceVisitsChargedForMovement:0,
    oldWorldReaderCallsNotInstrumentedHere:true,
    oldWorldPhysicalMotionUnverified:true
   });
 }
 return Object.freeze({ok:true,sitePresent:true,seed,rx,rz,
  originalSourceChecksPassed:true,
  underpassActualReaderCallsByRole:sourceCallsBeforeMotion,
  underpassActualReaderMethodCalls:sourceCallsTotal,
  expectedUnderpassReaderCallsPerRole:expectedRoleCalls,
  sourceReaderCallsUnchangedDuringHypotheticalMotion:sourceCallsUnchanged(),
  underpassReaderIdentityCallerAuthenticatedOnly:true,
  hypotheticalMovementAuditRequested:auditHypotheticalMovement,
  hypotheticalOriginalMotionSimulated:auditHypotheticalMovement&&
   motionWalk?.originalStepPlayerExecuted===true,
  hypotheticalGradeElevationEdges:motionGrade?.elevationEdges??null,
  hypotheticalGradeForwardChecks:motionGrade?.forwardChecks??null,
  hypotheticalGradeReverseChecks:motionGrade?.reverseChecks??null,
  hypotheticalContinuousWalkWaypoints:motionWalk?.routeWaypoints??null,
  hypotheticalContinuousWalkFrames:motionWalk?.totalFrames??null,
  hypotheticalContinuousWalkDirections:motionWalk?.directions?.length??null,
  hypotheticalOnlyStagedAirStoneAndNoLiveOverlays:true,
  originalM7SourceReaderAuthorityByCallerOnly:true,
  actualOriginalM7PlayerMotionNotVerified:true,
  kind:planned.kind,pivot:planned.pivot,segments:planned.segments,
  originalCityCenter:planned.originalCityCenter,
  centerSidePad:planned.centerSidePad,
  sourceChecks:total+padSourceVisits,
  originalFourHubSourceChecks:previous,
  underpassSourceVisits:audited.sourceChecks,
  centerPadSourceVisits:padSourceVisits,
  centerPadSolidSupports:padSupport,
  centerPadNaturalAirClearance:padHeadroomAir,
  centerPadProspectiveExcavation:padExcavation,
  centerPadThreeWideFullDepthGeometryAndSourceChecked:true,
  threeWideDetachedFootgraphEdgeConnectivityVerified:true,
  fullNineCellDestinationPadFootgraphConnected:true,
  detachedFootgraphFullWidthSections:planned.physicalFootgraphSections,
  detachedFootgraphReachableFootNodes:planned.physicalFootgraphReachableNodes,
  detachedFootgraphAccessToPadMinSteps:
   planned.physicalFootgraphMinAccessToPadSteps,
  originalPlayerAabbCollisionRadius:planned.originalPlayerAabbRadius,
  originalPlayerAabbCollisionHeight:planned.originalPlayerAabbHeight,
  originalPlayerAabbSealedFixturePassed:
   planned.originalPlayerColliderAgainstConservativelySealedFixturePassed,
  originalPlayerAabbFixtureBodySamples:
   planned.originalPlayerAabbFixtureBodySamples,
  originalPlayerAabbFixtureFlatSweeps:
   planned.originalPlayerAabbFixtureFlatSweeps,
  originalPlayerAabbElevationChangesStillRequireStepPlayer:
   planned.originalPlayerAabbFixtureSkippedElevationEdges,
  exactOriginalCityCenterThreeWideLandingUnverified:true,
  gradeSupportCells:planned.threeWideSupportCells,
  gradeClearanceCells:planned.threeHighClearanceCells,
  originalSourceCounts:audited.counts,
  centerSideThreeWideLandingJoinedByCandidatePedestrianUnderpass:true,
  originalLiteralCityCenterNotNecessarilyThreeWideConnected:true,
  onlyCandidateDeckAndAIRNotActuallyBuilt:true,
  selectedFourHubAndCityApproachSourceProofProvidedByCallerOnly:true,
  originalM7ReaderIdentityByCallerOnly:true,
  originalWorldUnchanged:true,actualPlayerWalkingUnverified:true,
  iPhoneGpuAndInstalledPwaUnverified:true,
  oldFullCityFloorStillRejected:true,
  releaseApproved:false,worldChanged:false});
}
