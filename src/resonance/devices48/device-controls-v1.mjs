// Source-only opt-in Resonance :48 device controls; never authorizes power delivery.
const validId = id => typeof id === 'string' && /^[a-z][a-z0-9_-]{0,47}$/.test(id);
function reject(reason) { throw new TypeError(reason); }
export function stepDeviceControls(previous, frame) {
  if (!frame || !validId(frame.worldId) || !Number.isSafeInteger(frame.tick) || frame.tick < 0 ||
      !Array.isArray(frame.devices) || frame.devices.length > 32 ||
      !Array.isArray(frame.actions) || frame.actions.length > 32) reject('invalid frame');
  if (previous && (previous.worldId !== frame.worldId || frame.tick <= previous.tick)) reject('stale or cross-world frame');
  const prior = new Map((previous?.devices || []).map(d => [d.id,d]));
  const seen = new Set();
  const devices = frame.devices.map(d => {
    if (!validId(d.id) || seen.has(d.id) || !['lamp','lever','button'].includes(d.type)) reject('invalid device');
    seen.add(d.id);
    const old = prior.get(d.id);
    if (old && old.type !== d.type) reject('device type changed');
    if (d.type === 'lamp') {
      if (!validId(d.controlId) || d.controlId === d.id) reject('invalid lamp control');
      return {id:d.id,type:d.type,controlId:d.controlId};
    }
    if (d.type === 'lever') return {id:d.id,type:d.type,on:old?.on ?? false};
    if (!Number.isSafeInteger(d.durationTicks) || d.durationTicks < 1 || d.durationTicks > 120 ||
        (old && old.durationTicks !== d.durationTicks)) reject('invalid button duration');
    return {id:d.id,type:d.type,durationTicks:d.durationTicks,activeUntil:old?.activeUntil ?? -1};
  }).sort((a,b)=>a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  const byId = new Map(devices.map(d => [d.id,d]));
  const touched = new Set();
  for (const action of frame.actions) {
    if (!action || !validId(action.id) || touched.has(action.id)) reject('duplicate or invalid action');
    touched.add(action.id);
    const target = byId.get(action.id);
    if (!target || target.type === 'lamp') reject('action target is not a control');
    if (target.type === 'lever') {
      if (action.kind !== 'toggle') reject('invalid lever action');
      target.on = !target.on;
    } else {
      if (action.kind !== 'press') reject('invalid button action');
      target.activeUntil = frame.tick + target.durationTicks - 1;
      if (!Number.isSafeInteger(target.activeUntil)) reject('tick overflow');
    }
  }
  const outputs = devices.filter(d => d.type === 'lamp').map(d => {
    const control = byId.get(d.controlId);
    if (!control || control.type === 'lamp') reject('missing or invalid control');
    const requested = control.type === 'lever' ? control.on : frame.tick <= control.activeUntil;
    return Object.freeze({id:d.id,requested,requestedUnits:requested?1:0,energized:false,authority:'candidate-only'});
  });
  const state = Object.freeze({worldId:frame.worldId,tick:frame.tick,devices:Object.freeze(devices.map(d=>Object.freeze({...d})))});
  return Object.freeze({state,outputs:Object.freeze(outputs),authoritativeDelivery:false,productionBound:false});
}
