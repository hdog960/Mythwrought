// Source-only adapter for the :48 consumer and controls. No production or network imports.
import {demandSnapshot,stepDevices} from './consumer-v1.mjs';
import {controlDemandGate} from './controls-v1.mjs';
export const DEVICE_GATE_CONTRACT=Object.freeze({id:'resonance-device-gate-v1',productionBound:false,networkBound:false});
const int=n=>Number.isSafeInteger(n)&&n>=0;
export function gatedDemand(devices,frame,links){
 if(!Array.isArray(devices)||!frame||!Array.isArray(links)||links.length>128)throw Error('invalid gated demand');
 const targets=new Map(),known=new Set(devices.map(d=>d.id));
 for(const link of links){
  if(!link||typeof link.deviceId!=='string'||typeof link.controlId!=='string'||targets.has(link.deviceId)||!known.has(link.deviceId))throw Error('invalid link');
  targets.set(link.deviceId,link.controlId);
 }
 const gated=devices.map(d=>Object.freeze({...d,enabled:d.enabled&&(!targets.has(d.id)||controlDemandGate(frame,targets.get(d.id)))}));
 return Object.freeze({devices:Object.freeze(gated),demand:Object.freeze(demandSnapshot(gated))});
}
export function applyGatedAllocation(gated,grants,{seed,tick}={}){
 if(!gated||!Array.isArray(gated.devices)||!Array.isArray(gated.demand)||!Array.isArray(grants)||!int(seed)||!int(tick))throw Error('invalid allocation frame');
 const requests=new Map(gated.demand.map(d=>[d.id,d.requested]));
 if(requests.size!==gated.devices.length)throw Error('invalid demand snapshot');
 for(const grant of grants){
  if(!grant||!requests.has(grant.id)||!int(grant.granted)||grant.granted>requests.get(grant.id))throw Error('grant exceeds gated demand');
 }
 return stepDevices(gated.devices,grants,{seed,tick});
}
