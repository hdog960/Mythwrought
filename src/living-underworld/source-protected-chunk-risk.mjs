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
   if(refusal){unsafeCarves++;counts[refusal]++;
    if(examples.length<maxExamples)examples.push(Object.freeze({x,y,z,refusal}));
    return false;
   }
   approvedCarves++;return true;
  }});
 const ok=projected.ok===true&&unsafeCarves===0;
 return Object.freeze({ok,reason:unsafeCarves?'ORIGINAL_M7_CARVE_SOURCE_UNSAFE':
  projected.reason??null,origin:Object.freeze({...origin}),side,
  plannedCarves,unsafeCarves,approvedCarves,
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
