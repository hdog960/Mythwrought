// Opt-in :12 contract witness. No production imports or scene registration.
export function auditTombstoneIdentity({instances, remove, reload, seed}) {
  const errors = [];
  if (!Array.isArray(instances) || typeof seed !== 'string' || !seed) errors.push('invalid-input');
  if (typeof remove !== 'function' || typeof reload !== 'function') errors.push('missing-external-hooks');
  if (errors.length) return {ok:false, live:false, errors};
  const keys = new Set();
  for (const o of instances) {
    if (!o || typeof o.key !== 'string' || !o.key.includes(':') || /:r[0-9]+$/.test(o.key)) errors.push('noncanonical-key');
    if (o?.seed !== seed) errors.push('seed-mismatch');
    if (keys.has(o?.key)) errors.push('duplicate-key');
    keys.add(o?.key);
    if (!o?.selectable || !o?.breakable || !o?.persistent) errors.push('missing-lifecycle-contract');
  }
  if (errors.length) return {ok:false, live:false, errors:[...new Set(errors)]};
  // Callbacks are injected and untrusted. No fixture can certify live :00 wiring.
  for (const target of instances) {
    const removed = remove(target.key);
    if (removed !== true) errors.push('remove-failed');
    const restored = reload();
    if (!restored || !Array.isArray(restored.visibleKeys) || !Array.isArray(restored.tombstones)) {
      errors.push('reload-evidence-missing'); continue;
    }
    if (restored.visibleKeys.includes(target.key) || !restored.tombstones.includes(target.key)) errors.push('tombstone-not-preserved');
    for (const neighbor of instances) {
      if (neighbor.key !== target.key && !restored.visibleKeys.includes(neighbor.key) && !restored.tombstones.includes(neighbor.key)) errors.push('neighbor-lost');
    }
  }
  return {ok:errors.length===0, live:false, sourceAuthenticated:false, persistenceVerified:false, errors:[...new Set(errors)]};
}
