import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyExactHeadOriginalM7Triplet}
 from '../src/living-underworld/m7-triplet-readonly-admission.mjs';

const sha='994e4b232d8c57ed9903c7029d8c63604cf6e452';
const pairs=[['plains',-9,0],['desert',-3,-9],['snow',-6,3],
 ['mountain',6,9],['enchanted',-9,-6]];
const gallery=()=>({
 schema:'living-underworld-authentic-m7-five-biome-gallery-provenance-v1',
 seed:179,readOnlyOriginalM7:true,regions:5,
 allFiveExactHistoricalMouthBiomesVerified:true,
 all80GallerySourceReportsComplete:true,
 all80FullSourceVoxelCensusesComplete:true,
 sourceSafeRegions:5,sourceRefusals:0,asBuiltGalleryRegions:5,
 sourceCells:7740,totalOriginalM7ReaderMethodCalls:30960,
 diagnosedSafeGalleries:80,diagnosedRejectedGalleries:0,
 unsafeBlockIdTotals:{},unsafeMaterialIdsOverflowTotal:0,
 voxelSourceVetoCategoryTotals:{
  authored:0,edited:0,protected:0,unsafeMaterial:0,
  bounds:0,authoredAirSupport:0,existingAirSupport:0,
  sourceInconsistency:0
 },
 originalReaderCallCountsByRole:{naturalAt:7740,authoredAt:7740,
  editedAt:7740,protectedAt:7740},
 rows:pairs.map(([biome,rx,rz])=>({
  biome,seed:179,rx,rz,all16GallerySourcesDiagnosed:true,
  completedFullSourceCellVetoCensus:true,sourceSafe:true,
  galleriesInspected:16,checkedPairs:120,
  sourceSafeGalleries:16,sourceRejectedGalleries:0,
  sourceCountMethod:'FULL_COMPLETED_GALLERY_SOURCE_VOXELS',
  inspectedSourceCells:1548,genuineOriginalReaderCalls:6192,
  originalReaderCallsByRole:{naturalAt:1548,authoredAt:1548,
   editedAt:1548,protectedAt:1548},
  sourceRejectionCounts:{
   authored:0,edited:0,protected:0,unsafeMaterial:0,
   bounds:0,authoredAirSupport:0,existingAirSupport:0,
   sourceInconsistency:0
  },
  unsafeMaterialByBlockId:{},otherUnsafeMaterialCells:0,
  allUnsafeMaterialIdsEnumerated:true,
  oldM7AsBuiltGalleryDeckAndAirPresent:true,
  oldM7AsBuiltBlockedHeadroomCells:0,oldM7AsBuiltMissingSupportCells:0,
  oldM7AsBuiltEditedCells:0,oldM7AsBuiltSourceCells:1548,
  oldM7AsBuiltHeadroomBlockedByBlockId:{},
  oldM7AsBuiltUnsupportedFloorByBlockId:{},
  oldM7AsBuiltBlockedMaterialIdOverflow:0,
  oldM7AsBuiltSupportMaterialIdOverflow:0
 }))
});
const city=()=>({
 schema:'living-underworld-original-m7-rare-city-floor-and-terrace-v1',
 seed:179,originalSourceReaderAuthentic:true,noSettlementsPlaced:true,
 rows:[[2,0],[2,1]].map(([rx,rz])=>({
  seed:179,rx,rz,
  threeDeepLinksOriginalM7SourceSelected:true,
  joinedCityTerraceAndActualApproachSourceSafe:true,
  joinedFourHubCandidateTopologyApproved:true,
  joinedFourHubSourceOwnershipApproved:true,
  existingFullPadAndAccessSourceSafe:true,
  candidateThinUnderpassOriginalSourceSafe:true,
  candidateThinUnderpassSourceAndHypotheticalPlayerPass:true,
  candidateThinUnderpassHypotheticalPlayerGateRequested:true,
  candidateThinUnderpassHypotheticalPlayerGateRan:true,
  candidateThinUnderpassHypotheticalGradeEdges:7,
  candidateThinUnderpassHypotheticalForwardGrades:7,
  candidateThinUnderpassHypotheticalReverseGrades:7,
  candidateThinUnderpassHypotheticalContinuousDirections:2,
  candidateThinUnderpassHypotheticalContinuousWaypoints:rz===0?47:63,
  candidateThinUnderpassHypotheticalContinuousFrames:2500,
  candidateThinUnderpassPhysicsStillNotRealM7World:true,
  candidateThinUnderpassNativeStepPlayerOnSealedHypotheticalFutureOnly:true,
  candidateThinUnderpassAlternativeNotReplacementForFullCityFloor:true,
  candidateThinUnderpassSourceVisits:rz===0?248:276,
  candidateThinUnderpassCenterLandingSourceVisits:135,
  candidateThinUnderpassFourHubSourceVisitsCountedOnce:rz===0?8815:12711,
  candidateThinUnderpassTotalSourceVisits:
   rz===0?8815+248+135:12711+276+135,
  candidateThinUnderpassActualReaderCallsByRole:{
   naturalAt:rz===0?383:411,authoredAt:rz===0?383:411,
   editedAt:rz===0?383:411,protectedAt:rz===0?383:411
  },
  candidateThinUnderpassActualReaderMethodCalls:rz===0?1532:1644,
  candidateThinUnderpassExpectedReaderCallsPerRole:rz===0?383:411,
  candidateThinUnderpassNoReaderCallsDuringSyntheticMotion:true,
  candidateThinUnderpassOriginalReaderBindingsUnchanged:true,
  candidateThinUnderpassActualReaderIdentityCallerVerifiedOnly:true,
  candidateThinUnderpassCoordinateCoveragePassed:true,
  candidateThinUnderpassRoleCoordinateIdentityPassed:true,
  candidateThinUnderpassIndependentGeometryMatched:true,
  candidateThinUnderpassIndependentSourceCoordinatesVerified:true,
  candidateThinUnderpassExpectedBridgeDistinctCells:rz===0?248:276,
  candidateThinUnderpassExpectedPadDistinctCells:135,
  candidateThinUnderpassExpectedOverlapCells:12,
  candidateThinUnderpassExpectedCombinedDistinctCells:
   (rz===0?248:276)+135-12,
  candidateThinUnderpassBridgeDistinctCells:rz===0?248:276,
  candidateThinUnderpassPadDistinctCells:135,
  candidateThinUnderpassBridgePadOverlapCells:12,
  candidateThinUnderpassCombinedDistinctCells:(rz===0?248:276)+135-12,
  candidateThinUnderpassStageRoleCells:{
   bridge:{naturalAt:rz===0?248:276,authoredAt:rz===0?248:276,
    editedAt:rz===0?248:276,protectedAt:rz===0?248:276},
   pad:{naturalAt:135,authoredAt:135,editedAt:135,protectedAt:135}
  },
  candidateThinUnderpassStageDuplicateCalls:{
   bridge:{naturalAt:0,authoredAt:0,editedAt:0,protectedAt:0},
   pad:{naturalAt:0,authoredAt:0,editedAt:0,protectedAt:0}
  },
  fullJoinedCandidateOriginalM7SourceChecks:8815,
  fullNetworkCombinationsInspected:1,joinedSourceChecks:8815,
  fullPadSourceChecks:200,
  threeDeepLinkSelectedIndexList:[16,25,34],
  selectedDeepLinkConfigurations:[16,25,34].map(index=>({index})),
  oldWorldModified:false,cityPlaced:false,actuallyBuiltAndWalked:false
 }))
});
const chunk=()=>({
 schema:'living-underworld-original-m7-five-biome-one-hub-chunk-risk-v1',
 seed:179,actualOriginalM7SolidSource:true,noWorldEdits:true,totalChunks:5,
 aggregateSourceRisk:{ok:true,completeCoreHaloEvidence:true,
  ownedChunkInteriorsDisjoint:true,expectedChunks:5,checkedChunks:5,
  sourceQueries:29160,approvedCarves:5,unsafeCarves:0,
  approvedHaloProposals:0,rejectedHaloProposals:0,faceGrowth:30},
 sourceQueries:29160,ownedInteriorApprovedCarves:5,
 sourceRejectedCarveCells:0,haloApprovedProposals:0,haloRejectedProposals:0,
 rows:pairs.map(([biome,rx,rz])=>({
  biome,rx,rz,ok:true,sourceCoreCutParity:true,
  origin:{x:rx*256+16,y:-48,z:rz*256+16},
  sourceHaloCells:5832,candidateCarveCells:1,
  sourceAllowedCarveCells:1,sourceRejectedCarveCells:0,
  ownedInteriorRequestedCarves:1,ownedInteriorApprovedCarves:1,
  ownedInteriorRejectedCarves:0,haloRequestedProposals:0,
  haloApprovedProposals:0,haloRejectedProposals:0,
  approvedOnlyAddedFaces:6,oldWorldUnmodified:true,
  budgetReason:null,refusalCounts:{oreOrUnsafe:0,authoredSolid:0,
   authoredAirMismatch:0,originalEdit:0,landmark:0}
 }))
});
const check=(overrides={})=>classifyExactHeadOriginalM7Triplet({
 expectedHead:sha,actualHead:sha,gallery:gallery(),
 city:city(),chunk:chunk(),...overrides
});
test('fully formed exact original-HEAD evidence is only a source candidate, never release',()=>{
 const r=check();
 assert.equal(r.nativeTripletReportsPresent,true);
 assert.equal(r.reportRowArithmeticReconciled,true);
 assert.equal(r.proposalEvidenceAllPassed,true);
 assert.equal(r.cityThinUnderpassHypotheticalMovementSafe,true);
 assert.equal(r.cityThinUnderpassExactCoordinateCoverageSafe,true);
 assert.equal(r.cityThinUnderpassIndependentFootprintSafe,true);
 assert.equal(r.cityThinUnderpassRealM7WalkingUnverified,true);
 assert.equal(r.releaseApproved,false);
 assert.equal(r.actualPlayerWalkingVerified,false);
 assert.equal(r.iPhoneGpuVerified,false);
 assert.equal(r.installedPwaVerified,false);
 assert.deepEqual(r.knownOriginalM7ConstructorFaultsUnresolved,[8675309,13579]);
});
test('mismatched commit HEAD rejects otherwise identical positive M7 reports',()=>{
 const r=check({actualHead:'f7de8cfe6c4e055e94bf1ce2398ad7aa97e588e0'});
 assert.equal(r.headMatched,false);
 assert.equal(r.nativeTripletReportsPresent,false);
 assert.equal(r.proposalEvidenceAllPassed,false);
 assert.ok(r.reasonCodes.includes('WRONG_OR_UNVERIFIED_HEAD'));
});
test('duplicate or wrong-biome surface source evidence is not five-biome proof',()=>{
 const g=gallery();g.rows[4]={...g.rows[0]};
 const r=check({gallery:g});
 assert.equal(r.nativeTripletReportsPresent,false);
 assert.ok(r.reasonCodes.includes('INCOMPLETE_OR_UNTRUSTED_GALLERY_COHORT'));
});
test('partial gallery source census does not become complete when some rows are safe',()=>{
 const g=gallery();g.rows[2].completedFullSourceCellVetoCensus=false;
 const r=check({gallery:g});
 assert.equal(r.fullGallerySourceCensusVerified,false);
 assert.equal(r.proposalEvidenceAllPassed,false);
 assert.ok(r.reasonCodes.includes('ORIGINAL_GALLERY_VOXEL_CENSUS_INCOMPLETE'));
});
test('a failed actual M7 city deep link or chunk face risk cannot be waived',()=>{
 const c=city();c.rows[0].joinedFourHubSourceOwnershipApproved=false;
 const k=chunk();k.aggregateSourceRisk.ok=false;
 const r=check({city:c,chunk:k});
 assert.equal(r.citySourceSafe,false);
 assert.equal(r.chunkRiskSafe,false);
 assert.equal(r.proposalEvidenceAllPassed,false);
 assert.ok(r.reasonCodes.includes('RARE_CITY_FOUR_HUB_SOURCE_VETO'));
 assert.ok(r.reasonCodes.includes('ORIGINAL_CHUNK_SOURCE_OR_FACE_RISK_HOLD'));
});
test('as-built floor/headroom failures hold walking even when planned source is safe',()=>{
 const g=gallery();g.rows[0].oldM7AsBuiltGalleryDeckAndAirPresent=false;
 g.rows[0].oldM7AsBuiltBlockedHeadroomCells=1;
 g.rows[0].oldM7AsBuiltHeadroomBlockedByBlockId={'3':1};
 g.asBuiltGalleryRegions=4;
 const r=check({gallery:g});
 assert.equal(r.asBuiltGalleriesReady,false);
 assert.equal(r.proposalEvidenceAllPassed,true);
 assert.equal(r.releaseApproved,false);
 assert.ok(r.reasonCodes.includes('ORIGINAL_GALLERY_NOT_BUILT_AND_WALKABLE'));
});
test('unrecognized JSON schemas and malformed SHA are never native evidence',()=>{
 const c=city();c.schema='synthetic-detached-city-v1';
 const r=check({city:c});
 assert.equal(r.nativeTripletReportsPresent,false);
 assert.ok(r.reasonCodes.includes('UNKNOWN_OR_MISSING_M7_REPORT_SCHEMA'));
 assert.throws(()=>check({actualHead:'not-a-sha'}),
  /Authenticated full 40-hex M7 HEADs required/);
});

test('forged gallery voxel and reader totals cannot pass a declared complete census',()=>{
 const g=gallery();g.sourceCells+=1;
 const r=check({gallery:g});
 assert.equal(r.reportRowArithmeticReconciled,false);
 assert.equal(r.proposalEvidenceAllPassed,false);
 assert.ok(r.reasonCodes.includes('M7_GALLERY_AGGREGATES_DO_NOT_MATCH_ROWS'));
});
test('a gallery cannot claim a complete ore ID histogram with absent vetoed IDs',()=>{
 const g=gallery();
 g.rows[0].sourceRejectionCounts.unsafeMaterial=3;
 const r=check({gallery:g});
 assert.equal(r.reportRowArithmeticReconciled,false);
 assert.equal(r.galleryAccountingReconciled,false);
 assert.ok(r.reasonCodes.includes('M7_GALLERY_ROW_SOURCE_ARITHMETIC_INVALID'));
});
test('source clean region cannot impersonate already built walkable deck',()=>{
 const g=gallery();
 g.rows[0].oldM7AsBuiltBlockedHeadroomCells=2;
 g.rows[0].oldM7AsBuiltHeadroomBlockedByBlockId={'3':2};
 const r=check({gallery:g});
 assert.equal(r.reportRowArithmeticReconciled,false);
 assert.equal(r.proposalEvidenceAllPassed,false);
});
test('wrong but superficially successful city connector index list is rejected',()=>{
 const c=city();c.rows[0].threeDeepLinkSelectedIndexList=[16,25,25];
 const r=check({city:c});
 assert.equal(r.cityAccountingReconciled,false);
 assert.equal(r.proposalEvidenceAllPassed,false);
 assert.ok(r.reasonCodes.includes('M7_CITY_DEEP_LINK_TOPOLOGY_INCONSISTENT'));
});
test('overreported core excavation in a real M7 cohort fails arithmetic',()=>{
 const k=chunk();k.rows[2].ownedInteriorApprovedCarves=2;
 const r=check({chunk:k});
 assert.equal(r.chunkAccountingReconciled,false);
 assert.equal(r.proposalEvidenceAllPassed,false);
 assert.ok(r.reasonCodes.includes('M7_CHUNK_CORE_HALO_ARITHMETIC_INVALID'));
});
test('aggregate projected faces cannot be inflated independently of chunk rows',()=>{
 const k=chunk();k.aggregateSourceRisk.faceGrowth++;
 const r=check({chunk:k});
 assert.equal(r.chunkAccountingReconciled,false);
 assert.equal(r.proposalEvidenceAllPassed,false);
 assert.ok(r.reasonCodes.includes('M7_CHUNK_AGGREGATE_DOES_NOT_MATCH_ROWS'));
});
test('invalid original chunk coordinate outside declared region is a refusal',()=>{
 const k=chunk();k.rows[1].origin.x=16;
 const r=check({chunk:k});
 assert.equal(r.chunkAccountingReconciled,false);
 assert.equal(r.releaseApproved,false);
});

test('null synthetic gallery or chunk rows refuse with explicit evidence codes',()=>{
 for(const kind of ['gallery','chunk']){
  const record=kind==='gallery'?gallery():chunk();
  record.rows[1]=null;
  const r=check({[kind]:record});
  assert.equal(r.proposalEvidenceAllPassed,false);
  assert.equal(r.nativeTripletReportsPresent,false);
  assert.ok(r.reasonCodes.includes(kind==='gallery'?
   'INCOMPLETE_OR_UNTRUSTED_GALLERY_COHORT':
   'INCOMPLETE_OR_UNTRUSTED_CHUNK_COHORT'));
 }
});
test('source veto categories are conserved independently of claimed gallery totals',()=>{
 const g=gallery();
 g.voxelSourceVetoCategoryTotals.edited=1;
 const r=check({gallery:g});
 assert.equal(r.proposalEvidenceAllPassed,false);
 assert.equal(r.reportRowArithmeticReconciled,false);
 assert.ok(r.reasonCodes.includes('M7_GALLERY_AGGREGATES_DO_NOT_MATCH_ROWS'));
});
test('forged zero refused chunks cannot hide real refusal categories',()=>{
 const k=chunk();k.rows[2].refusalCounts.oreOrUnsafe=1;
 const r=check({chunk:k});
 assert.equal(r.chunkAccountingReconciled,false);
 assert.equal(r.proposalEvidenceAllPassed,false);
 assert.ok(r.reasonCodes.includes('M7_CHUNK_CORE_HALO_ARITHMETIC_INVALID'));
});

test('independent actual M7 full city pad veto blocks three nominally safe deep links',()=>{
 const c=city();c.rows[1].existingFullPadAndAccessSourceSafe=false;
 const r=check({city:c});
 assert.equal(r.reportRowArithmeticReconciled,true);
 assert.equal(r.citySourceSafe,false);
 assert.equal(r.proposalEvidenceAllPassed,false);
 assert.ok(r.reasonCodes.includes('RARE_CITY_FOUR_HUB_SOURCE_VETO'));
});


test('Phase23 four-hub proof cannot hide a refused thin-underpass movement gate',()=>{
 const c=city();c.rows[1].candidateThinUnderpassSourceAndHypotheticalPlayerPass=false;
 const r=check({city:c});
 assert.equal(r.citySourceSafe,true);
 assert.equal(r.proposalEvidenceAllPassed,true);
 assert.equal(r.cityThinUnderpassHypotheticalMovementSafe,false);
 assert.ok(r.reasonCodes.includes('RARE_CITY_UNDERPASS_SOURCE_OR_HYPOTHETICAL_PLAYER_HOLD'));
 assert.equal(r.actualPlayerWalkingVerified,false);
 assert.equal(r.releaseApproved,false);
});
test('Phase23 requires exactly seven bidirectional original-controller grade edges at both historical sites',()=>{
 for(const key of ['candidateThinUnderpassHypotheticalGradeEdges',
  'candidateThinUnderpassHypotheticalForwardGrades',
  'candidateThinUnderpassHypotheticalReverseGrades']){
  const c=city();c.rows[0][key]=6;
  assert.equal(check({city:c}).cityThinUnderpassHypotheticalMovementSafe,false,key);
 }
 const c=city();c.rows[1].candidateThinUnderpassHypotheticalContinuousDirections=1;
 assert.equal(check({city:c}).cityThinUnderpassHypotheticalMovementSafe,false);
});
test('Phase23 missing source-first physics provenance and dishonest live-world claims refuse',()=>{
 for(const key of [
  'candidateThinUnderpassHypotheticalPlayerGateRequested',
  'candidateThinUnderpassHypotheticalPlayerGateRan',
  'candidateThinUnderpassOriginalSourceSafe',
  'candidateThinUnderpassPhysicsStillNotRealM7World',
  'candidateThinUnderpassNativeStepPlayerOnSealedHypotheticalFutureOnly',
  'candidateThinUnderpassAlternativeNotReplacementForFullCityFloor'
 ]){
  const c=city();c.rows[0][key]=false;
  assert.equal(check({city:c}).cityThinUnderpassHypotheticalMovementSafe,false,key);
 }
 const c=city();delete c.rows[1].candidateThinUnderpassHypotheticalContinuousFrames;
 assert.equal(check({city:c}).cityThinUnderpassHypotheticalMovementSafe,false);
});
test('Phase23 conserves exact original visits four-hub plus bridge plus 135 full landing cells',()=>{
 for(const mutate of [
  row=>row.candidateThinUnderpassTotalSourceVisits++,
  row=>row.candidateThinUnderpassCenterLandingSourceVisits=134,
  row=>row.candidateThinUnderpassFourHubSourceVisitsCountedOnce=0,
  row=>row.candidateThinUnderpassTotalSourceVisits=150001,
  row=>row.candidateThinUnderpassSourceVisits=0,
  row=>row.candidateThinUnderpassSourceVisits=13.5
 ]){
  const c=city();mutate(c.rows[1]);
  const r=check({city:c});
  assert.equal(r.cityThinUnderpassHypotheticalMovementSafe,false);
  assert.equal(r.releaseApproved,false);
 }
});
test('Phase23 future sealed player geometry remains not a real-world/PWA acceptance',()=>{
 const r=check();
 assert.equal(r.cityThinUnderpassHypotheticalMovementSafe,true);
 assert.equal(r.actualPlayerWalkingVerified,false);
 assert.equal(r.original20SeedConstructorGateAccepted,false);
 assert.equal(r.iPhoneGpuVerified,false);
 assert.equal(r.installedPwaVerified,false);
 assert.equal(r.releaseApproved,false);
});


test('Phase24 original source reader role census is mandatory and independent of passing physics',()=>{
 const r=check();
 assert.equal(r.cityThinUnderpassHypotheticalMovementSafe,true);
 for(const role of ['naturalAt','authoredAt','editedAt','protectedAt']){
  const c=city();c.rows[0].candidateThinUnderpassActualReaderCallsByRole[role]--;
  const result=check({city:c});
  assert.equal(result.citySourceSafe,true);
  assert.equal(result.cityThinUnderpassHypotheticalMovementSafe,false,role);
  assert.equal(result.releaseApproved,false);
 }
});
test('Phase24 fabricated totals, skipped methods and unexpected motion reads refuse',()=>{
 for(const mutate of [
  row=>{row.candidateThinUnderpassActualReaderMethodCalls--},
  row=>{row.candidateThinUnderpassExpectedReaderCallsPerRole++},
  row=>{row.candidateThinUnderpassNoReaderCallsDuringSyntheticMotion=false},
  row=>{row.candidateThinUnderpassActualReaderIdentityCallerVerifiedOnly=false},
  row=>{row.candidateThinUnderpassActualReaderCallsByRole=null},
  row=>{delete row.candidateThinUnderpassActualReaderCallsByRole.naturalAt}
 ]){
  const c=city();mutate(c.rows[1]);
  const r=check({city:c});
  assert.equal(r.cityThinUnderpassHypotheticalMovementSafe,false);
  assert.equal(r.releaseApproved,false);
 }
});

test('Phase25 a prior seven-grade physics pass cannot hide mismatched source coordinates',()=>{
 const c=city();
 c.rows[0].candidateThinUnderpassStageRoleCells.bridge.naturalAt--;
 const r=check({city:c});
 assert.equal(r.citySourceSafe,true);
 assert.equal(r.proposalEvidenceAllPassed,true);
 assert.equal(r.cityThinUnderpassExactCoordinateCoverageSafe,false);
 assert.equal(r.cityThinUnderpassHypotheticalMovementSafe,false);
 assert.ok(r.reasonCodes.includes('RARE_CITY_UNDERPASS_SOURCE_COORDINATE_HOLD'));
 assert.equal(r.actualPlayerWalkingVerified,false);
});
test('Phase25 stage overlap and combined distinct cells must be internally consistent',()=>{
 for(const mutate of [
  row=>row.candidateThinUnderpassBridgePadOverlapCells=-1,
  row=>row.candidateThinUnderpassBridgePadOverlapCells=136,
  row=>row.candidateThinUnderpassCombinedDistinctCells++,
  row=>row.candidateThinUnderpassBridgeDistinctCells--,
  row=>row.candidateThinUnderpassPadDistinctCells=134
 ]){
  const c=city();mutate(c.rows[1]);
  const r=check({city:c});
  assert.equal(r.cityThinUnderpassExactCoordinateCoverageSafe,false);
  assert.equal(r.releaseApproved,false);
 }
});
test('Phase25 skipped pad roles, duplicate bridge queries and absent stage evidence hold',()=>{
 for(const mutate of [
  row=>row.candidateThinUnderpassStageRoleCells.pad.protectedAt--,
  row=>row.candidateThinUnderpassStageDuplicateCalls.bridge.editedAt++,
  row=>row.candidateThinUnderpassCoordinateCoveragePassed=false,
  row=>row.candidateThinUnderpassRoleCoordinateIdentityPassed=false,
  row=>{delete row.candidateThinUnderpassStageRoleCells.bridge},
  row=>{row.candidateThinUnderpassStageDuplicateCalls.pad=null}
 ]){
  const c=city();mutate(c.rows[1]);
  const r=check({city:c});
  assert.equal(r.cityThinUnderpassExactCoordinateCoverageSafe,false);
  assert.equal(r.cityThinUnderpassHypotheticalMovementSafe,false);
 }
});


test('Phase26 independently staged geometry holds even when all four reader sets agree on an incorrect footprint',()=>{
 const c=city();
 c.rows[0].candidateThinUnderpassExpectedCombinedDistinctCells++;
 const r=check({city:c});
 assert.equal(r.citySourceSafe,true);
 assert.equal(r.cityThinUnderpassExactCoordinateCoverageSafe,true);
 assert.equal(r.cityThinUnderpassIndependentFootprintSafe,false);
 assert.equal(r.cityThinUnderpassHypotheticalMovementSafe,false);
 assert.ok(r.reasonCodes.includes('RARE_CITY_UNDERPASS_INDEPENDENT_FOOTPRINT_HOLD'));
 assert.equal(r.actualPlayerWalkingVerified,false);
 assert.equal(r.releaseApproved,false);
});
test('Phase26 independently derived bridge, landing, and overlap cells cannot be forged separately',()=>{
 for(const change of [
  row=>row.candidateThinUnderpassExpectedBridgeDistinctCells++,
  row=>row.candidateThinUnderpassExpectedPadDistinctCells--,
  row=>row.candidateThinUnderpassExpectedOverlapCells++,
  row=>row.candidateThinUnderpassExpectedCombinedDistinctCells--,
  row=>row.candidateThinUnderpassIndependentGeometryMatched=false,
  row=>row.candidateThinUnderpassIndependentSourceCoordinatesVerified=false,
  row=>{delete row.candidateThinUnderpassIndependentGeometryMatched}
 ]){
  const c=city();change(c.rows[1]);
  const r=check({city:c});
  assert.equal(r.cityThinUnderpassIndependentFootprintSafe,false);
  assert.equal(r.cityThinUnderpassHypotheticalMovementSafe,false);
  assert.equal(r.releaseApproved,false);
 }
});
