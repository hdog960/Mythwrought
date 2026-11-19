// :00 opt-in transaction preparation; never connected to live saves or controls.
// Collect all receipts synchronously from one reference host and fail closed.
export function prepareVoxelEditBatch(host, edits) {
  if (!host || typeof host.snapshotEdit !== 'function' ||
      !Array.isArray(edits) || edits.length < 1 || edits.length > 256)
    throw new TypeError('Invalid edit batch');
  const seen = new Set();
  const receipts = [];
  for (const edit of edits) {
    if (!edit || !Array.isArray(edit.cell) || edit.cell.length !== 3 ||
        !edit.cell.every(Number.isSafeInteger) ||
        !Number.isSafeInteger(edit.nextId) || edit.nextId < 0 || edit.nextId >= 255)
      throw new TypeError('Invalid edit');
    const key = edit.cell.join(',');
    if (seen.has(key)) throw new TypeError('Duplicate edit cell');
    seen.add(key);
    // Optional intent guards prevent a stale UI/adapter request from silently
    // targeting a different block or orientation before the snapshot begins.
    if (Object.hasOwn(edit, 'expectedId') &&
        (!Number.isSafeInteger(edit.expectedId) || edit.expectedId < 0 || edit.expectedId >= 255))
      throw new TypeError('Invalid expected ID');
    if (Object.hasOwn(edit, 'expectedTurn') &&
        edit.expectedTurn !== null &&
        (!Number.isSafeInteger(edit.expectedTurn) || edit.expectedTurn < 0 || edit.expectedTurn > 3))
      throw new TypeError('Invalid expected turn');
    const receipt = host.snapshotEdit(edit.cell, edit.nextId);
    if (receipt === null) return null;
    if ((Object.hasOwn(edit, 'expectedId') && receipt.expectedId !== edit.expectedId) ||
        (Object.hasOwn(edit, 'expectedTurn') && receipt.expectedTurn !== edit.expectedTurn))
      return null;
    if (!receipt || !Object.isFrozen(receipt) || !Object.isFrozen(receipt.cell))
      throw new TypeError('Host violated immutable receipt contract');
    receipts.push(receipt);
  }
  return Object.freeze(receipts);
}

export function commitPreparedVoxelEditBatch(host, receipts) {
  if (!host || typeof host.compareAndWriteMany !== 'function' ||
      !Array.isArray(receipts) || !Object.isFrozen(receipts) ||
      receipts.length < 1 || receipts.length > 256 ||
      receipts.some(r => !r || !Object.isFrozen(r) || !Object.isFrozen(r.cell)))
    throw new TypeError('Invalid prepared batch');
  return host.compareAndWriteMany(receipts);
}
