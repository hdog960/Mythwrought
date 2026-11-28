// Acid A only: bounded contact ledger and read-only corrosion proposals.
import {readAcidStrength} from './definition.mjs';
const int=(v,lo,hi)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi;
const point=(x,y,z)=>Number.isSafeInteger(x)&&int(y,-210,256)&&Number.isSafeInteger(z);
const token=v=>typeof v==='string'&&/^[a-zA-Z0-9:_-]{1,96}$/.test(v);
const key=p=>p.join(',');
const offsets=[[0,1,0],[1,0,0],[0,0,1],[-1,0,0],[0,0,-1],[0,-1,0]];

export function createAcidCorrosion({engine,isLoaded,isOpen,readMaterial,canDamage,
  enabled=false,policyId='disabled',rules=[],maxTracked=1024,maxVisits=32,snapshot=null}={}){
  if(typeof engine?.getCell!=='function'||[isLoaded,isOpen,readMaterial,canDamage].some(f=>typeof f!=='function'))
    throw new TypeError('Explicit corrosion host callbacks required');
  if(typeof enabled!=='boolean'||!token(policyId)||!int(maxTracked,1,16384)||!int(maxVisits,1,256)||!Array.isArray(rules)||rules.length>64)
    throw new RangeError('Invalid corrosion policy or budget');
  const allowed=new Map();
  for(const r of rules){
    if(!r||!token(r.material)||allowed.has(r.material)||!int(r.minStrength,1,1000)||!int(r.threshold,1,1000000))
      throw new TypeError('Invalid corrosion allowlist rule');
    allowed.set(r.material,Object.freeze({material:r.material,minStrength:r.minStrength,threshold:r.threshold}));
  }
  const signature=JSON.stringify({enabled,policyId,maxTracked,maxVisits,rules:[...allowed.values()]});
  const queue=new Map();let busy=false;
  const idle=()=>{if(busy)throw new Error('Reentrant corrosion operation');};
  const blank=p=>({p,material:null,revision:null,progress:0});
  function track(x,y,z){
    idle();if(!point(x,y,z))throw new RangeError('Outside physical cell envelope');
    const p=[x,y,z],k=key(p);
    if(!enabled)return false;
    if(queue.has(k))return true;
    if(queue.size>=maxTracked)return false;
    queue.set(k,blank(p));return true;
  }
  if(snapshot!==null){
    if(snapshot?.version!==1||snapshot.signature!==signature||!Array.isArray(snapshot.entries)||snapshot.entries.length>maxTracked||!enabled&&snapshot.entries.length)
      throw new TypeError('Invalid corrosion snapshot or changed policy');
    for(const e of snapshot.entries){
      if(!e||!Array.isArray(e.p)||e.p.length!==3||!point(...e.p)||queue.has(key(e.p))||
        !int(e.progress,0,1000000)|| (e.progress===0?(e.material!==null||e.revision!==null):
        !allowed.has(e.material)||!token(e.revision)||e.progress>allowed.get(e.material).threshold))
        throw new TypeError('Invalid corrosion entry');
      queue.set(key(e.p),{p:[...e.p],material:e.material,revision:e.revision,progress:e.progress});
    }
  }
  function save(){idle();return {version:1,signature,entries:[...queue.values()].map(e=>({...e,p:[...e.p]}))};}
  function observe(p){
    if(isLoaded(...p)!==true)return {defer:true};
    if(isOpen(...p)!==false)return null;
    const m=readMaterial(...p),rule=allowed.get(m?.id);
    if(!rule||!token(m.revision)||m.protected!==false||canDamage(...p,m)!==true)return null;
    let peak=0;const contacts=[];
    for(const [dx,dy,dz] of offsets){
      const n=[p[0]+dx,p[1]+dy,p[2]+dz];
      if(!point(...n)||isLoaded(...n)!==true||isOpen(...n)!==true)continue;
      const c=engine.getCell(...n),s=readAcidStrength(c);
      if(s===null||s<rule.minStrength||c.x!==n[0]||c.y!==n[1]||c.z!==n[2]||dy===-1&&c.units!==8)continue;
      contacts.push(c);peak=Math.max(peak,s);
    }
    if(!contacts.length)return null;
    return {material:m.id,revision:m.revision,rule,peak,contacts};
  }
  // Explicit host dirty handoff, never a world scan. Refresh eligibility at
  // each committed change boundary, but accumulate only inside step().
  function trackChanges(changed,{maxChanged=256}={}){
    idle();
    if(!int(maxChanged,1,4096)||!Array.isArray(changed)||changed.length>maxChanged)
      throw new RangeError('Corrosion dirty input budget');
    const candidates=new Map();
    for(const p of changed){
      if(!Array.isArray(p)||p.length!==3||!point(...p))throw new TypeError('Invalid corrosion dirty point');
      if(!enabled)continue;
      for(const [dx,dy,dz] of [[0,0,0],...offsets]){
        const n=[p[0]+dx,p[1]+dy,p[2]+dz];
        if(point(...n)&&!candidates.has(key(n)))candidates.set(key(n),n);
      }
    }
    const updates=[];let admitted=0,retired=0,reset=0;
    busy=true;
    try{
      for(const [k,p] of candidates){
        const prior=queue.get(k),o=observe(p);
        if(o?.defer)continue; // retain existing unloaded entries, do not admit new ones
        if(!o){if(prior){updates.push([k,null]);retired++;}continue;}
        if(!prior){updates.push([k,blank(p)]);admitted++;}
        else if(prior.progress>0&&(prior.material!==o.material||prior.revision!==o.revision)){
          updates.push([k,blank(p)]);reset++;
        }
      }
      // Net cap permits retiring dry entries and admitting new ones together.
      // A rejected/throwing batch changes neither entries nor FIFO order.
      if(queue.size+admitted-retired>maxTracked)return null;
      for(const [k,e] of updates)if(!e)queue.delete(k);
      for(const [k,e] of updates)if(e)queue.set(k,e); // existing keys retain position
      return Object.freeze({candidates:candidates.size,admitted,retired,reset,pending:queue.size});
    }finally{busy=false;}
  }
  function step(limit=maxVisits){
    idle();if(!int(limit,1,maxVisits))throw new RangeError('Corrosion visit budget');
    const changes=[],proposals=[];let visited=0,deferred=0,retired=0;
    busy=true;
    try{
      // Stage bounded updates. A throwing callback leaves the entire ledger unchanged.
      for(const [k,e] of queue){
        if(visited===limit)break;visited++;
        const o=observe(e.p);
        if(o?.defer){deferred++;changes.push([k,e]);continue;}
        if(!o){retired++;changes.push([k,null]);continue;}
        const prior=e.material===o.material&&e.revision===o.revision?e.progress:0;
        const progress=Math.min(o.rule.threshold,prior+o.peak);
        changes.push([k,{p:e.p,material:o.material,revision:o.revision,progress}]);
        if(progress===o.rule.threshold)proposals.push(Object.freeze({
          target:Object.freeze([...e.p]),material:o.material,revision:o.revision,progress,
          peakStrength:o.peak,expectedAcid:Object.freeze([...o.contacts]),product:'corrosion-proposal'}));
      }
      for(const [k,e] of changes){queue.delete(k);if(e)queue.set(k,e);}
      return Object.freeze({visited,deferred,retired,pending:queue.size,proposals:Object.freeze(proposals)});
    }finally{busy=false;}
  }
  return Object.freeze({track,trackChanges,step,save});
}
