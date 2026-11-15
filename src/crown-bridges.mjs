// :48 opt-in physical canopy connector. No worldgen, registry or save migrations.
import {BLOCK,baseBlock,WORLD_MAX_Y} from './voxel.mjs';
const coordKey=(x,y,z)=>`${x},${y},${z}`;
const integer3=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isInteger);
function candidate(world,a,b){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||!integer3(a)||!integer3(b))return null;
 const [ax,ay,az]=a,[bx,by,bz]=b;
 const dx=bx-ax,dz=bz-az;
 const length=Math.abs(dx)+Math.abs(dz);
 if(ay!==by||ay<2||ay+2>WORLD_MAX_Y||length<4||length>9||!(dx===0||dz===0))return null;
 const sx=Math.sign(dx),sz=Math.sign(dz),cells=[];
 // Both endpoints must be existing solid wooden crown limbs. The connector
 // occupies only the gap; existing foliage and trunks are never replaced.
 if(world.get(ax,ay,az)!==BLOCK.WOOD||world.get(bx,by,bz)!==BLOCK.WOOD)return null;
 for(let i=1;i<length;i++){
  const x=ax+sx*i,z=az+sz*i;
  // Solid walkable timber floor with two leaf guardrails above the floor.
  const cross=dx===0?[[x-1,ay+1,z],[x+1,ay+1,z]]:[[x,ay+1,z-1],[x,ay+1,z+1]];
  cells.push([x,ay,z,BLOCK.WOOD]);
  for(const [cx,cy,cz] of cross)cells.push([cx,cy,cz,BLOCK.LEAVES]);
 }
 const seen=new Set();
 for(const [x,y,z] of cells){
  const k=coordKey(x,y,z);
  if(seen.has(k)||baseBlock(x,y,z,world.seed)!==BLOCK.AIR||world.get(x,y,z)!==BLOCK.AIR)return null;
  seen.add(k);
 }
 // Keep a two-block clear headroom above the walkway, including the endpoints.
 for(let i=0;i<=length;i++){
  const x=ax+sx*i,z=az+sz*i;
  for(let h=1;h<=2;h++){
   if(world.get(x,ay+h,z)!==BLOCK.AIR)return null;
  }
 }
 return {seed:world.seed,a:[...a],b:[...b],cells,blockCount:cells.length,optIn:true};
}
export function planCrownBridge(world,a,b){return candidate(world,a,b);}
export function placeCrownBridge(world,plan){
 if(!world||typeof world.set!=='function'||!plan?.optIn||plan.seed!==world.seed)return false;
 const fresh=candidate(world,plan.a,plan.b);
 if(!fresh||!Array.isArray(plan.cells)||plan.blockCount!==fresh.blockCount||
    JSON.stringify(plan.cells)!==JSON.stringify(fresh.cells))return false;
 const written=[];
 try{
  for(const [x,y,z,id] of fresh.cells){
   if(!world.set(x,y,z,id))throw Error('rejected bridge cell');
   written.push([x,y,z]);
  }
 }catch{
  for(let i=written.length-1;i>=0;i--){
   const [x,y,z]=written[i];
   if(!world.set(x,y,z,BLOCK.AIR))throw Error('bridge rollback failed');
  }
  return false;
 }
 return true;
}
