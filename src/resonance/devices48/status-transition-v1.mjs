// Source-only, bounded preview transitions. Never authorizes real energy or motion.
export const STATUS_TRANSITION_V1 = 'resonance-devices48-status-transition-v1';
const nat = n => Number.isSafeInteger(n) && n >= 0;
const sha = s => typeof s === 'string' && /^[0-9a-f]{40}$/.test(s);
const id = s => typeof s === 'string' && /^[a-z0-9_-]{1,48}$/.test(s);
function validate(frame) {
  if (!frame || frame.contract !== 'resonance-devices48-receipt-status-v1' ||
      frame.authoritative !== false || frame.productionBound !== false ||
      !nat(frame.seed) || !nat(frame.tick) || !sha(frame.sourceSha) ||
      !nat(frame.requested) || !nat(frame.delivered) || !nat(frame.deficit) ||
      frame.requested > 256 || frame.delivered > frame.requested ||
      frame.deficit !== frame.requested - frame.delivered ||
      !Array.isArray(frame.devices) || frame.devices.length > 16) throw Error('invalid status frame');
  const devices = new Map(); let requested = 0, delivered = 0;
  for (const d of frame.devices) {
    if (!d || !id(d.id) || devices.has(d.id) || !nat(d.requested) ||
        !nat(d.delivered) || d.requested > 64 || d.delivered > d.requested ||
        d.deficit !== d.requested - d.delivered ||
        d.state !== (d.delivered === d.requested ? 'supplied' : 'stopped'))
      throw Error('invalid device status');
    devices.set(d.id,d); requested += d.requested; delivered += d.delivered;
  }
  if (requested !== frame.requested || delivered !== frame.delivered)
    throw Error('status totals mismatch');
  return devices;
}
export function compareStatusFrames(previous, current, {expectedSeed, expectedNetworkSha} = {}) {
  const before = validate(previous), after = validate(current);
  if (!nat(expectedSeed) || !sha(expectedNetworkSha) ||
      previous.seed !== expectedSeed || current.seed !== expectedSeed ||
      previous.sourceSha !== expectedNetworkSha || current.sourceSha !== expectedNetworkSha ||
      !Number.isSafeInteger(previous.tick + 1) || current.tick !== previous.tick + 1 ||
      before.size !== after.size || [...before.keys()].some(key => !after.has(key)))
    throw Error('untrusted, discontinuous or changed preview sequence');
  const events = [...after.keys()].sort().map(key => {
    const old = before.get(key), next = after.get(key);
    const transition = old.state === next.state ? 'steady' :
      next.state === 'supplied' ? 'restored' : 'interrupted';
    return Object.freeze({id:key,transition,from:old.state,to:next.state,
      deficit:next.deficit,visual:transition === 'restored' ? 'rune-blue' :
        transition === 'interrupted' ? 'amber' : 'none'});
  });
  return Object.freeze({contract:STATUS_TRANSITION_V1,seed:expectedSeed,tick:current.tick,
    sourceSha:expectedNetworkSha,events:Object.freeze(events),
    authoritative:false,productionBound:false,physicalActions:Object.freeze([])});
}
