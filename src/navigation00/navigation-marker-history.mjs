// Opt-in, ephemeral waypoint editing. No persistence or terrain sampling.
export const NAV00_MARKER_HISTORY_VERSION = 1;
const finite = n => typeof n === 'number' && Number.isFinite(n);
const valid = p => p && typeof p === 'object' && finite(p.x) && finite(p.z) && Number.isSafeInteger(Math.floor(p.x)) && Number.isSafeInteger(Math.floor(p.z)) && (p.y === undefined || finite(p.y));
const copy = p => Object.freeze({x:p.x,z:p.z,...(p.y === undefined ? {} : {y:p.y})});
export function createNavigationMarkerHistory({limit=32,maxMarkers=256,worldSeed}={}) {
  if (!Number.isSafeInteger(limit) || limit < 1 || limit > 256) throw Error('Invalid history limit');
  if (!Number.isSafeInteger(maxMarkers) || maxMarkers < 1 || maxMarkers > 4096) throw Error('Invalid marker capacity');
  if (worldSeed === undefined || !['string','number'].includes(typeof worldSeed) || (typeof worldSeed==='number' && !Number.isSafeInteger(worldSeed))) throw Error('World seed required');
  const markers = new Map();
  const undo = [];
  const seed = worldSeed;
  const snapshot = () => Array.from(markers, ([id,point]) => Object.freeze({id,...point}));
  const remember = () => { undo.push(snapshot()); if (undo.length > limit) undo.shift(); };
  const checkSeed = s => { if (s !== seed) throw Error('World seed mismatch'); };
  return Object.freeze({
    version:NAV00_MARKER_HISTORY_VERSION,
    list: () => Object.freeze(snapshot()),
    pin(id,point,{observed=false,seed:incomingSeed=seed}={}) {
      checkSeed(incomingSeed);
      if (typeof id !== 'string' || !/^[a-zA-Z0-9_-]{1,40}$/.test(id) || !valid(point) || observed !== true) throw Error('Marker requires observed coordinates');
      if (!markers.has(id) && markers.size >= maxMarkers) throw Error('Marker capacity exceeded');
      remember(); markers.set(id,copy(point)); return Object.freeze(snapshot());
    },
    remove(id,{seed:incomingSeed=seed}={}) {
      checkSeed(incomingSeed);
      if (!markers.has(id)) return false;
      remember(); markers.delete(id); return true;
    },
    undo({seed:incomingSeed=seed}={}) {
      checkSeed(incomingSeed);
      if (!undo.length) return false;
      const prior=undo.pop(); markers.clear(); for (const {id,x,y,z} of prior) markers.set(id,copy({x,z,...(y===undefined?{}:{y})})); return true;
    }
  });
}