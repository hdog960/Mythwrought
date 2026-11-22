// Conservative SOURCE ONLY binary-cube chunk exposure census.
// It is not the game's renderer and does NOT allocate/upload GPU buffers.
// Naive unmerged quads approximate risk, NOT measured device memory or FPS.
import {detachedCalibratedUnderworldAirAt}
 from './depth-calibrated-proposal.mjs';
const int=Number.isSafeInteger;
export function auditBinaryChunkSurface({origin,side=16,isSolidAt,maxCells=20000}={}){
 if(!origin||![origin.x,origin.y,origin.z].every(int)||
    !int(side)||side<4||side>24||typeof isSolidAt!=='function'||
    !int(maxCells)||maxCells<216||maxCells>20000)
  throw new TypeError('Invalid source-only chunk exposure query');
 const p=side+2,volume=p*p*p;
 if(volume>maxCells)return Object.freeze({ok:false,
  reason:'HALO_SAMPLE_BUDGET',volume,maxCells});
 const solid=new Uint8Array(volume);
 const at=(x,y,z)=>x+p*(z+p*y);
 for(let y=0;y<p;y++)for(let z=0;z<p;z++)for(let x=0;x<p;x++){
  if(isSolidAt(origin.x+x-1,origin.y+y-1,origin.z+z-1))
   solid[at(x,y,z)]=1;
 }
 let solidVoxelCount=0,airVoxelCount=0,exposedFaceCount=0;
 const axisFaces=[0,0,0,0,0,0];
 for(let y=1;y<=side;y++)for(let z=1;z<=side;z++)
  for(let x=1;x<=side;x++){
   const k=at(x,y,z);
   if(!solid[k]){airVoxelCount++;continue;}
   solidVoxelCount++;
   const delta=[-1,1,-p,p,-p*p,p*p];
   for(let face=0;face<6;face++)if(!solid[k+delta[face]]){
    exposedFaceCount++;axisFaces[face]++;
   }
  }
 const naiveVertices=exposedFaceCount*4,
  naiveIndices=exposedFaceCount*6;
 const bytesPerIndex=naiveVertices>65535?4:2;
 const illustrativeVertexBytes=naiveVertices*32;
 const illustrativeIndexBytes=naiveIndices*bytesPerIndex;
 return Object.freeze({ok:true,origin,side,solidVoxelCount,airVoxelCount,
  sampledHaloCells:volume,exposedFaceCount,
  facesByAxis:Object.freeze(axisFaces),
  naiveUnmergedVertices:naiveVertices,
  naiveUnmergedIndices:naiveIndices,illustrativeIndexWidthBytes:bytesPerIndex,
  illustrativeVertexBytes,illustrativeIndexBytes,
  illustrativeTotalBytes:illustrativeVertexBytes+illustrativeIndexBytes,
  actualGpuBuffersCreated:false,actualRenderMeshesVerified:false,
  greedyMeshReductionNotEstimated:true,nonBlockDetailUnmeasured:true,
  mobileP95MsNotMeasured:true});
}
export function auditDetachedChunkSurface(seed,origin,{side=16}={}){
 if(!int(seed)||seed!==(seed|0))
  throw new TypeError('Invalid detached chunk source seed');
 return auditBinaryChunkSurface({origin,side,
  isSolidAt:(x,y,z)=>!detachedCalibratedUnderworldAirAt(seed,x,y,z)});
}
