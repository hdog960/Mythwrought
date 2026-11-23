// Fail-closed read-only classification of THREE authentic M7 research reports.
// Exact native checkout execution and source integrity are enforced by caller.
// Does not infer release approval or actual walking from candidate geology.
import {inspectOriginalM7TripletAccounting}
 from './m7-triplet-evidence-consistency.mjs';
const SHA=/^[0-9a-f]{40}$/;
const BIOMES=Object.freeze(['plains','desert','snow','mountain','enchanted']);
const REGION=Object.freeze({
 plains:'-9,0',desert:'-3,-9',snow:'-6,3',
 mountain:'6,9',enchanted:'-9,-6'
});
const SCHEMAS=Object.freeze({
 gallery:'living-underworld-authentic-m7-five-biome-gallery-provenance-v1',
 city:'living-underworld-original-m7-rare-city-floor-and-terrace-v1',
 chunk:'living-underworld-original-m7-five-biome-one-hub-chunk-risk-v1'
});
const yes=x=>x===true;
const key=r=>r&&Number.isSafeInteger(r.rx)&&Number.isSafeInteger(r.rz)?
 r.rx+','+r.rz:null;
const seed179=r=>r&&r.seed===179;
const distinct=(items,property)=>Array.isArray(items)&&
 new Set(items.map(property)).size===items.length;
const verifiedSourceCoordinates=(r,bridge,pad)=>{
 const stages=r?.candidateThinUnderpassStageRoleCells;
 const duplicates=r?.candidateThinUnderpassStageDuplicateCalls;
 const overlap=r?.candidateThinUnderpassBridgePadOverlapCells;
 if(!Number.isSafeInteger(bridge)||!Number.isSafeInteger(pad)||
   bridge<1||pad!==135||!yes(r?.candidateThinUnderpassCoordinateCoveragePassed)||
   !yes(r?.candidateThinUnderpassRoleCoordinateIdentityPassed)||
   r.candidateThinUnderpassBridgeDistinctCells!==bridge||
   r.candidateThinUnderpassPadDistinctCells!==pad||
   !Number.isSafeInteger(overlap)||overlap<0||
   overlap>Math.min(bridge,pad)||
   r.candidateThinUnderpassCombinedDistinctCells!==bridge+pad-overlap)
  return false;
 return ['bridge','pad'].every(stage=>
  stages?.[stage]!=null&&duplicates?.[stage]!=null&&
  ['naturalAt','authoredAt','editedAt','protectedAt'].every(role=>
   stages[stage][role]===(stage==='bridge'?bridge:pad)&&
   duplicates[stage][role]===0));
};
export function classifyExactHeadOriginalM7Triplet({
 expectedHead,actualHead,gallery,city,chunk
}={}){
 if(typeof expectedHead!=='string'||!SHA.test(expectedHead)||
  typeof actualHead!=='string'||!SHA.test(actualHead))
  throw TypeError('Authenticated full 40-hex M7 HEADs required');
 const reasons=[],headMatched=actualHead===expectedHead;
 if(!headMatched)reasons.push('WRONG_OR_UNVERIFIED_HEAD');
 const g=gallery,c=city,k=chunk;
 const arithmetic=inspectOriginalM7TripletAccounting({gallery:g,city:c,chunk:k});
 if(!arithmetic.ok){
  reasons.push('M7_REPORT_ARITHMETIC_INCONSISTENT');
  reasons.push(...arithmetic.reasonCodes);
 }
 const reportSchemasValid=g?.schema===SCHEMAS.gallery&&
  c?.schema===SCHEMAS.city&&k?.schema===SCHEMAS.chunk;
 if(!reportSchemasValid)reasons.push('UNKNOWN_OR_MISSING_M7_REPORT_SCHEMA');
 const galleryCohort=seed179(g)&&Array.isArray(g?.rows)&&g.rows.length===5&&
  distinct(g.rows,r=>r?.biome)&&
  BIOMES.every(b=>g.rows.some(r=>r?.biome===b&&
   seed179(r)&&key(r)===REGION[b]))&&
  g.regions===5&&yes(g.readOnlyOriginalM7)&&
  yes(g.allFiveExactHistoricalMouthBiomesVerified);
 if(!galleryCohort)reasons.push('INCOMPLETE_OR_UNTRUSTED_GALLERY_COHORT');
 const cityCohort=seed179(c)&&Array.isArray(c?.rows)&&c.rows.length===2&&
  distinct(c.rows,key)&&['2,0','2,1'].every(k=>
   c.rows.some(r=>seed179(r)&&key(r)===k))&&
  yes(c.originalSourceReaderAuthentic)&&yes(c.noSettlementsPlaced);
 if(!cityCohort)reasons.push('INCOMPLETE_OR_UNTRUSTED_CITY_COHORT');
 const chunkCohort=seed179(k)&&Array.isArray(k?.rows)&&k.rows.length===5&&
  distinct(k.rows,r=>r?.biome)&&
  BIOMES.every(b=>k.rows.some(r=>r?.biome===b&&key(r)===REGION[b]))&&
  k.totalChunks===5&&yes(k.actualOriginalM7SolidSource)&&
  yes(k.noWorldEdits);
 if(!chunkCohort)reasons.push('INCOMPLETE_OR_UNTRUSTED_CHUNK_COHORT');
 const fullyDiagnosed=galleryCohort&&
  yes(g.all80GallerySourceReportsComplete)&&
  yes(g.all80FullSourceVoxelCensusesComplete)&&
  g.rows.every(r=>yes(r.all16GallerySourcesDiagnosed)&&
   yes(r.completedFullSourceCellVetoCensus));
 if(!fullyDiagnosed)reasons.push('ORIGINAL_GALLERY_VOXEL_CENSUS_INCOMPLETE');
 const citySourceSafe=cityCohort&&c.rows.every(r=>
  // The independently checked ORIGINAL city floor/access provenance is
  // mandatory alongside the detached connected three-stair candidate.
  yes(r.existingFullPadAndAccessSourceSafe)&&
  yes(r.threeDeepLinksOriginalM7SourceSelected)&&
  yes(r.joinedCityTerraceAndActualApproachSourceSafe)&&
  yes(r.joinedFourHubCandidateTopologyApproved)&&
  yes(r.joinedFourHubSourceOwnershipApproved));
 if(!citySourceSafe)reasons.push('RARE_CITY_FOUR_HUB_SOURCE_VETO');
 // Phase 23 adds an INDEPENDENT research gate for the thin underpass.
 // The historical four-hub source candidate can remain source-correct
 // even when this optional route fails its PLAYER-size future walking
 // fixture. The pinned exact-HEAD runner must require BOTH evidence
 // tracks, while this result NEVER claims actual original-M7 walking.
 // Phase28: the exact original-M7 source functions used for the prior
 // four-hub/deep-city survey MUST be the same four functions used by the
 // additional thin bridge/pad survey. This only proves in-process caller
 // continuity, not actual FourRegionWorld identity or gameplay readiness.
 const cityThinUnderpassDeepReaderCohortSafe=citySourceSafe&&c.rows.every(r=>
  yes(r.candidateThinUnderpassPriorDeepSourceReaderCohortRequested)&&
  yes(r.candidateThinUnderpassPriorDeepSourceReaderCohortVerified)&&
  r.candidateThinUnderpassPriorDeepSourceReaderCohortMatchingRoles===4&&
  yes(r.candidateThinUnderpassPriorDeepReaderCohortInProcessOnly)&&
  yes(r.candidateThinUnderpassPriorDeepReaderCohortAuthenticM7Unverified)&&
  r.candidateThinUnderpassPriorDeepSourceReaderCohortRefusal===null);
 if(!cityThinUnderpassDeepReaderCohortSafe)
  reasons.push('RARE_CITY_UNDERPASS_DEEP_SOURCE_READER_COHORT_HOLD');
 // Phase29: compare already observed old-world values across the ENTIRE
 // prior deep-city source phase and later underpass, not only bridge/pad
 // overlap. The ledger has zero independent original-world source reads.
 const cityThinUnderpassCrossAuditLedgerSafe=
  cityThinUnderpassDeepReaderCohortSafe&&c.rows.every(r=>{
   const prior=r.candidateThinUnderpassCrossAuditLedgerPriorCalls,
    later=r.candidateThinUnderpassCrossAuditLedgerUnderpassCalls,
    common=r.candidateThinUnderpassCrossAuditLedgerCrossPhaseCellsByRole,
    bridge=r.candidateThinUnderpassSourceVisits,
    pad=r.candidateThinUnderpassCenterLandingSourceVisits,
    total=r.candidateThinUnderpassCrossAuditLedgerTotalCalls;
   if(!yes(r.candidateThinUnderpassCrossAuditLedgerSafe)||
      r.candidateThinUnderpassCrossAuditLedgerReason!==null||
      r.candidateThinUnderpassCrossAuditLedgerFirstMismatch!==null||
      !yes(r.candidateThinUnderpassCrossAuditLedgerReaderBindingsUnchanged)||
      !yes(r.candidateThinUnderpassCrossAuditLedgerCallerOnly)||
      !yes(r.candidateThinUnderpassCrossAuditLedgerNoExtraSourceQueries)||
      ![bridge,pad,total].every(Number.isSafeInteger)||
      bridge<1||pad!==135||!prior||!later||!common)return false;
   let sum=0,commonSum=0;
   for(const role of ['naturalAt','authoredAt','editedAt','protectedAt']){
    if(!Number.isSafeInteger(prior[role])||prior[role]<1||
       !Number.isSafeInteger(later[role])||
       later[role]!==bridge+pad||
       !Number.isSafeInteger(common[role])||common[role]<0||
       common[role]>Math.min(prior[role],later[role]))
     return false;
    sum+=prior[role]+later[role];
    commonSum+=common[role];
   }
   return total===sum&&
    r.candidateThinUnderpassCrossAuditLedgerComparedReturnCount===commonSum;
  });
 if(!cityThinUnderpassCrossAuditLedgerSafe)
  reasons.push('RARE_CITY_UNDERPASS_PRIOR_TO_BRIDGE_SOURCE_VALUE_HOLD');
 const cityThinUnderpassExactCoordinateCoverageSafe=
  citySourceSafe&&cityThinUnderpassDeepReaderCohortSafe&&
  cityThinUnderpassCrossAuditLedgerSafe&&
  c.rows.every(r=>verifiedSourceCoordinates(r,
   r.candidateThinUnderpassSourceVisits,
   r.candidateThinUnderpassCenterLandingSourceVisits));
 if(!cityThinUnderpassExactCoordinateCoverageSafe)
  reasons.push('RARE_CITY_UNDERPASS_SOURCE_COORDINATE_HOLD');
 const cityThinUnderpassIndependentFootprintSafe=
  cityThinUnderpassExactCoordinateCoverageSafe&&c.rows.every(r=>
   yes(r.candidateThinUnderpassIndependentGeometryMatched)&&
   yes(r.candidateThinUnderpassIndependentSourceCoordinatesVerified)&&
   r.candidateThinUnderpassExpectedBridgeDistinctCells===
    r.candidateThinUnderpassBridgeDistinctCells&&
   r.candidateThinUnderpassExpectedPadDistinctCells===
    r.candidateThinUnderpassPadDistinctCells&&
   r.candidateThinUnderpassExpectedOverlapCells===
    r.candidateThinUnderpassBridgePadOverlapCells&&
   r.candidateThinUnderpassExpectedCombinedDistinctCells===
    r.candidateThinUnderpassCombinedDistinctCells);
 if(!cityThinUnderpassIndependentFootprintSafe)
  reasons.push('RARE_CITY_UNDERPASS_INDEPENDENT_FOOTPRINT_HOLD');
 // Independent Phase27 source-value snapshot: equal role coordinates alone
 // cannot prove that underlying M7 geology/edits/ownership stayed stable.
 const cityThinUnderpassOverlapSourceValuesSafe=
  cityThinUnderpassIndependentFootprintSafe&&c.rows.every(r=>{
   const overlap=r.candidateThinUnderpassExpectedOverlapCells;
   const counts=r.candidateThinUnderpassSourceOverlapComparisonsByRole;
   return Number.isSafeInteger(overlap)&&overlap>=0&&
    yes(r.candidateThinUnderpassSourceOverlapValuesStable)&&
    yes(r.candidateThinUnderpassSourceOverlapSourceIdentityCallerOnly)&&
    r.candidateThinUnderpassSourceOverlapExpectedSharedVoxels===overlap&&
    r.candidateThinUnderpassSourceOverlapComparedSharedVoxels===overlap&&
    r.candidateThinUnderpassSourceOverlapTotalComparisons===4*overlap&&
    counts!=null&&typeof counts==='object'&&
    ['naturalAt','authoredAt','editedAt','protectedAt'].every(role=>
     counts[role]===overlap);
  });
 if(!cityThinUnderpassOverlapSourceValuesSafe)
  reasons.push('RARE_CITY_UNDERPASS_SOURCE_OVERLAP_VALUE_HOLD');
 const cityThinUnderpassHypotheticalMovementSafe=citySourceSafe&&
  cityThinUnderpassExactCoordinateCoverageSafe&&
  cityThinUnderpassIndependentFootprintSafe&&
  cityThinUnderpassOverlapSourceValuesSafe&&
  c.rows.every(r=>{
   const bridge=r.candidateThinUnderpassSourceVisits,
    pad=r.candidateThinUnderpassCenterLandingSourceVisits,
    previous=r.candidateThinUnderpassFourHubSourceVisitsCountedOnce,
    total=r.candidateThinUnderpassTotalSourceVisits;
   const visits=[bridge,pad,previous,total];
   const sourceVisitSumValid=visits.every(Number.isSafeInteger)&&
    bridge>0&&pad===135&&previous>0&&
    total===previous+bridge+pad&&total<=150000;
   const expectedRoleCalls=bridge+pad;
   const roles=r.candidateThinUnderpassActualReaderCallsByRole;
   const sourceReaderParityValid=sourceVisitSumValid&&roles!=null&&
    typeof roles==='object'&&
    ['naturalAt','authoredAt','editedAt','protectedAt'].every(role=>
     Number.isSafeInteger(roles[role])&&
     roles[role]===expectedRoleCalls)&&
    r.candidateThinUnderpassExpectedReaderCallsPerRole===expectedRoleCalls&&
    r.candidateThinUnderpassActualReaderMethodCalls===expectedRoleCalls*4&&
    yes(r.candidateThinUnderpassNoReaderCallsDuringSyntheticMotion)&&
    yes(r.candidateThinUnderpassOriginalReaderBindingsUnchanged)&&
    yes(r.candidateThinUnderpassActualReaderIdentityCallerVerifiedOnly);
   return sourceReaderParityValid&&
    yes(r.candidateThinUnderpassHypotheticalPlayerGateRequested)&&
    yes(r.candidateThinUnderpassOriginalSourceSafe)&&
    yes(r.candidateThinUnderpassSourceAndHypotheticalPlayerPass)&&
    yes(r.candidateThinUnderpassHypotheticalPlayerGateRan)&&
    r.candidateThinUnderpassHypotheticalGradeEdges===7&&
    r.candidateThinUnderpassHypotheticalForwardGrades===7&&
    r.candidateThinUnderpassHypotheticalReverseGrades===7&&
    r.candidateThinUnderpassHypotheticalContinuousDirections===2&&
    Number.isSafeInteger(r.candidateThinUnderpassHypotheticalContinuousWaypoints)&&
    r.candidateThinUnderpassHypotheticalContinuousWaypoints>=2&&
    Number.isSafeInteger(r.candidateThinUnderpassHypotheticalContinuousFrames)&&
    r.candidateThinUnderpassHypotheticalContinuousFrames>0&&
    yes(r.candidateThinUnderpassPhysicsStillNotRealM7World)&&
    yes(r.candidateThinUnderpassNativeStepPlayerOnSealedHypotheticalFutureOnly)&&
    yes(r.candidateThinUnderpassAlternativeNotReplacementForFullCityFloor);
  });
 if(!cityThinUnderpassHypotheticalMovementSafe)
  reasons.push('RARE_CITY_UNDERPASS_SOURCE_OR_HYPOTHETICAL_PLAYER_HOLD');
 const chunkRiskSafe=chunkCohort&&
  yes(k.aggregateSourceRisk?.ok)&&
  yes(k.aggregateSourceRisk?.completeCoreHaloEvidence)&&
  yes(k.aggregateSourceRisk?.ownedChunkInteriorsDisjoint)&&
  k.rows.every(r=>yes(r.ok)&&yes(r.sourceCoreCutParity));
 if(!chunkRiskSafe)reasons.push('ORIGINAL_CHUNK_SOURCE_OR_FACE_RISK_HOLD');
 const gallerySourceSafe=fullyDiagnosed&&
  g.sourceSafeRegions===5&&g.rows.every(r=>yes(r.sourceSafe));
 if(!gallerySourceSafe)reasons.push('GALLERY_SOURCE_PROTECTION_VETO');
 const asBuiltGalleriesReady=galleryCohort&&
  g.asBuiltGalleryRegions===5&&
  g.rows.every(r=>yes(r.oldM7AsBuiltGalleryDeckAndAirPresent));
 if(!asBuiltGalleriesReady)reasons.push('ORIGINAL_GALLERY_NOT_BUILT_AND_WALKABLE');
 const nativeTripletReportsPresent=reportSchemasValid&&headMatched&&
  galleryCohort&&cityCohort&&chunkCohort;
 // A positive report is always a READ-ONLY CANDIDATE result.
 // Full old-M7 constructor coverage, actual player collision, GPU, and
 // installed iPhone PWA are independent mandatory unexecuted gates.
 return Object.freeze({
  expectedHead,actualHead,headMatched,
  nativeTripletReportsPresent,
  fullGallerySourceCensusVerified:fullyDiagnosed,
  gallerySourceSafe,asBuiltGalleriesReady,citySourceSafe,
  cityThinUnderpassHypotheticalMovementSafe,
  cityThinUnderpassDeepReaderCohortSafe,
  cityThinUnderpassCrossAuditLedgerSafe,
  cityThinUnderpassExactCoordinateCoverageSafe,
  cityThinUnderpassIndependentFootprintSafe,
  cityThinUnderpassOverlapSourceValuesSafe,
  cityThinUnderpassRealM7WalkingUnverified:true,
  chunkRiskSafe,
  proposalEvidenceAllPassed:nativeTripletReportsPresent&&
   arithmetic.ok&&fullyDiagnosed&&gallerySourceSafe&&citySourceSafe&&chunkRiskSafe,
  reportRowArithmeticReconciled:arithmetic.ok,
  galleryAccountingReconciled:arithmetic.galleryAccountingReconciled,
  cityAccountingReconciled:arithmetic.cityAccountingReconciled,
  chunkAccountingReconciled:arithmetic.chunkAccountingReconciled,
  knownOriginalM7ConstructorFaultsUnresolved:Object.freeze([8675309,13579]),
  original20SeedConstructorGateAccepted:false,
  actualPlayerWalkingVerified:false,iPhoneGpuVerified:false,
  installedPwaVerified:false,releaseApproved:false,
  noSavedWorldOrVoxelMutationAuthorized:true,
  reasonCodes:Object.freeze([...new Set(reasons)])
 });
}
