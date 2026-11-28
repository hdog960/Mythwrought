// D3 dry canyon over the existing Desert terrain and sandstone strata.
import { BLOCK, worldKey } from '../voxel.mjs';
import { M3_DESERT_IDS as material } from './desert-m3.mjs';
import { v6BiomeAt } from './v6-balanced-biomes.mjs';

const dry = new Set([material.red, material.pale, material.salt, material.hardpan, material.sandstone, material.mud]);
const radius = 15;

export function surveyDesertCanyon(world, { x, z, axis, reservedAt = () => false }) {
  if (![x, z].every(Number.isSafeInteger) || !['x', 'z'].includes(axis) || typeof reservedAt !== 'function') {
    throw new TypeError('Invalid canyon survey');
  }
  const point = (along, across) => axis === 'x' ? [x + along, z + across] : [x + across, z + along];
  const bend = along => Math.round(2 * Math.sin(along * .18 + world.seed * .11));
  const protectedAt = (a, y, b) => reservedAt(a, y, b) || world.edits.has(worldKey(a, y, b)) ||
    world.environmentCaves.get(a, y, b) !== undefined;
  function cap(a, b) {
    const biome = v6BiomeAt(a, b, world.seed);
    if (biome?.name !== 'desert' || biome.weight < .89 || world._oasisNear(a, b, 2, biome)) return null;
    const column = world._columnPlan(a, b), top = Math.max(...column.keys());
    if (top < 4 || top > 17 || !dry.has(column.get(top)) || world.get(a, top, b) !== column.get(top)) return null;
    return top;
  }
  const center = cap(...point(0, bend(0)));
  if (center === null) return null;
  const bottom = Math.max(2, center - 4), cells = [], floors = [], stations = [];
  let deep = 0;
  for (let along = -radius; along <= radius; along++) {
    const target = bottom + Math.max(0, Math.abs(along) - 10);
    const width = Math.abs(along) <= 11 ? 2 : 1;
    for (let offset = -width; offset <= width; offset++) {
      const [a, b] = point(along, bend(along) + offset), top = cap(a, b);
      if (top === null) return null;
      const floor = Math.min(top, target + (Math.abs(offset) === 2 ? 2 : 0));
      if (floor < 2 || !dry.has(world.get(a, floor, b)) || world.get(a, floor - 1, b) === BLOCK.AIR) return null;
      for (let y = floor - 1; y <= Math.max(floor + 2, top + 1); y++) {
        if (protectedAt(a, y, b) || (y > floor && y <= top ? !dry.has(world.get(a, y, b)) :
          y > top && world.get(a, y, b) !== BLOCK.AIR)) return null;
      }
      if (offset === 0) {
        if (stations.length && Math.abs(stations.at(-1)[1] - floor - 1) > 1) return null;
        if (top - floor >= 3) deep++;
        stations.push([a, floor + 1, b]);
      }
      floors.push([a, floor, b, top]);
      for (let y = floor + 1; y <= top; y++) cells.push([a, y, b]);
    }
  }
  if (deep < 9) return null;
  return { origin: [x, bottom, z], axis, cells, floors, stations, deep };
}

export function openDesertCanyonWitness(world, canyon) {
  const cuts = new Set(canyon.cells.map(point => worldKey(...point)));
  const read = (x, y, z) => cuts.has(worldKey(x, y, z)) ? BLOCK.AIR : world.get(x, y, z);
  return Object.create(world, {
    get: { value: read },
    naturalAndLandmarkBlock: { value: read },
    set: { value() { throw Error('Read-only Desert canyon witness'); } },
    save: { value() { throw Error('Desert canyon research requires a separate world profile'); } }
  });
}
