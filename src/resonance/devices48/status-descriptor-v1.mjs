// Advisory-only compact status descriptor. No UI, delivery authority or physical action.
const nonnegative = n => Number.isSafeInteger(n) && n >= 0;
const validId = s => typeof s === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(s);
const invalid = () => { throw new TypeError('invalid advisory history'); };
export function describeDeficitStatus(window) {
  if (!window || window.schema !== 'resonance48-deficit-window-v1' ||
      !validId(window.worldId) || !nonnegative(window.simulationTick) ||
      window.authoritativeDelivery !== false || window.movementAuthorized !== false ||
      window.productionBound !== false || !Array.isArray(window.history) ||
      window.history.length < 1 || window.history.length > 8 || !window.totals) invalid();
  let requested = 0, observed = 0, deficit = 0;
  for (let i = 0; i < window.history.length; i++) {
    const h = window.history[i];
    if (!h || !nonnegative(h.tick) || !nonnegative(h.requested) ||
        !nonnegative(h.observed) || !nonnegative(h.deficit) ||
        h.requested > 64000000 || h.observed > h.requested ||
        h.deficit !== h.requested - h.observed ||
        (i && h.tick !== window.history[i - 1].tick + 1)) invalid();
    requested += h.requested; observed += h.observed; deficit += h.deficit;
  }
  if (window.history.at(-1).tick !== window.simulationTick ||
      !Number.isSafeInteger(requested) || !Number.isSafeInteger(observed) ||
      !Number.isSafeInteger(deficit) || window.totals.requested !== requested ||
      window.totals.observed !== observed || window.totals.deficit !== deficit) invalid();
  const latest = window.history.at(-1);
  const status = latest.requested === 0 ? 'idle' : latest.deficit === 0 ? 'observed-satisfied' :
    latest.observed === 0 ? 'observed-unpowered' : 'observed-partial';
  return Object.freeze({schema:'resonance48-status-descriptor-v1',worldId:window.worldId,
    simulationTick:window.simulationTick,status,requested:latest.requested,
    observed:latest.observed,deficit:latest.deficit,historyTicks:window.history.length,
    windowDeficit:deficit,authoritativeDelivery:false,energized:false,
    movementAuthorized:false,productionBound:false});
}
