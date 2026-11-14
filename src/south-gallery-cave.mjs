// :24 opt-in cave extension: an additional physical south gallery and chamber.
// No default-world hookup, vertical-engine changes, IDs, or saved-edit writes.
import {BLOCK, WORLD_MIN_Y, WORLD_MAX_Y, worldKey} from './voxel.mjs';
import {CAVE_CANDIDATE,caveRoute} from './experimental-cave-route.mjs';
import {branchedCaveWorld} from './branched-cave-world.mjs';

export function southGalleryCaveWorld(world,origin=CAVE_CANDIDATE){
  const prior=branchedCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  if(origin.length<24)throw Error('Cave too short for south gallery');
  return {
    seed:world.seed,edits:world.edits,
    get(x,y,z){
      if(world.edits?.has(worldKey(x,y,z)))return world.get(x,y,z);
      const t=x-origin.x,d=z-origin.z;
      // An open throat connects the existing +Z grotto to a 9x7 gallery.
      const throat=t>=origin.length-13&&t<=origin.length-9&&d>=3&&d<=5;
      const chamber=t>=origin.length-17&&t<=origin.length-9&&d>=5&&d<=11;
      if(!(throat||chamber)||y<WORLD_MIN_Y||y>WORLD_MAX_Y)return prior.get(x,y,z);
      const floor=floorAt(t);
      if(y===floor)return BLOCK.STONE;
      if(y>floor&&y<=floor+5)return BLOCK.AIR;
      return prior.get(x,y,z);
    }
  };
}

// A deterministic collision-reader-compatible path from the existing grotto
// through the new throat to the chamber; not a controller simulation.
export function southGalleryTrace(world,origin=CAVE_CANDIDATE){
  const reader=southGalleryCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  const t=origin.length-11,x=origin.x+t;
  const samples=[];
  for(let d=3;d<=10;d++){
    const z=origin.z+d,floor=floorAt(t);
    samples.push({x,z,feet:floor+1,
      supported:reader.get(x,floor,z)!==BLOCK.AIR,
      clear:reader.get(x,floor+1,z)===BLOCK.AIR&&reader.get(x,floor+2,z)===BLOCK.AIR});
  }
  return {samples,walkable:samples.every(p=>p.supported&&p.clear)};
}
