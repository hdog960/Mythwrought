// Isolated Resonance device fixture: bounded energy and deterministic status descriptors.
// This does not bind production rendering, world collision, or saves.
export const STATUS_CONTRACT = Object.freeze({id:'resonance-device-status-v1',productionBound:false,maxDevices:64});
const integer=(n)=>Number.isSafeInteger(n)&&n>=0;
export function describeDeviceStatus({seed,tick,devices,grants,stored=0,produced=0}) {
  if(!integer(seed)||!integer(tick)||!integer(stored)||!integer(produced)||!Array.isArray(devices)||!Array.isArray(grants)||devices.length>64) throw Error('invalid status frame');
  const ids=new Set(), grantsById=new Map();
  for(const grant of grants) {
    if(!grant||typeof grant.id!=='string'||grantsById.has(grant.id)||!integer(grant.amount)||grant.tick!==tick||grant.seed!==seed) throw Error('invalid grant');
    grantsById.set(grant.id,grant.amount);
  }
  const statuses=[];
  for(const device of devices) {
    if(!device||typeof device.id!=='string'||ids.has(device.id)||device.seed!==seed||!integer(device.demand)||typeof device.enabled!=='boolean') throw Error('invalid device');
    ids.add(device.id);
    const supplied=grantsById.get(device.id)??0;
    if(supplied>device.demand||(!device.enabled&&supplied!==0)) throw Error('invalid allocation');
    const used=device.enabled&&supplied===device.demand?supplied:0;
    statuses.push(Object.freeze({id:device.id,mode:!device.enabled?'off':used===device.demand?'running':'stopped',requested:device.enabled?device.demand:0,used,deficit:device.enabled?device.demand-used:0,pulse:used>0?'rune-blue':'none'}));
  }
  if([...grantsById.keys()].some(id=>!ids.has(id))) throw Error('unknown grant');
  statuses.sort((a,b)=>a.id.localeCompare(b.id,'en'));
  const used=statuses.reduce((n,s)=>n+s.used,0);
  return Object.freeze({contract:STATUS_CONTRACT.id,seed,tick,produced,stored,used,deficit:statuses.reduce((n,s)=>n+s.deficit,0),devices:Object.freeze(statuses)});
}
