// Opt-in edit adapter: no world hooks or legacy schema-1 save changes.
import {cellKey} from './voxel-orientation-sidecar.mjs';
const validId = id => Number.isSafeInteger(id) && id>=0 && id<255;
const validCell = cell => { cellKey(cell); return [...cell]; };

/**
 * A host writer must return literal true only for a committed edit.
 * A dishonest or partially failing writer is detected by rereading the cell.
 * If a write changes the cell even while failing, stale orientation is removed.
 */
export function applyOrientedVoxelEdit({cell,nextBlockId,readBlock,writeBlock,orientation}) {
  const at=validCell(cell);
  if(!validId(nextBlockId)||typeof readBlock!=='function'||typeof writeBlock!=='function'||
     !orientation||typeof orientation.clear!=='function') throw new TypeError('Invalid edit adapter');
  const before=readBlock(...at);
  if(!validId(before)) throw new TypeError('Invalid existing block');
  if(before===nextBlockId) return {changed:false,before,after:before};
  let committed, failure;
  try { committed=writeBlock(...at,nextBlockId); }
  catch(error) { failure=error; }
  // Read after every attempted write, including false/throw: callbacks may mutate first.
  let after;
  try { after=readBlock(...at); }
  catch(error) {
    // Cannot establish identity; fail closed rather than leave potentially stale yaw.
    orientation.clear(at);
    throw new Error('Cannot verify world state after edit', {cause:error});
  }
  if(!validId(after)) {
    orientation.clear(at);
    throw new Error('Invalid world state after edit');
  }
  if(after!==before) orientation.clear(at);
  if(failure) throw failure;
  if(committed!==true) {
    if(after!==before) throw new Error('World changed despite failed edit');
    return {changed:false,before,after};
  }
  if(after!==nextBlockId) throw new Error('World edit reported success without committing');
  // Even a same-ID replacement must be explicitly invalidated by its host.
  orientation.clear(at);
  return {changed:true,before,after};
}

/** Call after a confirmed external write, including undo/redo or same-ID replacement. */
export function invalidateOrientationAfterEdit(orientation,cell) {
  const at=validCell(cell);
  if(!orientation||typeof orientation.clear!=='function') throw new TypeError('Invalid orientation store');
  orientation.clear(at);
}
