// Authentic original M7 source-read-only rare cavern research, opt-in.
// 179/(2,0) and 179/(2,1) are verified ORIGINAL deterministic planner
// candidate sites, not invented cities or developer permission to build one.
// This script never places settlements, modifies caves, writes saves or PWA.
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR}
 from '../../src/manual-biomes/profile-world.mjs';
import {VoxelWorld,baseBlock} from '../../src/voxel.mjs';
import {planUnderworldRegion}
 from '../../src/living-underworld/worldwide-network.mjs';
import {proposeProtectedCityLandingTerrace}
 from '../../src/living-underworld/city-landing-terrace-proposal.mjs';
import {auditSourceProtectedCityFloorLink}
 from '../../src/living-underworld/source-protected-city-link.mjs';
import {auditSourceProtectedCityTerraceAccess}
 from '../../src/living-underworld/source-protected-city-terrace-access.mjs';
import {selectSourceProtectedInterlevelRamps}
 from '../../src/living-underworld/source-aware-ramp-selection.mjs';
const seed=179,regions=Object.freeze([[2,0],[2,1]]);
const world=new FourRegionWorld(seed,
 fourRegionProfile(seed,M7_ENVIRONMENT_GENERATOR));
const original=new VoxelWorld(seed);
const source=Object.freeze({
 naturalAt:(x,y,z)=>world.naturalAndLandmarkBlock(x,y,z),
 authoredAt:(x,y,z)=>world.environmentCaves?.get(x,y,z),
 editedAt:(x,y,z)=>world.edits.has(x+','+y+','+z),
 protectedAt:(x,y,z)=>original.naturalAndLandmarkBlock(x,y,z)!==
  baseBlock(x,y,z,seed)
});
const rows=[];
for(const [rx,rz] of regions){
 if(!planUnderworldRegion(seed,rx,rz).cityCandidate)
  throw Error('Original deterministic city-site plan changed');
 const terrace=proposeProtectedCityLandingTerrace(seed,rx,rz,{source});
 const fullPad=auditSourceProtectedCityFloorLink(seed,rx,rz,{source});
 // Only a source-checked three-link selection may request the full four-hub
 // city route flag. A partial/missing selection fails closed, not promoted.
 const deep=selectSourceProtectedInterlevelRamps(seed,rx,rz,{
  source,maxCandidatesPerLink:64,maxSourceChecks:30000,
  requireMainGalleryClearance:true
 });
 const approved=deep.ok===true&&deep.links?.length===3&&
  deep.links.every(link=>link.ok===true&&link.selected?.sourceSafe===true);
 const selected=approved?deep.links.map(link=>link.selected.proposal):[];
 const joined=auditSourceProtectedCityTerraceAccess(seed,rx,rz,{
  source,additionalStairProposals:selected,
  requireCompleteDeepLinks:true,useSourceAwareDetour:true
 });
 rows.push(Object.freeze({seed,rx,rz,
  originalM7TerrainReadOnly:true,
  terraceCandidateSourceSafe:terrace.ok===true,
  terraceRadius:terrace.radius??null,
  terraceSourceChecks:terrace.sourceChecks??0,
  terraceRefusal:terrace.reason??null,
  terraceAttempts:terrace.attempts?.map(x=>({
   radius:x.radius,ok:x.ok,reason:x.reason
  }))??[],
  existingFullPadAndAccessSourceSafe:fullPad.ok===true,
  threeDeepLinksOriginalM7SourceSelected:approved,
  threeDeepLinkSelectionRefusal:deep.ok?null:
   deep.refusal??deep.reason??'UNSPECIFIED_LINK_REFUSAL',
  threeDeepLinkCandidatesExamined:deep.inspected??0,
  threeDeepLinkOriginalM7SourceCells:deep.sourceCellsChecked??0,
  threeDeepLinkSelectedIndexList:approved?
   deep.links.map(link=>link.selected.index):[],
  joinedCityTerraceAndActualApproachSourceSafe:joined.ok===true,
  joinedRouteRefusal:joined.reason??joined.refusal??null,
  joinedSourceChecks:joined.sourceChecks??0,
  joinedTerraceRadius:joined.terraceRadius??null,
  joinedDetourSourceSafe:joined.useSourceAwareDetour===true&&joined.ok===true,
  joinedDetourRefusal:joined.detourRefusal??null,
  joinedDetourAttempted:joined.detourAttempted??joined.detourTestedCandidates??0,
  joinedFourHubCandidateTopologyApproved:joined.completeFourHubCandidateTopologyVerified===true,
  joinedFourHubSourceOwnershipApproved:joined.completeDeepLinkSourceOwnershipVerified===true,
  actuallyBuiltAndWalked:false,
  fullPadRefusal:fullPad.reason??null,
  fullPadSourceChecks:fullPad.sourceChecks??0,
  oldWorldModified:false,cityPlaced:false,
  actualPlayerWalkingUnverified:true}));
}
const report=Object.freeze({
 schema:'living-underworld-original-m7-rare-city-floor-and-terrace-v1',
 seed,rows:Object.freeze(rows),
 originalSourceReaderAuthentic:true,
 seedConstructorFaults8675309And13579NotRetested:true,
 oldM7CavesUnchanged:true,noSettlementsPlaced:true,
 realDeviceWalkingAndGpuUnverified:true,noReleaseApproval:true
});
console.log(JSON.stringify(report));
