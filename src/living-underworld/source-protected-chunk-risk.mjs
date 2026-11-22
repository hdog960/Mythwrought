// Read-only original-M7 carve risk, with explicit old-ore/authoring protection.
// Never treats a rejected requested cut as a safe projected cave geometry.
import {auditProposedChunkCarveDelta} from './chunk-carve-projection.mjs';
import {isCandidateGeologyMaterial} from './protected-entrance-envelope.mjs';
const INT=Number.isSafeInteger;
const ROLES=['naturalAt','authoredAt','editedAt','protectedAt'];
export function auditSourceProtectedChunkRisk({origin,source,candidateAirAt,
 side=16,maxCells=20000,maxFaceGrowth=1200,maxExamples=8}={}){
 if(!origin||!['x','y','z'].every(k=>INT(origin[k]))||
  !source||typeof source!=='object'||ROLES.some(k=>typeof source[k]!=='function')||
  typeof candidateAirAt!=='function'||!INT(maxExamples)||maxExamples<1||maxExamples>20)
  throw TypeError('Invalid source-protected chunk risk');
 const snapshot=new Map(),key=(x,y,z)=>x+','+y+','+z;
 let plannedCarves=0,unsafeCarves=0,approvedCarves=0;
 // The one-cell halo is inspected for safe mesh boundary faces, but it is
 // NOT part of this chunk's excavated 16^3 ownership. Keep BOTH counts.
 let interiorRequestedCarves=0,interiorApprovedCarves=0,interiorRejectedCarves=0;
 let haloRequestedCarves=0,haloApprovedCarves=0,haloRejectedCarves=0;
 const interior=(x,y,z)=>x>=origin.x&&x<origin.x+side&&
  y>=origin.y&&y<origin.y+side&&z>=origin.z&&z<origin.z+side;
 const counts={oreOrUnsafe:0,authoredSolid:0,authoredAirMismatch:0,
  originalEdit:0,landmark:0},examples=[];
 const projected=auditProposedChunkCarveDelta({origin,side,maxCells,maxFaceGrowth,
  isSolidAt:(x,y,z)=>{
   const block=source.naturalAt(x,y,z);
   if(!INT(block)||block<0)throw TypeError('Invalid original material source');
   snapshot.set(key(x,y,z),block);
   return block!==0;
  },
  candidateAirAt:(x,y,z)=>{
   const wantsAir=candidateAirAt(x,y,z);
   if(typeof wantsAir!=='boolean')throw TypeError('Nonboolean original M7 carve request');
   if(!wantsAir)return false;
   plannedCarves++;
   const inChunk=interior(x,y,z);
   if(inChunk)interiorRequestedCarves++;
   else haloRequestedCarves++;
   const block=snapshot.get(key(x,y,z));
   let refusal=null;
   const edited=source.editedAt(x,y,z);
   if(typeof edited!=='boolean')throw TypeError('Nonboolean original M7 edit source');
   if(edited)refusal='originalEdit';
   else{
    const authored=source.authoredAt(x,y,z);
    if(authored!==undefined&&(!INT(authored)||authored<0||authored!==0))
     refusal='authoredSolid';
    else{
     const protectedOriginal=source.protectedAt(x,y,z);
     if(typeof protectedOriginal!=='boolean')throw TypeError('Nonboolean original M7 landmark source');
     if(protectedOriginal)refusal='landmark';
     else if(!isCandidateGeologyMaterial(block))refusal='oreOrUnsafe';
     else if(authored===0&&block!==0)refusal='authoredAirMismatch';
    }
   }
   if(refusal){unsafeCarves++;
    if(inChunk)interiorRejectedCarves++;
    else haloRejectedCarves++;
    counts[refusal]++;
    if(examples.length<maxExamples)examples.push(Object.freeze({x,y,z,refusal}));
    return false;
   }
   approvedCarves++;
   if(inChunk)interiorApprovedCarves++;
   else haloApprovedCarves++;
   return true;
  }});
 // The ORIGINAL binary projection counts actual core-cell carving only.
 // Fail closed if our independent core-cell census ever diverges.
 if(Number.isSafeInteger(projected.newlyCarvedSolidCells)&&
  projected.newlyCarvedSolidCells!==interiorApprovedCarves)
  throw Error('Original chunk projection and protected core-cut census diverged');
 const ok=projected.ok===true&&unsafeCarves===0;
 return Object.freeze({ok,reason:unsafeCarves?'ORIGINAL_M7_CARVE_SOURCE_UNSAFE':
  projected.reason??null,origin:Object.freeze({...origin}),side,
  plannedCarves,unsafeCarves,approvedCarves,
  interiorRequestedCarves,interiorApprovedCarves,interiorRejectedCarves,
  haloRequestedCarves,haloApprovedCarves,haloRejectedCarves,
  interiorCutCountMatchesOriginalProjection:
   Number.isSafeInteger(projected.newlyCarvedSolidCells)?
    projected.newlyCarvedSolidCells===interiorApprovedCarves:false,
  proposedHaloSourceProtectionNotWritten:true,
  counts:Object.freeze(counts),examples:Object.freeze(examples),
  sourceHaloCells:projected.originalSourceQueries??0,
  baselineFaces:projected.baselineFaces??null,
  approvedOnlyProjectedFaces:projected.projectedFaces??null,
  approvedOnlyFaceGrowth:projected.exposedFaceGrowth??null,
  maxFaceGrowth,originalWorldUntouched:true,
  fullProposalRiskApproved:ok,originalM7ReaderIdentityVerifiedByCallerOnly:true,
  supportPlacementNotModeled:true,actualGPUUnverified:true,
  playerCollisionUnverified:true});
}
