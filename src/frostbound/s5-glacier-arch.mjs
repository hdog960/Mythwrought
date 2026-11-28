// S5 physical glacier arch. It spans an existing supported approach and can
// publish only when each rib and both footings clear the original source.
import { BLOCK, worldKey } from '../voxel.mjs';
import { physicalRegionAt } from '../world-height.mjs';
import { glacierlandsWeight } from './s4-glacierlands.mjs';

const thinIce = 275, blueIce = 276;
const caps = new Set([272, thinIce, blueIce, 279]);
const ribs = [[6, 6], [5, 6], [4, 5], [3, 4], [0, 3]];

export function surveyGlacierArch(world, x, z, axis) {
  if (!['x', 'z'].includes(axis) || glacierlandsWeight(x, z, world.seed) < .72) return null;
  const at = (span, run) => axis === 'x' ? [x + span, z + run] : [x + run, z + span];
  const protectedAt = (a, y, b) => world.environmentCaves.get(a, y, b) !== undefined ||
    world.edits.has(worldKey(a, y, b));
  function floor(a, b) {
    const column = world._columnPlan(a, b);
    if (!column.size || glacierlandsWeight(a, b, world.seed) < .58) return null;
    const top = Math.max(...column.keys());
    return caps.has(world.get(a, top, b)) && !protectedAt(a, top, b) &&
      !protectedAt(a, top - 1, b) && world.get(a, top - 1, b) !== BLOCK.AIR ? top : null;
  }
  const trackY = floor(x, z);
  if (trackY === null || trackY < 4 || trackY > 17) return null;
  const route = [];
  for (let run = -4; run <= 5; run++) {
    const [a, b] = at(0, run);
    if (floor(a, b) !== trackY) return null;
    for (let y = trackY + 1; y <= trackY + 3; y++) {
      if (world.get(a, y, b) !== BLOCK.AIR || protectedAt(a, y, b)) return null;
    }
    route.push([a, trackY + 1, b]);
  }
  const cells = [], footings = [];
  for (let span = -4; span <= 4; span++) for (let run = 0; run <= 1; run++) {
    const [a, b] = at(span, run);
    const [low, high] = ribs[Math.abs(span)];
    let first = trackY + 1 + low;
    if (Math.abs(span) === 4) {
      const top = floor(a, b);
      if (top === null || Math.abs(top - trackY) > 1) return null;
      first = top + 1;
      footings.push([a, top, b]);
    }
    for (let y = first; y <= trackY + 1 + high; y++) {
      if (world.get(a, y, b) !== BLOCK.AIR || protectedAt(a, y, b)) return null;
      cells.push([a, y, b, Math.abs(span) <= 2 && run === 1 ? thinIce : blueIce]);
    }
  }
  return { origin: [x, trackY, z], axis, cells, footings, route };
}

export function openFrostboundIceFormationWitness(world, formation) {
  const cells = new Map(), upper = new Set();
  for (const [x, y, z, id] of formation.cells) {
    cells.set(worldKey(x, y, z), id);
    const owner = physicalRegionAt(x, y, z);
    if (owner.kind === 'upper') upper.add(owner.key);
  }
  return Object.create(world, {
    get: { value: (x, y, z) => cells.get(worldKey(x, y, z)) ?? world.get(x, y, z) },
    naturalAndLandmarkBlock: { value: (x, y, z) =>
      cells.get(worldKey(x, y, z)) ?? world.naturalAndLandmarkBlock(x, y, z) },
    upperNaturalOccupied: { value: key => upper.has(key) || Boolean(world.upperNaturalOccupied?.(key)) },
    upperNaturalRevision: { value: world.upperNaturalRevision ?? 0 },
    save: { value() { throw Error('Frostbound ice research requires a separate save profile'); } },
    set: { value() { throw Error('Read-only ice formation witness'); } }
  });
}

export const openGlacierArchWitness = openFrostboundIceFormationWitness;
