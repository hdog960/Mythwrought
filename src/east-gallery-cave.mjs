// :24 optional east-facing side chamber off the existing south gallery.
// This is NOT enabled in liveVoxelDistrict; preserve all seeded baseline voxels.
// No new IDs, engine-Y edits, player edits, or persistent save changes.
import {BLOCK,WORLD_MIN_Y,WORLD_MAX_Y,worldKey,collides} from './voxel.mjs';
import {caveRoute,CAVE_CANDIDATE} from './experimental-cave-route.mjs';
import {southGalleryCaveWorld} from './south-gallery-cave.mjs';

export function eastGalleryCaveWorld(world,origin=CAVE_CANDIDATE){
  if(origin.length<24)throw Error('Cave too short for east gallery');
  const prior=southGalleryCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  const anchor=origin.length-9, floor=floorAt(anchor);
  return {seed:world.seed,edits:world.edits,get(x,y,z){
    if(world.edits?.has(worldKey(x,y,z)))return world.get(x,y,z);
    const t=x-origin.x,d=z-origin.z;
    // One-block throat plus 7x5 chamber, connected to south gallery at d=8.
    const throat=t>=anchor&&t<=anchor+2&&d>=7&&d<=9;
    const room=t>=anchor+2&&t<=anchor+8&&d>=6&&d<=10;
    if(!(throat||room)||y<WORLD_MIN_Y||y>WORLD_MAX_Y)return prior.get(x,y,z);
    if(y===floor)return BLOCK.STONE;
    if(y>floor&&y<=floor+4)return BLOCK.AIR;
    return prior.get(x,y,z);
  }};
}
export function eastGalleryTrace(world,origin=CAVE_CANDIDATE){
  const reader=eastGalleryCaveWorld(world,origin);
  const {floorAt}=caveRoute(world.seed,origin);
  const anchor=origin.length-9,floor=floorAt(anchor);
  const samples=[];
  for(let t=anchor;t<=anchor+8;t++){
    const x=origin.x+t,z=origin.z+8,feet=floor+1;
    samples.push({x,z,feet,supported:reader.get(x,floor,z)!==BLOCK.AIR,
      headroom:reader.get(x,feet,z)===BLOCK.AIR&&reader.get(x,feet+1,z)===BLOCK.AIR,
      bodyClear:!collides(reader,x+.5,feet,z+.5)});
  }
  const transitions=[];
  for(let i=1;i<samples.length;i++){
    const a=samples[i-1],b=samples[i];
    transitions.push({from:i-1,to:i,
      stepValid:Math.abs(a.feet-b.feet)<=1,
      bodyClear:!collides(reader,(a.x+b.x)/2+.5,Math.max(a.feet,b.feet),(a.z+b.z)/2+.5)});
  }
  const failures=samples.filter(p=>!p.supported||!p.headroom||!p.bodyClear);
  const blockedTransitions=transitions.filter(p=>!p.stepValid||!p.bodyClear);
  return {samples,transitions,failures,blockedTransitions,
    walkable:failures.length===0&&blockedTransitions.length===0,
    anchor:{x:origin.x+anchor,y:floor+1,z:origin.z+8},
    chamber:{x:origin.x+anchor+8,y:floor+1,z:origin.z+8}};
}
