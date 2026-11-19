import { BLOCK, VoxelWorld } from '../../src/voxel.mjs';
import { Pack2LiveWorld } from '../../src/pack2-world.mjs';

export function arena({ seed = 179, floor = -35, bounds = [-6, 8, -5, 5] } = {}) {
  const base = new VoxelWorld(seed);
  const [minX, maxX, minZ, maxZ] = bounds;
  for (let x = minX; x <= maxX; x++) {
    for (let z = minZ; z <= maxZ; z++) {
      base.set(x, floor, z, BLOCK.STONE);
      for (let y = floor + 1; y <= floor + 4; y++) base.set(x, y, z, BLOCK.AIR);
    }
  }
  return new Pack2LiveWorld(base);
}
