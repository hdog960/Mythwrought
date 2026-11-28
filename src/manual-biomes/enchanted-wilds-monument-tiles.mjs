// Detached procedural survey for the existing large landmark proposals.
import { surveyWildsMonumentSite } from './enchanted-wilds-monument-site.mjs';
import { inspectWildsLandmarkWalk } from './enchanted-wilds-landmark-walk.mjs';
import { WILDS_MONUMENTS } from './enchanted-wilds-monuments.mjs';
import { v6BiomeAt } from './v6-balanced-biomes.mjs';

const size = 128, margin = 18, width = size - 2 * margin, area = width * width;
const validIds = new Set(WILDS_MONUMENTS.map(row => row.id));

function hash(seed, tx, tz) {
  let h = Math.imul(seed, 0x9e3779b1) ^ Math.imul(tx, 0x7feb352d) ^ Math.imul(tz, 0x846ca68b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h ^ (h >>> 16)) >>> 0;
}

export function surveyWildsMonumentTile(world, tx, tz, { ids, cursor = null, limit = 32 } = {}) {
  if (![tx, tz].every(Number.isSafeInteger) || Math.max(Math.abs(tx), Math.abs(tz)) > 78_000 ||
      !Number.isInteger(limit) || limit < 1 || limit > 64 ||
      !Array.isArray(ids) || !ids.length || ids.some(id => !validIds.has(id))) {
    throw new TypeError('Invalid bounded Wilds monument survey');
  }
  if (typeof world.wildsSource?.sourceVersion !== 'string' || world.edits.size !== 0) {
    throw new TypeError('Wilds monument survey requires an unedited source');
  }
  const order = [...new Set(ids)].sort((a, b) => a - b);
  const identity = ['wilds-tile-v1', world.wildsSource.sourceVersion, world.seed, tx, tz, ...order].join(':');
  const length = area * order.length * 4, start = cursor?.next ?? 0;
  if (cursor && (cursor.identity !== identity || !Number.isInteger(start) || start < 0 || start >= length)) {
    throw new TypeError('Stale Wilds monument survey cursor');
  }
  const offset = hash(world.seed, tx, tz);
  const end = Math.min(length, start + limit);
  // The stride is coprime to 92². Every interior position appears exactly once.
  const stride = 181;
  for (let next = start; next < end; next++) {
    const slot = Math.floor(next / (order.length * 4)), variant = next % (order.length * 4);
    const cell = (offset + slot * stride) % area;
    const x = tx * size + margin + cell % width, z = tz * size + margin + Math.floor(cell / width);
    if (v6BiomeAt(x, z, world.seed)?.name !== 'enchanted') continue;
    const id = order[Math.floor(variant / 4)], turn = (variant + offset) % 4;
    const entry = surveyWildsMonumentSite(world, { id, x, z, turn });
    if (!entry) continue;
    const route = inspectWildsLandmarkWalk(entry.witness, entry.plan);
    if (route) return { state: 'admitted', identity, probes: next - start + 1, entry, route };
  }
  return { state: end < length ? 'pending' : 'empty', identity, probes: end - start,
    cursor: end < length ? Object.freeze({ identity, next: end }) : null };
}
