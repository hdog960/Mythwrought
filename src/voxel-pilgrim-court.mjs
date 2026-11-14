// Gate A :36 — a two-gateway pilgrim court built entirely from integrated STONE voxels.
// Opt-in only: never changes seeded terrain, spawn, or saved worlds on import.
import {planVoxelRuinedArch} from './voxel-ruined-arch.mjs';
import {BLOCK,baseBlock,terrainHeight} from './voxel.mjs';

export function planVoxelPilgrimCourt(world,x,z){
  if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||!Number.isInteger(x)||!Number.isInteger(z))return null;
  // Two distinct, parallel, walk-through gates with an open nine-block approach.
  const south=planVoxelRuinedArch(world,x,z-9);
  const north=planVoxelRuinedArch(world,x,z+9);
  if(!south||!north||south.origin[1]!==north.origin[1])return null;
  const cells=[...south.cells,...north.cells];
  const keys=new Set(cells.map(([a,b,c])=>a+','+b+','+c));
  if(keys.size!==cells.length)return null;
  const h=south.origin[1];
  // The entire connecting corridor must be naturally walkable and untouched.
  for(let dz=-6;dz<=6;dz++)for(let dx=-1;dx<=1;dx++){
    const px=x+dx,pz=z+dz;
    if(terrainHeight(px,pz,world.seed)!==h||baseBlock(px,h,pz,world.seed)!==BLOCK.GRASS)return null;
    for(let dy=-2;dy<=3;dy++){
      const py=h+dy,baseline=baseBlock(px,py,pz,world.seed);
      if(world.get(px,py,pz)!==baseline)return null;
      if(dy>0&&baseline!==BLOCK.AIR)return null;
      if(dy===-2&&baseline===BLOCK.AIR)return null;
    }
  }
  return Object.freeze({
    origin:[x,h,z],gates:[south,north],cells,blockCount:cells.length,
    entrance:[x,h+1,z-11],exit:[x,h+1,z+11],materialIds:[3],optIn:true
  });
}

// Native VoxelWorld edit-map transaction: failed writes restore the original
// schema-1 edit map, including edits unrelated to the court.
export function placeVoxelPilgrimCourt(world,plan){
  if(!plan?.optIn||!Array.isArray(plan.origin)||!Array.isArray(plan.cells)||
     !(world?.edits instanceof Map)||typeof world.set!=='function')return false;
  const [x,h,z]=plan.origin;
  if(![x,h,z].every(Number.isInteger))return false;
  const fresh=planVoxelPilgrimCourt(world,x,z);
  if(!fresh||fresh.origin[1]!==h||fresh.cells.length!==plan.cells.length||
     !plan.cells.every((cell,i)=>Array.isArray(cell)&&cell.length===4&&
       cell.every((v,j)=>v===fresh.cells[i][j])))return false;
  const before=new Map(world.edits);
  try{
    for(const [px,py,pz,id] of fresh.cells)
      if(world.set(px,py,pz,id)!==true)throw Error('Voxel write rejected');
    return true;
  }catch{
    world.edits.clear();
    for(const [key,id] of before)world.edits.set(key,id);
    return false;
  }
}
