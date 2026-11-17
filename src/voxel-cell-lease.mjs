// Opt-in host-scoped cell lease for independent orientation/edit adapters.
// A host must use the SAME scope for every writer to these cells. This is not
// a substitute for atomic compare-and-swap against uncooperative writers.
export class VoxelCellLeaseConflictError extends Error {
  constructor() {
    super('Voxel cell lease conflict');
    this.name = 'VoxelCellLeaseConflictError';
  }
}
const scopes = new WeakMap();
const keyOf = cell => {
  if (!Array.isArray(cell) || cell.length !== 3 || !cell.every(Number.isSafeInteger))
    throw new TypeError('Invalid lease cell');
  return cell.join(',');
};
export async function withVoxelCellLease(scope, cells, work) {
  if ((typeof scope !== 'object' || scope === null) && typeof scope !== 'function')
    throw new TypeError('Lease scope must be an object');
  if (!Array.isArray(cells) || cells.length < 1 || cells.length > 256 ||
      typeof work !== 'function') throw new TypeError('Invalid lease request');
  const keys = cells.map(keyOf);
  if (new Set(keys).size !== keys.length) throw new TypeError('Duplicate lease cell');
  let held = scopes.get(scope);
  if (!held) { held = new Set(); scopes.set(scope, held); }
  if (keys.some(key => held.has(key))) throw new VoxelCellLeaseConflictError();
  keys.forEach(key => held.add(key));
  try { return await work(); }
  finally {
    keys.forEach(key => held.delete(key));
    if (!held.size) scopes.delete(scope);
  }
}
