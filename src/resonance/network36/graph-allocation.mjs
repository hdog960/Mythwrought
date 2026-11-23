// Opt-in bridge between externally verified channel topology and scoped accounting.
// The caller must authenticate world ownership, generation fuel, tick and chunk state.
import {deriveChannelGraph} from './channel-graph.mjs';
import {allocateScopedResonance} from './network-allocation.mjs';
export const GRAPH_ALLOCATION_CONTRACT='resonance-network36-graph-allocation-v1';
const validId=x=>typeof x==='string'&&x.length>0&&x.length<=128;
export function allocateFromChannelGraph({channels,endpoints,generation=[],devices=[],stores=[],tick,maxNodes=4096}={}) {
 if(!Number.isSafeInteger(tick)||tick<0||!Array.isArray(generation)||!Array.isArray(devices)||!Array.isArray(stores))throw Error('invalid tick or members');
 const graph=deriveChannelGraph({channels,endpoints,maxNodes});
 const attached=new Map(graph.endpoints.map(e=>[e.id,e]));
 const seen=new Set(),disconnected=[];
 const scoped={generation:[],devices:[],stores:[]};
 for(const [kind,items] of [['generation',generation],['devices',devices],['stores',stores]]) {
  if(items.length>4096)throw Error('member limit');
  for(const item of items) {
   if(!item||!validId(item.id)||seen.has(item.id))throw Error('invalid or duplicate member');
   seen.add(item.id);
   const endpoint=attached.get(item.id);
   if(!endpoint)throw Error('member missing authenticated endpoint');
   if(Object.hasOwn(item,'network'))throw Error('caller network override forbidden');
   if(endpoint.status!=='connected') {disconnected.push({id:item.id,kind,reason:endpoint.status});continue;}
   scoped[kind].push({...item,network:endpoint.network});
  }
 }
 const allocation=allocateScopedResonance({networks:graph.networks.map(n=>n.id),...scoped});
 return {contract:GRAPH_ALLOCATION_CONTRACT,tick,graph,allocation,disconnected:disconnected.sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0)};
}
