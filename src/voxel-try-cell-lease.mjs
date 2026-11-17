// Opt-in, nonthrowing lease attempt for high-frequency interaction callers.
// A busy cell is not an error: the caller may skip a frame rather than queue
// an edit that could apply to a different world state later.
import {withVoxelCellLease} from './voxel-cell-lease.mjs';

export async function tryVoxelCellLease(scope, cells, work) {
  // Only conflicts become a busy result. Invalid input and work failures must
  // propagate, never be mistaken for an ordinary overlapping interaction.
  try {
    return {acquired:true, value:await withVoxelCellLease(scope,cells,work)};
  } catch (error) {
    if (error instanceof Error && error.message === 'Voxel cell lease conflict')
      return {acquired:false};
    throw error;
  }
}
