// :48 opt-in physical fallen giant: a readable woodland discovery, never automatic worldgen.
// Uses only integrated WOOD=4 and LEAVES=7. No save schema, depth or terrain edits.
import {BLOCK,baseBlock,terrainHeight,WORLD_MAX_Y} from './voxel.mjs';
export function planFallenGiant(world,x,z,{axis='x',length=9}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
    !Number.isInteger(x)||!Number.isInteger(z)||!['x','z'].includes(axis)||
    !Number.isInteger(length)||length<7||length>13||length%2!==1)return null;
 const mid=(length-1)/2,ground=terrainHeight(x,z,world.seed);
 if(ground+5>WORLD_MAX_Y)return null;
 const cells=new Map(),key=(a,b,c)=>a+','+b+','+c;
 const add=(a,b,c,id)=>cells.set(key(a,b,c),[a,b,c,id]);
 const along=(i,side=0)=>axis==='x'?[x+i,z+side]:[x+side,z+i];
 // Trunk is horizontal, raised on two natural-looking root stumps.
 for(let i=-mid;i<=mid;i++){
  const [a,c]=along(i);add(a,ground+2,c,BLOCK.WOOD);
  if(Math.abs(i)===mid-1||Math.abs(i)===mid){
   add(a,ground+1,c,BLOCK.WOOD);
  }
 }
 // Three broken forked boughs, irregular but seed-stable.
 for(const i of [-mid+2,0,mid-2]){
  const side=((world.seed+i)&1)?1:-1;
  for(let reach=1;reach<=2;reach++){
   const [a,c]=along(i,side*reach);
   add(a,ground+2,c,BLOCK.WOOD);
  }
  const [a,c]=along(i,side*3);
  add(a,ground+2,c,BLOCK.LEAVES);
  add(a,ground+3,c,BLOCK.LEAVES);
  const [b,d]=along(i,side*2);
  add(b,ground+3,d,BLOCK.LEAVES);
 }
 // Clear 3-block-wide walking aisles on both sides; avoid hills, caves,
 // previous world edits, generated buildings and every occupied voxel.
 for(let i=-mid-1;i<=mid+1;i++)for(const side of [-2,-1,0,1,2]){
  const [a,c]=along(i,side),h=terrainHeight(a,c,world.seed);
  if(Math.abs(h-ground)>1||world.get(a,h,c)!==baseBlock(a,h,c,world.seed))return null;
 }
 const occupied=[...cells.values()].sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
 for(const [a,b,c] of occupied)
  if(b>WORLD_MAX_Y||baseBlock(a,b,c,world.seed)!==BLOCK.AIR||
     world.get(a,b,c)!==BLOCK.AIR)return null;
 return {origin:[x,ground,z],axis,length,seed:world.seed,cells:occupied,optIn:true};
}
export function placeFallenGiant(world,plan){
 if(!world||typeof world.set!=='function'||!plan?.optIn||
    !Array.isArray(plan.origin)||plan.seed!==world.seed)return false;
 const fresh=planFallenGiant(world,plan.origin[0],plan.origin[2],
  {axis:plan.axis,length:plan.length});
 if(!fresh||fresh.origin.some((n,i)=>n!==plan.origin[i])||
    !Array.isArray(plan.cells)||plan.cells.length!==fresh.cells.length||
    !fresh.cells.every((c,i)=>Array.isArray(plan.cells[i])&&
      c.every((n,j)=>n===plan.cells[i][j])))return false;
 const written=[];
 try{
  for(const [a,b,c,id] of fresh.cells){
   if(!world.set(a,b,c,id))throw Error('write rejected');
   written.push([a,b,c]);
  }
 }catch{
  for(let i=written.length-1;i>=0;i--){
   const [a,b,c]=written[i];
   if(!world.set(a,b,c,BLOCK.AIR))throw Error('rollback failed');
  }
  return false;
 }
 return true;
}
