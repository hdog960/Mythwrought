// Opt-in multi-cell edit transaction; no live hooks, save changes, or new IDs.
// Host edit/rollback callbacks receive (cell, index); rollback must be reversible.
const locks = new WeakMap();
const validId = id => Number.isSafeInteger(id) && id >= 0 && id < 255;
export async function commitOrientedBatch({cells,sidecar,readIdentity,edit,rollback}) {
  if (!Array.isArray(cells) || !cells.length || cells.length > 256 ||
      cells.some(c=>!Array.isArray(c)||c.length!==3||!c.every(Number.isSafeInteger)))
    throw new TypeError('Invalid batch cells');
  if (!sidecar || typeof sidecar.get!=='function' || typeof sidecar.invalidateEdit!=='function')
    throw new TypeError('Invalid sidecar');
  if ([readIdentity,edit,rollback].some(f=>typeof f!=='function'))
    throw new TypeError('Invalid callbacks');
  const keys=cells.map(c=>c.join(','));
  if (new Set(keys).size!==keys.length) throw new TypeError('Duplicate batch cell');
  let held=locks.get(sidecar);
  if (!held) {held=new Set();locks.set(sidecar,held);}
  if (keys.some(k=>held.has(k))) throw new Error('Overlapping batch edit');
  keys.forEach(k=>held.add(k));
  const originals=[],written=[];
  try {
    // Preflight every identity before touching any cell.
    for (const c of cells) {
      const id=await readIdentity(c);
      if (!validId(id)) throw new TypeError('Invalid original identity');
      originals.push(id);
    }
    try {
      for (let i=0;i<cells.length;i++) {
        // Include the currently executing cell in rollback even when edit throws.
        written.push(i);
        if (await edit(cells[i],i)!==true) throw new Error('Batch edit not acknowledged');
        if (!validId(await readIdentity(cells[i])))
          throw new Error('Invalid committed identity');
      }
    } catch (error) {
      const failures=[];
      for (const i of [...written].reverse()) {
        try {
          if (await rollback(cells[i],i)===false) throw new Error('Rollback rejected');
          if (await readIdentity(cells[i])!==originals[i]) throw new Error('Rollback identity mismatch');
        } catch (failure) {
          failures.push(failure);
          sidecar.invalidateEdit(cells[i]);
        }
      }
      if (failures.length) throw new AggregateError([error,...failures],'Batch edit and rollback failed');
      throw error;
    }
    for (const c of cells) sidecar.invalidateEdit(c);
    return true;
  } finally {
    keys.forEach(k=>held.delete(k));
    if (!held.size) locks.delete(sidecar);
  }
}
