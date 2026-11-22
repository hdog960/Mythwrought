// Detached and fail-closed protected-source *candidate* walking chain.
// Joins a full-volume audited surface gallery to every planned deep-level
// hub through independently source-inspected supported spiral stair decks.
// This NEVER carves M7, registers a new-world profile or tests player physics.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {optimizeDetachedPedestrianSwitchback,
 planDetachedPedestrianSwitchback} from './pedestrian-switchback.mjs';
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
 const connectors=[];
 for(const [i,index] of [16,25,34].entries()){
  const optimized=optimizeDetachedPedestrianSwitchback(seed,rx,rz,index);
  const proposal=planDetachedPedestrianSwitchback(seed,rx,rz,index,{
   radius:optimized.selectedRadius,
   cornerFlat:optimized.selectedCornerFlat});
  const join=matching(proposal.from,layers[i].hub)&&
   matching(proposal.to,layers[i+1].hub);
  const audit=join?auditProtectedSubsurfaceStairs(proposal,sourceOpt):null;
  const sourceSafe=join&&optimized.ok&&audit?.ok===true;
  connectors.push(Object.freeze({
   index,fromLevel:layers[i].name,toLevel:layers[i+1].name,
   hubsMatch:join,sourceSafe,reason:!join?'HUB_MISMATCH':
    audit?.reason??null,
   originalM7SourceVisited:audit?.sourceChecks??0,
   rejectsExistingCaveAir:audit?.counts?.existingAirSupport??0,
   rejectsAuthoredCaveAir:audit?.counts?.authoredAirSupport??0,
   rejectsOreOrUnsafe:audit?.counts?.unsafeMaterial??0,
   rejectsOldAuthored:audit?.counts?.authored??0,
   rejectsLandmarks:audit?.counts?.protected??0,
   optimizedSupportCells:optimized.optimizedSupportCells,
   optimizedRadius:optimized.selectedRadius,
   candidateOnly:true
  }));
 }
 const possible=entry.ok&&entryGrade.ok&&
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
   connectors.reduce((n,x)=>n+x.originalM7SourceVisited,0),
  sourceProtectedRoutes:Number(entry.ok)+
   connectors.filter(x=>x.sourceSafe).length,
  routeCount:4,
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
