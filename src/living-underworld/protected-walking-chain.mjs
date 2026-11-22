// Detached and fail-closed protected-source *candidate* walking chain.
// Joins a full-volume audited surface gallery to every planned deep-level
// hub through independently source-inspected supported spiral stair decks.
// This NEVER carves M7, registers a new-world profile or tests player physics.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {selectSourceProtectedInterlevelRamps}
 from './source-aware-ramp-selection.mjs';
import {auditProtectedSubsurfaceStairs} from './protected-subsurface-stairs.mjs';
import {auditSupportedEntranceStairs} from './walkable-entrance-stairs.mjs';

const INT=Number.isSafeInteger;
const matching=(a,b)=>a&&b&&a.x===b.x&&a.y===b.y&&a.z===b.z;
const SOURCE_FIELDS=['naturalAt','authoredAt','editedAt','protectedAt'];
export function auditProtectedUnderworldWalkingChain(seed,rx,rz,{
 entrance,source,maxCells=20000
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !source||typeof source!=='object'||
  SOURCE_FIELDS.some(k=>typeof source[k]!=='function')||
  !INT(maxCells)||maxCells<100||maxCells>20000)
  throw new TypeError('Invalid protected-source Underworld walking chain');
 const world=planUnderworldRegion(seed,rx,rz),layers=world.layers;
 const p=entrance?.accepted?.proposal;
 // A returned mouth is not an approval unless its strict source, geometry,
 // and three-wide stair gates all genuinely passed on this exact region.
 const entrancePreflight=entrance?.ok===true&&
  entrance?.worldCarved===false&&
  // The 64-way wrapper identifies an unchanged world with sourceProtected
  // + originalM7Edited:false; legacy 4-way wrapper uses the older flag.
  (entrance?.noOriginalCellsChanged===true||
   (entrance?.sourceProtected===true&&entrance?.originalM7Edited===false))&&
  p?.ok===true&&p.seed===seed&&p.rx===rx&&p.rz===rz&&
  matching(p.start,layers[0].hub)&&
  entrance.accepted?.envelope?.ok===true&&
  entrance.accepted?.geometry?.pass===true&&
  entrance.accepted?.stairs?.ok===true;
 if(!entrancePreflight)return Object.freeze({
  ok:false,seed,rx,rz,reason:'ENTRANCE_PROVENANCE_OR_HUB_MISMATCH',
  sourceProtectedRoutes:0,routeCount:0,worldChanged:false,
  realPlayerWalkingVerified:false});
 // Only the authenticated reader roles cross into the strict audit.
 // Never forward caller-provided materialAllowed, bounds or hidden flags:
 // that could silently widen the immutable original geology allowlist.
 const sourceOpt={
  naturalAt:source.naturalAt,authoredAt:source.authoredAt,
  editedAt:source.editedAt,protectedAt:source.protectedAt,
  maxCells,minY:-210,maxY:19
 };
 const entry=auditProtectedSubsurfaceStairs(p,sourceOpt);
 const entryGrade=auditSupportedEntranceStairs(p);
 // Reject source-unsafe and non-walkable surface galleries immediately.
 // No amount of changing a deep ramp can justify unsafe historical surface.
 const selected=entry.ok&&entryGrade.ok?
  selectSourceProtectedInterlevelRamps(seed,rx,rz,{
   source,entranceProposal:p,includeSocket:false,maxCells
  }):null;
 const connectors=[16,25,34].map((index,i)=>{
  const choice=selected?.links?.[i],picked=choice?.selected,
   rejected=choice?.rejectedCounts;
  const sourceSafe=choice?.ok===true&&picked?.sourceSafe===true;
  return Object.freeze({
   index,fromLevel:layers[i].name,toLevel:layers[i+1].name,
   hubsMatch:!!picked,
   sourceSafe,
   reason:sourceSafe?null:choice?.reason??'NOT_EVALUATED',
   originalM7SourceVisited:picked?.sourceCellsChecked??0,
   rejectsExistingCaveAir:rejected?.existingAirSupport??0,
   rejectsAuthoredCaveAir:rejected?.authoredAirSupport??0,
   rejectsOreOrUnsafe:rejected?.unsafeMaterial??0,
   rejectsOldAuthored:rejected?.authored??0,
   rejectsLandmarks:rejected?.protected??0,
   attemptedAlternatives:choice?.examined??0,
   optimizedSupportCells:picked?.supportCells??null,
   optimizedRadius:picked?.radius??null,
   chosenQuarterTurns:picked?.quarterTurns??null,
   candidateOnly:true
  });
 });
 const possible=entry.ok&&entryGrade.ok&&selected?.ok===true&&
  selected.completeNetworkCollisionFree===true&&
  connectors.every(x=>x.sourceSafe);
 return Object.freeze({
  ok:possible,seed,rx,rz,reason:possible?null:
   !entry.ok?'ENTRANCE_FULL_FOOTPRINT_UNSAFE':
   !entryGrade.ok?'ENTRANCE_NOT_SUPPORTED_STAIRS':
   'DEEP_LINKS_SOURCE_UNSAFE',
  surfaceMouth:p.mouth,
  upperHub:layers[0].hub,lowestHub:layers.at(-1).hub,
  fullEntranceGeologyAndProvenancePassed:entry.ok,
  fullEntranceSourceChecks:entry.sourceChecks??0,
  fullEntranceReason:entry.reason??null,
  originalM7SourceChecks:(entry.sourceChecks??0)+
     (selected?.sourceCellsChecked??0),
  sourceProtectedRoutes:Number(entry.ok)+
   connectors.filter(x=>x.sourceSafe).length,
  routeCount:4,
  combinedNetworkSupportAndHeadroomSafe:selected?.ok===true,
  combinedSelectedRampAirFaceConnected:selected?.allSelectedCandidateVoxelAirFaceConnected===true,
  combinedDistinctProposedSupportCells:selected?.distinctProposedSupportCells??null,
  combinedStairwayCollisions:selected?.combined?.crossRouteBlockedCells??null,
  alternativeLayoutsExamined:selected?.inspected??0,
  aggregateSourceRejectedAlternatives:selected?.sourceRejected??0,
  sourceReaderIdentityAuthenticatedByCallerOnly:true,
  connectors:Object.freeze(connectors),
  potentialRareCityPresent:!!world.cityCandidate,
  rareCityEntranceToFloorNotProven:true,
  surfaceToDeepProofScope:'candidate-footprint-only',
  noOriginalWorldEdits:true,worldChanged:false,
  existingM7Unmodified:true,stairsActuallyPlaced:false,
  oldSurfaceOwnerPreserved:true,
  realPlayerWalkingVerified:false,
  iPhoneGpuAndCollisionUnverified:true,
  infiniteWorldConnectedFractionUnverified:true
 });
}
