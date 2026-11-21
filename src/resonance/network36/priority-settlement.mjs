import {topologyStorageIslands} from './topology-islands.mjs';
import {settleStorage} from './storage-ledger.mjs';
export const PRIORITY_SETTLEMENT_CONTRACT='resonance-network36-priority-settlement-v1';
const valid=n=>Number.isSafeInteger(n)&&n>=0;
const cmp=(a,b)=>a<b?-1:a>b?1:0;
// Pure, opt-in island-level activation policy; NOT a physical edge-flow solver.
// Full-power-or-off devices, safety first, no damage, no persistence.
export function settlePriorityNetworks(input={}) {
 const {nodes=[],edges=[],generators=[],devices=[],stores=[]}=input;
 // Reject invalid stores even when their anchor chunk is unloaded/disconnected.
 for(const store of stores){
  if(!store||!['capacity','charge','maxInput','maxOutput'].every(k=>valid(store[k]))||store.charge>store.capacity)
   throw Error('invalid storage');
 }
 const topology=topologyStorageIslands({nodes,edges,generators,devices,stores});
 // Partition by topology using an explicit parent graph; do not infer membership from energy totals.
 const parent=new Map(nodes.map(n=>[n.id,n.id]));
 const root=x=>{while(parent.get(x)!==x)x=parent.get(x);return x};
 for(const e of edges){if(e.capacity>0&&parent.has(e.from)&&parent.has(e.to)){
  const a=root(e.from),b=root(e.to);if(a!==b)parent.set(cmp(a,b)<0?b:a,cmp(a,b)<0?a:b);
 }}
 const buckets=new Map(topology.islands.map(i=>[i.id,[]]));
 const seen=new Set();
 for(const d of devices){
  if(!d||!valid(d.demand)||!valid(d.priority??2)||seen.has(d.id))throw Error('invalid device priority');
  seen.add(d.id);
  if(parent.has(d.at))buckets.get(root(d.at)).push(d);
 }
 const results=[];
 for(const island of topology.islands){
  const ordered=buckets.get(island.id).sort((a,b)=>(a.priority??2)-(b.priority??2)||cmp(a.id,b.id));
  const maxDischarge=island.stores.reduce((sum,s)=>{
   const n=sum+Math.min(s.charge,s.maxOutput);
   if(!Number.isSafeInteger(n))throw Error('energy overflow');return n;
  },0);
  let budget=island.production+maxDischarge;
  if(!Number.isSafeInteger(budget))throw Error('energy overflow');
  const active=[],stopped=[];let consumption=0;
  for(const d of ordered){
   if(d.demand<=budget){active.push(d.id);budget-=d.demand;consumption+=d.demand;}
   else stopped.push(d.id);
  }
  const ledger=settleStorage({production:island.production,consumption,stores:island.stores});
  if(ledger.unmet!==0)throw Error('activation energy invariant');
  results.push({id:island.id,active,stopped,production:island.production,requested:island.consumption,consumption,...ledger});
 }
 return {contract:PRIORITY_SETTLEMENT_CONTRACT,islands:results,disconnected:topology.disconnected};
}
