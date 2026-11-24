// MYTHWROUGHT Mountain V8 — DETACHED original owner snapshot & mock
// GPU retirement-eligibility evidence only. Not imported in live src/main.mjs.
// No WebGL calls, no buffer deletion, no loaded chunk writes, no storage/IDB,
// no numeric IDs, no production publication or save mutations.
import {readMountainV8DetachedOriginalEpoch}
  from './mountain-v8-p3-source-epoch-projected-publication.mjs';
import {V8_P3_SOURCE_HEAD}
  from './mountain-v8-p3-uplift-and-halo-audit.mjs';

const f=Object.freeze;
const integer=Number.isSafeInteger;
const forbid=f({
  safeToIntegrate:false,runtimeActivationAuthorized:false,
  ownerApprovedOldBufferRelease:false,
  productionBufferPublicationPerformed:false,
  oldBufferDeleted:false,newBufferDeleted:false,
  originalLoadedMapWritten:false,actualWebGL2Used:false,
  physicalIphonePwaAccepted:false,
  crossTabLockAcquired:false,persistentSaveWritten:false,
  vaultMirrorReadOrWritten:false,
  V8MaterialIdsRegistered:0,
  M7P3ColorHaloInherited:false
});
const equivalent=(a,b)=>a&&b&&
  a.sourceMainHead===V8_P3_SOURCE_HEAD&&
  b.sourceMainHead===V8_P3_SOURCE_HEAD&&
  a.contextGeneration===b.contextGeneration&&
  a.worldSchema1===b.worldSchema1&&
  a.originalPack2===b.originalPack2&&
  a.originalPack3===b.originalPack3&&
  a.originalManual14===b.originalManual14&&
  JSON.stringify(a.originalAuxiliary)===JSON.stringify(b.originalAuxiliary);
/** Repeated original in-memory source reads detect torn snapshots during a
 * controlled synchronous capture. No browser multi-tab transaction exists.
 * The test-only betweenReads callback must NEVER become a live owner hook.
 */
export function inspectMountainV8RepeatedOriginalSnapshot(readers,{
  betweenReads=()=>{},requiredGeneration=0
}={}){
  const rejected=reason=>f({status:'rejected',reason,
    coherent:null,first:null,second:null,...forbid});
  if(!readers||typeof readers!=='object'||
     typeof betweenReads!=='function'||!integer(requiredGeneration)||
     requiredGeneration<0)
    return rejected('original-source-reader-unverifiable');
  let first,second;
  try{
    first=readMountainV8DetachedOriginalEpoch({
      ...readers,contextGeneration:requiredGeneration});
    betweenReads();
    second=readMountainV8DetachedOriginalEpoch({
      ...readers,contextGeneration:requiredGeneration});
  }catch{return rejected('original-source-read-failed');}
  if(!equivalent(first,second)||first.contextGeneration!==requiredGeneration)
    return rejected('original-source-changed-during-snapshot');
  return f({status:'repeated-original-source-consistent',
    sourceMainHead:V8_P3_SOURCE_HEAD,coherent:f({...second}),
    first,second,
    synchronousOnly:true,intertabAtomicityProved:false,
    ownershipSeedAdmissionGranted:false,...forbid});
}
/** All release candidates below are returned as INFORMATION ONLY.
 * A real GPU owner must first gain an approved atomic renderer commit lock,
 * publish a coherent entire new chunk map and establish context lifetime;
 * this module NEVER calls gl.deleteBuffer or changes displayed data.
 *
 * Both proposed and old buffers are synthetic test handles; callers cannot
 * obtain user-world GPU disposal permissions by passing an object here.
 */
export function inspectMountainV8MockRetirementEligibility(
  shadow,mockStage,loadedOriginal,{
    expectedSourceEpoch,readCurrentSourceEpoch,
    readContextGeneration,expectedContextGeneration,
    isContextLost=()=>false,isSyntheticHandleLive,
    beforeRetirementInspection=()=>{}
  }={}
){
  const reject=reason=>f({status:'rejected',reason,
    hypotheticalOldHandles:f([]),hypotheticalNewHandles:f([]),
    originalChunksRetained:true,...forbid});
  if(!shadow||shadow.status!=='detached-projection-only'||
     shadow.safeToIntegrate!==false||
     shadow.productionBufferPublicationPerformed!==false||
     shadow.oldGpuBuffersReleased!==false||
     !(shadow.projectedChunks instanceof Map)||
     !mockStage||mockStage.status!=='synthetic-gpu-preview-only'||
     mockStage.safeToIntegrate!==false||
     !(mockStage.projectedChunks instanceof Map)||
     !Array.isArray(mockStage.stages)||
     mockStage.stagedChunkCount!==mockStage.stages.length||
     !(loadedOriginal instanceof Map)||
     typeof readCurrentSourceEpoch!=='function'||
     typeof readContextGeneration!=='function'||
     typeof isContextLost!=='function'||
     typeof isSyntheticHandleLive!=='function'||
     typeof beforeRetirementInspection!=='function'||
     !integer(expectedContextGeneration)||expectedContextGeneration<0||
     !expectedSourceEpoch||
     expectedSourceEpoch.contextGeneration!==expectedContextGeneration)
    return reject('shadow-source-or-retirement-owner-unverifiable');
  const originals=new Map(loadedOriginal);
  const unchangedLoaded=()=>originals.size===loadedOriginal.size&&
    [...originals].every(([k,v])=>loadedOriginal.has(k)&&
      loadedOriginal.get(k)===v);
  const validEpoch=()=>!isContextLost()&&unchangedLoaded()&&
    readContextGeneration()===expectedContextGeneration&&
    equivalent(readCurrentSourceEpoch(),expectedSourceEpoch);
  try{
    if(!validEpoch())return reject('stale-source-or-context-before-retirement');
    beforeRetirementInspection();
    if(!validEpoch())return reject('stale-source-or-context-during-retirement');
    if(shadow.projectedChunks.size!==originals.size||
       mockStage.projectedChunks.size!==originals.size||
       shadow.projectedChunkCount!==mockStage.stages.length)
      return reject('shadow-chunk-domain-mismatch');
    const candidates=new Set(mockStage.stages.map(s=>s.key));
    if(candidates.size!==mockStage.stages.length)
      return reject('duplicate-original-chunk-source-key');
    const oldCandidateHandles=[],newCandidateHandles=[];
    const oldAllHandles=new Set(),oldSharedHandles=new Set();
    for(const old of originals.values()){
      if(!old||!old.buffer)return reject('original-old-buffer-unverifiable');
      for(const h of [old.buffer,old.waterBuffer].filter(Boolean)){
        if(oldAllHandles.has(h))oldSharedHandles.add(h);
        oldAllHandles.add(h);
      }
    }
    const newSeen=new Set();
    for(const staged of mockStage.stages){
      const original=originals.get(staged.key),
        projection=shadow.projectedChunks.get(staged.key),
        mockProjection=mockStage.projectedChunks.get(staged.key);
      if(!original||!projection||!mockProjection||
         projection.researchSyntheticProjectionOnly!==true||
         mockProjection.researchMockOnly!==true||
         projection.buffer!==staged.buffer||
         projection.waterBuffer!==staged.waterBuffer||
         mockProjection.buffer!==staged.buffer||
         mockProjection.waterBuffer!==staged.waterBuffer||
         !(Number.isSafeInteger(staged.count)&&staged.count>=0)||
         !(Number.isSafeInteger(staged.waterCount)&&staged.waterCount>=0))
        return reject('old-to-mock-shadow-buffer-ownership-mismatch');
      for(const handle of [staged.buffer,staged.waterBuffer].filter(Boolean)){
        if(oldAllHandles.has(handle)||newSeen.has(handle)||
           isSyntheticHandleLive(handle)!==true)
          return reject('old-new-handle-alias-or-disposed-candidate');
        newSeen.add(handle);newCandidateHandles.push(handle);
      }
      for(const handle of [original.buffer,original.waterBuffer].filter(Boolean)){
        if(oldSharedHandles.has(handle))
          return reject('old-buffer-shared-across-loaded-chunks');
        oldCandidateHandles.push(handle);
      }
    }
    for(const [k,original] of originals){
      if(candidates.has(k))continue;
      if(shadow.projectedChunks.get(k)!==original||
         mockStage.projectedChunks.get(k)!==original)
        return reject('untouched-original-loaded-chunk-changed');
    }
    if(newCandidateHandles.length!==mockStage.stagedHandleCount||
       oldCandidateHandles.length<mockStage.stagedChunkCount)
      return reject('old-new-buffer-domain-mismatch');
    if(!validEpoch()||
       newCandidateHandles.some(h=>isSyntheticHandleLive(h)!==true))
      return reject('stale-source-or-disposed-after-inspection');
    return f({
      status:'retirement-plan-only',sourceMainHead:V8_P3_SOURCE_HEAD,
      hypotheticalOldHandles:f([...oldCandidateHandles]),
      hypotheticalNewHandles:f([...newCandidateHandles]),
      hypotheticalReplacedChunks:mockStage.stagedChunkCount,
      originalChunksRetained:true,oldBufferReleaseAuthorized:false,
      gpuContextGeneration:expectedContextGeneration,
      futureRendererCommitLockRequired:true,
      oldBufferReleaseMustFollowAtomicPublication:true,...forbid
    });
  }catch{return reject('source-reader-or-retirement-inspection-fault');}
}
