// Lane :00 opt-in, memory-only landmarks sourced from explicitly observed terrain.
// No terrain reads, map discovery writes, saves, or production registration.
export const NAV00_LANDMARK_VERSION = 1;
const safeCoord = n => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= 40000000;
const safeSeed = s => (typeof s === 'string' && s.length > 0 && s.length <= 128) || (typeof s === 'number' && Number.isSafeInteger(s));
const safeId = s => typeof s === 'string' && /^[A-Za-z0-9_-]{1,48}$/.test(s);
const safeLabel = s => typeof s === 'string' && s.length >= 1 && s.length <= 48 && !/[<>\x00-\x1f]/.test(s);
const safeKind = s => ['ridge','cave-entrance','lake','forest','cliff','other'].includes(s);
export function createObservedLandmarks({worldSeed, discovery, limit=128}={}) {
  if (!safeSeed(worldSeed) || !discovery || typeof discovery.has !== 'function' || !Number.isSafeInteger(limit) || limit < 1 || limit > 512) throw Error('Invalid observed landmark configuration');
  const items = new Map();
  const assertSeed = seed => { if (seed !== worldSeed) throw Error('World seed mismatch'); };
  const discovered = p => discovery.has(p.x,p.z) === true;
  const clone = p => Object.freeze({id:p.id,x:p.x,z:p.z,kind:p.kind,label:p.label});
  return Object.freeze({
    version:NAV00_LANDMARK_VERSION,
    observe(record,{seed=worldSeed,observed=false}={}) {
      assertSeed(seed);
      if (observed !== true || !record || !safeId(record.id) || !safeCoord(record.x) || !safeCoord(record.z) || !safeKind(record.kind) || !safeLabel(record.label)) throw Error('Landmark requires valid observed terrain');
      if (!discovered(record)) throw Error('Landmark coordinate is undiscovered');
      if (!items.has(record.id) && items.size >= limit) throw Error('Landmark capacity exceeded');
      items.set(record.id,clone(record));
      return true;
    },
    remove(id,{seed=worldSeed}={}) { assertSeed(seed); return items.delete(id); },
    visible({seed=worldSeed}={}) {
      assertSeed(seed);
      return Object.freeze(Array.from(items.values()).filter(discovered));
    },
    clear({seed=worldSeed}={}) { assertSeed(seed); items.clear(); }
  });
}
