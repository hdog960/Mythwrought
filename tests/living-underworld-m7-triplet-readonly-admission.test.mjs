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
 sourceSafeRegions:5,asBuiltGalleryRegions:5,
 rows:pairs.map(([biome,rx,rz])=>({
  biome,seed:179,rx,rz,all16GallerySourcesDiagnosed:true,
  completedFullSourceCellVetoCensus:true,sourceSafe:true,
  oldM7AsBuiltGalleryDeckAndAirPresent:true
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
  joinedFourHubSourceOwnershipApproved:true
 }))
});
const chunk=()=>({
 schema:'living-underworld-original-m7-five-biome-one-hub-chunk-risk-v1',
 seed:179,actualOriginalM7SolidSource:true,noWorldEdits:true,totalChunks:5,
 aggregateSourceRisk:{ok:true,completeCoreHaloEvidence:true,
  ownedChunkInteriorsDisjoint:true},
 rows:pairs.map(([biome,rx,rz])=>({
  biome,rx,rz,ok:true,sourceCoreCutParity:true
 }))
});
const check=(overrides={})=>classifyExactHeadOriginalM7Triplet({
 expectedHead:sha,actualHead:sha,gallery:gallery(),
 city:city(),chunk:chunk(),...overrides
});
test('fully formed exact original-HEAD evidence is only a source candidate, never release',()=>{
 const r=check();
 assert.equal(r.nativeTripletReportsPresent,true);
 assert.equal(r.proposalEvidenceAllPassed,true);
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
