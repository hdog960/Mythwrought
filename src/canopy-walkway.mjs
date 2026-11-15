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
  // Continuous timber deck. Each foliage cluster rests on a timber outrigger
  // directly joined to the deck: no unsupported floating leaf bars.
  cells.push([x,y,z,BLOCK.WOOD]);
  // Leave real daylight gaps between crown branches instead of repeating
  // a fence tooth at every step. Two end-biased forks frame the approach;
  // only the longest spans need a third, off-center crown station.
  const crownStation=i===2||i===distance-2||
   (distance>=8&&i===Math.floor(distance/2));
  if(crownStation){
   // Alternate banks deterministically. Branches remain attached to the
   // solid deck; no free-floating foliage or solid railing is introduced.
   const sides=[((i+distance+world.seed)&1)===0?-1:1];
   for(const side of sides){
    const rx=x+side*sideX,rz=z+side*sideZ;
    cells.push([rx,y,rz,BLOCK.WOOD]);
    cells.push([rx,y+1,rz,BLOCK.LEAVES]);
    // Rare longer, tapered branch tips interrupt the repeated one-cell
    // fence-tooth silhouette. Tips remain joined to the inner limb and
    // their leaf caps are supported by real timber, not floating cubes.
    // Keep the opposite bank clear at the central fork.
    if(distance>=7&&(i===2||i===distance-2)&&sides.length===1){
     const tx=rx+side*sideX,tz=rz+side*sideZ;
     cells.push([tx,y,tz,BLOCK.WOOD]);
     cells.push([tx,y+1,tz,BLOCK.LEAVES]);
    }
   }
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
