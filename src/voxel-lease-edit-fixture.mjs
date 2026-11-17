// Opt-in :00 coordinator for serialized fixture edits; no production host wiring.
// Every writer MUST share the same scope; this cannot protect external writers.
import {withVoxelCellLease} from './voxel-cell-lease.mjs';

export function createLeasedLegacyEditor(session, scope = {}) {
  if (!session || typeof session.editMany !== 'function' ||
      typeof session.read !== 'function' || typeof session.orientation !== 'function')
    throw new TypeError('A revisioned legacy session is required');
  if ((typeof scope !== 'object' || scope === null) && typeof scope !== 'function')
    throw new TypeError('Invalid lease scope');
  return Object.freeze({
    async editMany(receipts, beforeCommit = () => {}) {
      if (!Array.isArray(receipts) || receipts.length < 1 || receipts.length > 256 ||
          typeof beforeCommit !== 'function') throw new TypeError('Invalid transaction');
      // Snapshot all untrusted receipt fields before yielding to an async callback.
      const snapshot = receipts.map(r => {
        if (!r || !Array.isArray(r.cell) || r.cell.length !== 3 ||
            !r.cell.every(Number.isSafeInteger))
          throw new TypeError('Invalid edit cell');
        return Object.freeze({
          cell: Object.freeze([...r.cell]),
          expectedId: r.expectedId,
          expectedRevision: r.expectedRevision,
          nextId: r.nextId
        });
      });
      return withVoxelCellLease(scope, snapshot.map(r => r.cell), async () => {
        await beforeCommit();
        // editMany preflights all expected revisions and either commits every
        // cell or none. Orientation is invalidated only for successful writes.
        return session.editMany(snapshot);
      });
    },
    read: cell => session.read(cell),
    orientation: cell => session.orientation(cell)
  });
}
