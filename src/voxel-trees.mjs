// Gate A :48: physical tree voxel templates, opt-in only; never change seeded terrain.
// Real LEAVES (ID 7) provide physical foliage; never replace saved world edits.
// Each occupied cell is a real world voxel, not a decorative mesh triangle.
import {BLOCK,terrainHeight,baseBlock,WORLD_MAX_Y} from './voxel.mjs';
export const TREE_VARIANTS=Object.freeze(['roundwood','spire','windswept','elderwood','archwood']);
const key=(x,y,z)=>x+','+y+','+z;
export function planVoxelTree(world,x,z,{variant='roundwood',leafId=BLOCK.LEAVES??BLOCK.GRASS}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
    !Number.isInteger(x)||!Number.isInteger(z)||!TREE_VARIANTS.includes(variant)||
    ![BLOCK.GRASS,BLOCK.CRYSTAL,BLOCK.LEAVES].includes(leafId))return null;
 const ground=terrainHeight(x,z,world.seed);
 const height=variant==='elderwood'?8:variant==='archwood'?7:variant==='spire'?7:variant==='windswept'?6:5;
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
 }else if(variant==='archwood'){
  // Twin rooted supports and a continuous, walkable wooden canopy span.
  // The far root must stand on untouched grass at the same elevation.
  if(terrainHeight(x+6,z,world.seed)!==ground||
     world.get(x+6,ground,z)!==BLOCK.GRASS||
     baseBlock(x+6,ground,z,world.seed)!==BLOCK.GRASS)return null;
  for(let dy=1;dy<=height;dy++)put(6,dy,0,BLOCK.WOOD);
  for(let dx=0;dx<=6;dx++){
   put(dx,height,0,BLOCK.WOOD);
   for(let dz=-1;dz<=1;dz++){
    if(dz!==0)put(dx,height-1,dz,BLOCK.WOOD);
    // Keep a two-voxel-high unobstructed center aisle above the deck.
    // Leaves form raised side crowns instead of blocking traversal.
    if(dz!==0)for(let dy=height+1;dy<=height+2;dy++)
     put(dx,dy,dz,leafId);
   }
  }
  for(const dx of [0,6])for(const dz of [-2,2])
   for(let dy=height-1;dy<=height+1;dy++)put(dx,dy,dz,leafId);
 }else if(variant==='elderwood'){
  // A broad ancient crown with four heavy limbs and stepped aerial roots.
  // Every component is a real editable voxel; no render-only canopy.
  for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){
   put(dx,1,dz,BLOCK.WOOD);
   put(dx,2,dz,BLOCK.WOOD);
   for(let reach=1;reach<=3;reach++)put(dx*reach,height-2,dz*reach,BLOCK.WOOD);
  }
  for(let dy=height-3;dy<=height+2;dy++){
   const radius=dy===height+2?1:dy===height-3?2:3;
   for(let dx=-radius;dx<=radius;dx++)for(let dz=-radius;dz<=radius;dz++){
    if(Math.abs(dx)+Math.abs(dz)>radius+2||
       cells.has(key(x+dx,ground+dy,z+dz)))continue;
    put(dx,dy,dz,leafId);
   }
  }
 }else{
  for(let dx=1;dx<=3;dx++)put(dx,height-1,0,BLOCK.WOOD);
  for(let dx=0;dx<=4;dx++)for(let dz=-2;dz<=2;dz++)
   for(let dy=height-1;dy<=height+1;dy++)
    if(Math.abs(dz)+Math.abs(dy-height)+(dx===4?1:0)<=2 &&
       !cells.has(key(x+dx,ground+dy,z+dz)))put(dx,dy,dz,leafId);
 }
 // A crown bridge is not a traversable destination when its entrances are
 // obstructed. Check a two-block-high, three-wide approach at both ends,
 // including player edits and already integrated district/landmark voxels.
 // This is an opt-in planning guard; no terrain or saved blocks are changed.
 if(variant==='archwood')for(const dx of [-2,-1,7,8])
  for(let dz=-1;dz<=1;dz++)for(let dy=1;dy<=2;dy++){
   const px=x+dx,py=ground+dy,pz=z+dz;
   if(baseBlock(px,py,pz,world.seed)!==BLOCK.AIR||
      world.get(px,py,pz)!==BLOCK.AIR)return null;
  }
 const occupied=[...cells.values()];
 // Never touch player edits, another structure, terrain or a cave opening.
 // Require original grass below the trunk and naturally empty air everywhere above.
 for(const [px,py,pz] of occupied){
  if(py>WORLD_MAX_Y||baseBlock(px,py,pz,world.seed)!==BLOCK.AIR||
     world.get(px,py,pz)!==BLOCK.AIR)return null;
 }
 for(let dx=-2;dx<=(variant==='archwood'?8:2);dx++)for(let dz=-2;dz<=2;dz++){
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
 // Placement is all-or-nothing for ordinary set failures. Revalidation above
 // ensures every target is originally AIR, so reversing successful writes
 // restores both occupancy and the schema-1 edit representation.
 const written=[];
 try{
  for(const [x,y,z,id] of fresh.cells){
   if(!world.set(x,y,z,id))throw Error('tree voxel write rejected');
   written.push([x,y,z]);
  }
 }catch{
  for(let i=written.length-1;i>=0;i--){
   const [x,y,z]=written[i];
   if(!world.set(x,y,z,BLOCK.AIR))
    throw Error('tree placement rollback failed; world may be partially edited');
  }
  return false;
 }
 return true;
}
