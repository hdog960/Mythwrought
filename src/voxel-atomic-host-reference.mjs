// :00 opt-in reference authoritative host for validating a future live adapter.
// Independent of the live world and its schema-1 storage implementation.
const validCell = c => Array.isArray(c) && c.length === 3 && c.every(Number.isSafeInteger);
const validId = id => Number.isSafeInteger(id) && id >= 0 && id < 255;
const key = c => c.join(',');
const copyCell = c => [...c];

export function createAtomicVoxelHost(initialCells) {
  if (!Array.isArray(initialCells)) throw new TypeError('Invalid legacy cells');
  const cells = new Map();
  for (const entry of initialCells) {
    if (!validCell(entry?.cell) || !validId(entry.id)) throw new TypeError('Invalid legacy cell');
    const k = key(entry.cell);
    if (cells.has(k)) throw new TypeError('Duplicate legacy cell');
    cells.set(k, {cell:copyCell(entry.cell),id:entry.id,revision:0,turn:null});
  }
  const read = cell => {
    if (!validCell(cell)) throw new TypeError('Invalid cell');
    const s = cells.get(key(cell));
    return s ? {id:s.id,revision:s.revision,turn:s.turn} : null;
  };
  const compareAndWriteMany = receipts => {
    if (!Array.isArray(receipts) || receipts.length < 1 || receipts.length > 256)
      throw new TypeError('Invalid batch');
    const seen = new Set();
    // Preflight the entire batch before any mutation. Nonparticipating host
    // writers must also advance revision and clear orientation.
    for (const r of receipts) {
      if (!validCell(r?.cell) || !validId(r.expectedId) || !validId(r.nextId) ||
          !Number.isSafeInteger(r.expectedRevision) || r.expectedRevision < 0)
        throw new TypeError('Invalid receipt');
      const k = key(r.cell);
      if (seen.has(k)) throw new TypeError('Duplicate cell');
      seen.add(k);
      const s = cells.get(k);
      if (!s || s.id !== r.expectedId || s.revision !== r.expectedRevision ||
          s.revision >= Number.MAX_SAFE_INTEGER - 1) return false;
    }
    for (const r of receipts) {
      const s = cells.get(key(r.cell));
      s.id = r.nextId;
      s.revision++;
      s.turn = null;
    }
    return true;
  };
  return Object.freeze({
    read, compareAndWriteMany,
    setOrientation(cell, expectedId, expectedRevision, turn) {
      if (!validCell(cell) || !Number.isSafeInteger(turn) || turn < 0 || turn > 3)
        throw new TypeError('Invalid orientation');
      const s = cells.get(key(cell));
      if (!s || s.id !== expectedId || s.revision !== expectedRevision) return false;
      s.turn = turn;
      return true;
    },
    externalWrite(cell, nextId) {
      if (!validCell(cell) || !validId(nextId)) throw new TypeError('Invalid external write');
      const s = cells.get(key(cell));
      if (!s || s.revision >= Number.MAX_SAFE_INTEGER - 1) return false;
      s.id = nextId;
      s.revision++;
      s.turn = null;
      return true;
    },
    exportLegacyCells() {
      return [...cells.values()].map(s => ({cell:copyCell(s.cell),id:s.id}));
    }
  });
}
