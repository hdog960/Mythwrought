// Isolated authoritative in-memory CAS fixture for the :00 orientation/edit contract.
// Not connected to production chunks, save payloads, or the UI.
const validId = id => Number.isSafeInteger(id) && id >= 0 && id < 255;
const validRev = rev => Number.isSafeInteger(rev) && rev >= 0;
const key = cell => {
  if (!Array.isArray(cell) || cell.length !== 3 || !cell.every(Number.isSafeInteger))
    throw new TypeError('Invalid voxel cell');
  return cell.join(',');
};
export function createRevisionedVoxelFixture(initial = []) {
  if (!Array.isArray(initial)) throw new TypeError('Invalid initial cells');
  const state = new Map();
  for (const entry of initial) {
    if (!entry || !validId(entry.id) || !validRev(entry.revision))
      throw new TypeError('Invalid initial voxel state');
    const k = key(entry.cell);
    if (state.has(k)) throw new TypeError('Duplicate initial voxel cell');
    state.set(k, {id: entry.id, revision: entry.revision});
  }
  return Object.freeze({
    read(cell) {
      const current = state.get(key(cell));
      return current ? {...current} : null;
    },
    compareAndWrite({cell, expectedId, expectedRevision, nextId} = {}) {
      const k = key(cell);
      if (![expectedId, nextId].every(validId) || !validRev(expectedRevision))
        throw new TypeError('Invalid atomic edit receipt');
      const current = state.get(k);
      if (!current || current.id !== expectedId || current.revision !== expectedRevision)
        return false;
      if (current.revision === Number.MAX_SAFE_INTEGER)
        return false; // Never wrap a revision and accidentally revive a stale writer.
      state.set(k, {id: nextId, revision: current.revision + 1});
      return true;
    }
  });
}
