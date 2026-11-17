// Opt-in compare-and-write adapter for legacy voxel edits. No save payload changes.
// The host compareAndWrite MUST atomically validate expectedId and expectedRevision
// against its authoritative cell state and commit nextId as one serialized operation.
const idOK = n => Number.isSafeInteger(n) && n >= 0 && n < 255;
const revOK = n => Number.isSafeInteger(n) && n >= 0;
export function atomicLegacyWriter({compareAndWrite}) {
  if (typeof compareAndWrite !== 'function') throw new TypeError('Atomic host writer required');
  return async (cell,nextId,expectedId,expectedRevision) => {
    if (!Array.isArray(cell) || cell.length !== 3 || !cell.every(Number.isSafeInteger) ||
        !idOK(nextId) || !idOK(expectedId) || !revOK(expectedRevision))
      throw new TypeError('Invalid atomic voxel edit');
    const receipt = await compareAndWrite({
      cell: [...cell], expectedId, expectedRevision, nextId
    });
    // Never treat undefined, truthy objects or partial writes as successful.
    if (receipt !== true && receipt !== false)
      throw new TypeError('Atomic host must return a boolean receipt');
    return receipt;
  };
}
