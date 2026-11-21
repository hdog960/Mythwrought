// Opt-in sequential observation harness. No world, network, inventory or save mutations.
import { evaluateObservedGenerators, ENVIRONMENT_BRIDGE } from './environment-bridge.mjs';
import { CONTRACT } from './index.mjs';
export const SEQUENCE_CONTRACT = 'resonance-generation-sequence-v1';
export function evaluateObservationSequence(generators, provider, startTick, tickCount) {
  if (!Number.isSafeInteger(startTick) || startTick < 0 ||
      !Number.isSafeInteger(tickCount) || tickCount < 1 ||
      tickCount > CONTRACT.maxCatchupTicks ||
      !Number.isSafeInteger(startTick + tickCount - 1) ||
      !Array.isArray(generators) || generators.length > CONTRACT.maxGenerators ||
      typeof provider !== 'function') throw Error('invalid sequence bounds');
  const identities = new Set();
  for (const generator of generators) {
    if (!generator || typeof generator.instanceKey !== 'string' ||
        identities.has(generator.instanceKey)) throw Error('duplicate or invalid source');
    identities.add(generator.instanceKey);
  }
  const frames = [];
  let generated = 0, fuelRequired = 0;
  const fuelBySource = new Map();
  for (let offset = 0; offset < tickCount; offset++) {
    const tick = startTick + offset;
    const frame = evaluateObservedGenerators(generators, provider, tick);
    for (const output of frame.outputs) {
      if (output.fuelCostPerTick > 0 && output.availablePerTick > 0) {
        fuelRequired += output.fuelCostPerTick;
        fuelBySource.set(output.instanceKey,
          (fuelBySource.get(output.instanceKey) ?? 0) + output.fuelCostPerTick);
      }
    }
    generated += frame.totals.availablePerTick;
    if (!Number.isFinite(generated) || !Number.isSafeInteger(generated * 1000000) ||
        !Number.isSafeInteger(fuelRequired * 1000000))
      throw Error('sequence accounting overflow');
    frames.push(frame);
  }
  return Object.freeze({
    signature: SEQUENCE_CONTRACT, observationContract: ENVIRONMENT_BRIDGE,
    sourceContract: CONTRACT.id, tickMs: CONTRACT.tickMs,
    startTick, endTick: startTick + tickCount - 1,
    generatedCandidate: generated, fuelRequiredCandidate: fuelRequired,
    fuelBySource: Object.freeze([...fuelBySource].sort(([a],[b])=>a.localeCompare(b))
      .map(([instanceKey, units])=>Object.freeze({instanceKey,units}))),
    frames: Object.freeze(frames),
    integration: 'candidate-only', fuelCommit: 'external-required',
    // Never advertise generated power as delivered or fuel as withdrawn.
    delivered: false, fuelWithdrawn: false
  });
}
