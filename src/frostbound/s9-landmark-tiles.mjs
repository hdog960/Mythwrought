// Detached Frostbound landmark survey with bounded, resumable tile probes.
import { glacierlandsWeight } from './s4-glacierlands.mjs';
import { inspectGlacierBridgeWalk, surveyGlacierBridge } from './s7-glacier-bridge.mjs';

const size = 128, margin = 16, width = size - 2 * margin, area = width * width;
const variants = [['x', 7], ['z', 7], ['x', 9], ['z', 9], ['x', 11], ['z', 11], ['x', 5], ['z', 5]];
const endOfTile = area * variants.length;

function tileHash(seed, x, z) {
  let n = Math.imul(seed, 0x9e3779b1) ^ Math.imul(x, 0x7feb352d) ^ Math.imul(z, 0x846ca68b);
  n = Math.imul(n ^ (n >>> 16), 0x45d9f3b);
  return (n ^ (n >>> 16)) >>> 0;
}

export function surveyGlacierBridgeTile(world, tx, tz, { cursor = null, limit = 32 } = {}) {
  if (![tx, tz].every(Number.isSafeInteger) || Math.max(Math.abs(tx), Math.abs(tz)) > 78_000 ||
      !Number.isInteger(limit) || limit < 1 || limit > 64 ||
      typeof world.forestSourceVersion !== 'string' || world.edits.size !== 0) {
    throw new TypeError('Glacier Bridge survey needs a bounded unedited Frostbound source');
  }
  const identity = ['glacier-bridge-tile-v1', world.forestSourceVersion, world.seed, tx, tz].join(':');
  const start = cursor?.next ?? 0, offset = tileHash(world.seed, tx, tz);
  if (cursor && (cursor.identity !== identity || !Number.isInteger(start) || start < 0 || start >= endOfTile || offset % 4 !== 0)) {
    throw new TypeError('Stale Glacier Bridge survey cursor');
  }
  if (offset % 4 !== 0) return { state: 'empty', identity, probes: 0, cursor: null };
  const end = Math.min(start + limit, endOfTile);
  for (let probe = start; probe < end; probe++) {
    const slot = Math.floor(probe / variants.length), variant = (probe + (offset >>> 8)) % variants.length;
    // 191 is coprime to the 96×96 interior, so every coordinate occurs once.
    const cell = (offset + slot * 191) % area;
    const x = tx * size + margin + cell % width, z = tz * size + margin + Math.floor(cell / width);
    if (glacierlandsWeight(x, z, world.seed) < .72) continue;
    const [axis, span] = variants[variant], bridge = surveyGlacierBridge(world, { x, z, axis, span });
    const walk = bridge ? inspectGlacierBridgeWalk(world, bridge) : null;
    if (walk) return { state: 'admitted', identity, probes: probe - start + 1, bridge, walk };
  }
  const pending = end < endOfTile;
  return { state: pending ? 'pending' : 'empty', identity, probes: end - start,
    cursor: pending ? Object.freeze({ identity, next: end }) : null };
}
