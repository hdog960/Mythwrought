// :48 opt-in physical canopy bridge between existing WOOD crown anchors.
// Pure planner: no terrain writes, save migration, renderer changes or block ID allocation.
import {BLOCK,baseBlock,WORLD_MAX_Y} from '../voxel.mjs';
const key=(x,y,z)=>`${x},${y},${z}`;
const empty=(world,x,y,z)=>baseBlock(x,y,z,world.seed)===BLOCK.AIR&&world.get(x,y,z)===BLOCK.AIR;
export function planCanopyBridge(world,a,b,{height=0}={}){
 if(!world||!Number.isSafeInteger(world.seed)||typeof world.get!=='function'||
   !Array.isArray(a)||!Array.isArray(b)||a.length!==3||b.length!==3||
   ![...a,...b,height].every(Number.isSafeInteger))return null;
 const [ax,ay,az]=a,[bx,by,bz]=b;
 const dx=bx-ax,dz=bz-az,span=Math.abs(dx||dz);
 // No diagonal gaps: a physical single-width walking surface must be face-connected.
 if(ay!==by||height!==0||ay+3>WORLD_MAX_Y||
   !((dx===0&&Math.abs(dz)>=5&&Math.abs(dz)<=12)||
     (dz===0&&Math.abs(dx)>=5&&Math.abs(dx)<=12)))return null;
 if(world.get(ax,ay,az)!==BLOCK.WOOD||world.get(bx,by,bz)!==BLOCK.WOOD)return null;
 const cells=new Map(),clearance=new Set();
 const put=(x,y,z,id)=>cells.set(key(x,y,z),[x,y,z,id]);
 const sx=Math.sign(dx),sz=Math.sign(dz);
 for(let i=1;i<span;i++){
   const x=ax+sx*i,z=az+sz*i;
   put(x,ay,z,BLOCK.WOOD);
   // Two clear blocks above every walkable deck voxel, including crown endpoints.
   clearance.add(key(x,ay+1,z));clearance.add(key(x,ay+2,z));
   // Crown at third block overhead; not a head-height obstruction.
   if(i>1&&i<span-1){
     put(x,ay+3,z,BLOCK.LEAVES);
     if(i%3===0){
       const px=sz,pz=sx;
       put(x+px,ay+3,z+pz,BLOCK.LEAVES);
       put(x-px,ay+3,z-pz,BLOCK.LEAVES);
     }
   }
 }
 for(const [x,y,z] of [a,b])for(let h=1;h<=2;h++)clearance.add(key(x,y+h,z));
 const occupied=[...cells.values()];
 if(occupied.some(([x,y,z])=>!empty(world,x,y,z)))return null;
 for(const k of clearance){
   if(cells.has(k))return null;
   const [x,y,z]=k.split(',').map(Number);
   if(!empty(world,x,y,z))return null;
 }
 return {seed:world.seed,anchors:[a.slice(),b.slice()],height,cells:occupied,
   blockCount:occupied.length,optIn:true,clearance:[...clearance]};
}
export function validateCanopyBridge(world,plan){
 if(!plan?.optIn||plan.seed!==world?.seed||!Array.isArray(plan.anchors)||
   plan.anchors.length!==2)return false;
 const fresh=planCanopyBridge(world,...plan.anchors,{height:plan.height});
 return !!fresh&&JSON.stringify(fresh)===JSON.stringify(plan);
}
