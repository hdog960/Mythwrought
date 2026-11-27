// Liquid Resonance policy, shared liquid contract v1. No world or network writes.
export const RESONANCE_ID = 'liquid-resonance';
export const ENERGY_KEY = 'resonance-energy';
export const ENERGY_SCALE = 1024; // provisional integer accounting units, not network power
const CAP = 8;
const REV = Number.MAX_SAFE_INTEGER;
const int = (n,lo,hi) => Number.isSafeInteger(n) && n>=lo && n<=hi;
const object = v => v!==null && typeof v==='object' && !Array.isArray(v);
const token = v => typeof v==='string' && v.length>0 && v.length<=128;
const frozen = Object.freeze;
export function createResonanceDefinition({gravityLimit=3,lateralLimit=5}={}) {
  if (!int(gravityLimit,0,CAP)||!int(lateralLimit,0,CAP)) throw new RangeError('invalid flow limit');
  return frozen({id:RESONANCE_ID,gravityLimit,lateralLimit});
}
export const RESONANCE_DEFINITION = createResonanceDefinition();
export function resonanceQuantities(units,energy) {
  if (!int(units,0,65535)||!int(energy,0,units*ENERGY_SCALE)) throw new RangeError('invalid resonance inventory');
  return frozen(energy?{[ENERGY_KEY]:energy}:{});
}
function readEnergy(units,q={}) {
  if (!object(q)||Object.keys(q).some(k=>k!==ENERGY_KEY)) throw new TypeError('unsupported resonance quantities');
  const energy=Object.hasOwn(q,ENERGY_KEY)?q[ENERGY_KEY]:0;
  resonanceQuantities(units,energy);
  return energy;
}
export function readResonanceCell(c) {
  if (!object(c)||c.id!==RESONANCE_ID||!Number.isSafeInteger(c.x)||!int(c.y,-210,256)||!Number.isSafeInteger(c.z)||!int(c.units,1,CAP)) throw new TypeError('invalid resonance cell');
  const energy=readEnergy(c.units,c.quantities);
  return frozen({x:c.x,y:c.y,z:c.z,id:RESONANCE_ID,units:c.units,quantities:resonanceQuantities(c.units,energy)});
}
// Display/exposure only. No damage, charging or player movement side effects.
export function resonanceExposure(sample,{maxSignal=1000}={}) {
  if (!int(maxSignal,0,65535)) throw new RangeError('invalid signal limit');
  if (sample?.cell?.id!==RESONANCE_ID) return frozen({contact:false,energy:0,density:0,signal:0});
  const c=readResonanceCell(sample.cell),energy=readEnergy(c.units,c.quantities);
  return frozen({contact:true,energy,density:Math.floor(energy/c.units),signal:Math.floor(maxSignal*energy/(CAP*ENERGY_SCALE))});
}
// Standalone versioned finite inventory, bound to a host-owned unique anchor.
// No implicit regeneration, offline catch-up, or conversion from network power.
export function restoreResonanceStore(s) {
  if (!object(s)||s.version!==1||s.id!==RESONANCE_ID||!token(s.storeId)||!token(s.anchor)||!int(s.capacity,1,65535)||!int(s.units,0,s.capacity)||!int(s.energy,0,s.units*ENERGY_SCALE)||!int(s.revision,0,REV)) throw new TypeError('invalid resonance store');
  return frozen({version:1,id:RESONANCE_ID,storeId:s.storeId,anchor:s.anchor,capacity:s.capacity,units:s.units,energy:s.energy,revision:s.revision});
}
// Exact source debit and destination credit, including rounding residue.
// These are compare-and-commit proposals: the host must atomically check both
// unique inventory identities, revisions, containment and permissions again.
export function planResonanceTransfer(from,to,{permitted=false,fromLoaded=false,toLoaded=false,contained=false,requested=0,maxPerVisit=2}={}) {
  const a=restoreResonanceStore(from),b=restoreResonanceStore(to);
  if (!int(requested,0,CAP)||!int(maxPerVisit,0,CAP)) throw new RangeError('invalid transfer budget');
  if (permitted!==true||fromLoaded!==true||toLoaded!==true||contained!==true||a.storeId===b.storeId||a.anchor===b.anchor||a.revision===REV||b.revision===REV) return null;
  const units=Math.min(requested,maxPerVisit,a.units,b.capacity-b.units);
  if (!units) return null;
  const energy=Math.floor(a.energy*units/a.units);
  return frozen({expectedFrom:a,expectedTo:b,nextFrom:restoreResonanceStore({...a,units:a.units-units,energy:a.energy-energy,revision:a.revision+1}),nextTo:restoreResonanceStore({...b,units:b.units+units,energy:b.energy+energy,revision:b.revision+1}),units,energy});
}
// The core's insert is not a transaction with a store. Host must reserve and
// atomically debit exactly this inventory and insert into a loaded open cell.
export function planResonanceInjection(raw,{permitted=false,loaded=false,contained=false,anchor,availableCapacity=0,requested=0,maxPerVisit=2}={}) {
  const s=restoreResonanceStore(raw);
  if (![availableCapacity,requested,maxPerVisit].every(n=>int(n,0,CAP))) throw new RangeError('invalid injection budget');
  if (permitted!==true||loaded!==true||contained!==true||anchor!==s.anchor||s.revision===REV) return null;
  const units=Math.min(availableCapacity,requested,maxPerVisit,s.units);
  if (!units) return null;
  const energy=Math.floor(s.energy*units/s.units);
  return frozen({expectedStore:s,nextStore:restoreResonanceStore({...s,units:s.units-units,energy:s.energy-energy,revision:s.revision+1}),output:frozen({id:RESONANCE_ID,units,quantities:resonanceQuantities(units,energy)})});
}
// Mineral infusion is an opt-in energy-only transfer. Volume stays liquid.
// The mineral's stored energy is not an item reward or new generation source.
export function restoreInfusionMineral(m) {
  if (!object(m)||m.version!==1||!token(m.mineralId)||!token(m.material)||!int(m.capacity,1,65535)||!int(m.energy,0,m.capacity)||!int(m.revision,0,REV)) throw new TypeError('invalid mineral state');
  return frozen({version:1,mineralId:m.mineralId,material:m.material,capacity:m.capacity,energy:m.energy,revision:m.revision});
}
export function planMineralInfusion(c,raw,{enabled=false,permitted=false,loaded=false,adjacent=false,cellRevision,allowedMaterials=[],maxEnergy=64}={}) {
  const s=readResonanceCell(c),m=restoreInfusionMineral(raw);
  if (!token(cellRevision)||!Array.isArray(allowedMaterials)||allowedMaterials.length>64||!allowedMaterials.every(token)||!int(maxEnergy,0,ENERGY_SCALE)) throw new RangeError('invalid infusion policy');
  if (enabled!==true||permitted!==true||loaded!==true||adjacent!==true||!allowedMaterials.includes(m.material)||m.revision===REV) return null;
  const energy=readEnergy(s.units,s.quantities),spent=Math.min(energy,maxEnergy,m.capacity-m.energy);
  if (!spent) return null;
  return frozen({expectedCell:s,expectedCellRevision:cellRevision,expectedMineral:m,nextCell:frozen({...s,quantities:resonanceQuantities(s.units,energy-spent)}),nextMineral:restoreInfusionMineral({...m,energy:m.energy+spent,revision:m.revision+1}),transferredEnergy:spent});
}
