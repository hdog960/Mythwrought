// G4 opt-in fuel-budgeted evidence sequence. No inventory, save or network writes.
import { CONTRACT } from './index.mjs';
import { evaluateObservedGenerators } from './environment-bridge.mjs';
export const BUDGET_SEQUENCE = 'resonance-generation-budget-sequence-v1';
export function evaluateBudgetedSequence(generators, provider, startTick, tickCount, fuelReservations = {}) {
  if (!Array.isArray(generators) || generators.length > CONTRACT.maxGenerators ||
      !Number.isSafeInteger(startTick) || startTick < 0 ||
      !Number.isSafeInteger(tickCount) || tickCount < 1 || tickCount > CONTRACT.maxCatchupTicks ||
      !Number.isSafeInteger(startTick + tickCount - 1) ||
      typeof provider !== 'function' || !fuelReservations ||
      Object.getPrototypeOf(fuelReservations) !== Object.prototype)
    throw Error('invalid budgeted sequence');
  const seen = new Set(), remaining = new Map();
  for (const generator of generators) {
    const key = generator?.instanceKey;
    if (typeof key !== 'string' || !key.startsWith('resonance:g24:') || seen.has(key))
      throw Error('duplicate or invalid generator identity');
    seen.add(key);
    const reserved = Object.hasOwn(fuelReservations,key) ? fuelReservations[key] : 0;
    if (!Number.isSafeInteger(reserved) || reserved < 0 || reserved > CONTRACT.maxCatchupTicks)
      throw Error('invalid external fuel reservation');
    if (generator.model !== 'heat' && reserved !== 0) throw Error('fuel reservation for nonfuel generator');
    remaining.set(key,reserved);
  }
  if (Object.keys(fuelReservations).some(key => !seen.has(key)))
    throw Error('unknown fuel reservation');
  const frames = [];
  let generatedCandidate = 0, fuelRequiredCandidate = 0;
  for (let offset=0; offset<tickCount; offset++) {
    const tick=startTick+offset;
    // Provider is an externally supplied observation source, not an authenticated world API.
    const raw=evaluateObservedGenerators(generators,provider,tick);
    const outputs=raw.outputs.map(output => {
      const generator=generators.find(g=>g.instanceKey===output.instanceKey);
      if (generator.model !== 'heat' || output.availablePerTick===0) return output;
      const left=remaining.get(output.instanceKey);
      if (left < output.fuelCostPerTick) return Object.freeze({...output,status:'blocked',
        reason:'external-fuel-reservation-exhausted',availablePerTick:0,fuelCostPerTick:0});
      remaining.set(output.instanceKey,left-output.fuelCostPerTick);
      fuelRequiredCandidate+=output.fuelCostPerTick;
      return output;
    });
    const availablePerTick=outputs.reduce((sum,o)=>sum+o.availablePerTick,0);
    generatedCandidate+=availablePerTick;
    if (!Number.isSafeInteger(Math.round(generatedCandidate*1000000)) ||
        !Number.isSafeInteger(fuelRequiredCandidate))
      throw Error('unsafe budget accounting');
    frames.push(Object.freeze({tick,outputs:Object.freeze(outputs),availablePerTick}));
  }
  return Object.freeze({signature:BUDGET_SEQUENCE,sourceContract:CONTRACT.id,
    startTick,endTick:startTick+tickCount-1,generatedCandidate,fuelRequiredCandidate,
    remainingReservations:Object.freeze([...remaining].sort(([a],[b])=>a.localeCompare(b))
      .map(([instanceKey,units])=>Object.freeze({instanceKey,units}))),
    frames:Object.freeze(frames),integration:'candidate-only',delivered:false,fuelWithdrawn:false});
}
