// Opt-in, non-persistent edit transaction guard. Does not modify schema-1 saves.
const cellKey = (x, y, z) => `${x},${y},${z}`;
const validCell = (p) => Array.isArray(p) && p.length === 3 && p.every(Number.isSafeInteger);
export function createShapeEditTransactions({ readBlock, readOrientation, writeBlock, writeOrientation }) {
  for (const fn of [readBlock, readOrientation, writeBlock, writeOrientation]) {
    if (typeof fn !== 'function') throw new TypeError('four cell adapters required');
  }
  const revisions = new Map();
  const revision = (p) => revisions.get(cellKey(...p)) ?? 0;
  const snapshot = (p) => {
    if (!validCell(p)) throw new TypeError('integer cell coordinates required');
    return Object.freeze({ cell: Object.freeze([...p]), block: readBlock(...p), orientation: readOrientation(...p) ?? null, revision: revision(p) });
  };
  function apply(expected, nextBlock, nextOrientation = null) {
    if (!expected || !validCell(expected.cell) || !Number.isSafeInteger(nextBlock) || nextBlock < 0 || nextBlock > 254) return { ok: false, reason: 'invalid' };
    const p = expected.cell;
    if (revision(p) !== expected.revision || readBlock(...p) !== expected.block || (readOrientation(...p) ?? null) !== expected.orientation) return { ok: false, reason: 'stale' };
    if (nextOrientation !== null && (!Number.isInteger(nextOrientation) || nextOrientation < 0 || nextOrientation > 3)) return { ok: false, reason: 'orientation' };
    try {
      writeBlock(...p, nextBlock);
      writeOrientation(...p, nextOrientation);
    } catch (error) {
      try { writeBlock(...p, expected.block); writeOrientation(...p, expected.orientation); }
      catch (rollbackError) { throw new AggregateError([error, rollbackError], 'edit and rollback failed'); }
      return { ok: false, reason: 'write-failed' };
    }
    revisions.set(cellKey(...p), expected.revision + 1);
    return { ok: true, snapshot: snapshot(p) };
  }
  return Object.freeze({ snapshot, apply });
}
