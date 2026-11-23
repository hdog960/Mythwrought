// Isolated source-only controls; never writes world, physics, or saves.
export const CONTROL_CONTRACT=Object.freeze({id:'resonance-device-controls-v1',productionBound:false});
const valid=(n,min=0,max=2147483647)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const idOK=s=>typeof s==='string'&&/^[a-z0-9][a-z0-9_-]{0,63}$/.test(s);
export function createControl({id,seed,kind,period=0,initial=false}){
 if(!idOK(id)||!valid(seed)||!['lever','button','timer'].includes(kind)||typeof initial!=='boolean'||(kind==='timer'?!valid(period,1,3600):period!==0))throw Error('invalid control');
 return Object.freeze({id,seed,kind,period,initial});
}
export function createControlFrame(controls,{seed,tick=0}={}){
 if(!valid(seed)||!valid(tick)||!Array.isArray(controls)||controls.length>128)throw Error('invalid frame');
 const ids=new Set();
 const states=controls.map(c=>{
  if(!c||ids.has(c.id)||c.seed!==seed||!idOK(c.id)||!['lever','button','timer'].includes(c.kind)||typeof c.initial!=='boolean'||(c.kind==='timer'?!valid(c.period,1,3600):c.period!==0))throw Error('invalid control frame');
  ids.add(c.id);return Object.freeze({id:c.id,kind:c.kind,enabled:c.kind==='timer'?Math.floor(tick/c.period)%2===0:c.initial,pressedAt:null});
 }).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
 return Object.freeze({seed,tick,states:Object.freeze(states)});
}
export function stepControlFrame(controls,frame,{tick,events=[]}={}){
 if(!frame||!valid(tick)||tick!==frame.tick+1||!Array.isArray(events)||events.length>128)throw Error('invalid tick');
 const fresh=createControlFrame(controls,{seed:frame.seed,tick:frame.tick});
 if(JSON.stringify(fresh.states.map(s=>s.id))!==JSON.stringify(frame.states.map(s=>s.id)))throw Error('frame identity mismatch');
 const previous=new Map(frame.states.map(s=>[s.id,s])),actions=new Map();
 for(const e of events){
  if(!e||!idOK(e.id)||!['press','release','toggle'].includes(e.action)||actions.has(e.id)||!previous.has(e.id))throw Error('invalid event');
  actions.set(e.id,e.action);
 }
 const states=controls.map(c=>{
  const old=previous.get(c.id),action=actions.get(c.id);
  if(action&&((c.kind==='lever'&&action!=='toggle')||(c.kind==='button'&&action==='toggle')||c.kind==='timer'))throw Error('incompatible event');
  let enabled=old.enabled,pressedAt=old.pressedAt;
  if(c.kind==='timer')enabled=Math.floor(tick/c.period)%2===0;
  if(c.kind==='lever'&&action==='toggle')enabled=!enabled;
  if(c.kind==='button'){
   if(action==='press'){enabled=true;pressedAt=tick;}
   else if(action==='release'){enabled=false;pressedAt=null;}
   else if(pressedAt!==null&&tick>pressedAt){enabled=false;pressedAt=null;}
  }
  return Object.freeze({id:c.id,kind:c.kind,enabled,pressedAt});
 }).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
 return Object.freeze({seed:frame.seed,tick,states:Object.freeze(states)});
}
export function controlDemandGate(frame,id){
 if(!frame||!idOK(id))throw Error('invalid gate');
 const s=frame.states.find(s=>s.id===id);if(!s)throw Error('unknown control');return s.enabled;
}
