/**
 * :48 D5 source-only compact status projection. No renderer or delivery authority.
 * Accepts an observed snapshot, never allocates or changes energy.
 */
const MAX = 1_000_000_000;
function count(value, name) {
  if (!Number.isSafeInteger(value) || value < 0 || value > MAX) {
    throw new RangeError(name + ' must be a bounded nonnegative integer');
  }
  return value;
}
function short(value) {
  if (value < 1000) return String(value);
  if (value < 1_000_000) return (Math.floor(value / 100) / 10).toFixed(1).replace(/\.0$/, '') + 'k';
  return (Math.floor(value / 100_000) / 10).toFixed(1).replace(/\.0$/, '') + 'm';
}
/**
 * @param {{produced:number,used:number,stored:number,requested:number,missing:number}} observed
 * @returns {{schema:string,summary:string,deficit:boolean,lines:readonly string[]}}
 */
export function projectCompactResonanceStatus(observed) {
  if (!observed || typeof observed !== 'object' || Array.isArray(observed)) {
    throw new TypeError('observed status object required');
  }
  const produced = count(observed.produced, 'produced');
  const used = count(observed.used, 'used');
  const stored = count(observed.stored, 'stored');
  const requested = count(observed.requested, 'requested');
  const missing = count(observed.missing, 'missing');
  if (used > requested || missing > requested || used + missing !== requested) {
    throw new RangeError('inconsistent demand observations');
  }
  const lines = Object.freeze([
    'IN ' + short(produced) + '  USE ' + short(used),
    'BANK ' + short(stored) + '  NEED ' + short(missing)
  ]);
  return Object.freeze({
    schema: 'resonance48.compact-status.v1',
    summary: missing ? 'POWER LOW' : 'POWER OK',
    deficit: missing > 0,
    lines
  });
}
