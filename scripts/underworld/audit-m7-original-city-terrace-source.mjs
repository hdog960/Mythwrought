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
import {selectCityCompatibleDeepLinks}
 from '../../src/living-underworld/source-aware-city-deep-selection.mjs';
import {auditSourceProtectedGalleryEasementDistrict}
 from '../../src/living-underworld/city-gallery-easement-district.mjs';
import {surveyCityGalleryFloorCutsets}
 from '../../src/living-underworld/city-gallery-floor-cutset-survey.mjs';
import {auditSourceProtectedCityUnderpass}
 from '../../src/living-underworld/city-gallery-grade-separated-underpass.mjs';
const runStarted=performance.now();
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
 const siteStarted=performance.now();
 if(!planUnderworldRegion(seed,rx,rz).cityCandidate)
  throw Error('Original deterministic city-site plan changed');
 // The new bounded city-aware optimizer invokes the COMPLETE original-source
 // route and terrace validator. Reuse its final proof; do not query M7 again
 // for the same selected three-deep-link + joined terrace route.
 const deep=selectCityCompatibleDeepLinks(seed,rx,rz,{
  source,maxCandidatesPerLink:64,maxSuitablePerLink:8,
  maxCombinations:160,maxTotalSourceChecks:60000,minTerraceRadius:8
 });
 const approved=deep.ok===true&&deep.chosen?.length===3&&deep.joined?.ok===true;
 const joined=approved?deep.joined:
  Object.freeze({ok:false,reason:deep.reason??'NO_SOURCE_SAFE_CITY_NETWORK',
   sourceChecks:deep.sourceChecks??0});
 // Independent fallback diagnostics ONLY on refusal. On success the joined
 // source survey already checked every candidate terrace footprint cell.
 const terrace=approved?null:
  proposeProtectedCityLandingTerrace(seed,rx,rz,{source});
 const cutset=surveyCityGalleryFloorCutsets(seed,rx,rz);
 const fullPad=auditSourceProtectedCityFloorLink(seed,rx,rz,{source});
 // The historically proposed WHOLE ellipse remains a separate HARD veto.
 // This is only an optional connected, three-wide LANDING QUARTER, checked
 // after the true deep source-owner + city access route proof. Never substitute
 // a safe quarter for a rejected whole-city floor or claim a settlement.
 const districtStarted=performance.now();
 const district=approved?auditSourceProtectedGalleryEasementDistrict(
  seed,rx,rz,{source,sourceOwnedDeepSelection:deep,
   maxTotalSourceChecks:150000,marginCells:1,maxDistrictColumns:10000}
 ):Object.freeze({ok:false,
  reason:'FOUR_HUB_ORIGINAL_SOURCE_PROOF_REQUIRED',
  sourceChecks:deep.sourceChecks??0,worldChanged:false});
 // Separate THIN-DECK underpass option, with independently checked 3x3
 // full-depth landing near the center. NEVER permit its success to waive
 // the historical full-ellipse source/geometry refusal.
 const underpassStarted=performance.now();
 const underpass=approved?auditSourceProtectedCityUnderpass(
  seed,rx,rz,{source,sourceOwnedDeepSelection:deep,
   maxTotalSourceChecks:150000}
 ):Object.freeze({ok:false,
  reason:'FOUR_HUB_ORIGINAL_SOURCE_PROOF_REQUIRED',
  sourceChecks:deep.sourceChecks??0,worldChanged:false});
 rows.push(Object.freeze({seed,rx,rz,
  regionAuditElapsedMs:Math.round((performance.now()-siteStarted)*1000)/1000,
  originalM7TerrainReadOnly:true,
  terraceCandidateSourceSafe:approved||terrace?.ok===true,
  terraceRadius:approved?joined.terraceRadius:terrace?.radius??null,
  terraceSourceAuditedInJoinedProof:approved,
  terraceSourceChecks:terrace?.sourceChecks??0,
  terraceRefusal:terrace?.reason??null,
  terraceAttempts:terrace?.attempts?.map(x=>({
   radius:x.radius,ok:x.ok,reason:x.reason
  }))??[],
  existingFullPadAndAccessSourceSafe:fullPad.ok===true,
  candidateThinUnderpassOriginalSourceSafe:underpass.ok===true,
  candidateThinUnderpassRefusal:underpass.reason??null,
  candidateThinUnderpassFirstRefusal:underpass.firstRefusal??null,
  candidateThinUnderpassFirstRejectedCell:
   underpass.firstRejectedCell??null,
  candidateThinUnderpassElapsedMs:
   Math.round((performance.now()-underpassStarted)*1000)/1000,
  candidateThinUnderpassPivot:underpass.pivot??null,
  candidateThinUnderpassSegments:underpass.segments??null,
  candidateThinUnderpassSourceVisits:underpass.underpassSourceVisits??0,
  candidateThinUnderpassCenterLanding:underpass.centerSidePad??null,
  candidateThinUnderpassCenterLandingSourceVisits:
   underpass.centerPadSourceVisits??0,
  candidateThinUnderpassCenterLandingSolidSupport:
   underpass.centerPadSolidSupports??null,
  candidateThinUnderpassTotalSourceVisits:underpass.sourceChecks??null,
  candidateThinUnderpassFourHubSourceVisitsCountedOnce:
   underpass.originalFourHubSourceChecks??deep.sourceChecks??0,
  candidateThinUnderpassAlternativeNotReplacementForFullCityFloor:true,
  candidateThinUnderpassNoPlayerWalkingOrGpuVerified:true,
  wholeCityEllipseGalleryCutsetAudited:cutset.ok===true,
  wholeCityEllipsePlannedColumns:cutset.totalColumns??null,
  wholeCityEllipseBlockedByMainGalleries:cutset.blockedColumns??null,
  wholeCityEllipseSafeComponents:cutset.potentialConnectedComponents??null,
  wholeCityLandingComponentColumns:cutset.landingComponentColumns??null,
  wholeCityCenterComponentColumns:cutset.cityCenterComponentColumns??null,
  wholeCityLandingAndCenterSameElevationConnected:
   cutset.landingAndCityCenterOnSameClearFloorComponent===true,
  wholeCityPlanarCutsetOriginalM7GeologyNotRead:true,
  existingFullCityPadRefusalStillMandatory:fullPad.ok!==true,
  candidateThreeWideLandingDistrictSourceSafe:district.ok===true,
  candidateDistrictRefusal:district.reason??null,
  candidateDistrictOriginalSourceRefusal:district.sourceRefusal??null,
  candidateDistrictFirstRejectedCell:district.firstRejectedCell??null,
  candidateDistrictAuditElapsedMs:
   Math.round((performance.now()-districtStarted)*1000)/1000,
  candidateDistrictCenterTileCount:district.centerTileCount??null,
  candidateDistrictColumns:district.columns??null,
  candidateDistrictMarginCells:district.marginCells??1,
  candidateDistrictFloorSourceChecks:district.floorSourceChecks??0,
  candidateDistrictOriginalReaderMethodCalls:
   district.districtActualOriginalReaderMethodCalls??null,
  candidateDistrictOriginalReaderCallsByRole:
   district.districtActualOriginalReaderCallsByRole??null,
  candidateDistrictTotalOriginalSourceChecks:
   district.sourceChecks??null,
  candidateDistrictDeepSourceChecksAlreadyCountedInJoined:
   district.originalFourHubSourceChecks??deep.sourceChecks??0,
  candidateDistrictNotWholeFloorOrSettlement:true,
  candidateDistrictExistingM7WalkingAndGpuUnverified:true,
  threeDeepLinksOriginalM7SourceSelected:approved,
  threeDeepLinkSelectionRefusal:approved?null:
   deep.reason??'UNSPECIFIED_LINK_REFUSAL',
  threeDeepLinkCandidatesExamined:deep.examined?.reduce((n,x)=>n+x.attempted,0)??0,
  fullNetworkCombinationsInspected:deep.inspectedCombinations??0,
  fullJoinedCandidateOriginalM7SourceChecks:deep.sourceChecks??0,
  deepLinkOnlySourceChecksNotSeparatelyMeasured:true,
  threeDeepLinkSelectedIndexList:approved?
   deep.chosen.map(link=>link.index):[],
  selectedDeepLinkConfigurations:approved?deep.chosen:[],
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
 fullAuditElapsedMs:Math.round((performance.now()-runStarted)*1000)/1000,
 originalSourceReaderAuthentic:true,
 seedConstructorFaults8675309And13579NotRetested:true,
 oldM7CavesUnchanged:true,noSettlementsPlaced:true,
 realDeviceWalkingAndGpuUnverified:true,noReleaseApproval:true
});
console.log(JSON.stringify(report));
