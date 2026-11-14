// Optional second cave wing: real collision/mesh voxels, never enabled for existing saves.
import {BLOCK, WORLD_MIN_Y, WORLD_MAX_Y, worldKey, collides, BODY_HEIGHT, BODY_RADIUS} from './voxel.mjs';
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
    const clear=!collides(candidate,x+.5,feet,z+.5) &&
      candidate.get(x,feet,z)===BLOCK.AIR &&
      candidate.get(x,feet+1,z)===BLOCK.AIR;
    samples.push({x,y:feet,z,supported,clear});
  }
  const failures=samples.filter(p=>!p.supported||!p.clear);
  return {samples,failures,walkable:failures.length===0,
    bodyHeight:BODY_HEIGHT,bodyRadius:BODY_RADIUS};
}

/**
 * Connected entrance-to-north-chamber trace. Sample the complete eastbound
 * descent before turning north; every sample uses the production collision
 * radius/height, and adjacent steps must not exceed one voxel vertically.
 * This is a static opt-in geometry proof, NOT a simulated controller walk.
 */
export function northWingEntranceTrace(world,origin=CAVE_CANDIDATE){
  const candidate=branchedCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  const turn=origin.length-14;
  const points=[];
  for(let t=0;t<=turn;t++)
    points.push({x:origin.x+t,z:origin.z,floor:floorAt(t)});
  for(let dz=-1;dz>=-10;dz--)
    points.push({x:origin.x+turn,z:origin.z+dz,floor:floorAt(turn)});
  const samples=points.map((p,i)=>{
    const feet=p.floor+1,previous=points[i-1];
    const supported=candidate.get(p.x,p.floor,p.z)!==BLOCK.AIR;
    const clear=!collides(candidate,p.x+.5,feet,p.z+.5);
    const rise=previous?p.floor-previous.floor:0;
    return {...p,y:feet,supported,clear,rise,
      stepValid:Math.abs(rise)<=1};
  });
  const failures=samples.filter(p=>!p.supported||!p.clear||!p.stepValid);
  return {entrance:samples[0],turn:samples[turn],chamber:samples.at(-1),
    samples,failures,walkable:failures.length===0,
    bodyHeight:BODY_HEIGHT,bodyRadius:BODY_RADIUS};
}
