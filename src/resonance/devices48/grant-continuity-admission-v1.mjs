// Source-only advisory; never authorizes physical motion or world edits.
export const GRANT_CONTINUITY_ADMISSION_V1 = 'resonance48-grant-continuity-admission-v1';
const validId = s => typeof s === 'string' && /^[a-z0-9_-]{1,48}$/.test(s);
const integer = n => Number.isSafeInteger(n) && n >= 0;
export function auditGrantContinuity(frames, {deviceId, requiredUnits, consecutiveTicks=2}={}) {
  if (!validId(deviceId) || !integer(requiredUnits) || requiredUnits < 1 || requiredUnits > 64 ||
      !integer(consecutiveTicks) || consecutiveTicks < 2 || consecutiveTicks > 8 ||
      !Array.isArray(frames) || frames.length < 1 || frames.length > 32) throw Error('invalid continuity input');
  let previous = null, streak = 0, enabled = false;
  const transitions = [];
  for (const frame of frames) {
    if (!frame || !integer(frame.tick) || !Array.isArray(frame.grants) || frame.grants.length > 16 ||
        (previous !== null && frame.tick <= previous)) throw Error('invalid continuity frame');
    let delivered = 0;
    const seen = new Set();
    for (const grant of frame.grants) {
      if (!grant || !validId(grant.id) || seen.has(grant.id) || !integer(grant.delivered) || grant.delivered > 64)
        throw Error('invalid continuity grant');
      seen.add(grant.id);
      if (grant.id === deviceId) delivered = grant.delivered;
    }
    const gap = previous !== null && frame.tick - previous !== 1;
    streak = !gap && delivered >= requiredUnits ? streak + 1 : delivered >= requiredUnits && previous === null ? 1 : 0;
    const next = streak >= consecutiveTicks;
    const reason = gap ? 'unobserved-tick-gap' : delivered < requiredUnits ? 'insufficient-grant' : next ? 'continuous-grant' : 'awaiting-continuity';
    transitions.push(Object.freeze({tick:frame.tick, delivered, consecutiveObserved:streak, enabled:next, changed:next !== enabled, reason}));
    enabled = next;
    previous = frame.tick;
  }
  return Object.freeze({contract:GRANT_CONTINUITY_ADMISSION_V1,deviceId,requiredUnits,consecutiveTicks,
    transitions:Object.freeze(transitions),authoritative:false,productionBound:false,mayMovePlayer:false,mayCommitWorldEdit:false});
}
