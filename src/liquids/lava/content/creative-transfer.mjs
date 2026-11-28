// Lava B: finite creative cargo and isolated transfer staging, never live edits.
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const point=(x,y,z)=>Number.isSafeInteger(x)&&int(y,-210,256)&&Number.isSafeInteger(z);
const token=s=>typeof s==='string'&&s.length>0&&s.length<=128;
export const LAVA_CARGO_VERSION=1;

// readLavaHeat and createLiquidEngine are the existing A-lane exports.
// No second solver, inventory registry, heat simulation or infinite creative source.
export function createLavaCreativeTransfer({createLiquidEngine,readLavaHeat,
  definitions,reactionRules=[],isLoaded,isOpen,inspect,canTransfer,
  allowCreative=false,maxCells=8192,maxVisits=256}={}){
  if([createLiquidEngine,readLavaHeat,isLoaded,isOpen,inspect,canTransfer].some(f=>typeof f!=='function')||
    !Array.isArray(definitions)||!Array.isArray(reactionRules)||typeof allowCreative!=='boolean'||
    !int(maxCells,1,65536)||!int(maxVisits,1,4096))throw new TypeError('Invalid creative transfer configuration');
  const plans=new WeakMap();
  const cargo=(units,heat)=>{
    if(!int(units,0,8)||!int(heat,0,units*100))throw new RangeError('Invalid lava cargo');
    const quantities=Object.freeze(heat?{'lava-heat':heat}:{});
    if(units&&readLavaHeat({id:'lava',units,quantities})!==heat)throw new RangeError('Incompatible lava heat');
    return Object.freeze({version:LAVA_CARGO_VERSION,id:'lava',units,quantities});
  };
  function validateCargo(c){
    if(!c||c.version!==LAVA_CARGO_VERSION||c.id!=='lava'||!int(c.units,0,8)||
      !c.quantities||typeof c.quantities!=='object'||Array.isArray(c.quantities)||
      Object.keys(c.quantities).some(k=>k!=='lava-heat'))throw new TypeError('Invalid lava cargo record');
    return cargo(c.units,Object.hasOwn(c.quantities,'lava-heat')?c.quantities['lava-heat']:0);
  }
  function eligibility(request){
    const {x,y,z}=request;
    if(isLoaded(x,y,z)!==true||isOpen(x,y,z)!==true)return null;
    const o=inspect(x,y,z);
    if(!o||o.loaded!==true||o.protected!==false||o.terrain!=='air'||!token(o.revision)||
      canTransfer(request,o)!==true)return null;
    return o.revision;
  }
  function stage({resident,cargo:held,revision,x,y,z,mode,units}={}){
    if(!point(x,y,z)||!token(revision)||!['collect','place'].includes(mode)||!int(units,1,8))
      throw new RangeError('Invalid creative transfer request');
    const before=validateCargo(held);
    if(!resident||resident.version!==1||!Array.isArray(resident.cells)||resident.cells.length>maxCells||
      !Array.isArray(resident.pending)||resident.pending.length>resident.cells.length)throw new TypeError('Invalid resident snapshot');
    if(!allowCreative)return null;
    const request=Object.freeze({x,y,z,mode,units});
    const terrainRevision=eligibility(request);
    if(terrainRevision===null)return null;
    const engine=createLiquidEngine({definitions,reactionRules,isLoaded,isOpen,maxCells,maxVisits,snapshot:resident});
    const c=engine.getCell(x,y,z),existingHeat=c?readLavaHeat(c):0;
    if(existingHeat===null)return null;
    const heldHeat=before.quantities['lava-heat']??0;
    let after,movedHeat;
    if(mode==='collect'){
      if(!c||units>c.units||before.units+units>8)return null;
      const extracted=engine.extract(x,y,z,units);
      if(!extracted||extracted.units!==units)return null;
      movedHeat=readLavaHeat(extracted);
      if(movedHeat===null)return null;
      after=cargo(before.units+units,heldHeat+movedHeat);
    }else{
      if(units>before.units||units+(c?.units??0)>8)return null;
      // Same integer proportion and retained remainder as core extraction.
      movedHeat=Math.floor(heldHeat*units/before.units);
      if(!engine.insert(x,y,z,'lava',units,movedHeat?{'lava-heat':movedHeat}:{}))return null;
      after=cargo(before.units-units,heldHeat-movedHeat);
    }
    const saved=engine.save();
    const next=Object.freeze({version:saved.version,cells:Object.freeze(saved.cells),
      pending:Object.freeze(saved.pending.map(p=>Object.freeze(p)))});
    const plan=Object.freeze({expectedRevision:revision,terrainRevision,request,beforeCargo:before,
      cargo:after,resident:next,movedHeat,changed:Object.freeze([Object.freeze([x,y,z])])});
    plans.set(plan,true);
    return plan;
  }
  // Single-use admission check under the exclusive host edit/streaming lease.
  // The revision must cover ALL authoritative state including inventory, parked
  // liquid, terrain, sources and products. Host atomically adopts both outputs.
  function validate(plan,currentRevision){
    if(!plans.has(plan))return false;
    plans.delete(plan);
    return currentRevision===plan.expectedRevision&&eligibility(plan.request)===plan.terrainRevision;
  }
  return Object.freeze({emptyCargo:()=>cargo(0,0),validateCargo,stage,validate});
}
