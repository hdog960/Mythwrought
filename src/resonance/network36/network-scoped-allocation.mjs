export const NETWORK36_SCOPED_CONTRACT='resonance-network36-scoped-allocation-v1';
const valid=n=>Number.isSafeInteger(n)&&n>=0;
const id=s=>typeof s==='string'&&s.length>0&&s.length<=128;
const add=(a,b)=>{const n=a+b;if(!Number.isSafeInteger(n))throw Error('overflow');return n;};
const cmp=(a,b)=>a<b?-1:a>b?1:0;
export function allocateScopedResonance({networks=[],generators=[],devices=[],stores=[]}={}){
 for(const [a,limit] of [[networks,1024],[generators,4096],[devices,4096],[stores,4096]])if(!Array.isArray(a)||a.length>limit)throw Error('invalid envelope');
 const ids=new Set(),groups=new Map();
 for(const n of networks){if(!n||!id(n.id)||ids.has(n.id))throw Error('invalid network');ids.add(n.id);groups.set(n.id,{generation:0,devices:[],stores:[]});}
 const seen=new Set();
 for(const [items,fields,kind] of [[generators,['output'],'generator'],[devices,['priority','demand'],'device'],[stores,['capacity','charge','inputRate','outputRate'],'store']]){
  for(const x of items){
   if(!x||!id(x.id)||!id(x.networkId)||seen.has(x.id)||fields.some(f=>!valid(x[f])))throw Error('invalid entity');
   seen.add(x.id);const group=groups.get(x.networkId);if(!group)throw Error('unknown network');
   if(kind==='store'&&x.charge>x.capacity)throw Error('invalid charge');
   if(kind==='generator')group.generation=add(group.generation,x.output);
   else group[kind==='device'?'devices':'stores'].push(x);
  }
 }
 const result=[];
 for(const networkId of [...ids].sort(cmp)){
  const group=groups.get(networkId);
  const ordered=group.devices.slice().sort((a,b)=>cmp(a.priority,b.priority)||cmp(a.id,b.id));
  const batteries=group.stores.slice().sort((a,b)=>cmp(a.id,b.id)).map(s=>({id:s.id,charge:s.charge,capacity:s.capacity,inputRate:s.inputRate,outputRate:s.outputRate,remainingOutput:s.outputRate}));
  let available=group.generation,spent=0,drawn=0,charged=0;const enabled=[],stopped=[];
  for(const d of ordered){
   if(d.demand<=available){available-=d.demand;spent=add(spent,d.demand);enabled.push(d.id);continue;}
   const deficit=d.demand-available;let possible=0;
   for(const s of batteries)possible=add(possible,Math.min(s.charge,s.remainingOutput));
   if(possible<deficit){stopped.push(d.id);continue;}
   let needed=deficit;
   for(const s of batteries){const take=Math.min(needed,s.charge,s.remainingOutput);s.charge-=take;s.remainingOutput-=take;needed-=take;drawn=add(drawn,take);if(!needed)break;}
   available=0;spent=add(spent,d.demand);enabled.push(d.id);
  }
  for(const s of batteries){const amount=Math.min(available,s.inputRate,s.capacity-s.charge);s.charge+=amount;available-=amount;charged=add(charged,amount);}
  if(add(group.generation,drawn)!==add(add(spent,charged),available))throw Error('accounting mismatch');
  result.push({networkId,generation:group.generation,spent,drawn,charged,unused:available,enabled,stopped,stores:batteries.map(({id,charge})=>({id,charge}))});
 }
 return {contract:NETWORK36_SCOPED_CONTRACT,networks:result};
}
