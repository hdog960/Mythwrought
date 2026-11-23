// Source-only D4 collector intent. Never reads/writes production inventory or terrain.
const integer = n => Number.isSafeInteger(n) && n >= 0;
export function previewProtectedCollection(input) {
  if (!input || input.productionBound !== false || input.authoritative === true ||
      !Number.isSafeInteger(input.tick) || input.tick < 0 ||
      typeof input.worldId !== 'string' || !input.worldId || input.worldId.length > 96 ||
      typeof input.deviceId !== 'string' || !input.deviceId || input.deviceId.length > 96 ||
      !Array.isArray(input.items) || input.items.length > 64 ||
      !integer(input.capacity) || input.capacity > 256 ||
      !integer(input.availablePower) || input.availablePower > 100000) throw new TypeError('invalid isolated collector fixture');
  const seen = new Set();
  const eligible = [];
  const rejected = [];
  let capacity = input.capacity, power = input.availablePower;
  for (const item of input.items) {
    if (!item || typeof item.id !== 'string' || !item.id || item.id.length > 96 || seen.has(item.id) ||
        !integer(item.quantity) || item.quantity < 1 || item.quantity > 64 ||
        !integer(item.powerCost) || item.powerCost < 1 || item.powerCost > 10000 ||
        typeof item.worldId !== 'string' || !item.worldId ||
        typeof item.owner !== 'string' || !item.owner ||
        typeof item.source !== 'string') throw new TypeError('invalid item observation');
    seen.add(item.id);
  }
  for (const item of [...input.items].sort((a,b)=>a.id < b.id ? -1 : a.id > b.id ? 1 : 0)) {
    const reason = item.worldId !== input.worldId ? 'wrong-world' :
      item.owner !== 'fixture' || item.source !== 'opt-in-drop' || item.protected === true ? 'protected' :
      item.quantity > capacity ? 'capacity' :
      item.powerCost > power ? 'power' : null;
    if (reason) rejected.push(Object.freeze({id:item.id, reason}));
    else { eligible.push(Object.freeze({id:item.id, quantity:item.quantity, powerCost:item.powerCost}));
      capacity -= item.quantity; power -= item.powerCost; }
  }
  return Object.freeze({worldId:input.worldId, deviceId:input.deviceId, tick:input.tick,
    advisoryOnly:true, canActuate:false, remainingCapacity:capacity, remainingPower:power,
    eligible:Object.freeze(eligible), rejected:Object.freeze(rejected)});
}
