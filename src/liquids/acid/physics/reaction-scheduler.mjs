// Acid A only: bounded discovery of acid-water reaction candidates.
// No engine or terrain mutation; host owns atomic adoption and dirty delivery.
const int=(v,lo,hi)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi;
const point=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&int(p[1],-210,256)&&Number.isSafeInteger(p[2]);
const key=p=>p.join(',');
const offsets=[[0,-1,0],[1,0,0],[0,0,1],[-1,0,0],[0,0,-1],[0,1,0]];
const adjacent=(a,b)=>a.reduce((n,v,i)=>n+Math.abs(v-b[i]),0)===1;
const pair=(a,b)=>key(a)<key(b)?[a,b]:[b,a];
const pairKey=([a,b])=>key(a)+'|'+key(b);
const at=(c,p)=>c&&c.x===p[0]&&c.y===p[1]&&c.z===p[2];
export function createAcidReactionScheduler({engine,isLoaded,isOpen,enabled=false,
  policyId='disabled',maxPairs=1024,maxVisits=32,maxChanged=256,snapshot=null}={}){
  if(typeof engine?.getCell!=='function'||typeof engine?.planReaction!=='function'||
    typeof isLoaded!=='function'||typeof isOpen!=='function')throw new TypeError('Explicit reaction host required');
  if(typeof enabled!=='boolean'||typeof policyId!=='string'||!/^[a-zA-Z0-9:_-]{1,96}$/.test(policyId)||
    !int(maxPairs,1,16384)||!int(maxVisits,1,256)||!int(maxChanged,1,4096))throw new RangeError('Invalid reaction policy or budget');
  const signature=JSON.stringify({enabled,policyId,maxPairs,maxVisits,maxChanged});
  const queue=new Map();let busy=false;
  const idle=()=>{if(busy)throw Error('Reentrant acid reaction scheduler');};
  const ready=p=>isLoaded(...p)===true;
  // undefined = unavailable; null = no acid/water contact; otherwise oriented pair.
  function observe([a,b]){
    if(!ready(a)||!ready(b))return undefined;
    if(isOpen(...a)!==true||isOpen(...b)!==true)return null;
    const ca=engine.getCell(...a),cb=engine.getCell(...b);
    if(!at(ca,a)||!at(cb,b))return null;
    if(ca.id==='acid'&&cb.id==='water')return [ca,cb];
    if(cb.id==='acid'&&ca.id==='water')return [cb,ca];
    return null;
  }
  if(snapshot!==null){
    if(snapshot?.version!==1||snapshot.signature!==signature||!Array.isArray(snapshot.pairs)||
      snapshot.pairs.length>maxPairs||!enabled&&snapshot.pairs.length)throw TypeError('Invalid reaction snapshot');
    for(const p of snapshot.pairs){
      if(!Array.isArray(p)||p.length!==2||!point(p[0])||!point(p[1])||!adjacent(...p)||
        key(p[0])>=key(p[1])||queue.has(pairKey(p)))throw TypeError('Invalid reaction pair');
      queue.set(pairKey(p),p.map(v=>[...v]));
    }
  }
  function save(){idle();return {version:1,signature,pairs:[...queue.values()].map(p=>p.map(v=>[...v]))};}
  function trackChanges(changed){
    idle();if(!Array.isArray(changed)||changed.length>maxChanged)throw RangeError('Reaction dirty budget');
    const candidates=new Map();
    for(const p of changed){
      if(!point(p))throw TypeError('Invalid reaction dirty point');
      if(!enabled)continue;
      for(const d of offsets){
        const n=p.map((v,i)=>v+d[i]);if(!point(n))continue;
        const q=pair([...p],n),k=pairKey(q);if(!candidates.has(k))candidates.set(k,q);
      }
    }
    let admitted=0,retired=0;const updates=[];
    busy=true;
    try{
      for(const [k,p] of candidates){
        const o=observe(p),prior=queue.has(k);
        if(o===undefined)continue;
        if(o&&!prior){updates.push([k,p]);admitted++;}
        else if(!o&&prior){updates.push([k,null]);retired++;}
      }
      if(queue.size+admitted-retired>maxPairs)return null;
      for(const [k,p] of updates)if(!p)queue.delete(k);
      for(const [k,p] of updates)if(p)queue.set(k,p);
      return Object.freeze({candidates:candidates.size,admitted,retired,pending:queue.size});
    }finally{busy=false;}
  }
  function step(limit=maxVisits){
    idle();if(!int(limit,1,maxVisits))throw RangeError('Reaction visit budget');
    const updates=[],plans=[],used=new Set();let visited=0,deferred=0,retired=0;
    busy=true;
    try{
      for(const [k,p] of queue){
        if(visited===limit)break;visited++;
        const o=observe(p);
        if(o===undefined){deferred++;updates.push([k,p]);continue;}
        if(!o){retired++;updates.push([k,null]);continue;}
        if(p.some(q=>used.has(key(q)))){deferred++;updates.push([k,p]);continue;}
        const [a,b]=o,plan=engine.planReaction(a.x,a.y,a.z,b.x,b.y,b.z);
        if(!plan){retired++;updates.push([k,null]);continue;}
        // Only this owner's pure dilution route is eligible. Fail closed if
        // the configured core rule returns unexpected product or consumption.
        const q=plan.proposal;
        if(q?.a!==a||q?.b!==b||q.consumeA!==0||!int(q.consumeB,1,Math.min(b.units,8-a.units))||
          plan.product!=='acid-dilution'||q.product!==plan.product||plan.routeA!==null||plan.routeB!=='a'||
          !Array.isArray(plan.productInputs)||plan.productInputs.length!==0)throw Error('Unexpected acid reaction routing');
        plans.push(plan);for(const c of p)used.add(key(c));updates.push([k,p,true]);
      }
      // No queue changes until all callbacks and plans have succeeded.
      for(const [k] of updates)queue.delete(k);
      // Unvisited work stays first; conflicting and unavailable work precedes
      // successful plans so a full-queue visit cannot starve a shared face.
      for(const [k,p,planned] of updates)if(p&&!planned)queue.set(k,p);
      for(const [k,p,planned] of updates)if(p&&planned)queue.set(k,p);
      return Object.freeze({visited,deferred,retired,pending:queue.size,plans:Object.freeze(plans)});
    }finally{busy=false;}
  }
  return Object.freeze({trackChanges,step,save});
}
