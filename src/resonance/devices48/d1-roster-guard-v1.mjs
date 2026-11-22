// Isolated :48 source-only roster guard for deterministic D1 controls.
// Rejects removal/replacement of live controls and malformed previous state.
import {stepDeviceControls} from './device-controls-v1.mjs';
const id = s => typeof s === 'string' && /^[a-z][a-z0-9_-]{0,47}$/.test(s);
const tick = n => Number.isSafeInteger(n) && n >= 0;
const fail = reason => { throw new TypeError(reason); };
export function stepGuardedDeviceControls(previous, frame) {
  if (!frame || !id(frame.worldId) || !tick(frame.tick) || !Array.isArray(frame.devices) ||
      frame.devices.length > 32 || !Array.isArray(frame.actions) || frame.actions.length > 32)
    fail('invalid input frame');
  if (previous !== null && previous !== undefined) {
    if (!id(previous.worldId) || !tick(previous.tick) || previous.worldId !== frame.worldId ||
        frame.tick <= previous.tick || !Array.isArray(previous.devices) || previous.devices.length > 32)
      fail('invalid previous frame');
    const old = new Map();
    for (const d of previous.devices) {
      if (!d || !id(d.id) || old.has(d.id) || !['lamp','lever','button'].includes(d.type))
        fail('invalid previous roster');
      if (d.type === 'lever' && typeof d.on !== 'boolean') fail('invalid lever state');
      if (d.type === 'button' && (!tick(d.durationTicks) || d.durationTicks < 1 ||
          d.durationTicks > 120 || !Number.isSafeInteger(d.activeUntil) || d.activeUntil < -1))
        fail('invalid button state');
      if (d.type === 'lamp' && (!id(d.controlId) || d.controlId === d.id))
        fail('invalid lamp state');
      old.set(d.id,d);
    }
    const next = new Map();
    for (const d of frame.devices) {
      if (!d || !id(d.id) || next.has(d.id)) fail('invalid next roster');
      next.set(d.id,d);
    }
    if (next.size !== old.size) fail('roster change requires new fixture');
    for (const [key,prior] of old) {
      const current=next.get(key);
      if (!current || current.type !== prior.type ||
          (prior.type === 'lamp' && current.controlId !== prior.controlId) ||
          (prior.type === 'button' && current.durationTicks !== prior.durationTicks))
        fail('device definition changed');
    }
  }
  const result=stepDeviceControls(previous,frame);
  return Object.freeze({...result,guardVersion:'resonance-devices48-d1-roster-guard-v1',
    authoritativeDelivery:false,productionBound:false});
}
