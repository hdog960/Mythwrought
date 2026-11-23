// Opt-in :24 -> :36 boundary; no authoritative fuel or world state mutation.
export const NETWORK36_GENERATOR_HANDOFF='resonance-network36-generator-handoff-v1';
const integer=n=>Number.isSafeInteger(n)&&n>=0;
export function acceptGeneratorAvailability(evaluations,{tick}={}) {
 if(!integer(tick)||!Array.isArray(evaluations)||evaluations.length>4096)throw Error('generator handoff envelope');
 const ids=new Set(),outputs=[];let total=0;
 for(const item of evaluations){
  if(!item||typeof item!=='object'||Array.isArray(item))throw Error('generator descriptor');
  const d=Object.getOwnPropertyDescriptors(item);
  const read=k=>{if(!d[k]||!Object.hasOwn(d[k],'value'))throw Error('generator accessor');return d[k].value;};
  const id=read('id'),observedTick=read('tick'),availablePerTick=read('availablePerTick'),capacityPerTick=read('capacityPerTick');
  if(typeof id!=='string'||!id||id.length>128||id.includes('\0')||ids.has(id)||observedTick!==tick||!integer(availablePerTick)||!integer(capacityPerTick)||availablePerTick>capacityPerTick)throw Error('generator invalid');
  ids.add(id);total+=availablePerTick;if(!integer(total))throw Error('generator overflow');
  outputs.push(Object.freeze({id,availablePerTick,capacityPerTick}));
 }
 outputs.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
 return Object.freeze({contract:NETWORK36_GENERATOR_HANDOFF,tick,availablePerTick:total,generators:Object.freeze(outputs),authoritative:false});
}
