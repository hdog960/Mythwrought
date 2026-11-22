// Source-only bounded UI descriptor; never authorizes device operation.
export const STATUS_PANEL_V1=Object.freeze({id:'resonance-devices48-status-panel-v1',productionBound:false,maxDevices:16});
const valid=n=>Number.isSafeInteger(n)&&n>=0;
export function buildStatusPanel(snapshot){
 if(!snapshot||!valid(snapshot.seed)||!valid(snapshot.tick)||!Array.isArray(snapshot.devices)||snapshot.devices.length>16)throw Error('invalid snapshot');
 const seen=new Set();let requested=0,supplied=0;
 const devices=snapshot.devices.map(d=>{
  if(!d||typeof d.id!=='string'||!d.id.length||d.id.length>64||seen.has(d.id)||!valid(d.requested)||!valid(d.supplied)||d.requested>64||d.supplied>d.requested)throw Error('invalid device status');
  seen.add(d.id);requested+=d.requested;supplied+=d.supplied;
  return Object.freeze({id:d.id,state:d.requested===0?'idle':d.supplied===d.requested?'candidate-powered':d.supplied===0?'candidate-stopped':'candidate-deficit',requested:d.requested,supplied:d.supplied});
 }).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
 if(requested>256||!valid(snapshot.produced)||!valid(snapshot.stored)||snapshot.produced>256||snapshot.stored>1000000)throw Error('invalid aggregate');
 return Object.freeze({contract:STATUS_PANEL_V1.id,seed:snapshot.seed,tick:snapshot.tick,producedCandidate:snapshot.produced,usedCandidate:supplied,storedCandidate:snapshot.stored,deficitCandidate:requested-supplied,authoritative:false,productionBound:false,devices:Object.freeze(devices)});
}