// MYTHWROUGHT #291 — DETACHED TEST-ONLY native resource transition prototype.
// Guarded to a designated MOCK GL; this must NEVER run on the real renderer.
// The ORIGINAL production uploadChunkBuffer is used UNCHANGED, including its
// bounded stale-error drain, mandatory post-upload gl.getError and cleanup.
// This proves only mocked GPU accounting/rollback state. C6 ownership and
// original game+save/near-buffer atomicity are NOT integrated or established.
import {uploadChunkBuffer,validateChunkUploadBytes} from '../../src/gpu-recovery.mjs';
import {FAR_RETENTION_LIMITS} from './far-buffer-retention.mjs';

const keyOK=k=>typeof k==='string'&&k.length>0&&k.length<=256;
const integers = (x)=>Number.isSafeInteger(x)&&x>=0;
const bytes=a=>a?.byteLength;
const matches=(a,b)=>a.length===b.length&&a.every((v,i)=>v===b[i]);
const snapshot=e=>({key:e.key,buffer:e.buffer,vertices:new Float32Array(e.vertices)});
const identicalBits=(a,b)=>a.byteLength===b.byteLength&&
  new Uint8Array(a.buffer,a.byteOffset,a.byteLength).every((v,i)=>
    v===new Uint8Array(b.buffer,b.byteOffset,b.byteLength)[i]);
const serialize=(s)=>Object.freeze({status:s.status,reason:s.reason??null,
  drawBlocked:s.drawBlocked,sourceOnly:true,liveIntegrationApproved:false,
  originalErrorCallsUntouched:true,worldSaveNotVerified:true,
  nativePeakObserved:s.nativePeakObserved,peakBytesObserved:s.peakBytesObserved,
  releasedKeys:Object.freeze([...s.releasedKeys]),restoredKeys:Object.freeze([...s.restoredKeys]),
  stagedKeys:Object.freeze([...s.stagedKeys])});
export function createMockNativeFarRollback({gl,original,desired,retainedKeys,world,
  gate,contextCurrent=()=>true}={}){
  // Deliberately unreachable from unmodified production WebGL2 contexts.
  if(gl?.__mythwrought291MockOnly!==true || !(gl.live instanceof Map) ||
    !Array.isArray(original)||!Array.isArray(desired)||!Array.isArray(retainedKeys)||
    !world||!keyOK(world.id)||!integers(world.revision)||
    !gate||typeof gate.block!=='function'||typeof gate.unblock!=='function'||
    typeof gate.isBlocked!=='function'||typeof contextCurrent!=='function')
    throw Error('291_MOCK_ONLY_INVALID_NATIVE_TRANSITION_INPUT');
  if(typeof gl.deleteBuffer!=='function'||typeof gl.getError!=='function')
    throw Error('291_MOCK_ONLY_NO_ORIGINAL_BUFFER_INTERFACE');
  const keysOK=items=>items.length<=FAR_RETENTION_LIMITS.maxChunks&&
    items.every(x=>keyOK(x?.key)&&x.vertices instanceof Float32Array&&
      bytes(x.vertices)>0&&bytes(x.vertices)<=FAR_RETENTION_LIMITS.maxBytes&&
      x.vertices.length%9===0)&&new Set(items.map(x=>x.key)).size===items.length;
  if(!keysOK(original)||!keysOK(desired)||!matches(retainedKeys,original.slice(0,retainedKeys.length).map(x=>x.key))||
    !matches(retainedKeys,desired.slice(0,retainedKeys.length).map(x=>x.key))||
    original.some(x=>!x.buffer||!gl.live.has(x.buffer)||gl.live.get(x.buffer)?.bytes!==x.vertices.byteLength||
      !(gl.live.get(x.buffer)?.data instanceof Float32Array)||
      !identicalBits(gl.live.get(x.buffer).data,x.vertices)))
    throw Error('291_MOCK_ONLY_INVALID_ORIGINAL_SOURCE_ORDER_OR_RESIDENCY');
  // Store independent original typed-array snapshots BEFORE the first GL call.
  const old=original.map(snapshot);
  const next=desired.map(x=>({key:x.key,vertices:new Float32Array(x.vertices)}));
  const retained=retainedKeys.length;
  const drop=old.slice(retained),create=next.slice(retained);
  const countBytes=a=>a.reduce((n,x)=>n+x.vertices.byteLength,0);
  const oldBytes=countBytes(old),finalBytes=countBytes(old.slice(0,retained))+countBytes(create);
  if(oldBytes>FAR_RETENTION_LIMITS.maxBytes||finalBytes>FAR_RETENTION_LIMITS.maxBytes||
    old.slice(0,retained).some((x,i)=>!identicalBits(x.vertices,next[i].vertices))||
    !matches(old.slice(retained).map(x=>x.key),create.slice(0,drop.length).map(x=>x.key)))
    throw Error('291_MOCK_ONLY_INVALID_FINAL_GPU_BUDGET_OR_SOURCE_IDENTITY');
  if(gl.live.size!==old.length||[...gl.live.keys()].some(b=>!old.some(x=>x.buffer===b)))
    throw Error('291_MOCK_ONLY_UNKNOWN_NATIVE_RESOURCE_OWNER');
  if(!contextCurrent())throw Error('291_MOCK_ONLY_STALE_GL_CONTEXT');
  const s={status:'unstarted',reason:null,drawBlocked:true,
    nativePeakObserved:gl.live.size,peakBytesObserved:oldBytes,
    releasedKeys:[],restoredKeys:[],stagedKeys:[]};
  let result=null,phase='new',retainedOld=old.slice(0,retained),staged=[];
  const observe=()=>{
    const n=gl.live.size,b=[...gl.live.values()].reduce((sum,r)=>sum+(r.bytes??0),0);
    s.nativePeakObserved=Math.max(s.nativePeakObserved,n);
    s.peakBytesObserved=Math.max(s.peakBytesObserved,b);
    if(n>FAR_RETENTION_LIMITS.maxChunks||b>FAR_RETENTION_LIMITS.maxBytes)
      throw Error('291_MOCK_ONLY_NATIVE_PEAK_BUDGET_BREACH');
  };
  const cleanup=entries=>{for(const e of entries){if(!contextCurrent())return;
    if(gl.live.has(e.buffer))gl.deleteBuffer(e.buffer);
    observe();}};
  const beforeWorld={id:world.id,revision:world.revision};
  const blocked=()=>{if(!gate.isBlocked())throw Error('291_MOCK_ONLY_STALE_DRAW_NOT_BLOCKED');};
  const fail=(reason)=>{
    // A caller that bypassed the draw gate must not leave it open on failure.
    if(!gate.isBlocked()){try{gate.block();}catch(_){reason+='; gate-reblock-failed';}}
    s.status='blocked';s.drawBlocked=gate.isBlocked();
    s.reason=String(reason);phase='blocked';return serialize(s);
  };
  function run(){
    if(phase!=='new')throw Error('291_MOCK_ONLY_TRANSACTION_ALREADY_STARTED');
    gate.block();blocked();phase='running';s.status='in-flight';
    const needEarlyDelete=old.length+create.length>FAR_RETENTION_LIMITS.maxChunks||
      oldBytes+countBytes(create)>FAR_RETENTION_LIMITS.maxBytes;
    const retired=[];
    try{
      if(!contextCurrent())return fail('context-lost-before-start');
      if(needEarlyDelete){
        // Drop the old SUFFIX FIRST. The live far renderer must be blocked.
        // If this operation fails, the GPU backup is not guaranteed.
        for(const e of drop){blocked();gl.deleteBuffer(e.buffer);retired.push(e);
          s.releasedKeys.push(e.key);observe();}
      }
      for(const e of create){
        blocked();if(!contextCurrent())throw Error('context-lost-before-upload');
        const buffer=uploadChunkBuffer(gl,e.vertices); // exact original source
        staged.push({...e,buffer});s.stagedKeys.push(e.key);observe();
        if(!contextCurrent())throw Error('context-lost-after-upload');
      }
      if(!needEarlyDelete){for(const e of drop){blocked();gl.deleteBuffer(e.buffer);
        retired.push(e);s.releasedKeys.push(e.key);observe();}}
      if(!contextCurrent())throw Error('context-lost-before-publish');
      result=[...retainedOld,...staged];
      if(gl.live.size!==result.length||!matches(result.map(x=>x.key),next.map(x=>x.key)))
        throw Error('mock-native-publication-order-or-count-mismatch');
      phase='ready-for-world-commit';s.status=phase;
      return serialize(s);
    }catch(err){
      s.reason=String(err?.message??err);
      if(!contextCurrent())return fail('context-lost-during-transition');
      // Original uploadChunkBuffer already deletes its failed candidate.
      // Drop only successfully staged buffers before restoring old suffix.
      try{cleanup(staged);}catch(error){return fail('staged-cleanup-failed: '+error.message);}
      const recovered=[];
      try{
        for(const e of retired){blocked();if(!contextCurrent())throw Error('context-lost-during-rollback');
          const buffer=uploadChunkBuffer(gl,e.vertices); // original guarded checks
          recovered.push({...e,buffer});s.restoredKeys.push(e.key);observe();}
      }catch(error){
        // A partial native restoration is never allowed to render.
        try{cleanup(recovered);}catch(_ignore){}
        return fail('original-GPU-restore-failed: '+error.message);
      }
      result=[...retainedOld,...(retired.length?recovered:drop)];
      if(!matches(result.map(x=>x.key),old.map(x=>x.key))||
        gl.live.size!==old.length||result.some(x=>!gl.live.has(x.buffer)))
        return fail('original-buffer-order-or-native-restoration-incomplete');
      phase='old-gpu-restored-awaiting-world-rollback';s.status=phase;
      return serialize(s);
    }
  }
  function confirmWorld({id,revision,editRolledBack=false,saveVerified=false}={}){
    // These are explicit mock-only attestations, NOT real world/save proofs.
    if(!gate.isBlocked())return fail('draw-gate-was-reopened-prematurely');
    if(!contextCurrent()||!result||gl.live.size!==result.length||
      result.some(e=>!gl.live.has(e.buffer)))return fail('native-context-or-buffer-changed-before-publication');
    if(phase==='ready-for-world-commit'&&id===beforeWorld.id&&
       revision===beforeWorld.revision+1&&saveVerified===true){
      phase='committed-mock';s.status=phase;gate.unblock();s.drawBlocked=false;
      return serialize(s);
    }
    if(phase==='old-gpu-restored-awaiting-world-rollback'&&id===beforeWorld.id&&
       revision===beforeWorld.revision&&editRolledBack===true){
      phase='restored-mock';s.status=phase;gate.unblock();s.drawBlocked=false;
      return serialize(s);
    }
    return fail('world-save-or-rollback-attestation-invalid');
  }
  return Object.freeze({run,confirmWorld,state:()=>serialize(s),
    getMockBuffers:()=>phase==='committed-mock'||phase==='restored-mock'?[...result]:null});
}
