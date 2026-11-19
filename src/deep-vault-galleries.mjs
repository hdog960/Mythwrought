// :36 cave-only candidate: four connected lateral vaults for the opt-in :24 descent.
// No global height, terrain, registry, save or UI mutation. Requires explicit
// manual connection to the descent reader and deep section mesher.
import {WORLD_MIN_Y, WORLD_MAX_Y, LEGACY_WORLD_MIN_Y} from './depth.mjs';
import {BLOCK,worldKey} from './voxel.mjs';

export const VAULT_LEVELS=Object.freeze([-30,-75,-130,-185]);
export const VAULT_JUNCTION=Object.freeze({x:104,z:84});
const cache=new Map();
function build(seed){
  const map=new Map();
  const set=(x,y,z,id)=>{
    if(y>=LEGACY_WORLD_MIN_Y||y<WORLD_MIN_Y||y>WORLD_MAX_Y)return;
    map.set(worldKey(x,y,z),id);
  };
  // Four lateral galleries leave the descent at x=104 and lead to
  // broad asymmetric vaulted rooms. No shafts or floating entrances.
  for(let band=0;band<VAULT_LEVELS.length;band++){
    const floor=VAULT_LEVELS[band];
    const roomX=116+band*2,roomZ=84+(band%2?5:-5);
    const radius=9+band;
    // A 3-wide passage first runs east, then turns north/south to
    // intersect the room; a player can walk without jumping.
    for(let x=103;x<=roomX;x++)
      for(let z=83;z<=85;z++)
        for(let y=floor;y<=floor+4;y++)
          set(x,y,z,y===floor?BLOCK.DEEPSTONE:BLOCK.AIR);
    const z0=Math.min(84,roomZ),z1=Math.max(84,roomZ);
    for(let z=z0;z<=z1;z++)
      for(let x=roomX-1;x<=roomX+1;x++)
        for(let y=floor;y<=floor+5;y++)
          set(x,y,z,y===floor?BLOCK.DEEPSTONE:BLOCK.AIR);
    for(let dx=-radius;dx<=radius;dx++)
      for(let dz=-radius;dz<=radius;dz++){
        // Rounded irregular boundary is deterministic, not randomized per read.
        const wobble=((Math.imul(dx+31,73856093)^Math.imul(dz+17,19349663)^seed)>>>0)%5;
        if(dx*dx+dz*dz>(radius-1+wobble*.25)**2)continue;
        const x=roomX+dx,z=roomZ+dz;
        set(x,floor,z,BLOCK.DEEPSTONE);
        const roof=5+Math.max(0,Math.floor((radius-Math.hypot(dx,dz))/3));
        for(let dy=1;dy<=roof;dy++)set(x,floor+dy,z,BLOCK.AIR);
      }
  }
  return map;
}
export function deepVaultWorld(world){
  if(!world||typeof world.get!=='function'||!(world.edits instanceof Map))
    throw Error('Invalid deep vault world');
  const seed=world.seed|0;
  let cells=cache.get(seed);
  if(!cells){cells=build(seed);cache.set(seed,cells);
    if(cache.size>2)cache.delete(cache.keys().next().value);}
  return {seed:world.seed,edits:world.edits,rotations:world.rotations,
    rotationAt:(...args)=>world.rotationAt?.(...args)??0,
    get(x,y,z){
      const key=worldKey(x,y,z);
      if(world.edits.has(key))return world.get(x,y,z);
      return cells.get(key)??world.get(x,y,z);
    }};
}
// Explicit seam: compose deepVaultWorld(deepCaveWorld(world)) ONLY after
// the descent's centerline at x=104,z=84 is physically verified at each
// target floor. This module does not falsely claim an active entrance.
export function deepVaultEvidence(world){
  const reader=deepVaultWorld(world);
  return VAULT_LEVELS.map((floor,band)=>{
    const x=116+band*2,z=84+(band%2?5:-5);
    let air=0,solid=0;
    for(let dx=-5;dx<=5;dx++)for(let dz=-5;dz<=5;dz++){
      if(reader.get(x+dx,floor+2,z+dz)===BLOCK.AIR)air++;
      if(reader.get(x+dx,floor,z+dz)!==BLOCK.AIR)solid++;
    }
    const approach=[];
    for(let px=104;px<=x;px++)approach.push([px,floor+1,84]);
    for(let pz=Math.min(z,84);pz<=Math.max(z,84);pz++)
      approach.push([x,floor+1,pz]);
    const failures=approach.filter(([px,feet,pz])=>
      reader.get(px,feet-1,pz)===BLOCK.AIR||
      reader.get(px,feet,pz)!==BLOCK.AIR||
      reader.get(px,feet+1,pz)!==BLOCK.AIR);
    return {floor,air,solid,approach:approach.length,failures:failures.length};
  });
}

// Cave integration #240: a source-exact snapshot of the original four vaults;
// callers cannot mutate the canonical cached world reader.
export function deepVaultCells(seed=179){
  if(!Number.isSafeInteger(seed))throw Error('Invalid vault seed');
  return new Map(build(seed));
}
