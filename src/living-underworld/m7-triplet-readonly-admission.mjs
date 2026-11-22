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
  BIOMES.every(b=>g.rows.some(r=>r.biome===b&&
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
  BIOMES.every(b=>k.rows.some(r=>r.biome===b&&key(r)===REGION[b]))&&
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
  yes(r.threeDeepLinksOriginalM7SourceSelected)&&
  yes(r.joinedCityTerraceAndActualApproachSourceSafe)&&
  yes(r.joinedFourHubCandidateTopologyApproved)&&
  yes(r.joinedFourHubSourceOwnershipApproved));
 if(!citySourceSafe)reasons.push('RARE_CITY_FOUR_HUB_SOURCE_VETO');
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
