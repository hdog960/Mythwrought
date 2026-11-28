// D3 physical dune trial over immutable, vetted Desert caps.
import { BLOCK, worldKey } from '../voxel.mjs';
import { M3_DESERT_IDS as material } from './desert-m3.mjs';
import { v6BiomeAt } from './v6-balanced-biomes.mjs';

const radius = 24, size = radius * 2 + 1;
const dry = new Set([material.red, material.pale, material.hardpan, material.sandstone, material.mud]);

export function surveyDesertDuneRelief(world, x, z, { reservedAt = () => false } = {}) {
  if (![x, z].every(Number.isSafeInteger) || typeof reservedAt !== 'function') throw new TypeError('Invalid dune survey');
  const root = v6BiomeAt(x, z, world.seed);
  if (root?.name !== 'desert' || root.weight < .90) return null;
  const rises = new Uint8Array(size * size), caps = new Uint8Array(size * size);
  const phase = (world.seed % 127) * .037;
  for (let dz = 1; dz < size - 1; dz++) for (let dx = 1; dx < size - 1; dx++) {
    const a = x - radius + dx, b = z - radius + dz, key = dz * size + dx;
    const edge = Math.min(1, 2 * (1 - Math.hypot((dx - radius) / radius, (dz - radius) / radius)));
    if (edge <= 0) continue;
    const biome = v6BiomeAt(a, b, world.seed);
    if (biome?.name !== 'desert' || biome.weight < .86 || world._oasisNear(a, b, 2, biome)) continue;
    const column = world._columnPlan(a, b), top = Math.max(...column.keys());
    if (top < 3 || top > 17 || !dry.has(column.get(top)) || world.get(a, top, b) !== column.get(top)) continue;
    if (world.get(a, top - 1, b) === BLOCK.AIR) continue;
    const crest = .5 + .5 * Math.cos(.21 * a + .12 * b + .4 * Math.sin(.047 * b) + phase);
    const proposed = Math.min(19 - top, Math.floor(7 * edge * edge * (3 - 2 * edge) * crest ** 1.4));
    if (!proposed) continue;
    let clear = true;
    for (let y = top - 1; y <= top + proposed + 1; y++) {
      if (reservedAt(a, y, b) || world.edits.has(worldKey(a, y, b)) ||
          world.environmentCaves.get(a, y, b) !== undefined || y > top && world.get(a, y, b) !== BLOCK.AIR) {
        clear = false;
        break;
      }
    }
    if (!clear) continue;
    caps[key] = top;
    rises[key] = proposed;
  }
  // Limit the added layer to a one-block neighbor grade. Each sweep carries
  // the reductions from every veto and the untouched outside boundary.
  for (let zz = 1; zz < size - 1; zz++) for (let xx = 1; xx < size - 1; xx++) {
    const key = zz * size + xx;
    rises[key] = Math.min(rises[key], rises[key - 1] + 1, rises[key - size] + 1);
  }
  for (let zz = size - 2; zz >= 1; zz--) for (let xx = size - 2; xx >= 1; xx--) {
    const key = zz * size + xx;
    rises[key] = Math.min(rises[key], rises[key + 1] + 1, rises[key + size] + 1);
  }
  const cells = [], columns = [];
  for (let dz = 1; dz < size - 1; dz++) for (let dx = 1; dx < size - 1; dx++) {
    const key = dz * size + dx, rise = rises[key];
    if (!rise) continue;
    const a = x - radius + dx, b = z - radius + dz, top = caps[key] + rise;
    columns.push([a, b, caps[key], top]);
    for (let y = caps[key] + 1; y <= top; y++) {
      cells.push([a, y, b, y === top ? material.red : material.sandstone]);
    }
  }
  return columns.length ? { center: [x, z], cells, columns } : null;
}

export function openDesertDuneWitness(world, dunes) {
  const blocks = new Map(dunes.cells.map(([x, y, z, id]) => [worldKey(x, y, z), id]));
  return Object.create(world, {
    get: { value: (x, y, z) => blocks.get(worldKey(x, y, z)) ?? world.get(x, y, z) },
    naturalAndLandmarkBlock: { value: (x, y, z) =>
      blocks.get(worldKey(x, y, z)) ?? world.naturalAndLandmarkBlock(x, y, z) },
    set: { value() { throw Error('Read-only Desert dune witness'); } },
    save: { value() { throw Error('Desert dune research requires a separate world profile'); } }
  });
}
