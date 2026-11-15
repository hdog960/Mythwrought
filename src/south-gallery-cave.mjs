// :24 opt-in cave extension: an additional physical south gallery and chamber.
// No default-world hookup, vertical-engine changes, IDs, or saved-edit writes.
import {BLOCK, WORLD_MIN_Y, WORLD_MAX_Y, worldKey, collides, BODY_HEIGHT, BODY_RADIUS} from './voxel.mjs';
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

// A deterministic collision-reader-compatible path from the primary eastbound
// cave corridor, through the south grotto and throat, into the chamber.
// This checks the junction too, not just an isolated gallery interior.
export function southGalleryTrace(world,origin=CAVE_CANDIDATE){
  const reader=southGalleryCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  const t=origin.length-11,x=origin.x+t;
  const samples=[];
  for(let d=0;d<=10;d++){
    const z=origin.z+d,floor=floorAt(t);
    samples.push({x,z,feet:floor+1,
      supported:reader.get(x,floor,z)!==BLOCK.AIR,
      clear:reader.get(x,floor+1,z)===BLOCK.AIR&&reader.get(x,floor+2,z)===BLOCK.AIR});
  }
  // Validate the full player body, including the space between route samples.
  for(const point of samples)
    point.bodyClear=!collides(reader,point.x+.5,point.feet,point.z+.5);
  const transitions=[];
  for(let i=1;i<samples.length;i++){
    const a=samples[i-1],b=samples[i];
    transitions.push({from:i-1,to:i,
      clear:!collides(reader,(a.x+b.x)/2+.5,Math.max(a.feet,b.feet),(a.z+b.z)/2+.5),
      stepValid:Math.abs(a.feet-b.feet)<=1});
  }
  const failures=samples.filter(p=>!p.supported||!p.clear||!p.bodyClear);
  const blockedTransitions=transitions.filter(p=>!p.clear||!p.stepValid);
  return {samples,transitions,failures,blockedTransitions,
    walkable:failures.length===0&&blockedTransitions.length===0,
    bodyHeight:BODY_HEIGHT,bodyRadius:BODY_RADIUS};
}
