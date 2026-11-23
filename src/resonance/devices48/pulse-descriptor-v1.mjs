// D5 advisory visual event descriptors. Pure data; no renderer, power, or motion authority.
const validId = x => typeof x === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(x);
const nonnegative = x => Number.isSafeInteger(x) && x >= 0;
const fail = () => { throw new TypeError('invalid resonance48 advisory status'); };
export function describeResonancePulse(previous, current) {
  if (!current || current.schema !== 'resonance48-status-descriptor-v1' ||
      !validId(current.worldId) || !nonnegative(current.simulationTick) ||
      !['idle','observed-satisfied','observed-partial','observed-unpowered'].includes(current.status) ||
      !nonnegative(current.requested) || !nonnegative(current.observed) ||
      !nonnegative(current.deficit) || current.observed > current.requested ||
      current.deficit !== current.requested - current.observed ||
      !nonnegative(current.historyTicks) || current.historyTicks < 1 || current.historyTicks > 8 ||
      !nonnegative(current.windowDeficit) || current.windowDeficit < current.deficit ||
      current.authoritativeDelivery !== false || current.energized !== false ||
      current.movementAuthorized !== false || current.productionBound !== false) fail();
  const expected = current.requested === 0 ? 'idle' : current.deficit === 0 ?
    'observed-satisfied' : current.observed === 0 ? 'observed-unpowered' : 'observed-partial';
  if (current.status !== expected) fail();
  if (previous !== null && previous !== undefined) {
    if (!previous || previous.schema !== current.schema || previous.worldId !== current.worldId ||
        !nonnegative(previous.simulationTick) || current.simulationTick !== previous.simulationTick + 1 ||
        previous.authoritativeDelivery !== false || previous.energized !== false ||
        previous.movementAuthorized !== false || previous.productionBound !== false ||
        !nonnegative(previous.requested) || !nonnegative(previous.observed) ||
        !nonnegative(previous.deficit) || previous.deficit !== previous.requested - previous.observed ||
        previous.observed > previous.requested ||
        !['idle','observed-satisfied','observed-partial','observed-unpowered'].includes(previous.status) ||
        previous.status !== (previous.requested === 0 ? 'idle' : previous.deficit === 0 ?
          'observed-satisfied' : previous.observed === 0 ? 'observed-unpowered' : 'observed-partial')) fail();
  }
  const changed = previous == null || previous.status !== current.status;
  const palette = current.status === 'observed-satisfied' ? 'rune-blue' :
    current.status === 'observed-partial' ? 'rune-gold' :
    current.status === 'observed-unpowered' ? 'rune-dim' : 'none';
  return Object.freeze({schema:'resonance48-pulse-descriptor-v1',
    worldId:current.worldId,simulationTick:current.simulationTick,
    kind:changed ? 'status-change' : 'steady',status:current.status,palette,
    intensity:current.status === 'observed-satisfied' ? 2 :
      current.status === 'observed-partial' ? 1 : 0,
    requested:current.requested,observed:current.observed,deficit:current.deficit,
    advisoryOnly:true,authoritativeDelivery:false,energized:false,
    movementAuthorized:false,productionBound:false});
}
