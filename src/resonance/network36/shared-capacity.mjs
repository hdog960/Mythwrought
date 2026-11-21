// Source-only N1 shared throughput reservations. Directed channels, no production writes.
export const SHARED_FLOW_CONTRACT='resonance-network36-shared-flow-v1';
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const name=s=>typeof s==='string'&&s.length>0;
export function allocateChannelCapacity({edges=[],generators=[],devices=[]}={}) {
 if(!Array.isArray(edges)||!Array.isArray(generators)||!Array.isArray(devices)||
    edges.length>2048||generators.length>2048||devices.length>2048)throw Error('allocation budget');
 const ids=new Set(),nodeNames=new Set();
 const checkId=id=>{if(!name(id)||ids.has(id))throw Error('duplicate or invalid id');ids.add(id)};
 const graph=new Map();
 const add=(a,b,cap)=>{if(!graph.has(a))graph.set(a,[]);if(!graph.has(b))graph.set(b,[]);
   const f={to:b,cap,reverse:null},r={to:a,cap:0,reverse:f};f.reverse=r;graph.get(a).push(f);graph.get(b).push(r)};
 for(const e of edges){if(!e||!name(e.from)||!name(e.to)||e.from===e.to||!integer(e.capacity))throw Error('invalid edge');checkId(e.id);nodeNames.add(e.from);nodeNames.add(e.to);add(e.from,e.to,e.capacity)}
 const source='\\0resonance-source',sink='\\0resonance-sink';
 for(const g of generators){if(!g||!name(g.at)||!integer(g.output))throw Error('invalid generator');checkId(g.id);nodeNames.add(g.at)}
 for(const d of devices){if(!d||!name(d.at)||!integer(d.demand)||!integer(d.priority??100))throw Error('invalid device');checkId(d.id);nodeNames.add(d.at)}
 if(nodeNames.has(source)||nodeNames.has(sink))throw Error('reserved endpoint');
 for(const g of [...generators].sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0))add(source,g.at,g.output);
 const states={},delivered={},ordered=[...devices].sort((a,b)=>(a.priority??100)-(b.priority??100)||(a.id<b.id?-1:a.id>b.id?1:0));
 for(const d of ordered){
   // Transactional trial: a machine only runs when its entire demand can be delivered.
   const originalCaps=new Map();
   for(const list of graph.values())for(const e of list)originalCaps.set(e,e.cap);
   add(d.at,sink,d.demand);
   let total=0,iterations=0;
   while(total<d.demand){
     const queue=[source],seen=new Set(queue),previous=new Map();
     for(let i=0;i<queue.length&&!seen.has(sink);i++)for(const e of graph.get(queue[i])||[])
       if(e.cap>0&&!seen.has(e.to)){seen.add(e.to);previous.set(e.to,{from:queue[i],edge:e});queue.push(e.to)}
     if(!seen.has(sink))break;
     let amount=d.demand-total;
     for(let at=sink;at!==source;){const p=previous.get(at);amount=Math.min(amount,p.edge.cap);at=p.from}
     for(let at=sink;at!==source;){const p=previous.get(at);p.edge.cap-=amount;p.edge.reverse.cap+=amount;at=p.from}
     total+=amount;if(++iterations>edges.length+generators.length+1)throw Error('flow iteration budget');
   }
   // Remove temporary sink edges, never let one device's residual network leak into the next.
   const forward=graph.get(d.at).pop(),reverse=graph.get(sink).pop();
   if(!forward||!reverse)throw Error('sink invariant');
   if(total!==d.demand){for(const [e,cap] of originalCaps)e.cap=cap;states[d.id]='shortage';delivered[d.id]=0}
   else {states[d.id]='active';delivered[d.id]=total}
 }
 const used=Object.values(delivered).reduce((a,b)=>{if(!Number.isSafeInteger(a+b))throw Error('use overflow');return a+b},0);
 return {contract:SHARED_FLOW_CONTRACT,deviceStates:states,delivered,used};
}
