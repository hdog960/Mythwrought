// Opt-in, source-only end-to-end device frame. No production actor, renderer or save binding.
import {createDevice,stepDevices,demandSnapshot} from './consumer-v1.mjs';
import {describeDeviceStatus} from './status-v1.mjs';
import {buildPulseDescriptors} from './pulse-visual-v1.mjs';
export const PREVIEW_FRAME_CONTRACT=Object.freeze({id:'resonance-devices48-preview-frame-v1',version:1,productionBound:false,maxDevices:64});
const uint=n=>Number.isSafeInteger(n)&&n>=0;
export function buildDevicePreviewFrame({seed,tick,specs,grants=[],produced=0,stored=0}){
  if(!uint(seed)||!uint(tick)||!uint(produced)||!uint(stored)||!Array.isArray(specs)||specs.length>64||!Array.isArray(grants)||grants.length>64)throw Error('invalid preview frame');
  const devices=specs.map(s=>createDevice({...s,seed}));
  const demand=demandSnapshot(devices);
  const seen=new Set();
  const normalized=grants.map(g=>{
    if(!g||typeof g.id!=='string'||!uint(g.granted)||seen.has(g.id))throw Error('invalid preview grant');
    seen.add(g.id);return Object.freeze({id:g.id,granted:g.granted});
  });
  const states=stepDevices(devices,normalized,{seed,tick});
  const status=describeDeviceStatus({seed,tick,devices,grants:normalized.map(g=>({id:g.id,amount:g.granted,seed,tick})),produced,stored});
  const pulses=buildPulseDescriptors({seed,tick,devices,allocation:normalized});
  for(const state of states){
    const s=status.devices.find(x=>x.id===state.id);
    if(!s||s.mode!==state.mode)throw Error('inconsistent device state');
  }
  return Object.freeze({contract:PREVIEW_FRAME_CONTRACT.id,seed,tick,demand:Object.freeze(demand),states:Object.freeze(states),status,pulses,productionBound:false});
}
