// Strict opt-in, read-only orchestration. Legacy entrance search and original
// route optimizers remain byte-identical and unaffected until explicitly used.
// A proposal never grants permission to carve live M7 or register a world.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {auditSourceProtectedMainGalleries}
 from './main-gallery-source-survey.mjs';
import {auditProtectedUnderworldWalkingChain}
 from './protected-walking-chain.mjs';
import {auditSourceProtectedCityFloorLink}
 from './source-protected-city-link.mjs';
const INT=Number.isSafeInteger;
const FIELDS=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
export function auditSourceProvenUnderworldAccess(seed,rx,rz,{
 entrance,source,requireCityAccess=false,maxOverallSourceChecks=120000
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !entrance||typeof entrance!=='object'||
  !source||typeof source!=='object'||
  FIELDS.some(k=>typeof source[k]!=='function')||
  typeof requireCityAccess!=='boolean'||
  !INT(maxOverallSourceChecks)||maxOverallSourceChecks<1000||
  maxOverallSourceChecks>500000)
  throw TypeError('Invalid source-proven Underworld access preflight');
 const galleries=auditSourceProtectedMainGalleries(seed,rx,rz,{source});
 if(!galleries.ok)return Object.freeze({ok:false,seed,rx,rz,
  reason:'ORIGINAL_HORIZONTALS_UNSAFE',galleries,
  checkedOriginalSourceCells:galleries.sourceChecks??0,
  surfaceAndDeepStairsInspected:false,worldChanged:false});
 const chain=auditProtectedUnderworldWalkingChain(seed,rx,rz,{entrance,source});
 let sourceCells=galleries.sourceChecks+(chain.originalM7SourceChecks??0);
 if(sourceCells>maxOverallSourceChecks)return Object.freeze({
  ok:false,reason:'WHOLE_NETWORK_SOURCE_BUDGET',seed,rx,rz,
  sourceCells,maxOverallSourceChecks,worldChanged:false});
 if(!chain.ok)return Object.freeze({ok:false,seed,rx,rz,
  reason:'SURFACE_TO_DEEP_CHAIN_UNSAFE',
  chainReason:chain.reason,chain,galleries,
  checkedOriginalSourceCells:sourceCells,worldChanged:false});
 const site=planUnderworldRegion(seed,rx,rz).cityCandidate;
 let city=null;
 if(requireCityAccess){
  if(!site)return Object.freeze({ok:false,seed,rx,rz,
   reason:'NO_RARE_CITY_FLOOR_IN_REGION',
   checkedOriginalSourceCells:sourceCells,worldChanged:false});
  city=auditSourceProtectedCityFloorLink(seed,rx,rz,{source});
  sourceCells+=city.sourceChecks??0;
  if(sourceCells>maxOverallSourceChecks)return Object.freeze({
   ok:false,reason:'WHOLE_NETWORK_SOURCE_BUDGET',seed,rx,rz,
   sourceCells,maxOverallSourceChecks,worldChanged:false});
  if(!city.ok)return Object.freeze({ok:false,seed,rx,rz,
   reason:'CITY_LINK_SOURCE_OR_GEOMETRY_UNSAFE',city,
   checkedOriginalSourceCells:sourceCells,worldChanged:false});
 }
 return Object.freeze({ok:true,seed,rx,rz,
  checkedOriginalSourceCells:sourceCells,
  original16GalleriesSourceApproved:true,
  original120GalleryPairsMutuallySafe:true,
  allFourSurfaceToLowestRouteComponentsProposedSafe:true,
  cityAccessRequested:requireCityAccess,
  candidateCityLinkIndividuallySafe:city?.ok??null,
  cityToDeepStairsMutualClearanceUnverified:requireCityAccess,
  originalM7SourceReaderIdentityVerifiedByCallerOnly:true,
  actuallyPlacedStairBlocks:false,
  originalWorldEdited:false,worldChanged:false,
  originalPlayerWalkingUnverified:true,
  originalIphoneGpuUnverified:true});
}
