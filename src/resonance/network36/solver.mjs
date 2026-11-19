// Isolated Resonance network candidate v0.1. No production imports, persistence or mutations.
// Proposed generator handshake until :24 publishes resonance-power-v1 exact source SHA.
export const CONTRACT = Object.freeze({ name: 'resonance-network36-proposal-v1', unit: 'resonance/tick', production: false });
const idSort = (a,b) => String(a).localeCompare(String(b),'en');
const nonneg = (v,name) => { if(!Number.isSafeInteger(v)||v<0) throw Error('invalid '+name); return v; };
const key = p => p.x+','+p.y+','+p.z;
const distance = (a,b) => Math.abs(a.x-b.x)+Math.abs(a.y-b.y)+Math.abs(a.z-b.z);
const adjacent = (a,b) => distance(a,b)===1;
export function solveResonance({nodes=[], generators=[], devices=[], stores=[], tick=0}={}) {
  nonneg(tick,'tick');
  const all=[...nodes,...generators,...devices,...stores];
  const ids=new Set(), positions=new Set();
  for(const n of all) {
    if(typeof n.id!=='string'||!n.id||ids.has(n.id)) throw Error('duplicate/invalid id');
    ids.add(n.id);
    if(!n.anchor||!['x','y','z'].every(k=>Number.isSafeInteger(n.anchor[k]))) throw Error('anchor');
    if(n.kind==='channel'||n.kind==='wireless') {
      if(positions.has(key(n.anchor))) throw Error('duplicate conductor anchor');
      positions.add(key(n.anchor));
    }
  }
  for(const n of nodes) {
    if(!['channel','wireless'].includes(n.kind)) throw Error('conductor kind');
    if(n.kind==='wireless') nonneg(n.radius,'radius');
  }
  for(const g of generators) nonneg(g.output,'output');
  for(const d of devices) { nonneg(d.demand,'demand'); nonneg(d.priority??100,'priority'); }
  for(const s of stores) {
    for(const field of ['capacity','charge','maxInput','maxOutput']) nonneg(s[field],field);
    if(s.charge>s.capacity) throw Error('overfilled store');
  }
  const conductors=[...nodes].sort((a,b)=>idSort(a.id,b.id));
  const parent=new Map(conductors.map(n=>[n.id,n.id]));
  const root=id=>{ while(parent.get(id)!==id) id=parent.get(id); return id; };
  const join=(a,b)=>{let x=root(a),y=root(b);if(x!==y) parent.set(idSort(x,y)<0?y:x,idSort(x,y)<0?x:y);};
  // Wireless auto-links only within bounded radius, to channels or other transmitters.
  for(let i=0;i<conductors.length;i++) for(let j=i+1;j<conductors.length;j++){
    const a=conductors[i],b=conductors[j],d=distance(a.anchor,b.anchor);
    if(adjacent(a.anchor,b.anchor) || (a.kind==='wireless'&&d<=a.radius) || (b.kind==='wireless'&&d<=b.radius)) join(a.id,b.id);
  }
  const groups=new Map();
  for(const n of conductors){const r=root(n.id);if(!groups.has(r))groups.set(r,[]);groups.get(r).push(n);}
  const networks=[];
  const connected=n=> {
    const candidates=conductors.filter(c=>adjacent(c.anchor,n.anchor)||(c.kind==='wireless'&&distance(c.anchor,n.anchor)<=c.radius));
    return candidates.length?root(candidates[0].id):null;
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
    const potentialDischarge=ss.reduce((n,s)=>n+Math.min(s.charge,s.maxOutput),0);
    let remainingReserve=potentialDischarge;
    const active=[];
    for(const d of ordered){
      if(d.demand<=available+remainingReserve){
        let deficit=Math.max(0,d.demand-available);available=Math.max(0,available-d.demand);
        for(const s of [...ss].sort((a,b)=>idSort(a.id,b.id))){
          const already=s._unusedNeverRead; // never mutate source store
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
    summaries.push({id:r,conductors:conductorGroup.map(n=>n.id),production:supply,use:ordered.filter(d=>deviceStates[d.id]==='active').reduce((n,d)=>n+d.demand,0),curtailed:ordered.filter(d=>deviceStates[d.id]==='shortage').map(d=>d.id),surplus:available,stored:ss.reduce((n,s)=>n+nextCharges[s.id],0)});
  }
  for(const s of stores)if(nextCharges[s.id]===undefined)nextCharges[s.id]=s.charge;
  for(const d of devices)if(deviceStates[d.id]===undefined)deviceStates[d.id]='disconnected';
  return {contract:CONTRACT.name,tick,networks:summaries,deviceStates,nextCharges,pulses:summaries.filter(n=>n.production>0).map(n=>({networkId:n.id,intensity:n.production,kind:'candidate-channel-pulse'}))};
}
