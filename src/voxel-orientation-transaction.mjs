// Opt-in, unshipped transaction adapter. No schema-1 or live world hooks.
// World host supplies an atomic reversible edit and a world-identity reader.
// The undo callback must restore the world before the original error escapes.
export async function commitOrientedEdit({cell, sidecar, readIdentity, edit, rollback}) {
  if (!Array.isArray(cell) || cell.length !== 3 || !cell.every(Number.isSafeInteger))
    throw new TypeError('Invalid cell');
  if (!sidecar || typeof sidecar.get !== 'function' || typeof sidecar.invalidateEdit !== 'function')
    throw new TypeError('Invalid orientation sidecar');
  if ([readIdentity, edit, rollback].some(fn => typeof fn !== 'function'))
    throw new TypeError('Missing transaction callback');
  const key = [...cell];
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
}
