// Living Underworld: detached, read-only mutual clearance of all 16 MAIN galleries.
// Uses the existing original three-wide stair footprint comparison rather than
// another independently maintained geometry raster. No voxel or save writes.
import {planUnderworldRegion} from './worldwide-network.mjs';
import {auditCombinedStairFootprints} from './combined-stair-footprints.mjs';

const PAIRS=Object.freeze([0,2,4,6,8,10,12,14,17,19,21,23,26,28,30,32]);
const INT=Number.isSafeInteger;
export function auditMutualMainGalleryClearance(seed,rx,rz,{
 maxPairs=120,maxCells=2500000,maxExamples=12,
 pairAuditor=auditCombinedStairFootprints
}={}){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
  !INT(maxPairs)||maxPairs<1||maxPairs>120||
  !INT(maxCells)||maxCells<100||maxCells>10000000||
  !INT(maxExamples)||maxExamples<1||maxExamples>30||
  typeof pairAuditor!=='function')
  throw TypeError('Invalid mutual main gallery clearance audit');
 const region=planUnderworldRegion(seed,rx,rz);
 const galleries=PAIRS.map(index=>Object.freeze({ok:true,
  segments:Object.freeze([region.capsules[index],region.capsules[index+1]])}));
 let examined=0,examinedCells=0,conflictingPairs=0,blockedCells=0;
 const conflicts=[];
 for(let i=0;i<galleries.length;i++)for(let j=i+1;j<galleries.length;j++){
  if(examined>=maxPairs)return Object.freeze({ok:false,
   reason:'MUTUAL_GALLERY_PAIR_BUDGET',examined,requiredPairs:120,
   examinedCells,conflictingPairs,blockedCells,
   conflicts:Object.freeze(conflicts),worldChanged:false});
  const result=pairAuditor([galleries[i],galleries[j]],{
   maxCells:100000,maxExamples:Math.min(24,maxExamples)
  });
  examined++;
  if(!result||typeof result!=='object'||
   typeof result.ok!=='boolean'||
   (result.rawCells!==undefined&&(!INT(result.rawCells)||result.rawCells<0))||
   (result.ok&&result.rawCells===undefined))return Object.freeze({ok:false,
    reason:'INVALID_PAIR_AUDIT_RESULT',examined,pair:[PAIRS[i],PAIRS[j]],
    worldChanged:false});
  if(!result.ok&&result.rawCells===undefined)return Object.freeze({
   ok:false,reason:result.reason??'PAIR_GRADE_UNSAFE',
   examined,pair:[PAIRS[i],PAIRS[j]],
   failures:result.failures??[],worldChanged:false
  });
  examinedCells+=result.rawCells;
  if(examinedCells>maxCells)return Object.freeze({ok:false,
   reason:'MUTUAL_GALLERY_CELL_BUDGET',examined,examinedCells,
   maxCells,worldChanged:false});
  if(!result.ok){
   conflictingPairs++;blockedCells+=result.crossRouteBlockedCells??0;
   if(conflicts.length<maxExamples)conflicts.push(Object.freeze({
    firstGalleryIndex:PAIRS[i],secondGalleryIndex:PAIRS[j],
    reason:result.reason??'UNKNOWN_GALLERY_COLLISION',
    blockedCells:result.crossRouteBlockedCells??null,
    examples:Object.freeze((result.examples??[]).slice(0,3))
   }));
  }
 }
 return Object.freeze({ok:conflictingPairs===0,
  reason:conflictingPairs?'MUTUAL_GALLERY_SUPPORT_HEADROOM_COLLISION':null,
  seed,rx,rz,mainGalleries:16,examined,requiredPairs:120,
  examinedCells,conflictingPairs,blockedCells,
  conflicts:Object.freeze(conflicts),
  fullPairwiseCoverage:true,originalSourceVoxelOwnershipUnverified:true,
  originalM7PlayerWalkingUnverified:true,worldChanged:false,
  stepsActuallyPlaced:false});
}
