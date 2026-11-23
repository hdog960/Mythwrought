// Source-only fail-closed admission of authenticated chunk snapshots to the N1/N3 bridge.
// The host authenticates world identity, chunk epochs, generator claims and tick ownership.
import {planChunkInvalidation} from './chunk-invalidation.mjs';
import {allocateFromChannelGraph} from './graph-allocation.mjs';
export const CHUNK_GRAPH_ADMISSION_CONTRACT='resonance-network36-chunk-graph-admission-v1';
const validKey=x=>typeof x==='string'&&x.length>0&&x.length<=128;
const validEpoch=x=>Number.isSafeInteger(x)&&x>=0;
function validateMembers(items,snapshot){
 if(!Array.isArray(items))throw Error('invalid descriptor list');
 for(const item of items){
  if(!item||!validKey(item.chunkKey)||!validEpoch(item.chunkEpoch))throw Error('missing chunk provenance');
  const c=snapshot.get(item.chunkKey);
  if(!c||!c.loaded||c.epoch!==item.chunkEpoch||item.loaded!==true)throw Error('stale or unloaded descriptor');
 }
}
export function allocateFromChunkSnapshot({previous=[],current=[],channels=[],endpoints=[],generation=[],devices=[],stores=[],tick,maxChanges=25,maxNodes=4096}={}){
 // Never mutate caller arrays, snapshots, world state, or saves.
 const plan=planChunkInvalidation({previous,current,maxChunks:25,maxChanges});
 if(!plan.admitted)return {contract:CHUNK_GRAPH_ADMISSION_CONTRACT,admitted:false,reason:plan.reason,required:plan.required,changes:[],result:null};
 const snapshot=new Map(current.map(c=>[c.key,c]));
 validateMembers(channels,snapshot);validateMembers(endpoints,snapshot);
 const result=allocateFromChannelGraph({channels,endpoints,generation,devices,stores,tick,maxNodes});
 return {contract:CHUNK_GRAPH_ADMISSION_CONTRACT,admitted:true,reason:null,required:plan.required,changes:plan.changes,result};
}
