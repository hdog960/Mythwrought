// Detached U5 hall on a real planned network hub. Preserve the existing
// rock deck and use the original source vetoes for every open cell.
import { BLOCK } from '../voxel.mjs';
import { networkAirAt, planUnderworldRegion } from './worldwide-network.mjs';
import { isCandidateGeologyMaterial } from './protected-entrance-envelope.mjs';
import { measureGalleryCutUnion } from './physical-gallery-construction.mjs';
import { compileGalleryConstructionFootprint } from './combined-stair-footprints.mjs';
import { auditProtectedSubsurfaceStairs } from './protected-subsurface-stairs.mjs';

const keyOf = (x, y, z) => [x, y, z].join(',');
const coordinates = key => key.split(',').map(Number);

function openChamberWitness(world, cuts) {
  const read = (x, y, z) => cuts.has(keyOf(x, y, z)) ? BLOCK.AIR : world.get(x, y, z);
  return Object.create(world, {
    get: { value: read },
    naturalAndLandmarkBlock: { value: read },
    set: { value() { throw Error('Read-only chamber witness'); } },
    save: { value() { throw Error('Chamber research requires a separate world profile'); } }
  });
}

export function surveySupportedNetworkChamber(world, { rx, rz, layer, originalProtected }) {
  if (![rx, rz, layer].every(Number.isSafeInteger) || layer < 0 || layer > 3 ||
      typeof originalProtected !== 'function') throw new TypeError('Invalid supported chamber survey');
  const { seed } = world, { hub } = planUnderworldRegion(seed, rx, rz).layers[layer];
  const feet = hub.y - 3, deck = [], clearance = [], cuts = new Set();
  const eligible = (x, y, z) => !world.edits.has(keyOf(x, y, z)) &&
    world.environmentCaves.get(x, y, z) === undefined && !originalProtected(x, y, z);
  for (let dz = -12; dz <= 12; dz++) for (let dx = -14; dx <= 14; dx++) {
    const distance = (dx / 14) ** 2 + (dz / 12) ** 2;
    if (distance > 1) continue;
    const x = hub.x + dx, z = hub.z + dz;
    const support = world.get(x, feet - 1, z);
    if (!eligible(x, feet - 1, z) || support === BLOCK.AIR || !isCandidateGeologyMaterial(support)) return null;
    const headroom = 3 + Math.floor((1 - distance) * 5);
    deck.push({ x, feet, z, headroom, support });
    for (let y = feet; y < feet + headroom; y++) {
      if (!networkAirAt(seed, x, y, z) || !eligible(x, y, z)) return null;
      const block = world.get(x, y, z);
      if (!isCandidateGeologyMaterial(block)) return null;
      clearance.push([x, y, z]);
      if (block !== BLOCK.AIR) cuts.add(keyOf(x, y, z));
    }
  }
  const costs = measureGalleryCutUnion(cuts, (...point) => world.get(...point));
  if (!costs.ok) return null;
  const routes = [
    Array.from({ length: 27 }, (_, i) => ({ x: hub.x + i - 13, feet, z: hub.z })),
    Array.from({ length: 23 }, (_, i) => ({ x: hub.x, feet, z: hub.z + i - 11 }))
  ];
  return { hub, feet, deck, clearance, cuts, costs, routes, witness: openChamberWitness(world, cuts) };
}

export function surveySupportedChamberAccess(world, options) {
  const chamber = surveySupportedNetworkChamber(world, options);
  if (!chamber) return null;
  const { seed } = world, { rx, rz, originalProtected } = options, { hub, feet } = chamber;
  const regional = planUnderworldRegion(seed, rx, rz);
  const branches = regional.capsules.filter(({ a, b }) => a === hub && Math.max(Math.abs(b.x - a.x), Math.abs(b.z - a.z)) >= 36);
  const originalAt = (...cell) => world.get(...cell);
  const links = [], cuts = new Set(chamber.cuts);
  for (const { b } of branches) {
    const dx = b.x - hub.x, dz = b.z - hub.z, length = Math.max(Math.abs(dx), Math.abs(dz));
    const reach = 36, x1 = Math.round(hub.x + dx * reach / length), z1 = Math.round(hub.z + dz * reach / length);
    const proposal = { ok: true, segments: [{ a: { x: hub.x, y: feet, z: hub.z }, b: { x: x1, y: feet, z: z1 } }] };
    const footprint = compileGalleryConstructionFootprint(proposal);
    if (!footprint.ok || [...footprint.clearance].some(key => !networkAirAt(seed, ...coordinates(key)))) continue;
    const audit = auditProtectedSubsurfaceStairs(proposal, {
      naturalAt: originalAt, authoredAt: (...cell) => world.environmentCaves.get(...cell),
      editedAt: (...cell) => world.edits.has(keyOf(...cell)), protectedAt: originalProtected,
      stopOnFirstUnsafe: true
    });
    if (!audit.ok) continue;
    for (const key of footprint.clearance) if (originalAt(...coordinates(key)) !== BLOCK.AIR) cuts.add(key);
    const route = Array.from({ length: reach + 1 }, (_, i) => ({
      x: Math.round(hub.x + (x1 - hub.x) * i / reach), feet, z: Math.round(hub.z + (z1 - hub.z) * i / reach)
    }));
    links.push({ route, ...footprint });
  }
  const costs = measureGalleryCutUnion(cuts, originalAt);
  return links.length && costs.ok ? { chamber, links, cuts, costs, witness: openChamberWitness(world, cuts) } : null;
}
