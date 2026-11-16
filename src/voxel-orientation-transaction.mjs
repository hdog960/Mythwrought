// Opt-in, unshipped transaction adapter. No schema-1 or live world hooks.
// World host supplies an atomic reversible edit and a world-identity reader.
// The undo callback must restore the world before the original error escapes.
// One in-flight edit per cell/sidecar. A rejected overlapping edit must not
// touch world state or orientation; different cells remain independent.
const activeEdits = new WeakMap();
export async function commitOrientedEdit({cell, sidecar, readIdentity, edit, rollback}) {
  if (!Array.isArray(cell) || cell.length !== 3 || !cell.every(Number.isSafeInteger))
    throw new TypeError('Invalid cell');
  if (!sidecar || typeof sidecar.get !== 'function' || typeof sidecar.invalidateEdit !== 'function')
    throw new TypeError('Invalid orientation sidecar');
  if ([readIdentity, edit, rollback].some(fn => typeof fn !== 'function'))
    throw new TypeError('Missing transaction callback');
  const key = [...cell];
  const address = key.join(',');
  let active = activeEdits.get(sidecar);
  if (!active) { active = new Set(); activeEdits.set(sidecar, active); }
  if (active.has(address)) throw new Error('Concurrent oriented edit on same cell');
  active.add(address);
  try {
  const before = await readIdentity(...key);
  if (!Number.isSafeInteger(before) || before < 0 || before >= 255)
    throw new TypeError('Invalid initial world identity');
  let result;
  try {
    result = await edit(...key);
    if (result !== true) {
      const after = await readIdentity(...key);
      if (after !== before) throw new Error('Rejected edit mutated world');
      return result;
    }
    // A success acknowledgement is not enough: the world may have become
    // unreadable or returned an invalid persistent ID during an async write.
    // Keep old rotation only when a failed write can be fully rolled back.
    const after = await readIdentity(...key);
    if (!Number.isSafeInteger(after) || after < 0 || after >= 255)
      throw new Error('Committed edit has invalid world identity');
    // A committed edit must invalidate the prior rotation, even if ID is unchanged.
    // This adapter requires exclusive per-cell edit ownership while awaiting.
    sidecar.invalidateEdit(key);
    return true;
  } catch (error) {
    // Rollback is mandatory, including when readback or the edit itself throws.
    // Never pretend rollback succeeded when the host fails to restore identity.
    try {
      await rollback(...key);
      const restored = await readIdentity(...key);
      if (restored !== before) throw new Error('Rollback did not restore world identity');
    } catch (rollbackError) {
      sidecar.invalidateEdit(key); // Fail closed: never keep a stale rotation.
      throw new AggregateError([error, rollbackError], 'World edit and rollback failed');
    }
    throw error;
  }
  } finally {
    active.delete(address);
    if (active.size === 0) activeEdits.delete(sidecar);
  }
}
