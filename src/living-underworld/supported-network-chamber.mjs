// Detached U5 hall on a real planned network hub. Preserve the existing
// rock deck and use the original source vetoes for every open cell.
import { BLOCK } from '../voxel.mjs';
import { networkAirAt, planUnderworldRegion } from './worldwide-network.mjs';
import { isCandidateGeologyMaterial } from './protected-entrance-envelope.mjs';
import { measureGalleryCutUnion } from './physical-gallery-construction.mjs';

const keyOf = (x, y, z) => [x, y, z].join(',');

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
  const read = (x, y, z) => cuts.has(keyOf(x, y, z)) ? BLOCK.AIR : world.get(x, y, z);
  const witness = Object.create(world, {
    get: { value: read },
    naturalAndLandmarkBlock: { value: read },
    set: { value() { throw Error('Read-only chamber witness'); } },
    save: { value() { throw Error('Chamber research requires a separate world profile'); } }
  });
  const routes = [
    Array.from({ length: 27 }, (_, i) => ({ x: hub.x + i - 13, feet, z: hub.z })),
    Array.from({ length: 23 }, (_, i) => ({ x: hub.x, feet, z: hub.z + i - 11 }))
  ];
  return { hub, feet, deck, clearance, cuts, costs, routes, witness };
}
