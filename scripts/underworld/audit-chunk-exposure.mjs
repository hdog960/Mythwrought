// Detached candidate binary cube exposure planning, NOT actual GPU usage.
// Halo-aware counts avoid treating chunk edges as zero-occupancy artifacts.
import fs from 'node:fs';
import {planUnderworldRegion,UNDERWORLD_LEVELS}
 from '../../src/living-underworld/worldwide-network.mjs';
import {auditDetachedChunkSurface}
 from '../../src/living-underworld/chunk-exposure-audit.mjs';
const seeds=[179,-17,2026,314159],regions=[[0,0],[-128,64]],side=16;
const records=[];
for(const seed of seeds)for(const [rx,rz] of regions){
 const plan=planUnderworldRegion(seed,rx,rz);
 for(const depth of UNDERWORLD_LEVELS){
  const hub=plan.layers.find(x=>x.name===depth.name).hub;
  const origin={x:Math.floor(hub.x/side)*side,
   y:Math.floor(hub.y/side)*side,
   z:Math.floor(hub.z/side)*side};
  const result=auditDetachedChunkSurface(seed,origin,{side});
  if(!result.ok)throw Error('Unexpected binary chunk audit error');
  records.push({seed,rx,rz,depth:depth.name,
   origin,sourceCells:result.solidVoxelCount+result.airVoxelCount,
   solid:result.solidVoxelCount,air:result.airVoxelCount,
   exposedFaces:result.exposedFaceCount,
   illustrativeBytes:result.illustrativeTotalBytes,
   naiveVertices:result.naiveUnmergedVertices,
   illustrativeIndexWidthBytes:result.illustrativeIndexWidthBytes,
   sampledHaloCells:result.sampledHaloCells});
 }
}
const byDepth={};for(const depth of UNDERWORLD_LEVELS){
 const list=records.filter(x=>x.depth===depth.name);
 byDepth[depth.name]={chunks:list.length,
  minExposedFaces:Math.min(...list.map(x=>x.exposedFaces)),
  maxExposedFaces:Math.max(...list.map(x=>x.exposedFaces)),
  avgExposedFaces:list.reduce((a,b)=>a+b.exposedFaces,0)/list.length,
  maxIllustrativeBytes:Math.max(...list.map(x=>x.illustrativeBytes))};
}
if(records.length!==32)throw Error('Incomplete detached chunk footprint');
const result={schema:'living-underworld-naive-binary-chunk-exposure-v1',
 type:'PROTOTYPE_CHUNK_RISK_ONLY_NOT_RENDERER_OR_GPU',
 noWebGLContext:true,noActualBufferUploads:true,
 iPhoneP95NotMeasured:true,nonBlockDetailsExcluded:true,
 greedyMeshingNotApplied:true,
 vertexStrideAssumptionBytes:32,
 illustrativeOnlyNotProductionMemoryBudget:true,
 byDepth,records};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({chunks:records.length,byDepth,
 maxFaces:Math.max(...records.map(x=>x.exposedFaces)),
 maxIllustrativeBytes:Math.max(...records.map(x=>x.illustrativeBytes))}));
