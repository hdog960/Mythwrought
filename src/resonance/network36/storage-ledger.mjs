// Opt-in per-network accounting only. No graph routing, world writes, or persistence.
export const STORAGE_LEDGER_CONTRACT = 'resonance-network36-storage-ledger-v1';
const valid = n => Number.isSafeInteger(n) && n >= 0;
const add = (a,b) => { const n=a+b; if (!Number.isSafeInteger(n)) throw Error('energy overflow'); return n; };
export function settleStorage({production=0, consumption=0, stores=[]}={}) {
  if (!valid(production)||!valid(consumption)||!Array.isArray(stores)||stores.length>2048) throw Error('invalid ledger budget');
  const ids=new Set();
  for (const s of stores) {
    if (!s||typeof s.id!=='string'||!s.id||ids.has(s.id)||
      !['capacity','charge','maxInput','maxOutput'].every(k=>valid(s[k]))||s.charge>s.capacity)
      throw Error('invalid storage');
    ids.add(s.id);
  }
  const ordered=[...stores].sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0);
  const before=ordered.reduce((n,s)=>add(n,s.charge),0);
  let shortage=Math.max(0,consumption-production), surplus=Math.max(0,production-consumption);
  const nextCharges={},charged={},discharged={};
  for (const s of ordered) {
    const out=Math.min(shortage,s.charge,s.maxOutput);
    shortage-=out;
    discharged[s.id]=out;
    nextCharges[s.id]=s.charge-out;
  }
  // Never charge when any demand remains unsatisfied.
  if (shortage===0) for (const s of ordered) {
    const gain=Math.min(surplus,s.maxInput,s.capacity-nextCharges[s.id]);
    surplus-=gain;
    nextCharges[s.id]+=gain;
    charged[s.id]=gain;
  }
  for(const s of ordered) charged[s.id]??=0;
  const after=ordered.reduce((n,s)=>add(n,nextCharges[s.id]),0);
  const usedFromStores=Object.values(discharged).reduce(add,0);
  const storedSurplus=Object.values(charged).reduce(add,0);
  if (add(before,storedSurplus)-usedFromStores!==after) throw Error('storage invariant');
  return {contract:STORAGE_LEDGER_CONTRACT,nextCharges,charged,discharged,
    supplied:consumption-shortage,unmet:shortage,curtailed:surplus,
    storedBefore:before,storedAfter:after,usedFromStores,storedSurplus};
}
