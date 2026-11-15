// :36 optional physical approach markers for an already placed stone rotunda.
// No world-generation activation, material IDs, save migration or shared engine edits.
import {BLOCK,baseBlock,terrainHeight,worldKey,WORLD_MIN_Y,WORLD_MAX_Y} from './voxel.mjs';

const MARKERS=[[ -2,-6],[2,-6],[-2,6],[2,6],[-6,-2],[-6,2],[6,-2],[6,2]];
export function planRotundaApproachStones(world,rotunda){
  if(!world||!Number.isSafeInteger(world.seed)||typeof world.get!=='function'||
    !(world.edits instanceof Map)||!rotunda||rotunda.kind!=='stone-rotunda'||
    !Array.isArray(rotunda.origin)||rotunda.origin.length!==3||
    !rotunda.origin.every(Number.isSafeInteger))return null;
  const [x,h,z]=rotunda.origin;
  if(h<WORLD_MIN_Y+1||h+3>WORLD_MAX_Y||Math.abs(x)>999990||Math.abs(z)>999990)return null;
  const cells=[];
  for(const [dx,dz] of MARKERS){
    const px=x+dx,pz=z+dz;
    if(terrainHeight(px,pz,world.seed)!==h)return null;
    for(let dy=-1;dy<=3;dy++){
      const py=h+dy,key=worldKey(px,py,pz),natural=baseBlock(px,py,pz,world.seed);
      if(world.edits.has(key)||world.get(px,py,pz)!==natural||
        (dy<=0&&natural===BLOCK.AIR)||(dy>0&&natural!==BLOCK.AIR))return null;
    }
    // Pair of low physical stone cairns flanks each cardinal approach;
    // central 4-block-wide walk-through remains completely untouched.
    cells.push([px,h+1,pz,BLOCK.STONE],[px,h+2,pz,BLOCK.STONE]);
  }
  return {kind:'rotunda-approach-stones',origin:[x,h,z],cells,
    blockCount:cells.length,materialIds:[BLOCK.STONE],optIn:true};
}
export function placeRotundaApproachStones(world,rotunda,plan){
  if(!plan?.optIn||plan.kind!=='rotunda-approach-stones'||
    !(world?.edits instanceof Map)||typeof world.set!=='function')return false;
  const fresh=planRotundaApproachStones(world,rotunda);
  if(!fresh||JSON.stringify(plan.origin)!==JSON.stringify(fresh.origin)||
    JSON.stringify(plan.cells)!==JSON.stringify(fresh.cells))return false;
  const before=new Map(world.edits);
  try{
    for(const cell of fresh.cells)if(world.set(...cell)!==true)throw Error('write rejected');
    return true;
  }catch{
    world.edits.clear();
    for(const [key,value] of before)world.edits.set(key,value);
    return false;
  }
}
