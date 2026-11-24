// Mountain V8 DETACHED original-source layered CPU staging study.
// No production imports, gameplay, user-save edits, GPU creation, material
// registration, new world routing or owner-source modifications.
// Mirrors current Desert P3 main.mjs opaque ordering:
//   meshChunk / meshDepthSection -> combinePack3ChunkMesh -> manual14.opaque
// and water order:
//   pack2WaterSectionVertices -> manual14.transparent.
// All original source builders are read-only inputs from the PINNED main
// checkout in focused native tests. The returned Map is only a CPU preview.
import {MAX_CHUNK_UPLOAD_BYTES,validateChunkUploadBytes}
  from '../gpu-recovery.mjs';
import {stageMountainV8ResearchCpuPreview,
  V8_RESEARCH_MAX_STAGE_BYTES}
  from './mountain-v8-p3-mesh-batch-rollback-research.mjs';

const f=Object.freeze;
const empty=()=>new Float32Array(0);
const append=(base,other)=>{
  if(!other.length)return base;
  const result=new Float32Array(base.length+other.length);
  result.set(base);result.set(other,base.length);return result;
};
const reject=(reason)=>f({status:'rejected',reason,
  sourceStages:f([]),projectedChunks:null,
  originalWorldWritten:false,originalSidecarsWritten:false,
  originalLoadedMapWritten:false,realGpuBufferAllocated:false,
  pack2WaterPassPreserved:false,pack3AndManual14OrderingPreserved:false,
  oldM7P3HaloInherited:false,newV8IdsRegistered:0,
  safeToIntegrate:false,runtimeActivationAuthorized:false});
/** Source input is an exact original materialized read-only world in CI;
 * no assertion of original source identity comes merely from a string.
 * Uses genuine original Pack2/Pack3/manual1/4 builders supplied by owner
 * without changing the originals or silently dropping a transparent pass.
 */
export function previewMountainV8OriginalLayeredCpu(plan,loadedOriginal,{
  world,pack3Runtime,manual14Layer,
  surfaceMesh,depthMesh,combinePack3,pack2Water,manual14Mesh,
  sourceWorldVersion='unchanged',limitBytes=V8_RESEARCH_MAX_STAGE_BYTES
}={}){
  if(!plan||plan.safeToIntegrate!==false||
     !(loadedOriginal instanceof Map)||!world||typeof world.save!=='function'||
     !pack3Runtime||typeof pack3Runtime.size!=='function'||
     !manual14Layer||typeof manual14Layer.entries!=='function'||
     [surfaceMesh,depthMesh,combinePack3,pack2Water,manual14Mesh]
       .some(v=>typeof v!=='function')||
     !Number.isSafeInteger(limitBytes)||limitBytes<0||
     limitBytes>V8_RESEARCH_MAX_STAGE_BYTES)
    return reject('invalid-original-owner-source-builders');
  let previous;
  try{previous=JSON.stringify(world.save());}
  catch{return reject('unverifiable-original-world-save');}
  const stages=[],keySet=new Set();
  let cumulativeBytes=0;
  try{
    if(plan.loaded.length>16||plan.loaded.length!==plan.originalEntries.length)
      throw Error('Too many original loaded chunk keys');
    for(const item of plan.loaded){
      if(!item||keySet.has(item.key)||!loadedOriginal.has(item.key))
        throw Error('Duplicate or absent original loaded key');
      keySet.add(item.key);
      const base=item.section===0?
        surfaceMesh(world,item.cx,item.cz):
        depthMesh(world,item.cx,item.cz,item.section);
      const baseBytes=validateChunkUploadBytes(base,MAX_CHUNK_UPLOAD_BYTES);
      const withPack3=combinePack3(base,pack3Runtime,item.cx,item.cz,item.section);
      const withPack3Bytes=validateChunkUploadBytes(withPack3,MAX_CHUNK_UPLOAD_BYTES);
      // Pack3's original composer must append; never change the source
      // terrain's original RGB, UV, material IDs, or vertex order.
      if(withPack3Bytes<baseBytes||withPack3.length<base.length)
        throw Error('Original Pack3 composer removed terrain');
      for(let i=0;i<base.length;i++)
        if(base[i]!==withPack3[i])
          throw Error('Original Pack3 composer mutated terrain');
      const manual=manual14Mesh(manual14Layer,item.cx,item.cz,item.section);
      if(!manual||!(manual.opaque instanceof Float32Array)||
         !(manual.transparent instanceof Float32Array))
        throw Error('Missing original Manual1/4 source mesh');
      const manualOpaqueBytes=validateChunkUploadBytes(manual.opaque,MAX_CHUNK_UPLOAD_BYTES);
      const manualTransparentBytes=validateChunkUploadBytes(manual.transparent,MAX_CHUNK_UPLOAD_BYTES);
      const sourceWater=pack2Water(world,item.cx,item.cz,item.section);
      const sourceWaterBytes=validateChunkUploadBytes(sourceWater,MAX_CHUNK_UPLOAD_BYTES);
      const finalOpaque=append(withPack3,manual.opaque);
      const finalWater=append(sourceWater,manual.transparent);
      const opaqueBytes=validateChunkUploadBytes(finalOpaque,MAX_CHUNK_UPLOAD_BYTES);
      const waterBytes=validateChunkUploadBytes(finalWater,MAX_CHUNK_UPLOAD_BYTES);
      cumulativeBytes+=opaqueBytes+waterBytes;
      if(cumulativeBytes>limitBytes)throw Error('Research-only aggregate stage budget exceeded');
      stages.push({key:item.key,baseBytes,pack3AddedBytes:withPack3Bytes-baseBytes,
        manualOpaqueBytes,manualTransparentBytes,sourceWaterBytes,
        opaqueBytes,waterBytes,finalOpaque,finalWater});
    }
    if(JSON.stringify(world.save())!==previous||sourceWorldVersion!=='unchanged')
      throw Error('Original world changed while building source layers');
  }catch{return reject('original-source-layer-mesh-or-budget-rejected');}
  const cache=new Map(stages.map(stage=>[stage.key,stage]));
  const staged=stageMountainV8ResearchCpuPreview(plan,loadedOriginal,{
    buildOpaque:(cx,cz,section)=>{
      const s=cache.get(section===0?cx+','+cz:cx+','+cz+','+section);
      if(!s)throw Error('Original stage key missing');
      return s.finalOpaque;
    },
    buildWater:(cx,cz,section)=>{
      const s=cache.get(section===0?cx+','+cz:cx+','+cz+','+section);
      if(!s)throw Error('Original water stage key missing');
      return s.finalWater;
    },
    stageTotalLimitBytes:limitBytes
  });
  if(staged.status!=='cpu-preview-only'||staged.stageCount!==stages.length)
    return reject('original-cpu-preview-refused');
  if(JSON.stringify(world.save())!==previous)
    return reject('original-save-changed-after-stage');
  return f({status:'source-layered-cpu-preview',sourceStages:f(stages.map(x=>f({
    key:x.key,baseBytes:x.baseBytes,pack3AddedBytes:x.pack3AddedBytes,
    manualOpaqueBytes:x.manualOpaqueBytes,
    manualTransparentBytes:x.manualTransparentBytes,
    pack2WaterBytes:x.sourceWaterBytes,
    opaqueBytes:x.opaqueBytes,waterBytes:x.waterBytes}))),
    projectedChunks:staged.projectedChunks,
    projectedStageCount:staged.stageCount,
    projectedTotalBytes:staged.bytesStaged,
    originalWorldWritten:false,originalSidecarsWritten:false,
    originalLoadedMapWritten:false,realGpuBufferAllocated:false,
    pack2WaterPassPreserved:true,pack3AndManual14OrderingPreserved:true,
    oldM7P3HaloInherited:false,newV8IdsRegistered:0,
    safeToIntegrate:false,runtimeActivationAuthorized:false});
}
