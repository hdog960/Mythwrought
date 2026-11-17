// Opt-in legacy edit bridge. Never writes orientation into schema-1 saves.
// Host must serialize writes to each cell. Revision is optional but required
// to detect same-ID writes when a writer rejects or throws after mutation.
const validId = id => Number.isSafeInteger(id) && id >= 0 && id < 255;
const validRevision = value => Number.isSafeInteger(value) && value >= 0;
export async function applyLegacyVoxelEdit({cell,sidecar,readBlock,writeBlock,nextId,readRevision}) {
  if (!Array.isArray(cell)||cell.length!==3||!cell.every(Number.isSafeInteger))
    throw new TypeError('Invalid edit cell');
  if (!sidecar||typeof sidecar.invalidateEdit!=='function'||
      typeof readBlock!=='function'||typeof writeBlock!=='function'||
      (readRevision!==undefined&&typeof readRevision!=='function'))
    throw new TypeError('Invalid legacy edit bridge');
  if (!validId(nextId)) throw new TypeError('Invalid next block');
  const before=await readBlock(...cell);
  if (!validId(before)) throw new TypeError('Invalid original block');
  const revision=readRevision?await readRevision(...cell):undefined;
  if (readRevision&&!validRevision(revision)) throw new TypeError('Invalid revision');
  const changed=async()=>{
    try {
      const id=await readBlock(...cell);
      if (!validId(id)||id!==before) return true;
      if (readRevision) {
        const now=await readRevision(...cell);
        return !validRevision(now)||now!==revision;
      }
      return false;
    } catch { return true; } // Uncertain state: fail closed.
  };
  // Refuse a stale preflight before invoking a cooperative writer. A host
  // must still atomically compare the supplied expected ID/revision at commit.
  // If a concurrent mutation already occurred, the old turn is unsafe.
  if (readRevision) {
    let stale=false;
    try {
      const [currentId,currentRevision]=await Promise.all([
        readBlock(...cell),readRevision(...cell)
      ]);
      stale=!validId(currentId)||!validRevision(currentRevision)||
        currentId!==before||currentRevision!==revision;
    } catch { stale=true; }
    if (stale) {
      sidecar.invalidateEdit(cell);
      return false;
    }
  }
  let receipt;
  try { receipt=await writeBlock([...cell],nextId,before,revision); }
  catch(error) {
    if(await changed()) sidecar.invalidateEdit(cell);
    throw error;
  }
  if(receipt!==true) {
    if(await changed()) sidecar.invalidateEdit(cell);
    return false;
  }
  // A true receipt is a committed edit, even for a same-ID replacement.
  sidecar.invalidateEdit(cell);
  return true;
}
