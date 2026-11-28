// Water B: finite spring candidates and isolated creative transfer staging.
// No host inventory, terrain, live engine, or source registration writes.
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const point=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&int(p[1],-210,256)&&Number.isSafeInteger(p[2]);
const freezeSnapshot=s=>Object.freeze({version:s.version,cells:Object.freeze([...s.cells]),pending:Object.freeze(s.pending.map(p=>Object.freeze([...p])))});

// A finite stock allocation proposal, directly consumable by Water A's source
// adapter only after the host has reserved the stock and unique source ID/position.
export function planFiniteSpring({id,position,stock,rate=1,target=8}={}){
  if(typeof id!=='string'||!/^[a-z][a-z0-9-]{0,63}$/.test(id)||!point(position)||
    !int(stock,1,Number.MAX_SAFE_INTEGER)||!int(rate,1,8)||!int(target,1,8))throw new TypeError('Invalid finite spring');
  const [x,y,z]=position;
  return Object.freeze({source:Object.freeze({id,x,y,z,mode:'finite',rate,target,initialUnits:stock}),requiredUnits:stock});
}

function vesselRecord(v){
  if(v===null)return null;
  if(!v||v.id!=='water'||!int(v.units,1,8)||!v.quantities||typeof v.quantities!=='object'||Array.isArray(v.quantities))
    throw new TypeError('Invalid water vessel');
  const entries=Object.entries(v.quantities).sort(([a],[b])=>a<b?-1:a>b?1:0);
  if(entries.length>8||entries.some(([k,n])=>!/^[a-z][a-z0-9-]{0,31}$/.test(k)||!int(n,0,2**40)))
    throw new TypeError('Invalid vessel quantities');
  return Object.freeze({id:'water',units:v.units,quantities:Object.freeze(Object.fromEntries(entries.filter(([,n])=>n!==0)))});
}

// createEngine(snapshot) must construct a fresh authentic Water A engine with
// the same policy and stable staged terrain callbacks, never return the live one.
// A transfer is a candidate for a host CAS/adoption, not a committed edit.
export function createCreativeWaterStager({createEngine,isLoaded,isOpen,canEdit,maxCells=8192}={}){
  if([createEngine,isLoaded,isOpen,canEdit].some(f=>typeof f!=='function')||!int(maxCells,1,65536))
    throw new TypeError('Invalid creative water host');
  let busy=false;
  function stage({state,expectedRevision,position,mode,units}={}){
    if(busy)throw new Error('Reentrant creative water staging');
    if(!state||!int(state.revision,0,Number.MAX_SAFE_INTEGER-1)||!int(expectedRevision,0,Number.MAX_SAFE_INTEGER-1)||
      !point(position)||!['collect','place'].includes(mode)||!int(units,1,8)||!state.resident||
      !Array.isArray(state.resident.cells)||!Array.isArray(state.resident.pending)||state.resident.cells.length>maxCells||
      state.resident.pending.length>state.resident.cells.length)throw new TypeError('Invalid creative water request');
    if(state.revision!==expectedRevision)return null;
    const vessel=vesselRecord(state.vessel),p=Object.freeze([...position]);
    if(mode==='collect'?vessel!==null:!vessel||vessel.units!==units)return null;
    busy=true;
    try{
      if(isLoaded(...p)!==true||isOpen(...p)!==true||canEdit(p,mode)!==true)return null;
      const e=createEngine(state.resident),c=e.getCell(...p);
      let next;
      if(mode==='collect'){
        if(!c||c.id!=='water'||c.units<units)return null;
        const taken=e.extract(...p,units);
        if(!taken||taken.id!=='water'||taken.units!==units)throw new Error('Engine extraction contract violation');
        next=vesselRecord(taken);
      }else{
        if(e.insert(...p,'water',units,vessel.quantities)!==true)return null;
        next=null;
      }
      return Object.freeze({expectedRevision,mode,moved:units,changed:Object.freeze([p]),
        state:Object.freeze({revision:expectedRevision+1,resident:freezeSnapshot(e.save()),vessel:next})});
    }finally{busy=false;}
  }
  return Object.freeze({stage});
}
