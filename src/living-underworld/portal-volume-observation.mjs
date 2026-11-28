// Read-only handoff for finite reservations near a physically qualified portal.
import { BLOCK, worldKey } from '../voxel.mjs';

const contains = (bounds, x, y, z) => x >= bounds.minX && x <= bounds.maxX &&
  y >= bounds.minY && y <= bounds.maxY && z >= bounds.minZ && z <= bounds.maxZ;
const keys = ['minX', 'maxX', 'minY', 'maxY', 'minZ', 'maxZ'];

export function openPortalVolumeObservation({ original, released, sourceRevision, gallery, originalProtected }) {
  const profile = released.generationProfile;
  if (released.seed !== original.seed || profile?.seed !== released.seed ||
      typeof profile.generator !== 'string' || !/^[\da-f]{40}$/.test(sourceRevision) ||
      typeof originalProtected !== 'function' || gallery?.axis !== 'x' || gallery.route.length !== 33) {
    throw new TypeError('Invalid portal observation source');
  }
  const identity = Object.freeze({ worldSeed: released.seed, worldProfile: profile.generator, revision: sourceRevision });
  const { x, y, z } = gallery.portal;
  const coverage = Object.freeze({ minX: x - 17, maxX: x + 17, minY: y - 2, maxY: y + 4, minZ: z - 4, maxZ: z + 4 });
  const reserved = new Set([...gallery.support, ...gallery.clearance]);
  for (const key of reserved) {
    const point = key.split(',').map(Number);
    if (!contains(coverage, ...point) || original.get(...point) !== released.get(...point) ||
        released.edits.has(key) || released.environmentCaves.get(...point) !== undefined || originalProtected(...point)) {
      throw new RangeError('Portal source changed at ' + key);
    }
  }
  const socket = Object.freeze({ x, feet: y, z, axis: gallery.axis, routeStations: gallery.route.length,
    support: Object.freeze([x, y - 1, z]), body: Object.freeze([Object.freeze([x, y, z]), Object.freeze([x, y + 1, z])]) });
  const observed = [];
  for (let a = coverage.minX; a <= coverage.maxX; a++) for (let b = coverage.minY; b <= coverage.maxY; b++) {
    for (let c = coverage.minZ; c <= coverage.maxZ; c++) {
      const key = worldKey(a, b, c), value = released.get(a, b, c);
      observed.push({ a, b, c, key, value, matched: original.get(a, b, c) === value });
    }
  }
  return Object.freeze({ identity, coverage, socket, observedCells: observed.length,
    inspect(bounds, expected) {
      if (!expected || keys.some(key => !Number.isSafeInteger(bounds?.[key])) ||
          bounds.minX > bounds.maxX || bounds.minY > bounds.maxY || bounds.minZ > bounds.maxZ) {
        return { state: 'unknown', reason: 'invalid-request' };
      }
      if (Object.keys(identity).some(key => identity[key] !== expected[key]) || released.generationProfile !== profile) {
        return { state: 'unknown', reason: 'source-identity' };
      }
      let uncertain = false;
      for (const { a, b, c, key, value, matched } of observed) {
        if (!contains(bounds, a, b, c)) continue;
        const cell = [a, b, c];
        if (released.edits.has(key)) return { state: 'conflict', reason: 'player-edit', cell };
        if (released.environmentCaves.get(a, b, c) !== undefined || originalProtected(a, b, c)) {
          return { state: 'conflict', reason: 'original-owner', cell };
        }
        if (reserved.has(key)) return { state: 'conflict', reason: 'reserved-cave-route', cell };
        if (value === BLOCK.AIR) return { state: 'conflict', reason: 'existing-cave-air', cell };
        if (!matched || released.get(a, b, c) !== value) uncertain = true;
      }
      if (!contains(coverage, bounds.minX, bounds.minY, bounds.minZ) ||
          !contains(coverage, bounds.maxX, bounds.maxY, bounds.maxZ)) return { state: 'unknown', reason: 'outside-survey' };
      if (uncertain) return { state: 'unknown', reason: 'unverified-terrain' };
      return { state: 'observed-clear' };
    } });
}
