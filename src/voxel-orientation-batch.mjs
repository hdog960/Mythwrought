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
