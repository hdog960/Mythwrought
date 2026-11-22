/** Source-only bounded visual descriptors. Never render or authorize energy. */
const validId = s => typeof s === 'string' && /^[A-Za-z0-9_-]{1,48}$/.test(s);
const amount = n => Number.isSafeInteger(n) && n >= 0 && n <= 1000000;
const denied = reason => Object.freeze({valid:false,reason,renderAuthorized:false,deliveryAuthorized:false,productionBound:false});
const states = Object.freeze(['off','observed-sufficient','deficit']);
const palette = Object.freeze({
  off:Object.freeze({rune:'#6e7182',metal:'#8c7754',intensity:0}),
  'observed-sufficient':Object.freeze({rune:'#54aef5',metal:'#e4bb68',intensity:3}),
  deficit:Object.freeze({rune:'#8265c4',metal:'#a88b5a',intensity:1})
});
/**
 * Produces a deterministic, allocation-free-in-game description for up to eight devices.
 * Observation is untrusted and cannot authorize rendering, movement or power delivery.
 */
export function describeResonancePulseFrame(frame, previous = null) {
  if (!frame || !validId(frame.worldId) || !amount(frame.tick) || !Array.isArray(frame.devices) ||
      frame.devices.length < 1 || frame.devices.length > 8) return denied('invalid-frame');
  if (previous !== null && (!previous || previous.worldId !== frame.worldId ||
      !amount(previous.tick) || previous.tick + 1 !== frame.tick ||
      !Array.isArray(previous.devices))) return denied('discontinuous-frame');
  const normalize = devices => {
    const seen = new Set();
    return devices.map(d => {
      if (!d || !validId(d.id) || seen.has(d.id) || !states.includes(d.state) ||
          !amount(d.demand) || !amount(d.grant) || d.grant > d.demand ||
          (d.state === 'off' && d.grant !== 0) ||
          (d.state === 'observed-sufficient' && d.grant < d.demand) ||
          (d.state === 'deficit' && (d.demand === 0 || d.grant >= d.demand)))
        throw new TypeError('invalid-device');
      seen.add(d.id);
      return {id:d.id,state:d.state,demand:d.demand,grant:d.grant};
    }).sort((a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  };
  let now, old;
  try { now = normalize(frame.devices); old = previous ? normalize(previous.devices) : []; }
  catch { return denied('invalid-device'); }
  if (previous && (now.length !== old.length || now.some((d,i) => d.id !== old[i].id)))
    return denied('roster-changed');
  const descriptors = Object.freeze(now.map((d,i) => {
    const prior = old[i]?.state ?? 'unobserved';
    const colors = palette[d.state];
    return Object.freeze({
      id:d.id, state:d.state, previousState:prior,
      pulse: prior === d.state ? 'steady' : d.state === 'off' ? 'fade' :
        d.state === 'deficit' ? 'falter' : 'wake',
      runeColor:colors.rune, metalColor:colors.metal,
      intensity:colors.intensity,
      phase:(frame.tick + i * 3) % 8,
      requestedDemand:d.demand, observedGrant:d.grant,
      renderAuthorized:false, deliveryAuthorized:false
    });
  }));
  return Object.freeze({
    valid:true,worldId:frame.worldId,tick:frame.tick,descriptors,
    renderAuthorized:false,deliveryAuthorized:false,productionBound:false,
    visualOnly:true
  });
}
