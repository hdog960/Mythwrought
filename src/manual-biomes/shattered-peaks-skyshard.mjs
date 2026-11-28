// SP9 crystalline outcrop proposal using the original crystal and V8 rock.
import { BLOCK, worldKey } from '../voxel.mjs';
import { MOUNTAIN_V8_MATERIAL as material } from './mountain-v8-materials.mjs';
import { mountainV8TileRoot } from './mountain-v8-source-adapter.mjs';
import { openShatteredNaturalShapeWitness } from './shattered-peaks-conifers.mjs';
import { planMountainSubregionAt } from './shattered-peaks-subregions.mjs';

const supports = new Set([material.gneiss, material.slate, material.scree, material.stone]);
const ribs = [[-2, 0, 3], [-1, -1, 4], [-1, 0, 7], [-1, 1, 3], [0, -1, 6], [0, 0, 9],
  [0, 1, 5], [1, -1, 5], [1, 0, 12], [1, 1, 7], [2, 0, 8], [2, 1, 4], [3, 0, 4]];

export function surveySkyshard(world, tx, tz, { reservedAt = () => false } = {}) {
  const root = mountainV8TileRoot(tx, tz, world.seed);
  if (!root) return null;
  const { rootX: x, rootZ: z } = root;
  if (planMountainSubregionAt(x, z, world.seed) !== 'crystal-escarpments') return null;
  const floor = world.terraceColumn(x, z)?.topY;
  if (!Number.isInteger(floor) || floor < 30 || floor > 105) return null;
  const east = Boolean((tx ^ tz ^ world.seed) & 1);
  const at = (dx, dz) => east ? [x + dx, z + dz] : [x - dz, z + dx];
  const protectedAt = (a, b, c) => reservedAt(a, b, c) || world.edits.has(worldKey(a, b, c));
  const cells = [], footings = [];
  for (const [dx, dz, height] of ribs) {
    const [a, c] = at(dx, dz), ground = world.terraceColumn(a, c)?.topY;
    if (!Number.isInteger(ground) || Math.abs(ground - floor) > 2 ||
        planMountainSubregionAt(a, c, world.seed) !== 'crystal-escarpments' ||
        !supports.has(world.get(a, ground, c)) || world.get(a, ground - 1, c) === BLOCK.AIR ||
        !supports.has(world.get(a, ground - 3, c)) || protectedAt(a, ground, c) ||
        protectedAt(a, ground - 1, c) || protectedAt(a, ground - 3, c)) return null;
    footings.push([a, ground, c]);
    for (let y = ground + 1; y <= Math.max(ground + 2, floor + height); y++) {
      if (world.get(a, y, c) !== BLOCK.AIR || world.originalNatural(a, y, c) !== BLOCK.AIR || protectedAt(a, y, c)) return null;
      cells.push([a, y, c, y > ground + Math.min(3, height - 2) ? BLOCK.CRYSTAL : material.gneiss]);
    }
  }
  return { name: 'The Skyshard', origin: [x, floor, z], east, footings, cells };
}

export const openSkyshardWitness = (world, formation) => openShatteredNaturalShapeWitness(world, formation, 'crystal outcrop');
