// :48 opt-in twinwood: a monumental forked tree made exclusively of physical voxels.
// No default biome placement or changes to existing seed-derived trees.
import {BLOCK,terrainHeight,baseBlock,WORLD_MAX_Y} from './voxel.mjs';
const key=(x,y,z)=>x+','+y+','+z;
export function planTwinwood(world,x,z){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
    !Number.isSafeInteger(x)||!Number.isSafeInteger(z))return null;
 const ground=terrainHeight(x,z,world.seed);
 if(ground+11>WORLD_MAX_Y||world.get(x,ground,z)!==BLOCK.GRASS)return null;
 const cells=new Map();
 const put=(dx,dy,dz,id)=>{
  const a=x+dx,b=ground+dy,c=z+dz;
  const k=key(a,b,c),old=cells.get(k);
  if(!old||id===BLOCK.WOOD)cells.set(k,[a,b,c,id]);
 };
 // Two rooted stems converge into a walk-under natural arch.
 for(let dy=1;dy<=6;dy++){
  put(-2,dy,0,BLOCK.WOOD);put(2,dy,0,BLOCK.WOOD);
 }
 for(let dy=5;dy<=7;dy++){put(-1,dy,0,BLOCK.WOOD);put(1,dy,0,BLOCK.WOOD);}
 for(let dx=-2;dx<=2;dx++)put(dx,7,0,BLOCK.WOOD);
 // Distinct raised twin crowns with a continuous leaf bridge above head height.
 for(const center of [-2,2]){
  for(let dy=7;dy<=10;dy++){
   const radius=dy===10?1:dy===7?2:3;
   for(let dx=-radius;dx<=radius;dx++)for(let dz=-radius;dz<=radius;dz++){
    if(Math.abs(dx)+Math.abs(dz)>radius+1)continue;
    put(center+dx,dy,dz,BLOCK.LEAVES);
   }
  }
 }
 // Low buttresses face outward, keeping the central 3-wide passage open.
 for(const sign of [-1,1]){put(sign*3,1,0,BLOCK.WOOD);put(sign*3,2,0,BLOCK.WOOD);}
 const occupied=[...cells.values()];
 for(const [a,b,c] of occupied){
  if(baseBlock(a,b,c,world.seed)!==BLOCK.AIR||world.get(a,b,c)!==BLOCK.AIR)return null;
 }
 for(let dx=-3;dx<=3;dx++)for(let dz=-2;dz<=2;dz++){
  const h=terrainHeight(x+dx,z+dz,world.seed);
  if(Math.abs(h-ground)>1||world.get(x+dx,h,z+dz)!==baseBlock(x+dx,h,z+dz,world.seed))return null;
 }
 return {seed:world.seed,origin:[x,ground,z],kind:'twinwood',optIn:true,cells:occupied};
}
export function placeTwinwood(world,plan){
 if(!world||typeof world.set!=='function'||typeof world.get!=='function'||
    !plan?.optIn||plan.kind!=='twinwood'||plan.seed!==world.seed||
    !Array.isArray(plan.origin)||plan.origin.length!==3)return false;
 const [x,y,z]=plan.origin;
 const fresh=planTwinwood(world,x,z);
 if(!fresh||fresh.origin[1]!==y||!Array.isArray(plan.cells)||
    plan.cells.length!==fresh.cells.length)return false;
 for(let i=0;i<fresh.cells.length;i++){
  const a=plan.cells[i],b=fresh.cells[i];
  if(!Array.isArray(a)||a.length!==4||a.some((v,j)=>v!==b[j]))return false;
 }
 const written=[];
 try{
  for(const [a,b,c,id] of fresh.cells){
   if(!world.set(a,b,c,id))throw Error('write rejected');
   written.push([a,b,c]);
  }
 }catch{
  for(let i=written.length-1;i>=0;i--){
   const [a,b,c]=written[i];
   if(!world.set(a,b,c,BLOCK.AIR))
    throw Error('twinwood rollback failed; inspect saved edits');
  }
  return false;
 }
 return true;
}
