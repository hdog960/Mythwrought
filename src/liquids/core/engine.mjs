// MYTHWROUGHT isolated liquid contract v1; no production runtime activation.
export const LIQUID_IDS=Object.freeze(["water","lava","acid","amber-sap","liquid-resonance"]);
export const CELL_CAPACITY=8;
export const LIQUID_CONTRACT_VERSION=1;
export function createLiquidEngine({isLoaded,isOpen,definitions=[],reactionRules=[],maxCells=8192,maxVisits=256,snapshot=null}={}){
  const integer=(v,min,max)=>Number.isSafeInteger(v)&&v>=min&&v<=max;
  if(typeof isLoaded!=="function"||typeof isOpen!=="function")throw new TypeError("Explicit loaded and passable cell callbacks required");
  if(!integer(maxCells,1,1000000)||!integer(maxVisits,1,4096))throw new RangeError("Invalid liquid budget");
  const valid=(x,y,z)=>Number.isSafeInteger(x)&&Number.isSafeInteger(z)&&integer(y,-210,256);
  const requirePoint=(x,y,z)=>{if(!valid(x,y,z))throw new RangeError("Outside physical cell envelope");};
  const key=(x,y,z)=>`${x},${y},${z}`;
  const offsets=[[0,-1,0],[1,0,0],[0,0,1],[-1,0,0],[0,0,-1],[0,1,0]];
  const defs=new Map(),rules=new Map(),cells=new Map(),pending=new Map();
  for(const d of definitions){
    if(!d||!LIQUID_IDS.includes(d.id)||defs.has(d.id)||!integer(d.gravityLimit,0,CELL_CAPACITY)||!integer(d.lateralLimit,0,CELL_CAPACITY))throw new TypeError("Invalid or duplicate liquid definition");
    defs.set(d.id,Object.freeze({id:d.id,gravityLimit:d.gravityLimit,lateralLimit:d.lateralLimit}));
  }
  const pair=(a,b)=>[a,b].sort().join("|");
  for(const r of reactionRules){
    if(!r||r.a===r.b||!defs.has(r.a)||!defs.has(r.b)||typeof r.propose!=="function"||(r.settle!==undefined&&typeof r.settle!=="function")||rules.has(pair(r.a,r.b)))throw new TypeError("Invalid or duplicate reaction rule");
    rules.set(pair(r.a,r.b),Object.freeze({a:r.a,b:r.b,propose:r.propose,settle:r.settle}));
  }
  const open=(x,y,z)=>valid(x,y,z)&&isLoaded(x,y,z)===true&&isOpen(x,y,z)===true;
  const MAX_QUANTITY=2**40;
  function quantities(q={}){
    if(!q||typeof q!=="object"||Array.isArray(q))throw new TypeError("Invalid extensive quantities");
    const entries=Object.entries(q).sort(([a],[b])=>a<b?-1:a>b?1:0);
    if(entries.length>8||entries.some(([k,v])=>!/^[a-z][a-z0-9-]{0,31}$/.test(k)||!integer(v,0,MAX_QUANTITY)))throw new RangeError("Invalid extensive quantity");
    return Object.freeze(Object.fromEntries(entries.filter(([,v])=>v!==0)));
  }
  function record(x,y,z,id,units,q={}){
    requirePoint(x,y,z);
    if(!defs.has(id)||!integer(units,1,CELL_CAPACITY))throw new RangeError("Unknown liquid or invalid volume");
    return Object.freeze({x,y,z,id,units,quantities:quantities(q)});
  }
  function split(c,n){
    const taken={},left={};
    for(const [k,v] of Object.entries(c.quantities)){
      taken[k]=Math.floor(v*n/c.units);
      left[k]=v-taken[k];
    }
    return [taken,left];
  }
  function combine(a,b){
    const q=Object.fromEntries(Object.entries(a));
    for(const [k,v] of Object.entries(b))q[k]=(Object.hasOwn(q,k)?q[k]:0)+v;
    try{return quantities(q);}catch{return null;}
  }
  let dirty=null;
  function enqueue(x,y,z){
    if(!valid(x,y,z))return;
    const k=key(x,y,z);
    if(cells.has(k)&&!pending.has(k))pending.set(k,[x,y,z]);
  }
  function wake(x,y,z){
    requirePoint(x,y,z);
    enqueue(x,y,z);
    for(const [dx,dy,dz] of offsets)enqueue(x+dx,y+dy,z+dz);
  }
  function write(x,y,z,c){
    const k=key(x,y,z);
    if(c)cells.set(k,c);
    else {cells.delete(k);pending.delete(k);}
    if(dirty)dirty.set(k,[x,y,z]);
    wake(x,y,z);
  }
  function getCell(x,y,z){
    return valid(x,y,z)?cells.get(key(x,y,z))??null:null;
  }
  function insert(x,y,z,id,units,q={}){
    const incoming=record(x,y,z,id,units,q);
    const c=getCell(x,y,z);
    if(!open(x,y,z)||c&&c.id!==id||c&&c.units+units>CELL_CAPACITY||!c&&cells.size>=maxCells)return false;
    const merged=combine(c?.quantities??{},incoming.quantities);
    if(!merged)return false;
    write(x,y,z,record(x,y,z,id,(c?.units??0)+units,merged));
    return true;
  }
  function extract(x,y,z,units){
    requirePoint(x,y,z);
    if(!integer(units,1,CELL_CAPACITY))throw new RangeError("Invalid extraction");
    const c=getCell(x,y,z);
    if(!c||isLoaded(x,y,z)!==true)return null;
    const n=Math.min(units,c.units),[taken,left]=split(c,n);
    write(x,y,z,n===c.units?null:record(x,y,z,c.id,c.units-n,left));
    return record(x,y,z,c.id,n,taken);
  }
  function transfer(x,y,z,nx,ny,nz,limit,lateral){
    const c=getCell(x,y,z),d=getCell(nx,ny,nz);
    if(!c||!limit||!open(nx,ny,nz)||d&&d.id!==c.id)return 0;
    const du=d?.units??0;
    const n=Math.min(c.units,CELL_CAPACITY-du,limit,lateral?Math.floor((c.units-du)/2):CELL_CAPACITY);
    if(n<=0||!d&&cells.size>=maxCells&&n!==c.units)return 0;
    const [taken,left]=split(c,n),merged=combine(d?.quantities??{},taken);
    if(!merged)return 0;
    const nextOrigin=n===c.units?null:record(x,y,z,c.id,c.units-n,left);
    const nextDest=record(nx,ny,nz,c.id,du+n,merged);
    write(x,y,z,nextOrigin);
    write(nx,ny,nz,nextDest);
    return n;
  }
  // One-cell, liquid-only displacement. Plans are transient capabilities.
  // Host owns the terrain transaction and must hold its edit/streaming lease.
  const displacementPlans=new WeakSet();
  function planDisplacement(x,y,z){
    requirePoint(x,y,z);
    if(dirty)throw new Error("Displacement during tick");
    if(!open(x,y,z))return null;
    const origin=getCell(x,y,z);
    if(!origin)return null;
    let remaining=origin,slots=maxCells-cells.size+1;
    const moves=[];
    // Prefer occupied compatible cells when the resident cap is tight.
    // No traversal beyond face neighbors or implicit liquid sinks.
    const candidates=[];
    for(const [dx,dy,dz] of offsets){
      const nx=x+dx,ny=y+dy,nz=z+dz;
      if(!open(nx,ny,nz))continue;
      const before=getCell(nx,ny,nz);
      if(before&&before.id!==origin.id)continue;
      candidates.push({nx,ny,nz,before});
    }
    if(slots<candidates.filter(c=>!c.before).length){
      candidates.sort((a,b)=>Number(!a.before)-Number(!b.before));
    }
    for(const {nx,ny,nz,before} of candidates){
      if(!remaining)break;
      if(!before&&slots===0)continue;
      let n=Math.min(remaining.units,CELL_CAPACITY-(before?.units??0));
      for(;n>0;n--){
        const [taken,left]=split(remaining,n),merged=combine(before?.quantities??{},taken);
        if(!merged)continue;
        const after=record(nx,ny,nz,origin.id,(before?.units??0)+n,merged);
        moves.push(Object.freeze({before,after,units:n}));
        if(!before)slots--;
        remaining=n===remaining.units?null:record(x,y,z,origin.id,remaining.units-n,left);
        break;
      }
    }
    // Conservative rejection is valid even if a more expensive search could fit.
    if(remaining)return null;
    const plan=Object.freeze({origin,moves:Object.freeze(moves)});
    displacementPlans.add(plan);
    return plan;
  }
  function commitDisplacement(plan){
    if(dirty)throw new Error("Displacement during tick");
    if(!displacementPlans.has(plan))return null;
    displacementPlans.delete(plan);
    const {origin,moves}=plan;
    if(!open(origin.x,origin.y,origin.z))return null;
    for(const {after} of moves)if(!open(after.x,after.y,after.z))return null;
    if(getCell(origin.x,origin.y,origin.z)!==origin)return null;
    let net=-1;
    for(const {before,after} of moves){
      if(getCell(after.x,after.y,after.z)!==before)return null;
      if(!before)net++;
    }
    if(cells.size+net>maxCells)return null;
    // All validation and allocation of cell records precede writes. No host
    // callbacks in this phase. Source removal releases its resident slot.
    const changed=Object.freeze([origin,...moves.map(m=>m.after)].map(c=>Object.freeze([c.x,c.y,c.z])));
    const result=Object.freeze({moved:origin.units,changed});
    write(origin.x,origin.y,origin.z,null);
    for(const {after} of moves)write(after.x,after.y,after.z,after);
    return result;
  }
  function tick(limit=maxVisits){
    if(!integer(limit,1,maxVisits))throw new RangeError("Tick exceeds configured visit budget");
    if(dirty)throw new Error("Reentrant tick");
    dirty=new Map();
    let visited=0,moved=0;
    const budget=Math.min(limit,pending.size);
    try{
      while(visited<budget&&pending.size){
        const [k,[x,y,z]]=pending.entries().next().value;
        pending.delete(k);visited++;
        let c=getCell(x,y,z);
        if(!c||!open(x,y,z))continue;
        const d=defs.get(c.id);
        moved+=transfer(x,y,z,x,y-1,z,d.gravityLimit,false);
        c=getCell(x,y,z);
        if(!c)continue;
        const below=getCell(x,y-1,z);
        if(d.gravityLimit>0&&open(x,y-1,z)&&(!below||below.id===c.id&&below.units<CELL_CAPACITY))continue;
        let lateralRemaining=d.lateralLimit;
        for(const [dx,,dz] of offsets.slice(1,5)){
          if(!lateralRemaining||!getCell(x,y,z))break;
          const n=transfer(x,y,z,x+dx,y,z+dz,lateralRemaining,true);
          lateralRemaining-=n;moved+=n;
        }
      }
      return Object.freeze({visited,moved,changed:Object.freeze([...dirty.values()].map(p=>Object.freeze(p))),pending:pending.size});
    }finally{dirty=null;}
  }
  function samplePoint(x,y,z){
    if(![x,y,z].every(Number.isFinite))return null;
    const bx=Math.floor(x),by=Math.floor(y),bz=Math.floor(z);
    if(!open(bx,by,bz))return null;
    const c=getCell(bx,by,bz);
    if(!c||y-by>=c.units/CELL_CAPACITY)return null;
    return Object.freeze({cell:c,fill:c.units/CELL_CAPACITY,surfaceY:by+c.units/CELL_CAPACITY});
  }
  function proposeReaction(ax,ay,az,bx,by,bz){
    if(Math.abs(ax-bx)+Math.abs(ay-by)+Math.abs(az-bz)!==1||!open(ax,ay,az)||!open(bx,by,bz))return null;
    let a=getCell(ax,ay,az),b=getCell(bx,by,bz);
    if(!a||!b||a.id===b.id)return null;
    const rule=rules.get(pair(a.id,b.id));
    if(!rule)return null;
    if(a.id!==rule.a)[a,b]=[b,a];
    const proposal=rule.propose(a,b);
    if(proposal===null)return null;
    if(!proposal||!integer(proposal.consumeA,0,a.units)||!integer(proposal.consumeB,0,b.units)||proposal.consumeA+proposal.consumeB===0||typeof proposal.product!=="string"||!/^[a-z][a-z0-9-]{0,63}$/.test(proposal.product))throw new RangeError("Invalid reaction proposal");
    return Object.freeze({a,b,consumeA:proposal.consumeA,consumeB:proposal.consumeB,product:proposal.product});
  }
  // Explicit owner routing; a proposal token alone never authorizes consumption.
  // Every removed unit and extensive quantity reaches the other cell or a receipt.
  const reactionPlans=new WeakSet();
  function buildReaction(ax,ay,az,bx,by,bz){
    const proposal=proposeReaction(ax,ay,az,bx,by,bz);
    if(!proposal)return null;
    const {a,b,consumeA,consumeB,product}=proposal;
    const rule=rules.get(pair(a.id,b.id));
    if(!rule.settle)return null;
    const routing=rule.settle(proposal);
    if(routing===null)return null;
    const routeA=routing?.routeA,routeB=routing?.routeB;
    if(!(consumeA?routeA==='b'||routeA==='product':routeA===null)||
       !(consumeB?routeB==='a'||routeB==='product':routeB===null))throw new RangeError("Invalid reaction routing");
    function partition(c,n){
      if(!n)return [null,c];
      const [taken,left]=split(c,n);
      return [record(c.x,c.y,c.z,c.id,n,taken),n===c.units?null:record(c.x,c.y,c.z,c.id,c.units-n,left)];
    }
    const [takenA,leftA]=partition(a,consumeA),[takenB,leftB]=partition(b,consumeB);
    function receive(original,left,incoming){
      if(!incoming)return left;
      const units=(left?.units??0)+incoming.units;
      if(units>CELL_CAPACITY)return false;
      const q=combine(left?.quantities??{},incoming.quantities);
      return q?record(original.x,original.y,original.z,original.id,units,q):false;
    }
    const afterA=receive(a,leftA,routeB==='a'?takenB:null);
    const afterB=receive(b,leftB,routeA==='b'?takenA:null);
    if(afterA===false||afterB===false)return null;
    const productInputs=Object.freeze([routeA==='product'?takenA:null,routeB==='product'?takenB:null].filter(Boolean));
    if(getCell(a.x,a.y,a.z)!==a||getCell(b.x,b.y,b.z)!==b)return null;
    return Object.freeze({proposal,routeA,routeB,takenA,takenB,afterA,afterB,product,productInputs});
  }
  function planReaction(...points){
    if(dirty)throw new Error("Reaction during tick");
    const plan=buildReaction(...points);
    if(plan)reactionPlans.add(plan);
    return plan;
  }
  function commitReaction(plan){
    if(dirty)throw new Error("Reaction during tick");
    if(!reactionPlans.has(plan))return null;
    reactionPlans.delete(plan);
    const {a,b,consumeA,consumeB,product}=plan.proposal;
    if(getCell(a.x,a.y,a.z)!==a||getCell(b.x,b.y,b.z)!==b)return null;
    // Re-run the pure owner policy and current host readiness before writing.
    const fresh=buildReaction(a.x,a.y,a.z,b.x,b.y,b.z);
    if(!fresh||fresh.proposal.a!==a||fresh.proposal.b!==b||
       fresh.proposal.consumeA!==consumeA||fresh.proposal.consumeB!==consumeB||
       fresh.product!==product||fresh.routeA!==plan.routeA||fresh.routeB!==plan.routeB)return null;
    const changes=[[a,fresh.afterA],[b,fresh.afterB]].filter(([before,after])=>before!==after);
    const changed=Object.freeze(changes.map(([c])=>Object.freeze([c.x,c.y,c.z])));
    const receipt=Object.freeze({product,productInputs:fresh.productInputs,changed});
    // At most two existing cells; no host callbacks or external writes here.
    for(const [c,after] of changes)write(c.x,c.y,c.z,after);
    return receipt;
  }
  function save(){
    return {version:LIQUID_CONTRACT_VERSION,cells:[...cells.values()],pending:[...pending.values()].map(p=>[...p])};
  }
  if(snapshot!==null){
    if(!snapshot||snapshot.version!==LIQUID_CONTRACT_VERSION||!Array.isArray(snapshot.cells)||!Array.isArray(snapshot.pending)||snapshot.cells.length>maxCells||snapshot.pending.length>snapshot.cells.length)throw new TypeError("Invalid liquid snapshot");
    for(const c of snapshot.cells){
      if(!c||typeof c!=="object")throw new TypeError("Invalid cell snapshot");
      const row=record(c.x,c.y,c.z,c.id,c.units,c.quantities),k=key(c.x,c.y,c.z);
      if(cells.has(k))throw new TypeError("Duplicate liquid cell");
      cells.set(k,row);
    }
    for(const p of snapshot.pending){
      if(!Array.isArray(p)||p.length!==3||!valid(...p))throw new TypeError("Invalid pending cell");
      const k=key(...p);
      if(!cells.has(k)||pending.has(k))throw new TypeError("Invalid pending queue");
      pending.set(k,[...p]);
    }
  }
  return Object.freeze({insert,extract,getCell,wake,tick,samplePoint,proposeReaction,planDisplacement,commitDisplacement,planReaction,commitReaction,save});
}
