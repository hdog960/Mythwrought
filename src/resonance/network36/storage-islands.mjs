import {settleStorage} from './storage-ledger.mjs';
export const STORAGE_ISLANDS_CONTRACT='resonance-network36-storage-islands-v1';
const valid=n=>Number.isSafeInteger(n)&&n>=0;
const id=s=>typeof s==='string'&&s.length>0;
// Explicit disconnected islands. A future graph adapter supplies island membership.
// No world writes, implicit global pool, or persistence.
export function settleStorageIslands({islands=[]}={}) {
 if(!Array.isArray(islands)||islands.length>2048)throw Error('island budget');
 const seen=new Set(),storeIds=new Set(),results={};
 for(const island of islands){
  if(!island||!id(island.id)||seen.has(island.id)||!valid(island.production)||!valid(island.consumption)||!Array.isArray(island.stores))throw Error('invalid island');
  seen.add(island.id);
  for(const store of island.stores){if(!store||!id(store.id)||storeIds.has(store.id))throw Error('duplicate storage across islands');storeIds.add(store.id)}
 }
 for(const island of [...islands].sort((a,b)=>a.id.localeCompare(b.id,'en'))){
  results[island.id]=settleStorage({production:island.production,consumption:island.consumption,stores:island.stores});
 }
 return {contract:STORAGE_ISLANDS_CONTRACT,islands:results};
}
