// Optional second cave wing: real collision/mesh voxels, never enabled for existing saves.
import {BLOCK, WORLD_MIN_Y, WORLD_MAX_Y, worldKey} from './voxel.mjs';
import {CAVE_CANDIDATE, caveRoute, experimentalCaveWorld} from './experimental-cave-route.mjs';

export function branchedCaveWorld(world,origin=CAVE_CANDIDATE){
  const primary=experimentalCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  const start=origin.length-17,end=origin.length-9;
  return {
    seed:world.seed,edits:world.edits,
    get(x,y,z){
      if(world.edits?.has(worldKey(x,y,z)))return world.get(x,y,z);
      const t=x-origin.x,d=z-origin.z;
      // A 3-wide northward branch intersects the main corridor at d=-1.
      // The far end opens into a 9x7 block chamber, rather than a sealed void.
      const throat=t>=start+2&&t<=start+4&&d>=-5&&d<=-1;
      const hall=t>=start&&t<=end&&d>=-10&&d<=-5;
      if(!(throat||hall)||y<WORLD_MIN_Y||y>WORLD_MAX_Y)return primary.get(x,y,z);
      const floor=floorAt(t);
      if(y===floor)return BLOCK.STONE;
      if(y>floor&&y<=floor+4)return BLOCK.AIR;
      return primary.get(x,y,z);
    }
  };
}
