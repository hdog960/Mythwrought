// Opt-in deterministic single-network accounting. All quantities are integer Resonance units per tick.
export const NETWORK36_STORAGE_CONTRACT = 'resonance-network36-storage-allocation-v1';
const valid = n => Number.isSafeInteger(n) && n >= 0;
const add = (a,b) => { const n=a+b; if(!Number.isSafeInteger(n)) throw Error('overflow'); return n; };
const id = s => typeof s === 'string' && s.length>0 && s.length<=128;
const sorted = a => [...a].sort((x,y)=>x.id<y.id?-1:x.id>y.id?1:0);
export function allocateResonance({generation, devices=[], stores=[]}) {
 if(!valid(generation)||!Array.isArray(devices)||!Array.isArray(stores)||devices.length>4096||stores.length>4096) throw Error('invalid envelope');
 const seen=new Set();
 for(const x of [...devices,...stores]) { if(!x||!id(x.id)||seen.has(x.id))throw Error('duplicate or invalid id'); seen.add(x.id); }
 for(const d of devices) if(!valid(d.demand)||!valid(d.priority))throw Error('invalid device');
 for(const s of stores) if(!valid(s.capacity)||!valid(s.charge)||!valid(s.inputRate)||!valid(s.outputRate)||s.charge>s.capacity)throw Error('invalid store');
 const orderedDevices=[...devices].sort((a,b)=>a.priority-b.priority||(a.id<b.id?-1:a.id>b.id?1:0));
 const orderedStores=sorted(stores);
 let available=generation, drawn=0, spent=0;
 const updates=orderedStores.map(s=>({...s,remainingOutput:s.outputRate}));
 const enabled=[]; const stopped=[];
 // Reserve enough for each complete device, or shed it; never partially power a device.
 for(const d of orderedDevices){
  if(d.demand<=available){available-=d.demand;spent=add(spent,d.demand);enabled.push(d.id);continue;}
  let missing=d.demand-available;
  let possible=0;
  for(const s of updates) possible=add(possible,Math.min(s.charge,s.remainingOutput));
  if(possible<missing){stopped.push(d.id);continue;}
  for(const s of updates){const n=Math.min(missing,s.charge,s.remainingOutput);s.charge-=n;s.remainingOutput-=n;missing-=n;drawn=add(drawn,n);if(!missing)break;}
  available=0;spent=add(spent,d.demand);enabled.push(d.id);
 }
 let charged=0;
 for(const s of updates){const n=Math.min(available,s.inputRate,s.capacity-s.charge);s.charge+=n;available-=n;charged=add(charged,n);}
 // No mutation of caller objects, no world edits, no damage events.
 return {enabled,stopped,stores:updates.map(({id,charge})=>({id,charge})),generation,spent,drawn,charged,unused:available};
}
