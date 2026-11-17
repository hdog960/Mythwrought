// Opt-in host-atomic compare-and-swap for a single oriented voxel edit.
// Host compareAndSwap MUST atomically check identity, revision and state before
// writing. A read-then-write implementation is NOT sufficient.
const validRevision = n => Number.isSafeInteger(n) && n >= 0;
const validId = n => Number.isSafeInteger(n) && n >= 0 && n < 255;
export async function commitOrientedCAS({cell, sidecar, readSnapshot, compareAndSwap, next}) {
  if (!Array.isArray(cell) || cell.length !== 3 || !cell.every(Number.isSafeInteger))
    throw new TypeError('Invalid cell');
  if (!sidecar || typeof sidecar.invalidateEdit !== 'function' ||
      typeof readSnapshot !== 'function' || typeof compareAndSwap !== 'function' ||
      typeof next !== 'function') throw new TypeError('Invalid CAS adapter');
  // Old schema-1 worlds do not carry orientation. A host may explicitly
  // identify a legacy full-cube cell; only that case receives orientation 0.
  // Never silently normalize malformed modern oriented records.
  let before;
  try {
    const raw = await readSnapshot(cell);
    if (raw && raw.legacyFullCube === true && raw.orientation === undefined &&
        validId(raw.id) && validRevision(raw.revision)) {
      before = {...raw, orientation:0};
    } else before = raw;
    if (!before || !validId(before.id) || !validRevision(before.revision) ||
        !Number.isSafeInteger(before.orientation) || before.orientation < 0 || before.orientation > 3)
      throw new TypeError('Invalid original snapshot');
  } catch (error) {
    sidecar.invalidateEdit(cell);
    throw error;
  }
  const proposed = next(Object.freeze({...before}));
  if (!proposed || !validId(proposed.id) ||
      !Number.isSafeInteger(proposed.orientation) || proposed.orientation < 0 || proposed.orientation > 3)
    throw new TypeError('Invalid proposed state');
  // CAS must return an explicit {ok:boolean} receipt; never infer success.
  // A failed or thrown CAS can reflect an external edit, so invalidate the
  // cached orientation even if no local write was acknowledged.
  try {
    const receipt = await compareAndSwap(cell, Object.freeze({...before}),
      Object.freeze({id:proposed.id,orientation:proposed.orientation}));
    if (!receipt || receipt.ok !== true) {
      sidecar.invalidateEdit(cell);
      return false;
    }
    if (!validRevision(receipt.revision) || receipt.revision <= before.revision) {
      sidecar.invalidateEdit(cell);
      throw new Error('Invalid CAS revision receipt');
    }
    sidecar.invalidateEdit(cell);
    return true;
  } catch (error) {
    sidecar.invalidateEdit(cell);
    throw error;
  }
}
