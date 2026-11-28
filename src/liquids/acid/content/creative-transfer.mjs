// Acid B: explicit finite collection/placement staging, never a live edit.
const int=(n,lo,hi)=>Number.isSafeInteger(n)&&n>=lo&&n<=hi;
const pointOK=p=>Array.isArray(p)&&p.length===3&&Number.isSafeInteger(p[0])&&int(p[1],-210,256)&&Number.isSafeInteger(p[2]);
function payload(c){
  return Object.freeze({id:'acid',units:c.units,quantities:Object.freeze({...c.quantities})});
}
function validPayload(c){
  if(c?.id!=='acid'||!int(c.units,1,8)||!c.quantities||typeof c.quantities!=='object'||Array.isArray(c.quantities))return false;
  const entries=Object.entries(c.quantities);
  return entries.length<=8&&entries.every(([k,v])=>/^[a-z][a-z0-9-]{0,31}$/.test(k)&&int(v,1,2**40));
}
// Inject the actual Water A constructor and Acid A strength reader; do not
// substitute a live engine or change its host configuration for staging.
export function createAcidCreativeTransfer({createLiquidEngine,readAcidStrength,engineOptions,canEdit}={}){
  if([createLiquidEngine,readAcidStrength,canEdit,engineOptions?.isLoaded,engineOptions?.isOpen].some(f=>typeof f!=='function'))
    throw new TypeError('Explicit engine, acid policy and host permission required');
  const maxCells=engineOptions.maxCells??8192;
  if(!int(maxCells,1,65536))throw new RangeError('Creative staging cell budget');
  const options={...engineOptions,maxCells};
  function stage({state,revision,action,point,units=8}={}){
    if(!int(revision,0,Number.MAX_SAFE_INTEGER)||!pointOK(point)||!['collect','place'].includes(action)||!int(units,1,8))
      throw new TypeError('Invalid acid creative request');
    if(state?.version!==1||!state.liquid||!Array.isArray(state.liquid.cells)||!Array.isArray(state.liquid.pending)||
      state.liquid.cells.length>maxCells||state.liquid.pending.length>state.liquid.cells.length)
      throw new TypeError('Invalid staged acid state');
    const p=Object.freeze([...point]),[x,y,z]=p;
    const slot=state.canister;
    if(slot!==null&&(!validPayload(slot)||readAcidStrength({...slot,x,y,z})===null))throw new TypeError('Invalid acid canister');
    if(action==='collect'?slot!==null:slot===null)return null;
    if(options.isLoaded(...p)!==true||options.isOpen(...p)!==true)return null;
    // One bounded snapshot restore per explicit inventory edit, not per frame.
    const engine=createLiquidEngine({...options,snapshot:state.liquid});
    const before=engine.getCell(...p);
    if(before&&(before.id!=='acid'||readAcidStrength(before)===null))return null;
    if(action==='collect'&&!before)return null;
    if(canEdit(Object.freeze({action,point:p,cell:before,canister:slot===null?null:payload(slot)}))!==true)return null;
    let nextSlot,movedUnits;
    if(action==='collect'){
      const taken=engine.extract(...p,units);
      if(!taken||readAcidStrength(taken)===null)return null;
      nextSlot=payload(taken);movedUnits=taken.units;
    }else{
      // A filled canister is emptied as a whole. The core checks every
      // capacity, key and quantity limit; failure retains the entire payload.
      if(!engine.insert(...p,'acid',slot.units,slot.quantities))return null;
      if(readAcidStrength(engine.getCell(...p))===null)return null;
      nextSlot=null;movedUnits=slot.units;
    }
    const next=engine.save();
    const liquid=Object.freeze({version:next.version,cells:Object.freeze(next.cells),pending:Object.freeze(next.pending.map(a=>Object.freeze(a)))});
    // This is a proposal, not a commit token. Host must atomically adopt the
    // entire state under a current revision/edit lease, or discard it.
    return Object.freeze({expectedRevision:revision,action,movedUnits,changed:Object.freeze([p]),
      state:Object.freeze({version:1,liquid,canister:nextSlot})});
  }
  return Object.freeze({stage});
}
