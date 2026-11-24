// Five authentic M7 SOURCE callbacks, one bounded 16^3 halo-aware upper-hub
// chunk per previously established biome region. This is a RISK estimate,
// NOT authorization for network carving, support placement or GPU acceptance.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {VoxelWorld,baseBlock} from '../../src/voxel.mjs';
import {planUnderworldRegion,networkAirAt}
 from '../../src/living-underworld/worldwide-network.mjs';
import {compactUpperHubResearchAirAt,UPPER_HUB_COMPACT_PROFILE}
 from '../../src/living-underworld/compact-upper-hub-research.mjs';
import {auditSourceProtectedChunkRisk}
 from '../../src/living-underworld/source-protected-chunk-risk.mjs';
import {summarizeSourceProtectedChunkRisk}
 from '../../src/living-underworld/source-protected-chunk-aggregate.mjs';
const runStarted=performance.now();
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
let oldOwnedGeometry=0,compactOwnedGeometry=0,removedOwnedGeometry=0;
const originalOwnedPerBiome=Object.freeze([2696,2425,3230,2994,2823]);
for(const site of sites){
 const siteStarted=performance.now();
 const hub=planUnderworldRegion(seed,site.rx,site.rz).layers[0].hub;
 const origin=Object.freeze({x:Math.floor(hub.x/16)*16,
  y:Math.floor(hub.y/16)*16,z:Math.floor(hub.z/16)*16});
 // Compare masks DURING the existing 18^3 source projection. No second
 // M7 natural/cave/edit/landmark source query or source-budget split.
 // Raw original counts are geometry proposals only, NOT approval to carve
 // any removed old-world ore/edit/landmark voxels.
 const observed={oldOwned:0,compactOwned:0,oldHalo:0,compactHalo:0};
 const inside=(x,y,z)=>x>=origin.x&&x<origin.x+16&&
  y>=origin.y&&y<origin.y+16&&z>=origin.z&&z<origin.z+16;
 const audit=auditSourceProtectedChunkRisk({origin,side:16,source,
  candidateAirAt:(x,y,z)=>{
   const baseline=networkAirAt(seed,x,y,z);
   const compact=compactUpperHubResearchAirAt(seed,x,y,z);
   if(compact&&!baseline)
    throw Error('COMPACT_PROPOSED_UNAUTHORIZED_NEW_NETWORK_AIR');
   const target=inside(x,y,z)?'Owned':'Halo';
   if(baseline)observed['old'+target]++;
   if(compact)observed['compact'+target]++;
   return compact;
  },maxFaceGrowth:1200,maxCells:6000});
 if(observed.oldOwned!==originalOwnedPerBiome[rows.length]||
    observed.compactOwned!==audit.interiorRequestedCarves||
    observed.compactHalo!==audit.haloRequestedCarves||
    observed.compactOwned>=observed.oldOwned)
  throw Error('COMPACT_RESEARCH_NATIVE_CORE_HALO_PROPOSAL_DRIFT');
 oldOwnedGeometry+=observed.oldOwned;
 compactOwnedGeometry+=observed.compactOwned;
 removedOwnedGeometry+=observed.oldOwned-observed.compactOwned;
 chunkAudits.push(audit);
 rows.push(Object.freeze({...site,origin,ok:audit.ok,
  regionChunkAuditElapsedMs:Math.round((performance.now()-siteStarted)*1000)/1000,
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
  originalUncompactedOwnedInteriorProposals:observed.oldOwned,
  compactOwnedInteriorProposals:observed.compactOwned,
  removedOwnedInteriorProposals:observed.oldOwned-observed.compactOwned,
  originalUncompactedHaloProposals:observed.oldHalo,
  compactHaloProposals:observed.compactHalo,
  compactAlwaysSubsetOfOriginalNetworkAir:true,
  originalGeologyStillControlsEveryProposedCarve:true,
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
if(oldOwnedGeometry!==14168||compactOwnedGeometry>10000||
   removedOwnedGeometry<4168||
   chunkAudits.some(a=>a.interiorApprovedCarves!==a.interiorRequestedCarves))
 throw Error('COMPACT_RESEARCH_ORIGINAL_FIVE_BIOME_NATIVE_CENSUS_HOLD');
const report=Object.freeze({schema:'living-underworld-original-m7-five-biome-one-hub-chunk-risk-v1',
 seed,actualOriginalM7SolidSource:true,
 fullAuditElapsedMs:Math.round((performance.now()-runStarted)*1000)/1000,
 totalChunks:rows.length,sourceQueries:rows.reduce((n,r)=>n+(r.sourceHaloCells??0),0),
 sourceRejectedCarveCells:rows.reduce((n,r)=>n+(r.sourceRejectedCarveCells??0),0),
 ownedInteriorApprovedCarves:rows.reduce((n,r)=>n+(r.ownedInteriorApprovedCarves??0),0),
 haloApprovedProposals:rows.reduce((n,r)=>n+(r.haloApprovedProposals??0),0),
 haloRejectedProposals:rows.reduce((n,r)=>n+(r.haloRejectedProposals??0),0),
 coreHaloCutCountsReportedSeparately:true,
 compactOriginalNetworkGeometryProfile:UPPER_HUB_COMPACT_PROFILE.name,
 originalBaselineOwnedInteriorGeometryProposals:oldOwnedGeometry,
 compactOwnedInteriorGeometryProposals:compactOwnedGeometry,
 actuallyRemovedOwnedInteriorGeometryProposals:removedOwnedGeometry,
 strictAggregateOwnedInteriorCarveLimitStill10000:true,
 compactAlwaysSubsetOfOriginalNetworkProposal:true,
 fiveBiomeUpperHubCenterlinesAndRegionGraphPreservedResearchOnly:true,
 perChunkMaximumNewFaces:1200,
 aggregateSourceRisk:Object.freeze(aggregate),rows:Object.freeze(rows),
 allGalleryChunksCovered:false,allSupportPlacementCostsCovered:false,
 playerWalkingAndMobileGpuUnverified:true,
 originalM7ConstructorFaultSeeds8675309And13579NotRetested:true,
 noWorldEdits:true,deviceBuildUnchanged:true});
console.log(JSON.stringify(report));
if(rows.length!==5||rows.some(r=>r.sourceHaloCells!==5832))
 throw Error('Read-only M7 five-biome hub-chunk halo sample incomplete');
