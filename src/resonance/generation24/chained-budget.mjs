// Opt-in chained budget windows. A checkpoint is an untrusted candidate ledger, never an inventory receipt.
import { CONTRACT } from './index.mjs';
import { evaluateBudgetedSequence } from './budgeted-sequence.mjs';
export const CHAINED_BUDGET = 'resonance-generation-chained-budget-v1';
const safe = n => Number.isSafeInteger(n) && n >= 0;
export function evaluateChainedBudget(generators, provider, startTick, tickCount, checkpoint = null, initialReservations = {}) {
  if (!Array.isArray(generators) || generators.length > CONTRACT.maxGenerators || !safe(startTick))
    throw Error('invalid chained generator window');
  const keys = generators.map(g => g?.instanceKey);
  if (keys.some(k => typeof k !== 'string') || new Set(keys).size !== keys.length)
    throw Error('invalid chained identities');
  const sorted = [...keys].sort();
  let reservations = initialReservations;
  let priorGenerated = 0, priorFuel = 0;
  if (checkpoint !== null) {
    if (checkpoint.signature !== CHAINED_BUDGET || checkpoint.sourceContract !== CONTRACT.id ||
        !safe(checkpoint.nextTick) || checkpoint.nextTick !== startTick ||
        !Array.isArray(checkpoint.keys) || checkpoint.keys.length !== sorted.length ||
        checkpoint.keys.some((k,i) => k !== sorted[i]) ||
        !(Number.isFinite(checkpoint.generatedCandidate) && checkpoint.generatedCandidate >= 0 && Number.isSafeInteger(Math.round(checkpoint.generatedCandidate * 1e6))) ||
        !safe(checkpoint.fuelRequiredCandidate) || checkpoint.fuelRequiredCandidate > checkpoint.nextTick * generators.filter(g => g?.model === 'heat').length ||
        !Array.isArray(checkpoint.remainingReservations) ||
        checkpoint.remainingReservations.length !== sorted.length ||
        Object.keys(initialReservations).length !== 0)
      throw Error('incompatible chained checkpoint');
    reservations = Object.create(null);
    for (let i=0;i<sorted.length;i++) {
      const entry=checkpoint.remainingReservations[i];
      if (entry?.instanceKey !== sorted[i] || !safe(entry.units) || entry.units > CONTRACT.maxCatchupTicks)
        throw Error('invalid chained reservation');
      reservations[entry.instanceKey] = entry.units;
    }
    // Budget evaluator requires a plain object, never inherited keys.
    reservations = {...reservations};
    priorGenerated=checkpoint.generatedCandidate;
    priorFuel=checkpoint.fuelRequiredCandidate;
  }
  const window=evaluateBudgetedSequence(generators,provider,startTick,tickCount,reservations);
  const generatedCandidate=priorGenerated+window.generatedCandidate;
  const fuelRequiredCandidate=priorFuel+window.fuelRequiredCandidate;
  if (!Number.isFinite(generatedCandidate) || !Number.isSafeInteger(Math.round(generatedCandidate*1e6)) ||
      !safe(fuelRequiredCandidate) || !safe(window.endTick+1))
    throw Error('unsafe chained accounting');
  const next=Object.freeze({signature:CHAINED_BUDGET,sourceContract:CONTRACT.id,
    nextTick:window.endTick+1,keys:Object.freeze(sorted),
    generatedCandidate,fuelRequiredCandidate,
    remainingReservations:window.remainingReservations});
  return Object.freeze({window,checkpoint:next,delivered:false,fuelWithdrawn:false});
}
