// Isolated :48 advisory interlock. Never authorizes physical motion or power delivery.
export const GRANT_DROPOUT_INTERLOCK_V1 = 'resonance48-grant-dropout-interlock-v1';
const nat = n => Number.isSafeInteger(n) && n >= 0;
const id = s => typeof s === 'string' && /^[a-z0-9_-]{1,48}$/.test(s);
export function auditGrantDropout(frames, {deviceId, requiredUnits, maxTickGap=1}={}) {
  if (!id(deviceId) || !nat(requiredUnits) || requiredUnits < 1 || requiredUnits > 64 ||
      !nat(maxTickGap) || maxTickGap < 1 || maxTickGap > 32 ||
      !Array.isArray(frames) || frames.length < 1 || frames.length > 32)
    throw Error('invalid advisory input');
  let previous = null;
  let running = false;
  const transitions = [];
  for (const frame of frames) {
    if (!frame || !nat(frame.tick) || !Array.isArray(frame.grants) || frame.grants.length > 16)
      throw Error('invalid frame');
    if (previous !== null && frame.tick <= previous) throw Error('nonmonotonic frame');
    const seen = new Set();
    let delivered = 0;
    for (const grant of frame.grants) {
      if (!grant || !id(grant.id) || seen.has(grant.id) ||
          !nat(grant.delivered) || grant.delivered > 64)
        throw Error('invalid grant');
      seen.add(grant.id);
      if (grant.id === deviceId) delivered = grant.delivered;
    }
    const gap = previous !== null && frame.tick - previous > maxTickGap;
    // A missing tick is an unknown power interval; never carry motion permission across it.
    const enabled = !gap && delivered >= requiredUnits;
    const reason = gap ? 'unobserved-tick-gap' : enabled ? 'sufficient-grant' : 'insufficient-grant';
    transitions.push(Object.freeze({tick:frame.tick, delivered, enabled, reason,
      changed: enabled !== running}));
    running = enabled;
    previous = frame.tick;
  }
  return Object.freeze({contract:GRANT_DROPOUT_INTERLOCK_V1,deviceId,requiredUnits,
    transitions:Object.freeze(transitions),authoritative:false,productionBound:false,
    mayMovePlayer:false,mayCommitWorldEdit:false});
}
