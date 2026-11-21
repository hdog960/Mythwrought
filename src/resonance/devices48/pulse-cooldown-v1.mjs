// Source-only deterministic visual event cooldown. Never authorizes machinery.
export const PULSE_COOLDOWN_V1=Object.freeze({id:'resonance-devices48-pulse-cooldown-v1',authoritative:false,productionBound:false,maxDevices:16});
const ranks=Object.freeze({'candidate-interrupted':0,'candidate-restored':1,'candidate-changed':2});
const tick=x=>Number.isSafeInteger(x)&&x>=0;
export function scheduleCandidatePulses(previous,frame,{cooldownTicks=4}={}){
 if(!Number.isSafeInteger(cooldownTicks)||cooldownTicks<0||cooldownTicks>120)throw Error('invalid cooldown');
 if(!frame||!tick(frame.seed)||!tick(frame.toTick)||!Array.isArray(frame.visible)||frame.visible.length>16||
 frame.authoritative!==false||frame.productionBound!==false||frame.rendererBound!==false)throw Error('invalid candidate frame');
 if(previous!==null&&(!previous||previous.contract!==PULSE_COOLDOWN_V1.id||previous.seed!==frame.seed||
 !tick(previous.tick)||previous.tick>=frame.toTick||!Array.isArray(previous.lastEmitted)||previous.lastEmitted.length>16))throw Error('invalid history');
 const last=new Map();
 for(const e of previous?.lastEmitted??[]){
  if(!e||typeof e.id!=='string'||!e.id||!tick(e.tick)||e.tick>previous.tick||last.has(e.id))throw Error('invalid history entry');
  last.set(e.id,e.tick);
 }
 const seen=new Set(),events=[];
 for(const e of frame.visible){
  if(!e||typeof e.id!=='string'||!e.id||seen.has(e.id)||!Object.hasOwn(ranks,e.kind)||
   e.tick!==frame.toTick||e.source!=='candidate-only')throw Error('invalid pulse');
  seen.add(e.id);events.push(e);
 }
 events.sort((a,b)=>ranks[a.kind]-ranks[b.kind]||(a.id<b.id?-1:a.id>b.id?1:0));
 const emitted=[];let suppressed=0;
 for(const e of events){
  const old=last.get(e.id);
  // Never suppress an interruption warning, even during cooldown.
  if(e.kind!=='candidate-interrupted'&&old!==undefined&&frame.toTick-old<cooldownTicks){suppressed++;continue;}
  emitted.push(Object.freeze({...e}));last.set(e.id,frame.toTick);
 }
 const history=[...last].filter(([,t])=>frame.toTick-t<=120)
  .sort((a,b)=>b[1]-a[1]||(a[0]<b[0]?-1:a[0]>b[0]?1:0)).slice(0,16)
  .sort((a,b)=>a[0]<b[0]?-1:a[0]>b[0]?1:0)
  .map(([id,t])=>Object.freeze({id,tick:t}));
 const state=Object.freeze({contract:PULSE_COOLDOWN_V1.id,seed:frame.seed,tick:frame.toTick,lastEmitted:Object.freeze(history)});
 return Object.freeze({state,emitted:Object.freeze(emitted),suppressed,authoritative:false,productionBound:false,rendererBound:false});
}
