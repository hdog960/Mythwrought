// Opt-in legacy edit bridge. Never writes orientation into schema-1 saves.
// Host must route every world edit through this bridge to keep sidecar coherent.
export async function applyLegacyVoxelEdit({cell,sidecar,readBlock,writeBlock,nextId}) {
  if (!Array.isArray(cell)||cell.length!==3||!cell.every(Number.isSafeInteger))
    throw new TypeError('Invalid edit cell');
  if (!sidecar||typeof sidecar.invalidateEdit!=='function'||
      typeof readBlock!=='function'||typeof writeBlock!=='function')
    throw new TypeError('Invalid legacy edit bridge');
  if (!Number.isSafeInteger(nextId)||nextId<0||nextId>=255)
    throw new TypeError('Invalid next block');
  // The host writer MUST serialize edits to this cell and return true only
  // after a committed write. This is not a substitute for host-atomic CAS.
  const before=await readBlock(...cell);
  if (!Number.isSafeInteger(before)||before<0||before>=255)
    throw new TypeError('Invalid original block');
  let receipt;
  try {
    receipt=await writeBlock([...cell],nextId,before);
  } catch (error) {
    // A throwing writer may have mutated the world before failing. Recheck
    // identity; if ambiguous, discard optional turns rather than retain stale.
    try {
      if (await readBlock(...cell)!==before) sidecar.invalidateEdit(cell);
    } catch {
      sidecar.invalidateEdit(cell);
    }
    throw error;
  }
  if (receipt!==true) {
    // A failed writer may still have partially changed the authoritative cell.
    if (await readBlock(...cell)!==before) sidecar.invalidateEdit(cell);
    return false;
  }
  // Same-ID replacement is still an edit: orientation must not survive.
  sidecar.invalidateEdit(cell);
  return true;
}
