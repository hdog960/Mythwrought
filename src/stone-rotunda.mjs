// Gate A :36 — opt-in, physical open-air hilltop rotunda made from integrated STONE 3.
// No implicit generation, block registration, save migration, or depth-engine edits.
import {BLOCK,baseBlock,terrainHeight,worldKey,WORLD_MIN_Y,WORLD_MAX_Y} from './voxel.mjs';

const OFFSETS=[[-3,-3],[0,-3],[3,-3],[-3,0],[3,0],[-3,3],[0,3],[3,3]];
export function planStoneRotunda(world,x,z){
  if(!world||!Number.isSafeInteger(world.seed)||typeof world.get!=='function'||
     !Number.isSafeInteger(x)||!Number.isSafeInteger(z)||
     Math.abs(x)>1000000||Math.abs(z)>1000000)return null;
  const h=terrainHeight(x,z,world.seed);
  if(!Number.isInteger(h)||h-2<WORLD_MIN_Y||h+7>WORLD_MAX_Y)return null;
  // All 81 ground columns and their airspace are protected, not only placed blocks.
  for(let dx=-4;dx<=4;dx++)for(let dz=-4;dz<=4;dz++){
    const px=x+dx,pz=z+dz;
    if(terrainHeight(px,pz,world.seed)!==h)return null;
    for(let dy=-2;dy<=7;dy++){
      const py=h+dy,baseline=baseBlock(px,py,pz,world.seed);
      // An explicit edit is player-owned even when it equals natural terrain.
      if(world.edits instanceof Map && world.edits.has(worldKey(px,py,pz)))return null;
      if(world.get(px,py,pz)!==baseline)return null;
      if(dy===0&&baseline!==BLOCK.GRASS)return null;
      if(dy===-2&&baseline===BLOCK.AIR)return null;
      if(dy>0&&baseline!==BLOCK.AIR)return null;
    }
  }
  const cells=[],used=new Set();
  function put(dx,dy,dz){
    const px=x+dx,py=h+dy,pz=z+dz,key=px+','+py+','+pz;
    if(!used.has(key)){used.add(key);cells.push([px,py,pz,BLOCK.STONE]);}
  }
  // Eight free-standing columns; four cardinal entrances and an open center.
  for(const [dx,dz] of OFFSETS){
    put(dx,0,dz);
    for(let dy=1;dy<=4;dy++)put(dx,dy,dz);
    put(dx,5,dz);
  }
  // Open ring beam, high enough for a standing player to pass underneath.
  for(let d=-3;d<=3;d++){
    put(d,5,-3);put(d,5,3);put(-3,5,d);put(3,5,d);
  }
  // Broken crown at four corners; no roof across the open sky-lit center.
  for(const [dx,dz] of [[-3,-3],[3,-3],[-3,3],[3,3]]){
    put(dx,6,dz);
  }
  // Stepped corner buttresses make the silhouette visibly weathered and grounded.
  // All blocks stay inside the protected 9x9 survey volume.
  for(const [sx,sz] of [[-1,-1],[-1,1],[1,-1],[1,1]]){
    put(sx*4,0,sz*3);put(sx*3,0,sz*4);
    put(sx*4,1,sz*3);put(sx*3,1,sz*4);
  }
  // Asymmetric crown fragments preserve four fully open entrances and skylight.
  for(const [dx,dz] of [[-3,-2],[-3,-1],[-2,-3],[3,1],[3,2],[2,3]])put(dx,6,dz);
  // Four low steps point toward the empty ceremonial center without blocking entries.
  for(const [dx,dz] of [[-2,0],[2,0],[0,-2],[0,2]])put(dx,0,dz);
  return Object.freeze({kind:'stone-rotunda',origin:[x,h,z],cells,
    entrances:[[x,h+1,z-4],[x,h+1,z+4],[x-4,h+1,z],[x+4,h+1,z]],
    center:[x,h+1,z],blockCount:cells.length,materialIds:[BLOCK.STONE],optIn:true});
}
export function placeStoneRotunda(world,plan){
  if(!plan?.optIn||plan.kind!=='stone-rotunda'||!Array.isArray(plan.origin)||
     !Array.isArray(plan.cells)||!(world?.edits instanceof Map)||typeof world.set!=='function')return false;
  const [x,h,z]=plan.origin;
  if(![x,h,z].every(Number.isSafeInteger))return false;
  const fresh=planStoneRotunda(world,x,z);
  if(!fresh||fresh.origin[1]!==h||fresh.cells.length!==plan.cells.length||
     !plan.cells.every((cell,i)=>Array.isArray(cell)&&cell.length===4&&
       cell.every((v,j)=>v===fresh.cells[i][j])))return false;
  const original=new Map(world.edits);
  try{
    for(const [px,py,pz,id] of fresh.cells)
      if(world.set(px,py,pz,id)!==true)throw new Error('Rejected voxel write');
    return true;
  }catch{
    world.edits.clear();
    for(const [key,id] of original)world.edits.set(key,id);
    return false;
  }
}
