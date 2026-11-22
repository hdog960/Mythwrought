// MYTHWROUGHT #291 — original C6 far GPU PEAK resource feasibility witness.
// Pure source-only arithmetic. Does not import, replace, call, or monkeypatch
// WebGL, cave source, shaders, world editing, or original gl.getError sites.
// It answers a narrow question the staging metadata protocol could not:
// could ALL new buffers be allocated while ALL old native buffers stay alive
// for genuine rollback, without crossing the original four-slot/1MiB cap?
// It never authorizes integration or drawing: real native buffer provenance,
// GL errors, actual transient allocation and rollback remain owner-gated.
import {FAR_RETENTION_LIMITS} from './far-buffer-retention.mjs';

const isKey = x => typeof x === 'string' && x.length > 0 && x.length <= 256;
const validByteCount = x => Number.isSafeInteger(x) && x > 0 && x % 36 === 0;
const isOrderedDistinct = a => Array.isArray(a) && a.every(isKey) &&
  new Set(a).size === a.length;
const frozen = x => Object.freeze(x);
const keys = a => frozen([...a]);
const origLimits = FAR_RETENTION_LIMITS;

export function assessFarPeakBufferFeasibility({snapshot,originalResident,sourceRebuildBytes}={}) {
  const conservative = (reason,details={}) => frozen({
    result:'blocked-unproven-input',reason,
    originalResidentCount:Array.isArray(originalResident)?originalResident.length:null,
    originalResidentBytes:null,requiredAllocations:null,requiredBytes:null,
    liveBeforeReleaseSlots:null,liveBeforeReleaseBytes:null,
    postReleaseSlots:null,postReleaseBytes:null,
    releasedOriginalKeys:keys([]),retainedOriginalKeys:keys([]),
    ...details,drawBlocked:true,liveIntegrationApproved:false,
    nativeRollbackProven:false,originalGlErrorPolicyUnchanged:true,
    requiresNativeResourceAndRollbackProof:true
  });
  if (!snapshot || !Array.isArray(originalResident) || !Array.isArray(sourceRebuildBytes))
    return conservative('missing-native-snapshots');
  const selected=snapshot.orderedSources,retained=snapshot.retainedKeys,
    released=snapshot.releaseKeys,needed=snapshot.expectedRebuildKeys,
    original=snapshot.originalResidentKeys;
  if (![selected,retained,released,needed,original].every(isOrderedDistinct))
    return conservative('invalid-original-source-orders');
  if (selected.length>origLimits.maxChunks || original.length>origLimits.maxChunks ||
      originalResident.length>origLimits.maxChunks || sourceRebuildBytes.length>origLimits.maxChunks)
    return conservative('original-four-slot-bound-exceeded');
  if (originalResident.some((r,i)=>!r || r.key!==original[i] || !validByteCount(r.bytes)))
    return conservative('untrusted-original-resident-byte-geometry');
  if (sourceRebuildBytes.some((r,i)=>!r || r.key!==needed[i] || !validByteCount(r.bytes)))
    return conservative('untrusted-or-out-of-order-native-mesh-geometry');
  if (original.join('\u0000')!==retained.concat(released).join('\u0000') ||
      selected.join('\u0000')!==retained.concat(needed).join('\u0000') ||
      originalResident.slice(0,retained.length).some((r,i)=>r.key!==retained[i]))
    return conservative('not-a-verified-retained-prefix-and-source-rebuild-suffix');
  if (!isKey(snapshot.worldId) || !isKey(snapshot.contextId) ||
      !Number.isSafeInteger(snapshot.worldRevision) || snapshot.worldRevision<0 ||
      !Number.isSafeInteger(snapshot.contextGeneration) || snapshot.contextGeneration<0 ||
      snapshot.drawBlocked!==true || snapshot.liveIntegrationApproved!==false ||
      snapshot.requiresNativePeakBudgetAndSourceProvenanceProof!==true)
    return conservative('unverified-native-transition-identity-or-safety-marker');
  if (originalResident.some(r=>r.contextId!==snapshot.contextId ||
      r.contextGeneration!==snapshot.contextGeneration ||
      r.worldId!==snapshot.worldId ||
      !Number.isSafeInteger(r.worldRevision) || r.worldRevision>snapshot.worldRevision))
    return conservative('old-native-buffer-context-world-or-revision-unverified');
  if (sourceRebuildBytes.some(r=>r.contextId!==snapshot.contextId ||
      r.contextGeneration!==snapshot.contextGeneration ||
      r.worldId!==snapshot.worldId || r.worldRevision!==snapshot.worldRevision))
    return conservative('new-native-source-context-world-or-revision-unverified');
  // Key equality NEVER means two physical GPU objects occupy one slot.
  // A replacement with the same source key as its live predecessor is a
  // second allocated WebGLBuffer until the older one is deleted.
  const oldBytes=originalResident.reduce((sum,r)=>sum+r.bytes,0);
  const stagedBytes=sourceRebuildBytes.reduce((sum,r)=>sum+r.bytes,0);
  const retainedBytes=originalResident.slice(0,retained.length)
    .reduce((sum,r)=>sum+r.bytes,0);
  // The existing preflight's byte count must agree with the ACTUAL native
  // resource inventory. Disagreeing records cannot certify peak allocation.
  if (oldBytes>origLimits.maxBytes || snapshot.retainedBytes!==retainedBytes)
    return conservative('native-original-byte-snapshot-disagreement');
  const finalSlots=retained.length+sourceRebuildBytes.length;
  const finalBytes=retainedBytes+stagedBytes;
  const peakWithOldSlots=originalResident.length+sourceRebuildBytes.length;
  const peakWithOldBytes=oldBytes+stagedBytes;
  const finalFits=finalSlots<=origLimits.maxChunks&&finalBytes<=origLimits.maxBytes;
  const stageWhileKeepingOldFits=peakWithOldSlots<=origLimits.maxChunks &&
    peakWithOldBytes<=origLimits.maxBytes;
  const result=!finalFits?'impossible-final-far-budget':
    stageWhileKeepingOldFits?'no-prerelease-needed-model-only':
    'pre-release-required-rollback-unproven';
  const safeRollbackWithoutPrerelease=finalFits && stageWhileKeepingOldFits;
  return frozen({
    result,
    reason:!finalFits?'new-final-far-buffer-set-exceeds-original-bound':
      stageWhileKeepingOldFits?'old-and-new-fit-together-before-native-commit':
      'old-and-new-cannot-coexist-under-original-gpu-cap',
    originalResidentCount:originalResident.length,originalResidentBytes:oldBytes,
    requiredAllocations:sourceRebuildBytes.length,requiredBytes:stagedBytes,
    liveBeforeReleaseSlots:peakWithOldSlots,liveBeforeReleaseBytes:peakWithOldBytes,
    postReleaseSlots:finalSlots,postReleaseBytes:finalBytes,
    originalSlotLimit:origLimits.maxChunks,originalByteLimit:origLimits.maxBytes,
    retainedOriginalKeys:keys(retained),releasedOriginalKeys:keys(released),
    necessaryEarlyDeleteBeforeStage:!stageWhileKeepingOldFits&&finalFits&&
      sourceRebuildBytes.length>0,
    canPreserveOriginalNativeBuffersUntilNewUploads: safeRollbackWithoutPrerelease,
    // Even if the math fits, native allocation, correct GL error checks,
    // complete GPU commit and true world/save rollback are NOT proved here.
    modelCapacityFitsAfterReplacement:finalFits,drawBlocked:true,
    liveIntegrationApproved:false,nativeRollbackProven:false,
    originalGlErrorPolicyUnchanged:true,
    requiresNativeResourceAndRollbackProof:true
  });
}
