// MYTHWROUGHT Floating Islands: original GPU owner plus authoritative sky
// source freshness. Source-only integration; never imported by src/main.mjs.
// Sky buffers MUST be attributable to the current generator/world and the
// exact physical section revision, including AIR edits. Key equality alone
// is not proof: world changes and edits reuse sky:cx,cz,section addresses.
import {skyIslandMeshKey,SKY_ISLAND_MAX_Y,SKY_ISLAND_PLAYER_HEIGHT} from './sky-runtime-adapter.mjs';
import {planSkyNativeOwner,stageSkyNativeOwnerFrame,publishSkyNativeFrameInPlace}
  from './sky-native-owner.mjs';

const fail=s=>{throw new TypeError('Sky certified owner: '+s);};
const safe=Number.isSafeInteger;
const text=s=>typeof s==='string'&&s.length>0&&s.length<=128;
const sky=k=>typeof k==='string'&&k.startsWith('sky:');
const pairs=m=>Object.freeze([...m.entries()].map(([k,v])=>Object.freeze([k,v])));
const blocked=reason=>Object.freeze({mode:'source-blocked',reason,readyForStage:false,
  canAdmitFlight:false,desiredKeys:Object.freeze([]),skyJobs:Object.freeze([])});
const identityValid=x=>x&&text(x.worldToken)&&text(x.generatorFingerprint)&&
  safe(x.epoch)&&x.epoch>=0;
function authority(source){
  if(!source||typeof source.readIdentity!=='function'||
     typeof source.sectionRevision!=='function')fail('actual source identity and revision readers required');
  return source;
}
function snapshot(source,worldToken){
  const id=source.readIdentity();
  if(!identityValid(id)||id.worldToken!==worldToken)fail('stale or unsafe sky generator identity');
  return Object.freeze({worldToken:id.worldToken,
    generatorFingerprint:id.generatorFingerprint,epoch:id.epoch});
}
function matching(a,b){return a.worldToken===b.worldToken&&
  a.generatorFingerprint===b.generatorFingerprint&&a.epoch===b.epoch;}
function revision(source,key){
  const rev=source.sectionRevision(key);
  if(!safe(rev)||rev<0)fail('missing current physical sky section revision');
  return rev;
}
function current(source,fence){
  try{
    const id=snapshot(source,fence.worldToken);
    if(!matching(id,fence))return false;
    for(const [key,rev] of fence.revisions)
      if(revision(source,key)!==rev)return false;
    return matching(snapshot(source,fence.worldToken),fence);
  }catch(_){return false;}
}
const validChunk=(chunk,stamp,rev)=>chunk?.buffer&&chunk.sky===true&&
  chunk.skySource?.worldToken===stamp.worldToken&&
  chunk.skySource?.generatorFingerprint===stamp.generatorFingerprint&&
  chunk.skySource?.epoch===stamp.epoch&&chunk.skySource?.revision===rev;

// An original renderer grant is still compulsory. The source fence simply
// stops wrong-world/old-edit sky GPU buffers from being counted as resident.
export function planCertifiedSkyOwner({source,position,nativeChunks,
  nativeWanted=[],skyCandidates=[],worldToken,...nativeArgs}={}){
  authority(source);
  if(!(nativeChunks instanceof Map)||!Array.isArray(skyCandidates))
    fail('real renderer map and section candidates required');
  const stamp=snapshot(source,worldToken);
  if(!position||!Number.isFinite(position.feet)||
     position.feet+SKY_ISLAND_PLAYER_HEIGHT>SKY_ISLAND_MAX_Y+1e-9)
    return blocked('Full player body exceeds certified upper sky height');
  const revs=new Map();
  for(const row of skyCandidates){
    if(!row||![row.cx,row.cz,row.section].every(safe))fail('unsafe source section');
    const key=skyIslandMeshKey(row.cx,row.cz,row.section);
    if(revs.has(key))fail('duplicate sky source section identity');
    revs.set(key,revision(source,key));
  }
  const filtered=new Map(nativeChunks);
  for(const [key,chunk] of nativeChunks){
    if(sky(key)&&(!revs.has(key)||!validChunk(chunk,stamp,revs.get(key))))
      filtered.delete(key);
  }
  const base=planSkyNativeOwner({...nativeArgs,position,nativeChunks:filtered,
    nativeWanted,skyCandidates,worldToken});
  if(base.mode!=='sky-authorized')return base;
  if(!matching(snapshot(source,worldToken),stamp))return blocked('Sky source changed during planning');
  const plannedNew=new Set(base.skyJobs.map(p=>p.key));
  // Only keep source-current buffers and the two freshly authorized uploads.
  // Never leave wrong-world sky buffers in the published draw list while a
  // multi-frame seam request fills all eight required source sections.
  const desired=Object.freeze(base.desiredKeys.filter(k=>!sky(k)||
    plannedNew.has(k)||filtered.has(k)));
  const required=base.required.map(row=>row.key);
  const revisions=pairs(new Map([...revs].filter(([k])=>
    required.includes(k)||desired.includes(k))));
  const fence=Object.freeze({...stamp,revisions});
  return Object.freeze({...base,
    desiredKeys:desired,slots:desired.length,
    skyCount:desired.filter(sky).length,
    canAdmitFlight:base.canAdmitFlight&&required.every(k=>filtered.has(k)),
    sourceFence:fence,sourceFilteredCount:nativeChunks.size-filtered.size,
    sourceCurrent:current(source,fence)});
}

function releaseStaged(stage,gl,readRendererIdentity){
  let live;
  try{live=readRendererIdentity();}catch(_){return {abandonedOnContextLoss:true};}
  if(!live||live.contextToken!==stage.contextToken)
    return {abandonedOnContextLoss:true};
  let failed=0;
  for(const buffer of stage.transaction.stagedBuffers){
    try{gl.deleteBuffer(buffer);}catch(_){failed++;}
  }
  return {abandonedOnContextLoss:false,deleteFailures:failed};
}

// Renderer-owner frame preparation. Meshes are uploaded by the exact native
// uploadChunkBuffer. No staged buffer is published unless the source fence
// remained unchanged throughout reading and uploading the physical cells.
export function stageCertifiedSkyFrame({plan,source,gl,chunks,meshSection,
  readRendererIdentity,contextToken,worldToken,rendererEpoch,nativeRevision}={}){
  authority(source);
  if(!plan?.sourceFence||plan.sourceCurrent!==true||
     typeof readRendererIdentity!=='function')fail('certified current source plan required');
  if(!current(source,plan.sourceFence))return Object.freeze({status:'stale',
    reason:'Sky source changed before GPU staging',allocated:0});
  const certifiedMesher=(cx,cz,section)=>{
    const key=skyIslandMeshKey(cx,cz,section);
    const expectedRevision=new Map(plan.sourceFence.revisions).get(key);
    if(expectedRevision===undefined)fail('staged section was not source-authorized');
    const mesh=meshSection(cx,cz,section);
    const proof=mesh?.sourceProof;
    if(!proof||proof.worldToken!==plan.sourceFence.worldToken||
       proof.generatorFingerprint!==plan.sourceFence.generatorFingerprint||
       proof.epoch!==plan.sourceFence.epoch||proof.revision!==expectedRevision)
      fail('mesh lacks exact current generator and physical section proof');
    return mesh;
  };
  const stage=stageSkyNativeOwnerFrame({plan,gl,chunks,meshSection:certifiedMesher,contextToken,
    worldToken,rendererEpoch,nativeRevision});
  if(!current(source,plan.sourceFence))return Object.freeze({status:'stale',
    reason:'Sky source changed during physical mesh upload',
    ...releaseStaged(stage,gl,readRendererIdentity)});
  const m=new Map(stage.transaction.nextChunks);
  const revisions=new Map(plan.sourceFence.revisions);
  for(const key of stage.stagedKeys){
    if(!revisions.has(key))fail('new upload lacks source-revision proof');
    const chunk=m.get(key);
    if(!chunk?.buffer||chunk.sky!==true)fail('new sky upload missing real buffer');
    m.set(key,Object.freeze({...chunk,
      skySource:Object.freeze({worldToken:plan.sourceFence.worldToken,
        generatorFingerprint:plan.sourceFence.generatorFingerprint,
        epoch:plan.sourceFence.epoch,revision:revisions.get(key)})}));
  }
  const transaction=Object.freeze({...stage.transaction,nextChunks:m,nextEntries:pairs(m)});
  return Object.freeze({...stage,transaction,sourceFence:plan.sourceFence,
    status:'staged',sourceCertified:true});
}

// One synchronous original-owner frame. Identity is checked both before and
// after the original in-place map CAS; a mid-commit source change forces the
// existing rollback path, and the original native renderer is never replaced.
export function publishCertifiedSkyFrame({stage,source,chunks,gl,readRendererIdentity}={}){
  authority(source);
  if(!stage?.sourceCertified||!stage.sourceFence||
     typeof readRendererIdentity!=='function')fail('staged certified GPU frame required');
  const fencedIdentity=()=>{
    const identity=readRendererIdentity();
    return current(source,stage.sourceFence)?identity:
      {...identity,worldToken:'__sky-source-stale__'};
  };
  return publishSkyNativeFrameInPlace({stage,chunks,gl,readIdentity:fencedIdentity});
}
