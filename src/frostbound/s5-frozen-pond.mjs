// S5 detached, naturally enclosed frozen pond. The existing relief is the
// basin and the bank. A thin, owned snow cap can give way to liquid water.
import { BLOCK, worldKey } from '../voxel.mjs';
import { waterCell } from '../block-packs/pack-2/water.mjs';
import { mirrorfrostWeight } from './s4-mirrorfrost-basin.mjs';

const clearLakeIce = 275;
const snowCaps = new Set([272, 275, 276, 279]);
const removableSnowCaps = new Set([272, clearLakeIce]);
const cardinal = [[-1, 0], [1, 0], [0, -1], [0, 1]];
const stillWater = waterCell();
const maxRadius = 12, maxArea = 120;

export function surveyMirrorfrostPond(world, x, z) {
  const caps = new Map();
  function readCap(a, b) {
    const key = a + ',' + b;
    if (caps.has(key)) return caps.get(key);
    const column = world._columnPlan(a, b);
    const cap = Math.max(...column.keys());
    const valid = column.size > 0 && mirrorfrostWeight(a, b, world.seed) >= .63 && snowCaps.has(world.get(a, cap, b));
    caps.set(key, valid ? cap : null);
    return caps.get(key);
  }
  const center = readCap(x, z);
  if (center === null || center < 4 || center > 14) return null;
  const iceY = center + 1;
  const queue = [[x, z]], seen = new Set([x + ',' + z]), shore = new Map();
  const ice = [], water = [], snowRemoved = [];
  for (let i = 0; i < queue.length; i++) {
    const [a, b] = queue[i];
    const capY = readCap(a, b);
    if (Math.max(Math.abs(a - x), Math.abs(b - z)) > maxRadius || capY === null) return null;
    if (capY >= iceY) {
      // A neighboring high column must have intact solid sides all the way
      // down to the surface water, even if its uppermost cell is supported.
      for (let y = iceY - 2; y <= iceY; y++) {
        const cap = world.get(a, y, b);
        if (cap === BLOCK.AIR || cap === stillWater.id || world.environmentCaves.get(a, y, b) !== undefined ||
            world.edits.has(worldKey(a, y, b))) return null;
      }
      shore.set(a + ',' + b, [a, capY, b]);
      continue;
    }
    const removeSnow = capY === iceY - 1;
    if (removeSnow && !removableSnowCaps.has(world.get(a, capY, b))) return null;
    const floor = removeSnow ? capY - 1 : capY;
    if (ice.length >= maxArea || floor < iceY - 3) return null;
    if (world.get(a, floor - 1, b) === BLOCK.AIR || world.environmentCaves.get(a, floor, b) !== undefined ||
        world.environmentCaves.get(a, floor - 1, b) !== undefined) return null;
    for (let y = floor + 1; y <= iceY + 1; y++) {
      if ((y !== capY || !removeSnow) && world.get(a, y, b) !== BLOCK.AIR) return null;
      if (world.environmentCaves.get(a, y, b) !== undefined || world.edits.has(worldKey(a, y, b))) return null;
    }
    if (removeSnow) snowRemoved.push([a, capY, b]);
    ice.push([a, iceY, b]);
    for (let y = floor + 1; y < iceY; y++) water.push([a, y, b]);
    for (const [dx, dz] of cardinal) {
      const next = [a + dx, b + dz], key = next.join(',');
      if (seen.has(key)) continue;
      seen.add(key);
      queue.push(next);
    }
  }
  if (ice.length < 9 || water.length < 5 || shore.size < 8) return null;
  return { iceY, ice, water, snowRemoved, shore: [...shore.values()] };
}

export function openMirrorfrostPondWitness(world, pond, { iceCover = true } = {}) {
  const ice = new Set(pond.ice.map(point => worldKey(...point)));
  const water = new Map(pond.water.map(point => [worldKey(...point), stillWater]));
  const byChunk = new Map();
  for (const [x, y, z] of pond.water) {
    const key = Math.floor(x / 16) + ',' + Math.floor(z / 16);
    if (!byChunk.has(key)) byChunk.set(key, []);
    byChunk.get(key).push([worldKey(x, y, z), stillWater]);
  }
  function pondBlock(x, y, z) {
    const key = worldKey(x, y, z);
    return iceCover && ice.has(key) ? clearLakeIce : water.get(key)?.id;
  }
  return Object.create(world, {
    get: { value: (x, y, z) => pondBlock(x, y, z) ?? world.get(x, y, z) },
    naturalAndLandmarkBlock: { value: (x, y, z) => pondBlock(x, y, z) ?? world.naturalAndLandmarkBlock(x, y, z) },
    environmentWaterState: { value: (x, y, z) => water.get(worldKey(x, y, z)) ?? world.environmentWaterState(x, y, z) },
    environmentOasisWaterEntries: { value: (cx, cz) =>
      [...world.environmentOasisWaterEntries(cx, cz), ...(byChunk.get(cx + ',' + cz) ?? [])] },
    save: { value() { throw Error('Frozen pond research requires a separate save profile'); } },
    set: { value() { throw Error('Read-only frozen pond witness'); } }
  });
}
