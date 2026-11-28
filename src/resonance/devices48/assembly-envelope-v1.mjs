// D3 source-only bounded assembly envelope v1. Never authorizes actuation.
const MAX_PARTS = 32;
const MAX_SPAN = 8;
const MAX_STEPS = 16;
function integer(v, min, max, label) {
  if (!Number.isSafeInteger(v) || v < min || v > max) throw new RangeError(label);
  return v;
}
function point(p, label) {
  if (!p || typeof p !== 'object' || Array.isArray(p)) throw new TypeError(label);
  return Object.freeze([
    integer(p.x, -1000000, 1000000, label + '.x'),
    integer(p.y, -1000000, 1000000, label + '.y'),
    integer(p.z, -1000000, 1000000, label + '.z')
  ]);
}
export function previewAssemblyEnvelope(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('input');
  if (input.productionBound !== false || input.authoritativeDelivery === true || input.allowActuation === true)
    throw new Error('source-only preview cannot authorize production');
  if (typeof input.worldId !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(input.worldId))
    throw new TypeError('worldId');
  if (typeof input.deviceId !== 'string' || !/^[a-zA-Z0-9_-]{1,64}$/.test(input.deviceId))
    throw new TypeError('deviceId');
  if (!Array.isArray(input.parts) || input.parts.length < 1 || input.parts.length > MAX_PARTS)
    throw new RangeError('parts');
  const parts = input.parts.map((p, i) => point(p, 'parts[' + i + ']'));
  const seen = new Set(parts.map(p => p.join(',')));
  if (seen.size !== parts.length) throw new Error('duplicate parts');
  const min = [0,1,2].map(axis => Math.min(...parts.map(p => p[axis])));
  const max = [0,1,2].map(axis => Math.max(...parts.map(p => p[axis])));
  if (max.some((v, axis) => v - min[axis] + 1 > MAX_SPAN)) throw new RangeError('assembly span');
  const delta = point(input.delta, 'delta');
  if (delta.every(v => v === 0)) throw new RangeError('zero movement');
  if (delta.some(v => Math.abs(v) > MAX_STEPS)) throw new RangeError('movement too long');
  const stepCount = Math.max(...delta.map(Math.abs));
  // Integer lattice supercover: include both floor and ceil at each fractional position.
  // Conservative for swept occupancy; cannot replace continuous engine collision.
  const swept = new Set();
  for (let s = 0; s <= stepCount; s++) {
    for (const p of parts) {
      const axes = [0,1,2].map(axis => {
        const q = p[axis] + delta[axis] * s / stepCount;
        return [...new Set([Math.floor(q), Math.ceil(q)])];
      });
      for (const x of axes[0]) for (const y of axes[1]) for (const z of axes[2])
        swept.add(x + ',' + y + ',' + z);
    }
  }
  const cells = [...swept].map(s => s.split(',').map(Number))
    .sort((a,b) => a[0]-b[0] || a[1]-b[1] || a[2]-b[2])
    .map(([x,y,z]) => Object.freeze({x,y,z}));
  return Object.freeze({
    version: 1, worldId: input.worldId, deviceId: input.deviceId,
    sourceOnly: true, mayActuate: false, requiresGameCollision: true,
    requiresDeliveredPowerReceipt: true, partCount: parts.length,
    stepCount, energyDemandUnits: parts.length * stepCount,
    sweptCells: Object.freeze(cells)
  });
}
