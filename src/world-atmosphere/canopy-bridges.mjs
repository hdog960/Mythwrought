// :48 opt-in physical canopy bridges. No terrain, save, renderer or ID changes.
// A bridge joins two existing tree crowns without replacing a single player edit.
import {BLOCK,baseBlock,WORLD_MAX_Y} from '../voxel.mjs';
const key=(x,y,z)=>`${x},${y},${z}`;
export function planCanopyBridge(world,a,b,{height=0}={}){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
   !Array.isArray(a)||!Array.isArray(b)||a.length!==3||b.length!==3||
   ![...a,...b,height].every(Number.isSafeInteger))return null;
 const [ax,ay,az]=a,[bx,by,bz]=b;
 if(ay!==by||height<0||height>2||ay+height+2>WORLD_MAX_Y)return null;
 const dx=bx-ax,dz=bz-az,span=Math.max(Math.abs(dx),Math.abs(dz));
 if(span<5||span>12||Math.min(Math.abs(dx),Math.abs(dz))>2)return null;
 if(world.get(ax,ay,az)!==BLOCK.WOOD||world.get(bx,by,bz)!==BLOCK.WOOD)return null;
 const cells=new Map();
 const put=(x,y,z,id)=>cells.set(key(x,y,z),[x,y,z,id]);
 for(let i=1;i<span;i++){
   const x=Math.round(ax+dx*i/span),z=Math.round(az+dz*i/span);
   const y=ay+height;
   put(x,y,z,BLOCK.WOOD);
   // The leafy arch is a true editable voxel canopy, not a decorative mesh.
   if(i>1&&i<span-1){
     put(x,y+1,z,BLOCK.LEAVES);
     if(i%3===0){
       const side=Math.abs(dx)>=Math.abs(dz)?[0,1]:[1,0];
       put(x+side[0],y+1,z+side[1],BLOCK.LEAVES);
       put(x-side[0],y+1,z-side[1],BLOCK.LEAVES);
     }
   }
 }
 const occupied=[...cells.values()];
 // A bridge must be contiguous and may never overwrite its supporting crowns.
 if(occupied.some(([x,y,z])=>(x===ax&&y===ay&&z===az)||(x===bx&&y===by&&z===bz)))return null;
 if(occupied.some(([x,y,z])=>baseBlock(x,y,z,world.seed)!==BLOCK.AIR||
    world.get(x,y,z)!==BLOCK.AIR))return null;
 return {seed:world.seed,anchors:[a.slice(),b.slice()],height,cells:occupied,
   blockCount:occupied.length,optIn:true};
}
export function validateCanopyBridge(world,plan){
 if(!plan?.optIn||plan.seed!==world?.seed||!Array.isArray(plan.anchors)||
   plan.anchors.length!==2)return false;
 const fresh=planCanopyBridge(world,...plan.anchors,{height:plan.height});
 return !!fresh&&fresh.blockCount===plan.blockCount&&
   JSON.stringify(fresh.cells)===JSON.stringify(plan.cells);
}
