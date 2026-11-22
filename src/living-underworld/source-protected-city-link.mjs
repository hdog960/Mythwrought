// Phase 8 opt-in source-backed city-floor ACCESS preflight ONLY.
// Evaluates a proposed route to a detached pad; does not place a city, slab,
// tunnel, staircase, gameplay entity, save data, or even a chunk edit.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {auditFullCityCandidate} from './city-full-floor-audit.mjs';
import {auditCityAccessRamp} from './city-access-proposal.mjs';
import {compileMainGalleryPedestrianClearance}
 from './combined-stair-footprints.mjs';
import {auditProtectedSubsurfaceStairs}
 from './protected-subsurface-stairs.mjs';
import {auditOriginalCityFloorProvenance}
 from './original-city-floor-provenance.mjs';
const INT=Number.isSafeInteger;
const FIELDS=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
export function auditSourceProtectedCityFloorLink(seed,rx,rz,{
 source,maxCells=20000,maxColumns=40000
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !source||typeof source!=='object'||
  FIELDS.some(k=>typeof source[k]!=='function')||
  !INT(maxCells)||maxCells<100||maxCells>20000||
  !INT(maxColumns)||maxColumns<1||maxColumns>40000)
  throw TypeError('Invalid source-protected city link preflight');
 const region=planUnderworldRegion(seed,rx,rz);
 if(!region.cityCandidate)return Object.freeze({sitePresent:false,
  seed,rx,rz,noWorldEdits:true});
 const plateau=auditFullCityCandidate(seed,rx,rz,{maxColumns});
 if(!plateau.ok)return Object.freeze({sitePresent:true,ok:false,
  reason:'DETACHED_CITY_FLOOR_UNSAFE',floorReason:plateau.reason??null,
  noWorldEdits:true});
 const candidate=auditCityAccessRamp(seed,rx,rz);
 if(candidate.ok!==true||!candidate.hub||!candidate.landing)
  return Object.freeze({sitePresent:true,ok:false,
   reason:'DETACHED_CITY_ACCESS_UNSAFE',
   accessReasons:candidate.reasons??[],noWorldEdits:true});
 // Never silently derive a different approach or assert a preexisting pad.
 const p=Object.freeze({ok:true,segments:Object.freeze([
  Object.freeze({a:candidate.hub,b:candidate.landing})
 ])});
 const index=compileMainGalleryPedestrianClearance(seed,rx,rz);
 if(!index.ok)return Object.freeze({sitePresent:true,ok:false,
  reason:index.reason,noWorldEdits:true});
 const gallery=index.inspect(p);
 if(!gallery.ok)return Object.freeze({sitePresent:true,ok:false,
  reason:'CITY_LINK_BLOCKS_MAIN_GALLERY',blockedCells:gallery.blockedCells??null,
  noWorldEdits:true});
 const original=auditProtectedSubsurfaceStairs(p,{
  naturalAt:source.naturalAt,authoredAt:source.authoredAt,
  editedAt:source.editedAt,protectedAt:source.protectedAt,
  minY:-210,maxY:19,maxCells,stopOnFirstUnsafe:true
 });
 if(!original.ok)return Object.freeze({sitePresent:true,ok:false,
  reason:'CITY_LINK_ORIGINAL_M7_SOURCE_UNSAFE',
  seed,rx,rz,sourceChecks:original.sourceChecks??0,
  sourceRefusal:original.firstRefusal??original.reason??null,
  sourceExamples:original.examples??[],
  candidateRampOnly:true,cityFloorSourceApproved:false,
  noWorldEdits:true,settlementsPlaced:false});
 // An apparently supported detached floor cannot be accepted until every
 // original M7 pad support/headroom voxel is source-owned and safely cuttable.
 const floor=auditOriginalCityFloorProvenance(seed,rx,rz,{
  source,maxColumns:25000,maxSourceChecks:150000
 });
 const sourceChecks=(original.sourceChecks??0)+(floor.sourceChecks??0);
 return Object.freeze({sitePresent:true,ok:floor.ok===true,
  reason:floor.ok?null:'CITY_PAD_ORIGINAL_M7_SOURCE_UNSAFE',
  seed,rx,rz,sourceChecks,
  rampSourceChecks:original.sourceChecks??0,
  floorSourceChecks:floor.sourceChecks??0,
  floorSourceRefusal:floor.firstRefusal??floor.reason??null,
  floorFirstRejectedCell:floor.firstRejectedCell??null,
  floorSourceColumns:floor.columns??null,
  detachedPlateauFullyAudited:true,
  detachedRampGeometryAndAirAudited:true,
  galleryInterferenceSafe:true,
  sourceOwnedFloorAndAirPreflightPassed:floor.ok===true,
  builtCityFloorVerified:false,
  linkedToAllDeepAndSurfaceRoutes:false,
  originalM7PlayerWalkingVerified:false,
  nativeGpuAndDeviceUnverified:true,
  noWorldEdits:true,settlementsPlaced:false});
}
