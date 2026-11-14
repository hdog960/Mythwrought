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

/**
 * Sample the complete north-wing route using the same collision reader as gameplay.
 * Coordinates are voxel feet positions, not an illustrative route.
 * Explicitly report obstructed cells instead of claiming every saved world is walkable.
 */
export function northWingTraversal(world,origin=CAVE_CANDIDATE){
  const candidate=branchedCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  const t=origin.length-14,x=origin.x+t;
  const samples=[];
  for(let dz=0;dz>=-10;dz--){
    const z=origin.z+dz, floor=floorAt(t), feet=floor+1;
    const supported=candidate.get(x,floor,z)!==BLOCK.AIR;
    const clear=candidate.get(x,feet,z)===BLOCK.AIR &&
      candidate.get(x,feet+1,z)===BLOCK.AIR;
    samples.push({x,y:feet,z,supported,clear});
  }
  return {samples,failures:samples.filter(p=>!p.supported||!p.clear),
    walkable:samples.every(p=>p.supported&&p.clear)};
}
