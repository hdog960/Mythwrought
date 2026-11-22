// Conservative halo-aware *candidate* cave carving face-growth estimate.
// One source snapshot per halo voxel feeds both before and projected masks,
// preventing inconsistent source reads and double callback costs.
// NO GPU context, live-world writes, greedy mesh assumptions or new save format.
import {detachedCalibratedUnderworldAirAt}
 from './depth-calibrated-proposal.mjs';

const INT=Number.isSafeInteger;
const faceBytes=faces=>{
 const vertices=faces*4,indices=faces*6;
 return vertices*32+indices*(vertices>65535?4:2);
};
export function auditProposedChunkCarveDelta({
 origin,side=16,isSolidAt,candidateAirAt,maxFaceGrowth=1200,maxCells=20000
}={}){
 if(!origin||!['x','y','z'].every(k=>INT(origin[k]))||
  !INT(side)||side<4||side>24||
  typeof isSolidAt!=='function'||typeof candidateAirAt!=='function'||
  !INT(maxFaceGrowth)||maxFaceGrowth<0||maxFaceGrowth>50000||
  !INT(maxCells)||maxCells<216||maxCells>20000)
  throw new TypeError('Invalid detached binary chunk projection');
 const width=side+2,volume=width**3;
 if(volume>maxCells)return Object.freeze({ok:false,
  reason:'HALO_BUDGET_EXCEEDED',sampledHaloCells:volume,
  maxCells,worldEdited:false});
 const base=new Uint8Array(volume),future=new Uint8Array(volume),
  idx=(x,y,z)=>x+width*(z+width*y);
 let queriedSourceCells=0,queriedCandidateCells=0,carvedCells=0;
 for(let y=0;y<width;y++)for(let z=0;z<width;z++)for(let x=0;x<width;x++){
  const wx=origin.x+x-1,wy=origin.y+y-1,wz=origin.z+z-1;
  const isSolid=isSolidAt(wx,wy,wz);queriedSourceCells++;
  if(typeof isSolid!=='boolean')throw TypeError('Nonboolean original solid voxel');
  let futureSolid=isSolid;
  if(isSolid){
   const carve=candidateAirAt(wx,wy,wz);queriedCandidateCells++;
   if(typeof carve!=='boolean')throw TypeError('Nonboolean candidate AIR');
   if(carve){futureSolid=false;
    if(x>=1&&x<=side&&y>=1&&y<=side&&z>=1&&z<=side)
     carvedCells++;
   }
  }
  base[idx(x,y,z)]=Number(isSolid);
  future[idx(x,y,z)]=Number(futureSolid);
 }
 const neighbor=[-1,1,-width,width,-width*width,width*width];
 const exposed=mask=>{
  let count=0;
  for(let y=1;y<=side;y++)for(let z=1;z<=side;z++)
   for(let x=1;x<=side;x++){
    const k=idx(x,y,z);
    if(!mask[k])continue;
    for(const d of neighbor)if(!mask[k+d])count++;
   }
  return count;
 };
 const before=exposed(base),after=exposed(future);
 const delta=after-before,growth=Math.max(0,delta);
 const ok=growth<=maxFaceGrowth;
 return Object.freeze({ok,reason:ok?null:'FACE_GROWTH_BUDGET',
  origin:Object.freeze({...origin}),side,
  baselineFaces:before,projectedFaces:after,
  exposedFaceDelta:delta,exposedFaceGrowth:growth,
  newlyCarvedSolidCells:carvedCells,
  originalSourceQueries:queriedSourceCells,
  candidateSolidQueries:queriedCandidateCells,
  baselineIllustrativeBytes:faceBytes(before),
  projectedIllustrativeBytes:faceBytes(after),
  illustrativeBytesDelta:faceBytes(after)-faceBytes(before),
  facesBudget:maxFaceGrowth,
  originalSolidMaskSinglePass:true,
  originalWorldUntouched:true,
  detachedResearchOnly:true,
  realGPUBufferBytesUnverified:true,
  realPlayerCollisionUnverified:true,
  mobileFrameTimeUnverified:true});
}
export function auditDetachedRampChunkProjection(seed,origin,{
 side=16,futureRampAirAt,maxFaceGrowth=1200,maxCells=20000
}={}){
 if(!INT(seed)||seed!==(seed|0)||typeof futureRampAirAt!=='function')
  throw TypeError('Invalid detached ramp projection input');
 return auditProposedChunkCarveDelta({origin,side,maxFaceGrowth,maxCells,
  isSolidAt:(x,y,z)=>!detachedCalibratedUnderworldAirAt(seed,x,y,z),
  candidateAirAt:futureRampAirAt});
}
