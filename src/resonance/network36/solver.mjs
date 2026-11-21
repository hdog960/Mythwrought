// Isolated Resonance network candidate v0.1. No production imports, persistence or mutations.
// Proposed generator handshake until :24 publishes resonance-power-v1 exact source SHA.
export const CONTRACT = Object.freeze({ name: 'resonance-network36-proposal-v1', unit: 'resonance/tick', production: false });
const idSort = (a,b) => String(a).localeCompare(String(b),'en');
const nonneg = (v,name) => { if(!Number.isSafeInteger(v)||v<0) throw Error('invalid '+name); return v; };
const key = p => p.x+','+p.y+','+p.z;
const distance = (a,b) => Math.abs(a.x-b.x)+Math.abs(a.y-b.y)+Math.abs(a.z-b.z);
const adjacent = (a,b) => distance(a,b)===1;
const safeAdd=(a,b,label)=>{const sum=a+b;if(!Number.isSafeInteger(sum))throw Error(label+' overflow');return sum;};
export function solveResonance({nodes=[], generators=[], devices=[], stores=[], tick=0}={}) {
  nonneg(tick,'tick');
  // Cap all candidate work, not just conductors: consumers otherwise make each tick unbounded.
  for (const [name,items] of [['nodes',nodes],['generators',generators],['devices',devices],['stores',stores]]) {
    if (!Array.isArray(items) || items.length > 2048) throw Error((name==='nodes'?'conductor':name)+' budget exceeded');
  }
  const all=[...nodes,...generators,...devices,...stores];
  const ids=new Set(), positions=new Set();
  for(const n of all) {
    if(typeof n.id!=='string'||!n.id||ids.has(n.id)) throw Error('duplicate/invalid id');
    ids.add(n.id);
    if(!n.anchor||!['x','y','z'].every(k=>Number.isSafeInteger(n.anchor[k]) && Math.abs(n.anchor[k])<=1000000)) throw Error('anchor bounds');
    if(n.kind==='channel'||n.kind==='wireless') {
      if(positions.has(key(n.anchor))) throw Error('duplicate conductor anchor');
      positions.add(key(n.anchor));
    }
  }
  for(const n of nodes) {
    if(!['channel','wireless'].includes(n.kind)) throw Error('conductor kind');
    if(n.kind==='wireless') { nonneg(n.radius,'radius'); if(n.radius>8) throw Error('wireless radius budget exceeded'); }
  }
  for(const g of generators) nonneg(g.output,'output');
  for(const d of devices) { nonneg(d.demand,'demand'); nonneg(d.priority??100,'priority'); }
  for(const s of stores) {
    for(const field of ['capacity','charge','maxInput','maxOutput']) nonneg(s[field],field);
    if(s.charge>s.capacity) throw Error('overfilled store');
  }
  // N1 bounded spatial graph: one conductor per integer anchor, radius capped for mobile work.
  if(nodes.length>2048) throw Error('conductor budget exceeded');
  const conductors=[...nodes].sort((a,b)=>idSort(a.id,b.id));
  const byAnchor=new Map(conductors.map(n=>[key(n.anchor),n]));
  const wireless=conductors.filter(n=>n.kind==='wireless');
  const nearby=(anchor,radius)=>{
    const found=[];
    for(let x=-radius;x<=radius;x++)for(let y=-radius;y<=radius;y++)for(let z=-radius;z<=radius;z++){
      if(Math.abs(x)+Math.abs(y)+Math.abs(z)>radius)continue;
      const n=byAnchor.get(key({x:anchor.x+x,y:anchor.y+y,z:anchor.z+z}));
      if(n)found.push(n);
    }
    return found;
  };
  const parent=new Map(conductors.map(n=>[n.id,n.id]));
  const root=id=>{ while(parent.get(id)!==id) id=parent.get(id); return id; };
  const join=(a,b)=>{let x=root(a),y=root(b);if(x!==y) parent.set(idSort(x,y)<0?y:x,idSort(x,y)<0?x:y);};
  // Each channel checks six neighbors; each radio checks a bounded Manhattan sphere.
  // No all-pairs conductor scan, no persistent links or chunk mutations.
  for(const a of conductors){
    for(const b of nearby(a.anchor,1)) if(a.id!==b.id)join(a.id,b.id);
    if(a.kind==='wireless')for(const b of nearby(a.anchor,a.radius))
      if(a.id!==b.id)join(a.id,b.id);
  }
  const groups=new Map();
  for(const n of conductors){const r=root(n.id);if(!groups.has(r))groups.set(r,[]);groups.get(r).push(n);}
  const networks=[];
  const connected=n=> {
    const candidates=new Map(nearby(n.anchor,1).map(c=>[c.id,c]));
    for(const radio of wireless)if(distance(radio.anchor,n.anchor)<=radio.radius)
      candidates.set(radio.id,radio);
    const roots=[...new Set([...candidates.values()].map(c=>root(c.id)))];
    if(roots.length>1) throw Error('ambiguous multi-network attachment: '+n.id);
    return roots.length?roots[0]:null;
  };
  const allocations=new Map();
  for(const n of [...generators,...devices,...stores]) {
    const r=connected(n);
    if(r!==null){if(!allocations.has(r))allocations.set(r,{generators:[],devices:[],stores:[]});
      allocations.get(r)[generators.includes(n)?'generators':devices.includes(n)?'devices':'stores'].push(n);}
  }
  const nextCharges={}, deviceStates={}, summaries=[];
  for(const [r,conductorGroup] of [...groups].sort((a,b)=>idSort(a[0],b[0]))) {
    const {generators:gs=[],devices:ds=[],stores:ss=[]}=allocations.get(r)||{};
    const supply=gs.reduce((n,g)=>n+g.output,0);
    if(!Number.isSafeInteger(supply))throw Error('supply overflow');
    let available=supply;
    const ordered=[...ds].sort((a,b)=>(a.priority??100)-(b.priority??100)||idSort(a.id,b.id));
    const potentialDischarge=ss.reduce((n,s)=>safeAdd(n,Math.min(s.charge,s.maxOutput),'reserve'),0);
    let remainingReserve=potentialDischarge;
    const active=[];
    for(const d of ordered){
      if(d.demand<=safeAdd(available,remainingReserve,'available energy')){
        let deficit=Math.max(0,d.demand-available);available=Math.max(0,available-d.demand);
        for(const s of [...ss].sort((a,b)=>idSort(a.id,b.id))){
          const used=(nextCharges[s.id]===undefined?s.charge:nextCharges[s.id]);
          const take=Math.min(deficit,used,s.maxOutput-(s.charge-used));
          nextCharges[s.id]=used-take;deficit-=take;remainingReserve-=take;
          if(deficit===0)break;
        }
        if(deficit!==0)throw Error('accounting invariant');
        active.push(d.id);deviceStates[d.id]='active';
      }else deviceStates[d.id]='shortage';
    }
    for(const s of [...ss].sort((a,b)=>idSort(a.id,b.id))){
      const charge=nextCharges[s.id]??s.charge;
      const gain=Math.min(available,s.maxInput,s.capacity-charge);
      nextCharges[s.id]=charge+gain;available-=gain;
    }
    summaries.push({id:r,conductors:conductorGroup.map(n=>n.id),production:supply,use:ordered.filter(d=>deviceStates[d.id]==='active').reduce((n,d)=>safeAdd(n,d.demand,'use'),0),curtailed:ordered.filter(d=>deviceStates[d.id]==='shortage').map(d=>d.id),surplus:available,stored:ss.reduce((n,s)=>safeAdd(n,nextCharges[s.id],'stored'),0)});
  }
  for(const s of stores)if(nextCharges[s.id]===undefined)nextCharges[s.id]=s.charge;
  for(const d of devices)if(deviceStates[d.id]===undefined)deviceStates[d.id]='disconnected';
  return {contract:CONTRACT.name,tick,networks:summaries,deviceStates,nextCharges,pulses:summaries.filter(n=>n.production>0).map(n=>({networkId:n.id,intensity:n.production,kind:'candidate-channel-pulse'}))};
}
