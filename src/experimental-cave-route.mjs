// Gate A experimental cave: explicit opt-in, never alters the default seeded world.
// Coordinate system: eastbound, with a three-wide walkable descending passage.
import {BLOCK, terrainHeight, WORLD_MIN_Y, WORLD_MAX_Y, worldKey} from './voxel.mjs';

export const CAVE_CANDIDATE = Object.freeze({x:64,z:64,length:28,width:3});
export function caveRoute(seed=179, origin=CAVE_CANDIDATE){
  const top=terrainHeight(origin.x,origin.z,seed);
  const floorAt=t=>Math.max(WORLD_MIN_Y+2,top-1-Math.floor(t/5));
  return {entrance:[origin.x,top,origin.z],chamber:[origin.x+origin.length-3,floorAt(origin.length-3)+1,origin.z],floorAt};
}
export function experimentalCaveWorld(world,origin=CAVE_CANDIDATE){
  const {floorAt}=caveRoute(world.seed,origin);
  const {x,z,length,width}=origin;
  if(!Number.isInteger(x)||!Number.isInteger(z)||!Number.isInteger(length)||length<12||length>64||width!==3)
    throw Error('Invalid cave candidate dimensions');
  const original=world;
  return {
    seed:original.seed,
    edits:original.edits,
    get(px,py,pz){
      // Preserve every explicit user edit, including placed blocks and mined air.
      if(original.edits?.has(worldKey(px,py,pz)))return original.get(px,py,pz);
      const t=px-x,side=Math.abs(pz-z);
      if(t<0||t>length||side>3||py<WORLD_MIN_Y||py>WORLD_MAX_Y)return original.get(px,py,pz);
      const floor=floorAt(Math.min(t,length));
      const chamber=t>=length-7 && t<=length && side<=3;
      const corridor=t<=length-7 && side<=1;
      if(!chamber&&!corridor)return original.get(px,py,pz);
      const ceiling=chamber?floor+5:floor+3;
      // A visible surface breach leads into the descending passage; never
      // leave an invisible grass cap over the first five approach cells.
      const openTop=t<=4;
      if(py===floor)return BLOCK.STONE;
      if(py>floor && (py<=ceiling || (openTop&&py<=terrainHeight(px,pz,world.seed)+1)))
        return BLOCK.AIR;
      return original.get(px,py,pz);
    }
  };
}
