// Source-only lift intertick history: advisory stop latch, never a motion permit.
const id = s => typeof s === 'string' && /^[a-z0-9_-]{1,48}$/.test(s);
const integer = n => Number.isSafeInteger(n) && n >= 0;
const fail = reason => { throw new TypeError(reason); };
export function evaluateLiftStopHistory({worldId,liftId,frames}={}) {
  if (!id(worldId) || !id(liftId) || !Array.isArray(frames) || frames.length < 1 || frames.length > 16)
    fail('invalid bounded lift history');
  let prior = null, firstBlockedTick = null, consecutiveClear = 0;
  const entries = [];
  for (const frame of frames) {
    if (!frame || frame.contract !== 'resonance48-lift-intertick-occupancy-v1' ||
        frame.worldId !== worldId || !integer(frame.fromTick) || !integer(frame.toTick) ||
        frame.toTick !== frame.fromTick + 1 || (prior !== null && frame.fromTick !== prior) ||
        typeof frame.clearCandidate !== 'boolean' ||
        frame.movementAuthorized !== false || frame.passengerTransportAuthorized !== false ||
        frame.continuousCollisionProven !== false || frame.physicsBound !== false ||
        frame.authoritativeDelivery !== false || frame.productionBound !== false)
      fail('untrusted or discontinuous lift observation');
    if (!frame.clearCandidate) {
      firstBlockedTick ??= frame.toTick;
      consecutiveClear = 0;
    } else {
      consecutiveClear++;
    }
    entries.push(Object.freeze({tick:frame.toTick,clearCandidate:frame.clearCandidate,
      stopRequired:!frame.clearCandidate,consecutiveClear}));
    prior = frame.toTick;
  }
  const last = entries[entries.length-1];
  // Even after clear samples, no physics or delivery authority is inferred.
  return Object.freeze({contract:'resonance48-lift-stop-history-v1',worldId,liftId,
    fromTick:frames[0].fromTick,toTick:last.tick,observations:Object.freeze(entries),
    firstBlockedTick,consecutiveClear,stopRequired:!last.clearCandidate,
    movementAuthorized:false,passengerTransportAuthorized:false,
    continuousCollisionProven:false,physicsBound:false,authoritativeDelivery:false,productionBound:false});
}
