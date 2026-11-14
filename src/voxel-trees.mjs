// Gate A :48: physical tree voxel templates, opt-in only; never change seeded terrain.
// Foliage temporarily uses existing GRASS (ID 1) until :00 reserves a leaf block.
// Each occupied cell is a real world voxel, not a decorative mesh triangle.
import {BLOCK,terrainHeight,baseBlock,WORLD_MAX_Y} from './voxel.mjs';
export const TREE_VARIANTS=Object.freeze(['roundwood','spire','windswept']);
const key=(x,y,z)=>x+','+y+','+z';
export function planVoxelTree(world,x,z,{variant='roundwood',leafId=BLOCK.LEAVES??BLOCK.GRASS}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
    !Number.isInteger(x)||!Number.isInteger(z)||!TREE_VARIANTS.includes(variant)||
    ![BLOCK.GRASS,BLOCK.CRYSTAL,BLOCK.LEAVES].includes(leafId))return null;
 const ground=terrainHeight(x,z,world.seed);
 const height=variant==='spire'?7:variant==='windswept'?6:5;
 if(ground+height+2>WORLD_MAX_Y||world.get(x,ground,z)!==BLOCK.GRASS)return null;
 const cells=new Map();
 const put=(dx,dy,dz,id)=>{
  const px=x+dx,py=ground+dy,pz=z+dz;
  cells.set(key(px,py,pz),[px,py,pz,id]);
 };
 // A trunk, physical forked branches and an asymmetric silhouette.
 for(let dy=1;dy<=height;dy++)put(0,dy,0,BLOCK.WOOD);
 if(variant==='roundwood'){
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   put(dx,height-1,dz,BLOCK.WOOD);
   put(dx*2,height-1,dz,leafId);
  }
  for(let dy=height-1;dy<=height+1;dy++)
   for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++)
    if(Math.abs(dx)+Math.abs(dz)+(dy===height+1?1:0)<=3 &&
       !cells.has(key(x+dx,ground+dy,z+dz)))put(dx,dy,dz,leafId);
 }else if(variant==='spire'){
  for(let dy=height-3;dy<=height+2;dy++){
   const radius=dy>=height+1?0:dy>=height-1?1:2;
   for(let dx=-radius;dx<=radius;dx++)for(let dz=-radius;dz<=radius;dz++)
    if(Math.abs(dx)+Math.abs(dz)<=radius+1&&!cells.has(key(x+dx,ground+dy,z+dz)))
     put(dx,dy,dz,leafId);
  }
 }else{
  for(let dx=1;dx<=3;dx++)put(dx,height-1,0,BLOCK.WOOD);
  for(let dx=0;dx<=4;dx++)for(let dz=-2;dz<=2;dz++)
   for(let dy=height-1;dy<=height+1;dy++)
    if(Math.abs(dz)+Math.abs(dy-height)+(dx===4?1:0)<=2 &&
       !cells.has(key(x+dx,ground+dy,z+dz)))put(dx,dy,dz,leafId);
 }
 const occupied=[...cells.values()];
 // Never touch player edits, another structure, terrain or a cave opening.
 // Require original grass below the trunk and naturally empty air everywhere above.
 for(const [px,py,pz] of occupied){
  if(py>WORLD_MAX_Y||baseBlock(px,py,pz,world.seed)!==BLOCK.AIR||
     world.get(px,py,pz)!==BLOCK.AIR)return null;
 }
 for(let dx=-2;dx<=2;dx++)for(let dz=-2;dz<=2;dz++){
  const h=terrainHeight(x+dx,z+dz,world.seed);
  if(Math.abs(h-ground)>1||world.get(x+dx,h,z+dz)!==baseBlock(x+dx,h,z+dz,world.seed))return null;
 }
 return {origin:[x,ground,z],seed:world.seed,variant,leafId,cells:occupied,blockCount:occupied.length,optIn:true};
}
export function placeVoxelTree(world,plan){
 if(!world||typeof world.set!=='function'||typeof world.get!=='function'||
    !plan?.optIn||!Array.isArray(plan.origin)||plan.origin.length!==3||
    !Number.isInteger(plan.seed)||plan.seed!==world.seed||
    !TREE_VARIANTS.includes(plan.variant)||!Number.isInteger(plan.leafId))return false;
 // Replan from the actual seed and unedited surroundings. A caller cannot
 // truncate the canopy, inject arbitrary voxels, or replay onto another seed.
 const fresh=planVoxelTree(world,plan.origin[0],plan.origin[2],
   {variant:plan.variant,leafId:plan.leafId});
 if(!fresh||!Array.isArray(plan.cells)||plan.cells.length!==fresh.cells.length||
    plan.blockCount!==fresh.blockCount||
    plan.origin.some((v,i)=>v!==fresh.origin[i]))return false;
 for(let i=0;i<fresh.cells.length;i++){
  const expected=fresh.cells[i],actual=plan.cells[i];
  if(!Array.isArray(actual)||actual.length!==4||
     actual.some((v,j)=>v!==expected[j]))return false;
 }
 // Validate before writing. World.set is the existing ordinary voxel edit API.
 for(const [x,y,z,id] of fresh.cells)if(!world.set(x,y,z,id))return false;
 return true;
}
