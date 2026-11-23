/** Source-only D2 timed control. Observations are not actuation authority. */
export const TIMED_CONTROL_CONTRACT = 'resonance48.timed-control.v1';
const validId = s => typeof s === 'string' && /^[a-z0-9][a-z0-9_-]{0,63}$/.test(s);
const nat = n => Number.isSafeInteger(n) && n >= 0;
const bounded = (n, min, max) => Number.isSafeInteger(n) && n >= min && n <= max;
function fail(message) { throw new Error(message); }
/**
 * Each press edge starts a bounded timed request. Power loss stops the output immediately;
 * the timer continues to expire rather than restarting when power returns.
 * This function does not grant energy, move geometry or modify game state.
 */
export function stepTimedControl(previous, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) fail('input required');
  const {worldId, controlId, targetId, tick, pressed, observedGrant, durationTicks} = input;
  if (!validId(worldId) || !validId(controlId) || !validId(targetId) || controlId === targetId ||
      !nat(tick) || typeof pressed !== 'boolean' || !bounded(observedGrant, 0, 1) ||
      !bounded(durationTicks, 1, 600)) fail('invalid timed control input');
  let expiryTick = -1, priorPressed = false;
  if (previous !== null && previous !== undefined) {
    if (previous.contract !== TIMED_CONTROL_CONTRACT || previous.worldId !== worldId ||
        previous.controlId !== controlId || previous.targetId !== targetId ||
        !nat(previous.tick) || tick !== previous.tick + 1 ||
        previous.durationTicks !== durationTicks || typeof previous.pressed !== 'boolean' ||
        !Number.isSafeInteger(previous.expiryTick) || previous.expiryTick < -1 ||
        previous.expiryTick > previous.tick + durationTicks ||
        previous.requested !== (previous.tick < previous.expiryTick) ||
        previous.active !== (previous.requested && previous.observedGrant === 1) ||
        !bounded(previous.observedGrant, 0, 1) ||
        previous.activationAuthorized !== false || previous.productionBound !== false ||
        previous.authoritativeDelivery !== false) fail('invalid previous control state');
    expiryTick = previous.expiryTick;
    priorPressed = previous.pressed;
  }
  const edge = pressed && !priorPressed;
  if (edge) expiryTick = tick + durationTicks;
  const requested = tick < expiryTick;
  const active = requested && observedGrant === 1;
  return Object.freeze({contract: TIMED_CONTROL_CONTRACT, worldId, controlId, targetId,
    tick, durationTicks, pressed, expiryTick, edge, requested, active, observedGrant,
    activationAuthorized: false, authoritativeDelivery: false, productionBound: false});
}
