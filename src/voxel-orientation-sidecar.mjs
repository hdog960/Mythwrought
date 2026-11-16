// Staged orientation sidecar. Never modifies legacy schema-1 save payloads.
// A future explicit integration must persist this separately and validate block identity.
const KEY=/^-?(?:0|[1-9]\d*),-?(?:0|[1-9]\d*),-?(?:0|[1-9]\d*)$/;
export function cellKey(cell) {
  if (!Array.isArray(cell)||cell.length!==3||!cell.every(Number.isSafeInteger)) throw new TypeError('Invalid cell');
  return cell.join(',');
}
export function makeOrientationSidecar(entries=[],{maxEntries=4096}={}) {
  if (!Number.isSafeInteger(maxEntries)||maxEntries<1||!Array.isArray(entries)||entries.length>maxEntries) throw new TypeError('Invalid sidecar');
  const states=new Map();
  for (const entry of entries) {
    if (!entry||!Array.isArray(entry.cell)||!Number.isSafeInteger(entry.blockId)||entry.blockId<1||entry.blockId>=255||!Number.isInteger(entry.turns)||entry.turns<0||entry.turns>3) throw new TypeError('Invalid orientation');
    const key=cellKey(entry.cell);
    if(states.has(key)) throw new TypeError('Duplicate orientation cell');
    states.set(key,{cell:[...entry.cell],blockId:entry.blockId,turns:entry.turns});
  }
  return {
    get(cell,blockId) {
      const entry=states.get(cellKey(cell));
      return entry&&entry.blockId===blockId?entry.turns:0;
    },
    set(cell,blockId,turns) {
      const key=cellKey(cell);
      if(!Number.isSafeInteger(blockId)||blockId<1||blockId>=255||!Number.isInteger(turns)||turns<0||turns>3) throw new TypeError('Invalid orientation');
      if(!states.has(key)&&states.size>=maxEntries) throw new RangeError('Sidecar capacity exceeded');
      states.set(key,{cell:[...cell],blockId,turns});
    },
    clear(cell) {states.delete(cellKey(cell));},
    // Explicit world-edit hook: invalidate even when the replacement uses the same ID.
    // The host must call this for every successful edit, including removals and undo.
    invalidateEdit(cell) {
      const key=cellKey(cell);
      const existed=states.has(key);
      states.delete(key);
      return existed;
    },
    // Optional atomic edit adapter. Failed edits preserve orientation; successful edits
    // always invalidate before a new orientation may be assigned by the host.
    applyEdit(cell,edit) {
      const key=cellKey(cell);
      if(typeof edit!=='function') throw new TypeError('Missing edit callback');
      const success=edit();
      if(success===true) states.delete(key);
      return success;
    },
    // Opt-in asynchronous world-edit adapter. Only a committed edit invalidates turns.
    // A rejection leaves the sidecar untouched; callers must roll back their own world
    // mutation if an edit rejects after partially changing the world.
    async applyEditAsync(cell,edit) {
      const key=cellKey(cell);
      if(typeof edit!=='function') throw new TypeError('Missing edit callback');
      const original=states.get(key);
      const success=await edit();
      // A newer orientation/undo may have been recorded while this edit awaited.
      // Never erase that newer state on a late completion.
      if(success===true && states.get(key)===original) states.delete(key);
      return success;
    },
    // Caller must pass current world block reader; stale records are never restored onto edits.
    snapshot(readBlock) {
      if(typeof readBlock!=='function') throw new TypeError('Missing block reader');
      return [...states.values()].filter(e=>readBlock(...e.cell)===e.blockId)
        .sort((a,b)=>a.cell[0]-b.cell[0]||a.cell[1]-b.cell[1]||a.cell[2]-b.cell[2])
        .map(e=>({cell:[...e.cell],blockId:e.blockId,turns:e.turns}));
    },
    // Reconcile after loading legacy edits or any out-of-band world modification.
    // Only records matching the actual world survive; no schema-1 payload is changed.
    reconcile(readBlock) {
      if(typeof readBlock!=='function') throw new TypeError('Missing block reader');
      const stale=[];
      for(const [key,entry] of states) {
        if(readBlock(...entry.cell)!==entry.blockId) stale.push(key);
      }
      for(const key of stale) states.delete(key);
      return stale.length;
    },
    size() {return states.size;}
  };
}
export function restoreOrientationSidecar(serialized,readBlock,options) {
  if(typeof readBlock!=='function') throw new TypeError('Missing block reader');
  // Legacy schema-1 saves never carried a sidecar. Absence means default turns,
  // not a malformed save or an implicit migration of the original payload.
  if(serialized===undefined || serialized===null) return makeOrientationSidecar([],options);
  if(!Array.isArray(serialized)) throw new TypeError('Invalid serialized sidecar');
  // Optional metadata is untrusted. Ambiguous duplicate coordinates must not
  // cause legacy world recovery to fail or allow an arbitrary turn to win.
  // Drop *all* records for a duplicated cell, even when one record is stale.
  const limit=options?.maxEntries??4096;
  if(!Number.isSafeInteger(limit)||limit<1) throw new TypeError('Invalid sidecar capacity');
  // Check the bound BEFORE iterating attacker-controlled optional metadata.
  // A large array must not consume a world-load-sized scan or invoke readers.
  if(serialized.length>limit) return makeOrientationSidecar([],options);
  const counts=new Map();
  for(const e of serialized) {
    if(e&&Array.isArray(e.cell)&&e.cell.length===3&&e.cell.every(Number.isSafeInteger)) {
      const key=cellKey(e.cell);
      counts.set(key,(counts.get(key)||0)+1);
    }
  }
  const valid=serialized.filter(e=>e&&Array.isArray(e.cell)&&e.cell.length===3&&e.cell.every(Number.isSafeInteger)&&
    counts.get(cellKey(e.cell))===1&&Number.isSafeInteger(e.blockId)&&e.blockId>0&&e.blockId<255&&
    Number.isInteger(e.turns)&&e.turns>=0&&e.turns<=3&&readBlock(...e.cell)===e.blockId);
  return makeOrientationSidecar(valid,options);
}
