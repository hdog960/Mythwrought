// Detached D2 trial using the existing ribbed Mythwrought cactus segment.
import { v6BiomeAt } from './v6-balanced-biomes.mjs';
import { BLOCK } from '../voxel.mjs';

const stem = 268;
const dryCaps = new Set([256, 257, 258, 260, 261, 262]);
const ages = Object.freeze({ juvenile: [2, 3], mature: [5, 10], ancient: [12, 18] });
const keyOf = (x, y, z) => [x, y, z].join(',');
const tileWidth = 64;

function rank(x, z, seed, salt) {
  let value = Math.imul(x ^ salt, 0x7feb352d) ^ Math.imul(z ^ seed, 0x846ca68b);
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b);
  return (value ^ (value >>> 16)) >>> 0;
}

export function surveyDesertCactusStand(world, tx, tz, age) {
  if (![tx, tz].every(Number.isSafeInteger) || Math.max(Math.abs(tx), Math.abs(tz)) > 33_000_000) {
    throw new TypeError('Invalid cactus tile');
  }
  const { seed } = world, selected = rank(tx, tz, seed, 823);
  const ageClass = age ?? ['juvenile', 'juvenile', 'mature', 'mature', 'mature', 'ancient'][selected % 6];
  if (!Object.hasOwn(ages, ageClass)) throw new TypeError('Invalid cactus age');
  const [min, max] = ages[ageClass];
  const height = min + rank(tx, tz, seed, 1031) % (max - min + 1);
  for (let attempt = 0; attempt < 8; attempt++) {
    const roll = rank(tx, tz, seed, 1247 + attempt * 13);
    const x = tx * tileWidth + 10 + roll % 44;
    const z = tz * tileWidth + 10 + (roll >>> 13) % 44;
    const biome = v6BiomeAt(x, z, seed);
    if (biome?.name !== 'desert' || biome.weight < .86 || world._oasisNear(x, z, 2, biome)) continue;
    const column = world._columnPlan(x, z);
    const y = Math.max(...column.keys());
    if (!dryCaps.has(column.get(y)) || world.get(x, y, z) !== column.get(y) ||
        world.get(x, y - 1, z) === BLOCK.AIR) continue;
    const first = y + 1, last = y + height;
    const cells = [];
    for (let at = y - 1; at <= last + 1; at++) {
      if (world.environmentCaves.get(x, at, z) !== undefined || world.edits.has(keyOf(x, at, z)) ||
          (at >= first && world.get(x, at, z) !== BLOCK.AIR)) break;
      if (at >= first && at <= last) cells.push([x, at, z]);
      if (at === last + 1) return { age: ageClass, height, support: [x, y, z], cells };
    }
  }
  return null;
}

export function openDesertCactusWitness(world, stands, physicalRegionAt) {
  const cells = new Set(), upper = new Set();
  for (const stand of stands) for (const cell of stand.cells) {
    const key = keyOf(...cell);
    if (cells.has(key) || world.get(...cell) !== BLOCK.AIR) throw Error('Cactus stand overlaps an existing cell');
    cells.add(key);
    const owner = physicalRegionAt(...cell);
    if (owner.kind === 'upper') upper.add(owner.key);
  }
  return Object.create(world, {
    hasNaturalNonCubeShapes: { value: true },
    get: { value: (x, y, z) => cells.has(keyOf(x, y, z)) ? stem : world.get(x, y, z) },
    naturalAndLandmarkBlock: { value: (x, y, z) =>
      cells.has(keyOf(x, y, z)) ? stem : world.naturalAndLandmarkBlock(x, y, z) },
    upperNaturalOccupied: { value: key => upper.has(key) || Boolean(world.upperNaturalOccupied?.(key)) },
    save: { value() { throw Error('Desert cactus research requires a separate save profile'); } },
    set: { value() { throw Error('Read-only cactus stand witness'); } }
  });
}
