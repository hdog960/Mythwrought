// Source-protected, opt-in read-only census of the ORIGINAL planned 16
// horizontal gallery stair decks. An AIR cut needs owned natural geology;
// placing support must never seal original authored/natural cave AIR.
// A positive candidate result is NOT original-M7 player walkability.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {auditMutualMainGalleryClearance} from './main-gallery-mutual-clearance.mjs';
import {auditProtectedSubsurfaceStairs} from './protected-subsurface-stairs.mjs';
const INT=Number.isSafeInteger;
const PAIRS=Object.freeze([0,2,4,6,8,10,12,14,17,19,21,23,26,28,30,32]);
const FIELDS=Object.freeze(['naturalAt','authoredAt','editedAt','protectedAt']);
export function auditSourceProtectedMainGalleries(seed,rx,rz,{
 source,maxTotalSourceChecks=60000,maxCellsPerGallery=20000,
 maxFailureExamples=8
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !source||typeof source!=='object'||
  FIELDS.some(k=>typeof source[k]!=='function')||
  !INT(maxTotalSourceChecks)||maxTotalSourceChecks<100||maxTotalSourceChecks>200000||
  !INT(maxCellsPerGallery)||maxCellsPerGallery<100||maxCellsPerGallery>20000||
  !INT(maxFailureExamples)||maxFailureExamples<1||maxFailureExamples>16)
  throw TypeError('Invalid source-protected gallery survey');
 const mutual=auditMutualMainGalleryClearance(seed,rx,rz);
 if(!mutual.ok)return Object.freeze({ok:false,seed,rx,rz,
  reason:'MUTUAL_GALLERY_GEOMETRY_UNSAFE',mutual,
  galleriesInspected:0,sourceChecks:0,worldChanged:false});
 const plan=planUnderworldRegion(seed,rx,rz);
 const rows=[],failures=[];let sourceChecks=0;
 for(const index of PAIRS){
  const proposal=Object.freeze({ok:true,segments:Object.freeze([
   plan.capsules[index],plan.capsules[index+1]
  ])});
  // The ORIGINAL immutable fixed geology allowlist cannot be widened by a
  // caller. The original validator sees all three height levels of headroom.
  const checked=auditProtectedSubsurfaceStairs(proposal,{
   naturalAt:source.naturalAt,authoredAt:source.authoredAt,
   editedAt:source.editedAt,protectedAt:source.protectedAt,
   minY:-210,maxY:19,maxCells:maxCellsPerGallery,
   stopOnFirstUnsafe:true
  });
  sourceChecks+=checked.sourceChecks??0;
  if(sourceChecks>maxTotalSourceChecks)return Object.freeze({
   ok:false,seed,rx,rz,reason:'SOURCE_GALLERY_TOTAL_BUDGET',
   galleriesInspected:rows.length+1,sourceChecks,maxTotalSourceChecks,
   worldChanged:false});
  rows.push(Object.freeze({galleryIndex:index,ok:checked.ok,
   sourceChecks:checked.sourceChecks??0,
   refusal:checked.firstRefusal??checked.reason??null,
   rejectedSourceCounts:checked.counts??null,
   examples:checked.examples??[]}));
  if(!checked.ok){
   if(failures.length<maxFailureExamples)failures.push(Object.freeze({
    galleryIndex:index,reason:checked.firstRefusal??checked.reason,
    examples:checked.examples??[]
   }));
   // Refusal is conclusive. Don't continue into 15 more expensive M7 queries.
   return Object.freeze({ok:false,seed,rx,rz,
    reason:'GALLERY_SOURCE_PROVENANCE_UNSAFE',
    galleriesInspected:rows.length,sourceChecks,
    failures:Object.freeze(failures),rows:Object.freeze(rows),
    mutuallyCollisionFree:true,worldChanged:false,
    nativePlayerWalkingVerified:false});
  }
 }
 return Object.freeze({ok:true,seed,rx,rz,
  galleriesInspected:16,sourceChecks,
  rows:Object.freeze(rows),failures:Object.freeze([]),
  mutuallyCollisionFree:true,allGallerySupportAndHeadroomSourceSafe:true,
  sourceReaderIdentityVerifiedByCallerOnly:true,
  actualWorldNotCarved:true,worldChanged:false,
  actualPlayerWalkingVerified:false,iPhoneGpuVerified:false});
}
