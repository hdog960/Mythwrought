// Opt-in, non-persistent cave mesh and traversal harness. Never changes default VoxelWorld.
import {BLOCK, BODY_HEIGHT, BODY_RADIUS, collides, meshChunk, terrainHeight} from './voxel.mjs';
import {CAVE_CANDIDATE, caveRoute, experimentalCaveWorld} from './experimental-cave-route.mjs';

export function caveCandidateMesh(world,cx,cz,origin=CAVE_CANDIDATE){
  // The same world reader drives mesh face culling and player collision.
  // Caller must explicitly opt in; no save schema or seeded default changes.
  return meshChunk(experimentalCaveWorld(world,origin),cx,cz);
}
export function caveTraversalTrace(world,origin=CAVE_CANDIDATE){
  const candidate=experimentalCaveWorld(world,origin);
  const route=caveRoute(world.seed,origin);
  const samples=[];
  const {x,z,length}=origin;
  for(let t=0;t<=length;t++){
    const floor=route.floorAt(t);
    const px=x+t+.5,pz=z+.5,feet=floor+1;
    const supported=candidate.get(x+t,floor,z)!==BLOCK.AIR;
    const clear=!collides(candidate,px,feet,pz);
    const rise=t?floor-route.floorAt(t-1):0;
    samples.push({x:x+t,y:feet,z,clear,supported,rise});
  }
  // Side grotto: connect from main corridor through positive Z throat.
  const sideT=length-10;
  const sideFloor=route.floorAt(sideT);
  for(let dz=1;dz<=4;dz++){
    const feet=sideFloor+1;
    samples.push({x:x+sideT,y:feet,z:z+dz,clear:!collides(candidate,x+sideT+.5,feet,z+dz+.5),
      supported:candidate.get(x+sideT,sideFloor,z+dz)!==BLOCK.AIR,rise:0});
  }
  // Traverse the new west gallery from the corridor center to its far wall.
  const westT=12,westFloor=route.floorAt(westT);
  for(let dz=-1;dz>=-4;dz--){
    const feet=westFloor+1;
    samples.push({x:x+westT,y:feet,z:z+dz,
      clear:!collides(candidate,x+westT+.5,feet,z+dz+.5),
      supported:candidate.get(x+westT,westFloor,z+dz)!==BLOCK.AIR,rise:0});
  }
  const failures=samples.filter(p=>!p.clear||!p.supported||Math.abs(p.rise)>1);
  const entrance={x,y:terrainHeight(x,z,world.seed),z};
  return {entrance,chamber:route.chamber,grotto:route.grotto,westGallery:route.westGallery,samples,failures,
    walkable:failures.length===0,bodyHeight:BODY_HEIGHT,bodyRadius:BODY_RADIUS};
}
