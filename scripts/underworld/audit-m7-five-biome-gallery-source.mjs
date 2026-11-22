// Read-only original M7 five-biome mutual gallery and provenance audit.
// Do NOT reinterpret historical real-source test failures as pass.
// No cave carving, saves, renderer, settlements, workflows or PWA writes.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {VoxelWorld,baseBlock}
 from '../../src/voxel.mjs';
import {auditMutualMainGalleryClearance}
 from '../../src/living-underworld/main-gallery-mutual-clearance.mjs';
import {auditSourceProtectedMainGalleries}
 from '../../src/living-underworld/main-gallery-source-survey.mjs';
import {auditOriginalMainGalleryVoxelReadiness}
 from '../../src/living-underworld/combined-stair-footprints.mjs';
const seed=179;
const sites=Object.freeze([
 Object.freeze({biome:'plains',rx:-9,rz:0}),
 Object.freeze({biome:'desert',rx:-3,rz:-9}),
 Object.freeze({biome:'snow',rx:-6,rz:3}),
 Object.freeze({biome:'mountain',rx:6,rz:9}),
 Object.freeze({biome:'enchanted',rx:-9,rz:-6})
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
 const mutual=auditMutualMainGalleryClearance(seed,site.rx,site.rz);
 const full=auditSourceProtectedMainGalleries(seed,site.rx,site.rz,{source});
 const existing=auditOriginalMainGalleryVoxelReadiness(seed,site.rx,site.rz,{
  materialAt:source.naturalAt,editedAt:source.editedAt
 });
 rows.push(Object.freeze({...site,seed,
  oldM7AsBuiltGalleryDeckAndAirPresent:existing.ok===true,
  oldM7AsBuiltBlockedHeadroomCells:existing.blockedHeadroom??null,
  oldM7AsBuiltMissingSupportCells:existing.unsupportedDeck??null,
  oldM7AsBuiltEditedCells:existing.editedCells??null,
  oldM7AsBuiltSourceCells:existing.sampledCells??null,
  originalGalleryVoxelWalkabilityStillRequiresPlayerPhysics:true,
  mutuallySafe:mutual.ok,checkedPairs:mutual.examined,
  collidingPairs:mutual.conflictingPairs??null,
  sourceSafe:full.ok,galleriesInspected:full.galleriesInspected,
  inspectedSourceCells:full.sourceChecks,
  firstRefusal:full.failures?.[0]??full.reason??null,
  originalWorldEdited:false,realPlayerWalkingUnverified:true}));
}
const report=Object.freeze({schema:'living-underworld-authentic-m7-five-biome-gallery-provenance-v1',
 readOnlyOriginalM7:true,seed,regions:rows.length,
 mutualPairs:rows.reduce((n,r)=>n+(r.checkedPairs??0),0),
 sourceSafeRegions:rows.filter(x=>x.sourceSafe).length,
 asBuiltGalleryRegions:rows.filter(x=>x.oldM7AsBuiltGalleryDeckAndAirPresent).length,
 sourceRefusals:rows.filter(x=>!x.sourceSafe).length,
 sourceCells:rows.reduce((n,r)=>n+(r.inspectedSourceCells??0),0),
 rows:Object.freeze(rows),
 originalM7SeedConstructorFaults8675309And13579NotRetested:true,
 liveGameWalkingUnverified:true,iphoneGpuUnverified:true,
 caveAuthoringUnmodified:true,worldEdited:false,noReleaseApproval:true});
console.log(JSON.stringify(report));
if(rows.length!==5||rows.some(row=>row.checkedPairs!==120))
 throw Error('M7 five-biome original geometry coverage incomplete');
// A source conflict is an evidence-backed refusal, NOT a script crash.
// Keep the report and leave exact historical constructor failures untouched.
