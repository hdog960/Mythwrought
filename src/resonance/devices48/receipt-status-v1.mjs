// Source-only bounded projection of :48 receipt fixtures; never a power-delivery authority.
export const RECEIPT_STATUS_V1 = 'resonance-devices48-receipt-status-v1';
const nat = n => Number.isSafeInteger(n) && n >= 0;
const validId = s => typeof s === 'string' && /^[a-z0-9_-]{1,48}$/.test(s);
const validSha = s => typeof s === 'string' && /^[a-f0-9]{40}$/.test(s);
export function projectReceiptStatus(ledger, demands, {expectedSeed, expectedNetworkSha, expectedTick} = {}) {
  if (!ledger || ledger.contract !== 'resonance-devices48-receipt-ledger-v1' ||
      ledger.authoritative !== false || ledger.productionBound !== false ||
      !nat(expectedSeed) || !validSha(expectedNetworkSha) || !nat(expectedTick) ||
      ledger.seed !== expectedSeed || ledger.networkSha !== expectedNetworkSha ||
      ledger.lastTick !== expectedTick || !Array.isArray(ledger.frames) ||
      ledger.frames.length < 1 || ledger.frames.length > 32 || !Array.isArray(demands) ||
      demands.length > 16) throw Error('invalid receipt status provenance');
  let previous = null;
  for (const frame of ledger.frames) {
    if (!frame || !nat(frame.tick) || (previous !== null && frame.tick <= previous) ||
        frame.seed !== expectedSeed || frame.sourceSha !== expectedNetworkSha ||
        frame.authoritative !== false || frame.productionBound !== false ||
        !Array.isArray(frame.grants) || frame.grants.length > 16 || !nat(frame.total))
      throw Error('invalid receipt history');
    let sum = 0; const ids = new Set();
    for (const grant of frame.grants) {
      if (!grant || !validId(grant.id) || ids.has(grant.id) ||
          !nat(grant.delivered) || grant.delivered > 64) throw Error('invalid historical grant');
      ids.add(grant.id); sum += grant.delivered;
    }
    if (sum !== frame.total || sum > 256) throw Error('invalid historical total');
    previous = frame.tick;
  }
  if (previous !== expectedTick) throw Error('invalid receipt tip');
  const latest = ledger.frames.at(-1);
  const grants = new Map(latest.grants.map(g => [g.id, g.delivered]));
  const seen = new Set(); let requested = 0; let delivered = 0;
  const devices = demands.map(d => {
    if (!d || !validId(d.id) || seen.has(d.id) || !nat(d.demand) || d.demand > 64 ||
        !grants.has(d.id)) throw Error('invalid demand mapping');
    seen.add(d.id); requested += d.demand;
    const amount = grants.get(d.id);
    if (amount > d.demand) throw Error('grant exceeds demand');
    delivered += amount;
    return Object.freeze({id:d.id,requested:d.demand,delivered:amount,
      deficit:d.demand-amount,state:amount >= d.demand ? 'supplied' : 'stopped'});
  }).sort((a,b) => a.id.localeCompare(b.id,'en'));
  if (seen.size !== grants.size || requested > 256 || delivered !== latest.total)
    throw Error('unmapped grants or demand overflow');
  return Object.freeze({contract:RECEIPT_STATUS_V1,seed:expectedSeed,tick:expectedTick,
    sourceSha:expectedNetworkSha,requested,delivered,deficit:requested-delivered,
    devices:Object.freeze(devices),authoritative:false,productionBound:false});
}
