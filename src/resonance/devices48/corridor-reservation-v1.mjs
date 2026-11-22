// Source-only D2 safety preflight. Never authorizes physics, power, or actuation.
const finite = n => typeof n === 'number' && Number.isFinite(n);
function point(p) {
  if (!p || !['x','y','z'].every(k => finite(p[k]))) throw new TypeError('finite point required');
  return {x:p.x,y:p.y,z:p.z};
}
function bounds(b) {
  if (!b || !b.min || !b.max) throw new TypeError('bounds required');
  const min=point(b.min), max=point(b.max);
  for (const k of ['x','y','z']) if (min[k]>max[k]) throw new RangeError('inverted bounds');
  return {min,max};
}
function intersects(a,b) {
  return ['x','y','z'].every(k => a.min[k] <= b.max[k] && b.min[k] <= a.max[k]);
}
function swept(a,b) {
  const min={},max={};
  for (const k of ['x','y','z']) { min[k]=Math.min(a.min[k],b.min[k]); max[k]=Math.max(a.max[k],b.max[k]); }
  return {min,max};
}
/**
 * Conservative whole-path preflight for an opt-in preview fixture.
 * A clear preview is NOT a movement permit: game-owned physics must validate.
 */
export function previewCorridorReservation(frame) {
  if (!frame || frame.productionBound !== false || frame.authoritativeDelivery === true) throw new Error('source-only fixture required');
  if (typeof frame.worldId !== 'string' || !frame.worldId || !Number.isSafeInteger(frame.tick) || frame.tick<0) throw new TypeError('world and tick required');
  if (typeof frame.deviceId !== 'string' || !frame.deviceId) throw new TypeError('device identity required');
  const start=bounds(frame.start), end=bounds(frame.end);
  if (!Array.isArray(frame.occupants) || frame.occupants.length>64) throw new RangeError('bounded occupants required');
  const corridor=swept(start,end), seen=new Set(), blockers=[];
  for (const occupant of frame.occupants) {
    if (!occupant || typeof occupant.id !== 'string' || !occupant.id || seen.has(occupant.id)) throw new Error('invalid or duplicate occupant');
    seen.add(occupant.id);
    if (occupant.worldId !== frame.worldId || occupant.tick !== frame.tick) throw new Error('stale or cross-world observation');
    if (intersects(corridor,bounds(occupant.bounds))) blockers.push(occupant.id);
  }
  blockers.sort();
  return Object.freeze({
    version:1, worldId:frame.worldId, tick:frame.tick, deviceId:frame.deviceId,
    previewClear:blockers.length===0, blockers:Object.freeze(blockers),
    corridor:Object.freeze({min:Object.freeze(corridor.min),max:Object.freeze(corridor.max)}),
    authoritativeDelivery:false, productionBound:false, mayActuate:false,
    requiresPhysicsOwnerApproval:true
  });
}
