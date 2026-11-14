// Gate A :36 — opt-in physical voxel watchtower, not automatic seed placement.
// All cells are ordinary existing BLOCK IDs, using world.set/get for collision,
// raycasting, editing, and schema-1 persistence. No render-only ornament mesh.
import {BLOCK,terrainHeight,baseBlock,WORLD_MAX_Y,WORLD_MIN_Y} from './voxel.mjs';
const key=(x,y,z)=>x+','+y+','+z;
export function planVoxelWatchtower(world,x,z){
 if(!world||!Number.isInteger(world.seed)||typeof world.get!=='function'||
    !Number.isInteger(x)||!Number.isInteger(z))return null;
 // A deliberately small, walkable 7x7 footprint. Entrance faces south (+z).
 const heights=[];
 for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){
  const px=x+dx,pz=z+dz,h=terrainHeight(px,pz,world.seed);
  heights.push(h);
  if(world.get(px,h,pz)!==BLOCK.GRASS||world.get(px,h+1,pz)!==BLOCK.AIR)return null;
  // Preserve the entire future interior/air volume, not just cells replaced by stone.
  // Otherwise a saved player build could become trapped inside the new tower.
  for(let y=h-2;y<=h+8;y++)if(world.get(px,y,pz)!==baseBlock(px,y,pz,world.seed))return null;
  if(baseBlock(px,h-2,pz,world.seed)===BLOCK.AIR)return null;
 }
 const ground=heights[0];
 if(heights.some(h=>h!==ground)||ground+8>WORLD_MAX_Y||ground-2<WORLD_MIN_Y)return null;
 const blocks=new Map();
 const put=(dx,dy,dz,id)=>blocks.set(key(x+dx,ground+dy,z+dz),[x+dx,ground+dy,z+dz,id]);
 // Ground floor, four corner buttresses, open doorway, crenellated top.
 for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++){
  put(dx,0,dz,BLOCK.STONE);
  const perimeter=Math.abs(dx)===3||Math.abs(dz)===3;
  if(!perimeter)continue;
  for(let dy=1;dy<=5;dy++){
   if(dz===3&&dx===0&&dy<=3)continue; // 1-wide, 3-high south door
   if(dy===3&&(Math.abs(dx)===3&&dz===0||Math.abs(dz)===3&&dx===0&&dz!==3))continue;
   put(dx,dy,dz,BLOCK.STONE);
  }
  if((Math.abs(dx)===3&&Math.abs(dz)%2===1)||(Math.abs(dz)===3&&Math.abs(dx)%2===1))
   put(dx,7,dz,BLOCK.STONE);
 }
 // Roof-level walkable stone platform, with a central open hatch.
 for(let dx=-3;dx<=3;dx++)for(let dz=-3;dz<=3;dz++)
  if(!(dx===0&&dz===0))put(dx,6,dz,BLOCK.STONE);
 // External approach marker is also a real voxel.
 for(let dz=4;dz<=5;dz++)put(0,0,dz,BLOCK.STONE);
 const cells=[...blocks.values()];
 // Never overwrite natural terrain, saved edits, or an occupied cave.
 for(const [px,py,pz,id] of cells){
  const natural=baseBlock(px,py,pz,world.seed);
  if(world.get(px,py,pz)!==natural)return null;
  if(py>ground&&natural!==BLOCK.AIR)return null;
  if(py===ground&&natural!==BLOCK.GRASS)return null;
 }
 return Object.freeze({origin:[x,ground,z],cells,entrance:[x,ground+1,z+3],blockCount:cells.length,
  // Explicitly staged construction, never silently installed into old worlds.
  optIn:true,materialIds:[BLOCK.STONE]});
}
export function placeVoxelWatchtower(world,plan){
 if(!plan||!Array.isArray(plan.cells)||!Array.isArray(plan.origin)||typeof world?.set!=='function')return false;
 // Preflight all cells to prevent partial application; caller must use a fresh
 // plan and explicitly opt in. World edits then persist using existing schema 1.
 const [ox,gy,oz]=plan.origin;
 if(!Number.isInteger(ox)||!Number.isInteger(gy)||!Number.isInteger(oz))return false;
 // Re-plan against CURRENT world state, including untouched interior clearance.
 // A stale plan must not enclose later player edits or span a newly excavated cave.
 const fresh=planVoxelWatchtower(world,ox,oz);
 if(!fresh||fresh.cells.length!==plan.cells.length)return false;
 const expected=new Map(fresh.cells.map(c=>[key(c[0],c[1],c[2]),c[3]]));
 for(const cell of plan.cells){
  if(!Array.isArray(cell)||cell.length!==4||!cell.every(Number.isInteger)||
     expected.get(key(cell[0],cell[1],cell[2]))!==cell[3])return false;
 }
 for(const [x,y,z,id] of plan.cells)if(!world.set(x,y,z,id))return false;
 return true;
}
