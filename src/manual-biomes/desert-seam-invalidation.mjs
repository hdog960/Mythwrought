// Desert P3 isolated integration research: refresh the bounded visual
// three-block halo when an edited original cap may feed neighboring meshes.
// No changes to world generation, saves, physics, shader or voxel identities.
import {chunkCoord,CHUNK_SIZE} from '../voxel.mjs';
import {editAffectedChunks} from '../chunks.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';

export const DESERT_SEAM_VISUAL_RADIUS=3;
export function desertSeamEditAffectedChunks(world,x,z,y){
  const original=editAffectedChunks(x,z);
  if(!Number.isInteger(y))throw Error('Desert visual edit Y must be integer');
  const sourceWorld=world?.base?.generationProfile?world.base:world;
  if(sourceWorld?.generationProfile?.generator!==M7_ENVIRONMENT_GENERATOR||
     typeof sourceWorld._columnPlan!=='function')return original;
  const naturalPlan=sourceWorld._columnPlan(x,z);
  if(!naturalPlan.size)return original;
  let naturalY=-Infinity;
  for(const level of naturalPlan.keys())if(level>naturalY)naturalY=level;
  if(naturalY!==y)return original;
  const id=naturalPlan.get(naturalY);
  // Existing source RGB cue only accepts M7 original scree 401 or
  // source-authentic low-weight Desert hardpan 258. Other source materials,
  // edited above-surface blocks, and buried mine operations use legacy refresh.
  if(id!==401){
    if(id!==258)return original;
    const region=v6BiomeAt(x,z,sourceWorld.seed);
    if(region?.name!=='desert'||region.weight>.50)return original;
  }
  const coords=new Map(original.map(p=>[p.cx+','+p.cz,p]));
  const minX=chunkCoord(x+.5-DESERT_SEAM_VISUAL_RADIUS);
  const maxX=chunkCoord(x+.5+DESERT_SEAM_VISUAL_RADIUS);
  const minZ=chunkCoord(z+.5-DESERT_SEAM_VISUAL_RADIUS);
  const maxZ=chunkCoord(z+.5+DESERT_SEAM_VISUAL_RADIUS);
  // A single source can reach at most one adjacent chunk per axis; preserve
  // every old geometry seam refresh including the cardinal edge set.
  if(maxX-minX>1||maxZ-minZ>1)
    throw Error('Desert color seam unexpectedly exceeds one neighboring chunk');
  const centerX=x+.5,centerZ=z+.5;
  const radiusSquared=DESERT_SEAM_VISUAL_RADIUS*DESERT_SEAM_VISUAL_RADIUS;
  for(let cx=minX;cx<=maxX;cx++)
    for(let cz=minZ;cz<=maxZ;cz++){
      const key=cx+','+cz;
      if(coords.has(key))continue; // Never discard a genuine geometry seam.
      // The source cue fades to zero at radius three. A diagonal chunk
      // outside the TRUE circular footprint cannot change any top vertex,
      // even though the old rectangular halo covered it. Preserve the
      // original cardinal geometry refresh independently of this test.
      const nearestX=Math.max(cx*CHUNK_SIZE,Math.min(centerX,(cx+1)*CHUNK_SIZE));
      const nearestZ=Math.max(cz*CHUNK_SIZE,Math.min(centerZ,(cz+1)*CHUNK_SIZE));
      const dx=nearestX-centerX,dz=nearestZ-centerZ;
      if(dx*dx+dz*dz>=radiusSquared)continue;
      coords.set(key,{cx,cz});
    }
  if(coords.size>5)throw Error('Desert visual seam edit batch too broad');
  return [...coords.values()];
}
