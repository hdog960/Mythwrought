// :48 opt-in physical canopy gate. All geometry is editable WOOD/LEAVES voxels.
// No terrain-generation hooks, new block IDs, or schema changes.
import {BLOCK,terrainHeight,baseBlock,WORLD_MAX_Y} from './voxel.mjs';
const key=(x,y,z)=>x+','+y+','+z;
export function planCanopyGate(world,x,z,{axis='x'}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
   !Number.isSafeInteger(x)||!Number.isSafeInteger(z)||!['x','z'].includes(axis))return null;
 const ground=terrainHeight(x,z,world.seed);
 if(ground+12>WORLD_MAX_Y||world.get(x,ground,z)!==BLOCK.GRASS)return null;
 const cells=new Map();
 const put=(u,v,y,id)=>{
  const a=x+(axis==='x'?u:v),b=ground+y,c=z+(axis==='x'?v:u);
  const k=key(a,b,c);
  if(!cells.has(k)||id===BLOCK.WOOD)cells.set(k,[a,b,c,id]);
 };
 // Two buttressed, asymmetrical trunks leave a five-wide unobstructed walk-through.
 for(const u of [-4,4]){
  for(let y=1;y<=8;y++)put(u,0,y,BLOCK.WOOD);
  for(const v of [-1,1]){put(u,v,1,BLOCK.WOOD);put(u,v,2,BLOCK.WOOD);}
  put(u+(u<0?-1:1),0,1,BLOCK.WOOD);
  for(let y=6;y<=8;y++)put(u<0?u+1:u-1,0,y,BLOCK.WOOD);
 }
 // A high timber span, with three distinct crowns (two towers and central lantern-like canopy).
 for(let u=-4;u<=4;u++)put(u,0,9,BLOCK.WOOD);
 for(const [center,top] of [[-4,11],[0,12],[4,11]]){
  for(let y=9;y<=top;y++){
   const radius=y===top?1:y===9?2:3;
   for(let du=-radius;du<=radius;du++)for(let v=-radius;v<=radius;v++){
    if(Math.abs(du)+Math.abs(v)>radius+1)continue;
    put(center+du,v,y,BLOCK.LEAVES);
   }
  }
 }
 const occupied=[...cells.values()];
 for(const [a,b,c] of occupied){
  if(baseBlock(a,b,c,world.seed)!==BLOCK.AIR||world.get(a,b,c)!==BLOCK.AIR)return null;
 }
 // Validate the entire footprint in its rotated orientation, including player edits.
 for(let u=-6;u<=6;u++)for(let v=-3;v<=3;v++){
  const a=x+(axis==='x'?u:v),c=z+(axis==='x'?v:u);
  const h=terrainHeight(a,c,world.seed);
  if(Math.abs(h-ground)>1||world.get(a,h,c)!==baseBlock(a,h,c,world.seed))return null;
 }
 return {seed:world.seed,origin:[x,ground,z],kind:'canopy-gate',axis,optIn:true,cells:occupied};
}
export function placeCanopyGate(world,plan){
 if(!world||typeof world.get!=='function'||typeof world.set!=='function'||
   !plan?.optIn||plan.kind!=='canopy-gate'||plan.seed!==world.seed||
   !Array.isArray(plan.origin)||plan.origin.length!==3||!['x','z'].includes(plan.axis))return false;
 const [x,y,z]=plan.origin;
 const fresh=planCanopyGate(world,x,z,{axis:plan.axis});
 if(!fresh||fresh.origin[1]!==y||!Array.isArray(plan.cells)||plan.cells.length!==fresh.cells.length)return false;
 for(let i=0;i<fresh.cells.length;i++){
  const a=plan.cells[i],b=fresh.cells[i];
  if(!Array.isArray(a)||a.length!==4||a.some((v,j)=>v!==b[j]))return false;
 }
 const written=[];
 try{
  for(const [a,b,c,id] of fresh.cells){
   if(!world.set(a,b,c,id))throw Error('canopy gate write rejected');
   written.push([a,b,c]);
  }
 }catch{
  let failed=false;
  for(let i=written.length-1;i>=0;i--){
   const [a,b,c]=written[i];
   try{if(!world.set(a,b,c,BLOCK.AIR))failed=true;}catch{failed=true;}
  }
  if(failed)throw Error('canopy gate rollback incomplete; inspect saved edits');
  return false;
 }
 return true;
}
