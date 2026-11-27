// Wilds E5: reuse actual registered vegetation geometry, not aliases or invented IDs.
import {biome130Block} from '../biome130-registry.mjs';
import {BLOCK} from '../voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
const ids=[287,288,289,290,295,296];
export const WILDS_GROUND_FAMILIES=Object.freeze(ids.map(id=>{
 const a=biome130Block(id);
 if(a.attachment!=='ground')throw Error('Non-ground asset '+id);
 return Object.freeze({id,name:a.name,solid:a.solid});
}));
const soil=new Set([G.woodlandLoam,G.woodlandPeat,G.woodlandMoss,BLOCK.GRASS,BLOCK.DIRT]);
const hash=(x,z,seed)=>{let h=Math.imul(x,0x7feb352d)^Math.imul(z,0x846ca68b)^seed;h=Math.imul(h^(h>>>16),0x45d9f3b);return (h^(h>>>16))>>>0;};
// 4x4 grid; one sparse candidate per tile, grouped by the internal region.
// Only genuine unoccupied ground, never cave roof, trunk or legacy landmark.
export function wildsGroundCells(ground,cx,cz,treeRows,regionAt){
 const rows=new Map(),x0=cx*16,z0=cz*16;
 const regional=[[0,0,1,2,3,5],[0,0,1,4,5,5],[1,1,0,2,5,4],[0,0,1,5,5,4],[0,1,2,3,4,5]];
 for(let dx=0;dx<16;dx+=4)for(let dz=0;dz<16;dz+=4){
  const roll=hash(x0+dx,z0+dz,ground.seed+12877),x=x0+dx+roll%4,z=z0+dz+(roll>>>5)%4;
  const region=v6BiomeAt(x,z,ground.seed);if(region?.name!=='enchanted'||region.weight<.82)continue;
  const internal=regionAt(x,z,ground.seed);if(internal===null)continue;
  const col=ground._columnPlan(x,z);if(!col.size)continue;
  const floor=Math.max(...col.keys()),id=col.get(floor);
  if(!soil.has(id)||ground.get(x,floor,z)!==id||ground.get(x,floor-1,z)===BLOCK.AIR||floor>=18)continue;
  const key=[x,floor+1,z].join(',');
  if(treeRows.has(key)||treeRows.has([x,floor+2,z].join(','))||ground.get(x,floor+1,z)!==BLOCK.AIR||ground.get(x,floor+2,z)!==BLOCK.AIR)continue;
  const list=regional[internal],asset=WILDS_GROUND_FAMILIES[list[(roll>>>10)%list.length]];
  // Solid roots/crystals are sparse; don't turn the walking floor into a fence.
  if(asset.solid&&(roll>>>20)%3!==0)continue;
  rows.set(key,asset.id);
 }
 return rows;
}
