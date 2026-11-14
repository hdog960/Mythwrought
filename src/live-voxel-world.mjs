// Checkpoint 008: deterministic, playable placement of integration-007 automation assets.
// These are seed-derived baseline voxels, NOT schema-1 edits or new persistent block IDs.
// Read through VoxelWorld.get so collisions, selection, mining, saving and meshing all agree.
// Manual Block Packs 1-5 and the four building roadmaps are deliberately not imported.
import {BLOCK,baseBlock,terrainHeight} from './voxel.mjs';
import {planVoxelGrove} from './voxel-groves.mjs';
import {planVoxelPilgrimCourt} from './voxel-pilgrim-court.mjs';
import {branchedCaveWorld} from './branched-cave-world.mjs';

export const LIVE_DISTRICT_SIZE=128;
export const LIVE_DISTRICT_CACHE_LIMIT=16;
const key=(x,y,z)=>x+','+y+','+z;
const inside=(x,z,origin)=>x>=origin.x&&x<=origin.x+origin.length&&
  z>=origin.z-10&&z<=origin.z+4;
const inCaveBuffer=(x,z,origin)=>x>=origin.x-5&&
  x<=origin.x+origin.length+5&&z>=origin.z-15&&z<=origin.z+9;

// Each chunk reads the SAME fixed world-aligned district overlay, regardless
// of load order. No tree or court is installed by VoxelWorld.set().
export function liveVoxelDistrict(seed,dx,dz,legacyGet){
  if(!Number.isInteger(seed)||!Number.isInteger(dx)||!Number.isInteger(dz)||
    typeof legacyGet!=='function')throw Error('Invalid live voxel district');
  const minX=dx*LIVE_DISTRICT_SIZE,minZ=dz*LIVE_DISTRICT_SIZE;
  const baseWorld={seed,get:legacyGet};
  const origins=[{x:minX+24,z:minZ+24,length:28,width:3},
                 {x:minX+80,z:minZ+80,length:28,width:3}];
  const caves=origins.map(origin=>({origin,world:branchedCaveWorld(baseWorld,origin)}));
  const caveGet=(x,y,z)=>{
    const original=legacyGet(x,y,z);
    // Pre-existing physical landmark cells retain priority over new caves.
    if(original!==baseBlock(x,y,z,seed))return original;
    for(const cave of caves)
      if(inside(x,z,cave.origin))return cave.world.get(x,y,z);
    return original;
  };
  const caveWorld={seed,get:caveGet};
  const blocks=new Map();
  let court=null;
  // Pick one actual, fully walk-through physical court per suitable district.
  // Quick flat-corridor rejection avoids repeatedly planning full arch geometry.
  courtSearch:
  for(let z=minZ+16;z<=minZ+112;z+=4)for(let x=minX+16;x<=minX+112;x+=4){
    const h=terrainHeight(x,z,seed);
    if(h<3||h>11||origins.some(o=>inCaveBuffer(x,z,o)))continue;
    let level=true;
    for(let dz=-11;dz<=11&&level;dz++)
      for(let dx=-1;dx<=1;dx++)
        if(terrainHeight(x+dx,z+dz,seed)!==h){level=false;break;}
    if(!level)continue;
    const plan=planVoxelPilgrimCourt(caveWorld,x,z);
    if(!plan)continue;
    court=plan;
    for(const [px,py,pz,id] of plan.cells)blocks.set(key(px,py,pz),id);
    break courtSearch;
  }

  const prepared={seed,get:(x,y,z)=>blocks.get(key(x,y,z))??caveGet(x,y,z)};
  const paths=court?[[[court.origin[0],court.origin[2]-11],
                       [court.origin[0],court.origin[2]+11]]]:[];
  const grove=planVoxelGrove(prepared,{
    minX:minX+7,maxX:minX+120,minZ:minZ+7,maxZ:minZ+120,
    spacing:11,maxTrees:32,paths
  });
  const trees=[];
  for(const plan of grove?.plans||[]){
    // Preserve spawn breathing room, cave openings and the whole visitor route.
    if(plan.cells.some(([x,y,z])=>
      (Math.abs(x)<=8&&Math.abs(z)<=8)||
      origins.some(origin=>inCaveBuffer(x,z,origin))||
      blocks.has(key(x,y,z))))continue;
    trees.push(plan);
    for(const [x,y,z,id] of plan.cells)blocks.set(key(x,y,z),id);
  }
  return {
    seed,dx,dz,trees,court,caves:origins,blockCount:blocks.size,
    get(x,y,z){return blocks.get(key(x,y,z))??caveGet(x,y,z);}
  };
}
