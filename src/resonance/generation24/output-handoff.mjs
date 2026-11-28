// Fail-closed read-only generation handoff. Never routes, stores or spends power.
import { CONTRACT, evaluateGenerator } from './index.mjs';
const finite = n => typeof n === 'number' && Number.isFinite(n) && n >= 0;
export const GENERATION_HANDOFF = 'resonance-generation-output-v1';
export function exportGeneratorOutput(descriptor, inputs, observedTick) {
  if (!Number.isSafeInteger(observedTick) || observedTick < 0 ||
      !descriptor || typeof descriptor.instanceKey !== 'string' ||
      !descriptor.instanceKey.startsWith('resonance:g24:') ||
      !Number.isSafeInteger(descriptor.seed) ||
      !Array.isArray(descriptor.anchor) || descriptor.anchor.length !== 3 ||
      !descriptor.anchor.every(Number.isSafeInteger) ||
      typeof descriptor.id !== 'string' ||
      descriptor.instanceKey !== `resonance:g24:${descriptor.seed}:${descriptor.anchor.join(',')}:${descriptor.id}` ||
      !inputs || inputs.verified !== true || inputs.observedTick !== observedTick ||
      !inputs.values || typeof inputs.values !== 'object')
    throw Error('unverified generation handoff');
  const result = evaluateGenerator(descriptor, inputs.values);
  if (![result.availablePerTick, result.capacityPerTick, result.fuelCostPerTick].every(finite) ||
      result.availablePerTick > result.capacityPerTick ||
      !['available','blocked'].includes(result.status))
    throw Error('unsafe generation output');
  return Object.freeze({
    signature: GENERATION_HANDOFF, sourceContract: CONTRACT.id,
    tickMs: CONTRACT.tickMs, observedTick, instanceKey: descriptor.instanceKey,
    status: result.status, reason: result.reason,
    capacityPerTick: result.capacityPerTick,
    availablePerTick: result.availablePerTick,
    fuelCostPerTick: result.fuelCostPerTick,
    fuelAuthorization: 'external-required',
    sourceKind: descriptor.sourceKind
  });
}
export function validateGeneratorOutputs(outputs, observedTick) {
  if (!Array.isArray(outputs) || outputs.length > CONTRACT.maxGenerators ||
      !Number.isSafeInteger(observedTick) || observedTick < 0) throw Error('invalid output batch');
  const seen = new Set();
  let availablePerTick = 0, capacityPerTick = 0;
  for (const item of outputs) {
    if (!item || item.signature !== GENERATION_HANDOFF ||
        item.sourceContract !== CONTRACT.id || item.tickMs !== CONTRACT.tickMs ||
        item.observedTick !== observedTick || typeof item.instanceKey !== 'string' ||
        !item.instanceKey.startsWith('resonance:g24:') || seen.has(item.instanceKey) ||
        !['available','blocked'].includes(item.status) ||
        ![item.availablePerTick,item.capacityPerTick,item.fuelCostPerTick].every(finite) ||
        item.availablePerTick > item.capacityPerTick ||
        (item.status === 'blocked' && item.availablePerTick !== 0) ||
        item.fuelAuthorization !== 'external-required') throw Error('incompatible output batch');
    seen.add(item.instanceKey);
    availablePerTick += item.availablePerTick;
    capacityPerTick += item.capacityPerTick;
    if (!Number.isSafeInteger(availablePerTick * 1000000) || !Number.isSafeInteger(capacityPerTick * 1000000))
      throw Error('output batch overflow');
  }
  return Object.freeze({signature:GENERATION_HANDOFF, observedTick, count:seen.size,
    availablePerTick, capacityPerTick});
}
