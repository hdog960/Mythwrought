// D4 source-only inventory/power freshness fence; never mutates inventory or grants power.
const id = v => typeof v === 'string' && /^[a-zA-Z0-9:_-]{1,96}$/.test(v);
const nat = v => Number.isSafeInteger(v) && v >= 0;
export function previewProcessorCommitFence(request) {
  const deny = reason => Object.freeze({ok:false, reason, canActuate:false});
  if (!request || typeof request !== 'object') return deny('invalid-request');
  const {worldId, ownerId, deviceId, tick, worldRevision, inventoryRevision, plan, observation} = request;
  if (![worldId,ownerId,deviceId].every(id) || ![tick,worldRevision,inventoryRevision].every(nat)) return deny('invalid-identity');
  if (!plan || !observation || typeof plan !== 'object' || typeof observation !== 'object') return deny('missing-proof');
  for (const p of [plan, observation]) {
    if (p.worldId !== worldId || p.ownerId !== ownerId || p.deviceId !== deviceId) return deny('identity-mismatch');
    if (p.tick !== tick || p.worldRevision !== worldRevision || p.inventoryRevision !== inventoryRevision) return deny('stale-revision');
  }
  if (plan.canActuate !== false || observation.canActuate !== false) return deny('unsafe-authority');
  if (observation.protected !== false || observation.ownerAuthorized !== true || observation.fixtureOptIn !== true) return deny('untrusted-fixture');
  if (!Array.isArray(plan.inputs) || !Array.isArray(plan.outputs) || plan.inputs.length === 0 || plan.inputs.length > 32 || plan.outputs.length > 32) return deny('invalid-batch');
  const seen = new Set();
  for (const input of plan.inputs) {
    if (!input || !id(input.itemId) || !nat(input.quantity) || input.quantity === 0 || seen.has(input.itemId)) return deny('invalid-input');
    seen.add(input.itemId);
  }
  for (const output of plan.outputs) if (!output || !id(output.typeId) || !nat(output.quantity) || output.quantity === 0) return deny('invalid-output');
  if (!nat(plan.energyDemand) || plan.energyDemand === 0 || !nat(observation.deliveredEnergy) || observation.deliveredEnergy < plan.energyDemand || observation.authenticatedDelivery !== true) return deny('unverified-power');
  if (observation.inventoryCapacityAccepted !== true || observation.inputsStillPresent !== true) return deny('inventory-changed');
  return Object.freeze({ok:true, reason:'advisory-only', canActuate:false, worldId, deviceId, tick, inputCount:plan.inputs.length, outputCount:plan.outputs.length});
}
