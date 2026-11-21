// Opt-in source-only topology partition; no world or save writes.
export const TOPOLOGY_ISLANDS_CONTRACT='resonance-network36-topology-islands-v1';
const id=x=>typeof x==='string'&&x.length>0&&x!=='__proto__'&&x!=='constructor';
const valid=x=>Number.isSafeInteger(x)&&x>=0;
export function topologyStorageIslands({nodes=[],edges=[],generators=[],devices=[],stores=[]}={}){
 if(![nodes,edges,generators,devices,stores].every(Array.isArray)||[nodes,edges,generators,devices,stores].some(a=>a.length>2048))throw Error('topology budget');
 const parent=new Map();
 for(const n of nodes){if(!n||!id(n.id)||parent.has(n.id))throw Error('invalid node');parent.set(n.id,n.id)}
 const root=x=>{while(parent.get(x)!==x)x=parent.get(x);return x};
 for(const e of edges){
  if(!e||!id(e.from)||!id(e.to)||!valid(e.capacity))throw Error('invalid edge');
  if(e.capacity>0&&parent.has(e.from)&&parent.has(e.to)){const a=root(e.from),b=root(e.to);if(a!==b)parent.set(a<b?b:a,a<b?a:b)}
 }
 const groups=new Map();
 for(const n of nodes){const k=root(n.id);if(!groups.has(k))groups.set(k,{id:k,production:0,consumption:0,stores:[]})}
 const seen=new Set(parent.keys()),disconnected=[];
 function add(items,kind){for(const x of items){
  if(!x||!id(x.id)||seen.has(x.id)||!id(x.at))throw Error('invalid or duplicate entity');
  seen.add(x.id);
  const amount=kind==='generator'?x.output:kind==='device'?x.demand:null;
  if(kind!=='store'&&!valid(amount))throw Error('invalid energy');
  if(!parent.has(x.at)){disconnected.push(x.id);continue}
  const g=groups.get(root(x.at));
  if(kind==='generator'){g.production+=amount;if(!Number.isSafeInteger(g.production))throw Error('energy overflow')}
  else if(kind==='device'){g.consumption+=amount;if(!Number.isSafeInteger(g.consumption))throw Error('energy overflow')}
  else g.stores.push({...x});
 }}
 add(generators,'generator');add(devices,'device');add(stores,'store');
 const cmp=(a,b)=>a.id<b.id?-1:a.id>b.id?1:0;
 return {contract:TOPOLOGY_ISLANDS_CONTRACT,islands:[...groups.values()].map(g=>({...g,stores:g.stores.sort(cmp)})).sort(cmp),disconnected:disconnected.sort()};
}
