// Gate A experimental cave: opt-in only; default seeded terrain and saves stay unchanged.
// Eastbound three-wide descending passage, with two connected side galleries and a terminal chamber.
import {BLOCK, terrainHeight, WORLD_MIN_Y, WORLD_MAX_Y, worldKey} from './voxel.mjs';

export const CAVE_CANDIDATE = Object.freeze({x:64,z:64,length:28,width:3});
export function caveRoute(seed=179, origin=CAVE_CANDIDATE){
  const top=terrainHeight(origin.x,origin.z,seed);
  const floorAt=t=>Math.max(WORLD_MIN_Y+2,top-1-Math.floor(t/5));
  return {
    entrance:[origin.x,top,origin.z],
    westGallery:[origin.x+12,floorAt(12)+1,origin.z-4],
    grotto:[origin.x+origin.length-10,floorAt(origin.length-10)+1,origin.z+3],
    chamber:[origin.x+origin.length-3,floorAt(origin.length-3)+1,origin.z],
    floorAt
  };
}
export function experimentalCaveWorld(world,origin=CAVE_CANDIDATE){
  const {x,z,length,width}=origin;
  if(!Number.isInteger(x)||!Number.isInteger(z)||!Number.isInteger(length)||
    length<24||length>64||width!==3)throw Error('Invalid cave candidate dimensions');
  const {floorAt}=caveRoute(world.seed,origin);
  return {
    seed:world.seed,edits:world.edits,
    get(px,py,pz){
      // A player's explicit placement or excavation always wins.
      if(world.edits?.has(worldKey(px,py,pz)))return world.get(px,py,pz);
      const t=px-x,dz=pz-z,side=Math.abs(dz);
      if(t<0||t>length||side>4||py<WORLD_MIN_Y||py>WORLD_MAX_Y)
        return world.get(px,py,pz);
      const chamber=t>=length-7&&side<=3;
      const corridor=t<=length-7&&side<=1;
      // A connected side chamber, accessible through the +Z corridor wall.
      // Two blocks of its throat overlap the main corridor; no isolated void.
      const grotto=t>=length-13&&t<=length-8&&dz>=1&&dz<=4;
      // West gallery joins the main corridor through a full-width open throat.
      const westGallery=t>=10&&t<=16&&dz<=-1&&dz>=-4;
      if(!chamber&&!corridor&&!grotto&&!westGallery)return world.get(px,py,pz);
      const floor=floorAt(t);
      const ceiling=floor+(chamber||grotto||westGallery?5:3);
      if(py===floor)return BLOCK.STONE;
      // Open the approach to daylight, including any elevated natural grass cap.
      // The remainder stays roofed, allowing a genuinely underground chamber.
      const daylight=t<=4&&py<=terrainHeight(px,pz,world.seed)+1;
      if(py>floor&&(py<=ceiling||daylight))return BLOCK.AIR;
      return world.get(px,py,pz);
    }
  };
}
