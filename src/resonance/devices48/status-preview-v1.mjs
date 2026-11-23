/** Pure, bounded phone-status projection; not a power allocation authority. */
const integer = x => Number.isSafeInteger(x) && x >= 0 && x <= 1000000;
const ident = x => typeof x === 'string' && /^[A-Za-z0-9_-]{1,48}$/.test(x);
const fail = reason => Object.freeze({valid:false,reason,productionBound:false,deliveryAuthorized:false});
export function summarizeResonanceStatus(observation) {
  if (!observation || !ident(observation.worldId) || !integer(observation.tick) ||
      !integer(observation.produced) || !integer(observation.stored) ||
      !integer(observation.storageCapacity) || observation.stored > observation.storageCapacity ||
      !Array.isArray(observation.consumers) || observation.consumers.length > 16)
    return fail('invalid-observation');
  let requested=0, used=0, deficit=0;
  const seen=new Set();
  for (const c of observation.consumers) {
    if (!c || !ident(c.id) || seen.has(c.id) || !integer(c.requested) ||
        !integer(c.observedGrant) || c.observedGrant > c.requested)
      return fail('invalid-consumer');
    seen.add(c.id);
    requested+=c.requested; used+=c.observedGrant; deficit+=c.requested-c.observedGrant;
    if (![requested,used,deficit].every(Number.isSafeInteger)) return fail('overflow');
  }
  // Produced+stored is not an authoritative delivered-energy budget.
  const state = deficit > 0 ? 'shortage' : requested === 0 ? 'idle' : 'observed-sufficient';
  return Object.freeze({valid:true,worldId:observation.worldId,tick:observation.tick,
    produced:observation.produced,used,stored:observation.stored,
    storageCapacity:observation.storageCapacity,requested,deficit,
    consumerCount:seen.size,state,visualOnly:true,productionBound:false,
    deliveryAuthorized:false,allocationAuthoritative:false});
}
