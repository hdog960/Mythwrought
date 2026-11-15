// Opt-in west gallery extension: physical AIR/STONE voxels through the normal world reader.
// Does not alter default world generation, vertical contracts, or saved edits.
import {BLOCK, WORLD_MIN_Y, WORLD_MAX_Y, worldKey, collides, BODY_HEIGHT, BODY_RADIUS} from './voxel.mjs';
import {CAVE_CANDIDATE, caveRoute} from './experimental-cave-route.mjs';
import {branchedCaveWorld} from './branched-cave-world.mjs';

export function westGalleryWorld(world, origin=CAVE_CANDIDATE) {
  const previous=branchedCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  return {
    seed:world.seed, edits:world.edits,
    get(x,y,z) {
      if(world.edits?.has(worldKey(x,y,z)))return world.get(x,y,z);
      if(y<WORLD_MIN_Y||y>WORLD_MAX_Y)return previous.get(x,y,z);
      const t=x-origin.x,d=z-origin.z;
      // Existing west gallery reaches d=-4; the throat continues to -7.
      // A wider terminal chamber has a genuinely connected 3-block-wide approach.
      const throat=t>=12&&t<=14&&d>=-7&&d<=-4;
      const chamber=t>=9&&t<=17&&d>=-11&&d<=-7;
      if(!throat&&!chamber)return previous.get(x,y,z);
      const floor=floorAt(t);
      if(y===floor)return BLOCK.STONE;
      if(y>floor&&y<=floor+4)return BLOCK.AIR;
      return previous.get(x,y,z);
    }
  };
}

export function westGalleryTraversal(world,origin=CAVE_CANDIDATE) {
  const reader=westGalleryWorld(world,origin), t=13,x=origin.x+t;
  const floor=caveRoute(world.seed,origin).floorAt(t);
  const samples=[];
  for(let d=0;d>=-10;d--) {
    const z=origin.z+d, feet=floor+1;
    const supported=reader.get(x,floor,z)!==BLOCK.AIR;
    const headClear=reader.get(x,feet,z)===BLOCK.AIR&&reader.get(x,feet+1,z)===BLOCK.AIR;
    const bodyClear=!collides(reader,x+.5,feet,z+.5);
    samples.push({x,y:feet,z,supported,headClear,bodyClear});
  }
  const failures=samples.filter(s=>!s.supported||!s.headClear||!s.bodyClear);
  return {samples,failures,walkable:failures.length===0,bodyHeight:BODY_HEIGHT,bodyRadius:BODY_RADIUS};
}
