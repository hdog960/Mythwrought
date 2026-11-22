// Read-only original M7 five-biome mutual gallery and provenance audit.
// Do NOT reinterpret historical real-source test failures as pass.
// No cave carving, saves, renderer, settlements, workflows or PWA writes.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {VoxelWorld,baseBlock}
 from '../../src/voxel.mjs';
import {v6BiomeAt}
 from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import {auditMutualMainGalleryClearance}
 from '../../src/living-underworld/main-gallery-mutual-clearance.mjs';
import {auditSourceProtectedMainGalleries}
 from '../../src/living-underworld/main-gallery-source-survey.mjs';
import {auditOriginalMainGalleryVoxelReadiness}
 from '../../src/living-underworld/combined-stair-footprints.mjs';
const runStarted=performance.now();
const seed=179;
const sites=Object.freeze([
 // Coordinates are from the authenticated ORIGINAL M7 protected parent
 // #14733859064 SHA256 manifest (38/38 files), exact HEAD f7de8cfe....
 // Historical surface-safe evidence is NOT a new deep-walking approval.
 Object.freeze({biome:'plains',rx:-9,rz:0,mouth:{x:-2149,y:5,z:181}}),
 Object.freeze({biome:'desert',rx:-3,rz:-9,mouth:{x:-547,y:4,z:-2150}}),
 Object.freeze({biome:'snow',rx:-6,rz:3,mouth:{x:-1428,y:6,z:785}}),
 Object.freeze({biome:'mountain',rx:6,rz:9,mouth:{x:1669,y:6,z:2346}}),
 Object.freeze({biome:'enchanted',rx:-9,rz:-6,mouth:{x:-2182,y:7,z:-1463}})
]);
// Only authentic production M7 reader methods are forwarded; no caller
// materialAllowed, no surrogate terrain, no mutation or waiving protected AIR.
const world=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const old=new VoxelWorld(seed);
const source=Object.freeze({
 naturalAt:(x,y,z)=>world.naturalAndLandmarkBlock(x,y,z),
 authoredAt:(x,y,z)=>world.environmentCaves?.get(x,y,z),
 editedAt:(x,y,z)=>world.edits.has(x+','+y+','+z),
 protectedAt:(x,y,z)=>old.naturalAndLandmarkBlock(x,y,z)!==baseBlock(x,y,z,seed)
});
const rows=[];
for(const site of sites){
 const siteStarted=performance.now();
 // An original-M7-biome witness is verified by its exact historical mouth,
 // NOT inferred from a region-center label (a prior false-positive error).
 const realBiome=v6BiomeAt(site.mouth.x,site.mouth.z,seed)?.name??'plains';
 const mouthInRegion=Math.floor(site.mouth.x/256)===site.rx&&
  Math.floor(site.mouth.z/256)===site.rz;
 if(realBiome!==site.biome||!mouthInRegion)
  throw Error('Historical original M7 biome/mouth site drift: '+
   JSON.stringify({site,realBiome,mouthInRegion}));
 const mutual=auditMutualMainGalleryClearance(seed,site.rx,site.rz);
 const full=auditSourceProtectedMainGalleries(seed,site.rx,site.rz,{
  source,diagnoseAllGalleries:true,countEverySourceVeto:true,
  maxTotalSourceChecks:120000,maxFailureExamples:16
 });
 const existing=auditOriginalMainGalleryVoxelReadiness(seed,site.rx,site.rz,{
  materialAt:source.naturalAt,editedAt:source.editedAt
 });
 rows.push(Object.freeze({...site,seed,
  regionAuditElapsedMs:Math.round((performance.now()-siteStarted)*1000)/1000,
  originalM7HistoricalSurfaceMouthVerifiedByPriorArtifact:true,
  surfaceMouthCurrentSourceRechecked:false,
  exactHistoricalMouthBiomeCurrentlyMatches:true,
  originalM7HistoricalArtifactId:14733859064,
  oldM7AsBuiltGalleryDeckAndAirPresent:existing.ok===true,
  oldM7AsBuiltBlockedHeadroomCells:existing.blockedHeadroom??null,
  oldM7AsBuiltMissingSupportCells:existing.unsupportedDeck??null,
  oldM7AsBuiltEditedCells:existing.editedCells??null,
  oldM7AsBuiltSourceCells:existing.sampledCells??null,
  originalGalleryVoxelWalkabilityStillRequiresPlayerPhysics:true,
  mutuallySafe:mutual.ok,checkedPairs:mutual.examined,
  collidingPairs:mutual.conflictingPairs??null,
  sourceSafe:full.ok,galleriesInspected:full.galleriesInspected,
  all16GallerySourcesDiagnosed:full.diagnosticAll16GalleriesAttempted===true,
  sourceSafeGalleries:full.sourceSafeGalleries??null,
  sourceRejectedGalleries:full.sourceRejectedGalleries??null,
  firstRefusalCounts:full.firstRefusalCounts??null,
  sourceRejectionCounts:full.sourceRejectionCounts??null,
  unsafeMaterialByBlockId:full.unsafeMaterialByBlockId??null,
  otherUnsafeMaterialCells:full.otherUnsafeMaterialCells??null,
  allUnsafeMaterialIdsEnumerated:full.completeUnsafeMaterialIdCoverage===true,
  completedFullSourceCellVetoCensus:full.completeSourceVetoCensus===true,
  sourceCountMethod:full.sourceCountMethod??'INCOMPLETE',
  inspectedSourceCells:full.sourceChecks,
  firstRefusal:full.failures?.[0]??full.reason??null,
  originalWorldEdited:false,realPlayerWalkingUnverified:true}));
}
const report=Object.freeze({schema:'living-underworld-authentic-m7-five-biome-gallery-provenance-v1',
 readOnlyOriginalM7:true,seed,regions:rows.length,
 fullAuditElapsedMs:Math.round((performance.now()-runStarted)*1000)/1000,
 allFiveExactHistoricalMouthBiomesVerified:rows.length===5,
 historicalSurfaceEvidenceOnlyNotDeepOrActualWalking:true,
 mutualPairs:rows.reduce((n,r)=>n+(r.checkedPairs??0),0),
 sourceSafeRegions:rows.filter(x=>x.sourceSafe).length,
 asBuiltGalleryRegions:rows.filter(x=>x.oldM7AsBuiltGalleryDeckAndAirPresent).length,
 sourceRefusals:rows.filter(x=>!x.sourceSafe).length,
 sourceCells:rows.reduce((n,r)=>n+(r.inspectedSourceCells??0),0),
 all80GallerySourceReportsComplete:rows.every(r=>r.all16GallerySourcesDiagnosed),
 all80FullSourceVoxelCensusesComplete:rows.every(r=>
  r.completedFullSourceCellVetoCensus),
 unsafeBlockIdTotals:rows.reduce((out,r)=>{
  for(const [blockId,count] of Object.entries(r.unsafeMaterialByBlockId??{}))
   if(Number.isSafeInteger(count)&&count>=0)
    out[blockId]=(out[blockId]??0)+count;
  return out;
 },{}),
 unsafeBlockIdReportsComplete:rows.every(r=>
  r.completedFullSourceCellVetoCensus&&r.allUnsafeMaterialIdsEnumerated),
 unsafeMaterialIdsOverflowTotal:rows.reduce((n,r)=>
  n+(r.otherUnsafeMaterialCells??0),0),
 voxelSourceVetoCategoryTotals:rows.reduce((out,r)=>{
  for(const [category,count] of Object.entries(r.sourceRejectionCounts??{}))
   if(Number.isSafeInteger(count)&&count>=0)
    out[category]=(out[category]??0)+count;
  return out;
 },{}),
 diagnosedSafeGalleries:rows.reduce((n,r)=>n+(r.sourceSafeGalleries??0),0),
 diagnosedRejectedGalleries:rows.reduce((n,r)=>n+(r.sourceRejectedGalleries??0),0),
 rows:Object.freeze(rows),
 originalM7SeedConstructorFaults8675309And13579NotRetested:true,
 liveGameWalkingUnverified:true,iphoneGpuUnverified:true,
 caveAuthoringUnmodified:true,worldEdited:false,noReleaseApproval:true});
console.log(JSON.stringify(report));
if(rows.length!==5||rows.some(row=>row.checkedPairs!==120))
 throw Error('M7 five-biome original geometry coverage incomplete');
// A source conflict is an evidence-backed refusal, NOT a script crash.
// Keep the report and leave exact historical constructor failures untouched.
