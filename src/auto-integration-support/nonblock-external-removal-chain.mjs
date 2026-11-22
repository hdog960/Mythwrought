// :12 opt-in, non-production trace-chain validator. Never imports producers or invokes :00.
const fail = reason => ({ok:false,live:false,reason});
const hex40 = s => typeof s==='string' && /^[a-f0-9]{40}$/.test(s);
const unique = a => Array.isArray(a) && a.every(x=>typeof x==='string' && x.startsWith('nb1:')) && new Set(a).size===a.length;
const equal = (a,b) => a.length===b.length && a.every(x=>b.includes(x));
export function verifyExternalRemovalChain({provenance, stages, target, seed}={}) {
  if (!provenance || !hex40(provenance.mainCommit) || !hex40(provenance.coreCommit) ||
      !['24','36','48'].every(k=>hex40(provenance.producerCommits?.[k])) ||
      provenance.kind!=='external-real-hook-capture' || provenance.schema1BackupVerified!==true)
    return fail('authenticated external provenance and backup evidence required');
  if (!seed || !target?.startsWith('nb1:') || !Array.isArray(stages) || stages.length!==4)
    return fail('seed, target and four lifecycle stages required');
  const phases=['before','picked','removed','reloaded'];
  for (let i=0;i<4;i++) {
    const s=stages[i];
    if (!s || s.phase!==phases[i] || s.seed!==seed || !unique(s.visible) ||
        !unique(s.tombstones) || !hex40(s.captureSha) ||
        !['real-core','real-schema1-reload'].includes(s.origin))
      return fail('stage identity, provenance or key set invalid');
    if (i<3 && s.origin!=='real-core' || i===3 && s.origin!=='real-schema1-reload')
      return fail('incorrect lifecycle capture origin');
    if (s.visible.some(k=>s.tombstones.includes(k))) return fail('visible tombstoned object');
  }
  const [before,picked,removed,reloaded]=stages;
  if (!before.visible.includes(target) || before.tombstones.includes(target))
    return fail('target absent or previously removed');
  if (!equal(before.visible,picked.visible) || !equal(before.tombstones,picked.tombstones) ||
      picked.pickedKey!==target) return fail('picking mutated scene or selected wrong object');
  const remaining=before.visible.filter(k=>k!==target);
  if (!equal(removed.visible,remaining) || !equal(reloaded.visible,remaining))
    return fail('removal/reload lost neighbor or respawned target');
  const tombstones=[...before.tombstones,target];
  if (!equal(removed.tombstones,tombstones) || !equal(reloaded.tombstones,tombstones))
    return fail('tombstone delta or reload mismatch');
  if (removed.saveSchema!==1 || reloaded.saveSchema!==1 ||
      removed.saveSeed!==seed || reloaded.saveSeed!==seed ||
      removed.backupPreserved!==true || reloaded.backupPreserved!==true)
    return fail('schema-1 seed or backup evidence missing');
  if (!Array.isArray(reloaded.worldEditKeys) || !Array.isArray(before.worldEditKeys) ||
      !equal(reloaded.worldEditKeys,before.worldEditKeys))
    return fail('existing world edits changed');
  // This is a structural gate only. Claimed provenance must be independently authenticated.
  return {ok:true,live:false,traceConsistent:true,requiresIndependentCaptureAuthentication:true};
}
