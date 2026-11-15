// :48 optional physical access stairs for the existing opt-in archwood canopy.
// No default-world generation, material registration or saved-world migration.
import {BLOCK,baseBlock,terrainHeight,WORLD_MAX_Y} from './voxel.mjs';
import {planVoxelTree,placeVoxelTree} from './voxel-trees.mjs';

const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function planArchwoodAccess(world,x,z){
  if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function')return null;
  const tree=planVoxelTree(world,x,z,{variant:'archwood'});
  if(!tree)return null;
  const y=tree.origin[1],cells=[];
  // Each stair rises exactly one voxel; players can jump up the physical blocks.
  // Landing at x=-1 / x=7 is one level below the bridge at x=0..6.
  for(const side of [-1,1])for(let step=1;step<=6;step++){
    const dx=side<0?-7+step:13-step;
    const level=step;
    const px=x+dx;
    if(terrainHeight(px,z,world.seed)!==y ||
       world.get(px,y,z)!==BLOCK.GRASS ||
       baseBlock(px,y,z,world.seed)!==BLOCK.GRASS)return null;
    const py=y+level;
    if(py+2>WORLD_MAX_Y)return null;
    // Stair body, two cells of standing clearance, and neighboring shoulder
    // must all remain naturally empty and free of player edits.
    for(let dy=1;dy<=level+2;dy++)for(let dz=-1;dz<=1;dz++){
      const cy=y+dy,cz=z+dz;
      if(baseBlock(px,cy,cz,world.seed)!==BLOCK.AIR||
         world.get(px,cy,cz)!==BLOCK.AIR)return null;
    }
    // Filled steps are physical support, not floating isolated slabs.
    for(let dy=1;dy<=level;dy++)cells.push([px,y+dy,z,BLOCK.WOOD]);
  }
  // The bridge's own approach guard must remain valid.
  return {origin:[x,y,z],seed:world.seed,tree,cells,optIn:true};
}
export function placeArchwoodAccess(world,plan){
  if(!world||typeof world.set!=='function'||!plan?.optIn||
     !Array.isArray(plan.origin)||plan.seed!==world.seed)return false;
  const fresh=planArchwoodAccess(world,plan.origin[0],plan.origin[2]);
  if(!fresh||!same(plan,fresh))return false;
  // Install bridge and stairs together only when all target cells are clear.
  // A failure before the bridge installation leaves the world unchanged.
  // This is a staged interface: callers must opt in and accept that a failed
  // second-stage write requires explicit rollback of the first-stage writes.
  const written=[];
  try{
    for(const [x,y,z,id] of fresh.cells){
      if(!world.set(x,y,z,id))throw Error('stair write rejected');
      written.push([x,y,z]);
    }
    if(!placeVoxelTree(world,fresh.tree))throw Error('bridge write rejected');
    return true;
  }catch{
    for(let i=written.length-1;i>=0;i--){
      const [x,y,z]=written[i];
      if(!world.set(x,y,z,BLOCK.AIR))throw Error('archwood stair rollback failed');
    }
    return false;
  }
}
