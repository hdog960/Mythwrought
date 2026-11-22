// D4 source-only protected resource fixture. No world edits or inventory mutations.
export const RESOURCE_FIXTURE_V1 = Object.freeze({id:'resonance-devices48-resource-v1',productionBound:false,maxItems:32,maxDemand:64});
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const id=s=>typeof s==='string'&&/^[a-z0-9_-]{1,48}$/.test(s);
export function prepareResourceFixture({seed,tick,deviceId,mode,energyDemand,items,protectedCells}) {
  if(!nat(seed)||!nat(tick)||!id(deviceId)||!['collect','process'].includes(mode)||!nat(energyDemand)||energyDemand<1||energyDemand>64) throw Error('invalid fixture');
  if(!Array.isArray(items)||items.length>32||!Array.isArray(protectedCells)) throw Error('invalid resources');
  const forbidden=new Set();
  for(const cell of protectedCells){if(!id(cell)) throw Error('invalid protected cell');forbidden.add(cell);}
  const seen=new Set();
  const accepted=items.map(item=>{
    if(!item||!id(item.id)||!id(item.cell)||!id(item.kind)||!nat(item.quantity)||item.quantity<1||item.quantity>64||item.playerOwned!==false||item.fixtureApproved!==true) throw Error('unapproved resource');
    if(seen.has(item.id)||forbidden.has(item.cell)) throw Error('duplicate or protected resource');
    seen.add(item.id);
    return Object.freeze({id:item.id,cell:item.cell,kind:item.kind,quantity:item.quantity});
  }).sort((a,b)=>a.id.localeCompare(b.id,'en'));
  return Object.freeze({contract:RESOURCE_FIXTURE_V1.id,seed,tick,deviceId,mode,energyDemand,items:Object.freeze(accepted)});
}
export function evaluateResourceFixture(frame,{allocation,clearance,inventoryBridge}) {
  if(!frame||frame.contract!==RESOURCE_FIXTURE_V1.id||!nat(allocation)||allocation>frame.energyDemand) throw Error('invalid resource allocation');
  const ready=allocation===frame.energyDemand&&clearance===true&&inventoryBridge===true;
  return Object.freeze({state:ready?'eligible':'stopped',proposedItems:ready?frame.items:Object.freeze([]),worldChanged:false,inventoryChanged:false,productionBound:false});
}
