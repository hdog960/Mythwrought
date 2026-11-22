// MYTHWROUGHT #291 — SOURCE-ONLY certified C6 far-buffer transition preflight.
// Companion to far-buffer-retention.mjs; not imported by the live game.
// Zero WebGL calls, zero saves, no GL error changes. The cave owner must approve
// any adapter touching actual C6 GPU buffers and the native render pipeline.
import {affectedFarSourceKeys, planFarWallEditRetention, FAR_RETENTION_LIMITS}
  from './far-buffer-retention.mjs';

const COMPANIONS=['companion','seamCompanion','wideWitnessCompanion'];
const validInt = x => Number.isSafeInteger(x);
const id = x => typeof x === 'string' && x.length > 0 && x.length <= 256;

// A physical source buffer must be provably composed from the exact original
// section meshes. Source-ray vote counts are not GPU geometry provenance.
function meshSignature(descriptor, depthMeshKey, sectionBounds) {
  if (!descriptor || typeof descriptor !== 'object' || Array.isArray(descriptor)) return null;
  const pieces=[descriptor, ...COMPANIONS.map(k=>descriptor[k]??null)];
  const seen=new Set();
  const out=[];
  for(const source of pieces){
    if(source===null){out.push(null);continue;}
    if(typeof source !== 'object' || Array.isArray(source) ||
       ![source.cx,source.cz,source.section].every(validInt) ||
       typeof source.key !== 'string') return null;
    try {
      const bounds=sectionBounds(source.section);
      if(!bounds || !validInt(bounds.minY) || !validInt(bounds.maxY) ||
         bounds.minY>bounds.maxY || depthMeshKey(source.cx,source.cz,source.section)!==source.key)
        return null;
    } catch {return null;}
    if(seen.has(source.key))return null;
    seen.add(source.key);
    out.push([source.key,source.cx,source.cz,source.section]);
  }
  return JSON.stringify(out);
}

// Provenance is intentionally explicit: the renderer's current source does
// not yet record context/world generations on every far GPU buffer. This
// preflight must therefore fail closed until an owner-approved adapter can
// supply real metadata. Never invent these fields based on Map membership.
export function preflightFarBufferTransition({before,after,edit,source}={}) {
  const existing=Array.isArray(before?.resident)?before.resident:[];
  const release=existing.map(x=>x?.key).filter(id);
  const fallback=reason=>({
    decision:'invalidate-all',reason,retainKeys:[],releaseKeys:release,
    rebuildKeys:[],requiresFreshRayPlan:true,drawBlockedUntilCommitted:true,
    mustUseOriginalErrorChecks:true,ownerApprovalRequired:true,
    liveIntegrationApproved:false
  });
  const {editAffectedChunks,verticalEditSections,depthMeshKey,sectionBounds}=source||{};
  if (![editAffectedChunks,verticalEditSections,depthMeshKey,sectionBounds].every(f=>typeof f==='function'))
    return fallback('untrusted-original-source-contract');
  if (!before || !after || !id(before.worldId) || before.worldId!==after.worldId ||
      !id(before.contextId) || before.contextId!==after.contextId)
    return fallback('world-or-webgl-context-changed');
  if (![before.worldRevision,after.worldRevision,before.contextGeneration,after.contextGeneration,
        before.planForRevision,after.planForRevision].every(validInt) ||
      before.worldRevision<0 || after.worldRevision!==before.worldRevision+1 ||
      before.contextGeneration<0 || after.contextGeneration!==before.contextGeneration ||
      before.planForRevision!==before.worldRevision || after.planForRevision!==after.worldRevision ||
      after.rayPlanRecomputed!==true)
    return fallback('unproven-world-revision-context-generation-or-new-ray-plan');
  if (after.nearReady!==true || after.streamingStable!==true)
    return fallback('near-streaming-or-visibility-uncertain');
  const prev=before.selected, next=after.selected;
  if(!Array.isArray(prev)||!Array.isArray(next)||!Array.isArray(before.resident) ||
      prev.length>FAR_RETENTION_LIMITS.maxChunks || next.length>FAR_RETENTION_LIMITS.maxChunks ||
      before.resident.length>FAR_RETENTION_LIMITS.maxChunks)
    return fallback('unknown-or-oversized-source-selection');
  const originalSources=prev.map(x=>meshSignature(x,depthMeshKey,sectionBounds));
  const newSources=next.map(x=>meshSignature(x,depthMeshKey,sectionBounds));
  if ([...originalSources,...newSources].some(x=>x===null))
    return fallback('invalid-or-out-of-range-physical-source');
  let occupied=0;
  for(let i=0;i<before.resident.length;i++){
    const buffer=before.resident[i];
    if (!buffer || !validInt(buffer.bytes) || buffer.bytes<=0 ||
        !validInt(buffer.contextGeneration) ||
        buffer.contextGeneration!==before.contextGeneration ||
        !validInt(buffer.planForRevision) || buffer.planForRevision!==before.planForRevision ||
        buffer.key!==prev[i]?.key ||
        meshSignature(buffer.source,depthMeshKey,sectionBounds)!==originalSources[i])
      return fallback('unproven-resident-gpu-buffer-provenance');
    occupied+=buffer.bytes;
  }
  if(occupied>FAR_RETENTION_LIMITS.maxBytes)
    return fallback('resident-far-gpu-byte-budget-exceeded');
  let affected;
  try{
    affected=affectedFarSourceKeys(edit,{editAffectedChunks,verticalEditSections,depthMeshKey});
  }catch{return fallback('invalid-or-out-of-range-real-edit');}
  const decision=planFarWallEditRetention({
    beforeSelected:prev,afterSelected:next,
    resident:before.resident.map(b=>({key:b.key,bytes:b.bytes})),
    affectedKeys:affected,nearReady:true,depthMeshKey
  });
  if(decision.mode==='invalidate-all')
    return {...fallback(decision.reason),affectedKeys:[...affected]};
  const kept=new Set(decision.retainKeys);
  const rebuildKeys=next.filter(x=>!kept.has(x.key)).map(x=>x.key);
  return {
    decision:decision.mode,reason:decision.reason,
    retainKeys:decision.retainKeys,releaseKeys:decision.releaseKeys,
    rebuildKeys,affectedKeys:[...affected],
    estimatedRetainedBytes:before.resident.filter(x=>kept.has(x.key))
      .reduce((n,b)=>n+b.bytes,0),
    requiresFreshRayPlan:true,
    drawBlockedUntilCommitted:true,
    // Even a successful *pure* decision may not be used to draw while a GPU
    // transition is uncommitted. Live integration is a separate, owner-gated
    // native WebGL and pixel-acceptance milestone.
    mustUseOriginalErrorChecks:true,ownerApprovalRequired:true,
    liveIntegrationApproved:false
  };
}
