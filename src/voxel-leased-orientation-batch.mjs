// Opt-in cooperative host lease around the existing oriented batch transaction.
// The host must use the same scope for every edit adapter; nonparticipating
// writers still require revision validation in commitOrientedBatch.
import {withVoxelCellLease} from './voxel-cell-lease.mjs';
import {commitOrientedBatch} from './voxel-orientation-batch.mjs';

export function commitLeasedOrientedBatch(scope, options) {
  if (!options || typeof options !== 'object')
    throw new TypeError('Invalid leased batch options');
  // The lease validates cell coordinates, uniqueness and capacity before
  // invoking any edit callbacks. It stays held through asynchronous rollback.
  return withVoxelCellLease(scope, options.cells, () => commitOrientedBatch(options));
}
