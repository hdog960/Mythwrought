// Opt-in read-only inspection of a completed finite-routing result. No renderer or saves.
export const INSPECTION_CONTRACT='resonance-network36-inspection-v1';
const valid=n=>Number.isSafeInteger(n)&&n>=0;
const cmp=(a,b)=>a<b?-1:a>b?1:0;
export function inspectResonanceRouting({routing,stored=0,storageCapacity=0,networkId='network'}={}){
 if(!routing||!valid(routing.production)||!valid(routing.consumption)||!valid(routing.unusedProduction)||
 !valid(stored)||!valid(storageCapacity)||stored>storageCapacity||
 !Array.isArray(routing.active)||!Array.isArray(routing.stopped)||
 typeof networkId!=='string'||!networkId||routing.production!==routing.consumption+routing.unusedProduction)
 throw Error('invalid inspection snapshot');
 const active=[...routing.active],stopped=[...routing.stopped];
 if([...active,...stopped].some(x=>typeof x!=='string'||!x)||new Set([...active,...stopped]).size!==active.length+stopped.length)throw Error('invalid device ids');
 active.sort(cmp);stopped.sort(cmp);
 const status=stopped.length?'shortage':active.length?'running':'idle';
 const pulses=active.length&&routing.consumption>0?[{networkId,kind:'resonance-flow',strength:Math.min(3,Math.max(1,Math.ceil(3*routing.consumption/Math.max(1,routing.production))))}]:[];
 return {contract:INSPECTION_CONTRACT,networkId,status,production:routing.production,use:routing.consumption,unused:routing.unusedProduction,stored,storageCapacity,active,stopped,pulses};
}
