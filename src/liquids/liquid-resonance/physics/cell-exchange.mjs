// Isolated compare-and-commit description; never mutates core or an inventory.
import {RESONANCE_ID,ENERGY_KEY,readResonanceCell,resonanceQuantities,
  restoreResonanceStore} from './definition.mjs';

const int=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const token=v=>typeof v==='string'&&v.length>0&&v.length<=128;
const freeze=Object.freeze;
const energy=c=>c?.quantities[ENERGY_KEY]??0;

// ownerKey and cellRevision identify the actual host owner and cell generation,
// including empty cells. Revisions must never be reused across mutation/reload.
// An anchor and a permission flag are not a substitute for host authorization.
export function planResonanceCellExchange({direction,point,cell,ownerKey,
  cellRevision,store,storeAnchor,permitted=false,loaded=false,open=false,
  contained=false,requested=0,maxPerVisit=2}={}) {
  if (!['collect','inject'].includes(direction)||!Array.isArray(point)||point.length!==3||
      !Number.isSafeInteger(point[0])||!int(point[1],-210,256)||!Number.isSafeInteger(point[2])||
      !token(ownerKey)||!token(cellRevision)||!int(requested,0,8)||!int(maxPerVisit,0,8))
    throw new TypeError('Invalid cell exchange identity or budget');
  const s=restoreResonanceStore(store);
  if (permitted!==true||loaded!==true||open!==true||contained!==true||
      storeAnchor!==s.anchor||s.revision===Number.MAX_SAFE_INTEGER) return null;
  const [x,y,z]=point;
  if (cell!==null&&(cell?.id!==RESONANCE_ID||cell.x!==x||cell.y!==y||cell.z!==z)) return null;
  const c=cell===null?null:readResonanceCell(cell);
  const collecting=direction==='collect';
  const units=Math.min(requested,maxPerVisit,collecting?(c?.units??0):s.units,
    collecting?s.capacity-s.units:8-(c?.units??0));
  if (!units) return null;
  const movedEnergy=collecting?Math.floor(energy(c)*units/c.units):Math.floor(s.energy*units/s.units);
  const sign=collecting?1:-1;
  const nextUnits=(c?.units??0)-sign*units,nextEnergy=energy(c)-sign*movedEnergy;
  const nextCell=nextUnits?freeze({x,y,z,id:RESONANCE_ID,units:nextUnits,
    quantities:resonanceQuantities(nextUnits,nextEnergy)}):null;
  const nextStore=restoreResonanceStore({...s,units:s.units+sign*units,
    energy:s.energy+sign*movedEnergy,revision:s.revision+1});
  return freeze({direction,point:freeze([x,y,z]),ownerKey,cellRevision,
    expectedCell:c,expectedStore:s,nextCell,nextStore,units,energy:movedEnergy,
    requested,maxPerVisit});
}

// Advisory validation only: use the returned canonical plan, not caller data.
// Must run inside the host's atomic terrain/inventory transaction, with fresh
// permission, owner identity and non-reused revisions. Never execute a plan
// by independently extracting/inserting and later updating a store.
export function revalidateResonanceCellExchange(plan,live) {
  if (!plan||!live||live.direction!==plan.direction||live.requested!==plan.requested||
      (live.maxPerVisit??2)!==plan.maxPerVisit) return null;
  const fresh=planResonanceCellExchange(live);
  if (!fresh||JSON.stringify(fresh)!==JSON.stringify(plan)) return null;
  return fresh;
}
