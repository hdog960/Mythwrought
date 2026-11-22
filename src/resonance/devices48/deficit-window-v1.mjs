// Source-only bounded rolling deficit telemetry. No power or motion authority.
const validId = x => typeof x === 'string' && /^[A-Za-z0-9_-]{1,64}$/.test(x);
const integer = x => Number.isSafeInteger(x) && x >= 0;
const fail = () => { throw new TypeError('invalid advisory deficit frame'); };
export function stepDeficitWindow(previous, frame) {
  if (!frame || !validId(frame.worldId) || !integer(frame.simulationTick) ||
      !Array.isArray(frame.devices) || frame.devices.length > 64 ||
      frame.authoritativeDelivery !== false || frame.movementAuthorized !== false ||
      frame.advisoryOnly !== true) fail();
  if (previous !== null && previous !== undefined &&
      (previous.schema !== 'resonance48-deficit-window-v1' || previous.worldId !== frame.worldId ||
       !integer(previous.simulationTick) || frame.simulationTick !== previous.simulationTick + 1 ||
       !Array.isArray(previous.history) || previous.history.length > 8 ||
       previous.authoritativeDelivery !== false || previous.movementAuthorized !== false)) fail();
  const seen = new Set(); let requested = 0, observed = 0, deficit = 0;
  for (const d of frame.devices) {
    if (!d || !validId(d.deviceId) || seen.has(d.deviceId) ||
        !integer(d.requested) || !integer(d.observedDelivered) || !integer(d.deficit) ||
        d.requested > 1000000 || d.observedDelivered > d.requested ||
        d.deficit !== d.requested - d.observedDelivered ||
        d.energized !== false || d.movementAuthorized !== false ||
        d.authoritativeDelivery !== false || d.productionBound !== false) fail();
    seen.add(d.deviceId);
    requested += d.requested; observed += d.observedDelivered; deficit += d.deficit;
  }
  if (!Number.isSafeInteger(requested) || !Number.isSafeInteger(observed)) fail();
  const history = [...(previous?.history ?? []), Object.freeze({tick:frame.simulationTick,requested,observed,deficit})].slice(-8);
  if (previous) for (let i=0;i<previous.history.length;i++) {
    const h=previous.history[i];
    if (!h || !integer(h.tick) || !integer(h.requested) || !integer(h.observed) ||
        !integer(h.deficit) || h.deficit !== h.requested-h.observed ||
        (i>0 && h.tick !== previous.history[i-1].tick+1)) fail();
  }
  if (previous?.history.length && previous.history.at(-1).tick !== previous.simulationTick) fail();
  return Object.freeze({schema:'resonance48-deficit-window-v1',worldId:frame.worldId,
    simulationTick:frame.simulationTick,authoritativeDelivery:false,movementAuthorized:false,
    productionBound:false,history:Object.freeze(history),
    totals:Object.freeze({requested:history.reduce((a,h)=>a+h.requested,0),
      observed:history.reduce((a,h)=>a+h.observed,0),deficit:history.reduce((a,h)=>a+h.deficit,0)})});
}
