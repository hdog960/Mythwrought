// Read-only E7 survey of an existing monument plan against the active Wilds
// source. Failed surveys never reserve or modify an owner.
import { BLOCK } from '../voxel.mjs';
import { ENVIRONMENT_GROUND as ground } from '../environment-ground.mjs';
import { physicalRegionAt } from '../world-height.mjs';
import { v6BiomeAt } from './v6-balanced-biomes.mjs';
import { buildWildsMonument } from './enchanted-wilds-monuments.mjs';

const soil = new Set([ground.woodlandLoam, ground.woodlandPeat, ground.woodlandMoss]);

function openMonumentWitness(world, cells, upper) {
  return Object.create(world, {
    get: { value: (a, b, c) => cells.get([a, b, c].join(',')) ?? world.get(a, b, c) },
    naturalAndLandmarkBlock: { value: (a, b, c) =>
      cells.get([a, b, c].join(',')) ?? world.naturalAndLandmarkBlock(a, b, c) },
    upperNaturalOccupied: { value: key => upper.has(key) || world.upperNaturalOccupied(key) },
    set: { value() { throw Error('Read-only Wilds monument witness'); } },
    save: { value() { throw Error('Wilds monument research requires a separate save profile'); } }
  });
}

export function surveyWildsMonumentSite(world, { id, x, z, turn }) {
  const biome = v6BiomeAt(x, z, world.seed);
  if (biome?.name !== 'enchanted' || biome.weight < .90) return null;
  const center = world._columnPlan(x, z);
  const floor = Math.max(...center.keys());
  if (!soil.has(center.get(floor))) return null;
  const plan = buildWildsMonument(id, x, floor, z, turn);
  if (!plan) return null;

  const feet = new Map(plan.footprint.map(point => [point.join(','), point]));
  for (const [a, b, c] of plan.approach) if (b === floor + 1) feet.set(a + ',' + c, [a, c]);
  const caveAt = (a, b, c) => world.environmentCaves.get(a, b, c) !== undefined;
  for (const [a, c] of feet.values()) {
    const column = world._columnPlan(a, c);
    if (v6BiomeAt(a, c, world.seed)?.name !== 'enchanted' || Math.max(...column.keys()) !== floor ||
        !soil.has(column.get(floor)) || !soil.has(world.get(a, floor, c)) ||
        world.get(a, floor - 1, c) === BLOCK.AIR || caveAt(a, floor, c) || caveAt(a, floor - 1, c)) return null;
  }
  const cells = new Map(), upper = new Set();
  for (const [a, b, c, id] of [...plan.cells, ...plan.approach]) {
    if (v6BiomeAt(a, c, world.seed)?.name !== 'enchanted' ||
        world.wildsSource.reserved(a, b, c) || caveAt(a, b, c) || world.get(a, b, c) !== BLOCK.AIR) return null;
    if (id === undefined) continue;
    cells.set([a, b, c].join(','), id);
    const owner = physicalRegionAt(a, b, c);
    if (owner.kind === 'upper') upper.add(owner.key);
  }
  return { plan, witness: openMonumentWitness(world, cells, upper), upperOwners: [...upper].sort(), support: feet.size };
}

// All sites must pass against the same unchanged terrain. Footings, body
// clearance and reserved entrances count towards the horizontal claim.
export function composeWildsMonumentSurveys(world, sites) {
  if (!Array.isArray(sites) || sites.length < 1 || sites.length > 8) return null;
  const entries = [], occupied = new Set(), cells = new Map(), upper = new Set();
  for (const site of [...sites].sort((a, b) => a.x - b.x || a.z - b.z || a.id - b.id || a.turn - b.turn)) {
    const entry = surveyWildsMonumentSite(world, site);
    if (!entry) return null;
    const { plan } = entry;
    const footprint = new Set([...plan.footprint.map(point => point.join(',')),
      ...[...plan.cells, ...plan.approach].map(([x, , z]) => x + ',' + z)]);
    if ([...footprint].some(point => occupied.has(point))) return null;
    for (const point of footprint) occupied.add(point);
    for (const [x, y, z, id] of plan.cells) cells.set([x, y, z].join(','), id);
    for (const key of entry.upperOwners) upper.add(key);
    entries.push(plan);
  }
  return { plans: entries, witness: openMonumentWitness(world, cells, upper), cells: cells.size };
}
