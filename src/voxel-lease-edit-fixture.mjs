// Opt-in :00 coordinator for serialized fixture edits; no production host wiring.
// Every writer MUST share the same scope; this cannot protect external writers.
import {withVoxelCellLease} from './voxel-cell-lease.mjs';

// Default leases are keyed by the authoritative session, not by each editor.
// Separate adapters for one session must never silently receive isolated locks.
export function createLeasedLegacyEditor(session, scope = session) {
  if (!session || typeof session.editMany !== 'function' ||
      typeof session.read !== 'function' || typeof session.orientation !== 'function')
    throw new TypeError('A revisioned legacy session is required');
  if ((typeof scope !== 'object' || scope === null) && typeof scope !== 'function')
    throw new TypeError('Invalid lease scope');
  return Object.freeze({
    async editMany(receipts, beforeCommit = () => {}, signal = null) {
      if (!Array.isArray(receipts) || receipts.length < 1 || receipts.length > 256 ||
          typeof beforeCommit !== 'function') throw new TypeError('Invalid transaction');
      if (signal !== null && (typeof signal !== 'object' ||
          typeof signal.addEventListener !== 'function' ||
          typeof signal.removeEventListener !== 'function' ||
          typeof signal.aborted !== 'boolean'))
        throw new TypeError('Invalid abort signal');
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
        // Cancellation is checked both before and after asynchronous preparation.
        // A late callback resolution must never commit after cancellation.
        if (signal?.aborted) throw new DOMException('Voxel edit aborted', 'AbortError');
        if (signal) {
          await new Promise((resolve, reject) => {
            const onAbort = () => reject(new DOMException('Voxel edit aborted', 'AbortError'));
            signal.addEventListener('abort', onAbort, {once:true});
            if (signal.aborted) onAbort();
            else Promise.resolve().then(() => {
              // An abort between listener registration and the queued callback
              // must not start preparation after the caller has cancelled it.
              if (signal.aborted) throw new DOMException('Voxel edit aborted', 'AbortError');
              return beforeCommit();
            }).then(resolve, reject);
          }).finally(() => signal.removeEventListener('abort', onAbort));
        } else await beforeCommit();
        if (signal?.aborted) throw new DOMException('Voxel edit aborted', 'AbortError');
        // editMany preflights all expected revisions and either commits every
        // cell or none. Orientation is invalidated only for successful writes.
        return session.editMany(snapshot);
      });
    },
    read: cell => session.read(cell),
    orientation: cell => session.orientation(cell)
  });
}
