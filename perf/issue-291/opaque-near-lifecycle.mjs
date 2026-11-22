// MYTHWROUGHT #291 — isolated near-opaque VAO LIFECYCLE integration candidate.
// This file is not imported by src/main.mjs. No production renderer, cave
// owner, shader, error check, save or workflow is modified by this proposal.
// Ownership: the original near terrain pass and original deleteChunkBuffers
// remain authoritative. The bridge only manages VAO references to their
// WebGLBuffers and refuses rendering after an uncertain native transition.
import {createOpaqueNearVaoRenderer} from './opaque-near-vao.mjs';

const validAttributes = a => !!a && ['atPos','atColor','atUv','atMat']
  .every(k => Number.isSafeInteger(a[k]) && a[k]>=0) &&
  new Set(['atPos','atColor','atUv','atMat'].map(k=>a[k])).size===4;

export function createOpaqueNearLifecycle({gl,attributes,pipelineProgram,originalDeleteChunkBuffers,
  stopRenderLoop,maxEntries}={}){
  if(!gl || !validAttributes(attributes) || !pipelineProgram ||
     typeof pipelineProgram!=='object' ||
     typeof originalDeleteChunkBuffers!=='function'||
     typeof stopRenderLoop!=='function')
    throw Error('291_NEAR_LIFECYCLE_MISSING_SOURCE_CONTRACT');
  const renderer=createOpaqueNearVaoRenderer(gl,{maxEntries});
  let phase='ready',generation=0,reason=null,requiresExternalStop=false;
  let draws=0,retires=0,currentProgram=pipelineProgram;
  const fail=(name,error)=>{
    phase='blocked';reason=name+': '+String(error?.message??error);
    // A callback is NOT proof that the browser's animation frame has stopped.
    // Real integration MUST use the original authoritative frame driver.
    try{if(stopRenderLoop(reason)!==true)requiresExternalStop=true;}
    catch{requiresExternalStop=true;}
    return new Error('291_NEAR_LIFECYCLE_BLOCKED '+reason);
  };
  const ready=()=>{if(phase!=='ready')throw Error('291_NEAR_LIFECYCLE_NOT_READY_'+phase);};
  function render(chunks){
    ready();
    try{const result=renderer.render(chunks,attributes);draws++;return result;}
    catch(error){throw fail('opaque-near-draw',error);}
  }
  function deleteChunkBuffers(chunk){
    if(!chunk)return;
    ready();
    if(!chunk.buffer)throw fail('missing-original-opaque-buffer','no buffer');
    try{
      // Original deleteChunkBuffers will delete BOTH opaque and water buffers.
      // Release its cached VAO FIRST; never delete or replace the buffer here.
      renderer.forgetBuffer(chunk.buffer);
      retires++;
      return originalDeleteChunkBuffers(chunk);
    }catch(error){throw fail('original-chunk-retirement',error);}
  }
  function worldReset(){
    ready();
    try{renderer.dispose();generation++;return true;}
    catch(error){throw fail('world-reset-cache-dispose',error);}
  }
  function contextLost(){
    if(phase==='lost')return;
    // WebGL objects have already been invalidated by WebKit. NO GL deletes.
    // A previous fatal stop is NOT erased by a context-loss/restore cycle:
    // GPU context recovery alone cannot prove a failed chunk retirement,
    // source ownership or already-attempted world rollback is now safe.
    const previouslyBlocked=phase==='blocked';
    renderer.resetForLostContext();generation++;
    if(!previouslyBlocked){phase='lost';reason=null;}
  }
  function contextRestored(newAttributes,newProgram){
    if(phase!=='lost')throw Error('291_NEAR_LIFECYCLE_RESTORE_NOT_LOST');
    if(!validAttributes(newAttributes))throw fail('invalid-restored-program-attributes','invalid locations');
    if(!newProgram || typeof newProgram!=='object' || newProgram===currentProgram)
      throw fail('stale-restored-program','new WebGLProgram identity not certified');
    // Must run only AFTER original initializeGpuPipeline() succeeds.
    try{
      renderer.restored();attributes={...newAttributes};currentProgram=newProgram;
      phase='ready';reason=null;generation++;
      return true;
    }catch(error){throw fail('context-restore',error);}
  }
  function dispose(){
    if(phase==='lost'){renderer.resetForLostContext();return;}
    if(phase==='blocked')return; // no best-effort GL work on uncertain state
    try{renderer.dispose();generation++;}
    catch(error){throw fail('dispose',error);}
  }
  const status=()=>Object.freeze({phase,generation,reason,requiresExternalStop,
    draws,retires,cache:renderer.stats(),liveIntegrationApproved:false,
    originalGetErrorCallsChanged:false,originalBufferOwnershipChanged:false,
    nativeRollbackProven:false,originalBrowserPixelsProven:false});
  return Object.freeze({render,deleteChunkBuffers,worldReset,contextLost,
    contextRestored,dispose,status});
}
