/** Source-only optical proximity sensor; never authorizes physical actuation. */
export const SENSOR_CONTRACT = 'resonance48.proximity-sensor.v1';
const id = x => typeof x === 'string' && /^[a-z0-9][a-z0-9_-]{0,47}$/.test(x);
const tickOk = x => Number.isSafeInteger(x) && x >= 0;
function invalid() { throw new TypeError('invalid proximity sensor observation or history'); }
export function stepProximitySensor(previous, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) invalid();
  const {worldId, sensorId, tick, distance, observedGrant, enterRadius, exitRadius, stableTicks} = input;
  if (!id(worldId) || !id(sensorId) || !tickOk(tick) || !Number.isFinite(distance) || distance < 0 || distance > 256 ||
      !Number.isFinite(enterRadius) || !Number.isFinite(exitRadius) || enterRadius < 0.25 || enterRadius > 32 ||
      exitRadius < enterRadius || exitRadius > 48 || !Number.isSafeInteger(stableTicks) || stableTicks < 1 || stableTicks > 16 ||
      (observedGrant !== 0 && observedGrant !== 1)) invalid();
  let detected = false, streak = 0, candidate = false;
  if (previous !== null && previous !== undefined) {
    if (previous.contract !== SENSOR_CONTRACT || previous.worldId !== worldId || previous.sensorId !== sensorId ||
        !tickOk(previous.tick) || tick !== previous.tick + 1 || previous.enterRadius !== enterRadius ||
        previous.exitRadius !== exitRadius || previous.stableTicks !== stableTicks ||
        typeof previous.detected !== 'boolean' || typeof previous.candidate !== 'boolean' ||
        !Number.isSafeInteger(previous.streak) || previous.streak < 0 || previous.streak > stableTicks ||
        previous.output !== (previous.detected && previous.observedGrant === 1) ||
        (previous.observedGrant !== 0 && previous.observedGrant !== 1) ||
        previous.activationAuthorized !== false || previous.authoritativeDelivery !== false || previous.productionBound !== false) invalid();
    detected = previous.detected; streak = previous.streak; candidate = previous.candidate;
  }
  const observed = detected ? distance <= exitRadius : distance <= enterRadius;
  if (observed === detected) { streak = 0; candidate = observed; }
  else {
    streak = candidate === observed ? Math.min(streak + 1, stableTicks) : 1;
    candidate = observed;
    if (streak >= stableTicks) { detected = observed; streak = 0; }
  }
  return Object.freeze({contract:SENSOR_CONTRACT, worldId, sensorId, tick, enterRadius, exitRadius,
    stableTicks, candidate, streak, detected, observedGrant, output:detected && observedGrant === 1,
    activationAuthorized:false, authoritativeDelivery:false, productionBound:false});
}
