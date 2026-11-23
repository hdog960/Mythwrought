// Mob-only edit epoch ledger. This DOES NOT install itself on the voxel world.
// A future, separately authorized world integration must report EVERY accepted
// source edit (voxel, Pack2 state, and other mutable collision overlays).
// Without complete writer coverage it cannot certify live game-world stability.
export function createMobSourceEditEpoch(initialRevision = 0) {
  if (!Number.isSafeInteger(initialRevision) || initialRevision < 0)
    throw new TypeError('Invalid initial mob source edit epoch');
  let epoch = initialRevision;
  function revision() { return epoch; }
  function recordAcceptedEdit(accepted) {
    if (typeof accepted !== 'boolean')
      throw new TypeError('Mob source edit outcome must be boolean');
    if (!accepted) return epoch;
    if (epoch === Number.MAX_SAFE_INTEGER)
      throw new RangeError('Mob source edit epoch exhausted');
    return ++epoch;
  }
  return Object.freeze({revision, recordAcceptedEdit});
}
