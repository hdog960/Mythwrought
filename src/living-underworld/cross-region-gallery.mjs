// A finite walkable connection at an original shared network boundary.
import { BLOCK } from '../voxel.mjs';
import { compileGalleryConstructionFootprint } from './combined-stair-footprints.mjs';
import { auditProtectedSubsurfaceStairs } from './protected-subsurface-stairs.mjs';
import { measureGalleryCutUnion } from './physical-gallery-construction.mjs';
import { networkAirAt, planUnderworldRegion, UNDERWORLD_LEVELS } from './worldwide-network.mjs';

const keyOf = (x, y, z) => [x, y, z].join(',');
const coordinates = key => key.split(',').map(Number);

export function surveyCrossRegionGallery(world, { rx, rz, axis, level, reach, originalProtected }) {
  if (![rx, rz, level, reach].every(Number.isSafeInteger) || !['x', 'z'].includes(axis) ||
      level < 0 || level >= UNDERWORLD_LEVELS.length || reach < 4 || reach > 16 ||
      typeof originalProtected !== 'function') throw new TypeError('Invalid gallery boundary survey');
  const { seed } = world, acrossX = axis === 'x';
  const region = planUnderworldRegion(seed, rx, rz);
  const neighboring = planUnderworldRegion(seed, rx + Number(acrossX), rz + Number(!acrossX));
  const portal = region.layers[level].portals[acrossX ? 'east' : 'south'];
  const other = neighboring.layers[level].portals[acrossX ? 'west' : 'north'];
  if (portal.x !== other.x || portal.y !== other.y || portal.z !== other.z) return null;
  const point = step => ({ x: portal.x + step * Number(acrossX), y: portal.y,
    z: portal.z + step * Number(!acrossX) });
  const proposal = { ok: true, segments: [{ a: point(-reach), b: point(0) }, { a: point(0), b: point(reach) }] };
  const footprints = compileGalleryConstructionFootprint(proposal);
  if (!footprints.ok || [...footprints.clearance].some(key => !networkAirAt(seed, ...coordinates(key)))) return null;
  const originalAt = (...cell) => world.get(...cell);
  const source = auditProtectedSubsurfaceStairs(proposal, {
    naturalAt: originalAt, authoredAt: (...cell) => world.environmentCaves.get(...cell),
    editedAt: (...cell) => world.edits.has(keyOf(...cell)), protectedAt: originalProtected
  });
  if (!source.ok) return null;
  const cuts = new Set([...footprints.clearance].filter(key => originalAt(...coordinates(key)) !== BLOCK.AIR));
  const costs = measureGalleryCutUnion(cuts, originalAt);
  if (!costs.ok) return null;
  const route = Array.from({ length: reach * 2 + 1 }, (_, index) => {
    const { x, y: feet, z } = point(index - reach);
    return { x, feet, z };
  });
  const witness = Object.create(world, {
    get: { value: (x, y, z) => cuts.has(keyOf(x, y, z)) ? BLOCK.AIR : world.get(x, y, z) },
    set: { value() { throw Error('Read-only gallery boundary witness'); } },
    save: { value() { throw Error('Gallery boundary research requires a durable profile'); } }
  });
  return { axis, level, portal, route, cuts, costs, sourceChecks: source.sourceChecks,
    support: footprints.support, clearance: footprints.clearance, witness };
}
