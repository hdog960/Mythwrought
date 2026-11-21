// Opt-in :24 -> :36 integer candidate descriptor; never a network delivery authorization.
import { CONTRACT } from './index.mjs';
export const INTEGER_HANDOFF = 'resonance-generation24-network36-integer-v1';
const safe = n => Number.isSafeInteger(n) && n >= 0;
export function toNetwork36Candidate(evaluation, tick, previous = null) {
  if (evaluation?.contract !== CONTRACT.id || typeof evaluation.instanceKey !== 'string' ||
      !evaluation.instanceKey || !safe(tick) || !Number.isFinite(evaluation.availablePerTick) ||
      evaluation.availablePerTick < 0 || !Number.isFinite(evaluation.capacityPerTick) ||
      evaluation.capacityPerTick < evaluation.availablePerTick)
    throw Error('invalid generator output');
  const scaled = Math.round(evaluation.availablePerTick * 1000000);
  if (!safe(scaled) || Math.abs(scaled / 1000000 - evaluation.availablePerTick) > 0.0000005)
    throw Error('unsafe fractional candidate');
  if (previous !== null &&
      (previous.signature !== INTEGER_HANDOFF || previous.id !== evaluation.instanceKey ||
       !safe(previous.nextTick) || previous.nextTick !== tick ||
       !safe(previous.remainderMicro) || previous.remainderMicro >= 1000000))
    throw Error('incompatible integer handoff checkpoint');
  if (!safe(tick + 1)) throw Error('unsafe handoff tick');
  const total = scaled + (previous?.remainderMicro ?? 0);
  if (!safe(total)) throw Error('unsafe handoff sum');
  const output = Math.floor(total / 1000000);
  const checkpoint = Object.freeze({signature:INTEGER_HANDOFF,id:evaluation.instanceKey,
    nextTick:tick+1,remainderMicro:total % 1000000});
  // :36 proposal expects integer output. This remains a source claim, not verified delivery.
  return Object.freeze({contract:INTEGER_HANDOFF,networkProposal:'resonance-network36-proposal-v1',
    id:evaluation.instanceKey,output,checkpoint,delivered:false,fuelWithdrawn:false});
}
