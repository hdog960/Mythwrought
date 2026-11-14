// A quiet discovery cue only when the player physically reaches a natural cave corridor.
// Uses the current world and original seeded base; never creates entrances or edits terrain.
import {BLOCK,baseBlock} from './voxel.mjs';

const DIRECTIONS=[[1,0],[-1,0],[0,1],[0,-1]];
export function naturalCaveCorridor(world,position){
  if(!world||!position||![position.x,position.feet,position.z].every(Number.isFinite))return false;
  const x=Math.floor(position.x),z=Math.floor(position.z),y=Math.floor(position.feet);
  const naturalAir=(a,b,c)=>baseBlock(a,b,c,world.seed)===BLOCK.AIR&&world.get(a,b,c)===BLOCK.AIR;
  const safeFloor=(a,c)=>world.get(a,y-1,c)!==BLOCK.AIR;
  const roof=(a,c)=>world.get(a,y+2,c)!==BLOCK.AIR;
  if(!naturalAir(x,y,z)||!naturalAir(x,y+1,z)||!safeFloor(x,z)||!roof(x,z))return false;
  // Require a real, walkable two-block-high passage continuing beyond this cell.
  // One-cell recesses, painted cliffs and isolated holes cannot trigger discovery.
  return DIRECTIONS.some(([dx,dz])=>{
    for(let i=1;i<=3;i++){
      const a=x+dx*i,c=z+dz*i;
      if(!naturalAir(a,y,c)||!naturalAir(a,y+1,c)||!safeFloor(a,c)||!roof(a,c))return false;
    }
    return true;
  });
}

export function updateCaveDiscovery(previous,inside,now){
  const state=previous||{inside:false,last:-Infinity,discoveries:0};
  const entered=Boolean(inside)&&!state.inside&&Number.isFinite(now)&&now-state.last>=12000;
  return {inside:Boolean(inside),last:entered?now:state.last,
    discoveries:state.discoveries+(entered?1:0),entered};
}
