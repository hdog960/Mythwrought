// :00 opt-in legacy recovery demonstrator. Never writes a schema-1 payload.
// The caller supplies already-decoded legacy block cells; orientation is transient.
import {createRevisionedVoxelFixture} from './voxel-revisioned-cas-fixture.mjs';

const validTurn = n => Number.isInteger(n) && n >= 0 && n <= 3;
const cellKey = cell => cell.join(',');

/**
 * Recover authoritative block identities from schema-1-style cells, dropping
 * all historical orientation metadata. Revisions begin at zero per load.
 * No sidecar is trusted until an explicit post-load edit supplies its revision.
 */
export function recoverLegacyVoxelSession(cells) {
  if (!Array.isArray(cells)) throw new TypeError('Invalid legacy cells');
  // Snapshot coordinates before validation. Never retain caller-owned arrays:
  // mutating a decoded save after recovery must not redirect future exports.
  const initial = cells.map(entry => ({
    cell: Array.isArray(entry?.cell) ? [...entry.cell] : entry?.cell,
    id: entry?.id, revision: 0
  }));
  const host = createRevisionedVoxelFixture(initial);
  const orientations = new Map();
  const get = cell => host.read(cell);
  return Object.freeze({
    read: get,
    orientation(cell) {
      const state = get(cell);
      if (!state) return null;
      const record = orientations.get(cellKey(cell));
      return record && record.id === state.id && record.revision === state.revision
        ? record.turn : null;
    },
    setOrientation(cell, id, revision, turn) {
      if (!validTurn(turn)) throw new TypeError('Invalid turn');
      const state = get(cell);
      if (!state || state.id !== id || state.revision !== revision) return false;
      orientations.set(cellKey(cell), {id, revision, turn});
      return true;
    },
    edit(cell, expectedId, expectedRevision, nextId) {
      const ok = host.compareAndWrite({cell, expectedId, expectedRevision, nextId});
      if (ok) orientations.delete(cellKey(cell)); // even same-ID replacements
      return ok;
    },
    editMany(receipts) {
      // Single-threaded fixture transaction: validate every receipt and expected
      // revision before changing any cell or clearing any orientation.
      if (!Array.isArray(receipts) || receipts.length === 0 || receipts.length > 256)
        throw new TypeError('Invalid edit batch');
      const seen = new Set();
      const prepared = receipts.map(receipt => {
        const {cell, expectedId, expectedRevision, nextId} = receipt ?? {};
        // read validates coordinate shape; snapshot it against caller mutation.
        const current = get(cell);
        const k = cellKey(cell);
        if (seen.has(k)) throw new TypeError('Duplicate edit cell');
        seen.add(k);
        if (![expectedId, nextId].every(id => Number.isSafeInteger(id) && id >= 0 && id < 255) ||
            !Number.isSafeInteger(expectedRevision) || expectedRevision < 0)
          throw new TypeError('Invalid edit receipt');
        return {cell: [...cell], expectedId, expectedRevision, nextId, current, key: k};
      });
      if (prepared.some(({current, expectedId, expectedRevision}) =>
        !current || current.id !== expectedId ||
        current.revision !== expectedRevision ||
        current.revision === Number.MAX_SAFE_INTEGER)) return false;
      for (const {cell, expectedId, expectedRevision, nextId, key} of prepared) {
        if (!host.compareAndWrite({cell, expectedId, expectedRevision, nextId}))
          throw new Error('Unexpected synchronous transaction conflict');
        orientations.delete(key);
      }
      return true;
    },
    exportLegacyCells() {
      // Explicitly omit rotation/revision. Preserve input order and block IDs.
      return initial.map(({cell}) => {
        const state = get(cell);
        return {cell: [...cell], id: state.id};
      });
    }
  });
}
