// Opt-in transactional edit adapter for orientation metadata. Does not alter schema-1 saves.
// The host supplies its existing read/write callbacks; no game-world hook is installed.
import {cellKey} from './voxel-orientation-sidecar.mjs';

function blockId(value) {
  return Number.isSafeInteger(value) && value>=0 && value<255;
}
function validateCell(cell) { cellKey(cell); return [...cell]; }

/**
 * An edit that succeeds invalidates orientation, even if the replacement uses the
 * same block ID: a newly placed block must never inherit the removed one's yaw.
 * The callback must return true only after its world edit has committed.
 * A failed/throwing callback leaves orientation untouched.
 */
export function applyOrientedVoxelEdit({cell,nextBlockId,readBlock,writeBlock,orientation}) {
  const at=validateCell(cell);
  if(!blockId(nextBlockId)||typeof readBlock!=='function'||typeof writeBlock!=='function'||
     !orientation||typeof orientation.clear!=='function') throw new TypeError('Invalid edit adapter');
  const before=readBlock(...at);
  if(!blockId(before)) throw new TypeError('Invalid existing block');
  // No-op edits must preserve orientation and avoid unnecessary chunk rebuilding.
  if(before===nextBlockId) return {changed:false,before,after:before};
  const committed=writeBlock(...at,nextBlockId);
  if(committed!==true) return {changed:false,before,after:before};
  // A host reporting success must actually have committed the requested block.
  // Never clear metadata if the world write did not take effect.
  if(readBlock(...at)!==nextBlockId) throw new Error('World edit reported success without committing');
  orientation.clear(at);
  return {changed:true,before,after:nextBlockId};
}

/**
 * Explicit invalidation for external edits (bulk tools, restore, undo/redo).
 * Call only AFTER a confirmed write. Clears metadata unconditionally, including
 * same-ID replacement, which identity-based stale filtering cannot detect.
 */
export function invalidateOrientationAfterEdit(orientation,cell) {
  const at=validateCell(cell);
  if(!orientation||typeof orientation.clear!=='function') throw new TypeError('Invalid orientation store');
  orientation.clear(at);
}
