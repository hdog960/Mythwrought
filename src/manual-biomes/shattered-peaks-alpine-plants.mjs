// SP6 physical flower and heather trial on gentle native upper meadows.
import { BLOCK, worldKey } from '../voxel.mjs';
import { MOUNTAIN_V8_MATERIAL as material } from './mountain-v8-materials.mjs';
import { mountainV8TileRoot } from './mountain-v8-source-adapter.mjs';
import { MOUNTAIN_V8_PLANT_PATTERNS } from './mountain-v8-vegetation-cells.mjs';
import { planMountainSubregionAt } from './shattered-peaks-subregions.mjs';
import { openShatteredNaturalShapeWitness } from './shattered-peaks-conifers.mjs';

const meadowRegions = new Set(['emerald-highlands', 'skywater-basins']);
const cardinal = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const kinds = ['alpine-flower', 'low-heather'];

export const openShatteredAlpinePlantWitness = (world, plant) => openShatteredNaturalShapeWitness(world, plant, 'vegetation');

export function surveyShatteredAlpinePlant(world, tx, tz, { reservedAt = () => false } = {}) {
  const root = mountainV8TileRoot(tx, tz, world.seed);
  if (!root) return null;
  const roll = (Math.imul(tx, 0x9e3779b1) ^ Math.imul(tz, 0x85ebca6b) ^ world.seed) >>> 0;
  const kind = kinds[roll % 5];
  if (!kind) return null;
  const { rootX: x, rootZ: z } = root, region = planMountainSubregionAt(x, z, world.seed);
  if (!meadowRegions.has(region)) return null;
  const floor = world.terraceColumn(x, z)?.topY;
  if (!Number.isInteger(floor) || floor < 27 || floor > 76 || world.get(x, floor, z) !== material['alpine-grass']) return null;
  if (!cardinal.every(([dx, dz]) => {
    const neighbor = world.terraceColumn(x + dx, z + dz)?.topY;
    return Math.abs(neighbor - floor) <= 1 && world.get(x + dx, neighbor, z + dz) === material['alpine-grass'];
  })) return null;
  const protectedAt = (a, y, b) => world.edits.has(worldKey(a, y, b)) || reservedAt(a, y, b);
  if (protectedAt(x, floor, z)) return null;
  const cells = [];
  for (const [dx, dy, dz, name] of MOUNTAIN_V8_PLANT_PATTERNS[kind]) {
    const a = x + dx, y = floor + dy, b = z + dz;
    if (world.get(a, y, b) !== BLOCK.AIR || world.originalNatural(a, y, b) !== BLOCK.AIR || protectedAt(a, y, b)) return null;
    cells.push([a, y, b, material[name]]);
  }
  return { kind, region, support: [x, floor, z], cells };
}
