// Advisory-only delivery reconciliation. This is NOT a :36 receipt validator or an authorization bridge.
const id = x => typeof x === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(x);
const tick = x => Number.isSafeInteger(x) && x >= 0;
const watts = x => Number.isSafeInteger(x) && x >= 0 && x <= 1000000;
function invalid(message) { throw new TypeError(message); }
function roster(items, key, limit) {
  if (!Array.isArray(items) || items.length > limit) invalid('invalid roster');
  const map = new Map();
  for (const item of items) {
    if (!item || !id(item[key]) || map.has(item[key])) invalid('duplicate or invalid identity');
    map.set(item[key], item);
  }
  return map;
}
/**
 * Compare a consumer's requested demand with an untrusted delivery observation.
 * This does NOT certify provenance, delivered energy, physical operation or :36 authority.
 */
export function previewDeviceDelivery({worldId, simulationTick, requests, observations}) {
  if (!id(worldId) || !tick(simulationTick)) invalid('invalid simulation scope');
  const requested = roster(requests, 'deviceId', 64);
  const observed = roster(observations, 'deviceId', 64);
  for (const [key, request] of requested) {
    if (request.worldId !== worldId || request.tick !== simulationTick ||
        !watts(request.demand) || typeof request.enabled !== 'boolean' ||
        request.movementAuthorized !== false) invalid('invalid request');
    if (!request.enabled && request.demand !== 0) invalid('disabled device requests energy');
  }
  for (const [key, observation] of observed) {
    if (!requested.has(key) || observation.worldId !== worldId ||
        observation.tick !== simulationTick || !watts(observation.delivered) ||
        observation.delivered > requested.get(key).demand ||
        observation.authoritative !== false || observation.movementAuthorized !== false)
      invalid('untrusted delivery observation');
  }
  const devices = [...requested.keys()].sort().map(deviceId => {
    const request = requested.get(deviceId), observation = observed.get(deviceId);
    const delivered = observation?.delivered ?? 0;
    const deficit = request.demand - delivered;
    return Object.freeze({deviceId, requested:request.demand, observedDelivered:delivered,
      deficit, candidateSatisfied:request.enabled && request.demand > 0 && deficit === 0,
      energized:false, movementAuthorized:false, authoritativeDelivery:false, productionBound:false});
  });
  return Object.freeze({schema:'resonance48-delivery-preview-v1',worldId,simulationTick,
    advisoryOnly:true,authoritativeDelivery:false,movementAuthorized:false,
    devices:Object.freeze(devices)});
}
