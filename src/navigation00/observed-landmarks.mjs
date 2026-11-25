// Optional navigation00 landmark catalog. No terrain probing, DOM or save writes.
// Producers must explicitly submit a witnessed position from the live world.
export const NAV00_LANDMARKS_VERSION = 1;
const validCoordinate = n => typeof n === 'number' && Number.isFinite(n) && Math.abs(n) <= 40000000;
const validText = s => typeof s === 'string' && s.length > 0 && s.length <= 48 && !/[<>\x00-\x1f]/.test(s);
export function createObservedLandmarks({discovery, maxEntries = 128} = {}) {
  if (!discovery || typeof discovery.has !== 'function' || !(discovery.seen instanceof Set)) throw Error('Real discovery required');
  if (!Number.isSafeInteger(maxEntries) || maxEntries < 1 || maxEntries > 512) throw Error('Invalid landmark budget');
  const entries = new Map();
  const seen = (x,z) => discovery.has(x,z);
  function observe({id,x,z,label,kind='terrain'} = {}) {
    if (!validText(id) || !/^[a-zA-Z0-9_-]+$/.test(id) || !validText(label) || !validText(kind) ||
      !/^[a-zA-Z0-9_-]+$/.test(kind) || !validCoordinate(x) || !validCoordinate(z) || !seen(x,z) ||
      (!entries.has(id) && entries.size >= maxEntries)) return false;
    entries.set(id, Object.freeze({id,x,z,label,kind}));
    return true;
  }
  function visible() {
    return Object.freeze([...entries.values()].filter(p => seen(p.x,p.z)).map(p => Object.freeze({...p})));
  }
  function remove(id) { return entries.delete(id); }
  return Object.freeze({observe, visible, remove, get size(){return entries.size;}});
}
