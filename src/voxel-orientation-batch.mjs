// Opt-in bounded multi-cell edit coordinator. No automatic rollback or save changes.
import {cellKey} from './voxel-orientation-sidecar.mjs';
import {applyOrientedVoxelEdit} from './voxel-orientation-edit-guard.mjs';
const validId=id=>Number.isSafeInteger(id)&&id>=0&&id<255;

/**
 * Applies edits in caller order, stopping at the first unverified write.
 * No rollback: the host may have partially committed the failed write.
 * A receipt contains only verified changes, and may be used by guarded undo.
 */
export function applyOrientedVoxelBatch({edits,readBlock,writeBlock,orientation,maxEdits=256}) {
  if(!Array.isArray(edits)||!Number.isSafeInteger(maxEdits)||maxEdits<1||
     edits.length>maxEdits||typeof readBlock!=='function'||typeof writeBlock!=='function'||
     !orientation||typeof orientation.clear!=='function') throw new TypeError('Invalid batch');
  const seen=new Set();
  const prepared=edits.map(edit=>{
    if(!edit||!validId(edit.nextBlockId)) throw new TypeError('Invalid batch edit');
    const key=cellKey(edit.cell);
    if(seen.has(key)) throw new TypeError('Duplicate batch cell');
    seen.add(key);
    return {cell:[...edit.cell],nextBlockId:edit.nextBlockId};
  });
  const receipt=[];
  for(let index=0;index<prepared.length;index++) {
    const edit=prepared[index];
    try {
      const result=applyOrientedVoxelEdit({...edit,readBlock,writeBlock,orientation});
      if(result.changed) receipt.push({cell:[...edit.cell],before:result.before,after:result.after});
      else if(result.before!==edit.nextBlockId) {
        // A rejected write is a stopped batch, never a successful no-op.
        // Earlier verified changes remain in the receipt for guarded recovery.
        return {ok:false,failedIndex:index,receipt,reason:'write-rejected'};
      }
    } catch(cause) {
      // Earlier verified writes remain committed. Never pretend this was atomic.
      return {ok:false,failedIndex:index,receipt,cause};
    }
  }
  return {ok:true,receipt};
}

/**
 * Undo only if all receipt cells still match their recorded after-IDs.
 * This prevents overwriting unrelated edits made since the batch.
 * A failure during undo may still partially mutate the world; report that truth.
 */
export function undoOrientedVoxelBatch({receipt,readBlock,writeBlock,orientation,maxEdits=256}) {
  if(!Array.isArray(receipt)||!Number.isSafeInteger(maxEdits)||maxEdits<1||
     receipt.length>maxEdits||typeof readBlock!=='function'||typeof writeBlock!=='function'||
     !orientation||typeof orientation.clear!=='function') throw new TypeError('Invalid undo');
  const seen=new Set();
  const validated=receipt.map(entry=>{
    if(!entry||!validId(entry.before)||!validId(entry.after)) throw new TypeError('Invalid receipt');
    const key=cellKey(entry.cell);
    if(seen.has(key)) throw new TypeError('Duplicate receipt cell');
    seen.add(key);
    return {cell:[...entry.cell],before:entry.before,after:entry.after};
  });
  // Full preflight: no writes when any cell was changed by someone else.
  for(const entry of validated) {
    if(readBlock(...entry.cell)!==entry.after) return {ok:false,reason:'conflict',receipt:[]};
  }
  const reversed=validated.slice().reverse().map(entry=>({cell:entry.cell,nextBlockId:entry.before}));
  const result=applyOrientedVoxelBatch({edits:reversed,readBlock,writeBlock,orientation,maxEdits});
  return result.ok?{ok:true,receipt:result.receipt}:{...result,reason:'partial-undo'};
}

/**
 * Recover an interrupted undo without overwriting later edits.
 * Cells already restored to their before-ID are skipped; cells still at
 * their after-ID are eligible. Any third value aborts before writing.
 * The returned receipt describes only verified writes in this attempt.
 * Callers must retain the original receipt until recovery is complete.
 */
export function resumeOrientedVoxelUndo({receipt,readBlock,writeBlock,orientation,maxEdits=256}) {
  if(!Array.isArray(receipt)||!Number.isSafeInteger(maxEdits)||maxEdits<1||
     receipt.length>maxEdits||typeof readBlock!=='function'||typeof writeBlock!=='function'||
     !orientation||typeof orientation.clear!=='function') throw new TypeError('Invalid undo recovery');
  const seen=new Set(),pending=[];
  for(const entry of receipt) {
    if(!entry||!validId(entry.before)||!validId(entry.after)) throw new TypeError('Invalid receipt');
    const key=cellKey(entry.cell);
    if(seen.has(key)) throw new TypeError('Duplicate receipt cell');
    seen.add(key);
    const current=readBlock(...entry.cell);
    if(current!==entry.before&&current!==entry.after) return {ok:false,reason:'conflict',receipt:[]};
    if(current===entry.after&&entry.before!==entry.after) pending.push({cell:[...entry.cell],nextBlockId:entry.before});
  }
  // Reverse ordering matches ordinary undo; no writes before full preflight.
  const result=applyOrientedVoxelBatch({edits:pending.reverse(),readBlock,writeBlock,orientation,maxEdits});
  return result.ok?{ok:true,receipt:result.receipt}:{...result,reason:'partial-undo'};
}


/**
 * Guarded redo of an original batch receipt, after a completed undo.
 * Every cell must still hold its before-ID; any conflict aborts all writes.
 * This does not resurrect historical orientation: host orientation remains
 * cleared after writes. As with undo, a failed writer may partially commit.
 * For partial redo recovery retain the ORIGINAL receipt and use
 * resumeOrientedVoxelRedo after resolving any uncertain failed write.
 */
export function redoOrientedVoxelBatch({receipt,readBlock,writeBlock,orientation,maxEdits=256}) {
  const entries=validateRedoReceipt(receipt,readBlock,writeBlock,orientation,maxEdits);
  for(const entry of entries) {
    if(readBlock(...entry.cell)!==entry.before) return {ok:false,reason:'conflict',receipt:[]};
  }
  const result=applyOrientedVoxelBatch({
    edits:entries.map(e=>({cell:e.cell,nextBlockId:e.after})),
    readBlock,writeBlock,orientation,maxEdits
  });
  return result.ok?{ok:true,receipt:result.receipt}:{...result,reason:'partial-redo'};
}

/**
 * Resume a partially committed redo. Already redone cells are skipped;
 * unexpected IDs abort the whole operation before any write.
 * Same-ID replacements cannot be detected by ID alone; hosts must supply
 * explicit invalidation/epoch guards for that stronger guarantee.
 */
export function resumeOrientedVoxelRedo({receipt,readBlock,writeBlock,orientation,maxEdits=256}) {
  const entries=validateRedoReceipt(receipt,readBlock,writeBlock,orientation,maxEdits);
  const pending=[];
  for(const entry of entries) {
    const current=readBlock(...entry.cell);
    if(current!==entry.before&&current!==entry.after) return {ok:false,reason:'conflict',receipt:[]};
    if(current===entry.before&&entry.before!==entry.after)
      pending.push({cell:entry.cell,nextBlockId:entry.after});
  }
  const result=applyOrientedVoxelBatch({edits:pending,readBlock,writeBlock,orientation,maxEdits});
  return result.ok?{ok:true,receipt:result.receipt}:{...result,reason:'partial-redo'};
}

function validateRedoReceipt(receipt,readBlock,writeBlock,orientation,maxEdits) {
  if(!Array.isArray(receipt)||!Number.isSafeInteger(maxEdits)||maxEdits<1||
     receipt.length>maxEdits||typeof readBlock!=='function'||typeof writeBlock!=='function'||
     !orientation||typeof orientation.clear!=='function') throw new TypeError('Invalid redo');
  const seen=new Set();
  return receipt.map(entry=>{
    if(!entry||!validId(entry.before)||!validId(entry.after)) throw new TypeError('Invalid receipt');
    const key=cellKey(entry.cell);
    if(seen.has(key)) throw new TypeError('Duplicate receipt cell');
    seen.add(key);
    return {cell:[...entry.cell],before:entry.before,after:entry.after};
  });
}
