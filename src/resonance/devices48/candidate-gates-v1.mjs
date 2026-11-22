// :48 source-only D1 gate intent. Does not mutate world geometry or authorize motion.
import {stepGuardedDeviceControls} from './d1-roster-guard-v1.mjs';
const validId = s => typeof s === 'string' && /^[a-z][a-z0-9_-]{0,47}$/.test(s);
const fail = message => { throw new TypeError(message); };
export function stepCandidateGates(previous, frame) {
  if (!frame || !Array.isArray(frame.gates) || frame.gates.length > 16 ||
      !Array.isArray(frame.devices) || !Array.isArray(frame.actions)) fail('invalid gate frame');
  const ids = new Set();
  const gates = frame.gates.map(g => {
    if (!g || !validId(g.id) || ids.has(g.id) || !validId(g.controlId) ||
        !Number.isSafeInteger(g.travelTicks) || g.travelTicks < 1 || g.travelTicks > 120)
      fail('invalid gate definition');
    ids.add(g.id);
    return {id:g.id,controlId:g.controlId,travelTicks:g.travelTicks};
  }).sort((a,b)=>a.id.localeCompare(b.id,'en'));
  const oldGates = previous?.gates;
  if (previous !== null && previous !== undefined) {
    if (!Array.isArray(oldGates) || oldGates.length !== gates.length) fail('gate roster changed');
    const old = new Map();
    for (const g of oldGates) {
      if (!g || !validId(g.id) || old.has(g.id) || !validId(g.controlId) ||
          !Number.isSafeInteger(g.travelTicks) || g.travelTicks < 1 || g.travelTicks > 120)
        fail('invalid previous gates');
      old.set(g.id,g);
    }
    for (const g of gates) {
      const prior=old.get(g.id);
      if (!prior || prior.controlId !== g.controlId || prior.travelTicks !== g.travelTicks)
        fail('gate definition changed');
    }
  }
  const controls = stepGuardedDeviceControls(previous?.controls ?? null,frame);
  const byId = new Map(controls.state.devices.map(d=>[d.id,d]));
  const intents = gates.map(g=>{
    const control=byId.get(g.controlId);
    if (!control || !['lever','button'].includes(control.type)) fail('invalid gate control');
    const requestedOpen=control.type==='lever' ? control.on : controls.state.tick <= control.activeUntil;
    return Object.freeze({id:g.id,requestedOpen,requestedUnits:requestedOpen?2:0,
      movementAuthorized:false,collisionCleared:false,physicalProgress:0,
      authority:'candidate-only',reason:'awaiting-authoritative-delivery-and-physics-bridge'});
  });
  const state=Object.freeze({controls:controls.state,gates:Object.freeze(gates.map(g=>Object.freeze(g)))});
  return Object.freeze({state,intents:Object.freeze(intents),authoritativeDelivery:false,
    physicsBound:false,productionBound:false});
}
