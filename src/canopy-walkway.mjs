// :48 opt-in physical canopy walkway between two existing wood crown anchors.
// No seeded placement, new IDs, engine edits or render-only geometry.
import {BLOCK,baseBlock,WORLD_MAX_Y} from './voxel.mjs';
const key=(x,y,z)=>`${x},${y},${z}`;
export function planCanopyWalkway(world,a,b,y){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
    !Array.isArray(a)||!Array.isArray(b)||a.length!==2||b.length!==2||
    ![...a,...b,y].every(Number.isInteger)||y<2||y+2>WORLD_MAX_Y)return null;
 const dx=b[0]-a[0],dz=b[1]-a[1],distance=Math.abs(dx)+Math.abs(dz);
 if((dx!==0&&dz!==0)||distance<3||distance>9)return null;
 const sx=Math.sign(dx),sz=Math.sign(dz),sideX=sz,sideZ=-sx;
 // Both ends must already be genuine physical timber crown supports.
 if(world.get(a[0],y,a[1])!==BLOCK.WOOD||
    world.get(b[0],y,b[1])!==BLOCK.WOOD)return null;
 const cells=[];
 for(let i=1;i<distance;i++){
  const x=a[0]+sx*i,z=a[1]+sz*i;
  // Walkable solid timber deck, open two-block headroom and foliage side rails.
  cells.push([x,y,z,BLOCK.WOOD]);
  if(i>1&&i<distance-1){
   cells.push([x+sideX,y+1,z+sideZ,BLOCK.LEAVES]);
   cells.push([x-sideX,y+1,z-sideZ,BLOCK.LEAVES]);
  }
 }
 const seen=new Set();
 for(const [x,cy,z] of cells){
  const k=key(x,cy,z);
  if(seen.has(k)||baseBlock(x,cy,z,world.seed)!==BLOCK.AIR||
     world.get(x,cy,z)!==BLOCK.AIR)return null;
  seen.add(k);
 }
 for(let i=0;i<=distance;i++){
  const x=a[0]+sx*i,z=a[1]+sz*i;
  if(world.get(x,y+1,z)!==BLOCK.AIR||world.get(x,y+2,z)!==BLOCK.AIR||
     baseBlock(x,y+1,z,world.seed)!==BLOCK.AIR||
     baseBlock(x,y+2,z,world.seed)!==BLOCK.AIR)return null;
 }
 return {seed:world.seed,a:[...a],b:[...b],y,cells,optIn:true};
}
export function placeCanopyWalkway(world,plan){
 if(!plan?.optIn||!world||typeof world.set!=='function'||plan.seed!==world.seed)return false;
 const fresh=planCanopyWalkway(world,plan.a,plan.b,plan.y);
 if(!fresh||JSON.stringify(fresh.cells)!==JSON.stringify(plan.cells))return false;
 const written=[];
 try{
  for(const [x,y,z,id] of fresh.cells){
   if(world.set(x,y,z,id)!==true)throw Error('write rejected');
   written.push([x,y,z]);
  }
 }catch{
  for(let i=written.length-1;i>=0;i--){
   const [x,y,z]=written[i];
   if(world.set(x,y,z,BLOCK.AIR)!==true)
    throw Error('canopy walkway rollback failed; inspect world edits');
  }
  return false;
 }
 return true;
}
