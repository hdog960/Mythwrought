// Opt-in multi-cell edit transaction; no live hooks, save changes, or new IDs.
// Host edit/rollback callbacks receive (cell, index); rollback must be reversible.
const locks = new WeakMap();
const validId = id => Number.isSafeInteger(id) && id >= 0 && id < 255;
const validRevision = value => Number.isSafeInteger(value) && value >= 0;
const validState = value => ['string','boolean','bigint'].includes(typeof value) ||
  (typeof value === 'number' && Number.isFinite(value));
export async function commitOrientedBatch({cells,sidecar,readIdentity,edit,rollback,readState,readRevision}) {
  if (!Array.isArray(cells) || !cells.length || cells.length > 256 ||
      cells.some(c=>!Array.isArray(c)||c.length!==3||!c.every(Number.isSafeInteger)))
    throw new TypeError('Invalid batch cells');
  if (!sidecar || typeof sidecar.get!=='function' || typeof sidecar.invalidateEdit!=='function')
    throw new TypeError('Invalid sidecar');
  if ([readIdentity,edit,rollback].some(f=>typeof f!=='function'))
    throw new TypeError('Invalid callbacks');
  if (readState !== undefined && typeof readState !== 'function') throw new TypeError('Invalid state reader');
  if (readRevision !== undefined && typeof readRevision !== 'function') throw new TypeError('Invalid revision reader');
  const keys=cells.map(c=>c.join(','));
  if (new Set(keys).size!==keys.length) throw new TypeError('Duplicate batch cell');
  let held=locks.get(sidecar);
  if (!held) {held=new Set();locks.set(sidecar,held);}
  if (keys.some(k=>held.has(k))) throw new Error('Overlapping batch edit');
  keys.forEach(k=>held.add(k));
  const originals=[],states=[],revisions=[],written=[],postWrites=new Map(),ambiguous=new Set();
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
      if (readRevision) {
        const revision=await readRevision(c);
        if (!validRevision(revision)) throw new TypeError('Invalid initial revision');
        revisions.push(revision);
      }
    }
    try {
      for (let i=0;i<cells.length;i++) {
        // An awaited preflight may yield to external world edits. Never overwrite
        // a cell whose identity or partial-shape fingerprint changed meanwhile.
        if (await readIdentity(cells[i]) !== originals[i] ||
            (readState && await readState(cells[i]) !== states[i]) ||
            (readRevision && await readRevision(cells[i]) !== revisions[i])) {
          // Another editor owns the new content. Never roll it back, but the
          // orientation associated with the original content is now stale.
          sidecar.invalidateEdit(cells[i]);
          throw new Error('Stale batch preflight');
        }
        // Include the currently executing cell in rollback even when edit throws.
        written.push(i);
        if (await edit(cells[i],i)!==true) throw new Error('Batch edit not acknowledged');
        const committedId=await readIdentity(cells[i]);
        if (!validId(committedId)) throw new Error('Invalid committed identity');
        const committedState=readState ? await readState(cells[i]) : undefined;
        if (readState && !validState(committedState))
          throw new Error('Invalid committed shape state');
        const committedRevision=readRevision ? await readRevision(cells[i]) : undefined;
        if (readRevision && (!validRevision(committedRevision) || committedRevision<=revisions[i]))
          throw new Error('Invalid committed revision');
        // Async readers can yield: a later foreign write must not be mistaken
        // for the edit we just acknowledged. Fail closed before committing a
        // rollback receipt for an inconsistent snapshot.
        if (await readIdentity(cells[i])!==committedId ||
            (readState && await readState(cells[i])!==committedState) ||
            (readRevision && await readRevision(cells[i])!==committedRevision)) {
          ambiguous.add(i);
          throw new Error('Unstable committed snapshot');
        }
        postWrites.set(i,{id:committedId,state:committedState,revision:committedRevision});
      }
    } catch (error) {
      const failures=[];
      for (const i of [...written].reverse()) {
        try {
          // A different editor may have changed an already-written cell while
          // a later async edit was pending. Never undo that foreign change.
          if (ambiguous.has(i)) throw new Error('Foreign edit during unverified commit');
          const post=postWrites.get(i);
          if (post && (await readIdentity(cells[i])!==post.id ||
              (readState && await readState(cells[i])!==post.state) ||
              (readRevision && await readRevision(cells[i])!==post.revision)))
            throw new Error('Foreign edit during batch rollback');
          if (await rollback(cells[i],i)===false) throw new Error('Rollback rejected');
          if (await readIdentity(cells[i])!==originals[i]) throw new Error('Rollback identity mismatch');
          if (readState && await readState(cells[i])!==states[i]) throw new Error('Rollback shape state mismatch');
          // Revision counters are monotonic: rollback must advance them, never rewind.
          if (readRevision && (!validRevision(await readRevision(cells[i])) ||
              await readRevision(cells[i]) <= (postWrites.get(i)?.revision ?? revisions[i])))
            throw new Error('Rollback revision mismatch');
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
