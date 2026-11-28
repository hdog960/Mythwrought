// SP7 detached headwater pool on the existing Skywater Basin terrace.
import { BLOCK, worldKey } from '../voxel.mjs';
import { waterCell } from '../block-packs/pack-2/water.mjs';
import { Pack2LiveWorld } from '../pack2-world.mjs';
import { mountainV8Material, MOUNTAIN_V8_MATERIAL } from './mountain-v8-materials.mjs';
import { planMountainSubregionAt } from './shattered-peaks-subregions.mjs';

const inside = [-1, 0, 1].flatMap(dx => [-1, 0, 1].map(dz => [dx, dz]));
const bank = [-1, 0, 1].flatMap(offset => [[-2, offset], [2, offset], [offset, -2], [offset, 2]]);
const isRock = id => mountainV8Material(id)?.terrain === true;
const water = waterCell();

export function surveySkywaterPool(world, x, z, offset = 0) {
  if (![x, z].every(Number.isSafeInteger) || ![-1, 0, 1].includes(offset)) return null;
  const top = world.terraceColumn(x, z)?.topY;
  if (!Number.isInteger(top) || top < 36 || top > 134) return null;
  const level = top + offset, cells = [], cuts = [], sill = [], shores = [];
  const untouched = (a, y, b) => !world.edits.has(worldKey(a, y, b)) &&
    world.originalNatural(a, y, b) === BLOCK.AIR;
  function elevation(a, b) {
    if (planMountainSubregionAt(a, b, world.seed) !== 'skywater-basins') return null;
    const high = world.terraceColumn(a, b)?.topY;
    return Number.isInteger(high) && isRock(world.get(a, high, b)) ? high : null;
  }
  for (const [dx, dz] of inside) {
    const a = x + dx, b = z + dz, high = elevation(a, b);
    if (high === null || high < level - 3 || high > level + 1) return null;
    const floor = Math.min(high, level - 1);
    if (!isRock(world.get(a, floor, b)) || world.edits.has(worldKey(a, floor, b))) return null;
    for (let y = floor + 1; y <= Math.max(high, level); y++) {
      if (!untouched(a, y, b)) return null;
      const id = world.get(a, y, b);
      if (y <= high) {
        if (!isRock(id)) return null;
        cuts.push([a, y, b]);
      } else if (id !== BLOCK.AIR) return null;
      if (y <= level) cells.push([a, y, b, water.id, water]);
    }
  }
  const bottom = Math.min(...cells.map(cell => cell[1]));
  for (const [dx, dz] of bank) {
    const a = x + dx, b = z + dz, high = elevation(a, b);
    if (high === null || high < level - 2) return null;
    let native = true;
    for (let y = bottom; y <= level; y++) {
      if (world.edits.has(worldKey(a, y, b))) return null;
      if (y <= high) {
        if (!isRock(world.get(a, y, b))) return null;
      } else {
        if (!untouched(a, y, b) || world.get(a, y, b) !== BLOCK.AIR) return null;
        sill.push([a, y, b]);
        native = false;
      }
    }
    if (native) shores.push([a, b]);
  }
  if (shores.length < 6 || sill.length > 8) return null;
  return { origin: [x, level, z], cells, cuts, sill, shores };
}

export function openSkywaterPoolWitness(world, pool) {
  const changed = new Map(pool.cuts.map(point => [worldKey(...point), BLOCK.AIR]));
  for (const point of pool.sill) changed.set(worldKey(...point), MOUNTAIN_V8_MATERIAL.stone);
  const read = (x, y, z) => changed.get(worldKey(x, y, z)) ?? world.get(x, y, z);
  const terrain = Object.create(world, {
    get: { value: read },
    naturalAndLandmarkBlock: { value: read },
    generationProfile: { value: world.generationProfile },
    upperNaturalOccupied: { value: key => world.upperNaturalOccupied(key) },
    upperNaturalRevision: { value: world.upperNaturalRevision },
    set: { value() { throw Error('Read-only Skywater terrain'); } },
    save: { value() { throw Error('Skywater research requires a separate world profile'); } }
  });
  return new Pack2LiveWorld(terrain, pool.cells);
}
