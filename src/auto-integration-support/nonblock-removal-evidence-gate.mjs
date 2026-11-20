// Strict opt-in cross-lane removal evidence gate. No production imports.
export function auditRemovalEvidence(e, expected) {
  const errors = [];
  const check = (ok, why) => { if (!ok) errors.push(why); };
  if (!e || typeof e !== 'object') return {accepted:false,live:false,errors:['evidence required']};
  check(expected?.productionEnabled === false, 'production must be disabled');
  check(/^[a-f0-9]{40}$/.test(expected?.commit ?? ''), 'exact commit required');
  check(e.sourceCommit === expected?.commit, 'source identity mismatch');
  check(e.contract === 'nonblock-object-v1' && e.saveSchema === 'schema-1', 'contract/schema mismatch');
  check(typeof e.key === 'string' && e.key.includes(':'), 'namespaced key required');
  check(e.provenance?.browser === 'Chromium' && e.provenance?.graphics === 'WebGL2' && e.provenance?.fixture === false && !!e.provenance?.runId, 'browser provenance missing');
  const names = ['before','picked','removed','reloaded'];
  check(Array.isArray(e.steps) && e.steps.length === 4, 'four ordered steps required');
  if (Array.isArray(e.steps) && e.steps.length === 4) {
    e.steps.forEach((s,i) => {
      check(s?.name === names[i], 'step order mismatch');
      check(s?.key === e.key && s?.seed === e.seed, 'key or seed drift');
      check(s?.neighborDigest === e.steps[0]?.neighborDigest, 'neighbor damage');
      check(s?.editDigest === e.steps[0]?.editDigest, 'world edit damage');
      check(/^[a-f0-9]{64}$/.test(s?.backupDigest ?? ''), 'backup evidence missing');
    });
    check(e.steps[0]?.visible === true && e.steps[1]?.visible === true, 'missing pre-break object');
    check(e.steps[2]?.visible === false && e.steps[3]?.visible === false, 'object respawned');
    check(e.steps[0]?.tombstone === false && e.steps[1]?.tombstone === false && e.steps[2]?.tombstone === true && e.steps[3]?.tombstone === true, 'tombstone lifecycle mismatch');
    check(e.steps[1]?.pickedKey === e.key && e.steps[2]?.removedKey === e.key, 'wrong object selected or removed');
    check(e.steps[3]?.coldReload === true && e.steps[3]?.saveSchema === 'schema-1', 'cold reload missing');
  }
  for (const size of ['667x375','844x390','932x430']) {
    const found = Array.isArray(e.captures) ? e.captures.filter(c => c.size === size) : [];
    check(found.length === 1 && /^[a-f0-9]{64}$/.test(found[0]?.sha256 ?? ''), 'missing/duplicate capture '+size);
  }
  // Self-declared provenance is not authenticated Git-tree or real browser evidence.
  return {accepted:errors.length === 0,live:false,errors};
}
