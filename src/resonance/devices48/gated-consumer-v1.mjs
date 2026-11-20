// Source-only adapter for the :48 consumer and controls. No production or network imports.
import {demandSnapshot,stepDevices} from './consumer-v1.mjs';
import {controlDemandGate} from './controls-v1.mjs';
export const DEVICE_GATE_CONTRACT=Object.freeze({id:'resonance-device-gate-v1',productionBound:false,networkBound:false});
const int=n=>Number.isSafeInteger(n)&&n>=0;
export function gatedDemand(devices,frame,links){
 if(!Array.isArray(devices)||!frame||!Array.isArray(links)||links.length>128)throw Error('invalid gated demand');
 const targets=new Map(),known=new Set(devices.map(d=>d.id));
 if(known.size!==devices.length)throw Error('duplicate device');
 for(const link of links){
  if(!link||typeof link.deviceId!=='string'||typeof link.controlId!=='string'||targets.has(link.deviceId)||!known.has(link.deviceId))throw Error('invalid link');
  targets.set(link.deviceId,link.controlId);
 }
 const gated=devices.map(d=>{
  if(!d||d.seed!==frame.seed||typeof d.enabled!=='boolean')throw Error('foreign or invalid device');
  return Object.freeze({...d,enabled:d.enabled&&(!targets.has(d.id)||controlDemandGate(frame,targets.get(d.id)))});
 });
 return Object.freeze({devices:Object.freeze(gated),demand:Object.freeze(demandSnapshot(gated))});
}
export function applyGatedAllocation(gated,grants,{seed,tick}={}){
 if(!gated||!Array.isArray(gated.devices)||!Array.isArray(gated.demand)||!Array.isArray(grants)||!int(seed)||!int(tick))throw Error('invalid allocation frame');
 const expected=demandSnapshot(gated.devices);
 if(JSON.stringify(expected)!==JSON.stringify(gated.demand))throw Error('tampered demand snapshot');
 const requests=new Map(expected.map(d=>[d.id,d.requested])),seen=new Set();
 for(const grant of grants){
  if(!grant||!requests.has(grant.id)||seen.has(grant.id)||!int(grant.granted)||grant.granted>requests.get(grant.id))throw Error('grant exceeds gated demand');
  seen.add(grant.id);
 }
 return stepDevices(gated.devices,grants,{seed,tick});
}
