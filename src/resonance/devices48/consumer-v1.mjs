// Resonance devices D0: isolated, deterministic, source-only consumer. No production imports.
export const DEVICE_CONTRACT = Object.freeze({id:'resonance-device-consumer-v1', version:1, units:'integer energy per tick', productionBound:false});
const TYPES = Object.freeze({lamp:{demand:1,priority:2},gate:{demand:3,priority:1},platform:{demand:5,priority:1}});
const validInt=(n,min=0)=>Number.isSafeInteger(n)&&n>=min;
export function createDevice({id,type,seed,anchor,enabled=true}) {
  if(typeof id!=='string'||! /^[a-z0-9][a-z0-9_-]{0,63}$/.test(id)||!Object.hasOwn(TYPES,type)) throw Error('invalid device');
  if(!validInt(seed)||!Array.isArray(anchor)||anchor.length!==3||!anchor.every(n=>Number.isSafeInteger(n)&&Math.abs(n)<=1000000)) throw Error('invalid world anchor');
  if(typeof enabled!=='boolean') throw Error('invalid enabled state');
  return Object.freeze({id,type,seed,anchor:Object.freeze([...anchor]),enabled,demand:TYPES[type].demand,priority:TYPES[type].priority});
}
export function stepDevices(devices,allocation,{tick,seed}){
  if(!validInt(tick)||!validInt(seed)||!Array.isArray(devices)||!Array.isArray(allocation)) throw Error('invalid frame');
  const keys=new Set(),grants=new Map();
  for(const a of allocation){
    if(!a||typeof a.id!=='string'||!validInt(a.granted)||grants.has(a.id)) throw Error('invalid allocation');
    grants.set(a.id,a.granted);
  }
  const result=[];
  for(const d of devices){
    if(!d||keys.has(d.id)||d.seed!==seed||!Object.hasOwn(TYPES,d.type)||d.demand!==TYPES[d.type].demand||d.priority!==TYPES[d.type].priority) throw Error('invalid device frame');
    keys.add(d.id);
    const granted=grants.get(d.id)??0;
    if(granted>d.demand) throw Error('overallocated device');
    const powered=d.enabled&&granted>=d.demand;
    result.push(Object.freeze({id:d.id,type:d.type,tick,mode:!d.enabled?'off':powered?'running':'stopped',requested:d.enabled?d.demand:0,granted,priority:d.priority,visual:powered?'resonance-pulse':'dark',motionAllowed:powered&&d.type!=='lamp'}));
  }
  if([...grants.keys()].some(k=>!keys.has(k))) throw Error('unknown allocation');
  return Object.freeze(result.sort((a,b)=>a.id.localeCompare(b.id)));
}
export function demandSnapshot(devices){
  if(!Array.isArray(devices)) throw Error('invalid devices');
  const ids=new Set();
  return devices.map(d=>{if(!d||ids.has(d.id)||!Object.hasOwn(TYPES,d.type))throw Error('duplicate or invalid device');ids.add(d.id);return Object.freeze({id:d.id,requested:d.enabled?d.demand:0,priority:d.priority});}).sort((a,b)=>a.priority-b.priority||a.id.localeCompare(b.id));
}
