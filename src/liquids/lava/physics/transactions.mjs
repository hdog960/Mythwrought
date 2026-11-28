// Lava A: opt-in core v1 settlement and read-only cooling transaction descriptions.
import {WATER_LAVA_REACTION,describeLavaQuench,proposeLavaCooling,readLavaHeat,LAVA_HEAT_KEY} from './definition.mjs';

const point=c=>[c.x,c.y,c.z];
const valid=c=>c&&Number.isSafeInteger(c.x)&&Number.isSafeInteger(c.z)&&
  Number.isSafeInteger(c.y)&&c.y>=-210&&c.y<=256;
const adjacent=(a,b)=>valid(a)&&valid(b)&&
  Math.abs(a.x-b.x)+Math.abs(a.y-b.y)+Math.abs(a.z-b.z)===1;
const samePoint=(p,c)=>Array.isArray(p)&&p.length===3&&p.every((v,i)=>v===point(c)[i]);

// Register INSTEAD OF the old proposal-only rule on a staged engine.
// Both consumed portions go to the host's durable product-input ledger.
// No automatic registration, host adoption, product creation or terrain edits.
export const WATER_LAVA_SETTLEMENT_RULE=Object.freeze({...WATER_LAVA_REACTION,
  settle(proposal){
    return adjacent(proposal?.a,proposal?.b)&&describeLavaQuench(proposal)
      ?Object.freeze({routeA:'product',routeB:'product'}):null;
  }
});

// Validate and interpret a core receipt (or plan's productInputs). This is a
// pure description, NOT proof of commit, replay protection or permission.
// Host must retain the original receipt and adopt it exactly once with state.
export function describeQuenchReceipt(receipt){
  if(receipt?.product!=='lava-quench'||!Array.isArray(receipt.productInputs)||receipt.productInputs.length!==2)return null;
  const [a,b]=receipt.productInputs;
  if(!adjacent(a,b)||a.units!==b.units)return null;
  const ledger=describeLavaQuench({a,b,consumeA:a.units,consumeB:b.units,product:receipt.product});
  if(!ledger)return null;
  if(receipt.changed!==undefined&&(!Array.isArray(receipt.changed)||receipt.changed.length!==2||
    !samePoint(receipt.changed[0],a)||!samePoint(receipt.changed[1],b)))return null;
  return Object.freeze({product:'lava-quench',at:Object.freeze(point(b)),
    steamUnits:ledger.steamUnits,solidUnits:ledger.solidUnits,releasedHeat:ledger.releasedHeat,
    fullVoxelCandidate:ledger.fullVoxelCandidate});
}

// Recompute a thermal proposal against the exact current record and host policy.
// Host callbacks must be synchronous, pure and stable under its edit lease.
// No core single-cell executor exists yet: this is only a before/after ledger.
export function describeCoolingTransaction({engine,isLoaded,isOpen,canCool},proposal,{lossPerUnit=4}={}){
  if(typeof engine?.getCell!=='function'||[isLoaded,isOpen,canCool].some(f=>typeof f!=='function'))
    throw new TypeError('Explicit cooling host callbacks required');
  const c=proposal?.expected;
  if(!valid(c)||readLavaHeat(c)===null||!Object.isFrozen(c)||!Object.isFrozen(c.quantities))return null;
  if(isLoaded(...point(c))!==true||isOpen(...point(c))!==true||engine.getCell(...point(c))!==c||canCool(c)!==true)return null;
  const fresh=proposeLavaCooling(c,{lossPerUnit});
  if(!fresh||['consumeLava','solidUnits','releasedHeat','nextHeat','product','fullVoxelCandidate'].some(k=>fresh[k]!==proposal[k]))return null;
  if(engine.getCell(...point(c))!==c)return null;
  const after=fresh.consumeLava?null:Object.freeze({...c,
    quantities:Object.freeze(fresh.nextHeat?{[LAVA_HEAT_KEY]:fresh.nextHeat}:{})});
  const ledger=Object.freeze({product:fresh.product,at:Object.freeze(point(c)),
    solidUnits:fresh.solidUnits,releasedHeat:fresh.releasedHeat,fullVoxelCandidate:fresh.fullVoxelCandidate});
  return Object.freeze({before:c,after,ledger});
}
