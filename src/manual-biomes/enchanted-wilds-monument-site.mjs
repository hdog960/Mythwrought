// Read-only E7 survey of an existing monument plan against the active Wilds
// source. Failed surveys never reserve or modify an owner.
import { BLOCK } from '../voxel.mjs';
import { ENVIRONMENT_GROUND as ground } from '../environment-ground.mjs';
import { physicalRegionAt } from '../world-height.mjs';
import { v6BiomeAt } from './v6-balanced-biomes.mjs';
import { buildWildsMonument } from './enchanted-wilds-monuments.mjs';

const soil = new Set([ground.woodlandLoam, ground.woodlandPeat, ground.woodlandMoss]);

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
  const witness = Object.create(world, {
    get: { value: (a, b, c) => cells.get([a, b, c].join(',')) ?? world.get(a, b, c) },
    upperNaturalOccupied: { value: key => upper.has(key) || world.upperNaturalOccupied(key) },
    set: { value() { throw Error('Read-only Wilds monument witness'); } },
    save: { value() { throw Error('Wilds monument research requires a separate save profile'); } }
  });
  return { plan, witness, upperOwners: [...upper].sort(), support: feet.size };
}
