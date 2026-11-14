// Gate A :36 — opt-in, physical ruined arch; no seeded world changes.
import {BLOCK,terrainHeight,baseBlock,WORLD_MIN_Y,WORLD_MAX_Y} from './voxel.mjs';
export function planVoxelRuinedArch(world,x,z){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||!Number.isInteger(x)||!Number.isInteger(z))return null;
 const h=terrainHeight(x,z,world.seed);
 if(h-2<WORLD_MIN_Y||h+7>WORLD_MAX_Y)return null;
 // Seven-by-five protected footprint, including the walk-through and foundations.
 for(let dx=-3;dx<=3;dx++)for(let dz=-2;dz<=2;dz++){
  const px=x+dx,pz=z+dz;
  if(terrainHeight(px,pz,world.seed)!==h)return null;
  if(world.get(px,h,pz)!==BLOCK.GRASS)return null;
  for(let y=h-2;y<=h+7;y++){
   if(world.get(px,y,pz)!==baseBlock(px,y,pz,world.seed))return null;
   if(y>=h+1&&baseBlock(px,y,pz,world.seed)!==BLOCK.AIR)return null;
  }
  if(baseBlock(px,h-2,pz,world.seed)===BLOCK.AIR)return null;
 }
 const cells=[],used=new Set();
 const put=(dx,dy,dz)=>{
  const px=x+dx,py=h+dy,pz=z+dz,k=px+','+py+','+pz;
  if(!used.has(k)){used.add(k);cells.push([px,py,pz,BLOCK.STONE]);}
 };
 // Two broken buttressed piers and a raised lintel, with a 3-wide, 4-high opening.
 for(const dx of [-2,2]){
  for(let dy=0;dy<=5;dy++)put(dx,dy,0);
  for(let dy=0;dy<=2;dy++)put(dx,dy,-1);
  put(dx,0,1);
 }
 for(let dx=-2;dx<=2;dx++)put(dx,5,0);
 // Uneven broken crown: silhouette is recognizable without closing the passage.
 for(const dx of [-2,-1,1])put(dx,6,0);
 // Grounded side fragments, outside the central walking corridor.
 put(-3,0,0);put(3,0,0);put(-3,1,0);put(3,1,0);
 return Object.freeze({origin:[x,h,z],cells,entrance:[x,h+1,z+1],exit:[x,h+1,z-1],
  materialIds:[BLOCK.STONE],blockCount:cells.length,optIn:true});
}
export function placeVoxelRuinedArch(world,plan){
 if(!plan?.optIn||!Array.isArray(plan.origin)||!Array.isArray(plan.cells)||typeof world?.set!=='function')return false;
 const [x,h,z]=plan.origin;
 if(![x,h,z].every(Number.isInteger))return false;
 const fresh=planVoxelRuinedArch(world,x,z);
 if(!fresh||fresh.origin[1]!==h||fresh.blockCount!==plan.blockCount||plan.cells.length!==fresh.cells.length)return false;
 for(let i=0;i<fresh.cells.length;i++)
  if(!Array.isArray(plan.cells[i])||plan.cells[i].length!==4||
    plan.cells[i].some((v,j)=>v!==fresh.cells[i][j]))return false;
 // Preflight prevents overwriting saved edits; opt-in only.
 for(const [px,py,pz,id] of fresh.cells)if(!world.set(px,py,pz,id))return false;
 return true;
}
