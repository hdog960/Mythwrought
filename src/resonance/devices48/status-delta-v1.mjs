import {buildStatusPanel} from './status-panel-v1.mjs';

// Candidate-only timeline. This never authorizes an actuator or authenticates energy delivery.
export const STATUS_DELTA_V1 = Object.freeze({id:'resonance-devices48-status-delta-v1',productionBound:false,maxEvents:16});
const integer = n => Number.isSafeInteger(n) && n >= 0;
const sameIds = (a,b) => a.length===b.length && a.every((d,i)=>d.id===b[i].id);
export function buildStatusDelta(previous, current) {
  const before=buildStatusPanel(previous), after=buildStatusPanel(current);
  if(before.seed!==after.seed || after.tick<=before.tick) throw new Error('stale or foreign status frame');
  if(!sameIds(before.devices,after.devices)) throw new Error('device roster changed; reset baseline');
  const events=[];
  for(let i=0;i<after.devices.length;i++){
    const a=before.devices[i], b=after.devices[i];
    if(a.state===b.state && a.requested===b.requested && a.supplied===b.supplied) continue;
    const kind=b.state==='candidate-powered'&&a.state!=='candidate-powered'?'candidate-restored':
      b.state==='candidate-stopped'&&a.state!=='candidate-stopped'?'candidate-interrupted':'candidate-changed';
    events.push(Object.freeze({id:b.id,kind,from:a.state,to:b.state,requested:b.requested,supplied:b.supplied}));
  }
  if(events.length>STATUS_DELTA_V1.maxEvents) throw new Error('event budget exceeded');
  const aggregates=Object.freeze({
    producedDelta:after.producedCandidate-before.producedCandidate,
    usedDelta:after.usedCandidate-before.usedCandidate,
    storedDelta:after.storedCandidate-before.storedCandidate,
    deficitDelta:after.deficitCandidate-before.deficitCandidate
  });
  for(const n of Object.values(aggregates))if(!Number.isSafeInteger(n))throw new Error('unsafe delta');
  return Object.freeze({contract:STATUS_DELTA_V1.id,seed:after.seed,fromTick:before.tick,toTick:after.tick,
    authoritative:false,productionBound:false,aggregates,events:Object.freeze(events)});
}
