// Opt-in :24 -> :36 integer candidate descriptor; never a network delivery authorization.
import { CONTRACT } from './index.mjs';
export const INTEGER_HANDOFF = 'resonance-generation24-network36-integer-v1';
const MICRO = 1000000;
const safe = n => Number.isSafeInteger(n) && n >= 0;
export function toNetwork36Candidate(evaluation, tick, previous = null) {
  if (evaluation?.contract !== CONTRACT.id || typeof evaluation.instanceKey !== 'string' ||
      !evaluation.instanceKey || !safe(tick) || !Number.isFinite(evaluation.availablePerTick) ||
      evaluation.availablePerTick < 0 || !Number.isFinite(evaluation.capacityPerTick) ||
      evaluation.capacityPerTick < evaluation.availablePerTick)
    throw Error('invalid generator output');
  // Never round upward: this would create energy over long runs.
  // Sub-micro energy is deliberately discarded, not credited to the checkpoint.
  const scaledFloat = evaluation.availablePerTick * MICRO;
  if (!Number.isFinite(scaledFloat) || scaledFloat < 0 || scaledFloat > Number.MAX_SAFE_INTEGER)
    throw Error('unsafe fractional candidate');
  const scaled = Math.floor(scaledFloat);
  if (!safe(scaled)) throw Error('unsafe fractional candidate');
  if (previous !== null &&
      (previous.signature !== INTEGER_HANDOFF || previous.id !== evaluation.instanceKey ||
       !safe(previous.nextTick) || previous.nextTick !== tick ||
       !safe(previous.remainderMicro) || previous.remainderMicro >= MICRO))
    throw Error('incompatible integer handoff checkpoint');
  if (!safe(tick + 1)) throw Error('unsafe handoff tick');
  const total = scaled + (previous?.remainderMicro ?? 0);
  if (!safe(total)) throw Error('unsafe handoff sum');
  const output = Math.floor(total / MICRO);
  const checkpoint = Object.freeze({signature:INTEGER_HANDOFF,id:evaluation.instanceKey,
    nextTick:tick+1,remainderMicro:total % MICRO});
  return Object.freeze({contract:INTEGER_HANDOFF,networkProposal:'resonance-network36-proposal-v1',
    id:evaluation.instanceKey,output,checkpoint,delivered:false,fuelWithdrawn:false,
    quantization:'conservative-floor-micro-v1',discardedFractionUpperBoundPerTick:1/MICRO});
}
