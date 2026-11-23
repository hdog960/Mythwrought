// Source-only advisory; never grants physical movement or energy.
const validId = s => typeof s === 'string' && /^[a-zA-Z0-9_-]{1,64}$/.test(s);
const validTick = n => Number.isSafeInteger(n) && n >= 0;
const fail = s => { throw new TypeError(s); };
function roster(frame) {
  if (!frame || !validId(frame.worldId) || !validTick(frame.tick) || !Array.isArray(frame.gates) || frame.gates.length > 16) fail('invalid frame');
  const seen = new Set();
  for (const g of frame.gates) {
    if (!g || !validId(g.id) || seen.has(g.id)) fail('invalid roster');
    seen.add(g.id);
    if (typeof g.candidatePathClear !== 'boolean' || g.movementAuthorized !== false || g.physicsBound !== false || g.authoritativeDelivery !== false || g.productionBound !== false) fail('untrusted gate state');
  }
  return [...seen].sort();
}
/** Three-snapshot candidate continuity; never a real physics clearance. */
export function assessGateMotionContinuity(frames) {
  if (!Array.isArray(frames) || frames.length !== 3) fail('three frames required');
  const [a,b,c] = frames;
  const names = frames.map(roster);
  if (a.worldId !== b.worldId || b.worldId !== c.worldId || !Number.isSafeInteger(a.tick + 2) || b.tick !== a.tick + 1 || c.tick !== b.tick + 1) fail('stale or foreign frame');
  if (JSON.stringify(names[0]) !== JSON.stringify(names[1]) || JSON.stringify(names[1]) !== JSON.stringify(names[2])) fail('roster changed');
  const gates = names[0].map(id => {
    const stableClear = frames.every(f => f.gates.find(g => g.id === id).candidatePathClear);
    return Object.freeze({id, stableClear, blocked:!stableClear, movementAuthorized:false, authoritativeDelivery:false, physicsBound:false, productionBound:false});
  });
  return Object.freeze({worldId:c.worldId,tick:c.tick,advisoryOnly:true,movementAuthorized:false,gates:Object.freeze(gates)});
}
