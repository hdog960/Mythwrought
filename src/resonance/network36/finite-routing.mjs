// Source-only, deterministic finite-throughput allocation. No persistence or world mutation.
export const FINITE_ROUTING_CONTRACT='resonance-network36-finite-routing-v1';
const valid=n=>Number.isSafeInteger(n)&&n>=0;
const ident=x=>typeof x==='string'&&x.length>0;
const cmp=(a,b)=>a<b?-1:a>b?1:0;
export function routeFiniteResonance({nodes=[],edges=[],generators=[],devices=[]}={}) {
 if(![nodes,edges,generators,devices].every(x=>Array.isArray(x))||[nodes,edges,generators,devices].some(a=>a.length>2048))throw Error('routing budget');
 const ids=new Set(), nodeIds=new Set();
 for(const n of nodes){if(!n||!ident(n.id)||nodeIds.has(n.id))throw Error('invalid node');nodeIds.add(n.id);ids.add(n.id)}
 const adjacency=new Map([...nodeIds].map(id=>[id,[]]));
 const capacities=new Map();
 for(const e of edges){if(!e||!ident(e.from)||!ident(e.to)||!valid(e.capacity))throw Error('invalid edge');if(!nodeIds.has(e.from)||!nodeIds.has(e.to)||e.from===e.to)continue;
  const key=[e.from,e.to].sort(cmp).join('\u0000');if(capacities.has(key))throw Error('duplicate edge');capacities.set(key,e.capacity);
  adjacency.get(e.from).push({to:e.to,key});adjacency.get(e.to).push({to:e.from,key});
 }
 for(const a of adjacency.values())a.sort((x,y)=>cmp(x.to,y.to));
 const sources=new Map();let production=0;
 for(const g of generators){if(!g||!ident(g.id)||ids.has(g.id)||!ident(g.at)||!valid(g.output))throw Error('invalid generator');ids.add(g.id);
  if(nodeIds.has(g.at)){const total=(sources.get(g.at)||0)+g.output;if(!valid(total))throw Error('energy overflow');sources.set(g.at,total);production+=g.output;if(!valid(production))throw Error('energy overflow')}
 }
 const loads=[];
 for(const d of devices){if(!d||!ident(d.id)||ids.has(d.id)||!ident(d.at)||!valid(d.demand)||!valid(d.priority??2))throw Error('invalid device');ids.add(d.id);loads.push(d)}
 loads.sort((a,b)=>(a.priority??2)-(b.priority??2)||cmp(a.id,b.id));
 const remaining=new Map(capacities), active=[],stopped=[];let consumption=0;
 // Route each all-or-nothing load atomically; rollback partial augmentations on shortage.
 for(const d of loads){if(!nodeIds.has(d.at)){stopped.push(d.id);continue}
  const localSources=new Map(sources),localEdges=new Map(remaining);let need=d.demand;
  while(need>0){
   const queue=[d.at],prev=new Map([[d.at,null]]);let found=null;
   for(let i=0;i<queue.length&&found===null;i++){
    const at=queue[i];if((localSources.get(at)||0)>0){found=at;break}
    for(const edge of adjacency.get(at)){if((localEdges.get(edge.key)||0)<=0||prev.has(edge.to))continue;prev.set(edge.to,{at,key:edge.key});queue.push(edge.to)}
   }
   if(found===null)break;
   let amount=Math.min(need,localSources.get(found));let cursor=found;
   while(prev.get(cursor)){const p=prev.get(cursor);amount=Math.min(amount,localEdges.get(p.key));cursor=p.at}
   if(amount<=0)throw Error('routing invariant');
   localSources.set(found,localSources.get(found)-amount);cursor=found;
   while(prev.get(cursor)){const p=prev.get(cursor);localEdges.set(p.key,localEdges.get(p.key)-amount);cursor=p.at}
   need-=amount;
  }
  if(need===0){sources.clear();for(const [k,v] of localSources)sources.set(k,v);remaining.clear();for(const [k,v] of localEdges)remaining.set(k,v);active.push(d.id);consumption+=d.demand;if(!valid(consumption))throw Error('energy overflow')}
  else stopped.push(d.id);
 }
 return {contract:FINITE_ROUTING_CONTRACT,active,stopped,production,consumption,unusedProduction:production-consumption,remainingEdges:Object.fromEntries([...remaining].sort(([a],[b])=>cmp(a,b)))};
}
