// Isolated, opt-in allocation across externally authenticated connected components.
import { allocateResonance } from './storage-allocation.mjs';
export const NETWORK36_SCOPED_CONTRACT = 'resonance-network36-scoped-allocation-v1';
const validId = x => typeof x === 'string' && x.length > 0 && x.length <= 128;
const validUnits = x => Number.isSafeInteger(x) && x >= 0;
const sum = (a,b) => { const v=a+b; if(!Number.isSafeInteger(v)) throw Error('overflow'); return v; };
export function allocateScopedResonance({networks, generation, devices=[], stores=[]}) {
 if(!Array.isArray(networks)||!Array.isArray(generation)||!Array.isArray(devices)||!Array.isArray(stores)||networks.length>256||generation.length>4096||devices.length>4096||stores.length>4096) throw Error('invalid envelope');
 const ids=new Set();
 for(const n of networks) { if(!validId(n)||ids.has(n)) throw Error('duplicate network'); ids.add(n); }
 const members=new Set();
 const groups=new Map([...ids].map(n=>[n,{generation:0,devices:[],stores:[]}]));
 for(const [type,items] of [['generation',generation],['devices',devices],['stores',stores]]) for(const item of items) {
  if(!item||!validId(item.id)||!ids.has(item.network)||members.has(item.id)) throw Error('invalid or duplicate member');
  members.add(item.id);
  const g=groups.get(item.network);
  if(type==='generation') {if(!validUnits(item.available))throw Error('invalid generation');g.generation=sum(g.generation,item.available);}
  else if(type==='devices')g.devices.push({id:item.id,demand:item.demand,priority:item.priority});
  else g.stores.push({id:item.id,capacity:item.capacity,charge:item.charge,inputRate:item.inputRate,outputRate:item.outputRate});
 }
 const results=[];let produced=0,spent=0,drawn=0,charged=0,unused=0;
 for(const network of [...ids].sort()) {
  const r=allocateResonance(groups.get(network));
  results.push({network,...r});
  produced=sum(produced,r.generation);spent=sum(spent,r.spent);drawn=sum(drawn,r.drawn);charged=sum(charged,r.charged);unused=sum(unused,r.unused);
 }
 if(sum(produced,drawn)!==sum(sum(spent,charged),unused))throw Error('energy imbalance');
 return {contract:NETWORK36_SCOPED_CONTRACT,networks:results,totals:{produced,spent,drawn,charged,unused}};
}
