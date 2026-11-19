// Opt-in, fail-closed :12 witness. No producer imports or runtime registration.
// External callback contracts must be supplied by :00 owner; fixtures are NOT live evidence.
export function auditRemovalReplay({ objects, pick, remove, snapshot, restore, seed, evidence } = {}) {
  const fail = (reason) => ({ ok: false, live: false, reason });
  if (!evidence || evidence.kind !== 'authenticated-real-hooks' || !evidence.sourceCommit ||
      !evidence.producerCommits || !evidence.schema1BackupVerified)
    return fail('real hook, producer, and schema-1 backup evidence required');
  if (!Array.isArray(objects) || objects.length < 2 || !seed)
    return fail('two or more objects and seed required');
  if (![pick, remove, snapshot, restore].every(fn => typeof fn === 'function'))
    return fail('missing lifecycle callback');
  const ids = objects.map(o => o?.instanceKey);
  if (ids.some(id => typeof id !== 'string' || !id.startsWith('nb1:')) ||
      new Set(ids).size !== ids.length) return fail('noncanonical or duplicate identity');
  if (objects.some(o => o.seed !== seed || o.breakable !== true ||
      !Array.isArray(o.selectionAabb) || o.selectionAabb.length !== 6 ||
      o.selectionAabb.some(n => !Number.isFinite(n)) ||
      o.selectionAabb.some((n,i) => i < 3 && n >= o.selectionAabb[i+3])))
    return fail('seed, breakability or selection AABB invalid');
  // This function deliberately does not invoke external hooks: :00 owns state changes.
  // A separately captured, immutable trace is required to prove the lifecycle.
  return {ok: true, live: false, readyForExternalTrace: true, ids};
}
export function verifyRemovalTrace({before, after, reloaded, removedKey, seed} = {}) {
  const fail = reason => ({ok:false, live:false, reason});
  if (![before,after,reloaded].every(x=>x && x.seed===seed && Array.isArray(x.visible) &&
      Array.isArray(x.tombstones))) return fail('missing seed-scoped trace');
  const ids = before.visible;
  if (new Set(ids).size!==ids.length || !ids.includes(removedKey)) return fail('invalid before');
  const expected = ids.filter(id=>id!==removedKey);
  for (const state of [after,reloaded]) {
    if (state.visible.length!==expected.length ||
        expected.some(id=>!state.visible.includes(id)) ||
        state.visible.includes(removedKey) ||
        !state.tombstones.includes(removedKey) ||
        state.tombstones.some(id=>id!==removedKey && !before.tombstones.includes(id)))
      return fail('removal, neighbor, or tombstone replay mismatch');
  }
  if (before.tombstones.some(id=>!after.tombstones.includes(id) || !reloaded.tombstones.includes(id)))
    return fail('historical tombstone lost');
  return {ok:true,live:false,traceConsistent:true};
}
