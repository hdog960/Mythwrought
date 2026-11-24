// Quiet snapshot only. Bounded direct canonical edit lookups; no iteration
// across unrelated saved rows, no live writer fence or placement authority.
import {WORLD_MIN_Y,WORLD_MAX_Y} from '../depth.mjs';
import {worldKey} from '../voxel.mjs';
export const P0_APPROACH_EDIT_LOOKUP_MAX=24*(WORLD_MAX_Y-WORLD_MIN_Y+1);
export function auditP0ApproachEdits(world,columns){
  if(!Array.isArray(columns)||columns.length>24||typeof world?.edits?.has!=='function')
    throw Error('Invalid approach edit audit');
  let lookups=0;
  const seen=new Set();
  for(const [x,z] of columns){
    if(![x,z].every(Number.isSafeInteger))throw Error('Invalid approach column');
    const c=x+','+z;if(seen.has(c))throw Error('Duplicate approach column');seen.add(c);
    for(let y=WORLD_MIN_Y;y<=WORLD_MAX_Y;y++){
      const key=worldKey(x,y,z);lookups++;
      if(world.edits.has(key))return Object.freeze({ok:false,key,lookups});
    }
  }
  return Object.freeze({ok:true,lookups});
}
