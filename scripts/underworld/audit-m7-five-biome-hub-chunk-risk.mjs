// Five authentic M7 SOURCE callbacks, one bounded 16^3 halo-aware upper-hub
// chunk per previously established biome region. This is a RISK estimate,
// NOT authorization for network carving, support placement or GPU acceptance.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {BLOCK} from '../../src/voxel.mjs';
import {planUnderworldRegion,networkAirAt}
 from '../../src/living-underworld/worldwide-network.mjs';
import {auditProposedChunkCarveDelta}
 from '../../src/living-underworld/chunk-carve-projection.mjs';
const seed=179,sites=Object.freeze([
 Object.freeze({biome:'plains',rx:-9,rz:0}),
 Object.freeze({biome:'desert',rx:-3,rz:-9}),
 Object.freeze({biome:'snow',rx:-6,rz:3}),
 Object.freeze({biome:'mountain',rx:6,rz:9}),
 Object.freeze({biome:'enchanted',rx:-9,rz:-6})
]);
const original=new FourRegionWorld(seed,fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const rows=[];
for(const site of sites){
 const hub=planUnderworldRegion(seed,site.rx,site.rz).layers[0].hub;
 const origin=Object.freeze({x:Math.floor(hub.x/16)*16,
  y:Math.floor(hub.y/16)*16,z:Math.floor(hub.z/16)*16});
 const audit=auditProposedChunkCarveDelta({origin,side:16,
  isSolidAt:(x,y,z)=>original.naturalAndLandmarkBlock(x,y,z)!==BLOCK.AIR,
  candidateAirAt:(x,y,z)=>networkAirAt(seed,x,y,z),
  maxFaceGrowth:1200,maxCells:6000});
 rows.push(Object.freeze({...site,origin,ok:audit.ok,
  sourceHaloCells:audit.originalSourceQueries??null,
  projectedCarvedCells:audit.newlyCarvedSolidCells??null,
  oldExposedFaces:audit.baselineFaces??null,
  candidateExposedFaces:audit.projectedFaces??null,
  addedExposedFaces:audit.exposedFaceGrowth??null,
  budgetReason:audit.reason??null,
  noNativeGpuBufferCreated:true,oldWorldUnmodified:true}));
}
const report=Object.freeze({schema:'living-underworld-original-m7-five-biome-one-hub-chunk-risk-v1',
 seed,actualOriginalM7SolidSource:true,
 totalChunks:rows.length,sourceQueries:rows.reduce((n,r)=>n+(r.sourceHaloCells??0),0),
 perChunkMaximumNewFaces:1200,rows:Object.freeze(rows),
 allGalleryChunksCovered:false,allSupportPlacementCostsCovered:false,
 playerWalkingAndMobileGpuUnverified:true,
 originalM7ConstructorFaultSeeds8675309And13579NotRetested:true,
 noWorldEdits:true,deviceBuildUnchanged:true});
console.log(JSON.stringify(report));
if(rows.length!==5||rows.some(r=>r.sourceHaloCells!==5832))
 throw Error('Read-only M7 five-biome hub-chunk halo sample incomplete');
