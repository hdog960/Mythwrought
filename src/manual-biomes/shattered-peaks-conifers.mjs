// SP5 detached trial of the existing V8 pine pattern on newly uplifted slopes.
import { BLOCK, worldKey } from '../voxel.mjs';
import { physicalRegionAt } from '../world-height.mjs';
import { MOUNTAIN_V8_MATERIAL as material } from './mountain-v8-materials.mjs';
import { mountainV8TileRoot } from './mountain-v8-source-adapter.mjs';
import { MOUNTAIN_V8_PLANT_PATTERNS } from './mountain-v8-vegetation-cells.mjs';
import { planMountainSubregionAt } from './shattered-peaks-subregions.mjs';

const pine = MOUNTAIN_V8_PLANT_PATTERNS['dwarf-conifer'];
const caps = new Set([material['alpine-grass'], material.dirt]);
const sites = new Set(['ironpine-highlands', 'emerald-highlands']);

export function surveyShatteredPine(world, tx, tz, kind) {
  if (![tx, tz].every(Number.isSafeInteger) || !['dwarf', 'tall'].includes(kind)) return null;
  const root = mountainV8TileRoot(tx, tz, world.seed);
  if (!root) return null;
  const { rootX: x, rootZ: z } = root, region = planMountainSubregionAt(x, z, world.seed);
  if (!sites.has(region)) return null;
  const column = world.terraceColumn(x, z), floor = column?.topY;
  if (!Number.isInteger(floor) || floor < 35 || floor > 80 || !caps.has(world.get(x, floor, z)) ||
      world.edits.has(worldKey(x, floor, z))) return null;
  const stem = kind === 'dwarf' ? [] : [1, 2, 3].map(y => [0, y, 0, 'conifer-trunk']);
  const offset = stem.length;
  const pattern = [...stem, ...pine.map(([a, b, c, name]) => [a, b + offset, c, name])];
  const cells = [];
  for (const [dx, dy, dz, name] of pattern) {
    const a = x + dx, y = floor + dy, b = z + dz;
    if (!sites.has(planMountainSubregionAt(a, b, world.seed)) || world.get(a, y, b) !== BLOCK.AIR ||
        world.edits.has(worldKey(a, y, b))) return null;
    cells.push([a, y, b, material[name]]);
  }
  return { kind, region, support: [x, floor, z], cells };
}

export const openShatteredPineWitness = (world, tree) => openShatteredVegetationWitness(world, tree, 'pine');

export function openShatteredVegetationWitness(world, placement, label = 'vegetation') {
  const cells = new Map(), upper = new Set();
  for (const [x, y, z, id] of placement.cells) {
    cells.set(worldKey(x, y, z), id);
    const owner = physicalRegionAt(x, y, z);
    if (owner.kind === 'upper') upper.add(owner.key);
  }
  return Object.create(world, {
    get: { value: (x, y, z) => cells.get(worldKey(x, y, z)) ?? world.get(x, y, z) },
    naturalAndLandmarkBlock: { value: (x, y, z) =>
      cells.get(worldKey(x, y, z)) ?? world.naturalAndLandmarkBlock(x, y, z) },
    generationProfile: { value: world.generationProfile },
    upperNaturalOccupied: { value: key => upper.has(key) || world.upperNaturalOccupied(key) },
    upperNaturalRevision: { value: world.upperNaturalRevision },
    set: { value() { throw Error('Read-only mountain ' + label + ' witness'); } },
    save: { value() { throw Error('Mountain ' + label + ' research requires a separate save profile'); } }
  });
}
