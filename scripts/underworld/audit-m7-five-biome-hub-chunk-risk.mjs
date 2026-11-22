// Five authentic M7 SOURCE callbacks, one bounded 16^3 halo-aware upper-hub
// chunk per previously established biome region. This is a RISK estimate,
// NOT authorization for network carving, support placement or GPU acceptance.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {VoxelWorld,baseBlock} from '../../src/voxel.mjs';
import {planUnderworldRegion,networkAirAt}
 from '../../src/living-underworld/worldwide-network.mjs';
import {auditSourceProtectedChunkRisk}
 from '../../src/living-underworld/source-protected-chunk-risk.mjs';
import {summarizeSourceProtectedChunkRisk}
 from '../../src/living-underworld/source-protected-chunk-aggregate.mjs';
const seed=179,sites=Object.freeze([
 Object.freeze({biome:'plains',rx:-9,rz:0}),
 Object.freeze({biome:'desert',rx:-3,rz:-9}),
 Object.freeze({biome:'snow',rx:-6,rz:3}),
 Object.freeze({biome:'mountain',rx:6,rz:9}),
 Object.freeze({biome:'enchanted',rx:-9,rz:-6})
]);
const original=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const old=new VoxelWorld(seed);
const source=Object.freeze({
 naturalAt:(x,y,z)=>original.naturalAndLandmarkBlock(x,y,z),
 authoredAt:(x,y,z)=>original.environmentCaves?.get(x,y,z),
 editedAt:(x,y,z)=>original.edits.has(x+','+y+','+z),
 protectedAt:(x,y,z)=>old.naturalAndLandmarkBlock(x,y,z)!==
  baseBlock(x,y,z,seed)
});
const rows=[],chunkAudits=[];
for(const site of sites){
 const hub=planUnderworldRegion(seed,site.rx,site.rz).layers[0].hub;
 const origin=Object.freeze({x:Math.floor(hub.x/16)*16,
  y:Math.floor(hub.y/16)*16,z:Math.floor(hub.z/16)*16});
 const audit=auditSourceProtectedChunkRisk({origin,side:16,source,
  candidateAirAt:(x,y,z)=>networkAirAt(seed,x,y,z),
  maxFaceGrowth:1200,maxCells:6000});
 chunkAudits.push(audit);
 rows.push(Object.freeze({...site,origin,ok:audit.ok,
  sourceHaloCells:audit.sourceHaloCells,
  candidateCarveCells:audit.plannedCarves,
  sourceAllowedCarveCells:audit.approvedCarves,
  sourceRejectedCarveCells:audit.unsafeCarves,
  ownedInteriorRequestedCarves:audit.interiorRequestedCarves,
  ownedInteriorApprovedCarves:audit.interiorApprovedCarves,
  ownedInteriorRejectedCarves:audit.interiorRejectedCarves,
  haloRequestedProposals:audit.haloRequestedCarves,
  haloApprovedProposals:audit.haloApprovedCarves,
  haloRejectedProposals:audit.haloRejectedCarves,
  sourceCoreCutParity:audit.interiorCutCountMatchesOriginalProjection,
  refusalCounts:audit.counts,refusalExamples:audit.examples,
  oldExposedFaces:audit.baselineFaces,
  approvedOnlyExposedFaces:audit.approvedOnlyProjectedFaces,
  approvedOnlyAddedFaces:audit.approvedOnlyFaceGrowth,
  budgetReason:audit.reason??null,
  proposedSupportPlacementNotModeled:true,
  noNativeGpuBufferCreated:true,oldWorldUnmodified:true}));
}
const aggregate=summarizeSourceProtectedChunkRisk(chunkAudits,{
 expectedChunks:5,maxTotalFaceGrowth:3500,
 maxTotalSourceQueries:40000,maxTotalApprovedCarves:10000,
 requireInteriorEvidence:true
});
const report=Object.freeze({schema:'living-underworld-original-m7-five-biome-one-hub-chunk-risk-v1',
 seed,actualOriginalM7SolidSource:true,
 totalChunks:rows.length,sourceQueries:rows.reduce((n,r)=>n+(r.sourceHaloCells??0),0),
 sourceRejectedCarveCells:rows.reduce((n,r)=>n+(r.sourceRejectedCarveCells??0),0),
 ownedInteriorApprovedCarves:rows.reduce((n,r)=>n+(r.ownedInteriorApprovedCarves??0),0),
 haloApprovedProposals:rows.reduce((n,r)=>n+(r.haloApprovedProposals??0),0),
 haloRejectedProposals:rows.reduce((n,r)=>n+(r.haloRejectedProposals??0),0),
 coreHaloCutCountsReportedSeparately:true,
 perChunkMaximumNewFaces:1200,
 aggregateSourceRisk:Object.freeze(aggregate),rows:Object.freeze(rows),
 allGalleryChunksCovered:false,allSupportPlacementCostsCovered:false,
 playerWalkingAndMobileGpuUnverified:true,
 originalM7ConstructorFaultSeeds8675309And13579NotRetested:true,
 noWorldEdits:true,deviceBuildUnchanged:true});
console.log(JSON.stringify(report));
if(rows.length!==5||rows.some(r=>r.sourceHaloCells!==5832))
 throw Error('Read-only M7 five-biome hub-chunk halo sample incomplete');
