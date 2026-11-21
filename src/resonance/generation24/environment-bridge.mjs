// Opt-in read-only environmental evidence bridge; never authenticates world state.
import { exportGeneratorOutput, validateGeneratorOutputs } from './output-handoff.mjs';
export const ENVIRONMENT_BRIDGE = 'resonance-generation-observation-v1';
export function evaluateObservedGenerators(generators, observationProvider, tick) {
  if (!Number.isSafeInteger(tick) || tick < 0 || !Array.isArray(generators) ||
      generators.length > 128 || typeof observationProvider !== 'function')
    throw Error('invalid observation batch');
  const outputs = [];
  for (const generator of generators) {
    if (!generator || typeof generator.instanceKey !== 'string') throw Error('invalid generator');
    // No fallback to invented environment, weather, water, heat, or inventory.
    const evidence = observationProvider(generator, tick);
    if (!evidence || evidence.authority !== ENVIRONMENT_BRIDGE ||
        evidence.verified !== true || evidence.observedTick !== tick ||
        evidence.instanceKey !== generator.instanceKey ||
        !evidence.values || typeof evidence.values !== 'object' ||
        Array.isArray(evidence.values))
      throw Error('missing authoritative observation');
    outputs.push(exportGeneratorOutput(generator, {
      verified:true, observedTick:tick, values:evidence.values
    }, tick));
  }
  return Object.freeze({bridge:ENVIRONMENT_BRIDGE, tick,
    outputs:Object.freeze(outputs), totals:validateGeneratorOutputs(outputs,tick),
    integration:'candidate-only', fuelCommit:'external-required'});
}
