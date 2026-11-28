// Isolated G3 environmental restart/resume evaluator. No world, fuel, save, or network writes.
import { CONTRACT, evaluateGenerator, simulateTicks } from './index.mjs';
const safeTick = n => Number.isSafeInteger(n) && n >= 0;
export function resumeGenerator(descriptor, samples, startTick, endTick) {
  if (!safeTick(startTick) || !safeTick(endTick) || endTick < startTick ||
      endTick - startTick > CONTRACT.maxCatchupTicks ||
      !Array.isArray(samples) || samples.length !== endTick - startTick)
    throw Error('invalid resume window');
  // Each tick requires an explicit, source-authentic observation; never extrapolate
  // water flow, wind, heat, fuel or operator state through unloaded time.
  let generated=0, fuelConsumed=0, activeTicks=0;
  const statuses=[];
  for (let i=0;i<samples.length;i++) {
    const sample=samples[i];
    if (!sample || typeof sample!=='object' || Array.isArray(sample) ||
        sample.observedTick !== startTick+i ||
        sample.verified !== true || !sample.inputs ||
        typeof sample.inputs!=='object' || Array.isArray(sample.inputs))
      throw Error('missing verified environmental observation');
    const state=evaluateGenerator(descriptor,sample.inputs);
    const result=simulateTicks(descriptor,sample.inputs,1);
    if (result.generated < 0 || result.generated > state.capacityPerTick ||
        !Number.isFinite(result.generated)) throw Error('unsafe resumed output');
    generated+=result.generated;
    fuelConsumed+=result.fuelConsumed;
    activeTicks+=result.ticks;
    statuses.push(state.status);
  }
  return Object.freeze({contract:CONTRACT.id,instanceKey:descriptor.instanceKey,
    startTick,endTick,observedTicks:samples.length,activeTicks,generated,
    fuelConsumed,statuses:Object.freeze(statuses)});
}
