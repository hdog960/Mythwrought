// Pure, bounded alternate-gallery research. Never bypass a protected source,
// edit or ore: a corridor is a candidate ONLY if the SAME strict full-volume
// envelope check, geometric air continuity and supported-stair test all pass.
// It does not mutate M7 terrain or install the candidate into a world.
import {planUnderworldSurfaceEntrance} from './surface-entrance-proposal.mjs';
import {auditProtectedEntranceEnvelope} from './protected-entrance-envelope.mjs';
import {auditProposedSurfaceConnection} from './physical-connectivity-audit.mjs';
import {auditSupportedEntranceStairs} from './walkable-entrance-stairs.mjs';

export function searchProtectedEntranceCandidates(seed,rx,rz,{
 surfaceHeightAt,biomeAt,requiredBiome,protectedAt=()=>false,
 naturalAt,authoredAt=()=>undefined,editedAt=()=>false,
 existingLandmarkAt=()=>false,maxCandidates=4,radialVariant=0,lateralVariant=0
}={}){
 if(!Number.isSafeInteger(seed)||seed!==(seed|0)||
   ![rx,rz].every(Number.isSafeInteger)||
   typeof surfaceHeightAt!=='function'||typeof biomeAt!=='function'||
   typeof naturalAt!=='function'||typeof protectedAt!=='function'||
   typeof authoredAt!=='function'||typeof editedAt!=='function'||
   typeof existingLandmarkAt!=='function'||
   typeof requiredBiome!=='string'||!requiredBiome.trim()||
   (!Number.isSafeInteger(maxCandidates)||maxCandidates<1||maxCandidates>4)||
   !Number.isSafeInteger(radialVariant)||radialVariant<0||radialVariant>3||
   !Number.isSafeInteger(lateralVariant)||lateralVariant<0||lateralVariant>3)
  throw new TypeError('Invalid protected entrance candidate search');
 const examined=[],seen=new Set();
 let accepted=null;
 for(let searchStart=0;searchStart<maxCandidates;searchStart++){
  const p=planUnderworldSurfaceEntrance(seed,rx,rz,{
    surfaceHeightAt,biomeAt,requiredBiome,protectedAt,searchStart,radialVariant,lateralVariant
  });
  if(!p.ok){
   examined.push(Object.freeze({searchStart,ok:false,stage:'GEOMETRY',
      reason:p.reason,history:p.rejectionHistory}));
   continue;
  }
  const key=p.direction+':'+p.mouth.x+':'+p.mouth.z;
  if(seen.has(key)){
   examined.push(Object.freeze({searchStart,ok:false,stage:'DUPLICATE'}));
   continue;
  }
  seen.add(key);
  const geometry=auditProposedSurfaceConnection(seed,p);
  if(!geometry.pass){
   examined.push(Object.freeze({searchStart,ok:false,stage:'FACE_CONNECTED',
      reason:geometry.failures[0]?.reason??'UNKNOWN'}));
   continue;
  }
  const stairs=auditSupportedEntranceStairs(p);
  if(!stairs.ok){
   examined.push(Object.freeze({searchStart,ok:false,stage:'STAIR_SUPPORT',
      reason:stairs.failures[0]??'UNKNOWN'}));
   continue;
  }
  const envelope=auditProtectedEntranceEnvelope(p,{
   naturalAt,authoredAt,editedAt,protectedAt:existingLandmarkAt
  });
  examined.push(Object.freeze({searchStart,ok:envelope.ok,
    stage:envelope.ok?'STRICT_SOURCE_CANDIDATE':'STRICT_SOURCE_REJECTED',
    checkedCells:envelope.checkedCells,
    unsafeMaterials:envelope.unsafeMaterials,
    protectedOriginal:envelope.protectedOriginal,
    sourceOwned:envelope.sourceOwned,edits:envelope.edits,
    reason:envelope.reason,biome:p.biome,mouth:p.mouth}));
  if(envelope.ok){accepted=Object.freeze({proposal:p,envelope,stairs,geometry});break;}
 }
 return Object.freeze({ok:!!accepted,seed,rx,rz,requiredBiome,
   tested:examined.length,accepted,
   examined:Object.freeze(examined),
   noOriginalCellsChanged:true,worldCarved:false,
   actualPhysicsAndGPUUnverified:true});
}

// Four offset families x four compass approaches, with the IDENTICAL full
// per-candidate protections. Zero old-world writes; stop on first safe result.
// All old four-way tests, defaults and the 4-way benchmark stay unchanged.
export function searchExtendedProtectedEntrances(seed,rx,rz,options={}){
 const {maxVariants=4,...remaining}=options;
 if(!Number.isSafeInteger(maxVariants)||maxVariants<1||maxVariants>4)
  throw new TypeError('Invalid radial search bound');
 const audited=[],seen=new Set();let accepted=null;
 for(let radialVariant=0;radialVariant<maxVariants;radialVariant++){
  const group=searchProtectedEntranceCandidates(seed,rx,rz,{
    ...remaining,radialVariant,maxCandidates:4
  });
  const unique=[];
  for(const attempt of group.examined){
   const key=attempt.mouth?
    attempt.mouth.x+':'+attempt.mouth.y+':'+attempt.mouth.z:
    null;
   if(key&&seen.has(key))continue;
   if(key)seen.add(key);
   unique.push(Object.freeze({...attempt,radialVariant}));
  }
  audited.push(Object.freeze({radialVariant,passes:group.ok,
   examined:group.tested,uniqueExamined:Object.freeze(unique),
   acceptedDirection:group.accepted?.proposal.direction??null}));
  if(group.ok){accepted=group.accepted;break;}
 }
 const attempts=audited.reduce((sum,g)=>sum+g.examined,0);
 return Object.freeze({ok:!!accepted,seed,rx,rz,
  requiredBiome:remaining.requiredBiome??null,attempts,
  radialVariantsExamined:audited.length,accepted,
  audited:Object.freeze(audited),
  noOriginalCellsChanged:true,worldCarved:false,
  realM7FootstepAndDeviceUnverified:true});
}

// Full 4 compass x 4 radial x 4 lateral source-preserving research route set.
// Each evaluated choice invokes the ORIGINAL strict provenance validator.
// Earlier 4-way and 16-way APIs are unchanged for historical parity.
export function searchWideProtectedEntrances(seed,rx,rz,options={}){
 const {maxLaterals=4,...remaining}=options;
 if(!Number.isSafeInteger(maxLaterals)||maxLaterals<1||maxLaterals>4)
  throw new TypeError('Invalid lateral search bound');
 const groups=[],seen=new Set();let accepted=null;
 for(let lateralVariant=0;lateralVariant<maxLaterals;lateralVariant++){
  const run=searchExtendedProtectedEntrances(seed,rx,rz,{
    ...remaining,lateralVariant,maxVariants:4
  });
  const unique=[];
  for(const family of run.audited)for(const q of family.uniqueExamined){
   const key=q.mouth?q.mouth.x+':'+q.mouth.y+':'+q.mouth.z:null;
   if(key&&seen.has(key))continue;
   if(key)seen.add(key);
   unique.push(Object.freeze({...q,lateralVariant}));
  }
  groups.push(Object.freeze({lateralVariant,attempts:run.attempts,
    accepted:run.ok,firstFourWaySafe:run.audited[0]?.passes===true,
    uniqueExamined:Object.freeze(unique)}));
  if(run.ok){accepted=run.accepted;break;}
 }
 return Object.freeze({ok:!!accepted,seed,rx,rz,
  requiredBiome:remaining.requiredBiome??null,accepted,
  totalAttempts:groups.reduce((sum,g)=>sum+g.attempts,0),
  lateralFamiliesExamined:groups.length,
  groups:Object.freeze(groups),
  sourceProtected:true,worldCarved:false,
  originalM7Edited:false,playerWalkingUnverified:true});
}
