// Detached read-only observer barrier for original PopulationManager reconcile.
// Original MobEngine/world callbacks must not silently change the 3D player
// position while a due global source tick is being inspected.
const original = new WeakSet();
const LIMIT = 2 ** 26;

function valid(point) {
  return Array.isArray(point) && point.length === 3 &&
    point.every(value => Number.isFinite(value) && Math.abs(value) < LIMIT);
}

export function captureOriginalReconcileObserver(observer) {
  if (!valid(observer))
    throw new TypeError('Invalid original reconcile observer');
  const point = Object.freeze([...observer]);
  // A getter on the caller's array can change it during copying. Refuse to
  // treat such a changing source as a stable initial observer.
  if (!valid(point) || !observer.every((value,i) => Object.is(value,point[i])))
    throw new TypeError('Original reconcile observer changed during capture');
  const ticket = Object.freeze({point});
  original.add(ticket);
  return ticket;
}

export function assertOriginalReconcileObserverUnchanged(ticket,observer) {
  if (!ticket || !original.has(ticket) || !valid(observer) ||
      ticket.point.some((value,i) => !Object.is(value,observer[i])))
    throw new TypeError('Original reconcile observer changed during inspection');
  return true;
}
