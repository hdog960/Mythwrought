// MYTHWROUGHT v0.07: global-coordinate seam selection and bounded edit batches.
import {CHUNK_SIZE,chunkCoord,meshChunk} from './voxel.mjs';

export function chunkKey(cx,cz){return cx+','+cz;}
export function editAffectedChunks(x,z){
  if(!Number.isInteger(x)||!Number.isInteger(z))throw Error('Voxel edit position must be integer');
  const cx=chunkCoord(x),cz=chunkCoord(z),localX=x-cx*CHUNK_SIZE,localZ=z-cz*CHUNK_SIZE;
  const result=[{cx,cz}];
  if(localX===0)result.push({cx:cx-1,cz});
  if(localX===CHUNK_SIZE-1)result.push({cx:cx+1,cz});
  if(localZ===0)result.push({cx,cz:cz-1});
  if(localZ===CHUNK_SIZE-1)result.push({cx,cz:cz+1});
  return result;
}

// Generate all replacement meshes before committing any replacement GPU buffer.
// Caller publishes the returned batch in ONE event turn, eliminating partial
// A/B seam updates visible between animation frames. Never touches saves.
export function prepareSeamBatch(world,loadedChunks,x,z,build=meshChunk){
  const batch=[];
  for(const {cx,cz} of editAffectedChunks(x,z)){
    const key=chunkKey(cx,cz);
    if(!loadedChunks.has(key))continue;
    batch.push({key,cx,cz,vertices:build(world,cx,cz)});
  }
  return batch;
}

export function priorityMissingChunks(pending,cx,cz){
  const available=[...pending.entries()];
  available.sort((a,b)=>{
    const [ax,az]=a[1],[bx,bz]=b[1];
    return (ax-cx)**2+(az-cz)**2-( (bx-cx)**2+(bz-cz)**2) ||
      az-bz || ax-bx;
  });
  return available;
}
