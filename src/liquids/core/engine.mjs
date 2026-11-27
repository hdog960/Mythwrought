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
    if(!r||r.a===r.b||!defs.has(r.a)||!defs.has(r.b)||typeof r.propose!=="function"||rules.has(pair(r.a,r.b)))throw new TypeError("Invalid or duplicate reaction rule");
    rules.set(pair(r.a,r.b),Object.freeze({a:r.a,b:r.b,propose:r.propose}));
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
  return Object.freeze({insert,extract,getCell,wake,tick,samplePoint,proposeReaction,save});
}
