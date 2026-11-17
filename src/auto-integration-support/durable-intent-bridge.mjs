// Opt-in :24 createSurfaceBiomeWorldView hasDurableEditIntent adapter.
// Never infer untouched history from world.edits or block equality.
const key = (x,y,z) => `${x},${y},${z}`;
const safe = n => Number.isSafeInteger(n);
const valid = c => c && ['x','y','z'].every(a => safe(c[a]));
/**
 * historyComplete must be an explicit, trusted persistence assertion for the
 * exact world profile. An unknown/incomplete history rejects every overlay.
 * This module neither reads nor modifies schema-1 saves.
 */
export function createDurableIntentWitness({historyComplete=false,touchedCells=[]}={}) {
  if (typeof historyComplete !== 'boolean' || !Array.isArray(touchedCells))
    throw new TypeError('invalid durable edit history');
  const touched = new Set();
  for (const cell of touchedCells) {
    if (!valid(cell)) throw new TypeError('invalid touched cell');
    touched.add(key(cell.x,cell.y,cell.z));
  }
  return Object.freeze({
    historyComplete,
    touchedCount:touched.size,
    // Unknown or incomplete history must never authorize an overlay.
    hasDurableEditIntent(x,y,z) {
      if (![x,y,z].every(safe)) return true;
      return !historyComplete || touched.has(key(x,y,z));
    },
    // Pure test fixture; NOT a persisted save-format representation.
    touchedFixture() {return [...touched].sort().map(s=>s.split(',').map(Number));}
  });
}
