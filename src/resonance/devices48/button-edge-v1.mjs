// Source-only :48 D1 momentary button edge filter. No runtime registration.
export const BUTTON_EDGE_CONTRACT = 'resonance48-button-edge-v1';
const integer = n => Number.isSafeInteger(n) && n >= 0;
export function advanceButtonEdge(previous, input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('input');
  const { worldId, deviceId, tick, pressed, powered } = input;
  if (typeof worldId !== 'string' || !worldId.trim() || worldId.length > 96 ||
      typeof deviceId !== 'string' || !deviceId.trim() || deviceId.length > 96 ||
      !integer(tick) || typeof pressed !== 'boolean' || typeof powered !== 'boolean')
    throw new TypeError('invalid button input');
  if (previous !== null && previous !== undefined) {
    if (previous.contract !== BUTTON_EDGE_CONTRACT || previous.worldId !== worldId ||
        previous.deviceId !== deviceId || !integer(previous.tick) ||
        tick !== previous.tick + 1 || typeof previous.pressed !== 'boolean' ||
        typeof previous.powered !== 'boolean' || typeof previous.edgeCount !== 'number' ||
        !integer(previous.edgeCount) || previous.edgeCount > previous.tick + 1 ||
        previous.activationAuthorized !== false || previous.productionBound !== false)
      throw new Error('invalid or discontinuous button state');
  }
  const rising = pressed && !(previous?.pressed ?? false);
  const falling = !pressed && (previous?.pressed ?? false);
  const observedPress = rising && powered;
  const edgeCount = (previous?.edgeCount ?? 0) + (rising ? 1 : 0);
  if (!integer(edgeCount)) throw new RangeError('edge count overflow');
  return Object.freeze({
    contract: BUTTON_EDGE_CONTRACT, worldId, deviceId, tick, pressed, powered,
    rising, falling, observedPress, edgeCount,
    activationAuthorized: false, authoritativeDelivery: false, productionBound: false
  });
}
