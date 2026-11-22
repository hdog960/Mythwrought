// MYTHWROUGHT #291 — detached C6 far-wall GPU transition protocol MODEL.
// No live renderer import, WebGL handles, original error-check changes, or saves.
// Nothing here may authorize drawing or native integration: the cave owner must
// provide the actual transaction, source provenance, GL calls and rollback.
import {preflightFarBufferTransition} from './far-buffer-transition.mjs';
import {FAR_RETENTION_LIMITS} from './far-buffer-retention.mjs';

const keyOk = x=>typeof x==='string'&&x.length>0&&x.length<=256;
const finiteInt = x=>Number.isSafeInteger(x) && x >= 0;
const immutable = data=>Object.freeze(data);
const copyKeys = x=>Object.freeze([...x]);
const oldKeys = before=>Array.isArray(before?.resident)?before.resident.map(x=>x?.key).filter(keyOk):[];

/**
 * A reference protocol for a later owner-approved native GPU integration.
 * These are ONLY logical staged buffer *receipts*, NEVER WebGL handles.
 * All outcomes forbid drawing. The real renderer must re-verify provenance,
 * commit with original buffer error checks, and implement world-edit rollback.
 */
export function createSourceOnlyFarTransaction({before,after,edit,source}={}) {
  const plan=preflightFarBufferTransition({before,after,edit,source});
  const token=immutable({
    worldId: before?.worldId ?? null,
    worldRevision: after?.worldRevision ?? null,
    contextId: before?.contextId ?? null,
    contextGeneration: before?.contextGeneration ?? null
  });
  const resident=copyKeys(oldKeys(before));
  const planned=Array.isArray(after?.selected)?after.selected.map(x=>x?.key):[];
  const reject=(reason,phase='requires-original-full-invalidation',staged=[])=>immutable({
    phase,reason,token,drawBlocked:true,ownerApprovalRequired:true,
    liveIntegrationApproved:false,originalGlErrorPolicyUnchanged:true,
    originalResidentKeys:resident,retainedKeys:copyKeys([]),
    releaseKeys:resident,expectedRebuildKeys:copyKeys([]),
    stagedReceipts:copyKeys(staged),candidatePublicationKeys:copyKeys([]),
    estimatedBytes:0,requiresFreshRayPlan:true,
    requiresWorldEditRollbackOnNativeFailure:true,
    requiresNativePeakBudgetAndSourceProvenanceProof:true
  });
  if(plan.decision==='invalidate-all')return reject(plan.reason);
  if(!Array.isArray(after?.selected)||planned.some(x=>!keyOk(x))||
    new Set(planned).size!==planned.length||planned.length>FAR_RETENTION_LIMITS.maxChunks)
    return reject('invalid-selected-source-snapshot');
  if(!Array.isArray(plan.retainKeys)||!Array.isArray(plan.rebuildKeys)||
    !Array.isArray(plan.releaseKeys)||
    plan.retainKeys.some(x=>!keyOk(x))||plan.rebuildKeys.some(x=>!keyOk(x)))
    return reject('invalid-preflight-transition-contract');
  const retained=copyKeys(plan.retainKeys),rebuild=copyKeys(plan.rebuildKeys);
  if([...retained,...rebuild].join('|')!==planned.join('|') ||
    retained.some((x,i)=>x!==resident[i]) ||
    [...retained,...rebuild].length!==planned.length)
    return reject('preflight-order-or-residency-mismatch');
  // All metadata passed to the native integrator is a SNAPSHOT. No caller
  // mutation of original arrays can influence the expected upload sequence.
  const snapshot = immutable({
    worldId:token.worldId,worldRevision:token.worldRevision,
    contextId:token.contextId,contextGeneration:token.contextGeneration,
    orderedSources:copyKeys(planned),
    retainedKeys:retained,
    releaseKeys:copyKeys(plan.releaseKeys),
    expectedRebuildKeys:rebuild,
    retainedBytes:plan.estimatedRetainedBytes,
    drawBlocked:true,ownerApprovalRequired:true,liveIntegrationApproved:false,
    originalGlErrorPolicyUnchanged:true,requiresFreshRayPlan:true,
    originalResidentKeys:resident,
    requiresNativePeakBudgetAndSourceProvenanceProof:true
  });
  if(!finiteInt(snapshot.retainedBytes)||snapshot.retainedBytes>FAR_RETENTION_LIMITS.maxBytes)
    return reject('invalid-retained-byte-budget');
  // A closure owns the state: clients cannot assign state fields or bypass
  // sequential stage order by mutating a returned object.
  let phase='staging',staged=[],bytes=snapshot.retainedBytes;
  const rejectReceipt=reason=>immutable({
    accepted:false,phase,reason,drawBlocked:true,
    needsNativeRollback:true,liveIntegrationApproved:false
  });
  const state=()=>immutable({
    phase,drawBlocked:true,ownerApprovalRequired:true,
    liveIntegrationApproved:false,originalGlErrorPolicyUnchanged:true,
    token,retainedKeys:retained,releaseKeys:snapshot.releaseKeys,
    expectedRebuildKeys:rebuild,stagedReceipts:copyKeys(staged),
    nextExpectedKey:phase==='staging'?(rebuild[staged.length]??null):null,estimatedBytes:bytes,
    requiresWorldEditRollbackOnNativeFailure:true,
    requiresNativePeakBudgetAndSourceProvenanceProof:true
  });
  const stage=receipt=>{
    if(phase!=='staging')return rejectReceipt('not-in-staging-phase');
    const expected=rebuild[staged.length];
    if(!expected)return rejectReceipt('no-more-expected-stage-uploads');
    if(!receipt||receipt.key!==expected ||
       receipt.worldId!==token.worldId||receipt.worldRevision!==token.worldRevision||
       receipt.contextId!==token.contextId||receipt.contextGeneration!==token.contextGeneration){
      // An attempted native upload with stale provenance makes the entire
      // staged transaction suspect; do not accept a later corrected receipt.
      phase='aborted';
      return rejectReceipt('wrong-source-world-or-context-receipt');
    }
    if(!finiteInt(receipt.bytes)||receipt.bytes===0||
       bytes+receipt.bytes>FAR_RETENTION_LIMITS.maxBytes){
      phase='aborted';return rejectReceipt('staged-byte-budget-or-size-failure');
    }
    // Real WebGL upload provenance and gl.getError success remain the native
    // adapter's duty. In this model a synthetic receipt is NOT that evidence.
    staged.push(immutable({key:receipt.key,bytes:receipt.bytes,
      worldRevision:token.worldRevision,contextGeneration:token.contextGeneration}));
    bytes+=receipt.bytes;
    return immutable({accepted:true,phase,drawBlocked:true,
      nextExpectedKey:rebuild[staged.length]??null,
      estimatedBytes:bytes,liveIntegrationApproved:false,
      requiresNativePeakBudgetAndSourceProvenanceProof:true});
  };
  const prepare=()=>{
    if(phase!=='staging')return rejectReceipt('not-in-staging-phase');
    if(staged.length!==rebuild.length)return rejectReceipt('missing-staged-original-source-buffers');
    if(bytes>FAR_RETENTION_LIMITS.maxBytes || planned.length>FAR_RETENTION_LIMITS.maxChunks){
      phase='aborted';return rejectReceipt('post-stage-original-gpu-budget-overrun');
    }
    phase='awaiting-native-commit';
    return immutable({prepared:true,phase,token,drawBlocked:true,
      retainedKeys:retained,stagedKeys:copyKeys(staged.map(s=>s.key)),
      expectedOriginalDrawOrder:copyKeys(planned),
      releaseKeys:snapshot.releaseKeys,
      totalExpectedResidentBytes:bytes,
      // These are *instructions* for a possible owner-approved native
      // adapter, not proof of actual GPU buffers or completed transactions.
      nativeUploadValidationRequired:true,nativeRollbackRequired:true,
      nativeCommitted:false,liveIntegrationApproved:false,
      originalGlErrorPolicyUnchanged:true,
      requiresNativePeakBudgetAndSourceProvenanceProof:true
    });
  };
  const abort=(reason='aborted-by-caller')=>{
    phase='aborted';
    return immutable({aborted:true,reason,phase,drawBlocked:true,
      nativeRollbackRequired:true,liveIntegrationApproved:false,
      syntheticReceiptsToDiscard:copyKeys(staged.map(s=>s.key)),
      // No GPU deletions performed. Owner must roll back or discard the
      // old and staged buffers before any subsequent far-wall draw.
      originalResidentKeys:resident
    });
  };
  return immutable({snapshot,state,stage,prepare,abort});
}
