// MYTHWROUGHT Mountain V8 — MOCK-ONLY GPU upload and rollback study.
// This is NOT imported by production. No real WebGL2, world writes,
// registered IDs, save mutation, installed PWA, live chunks or deployment.
// Uses exact original uploadChunkBuffer (including GL OOM error checking)
// against an explicitly labelled synthetic driver. The only "publication"
// is creation of a DETACHED new Map of synthetic buffer handles.
import {MAX_CHUNK_UPLOAD_BYTES,validateChunkUploadBytes,uploadChunkBuffer,
  GpuUploadRetry} from '../gpu-recovery.mjs';
import {V8_RESEARCH_MAX_STAGE_BYTES}
  from './mountain-v8-p3-mesh-batch-rollback-research.mjs';
import {V8_P3_SOURCE_HEAD}
  from './mountain-v8-p3-uplift-and-halo-audit.mjs';

const freeze=Object.freeze;
const limited=(value)=>typeof value==='string'&&value.length>0&&value.length<=512;
const deny=freeze({safeToIntegrate:false,runtimeActivationAuthorized:false,
  originalM7RgbHaloInherited:false,registeredV8MaterialIds:0,
  realWebGL2Used:false,liveChunkMapMutated:false,
  savedWorldWritten:false,originalSidecarsWritten:false,
  actualDeviceGpuBytesMeasured:false,actualPwaTested:false});

/** The original GPU helper creates & cleans the failing candidate itself.
 * This research wrapper deletes ONLY earlier successful synthetic stages.
 * The caller must never pass a genuine WebGLRenderingContext. A synthetic
 * fake driver must generate fresh handles, not return existing live ones.
 *
 * The ownership token is a synthetic read-only epoch/provenance witness.
 * It is NOT a real cross-tab lock. Source callbacks and old loaded chunks
 * are untrusted until the future render owner authenticates them.
 */
export function stageMountainV8MockGpuTransaction(plan,loadedOriginal,{
  mockGl,sourceCpuBuffers,readOwnershipToken,originalOwnershipToken,
  retry=new GpuUploadRetry(),now=0,
  maxAggregateBytes=V8_RESEARCH_MAX_STAGE_BYTES
}={}){
  const failure=(reason,cleanupComplete=true,stagedHandleCount=0)=>freeze({
    status:'rejected',reason,projectedChunks:null,stagedChunkCount:0,
    stagedHandleCount:0,cleanedCandidateHandleCount:stagedHandleCount,
    cleanupComplete,...deny
  });
  if(!plan||plan.safeToIntegrate!==false||
     plan.sourceMainHead!==V8_P3_SOURCE_HEAD||
     plan.oldM7P3ColorHaloInherited!==false||
     !Array.isArray(plan.loaded)||!Array.isArray(plan.originalEntries)||
     plan.loaded.length!==plan.originalEntries.length||
     plan.loaded.length>16||
     !(loadedOriginal instanceof Map)||!Array.isArray(sourceCpuBuffers)||
     sourceCpuBuffers.length!==plan.loaded.length||
     !mockGl||mockGl.mountainV8SyntheticDriver!==true||
     typeof mockGl.isContextLost!=='function'||
     typeof mockGl.createBuffer!=='function'||
     typeof mockGl.deleteBuffer!=='function'||
     typeof readOwnershipToken!=='function'||
     !limited(originalOwnershipToken)||!Number.isFinite(now)||
     !(retry instanceof GpuUploadRetry)||
     !Number.isSafeInteger(maxAggregateBytes)||
     maxAggregateBytes<0||maxAggregateBytes>V8_RESEARCH_MAX_STAGE_BYTES)
    return failure('source-or-synthetic-driver-not-admitted');
  const before=new Map(loadedOriginal);
  const keys=new Set();
  const sameOriginals=()=>loadedOriginal.size===before.size&&
    [...before].every(([key,ref])=>loadedOriginal.has(key)&&
      loadedOriginal.get(key)===ref);
  const epochValid=()=>sameOriginals()&&!mockGl.isContextLost()&&
    readOwnershipToken()===originalOwnershipToken;
  let count=0;
  const inputs=[];
  try{
    if(!epochValid())return failure('stale-original-epoch-or-lost-context');
    for(let i=0;i<plan.loaded.length;i++){
      const p=plan.loaded[i],row=plan.originalEntries[i],cpu=sourceCpuBuffers[i];
      if(!p||!row||!cpu||keys.has(p.key)||
         p.key!==row.key||p.key!==cpu.key||
         loadedOriginal.get(p.key)!==row.originalEntry||
         !loadedOriginal.has(p.key)||typeof p.key!=='string'||
         !(cpu.opaque instanceof Float32Array)||
         !(cpu.transparent instanceof Float32Array))
        throw Error('invalid-original-loaded-entry-or-layer');
      keys.add(p.key);
      const opaqueBytes=validateChunkUploadBytes(cpu.opaque,MAX_CHUNK_UPLOAD_BYTES);
      const transparentBytes=validateChunkUploadBytes(cpu.transparent,MAX_CHUNK_UPLOAD_BYTES);
      count+=opaqueBytes+transparentBytes;
      if(count>maxAggregateBytes)throw Error('aggregate-CPU-budget');
      inputs.push({key:p.key,cx:p.cx,cz:p.cz,section:p.section,
        opaque:cpu.opaque,transparent:cpu.transparent,opaqueBytes,transparentBytes});
    }
    if(!epochValid())throw Error('original-source-changed-during-cpu-preflight');
  }catch{return failure('invalid-source-cpu-batch-or-budget');}

  const created=[],ready=[];
  let cleanupComplete=true,disposed=false;
  const disposeNew=()=>{
    if(disposed)return 0;
    disposed=true;
    let n=0;
    // NEVER delete any preexisting originally displayed handle.
    const protectedBuffers=new Set([...before.values()].flatMap(old=>
      [old?.buffer,old?.waterBuffer].filter(Boolean)));
    for(const handle of [...created].reverse()){
      if(protectedBuffers.has(handle)){cleanupComplete=false;continue;}
      try{mockGl.deleteBuffer(handle);n++;}
      catch{cleanupComplete=false;}
    }
    return n;
  };
  const abort=reason=>{
    const stagedHandleCount=disposeNew();
    if(!cleanupComplete)return failure('synthetic-candidate-cleanup-unverifiable',
      false,stagedHandleCount);
    return failure(reason,true,stagedHandleCount);
  };
  for(const item of inputs){
    try{
      if(!epochValid())return abort('stale-original-epoch-or-lost-context');
      if(!retry.ready(item.key,now))return abort('original-gpu-retry-backoff');
      const opaqueHandle=uploadChunkBuffer(mockGl,item.opaque);
      created.push(opaqueHandle);
      if(!epochValid())return abort('stale-original-epoch-or-lost-context');
      let waterHandle=null;
      if(item.transparent.length){
        waterHandle=uploadChunkBuffer(mockGl,item.transparent);
        created.push(waterHandle);
      }
      if(!epochValid())return abort('stale-original-epoch-or-lost-context');
      ready.push(freeze({key:item.key,cx:item.cx,cz:item.cz,section:item.section,
        buffer:opaqueHandle,waterBuffer:waterHandle,
        count:item.opaque.length/9,waterCount:item.transparent.length/9,
        stagedOpaqueBytes:item.opaqueBytes,
        stagedTransparentBytes:item.transparentBytes}));
    }catch(error){
      try{retry.fail(item.key,now,String(error?.message||error));}catch{}
      return abort('original-upload-helper-rejected-synthetic-stage');
    }
  }
  if(!epochValid())return abort('stale-original-epoch-or-lost-context');
  const projected=new Map(before);
  for(const item of ready)projected.set(item.key,freeze({
    researchMockOnly:true,
    x:item.cx,z:item.cz,section:item.section,
    buffer:item.buffer,waterBuffer:item.waterBuffer,
    count:item.count,waterCount:item.waterCount}));
  // This token is meaningful only to the synthetic driver; it grants no
  // permission to install projected buffers into the real renderer.
  return freeze({status:'synthetic-gpu-preview-only',
    stagedChunkCount:ready.length,stagedHandleCount:created.length,
    bytesPlanned:count,projectedChunks:projected,
    originalLoadedChunkCount:before.size,
    originalSourceOwnershipToken:originalOwnershipToken,
    stages:freeze(ready),
    disposeSyntheticHandles:()=>disposeNew(),
    ...deny});
}
