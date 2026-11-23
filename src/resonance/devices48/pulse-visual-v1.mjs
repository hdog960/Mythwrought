// Source-only visual descriptors. No GPU allocation, production renderer or save mutation.
export const PULSE_VISUAL_CONTRACT = Object.freeze({id:'resonance-device-pulse-visual-v1',version:1,productionBound:false,maxDevices:64,maxEvents:64});
const integer=(v,min=0)=>Number.isSafeInteger(v)&&v>=min;
const validId=v=>typeof v==='string'&&/^[a-z0-9][a-z0-9_-]{0,63}$/.test(v);
const PALETTES=Object.freeze({running:Object.freeze([0.17,0.66,1]),idle:Object.freeze([0.36,0.42,0.53]),deficit:Object.freeze([0.95,0.65,0.19])});
// This is a bounded, deterministic rendering proposal, not a rendered effect.
export function buildPulseDescriptors({seed,tick,devices,allocation}) {
  if(!integer(seed)||!integer(tick)||!Array.isArray(devices)||devices.length>64||!Array.isArray(allocation)||allocation.length>64) throw Error('invalid pulse frame');
  const grants=new Map();
  for(const grant of allocation){
    if(!grant||!validId(grant.id)||!integer(grant.granted)||grants.has(grant.id)) throw Error('invalid grant');
    grants.set(grant.id,grant.granted);
  }
  const seen=new Set(),events=[];
  for(const d of devices){
    if(!d||!validId(d.id)||seen.has(d.id)||d.seed!==seed||!Array.isArray(d.anchor)||d.anchor.length!==3||!d.anchor.every(n=>Number.isSafeInteger(n)&&Math.abs(n)<=1000000)||typeof d.enabled!=='boolean'||!integer(d.demand)) throw Error('invalid device');
    seen.add(d.id);
    const granted=grants.get(d.id)??0;
    if(granted>d.demand||(!d.enabled&&granted!==0)) throw Error('invalid device grant');
    const state=!d.enabled?'idle':granted<d.demand?'deficit':'running';
    if(state==='idle') continue;
    const cadence=state==='running'?12:24;
    const hash=[...d.id].reduce((h,c)=>(Math.imul(h,33)+c.charCodeAt(0))>>>0,seed>>>0);
    if((tick+hash)%cadence!==0) continue;
    events.push(Object.freeze({id:d.id,anchor:Object.freeze([...d.anchor]),state,color:PALETTES[state],intensity:state==='running'?0.7:0.3,ttlTicks:6,drawHint:'batched-rune-quad',passThrough:true}));
  }
  if([...grants.keys()].some(id=>!seen.has(id))) throw Error('orphan grant');
  return Object.freeze(events.sort((a,b)=>a.id.localeCompare(b.id)));
}
