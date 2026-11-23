// Advisory reset readiness only; never an actuator or power-delivery authorization.
const validId = value => typeof value === 'string' && /^[a-z0-9_-]{1,48}$/.test(value);
const fail = message => { throw new TypeError(message); };
export function evaluateLiftResetReadiness(history, {minimumClearFrames = 3} = {}) {
  if (!history || history.contract !== 'resonance48-lift-stop-history-v1' ||
      !validId(history.worldId) || !validId(history.liftId) ||
      !Number.isSafeInteger(minimumClearFrames) || minimumClearFrames < 2 || minimumClearFrames > 16 ||
      !Array.isArray(history.observations) || history.observations.length < 1 || history.observations.length > 16 ||
      !Number.isSafeInteger(history.fromTick) || history.fromTick < 0 ||
      !Number.isSafeInteger(history.toTick) || history.toTick !== history.fromTick + history.observations.length ||
      history.movementAuthorized !== false || history.passengerTransportAuthorized !== false ||
      history.continuousCollisionProven !== false || history.physicsBound !== false ||
      history.authoritativeDelivery !== false || history.productionBound !== false) fail('untrusted lift history');
  let clear = 0, firstBlockedTick = null;
  for (let i = 0; i < history.observations.length; i++) {
    const entry = history.observations[i];
    if (!entry || entry.tick !== history.fromTick + i + 1 || typeof entry.clearCandidate !== 'boolean' ||
        entry.stopRequired !== !entry.clearCandidate) fail('invalid observation');
    clear = entry.clearCandidate ? clear + 1 : 0;
    if (!entry.clearCandidate) firstBlockedTick ??= entry.tick;
    if (entry.consecutiveClear !== clear) fail('tampered clear count');
  }
  if (history.consecutiveClear !== clear || history.firstBlockedTick !== firstBlockedTick ||
      history.stopRequired !== (clear === 0)) fail('tampered summary');
  const clearStreakObserved = clear >= minimumClearFrames;
  return Object.freeze({contract:'resonance48-lift-reset-readiness-v1',worldId:history.worldId,
    liftId:history.liftId,toTick:history.toTick,minimumClearFrames,consecutiveClear:clear,
    clearStreakObserved,stopRequired:history.stopRequired,
    resetAuthorized:false,movementAuthorized:false,passengerTransportAuthorized:false,
    physicsBound:false,authoritativeDelivery:false,productionBound:false});
}
