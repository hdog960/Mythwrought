// Source-only N1 finite channel flow proposal. No production writes or power creation.
// Single-source/single-sink max-flow; caller must reserve capacities across multiple devices.
export const FLOW_CONTRACT='resonance-network36-flow-v1';
const valid=n=>Number.isSafeInteger(n)&&n>=0;
export function boundedChannelFlow({edges=[],source,sink,demand=0,maxEdges=2048}={}) {
 if(typeof source!=='string'||!source||typeof sink!=='string'||!sink||source===sink)throw Error('invalid endpoints');
 if(!valid(demand)||!valid(maxEdges)||maxEdges>2048||!Array.isArray(edges)||edges.length>maxEdges)throw Error('flow budget');
 const graph=new Map(),ids=new Set();
 const add=(a,b,cap)=>{if(!graph.has(a))graph.set(a,[]);const e={to:b,cap,rev:0};graph.get(a).push(e);return e};
 for(const e of edges){
  if(!e||typeof e.id!=='string'||!e.id||ids.has(e.id)||typeof e.from!=='string'||!e.from||typeof e.to!=='string'||!e.to||e.from===e.to||!valid(e.capacity))throw Error('invalid channel edge');
  ids.add(e.id);const f=add(e.from,e.to,e.capacity),r=add(e.to,e.from,0);f.rev=r;r.rev=f;
 }
 let delivered=0,iterations=0;
 while(delivered<demand){
  const queue=[source],seen=new Set(queue),prev=new Map();
  for(let i=0;i<queue.length&&!seen.has(sink);i++)for(const e of graph.get(queue[i])||[]){
   if(e.cap>0&&!seen.has(e.to)){seen.add(e.to);prev.set(e.to,{from:queue[i],edge:e});queue.push(e.to)}
  }
  if(!seen.has(sink))break;
  let amount=demand-delivered;
  for(let at=sink;at!==source;){const p=prev.get(at);amount=Math.min(amount,p.edge.cap);at=p.from}
  for(let at=sink;at!==source;){const p=prev.get(at);p.edge.cap-=amount;p.edge.rev.cap+=amount;at=p.from}
  delivered+=amount;iterations++;
  if(iterations>maxEdges)throw Error('flow iteration budget');
 }
 return Object.freeze({contract:FLOW_CONTRACT,requested:demand,delivered,shortfall:demand-delivered,iterations,edgeCount:edges.length});
}
