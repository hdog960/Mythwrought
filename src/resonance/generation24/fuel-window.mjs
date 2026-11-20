// Opt-in fuel-accounting ledger; no inventory or world mutation.
import { CONTRACT, evaluateGenerator } from './index.mjs';
export function evaluateFuelWindow(descriptor, samples, startTick, fuelBudget) {
  if (!Number.isSafeInteger(startTick) || startTick < 0 ||
      !Number.isSafeInteger(fuelBudget) || fuelBudget < 0 ||
      !Array.isArray(samples) || samples.length > CONTRACT.maxCatchupTicks)
    throw Error('invalid fuel window');
  const states=[]; let remaining=fuelBudget, generated=0, fuelConsumed=0;
  for (let i=0;i<samples.length;i++) {
    const sample=samples[i];
    if (!sample || sample.verified!==true || sample.observedTick!==startTick+i ||
        !sample.inputs || typeof sample.inputs!=='object' || Array.isArray(sample.inputs))
      throw Error('unverified fuel observation');
    const inputs={...sample.inputs};
    if (descriptor.model==='heat') {
      if (!Number.isSafeInteger(inputs.fuelUnits) || inputs.fuelUnits<0)
        throw Error('invalid observed fuel');
      // Caller supplies a bounded external reservation, never a replenishing snapshot.
      inputs.fuelUnits=Math.min(inputs.fuelUnits,remaining);
    }
    const state=evaluateGenerator(descriptor,inputs);
    const used=state.fuelCostPerTick;
    if (used>remaining) throw Error('fuel overspend');
    remaining-=used; fuelConsumed+=used; generated+=state.availablePerTick;
    states.push(Object.freeze({tick:startTick+i,status:state.status,generated:state.availablePerTick,fuelConsumed:used}));
  }
  return Object.freeze({contract:CONTRACT.id,instanceKey:descriptor.instanceKey,startTick,endTick:startTick+samples.length,
    fuelBudget,remainingFuel:remaining,fuelConsumed,generated,states:Object.freeze(states)});
}
