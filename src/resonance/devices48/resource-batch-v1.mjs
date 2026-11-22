// D4 source-only deterministic resource batch. Never mutates world or inventory.
export const BATCH_V1=Object.freeze({id:'resonance-devices48-batch-v1',maxDevices:16,productionBound:false});
const nat=n=>Number.isSafeInteger(n)&&n>=0;
const id=s=>typeof s==='string'&&/^[a-z0-9_-]{1,48}$/.test(s);
export function prepareBatch(fixtures,{seed,tick}){
 if(!nat(seed)||!nat(tick)||!Array.isArray(fixtures)||fixtures.length>16)throw Error('invalid batch');
 const devices=new Set(),items=new Set(),cells=new Set();let demand=0;
 const entries=fixtures.map(f=>{
  if(!f||f.contract!=='resonance-devices48-resource-v1'||f.seed!==seed||f.tick!==tick||!id(f.deviceId)||devices.has(f.deviceId)||!['collect','process'].includes(f.mode)||!nat(f.energyDemand)||f.energyDemand<1||f.energyDemand>64||!Array.isArray(f.items)||f.items.length>32)throw Error('invalid fixture');
  devices.add(f.deviceId);demand+=f.energyDemand;
  const resources=f.items.map(i=>{if(!i||!id(i.id)||!id(i.cell)||!id(i.kind)||!nat(i.quantity)||i.quantity<1||i.quantity>64||items.has(i.id)||cells.has(i.cell))throw Error('resource conflict');items.add(i.id);cells.add(i.cell);return Object.freeze({id:i.id,cell:i.cell,kind:i.kind,quantity:i.quantity});});
  return Object.freeze({deviceId:f.deviceId,mode:f.mode,demand:f.energyDemand,items:Object.freeze(resources.sort((a,b)=>a.id.localeCompare(b.id,'en')))});
 }).sort((a,b)=>a.deviceId.localeCompare(b.deviceId,'en'));
 if(demand>256)throw Error('excess demand');
 return Object.freeze({contract:BATCH_V1.id,seed,tick,demand,entries:Object.freeze(entries)});
}
export function evaluateBatch(batch,{grants,clearance,inventoryReady}){
 if(!batch||batch.contract!==BATCH_V1.id||!Array.isArray(batch.entries)||!Array.isArray(grants)||!Array.isArray(clearance)||!Array.isArray(inventoryReady))throw Error('invalid evaluation');
 const known=new Set(batch.entries.map(e=>e.deviceId));
 const read=(rows,field,valid)=>{const map=new Map();for(const r of rows){if(!r||!known.has(r.id)||map.has(r.id)||!valid(r[field]))throw Error('invalid '+field);map.set(r.id,r[field]);}return map;};
 const energy=read(grants,'granted',nat),paths=read(clearance,'clear',x=>typeof x==='boolean'),inventory=read(inventoryReady,'ready',x=>typeof x==='boolean');
 let allocated=0;
 const proposals=batch.entries.map(e=>{const grant=energy.get(e.deviceId)??0;if(grant>e.demand)throw Error('overgrant');allocated+=grant;const ready=grant===e.demand&&paths.get(e.deviceId)===true&&inventory.get(e.deviceId)===true;return Object.freeze({deviceId:e.deviceId,state:ready?'eligible':'stopped',items:ready?e.items:Object.freeze([])});});
 return Object.freeze({contract:BATCH_V1.id,seed:batch.seed,tick:batch.tick,allocated,proposals:Object.freeze(proposals),worldChanged:false,inventoryChanged:false,productionBound:false});
}
