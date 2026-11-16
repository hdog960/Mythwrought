// Opt-in multi-cell edit transaction; no live hooks, save changes, or new IDs.
// Host edit/rollback callbacks receive (cell, index); rollback must be reversible.
const locks = new WeakMap();
const validId = id => Number.isSafeInteger(id) && id >= 0 && id < 255;
const validState = value => ['string','boolean','bigint'].includes(typeof value) ||
  (typeof value === 'number' && Number.isFinite(value));
export async function commitOrientedBatch({cells,sidecar,readIdentity,edit,rollback,readState}) {
  if (!Array.isArray(cells) || !cells.length || cells.length > 256 ||
      cells.some(c=>!Array.isArray(c)||c.length!==3||!c.every(Number.isSafeInteger)))
    throw new TypeError('Invalid batch cells');
  if (!sidecar || typeof sidecar.get!=='function' || typeof sidecar.invalidateEdit!=='function')
    throw new TypeError('Invalid sidecar');
  if ([readIdentity,edit,rollback].some(f=>typeof f!=='function'))
    throw new TypeError('Invalid callbacks');
  if (readState !== undefined && typeof readState !== 'function') throw new TypeError('Invalid state reader');
  const keys=cells.map(c=>c.join(','));
  if (new Set(keys).size!==keys.length) throw new TypeError('Duplicate batch cell');
  let held=locks.get(sidecar);
  if (!held) {held=new Set();locks.set(sidecar,held);}
  if (keys.some(k=>held.has(k))) throw new Error('Overlapping batch edit');
  keys.forEach(k=>held.add(k));
  const originals=[],states=[],written=[];
  try {
    // Preflight every identity before touching any cell.
    for (const c of cells) {
      const id=await readIdentity(c);
      if (!validId(id)) throw new TypeError('Invalid original identity');
      originals.push(id);
      if (readState) {
        const state=await readState(c);
        if (!validState(state)) throw new TypeError('Invalid initial shape state');
        states.push(state);
      }
    }
    try {
      for (let i=0;i<cells.length;i++) {
        // An awaited preflight may yield to external world edits. Never overwrite
        // a cell whose identity or partial-shape fingerprint changed meanwhile.
        if (await readIdentity(cells[i]) !== originals[i] ||
            (readState && await readState(cells[i]) !== states[i]))
          throw new Error('Stale batch preflight');
        // Include the currently executing cell in rollback even when edit throws.
        written.push(i);
        if (await edit(cells[i],i)!==true) throw new Error('Batch edit not acknowledged');
        if (!validId(await readIdentity(cells[i])))
          throw new Error('Invalid committed identity');
        if (readState && !validState(await readState(cells[i])))
          throw new Error('Invalid committed shape state');
      }
    } catch (error) {
      const failures=[];
      for (const i of [...written].reverse()) {
        try {
          if (await rollback(cells[i],i)===false) throw new Error('Rollback rejected');
          if (await readIdentity(cells[i])!==originals[i]) throw new Error('Rollback identity mismatch');
          if (readState && await readState(cells[i])!==states[i]) throw new Error('Rollback shape state mismatch');
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
