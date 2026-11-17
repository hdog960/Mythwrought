// Opt-in, nonthrowing lease attempt for high-frequency interaction callers.
// Busy cells are skipped rather than queuing stale world edits.
import {withVoxelCellLease} from './voxel-cell-lease.mjs';

export async function tryVoxelCellLease(scope, cells, work) {
  // The callback can throw any message, including the lease-conflict text.
  // Only errors raised BEFORE callback entry represent lease contention.
  let entered = false;
  try {
    const value = await withVoxelCellLease(scope,cells,async()=>{
      entered = true;
      return work();
    });
    return {acquired:true,value};
  } catch (error) {
    if (!entered && error instanceof Error && error.message === 'Voxel cell lease conflict')
      return {acquired:false};
    throw error;
  }
}
