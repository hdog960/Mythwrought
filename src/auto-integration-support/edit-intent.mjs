// Integration-only adapter. Does not read or write production saves or terrain.
// Edits are explicit intent records, never inferred by comparing current and natural IDs.
const cellKey = (x,y,z) => `${x},${y},${z}`;
const validCell = p => p && ['x','y','z'].every(k => Number.isSafeInteger(p[k]));
const validId = n => Number.isSafeInteger(n) && n >= 0;
// Avoid subtraction beyond the exact integer range when sorting valid world cells.
const compareCell = (a,b) => {
  for (const axis of ['x','y','z']) {
    if (a[axis] < b[axis]) return -1;
    if (a[axis] > b[axis]) return 1;
  }
  return 0;
};
export function createEditIntentLedger(edits, {registeredIds = []} = {}) {
  if (!Array.isArray(edits) || !Array.isArray(registeredIds) || !registeredIds.every(validId))
    throw new TypeError('invalid edits or registered IDs');
  const allowed = new Set([0,...registeredIds]);
  const byCell = new Map();
  for (const e of edits) {
    if (!validCell(e) || !validId(e.blockId) || !allowed.has(e.blockId) ||
        !Number.isSafeInteger(e.sequence) || e.sequence < 0)
      throw new TypeError('invalid edit cell, registered material or sequence');
    const k=cellKey(e.x,e.y,e.z);
    const old=byCell.get(k);
    if (old && old.sequence===e.sequence)
      throw new Error('ambiguous same-cell edit sequence');
    if (!old || e.sequence>old.sequence)
      byCell.set(k,{x:e.x,y:e.y,z:e.z,blockId:e.blockId,sequence:e.sequence});
  }
  const records=[...byCell.values()].sort(compareCell)
    .map(e=>Object.freeze(e));
  const lookup=new Map(records.map(e=>[cellKey(e.x,e.y,e.z),e]));
  return Object.freeze({
    records:Object.freeze(records),
    resolve(cell,{naturalId,overlayId=null}={}) {
      if (!validCell(cell) || !allowed.has(naturalId) ||
          (overlayId!==null && !allowed.has(overlayId)))
        throw new TypeError('invalid cell or unregistered source material');
      const edit=lookup.get(cellKey(cell.x,cell.y,cell.z));
      return Object.freeze(edit
        ? {id:edit.blockId,source:'player-edit',sequence:edit.sequence}
        : {id:overlayId??naturalId,source:overlayId===null?'natural':'overlay'});
    },
    // Pure deterministic JSON-compatible handoff, not a schema-1 save migration.
    exportFixture() { return records.map(e=>({...e})); }
  });
}
