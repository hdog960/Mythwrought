// :00 opt-in bridge to an authoritative host transaction. No live world wiring.
// A host MUST implement atomic compareAndWriteMany; per-cell CAS is insufficient
// because a competing nonparticipating writer could otherwise cause partial edits.
const validCell = c => Array.isArray(c) && c.length === 3 && c.every(Number.isSafeInteger);
const validId = n => Number.isSafeInteger(n) && n >= 0 && n < 255;
const validRevision = n => Number.isSafeInteger(n) && n >= 0 && n < Number.MAX_SAFE_INTEGER;

export function createAuthoritativeVoxelEditBridge(host) {
  if (!host || typeof host.read !== 'function' ||
      typeof host.compareAndWriteMany !== 'function')
    throw new TypeError('Atomic host read and compareAndWriteMany required');
  return Object.freeze({
    async editMany(receipts, prepare = () => {}, signal = null) {
      if (!Array.isArray(receipts) || receipts.length < 1 || receipts.length > 256 ||
          typeof prepare !== 'function') throw new TypeError('Invalid transaction');
      if (signal !== null && (typeof signal.aborted !== 'boolean' ||
          typeof signal.addEventListener !== 'function'))
        throw new TypeError('Invalid abort signal');
      const seen = new Set();
      const snapshot = receipts.map(r => {
        if (!validCell(r?.cell) || !validId(r.expectedId) ||
            !validId(r.nextId) || !validRevision(r.expectedRevision) ||
            (r.expectedOrientationEpoch !== undefined && !validRevision(r.expectedOrientationEpoch)) ||
            (r.expectedTurn !== undefined && r.expectedTurn !== null &&
             (!Number.isSafeInteger(r.expectedTurn) || r.expectedTurn < 0 || r.expectedTurn > 3)))
          throw new TypeError('Invalid receipt');
        const key = r.cell.join(',');
        if (seen.has(key)) throw new TypeError('Duplicate cell');
        seen.add(key);
        return Object.freeze({cell:Object.freeze([...r.cell]),
          expectedId:r.expectedId, expectedRevision:r.expectedRevision, nextId:r.nextId,
          ...(r.expectedTurn !== undefined ? {expectedTurn:r.expectedTurn} : {}),
          ...(r.expectedOrientationEpoch !== undefined ? {expectedOrientationEpoch:r.expectedOrientationEpoch} : {})});
      });
      const cancelled = () => {
        if (signal?.aborted) throw new DOMException('Voxel edit aborted','AbortError');
      };
      cancelled();
      for (const r of snapshot) {
        const current = host.read(r.cell);
        if (!current || current.id !== r.expectedId ||
            current.revision !== r.expectedRevision ||
            (r.expectedTurn !== undefined && current.turn !== r.expectedTurn) ||
            (r.expectedOrientationEpoch !== undefined && (typeof host.readOrientationEpoch !== 'function' || host.readOrientationEpoch(r.cell) !== r.expectedOrientationEpoch))) return false;
      }
      await prepare();
      cancelled();
      // The host performs the FINAL authoritative validation and ALL writes in
      // one indivisible operation, including orientation invalidation on success.
      // It must return false without side effects if any receipt is stale.
      const committed = host.compareAndWriteMany(snapshot);
      if (typeof committed !== 'boolean') throw new TypeError('Host returned nonboolean');
      return committed;
    }
  });
}
