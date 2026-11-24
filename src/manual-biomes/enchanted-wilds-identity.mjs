// E1 research only: whole-plan forest ownership, never partial canopy clipping.
import {v6BiomeAt} from './v6-balanced-biomes.mjs';

export const ENCHANTED_WILDS_RESEARCH_ID='mythwrought-enchanted-wilds-e1-research';
export function touchesEnchantedForest(seed,cells,origin=null,biomeAt=v6BiomeAt){
  if(origin&&biomeAt(origin[0],origin[2],seed)?.name==='enchanted')return true;
  const checked=new Set();
  for(const [x,,z] of cells){
    const key=x+','+z;
    if(checked.has(key))continue;
    checked.add(key);
    if(biomeAt(x,z,seed)?.name==='enchanted')return true;
  }
  return false;
}
// Use actual existing material ownership, not a blanket color filter.
// Mixed-material wilderness structures are preserved for E7 review.
export function rejectWildsLegacyTree(seed,plan,wood,leaves){
  return !!plan?.cells?.length&&
    plan.cells.every(([, , ,id])=>id===wood||id===leaves)&&
    touchesEnchantedForest(seed,plan.cells,plan.origin);
}
// Reduce the drooping family from 37% to 12%, retain its original geometry.
// Independent style roll: no change to site position, density, or other biomes.
// This is a transitional E1 distribution, not the final E3 five-family roster.
export function wildsTreeStyleRoll(roll){
  if(!Number.isFinite(roll)||roll<0||roll>=1)throw Error('Invalid Wilds style roll');
  return roll<.22?roll/.22*.14:
    roll<.88?.14+(roll-.22)/.66*.49:
      .63+(roll-.88)/.12*.37;
}
