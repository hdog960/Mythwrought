// Sparse owner transition staging, not mounted in production. The host must
// atomically adopt the entire returned state under its streaming/edit lease.
import {createLiquidEngine,LIQUID_CONTRACT_VERSION} from './engine.mjs';
import {physicalRegionAt,physicalMeshKey,physicalSectionBounds} from '../../world-height.mjs';

export const LIQUID_OWNER_HANDOFF_VERSION=1;
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const point=c=>[c.x,c.y,c.z];
const pointKey=p=>p.join(',');
const freezeQueue=q=>Object.freeze(q.map(p=>Object.freeze([...p])));
const snapshot=(cells,pending,capacityBlocked=[],lateralPhases=[])=>Object.freeze({version:LIQUID_CONTRACT_VERSION,
  cells:Object.freeze(cells),pending:freezeQueue(pending),
  ...(capacityBlocked.length?{capacityBlocked:freezeQueue(capacityBlocked)}:{}),
  ...(lateralPhases.length?{lateralPhases:freezeQueue(lateralPhases)}:{})});
const validQueues=s=>Array.isArray(s.pending)&&
  (!Object.hasOwn(s,'capacityBlocked')||Array.isArray(s.capacityBlocked))&&
  s.pending.length+(s.capacityBlocked?.length??0)<=s.cells.length&&
  (!Object.hasOwn(s,'lateralPhases')||Array.isArray(s.lateralPhases)&&s.lateralPhases.length<=s.cells.length);
function ownerDescriptor(owner){
  if(!owner||!Number.isSafeInteger(owner.cx)||!Number.isSafeInteger(owner.cz))
    throw new TypeError('Invalid liquid owner');
  const {cx,cz,kind,section}=owner;
  const {minY,maxY}=physicalSectionBounds({kind,section});
  const key=physicalMeshKey(cx,cz,{kind,section});
  const minX=cx*16,maxX=minX+15,minZ=cz*16,maxZ=minZ+15;
  if(owner.key!==key||![minX,maxX,minZ,maxZ].every(Number.isSafeInteger))
    throw new TypeError('Noncanonical liquid owner');
  return {owner:Object.freeze({cx,cz,kind,section,key}),minX,maxX,minY,maxY,minZ,maxZ,
    capacity:256*(maxY-minY+1)};
}
const belongs=(c,b)=>physicalRegionAt(c.x,c.y,c.z)?.key===b.owner.key;
const between=(n,lo,hi)=>n>=lo&&n<=hi;
function faces(c,b){
  const {x,y,z}=c,{minX,maxX,minY,maxY,minZ,maxZ}=b;
  return ((x===minX-1||x===maxX+1)&&between(y,minY,maxY)&&between(z,minZ,maxZ))||
    ((y===minY-1||y===maxY+1)&&between(x,minX,maxX)&&between(z,minZ,maxZ))||
    ((z===minZ-1||z===maxZ+1)&&between(x,minX,maxX)&&between(y,minY,maxY));
}

// Inputs are a complete resident snapshot plus exclusive dormant owner shards.
// Never create a second flow solver: validation uses the existing core. No
// terrain scans, catch-up simulation, GPU allocations or save writes occur.
export function createLiquidOwnerHandoff({definitions=[],reactionRules=[],
  isLoaded,isOpen,isOwnerLoaded,maxCells=8192,maxVisits=256,
  maxParkedCells=8192,maxParkedOwners=64}={}){
  if([isLoaded,isOpen,isOwnerLoaded].some(f=>typeof f!=='function'))
    throw new TypeError('Explicit physical owner and cell callbacks required');
  if(!int(maxCells,1,65536)||!int(maxVisits,1,4096)||
     !int(maxParkedCells,0,65536)||!int(maxParkedOwners,0,256))
    throw new RangeError('Invalid owner handoff budget');
  const config={definitions,reactionRules,isLoaded,isOpen,maxVisits};
  // Validate config before receiving a stage request. Constructor is read-only
  // with respect to the host; it does not invoke the host callbacks.
  createLiquidEngine({...config,maxCells});
  function checked(s,limit){
    if(!s||!Array.isArray(s.cells)||s.cells.length>limit||
       !validQueues(s))
      throw new RangeError('Invalid or over-budget owner snapshot');
    const e=createLiquidEngine({...config,maxCells:Math.max(1,limit),snapshot:s});
    const canonical=e.save();
    return snapshot(canonical.cells,canonical.pending,canonical.capacityBlocked,canonical.lateralPhases);
  }
  function validate(state){
    if(!state||state.version!==LIQUID_OWNER_HANDOFF_VERSION||
       !Array.isArray(state.parked)||state.parked.length>maxParkedOwners)
      throw new TypeError('Invalid or incompatible owner handoff state');
    // Bound total raw work before reconstructing any dormant engine records.
    let total=0;
    for(const shard of state.parked){
      if(!shard||!Array.isArray(shard.snapshot?.cells)||!validQueues(shard.snapshot))
        throw new TypeError('Malformed parked owner shard');
      total+=shard.snapshot.cells.length;
      if(total>maxParkedCells)throw new RangeError('Parked liquid budget exceeded');
    }
    const resident=checked(state.resident,maxCells),parked=new Map();
    for(const shard of state.parked){
      const b=ownerDescriptor(shard.owner),k=b.owner.key;
      if(parked.has(k))throw new TypeError('Duplicate parked owner');
      const s=checked(shard.snapshot,b.capacity);
      if(s.cells.some(c=>!belongs(c,b)))throw new TypeError('Parked cell belongs to another owner');
      parked.set(k,Object.freeze({owner:b.owner,snapshot:s}));
    }
    for(const c of resident.cells){
      if(parked.has(physicalRegionAt(...point(c)).key))
        throw new TypeError('Resident liquid overlaps parked owner');
    }
    return {resident,parked,total};
  }
  function stage({state,owner,mode}={}){
    if(mode!=='detach'&&mode!=='attach')throw new TypeError('Invalid handoff mode');
    const b=ownerDescriptor(owner),k=b.owner.key;
    const {resident,parked,total}=validate(state);
    // Host has paused the simulation and staged the owner readiness switch.
    // Literal boolean required; undefined is not an unloaded-owner proof.
    if(isOwnerLoaded(b.owner)!==(mode==='attach'))return null;
    for(const [other,shard] of parked){
      if(other!==k&&(isOwnerLoaded(shard.owner)!==false||
        shard.snapshot.cells.some(c=>isLoaded(...point(c))!==false)))return null;
    }
    let cells,pending,moved,blocked=resident.capacityBlocked??[],phases=resident.lateralPhases??[];
    if(mode==='detach'){
      if(parked.has(k)||parked.size>=maxParkedOwners)return null;
      moved=resident.cells.filter(c=>belongs(c,b));
      if(total+moved.length>maxParkedCells||moved.some(c=>isLoaded(...point(c))!==false))return null;
      const keys=new Set(moved.map(c=>pointKey(point(c))));
      const parkedPending=resident.pending.filter(p=>keys.has(pointKey(p)));
      const parkedBlocked=blocked.filter(p=>keys.has(pointKey(p)));
      const parkedPhases=phases.filter(p=>keys.has(pointKey(p.slice(0,3))));
      phases=phases.filter(p=>!keys.has(pointKey(p.slice(0,3))));
      parked.set(k,Object.freeze({owner:b.owner,snapshot:snapshot(moved,parkedPending,parkedBlocked,parkedPhases)}));
      blocked=blocked.filter(p=>!keys.has(pointKey(p)));
      cells=resident.cells.filter(c=>!keys.has(pointKey(point(c))));
      pending=resident.pending.filter(p=>!keys.has(pointKey(p)));
    }else{
      const shard=parked.get(k);
      // An explicit empty shard is needed too, to distinguish first load from
      // a repeated attach and prevent a duplicate handoff from minting volume.
      if(!shard)return null;
      moved=shard.snapshot.cells;
      if(resident.cells.length+moved.length>maxCells||
         moved.some(c=>isLoaded(...point(c))!==true||isOpen(...point(c))!==true))return null;
      cells=[...resident.cells,...moved];
      pending=[...resident.pending,...shard.snapshot.pending];
      phases=[...phases,...(shard.snapshot.lateralPhases??[])];
      parked.delete(k);
    }
    const queued=new Set(pending.map(pointKey)),dormant=new Map(blocked.map(p=>[pointKey(p),p]));
    function enqueue(c){const p=point(c),id=pointKey(p);if(!queued.has(id)){
      dormant.delete(id);queued.add(id);pending.push(p);return true;
    }return false;}
    if(mode==='attach')for(const c of moved)enqueue(c);
    // Wake retained cells on the exact six physical faces, even if an attached
    // owner contains no liquid. Do not enqueue diagonal/edge-only contacts.
    let boundaryWoken=0;
    for(const c of cells)if(faces(c,b)&&isLoaded(...point(c))===true&&isOpen(...point(c))===true){
      if(enqueue(c))boundaryWoken++;
    }
    const next=Object.freeze({version:LIQUID_OWNER_HANDOFF_VERSION,resident:snapshot(cells,pending,[...dormant.values()],phases),
      parked:Object.freeze([...parked.values()])});
    return Object.freeze({state:next,owner:b.owner,mode,movedCells:moved.length,
      movedUnits:moved.reduce((sum,c)=>sum+c.units,0),boundaryWoken,
      changed:Object.freeze(moved.map(c=>Object.freeze(point(c))))});
  }
  function validateState(state){
    const {resident,parked}=validate(state);
    return Object.freeze({version:LIQUID_OWNER_HANDOFF_VERSION,resident,
      parked:Object.freeze([...parked.values()])});
  }
  return Object.freeze({stage,validate:validateState});
}
