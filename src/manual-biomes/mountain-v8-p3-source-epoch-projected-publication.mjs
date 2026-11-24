// Mountain V8 SOURCE-ONLY original owner revision/renderer publication study.
// Detached: not imported by src/main.mjs, no real GL, writes, storage access,
// new IDs, registered materials, original chunk mutations or deployment.
// Compare authentic original schema-1 / source sidecar snapshots before a
// hypothetical publication. This is NOT atomic browser/tab/save locking.
import {V8_P3_SOURCE_HEAD} from './mountain-v8-p3-uplift-and-halo-audit.mjs';
const f=Object.freeze;
const safeInt=Number.isSafeInteger;
const LIMIT=12*1024*1024;
const denied=f({safeToIntegrate:false,runtimeActivationAuthorized:false,
  productionBufferPublicationPerformed:false,productionBufferDeleted:false,
  originalLoadedChunkMapWritten:false,realWebGL2Used:false,
  originalM7P3RgbInherited:false,newV8IdsRegistered:0,
  savedSchema1Written:false,pack2Pack3ManualSaved:false,
  liveCaveOrMobSaveTouched:false,deviceVaultMirrorTouched:false,
  atomicCrossStoreLockObtained:false,installedHomeScreenPwaTested:false});
const stableText=value=>{
  const text=JSON.stringify(value);
  if(typeof text!=='string'||text.length>LIMIT)
    throw Error('Original source snapshot unavailable or unbounded');
  return text;
};
/** Does NOT open localStorage/IDB/Vault/Mirror. The original source readers
 * and their live ownership must be supplied by a future approved owner.
 * Cave, Mob, Vault and Mirror are deliberately UNATTESTED here, not clear.
 */
export function readMountainV8DetachedOriginalEpoch({
  world,pack3Runtime,manual14Layer,pack2Cells,
  contextGeneration=0,caveEvidence=null,mobEvidence=null,
  vaultEvidence=null,mirrorEvidence=null
}={}){
  if(!world||typeof world.save!=='function'||
     !pack3Runtime||typeof pack3Runtime.serialize!=='function'||
     !manual14Layer||typeof manual14Layer.entries!=='function'||
     !(pack2Cells instanceof Map)||!safeInt(contextGeneration)||
     contextGeneration<0)
    throw Error('Original M7/Pack2/3/Manual source owner reader unavailable');
  const saved=stableText(world.save());
  const pack3=stableText(pack3Runtime.serialize());
  const pack2=stableText([...pack2Cells].sort(([a],[b])=>String(a).localeCompare(String(b))));
  const manual=stableText(manual14Layer.entries());
  // Auxiliary evidence is the caller's read-only documentation, NEVER an
  // authorization. Null means the sensitive owner has not been inspected.
  const auxiliary=f({
    caveAttested:caveEvidence!==null,mobAttested:mobEvidence!==null,
    vaultAttested:vaultEvidence!==null,mirrorAttested:mirrorEvidence!==null
  });
  return f({sourceMainHead:V8_P3_SOURCE_HEAD,contextGeneration,
    worldSchema1:saved,originalPack2:pack2,originalPack3:pack3,
    originalManual14:manual,originalAuxiliary:auxiliary,
    sourceReadersCompared:true,sourceBrowserLockObtained:false,
    safeToIntegrate:false});
}
const equal=(a,b)=>a?.sourceMainHead===V8_P3_SOURCE_HEAD&&
  b?.sourceMainHead===V8_P3_SOURCE_HEAD&&
  a.contextGeneration===b.contextGeneration&&
  a.worldSchema1===b.worldSchema1&&
  a.originalPack2===b.originalPack2&&
  a.originalPack3===b.originalPack3&&
  a.originalManual14===b.originalManual14&&
  JSON.stringify(a.originalAuxiliary)===JSON.stringify(b.originalAuxiliary);
/** Builds a CLONED, NONLIVE map only after checking actual original source
 * epoch, source-chunk identities and mock GL context generation at every
 * projected replacement boundary. It CANNOT replace a real displayed
 * WebGL buffer. The real renderer owner must approve a separate atomic
 * publication algorithm and multi-tab persistence coordination.
 *
 * beforeProjectedEntry is TEST-ONLY fault injection, not an owner hook.
 */
export function previewMountainV8DetachedPublication(
  mockStage,originalLoadedChunks,{
    expectedEpoch,readCurrentEpoch,readContextGeneration,
    contextGeneration,beforeProjectedEntry=()=>{},
    mockContextLost=()=>false
  }={}
){
  let cleanupComplete=true,cleaned=0;
  const dispose=()=>{
    if(!mockStage||typeof mockStage.disposeSyntheticHandles!=='function')
      return;
    try{cleaned=mockStage.disposeSyntheticHandles();}
    catch{cleanupComplete=false;}
  };
  const reject=(reason,disposeStage=true)=>{
    if(disposeStage)dispose();
    return f({status:'rejected',reason,projectedChunks:null,
      publishedChunks:0,cleanedSyntheticHandles:cleaned,
      cleanupComplete,uncertain:!cleanupComplete,...denied});
  };
  if(!mockStage||
     mockStage.status!=='synthetic-gpu-preview-only'||
     mockStage.safeToIntegrate!==false||
     mockStage.runtimeActivationAuthorized!==false||
     mockStage.realWebGL2Used!==false||
     mockStage.liveChunkMapMutated!==false||
     !Array.isArray(mockStage.stages)||
     !(mockStage.projectedChunks instanceof Map)||
     !(originalLoadedChunks instanceof Map)||
     !safeInt(contextGeneration)||contextGeneration<0||
     !expectedEpoch||expectedEpoch.contextGeneration!==contextGeneration||
     typeof readCurrentEpoch!=='function'||
     typeof readContextGeneration!=='function'||
     typeof beforeProjectedEntry!=='function'||
     typeof mockContextLost!=='function')
    return reject('source-or-stage-publication-unverifiable',false);
  const original=new Map(originalLoadedChunks);
  const sameOriginal=()=>originalLoadedChunks.size===original.size&&
    [...original].every(([key,entry])=>originalLoadedChunks.has(key)&&
      originalLoadedChunks.get(key)===entry);
  const consistent=()=>!mockContextLost()&&sameOriginal()&&
    readContextGeneration()===contextGeneration&&
    equal(readCurrentEpoch(),expectedEpoch);
  const oldHandles=new Set([...original.values()].flatMap(v=>
    [v?.buffer,v?.waterBuffer].filter(Boolean)));
  const newHandles=new Set(),keys=new Set();
  try{
    if(!consistent())return reject('stale-original-source-before-projection');
    if(mockStage.stages.length!==mockStage.stagedChunkCount||
       mockStage.projectedChunks.size!==original.size)
      return reject('staged-count-or-loaded-map-drift');
    for(const item of mockStage.stages){
      if(!item||!original.has(item.key)||keys.has(item.key)||
         typeof item.key!=='string'||!item.buffer||
         !safeInt(item.count)||item.count<0||
         !safeInt(item.waterCount)||item.waterCount<0)
        return reject('noncanonical-original-staged-chunk');
      const projected=mockStage.projectedChunks.get(item.key);
      if(!projected||projected.researchMockOnly!==true||
         projected.buffer!==item.buffer||
         projected.waterBuffer!==item.waterBuffer||
         (item.waterCount>0)!==Boolean(item.waterBuffer))
        return reject('mock-opaque-transparent-owner-mismatch');
      for(const handle of [item.buffer,item.waterBuffer].filter(Boolean)){
        if(oldHandles.has(handle)||newHandles.has(handle))
          return reject('old-or-duplicate-buffer-handle');
        newHandles.add(handle);
      }
      keys.add(item.key);
    }
    if(newHandles.size!==mockStage.stagedHandleCount)
      return reject('staged-original-buffer-count-mismatch');
    // For research only: simulate a one-by-one publication into an *entirely
    // separate Map*. There is no update to originalLoadedChunks or live GL.
    const next=new Map(original);
    for(let i=0;i<mockStage.stages.length;i++){
      if(!consistent())return reject('stale-during-detached-projection');
      beforeProjectedEntry(i,mockStage.stages[i]);
      if(!consistent())return reject('stale-during-detached-projection');
      const item=mockStage.stages[i];
      next.set(item.key,f({
        researchSyntheticProjectionOnly:true,
        x:item.cx,z:item.cz,section:item.section,
        buffer:item.buffer,waterBuffer:item.waterBuffer,
        count:item.count,waterCount:item.waterCount
      }));
    }
    if(!consistent())return reject('stale-after-detached-projection');
    return f({status:'detached-projection-only',projectedChunks:next,
      projectedChunkCount:mockStage.stages.length,
      originalChunkCount:original.size,
      realOwnerCommitAllowed:false,oldGpuBuffersReleased:false,
      syntheticHandlesStillOwnedByMockStage:true,...denied});
  }catch{return reject('source-reader-or-projection-fault');}
}
