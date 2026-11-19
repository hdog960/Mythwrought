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
    const receipt = host.snapshotEdit(edit.cell, edit.nextId);
    if (receipt === null) return null;
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
