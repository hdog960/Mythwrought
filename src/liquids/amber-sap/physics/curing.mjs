// Amber Sap A: bounded dwell tracking and read-only full-voxel conversion proposals.
// The host owns terrain, transaction execution and the policy for eligible surfaces.
const int=(v,lo,hi)=>Number.isSafeInteger(v)&&v>=lo&&v<=hi;
const point=(x,y,z)=>Number.isSafeInteger(x)&&int(y,-210,256)&&Number.isSafeInteger(z);
const key=(x,y,z)=>`${x},${y},${z}`;
const fullSap=(c,p)=>c?.id==='amber-sap'&&c.x===p[0]&&c.y===p[1]&&c.z===p[2]&&c.units===8&&
  c.quantities&&typeof c.quantities==='object'&&!Array.isArray(c.quantities)&&Object.keys(c.quantities).length===0;

export function createSapCuring({engine,isLoaded,isOpen,canCure,enabled=false,
  dwellVisits=120,maxTracked=8192,maxVisits=64,snapshot=null}={}){
  if(typeof engine?.getCell!=='function'||[isLoaded,isOpen,canCure].some(f=>typeof f!=='function'))
    throw new TypeError('Explicit curing host required');
  if(typeof enabled!=='boolean'||!int(dwellVisits,1,1000000)||!int(maxTracked,1,65536)||!int(maxVisits,1,4096))
    throw new RangeError('Invalid curing policy');
  const signature=JSON.stringify([enabled,dwellVisits,maxTracked,maxVisits]);
  const pending=new Map();
  let busy=false;
  const idle=()=>{if(busy)throw new Error('Reentrant sap curing');};
  const available=p=>isLoaded(...p)===true&&isOpen(...p)===true;
  const reset=r=>{r.visits=0;r.expected=null;r.proposal=null;};
  function track(x,y,z){
    idle();if(!point(x,y,z))throw new RangeError('Outside physical cell envelope');
    const k=key(x,y,z);
    if(pending.has(k))return true;
    if(pending.size>=maxTracked)return false;
    pending.set(k,{p:[x,y,z],visits:0,expected:null,proposal:null});return true;
  }
  // Host calls on every relevant terrain/eligibility change, including unload
  // and reload, and on external liquid edits. A transient interruption resets dwell.
  function invalidate(x,y,z){
    idle();if(!point(x,y,z))throw new RangeError('Outside physical cell envelope');
    const r=pending.get(key(x,y,z));if(r)reset(r);
    return !!r;
  }
  if(snapshot!==null){
    if(snapshot?.version!==1||snapshot.signature!==signature||!Array.isArray(snapshot.pending)||snapshot.pending.length>maxTracked)
      throw new TypeError('Invalid curing snapshot or changed policy');
    for(const row of snapshot.pending){
      if(!Array.isArray(row)||row.length!==4||!point(row[0],row[1],row[2])||!int(row[3],0,dwellVisits)||(!enabled&&row[3]!==0))
        throw new TypeError('Invalid curing queue entry');
      const [x,y,z,visits]=row,k=key(x,y,z),p=[x,y,z];
      if(pending.has(k))throw new TypeError('Duplicate curing queue entry');
      track(...p);const r=pending.get(k);
      // Snapshot is only valid with its atomically paired engine snapshot and
      // unchanged host policy. Never grant progress on an unavailable cell.
      if(visits&&available(p)){
        const c=engine.getCell(...p);
        if(fullSap(c,p)&&canCure(c)===true){r.expected=c;r.visits=visits;}
      }
    }
  }
  function step(limit=maxVisits){
    idle();if(!int(limit,1,maxVisits))throw new RangeError('Curing visit budget');
    if(!enabled)return Object.freeze({visited:0,retired:0,deferred:0,proposals:Object.freeze([]),pending:pending.size});
    const budget=Math.min(limit,pending.size),proposals=[];
    let visited=0,retired=0,deferred=0;busy=true;
    try{
      while(visited<budget){
        const [k,r]=pending.entries().next().value;
        let keep=true;
        if(!available(r.p)){reset(r);deferred++;}
        else{
          const c=engine.getCell(...r.p);
          if(!fullSap(c,r.p)){keep=false;retired++;}
          else if(canCure(c)!==true){reset(r);deferred++;}
          else{
            if(r.expected!==c){reset(r);r.expected=c;}
            r.visits=Math.min(dwellVisits,r.visits+1);
            if(r.visits===dwellVisits){
              r.proposal??=Object.freeze({expected:c,consumeSap:8,solidUnits:8,product:'amber'});
              proposals.push(r.proposal);
            }
          }
        }
        pending.delete(k);if(keep)pending.set(k,r);visited++;
      }
      return Object.freeze({visited,retired,deferred,proposals:Object.freeze(proposals),pending:pending.size});
    }finally{busy=false;}
  }
  // Revalidation is read-only, not permission to consume or place a block.
  // A fresh proposal must be handed to the future atomic world/liquid executor.
  function isReady(proposal){
    idle();const c=proposal?.expected;
    if(!enabled||!c||!point(c.x,c.y,c.z)||proposal.consumeSap!==8||proposal.solidUnits!==8||proposal.product!=='amber')return false;
    const p=[c.x,c.y,c.z],r=pending.get(key(...p));
    if(!r||r.visits!==dwellVisits||r.expected!==c||r.proposal!==proposal)return false;
    busy=true;
    try{return available(p)&&engine.getCell(...p)===c&&fullSap(c,p)&&canCure(c)===true;}
    finally{busy=false;}
  }
  function save(){
    idle();busy=true;
    try{return {version:1,signature,pending:[...pending.values()].map(r=>{
      const visits=r.visits&&available(r.p)&&engine.getCell(...r.p)===r.expected&&canCure(r.expected)===true?r.visits:0;
      return [...r.p,visits];
    })};}finally{busy=false;}
  }
  return Object.freeze({track,invalidate,step,isReady,save});
}
