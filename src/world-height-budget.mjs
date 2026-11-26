// Retain authenticated upper source budgets: 24,576 vertices x 36 bytes,
 // 2 MiB total staged bytes, at most eight nonempty upper owners.
import {SKY_MESH_MAX_VERTICES,SKY_MESH_VERTEX_BYTES,SKY_MESH_MAX_STAGED_BYTES} from './floating-islands/sky-source-mesh.mjs';
export const UPPER_SECTION_BYTES=SKY_MESH_MAX_VERTICES*SKY_MESH_VERTEX_BYTES;
export const UPPER_STAGE_BYTES=SKY_MESH_MAX_STAGED_BYTES;
export const UPPER_GPU_OWNERS=8;
export const UPPER_RESIDENT_BYTES=UPPER_GPU_OWNERS*UPPER_SECTION_BYTES;
const size=c=>(c.count+c.waterCount)*36;
export function upperGpuStats(chunks){
 let bytes=0,owners=0;
 for(const c of chunks.values())if(c.section>0&&size(c)>0){bytes+=size(c);owners++;}
 return {bytes,owners};
}
export function validateUpperSectionGeometry(vertices,water){
 if(!(vertices instanceof Float32Array)||!(water instanceof Float32Array)||vertices.length%9||water.length%9)throw Error('Invalid upper packed vertices');
 const n=vertices.byteLength+water.byteLength;
 if(n>UPPER_SECTION_BYTES)throw Error('Upper section exceeds inherited 864 KiB budget');
 return n;
}
// Validate BEFORE any GPU allocation. Replacement peak retains all old
// buffers plus new staging bytes until atomic publication.
export function admitUpperGpuBatch(chunks,batch){
 let {bytes,owners}=upperGpuStats(chunks),staged=0;
 const seen=new Set();
 for(const item of batch){
  if(item.section<=0)continue;
  if(seen.has(item.key))throw Error('Duplicate upper GPU owner');
  seen.add(item.key);
  const n=validateUpperSectionGeometry(item.vertices,item.water);
  const old=chunks.get(item.key),prior=old?size(old):0;
  staged+=n;bytes+=n-prior;owners+=Number(n>0)-Number(prior>0);
 }
 if(staged>UPPER_STAGE_BYTES||bytes>UPPER_RESIDENT_BYTES||owners>UPPER_GPU_OWNERS)
  throw Error('Upper aggregate GPU budget exceeded');
 return {bytes,owners,staged,peak:upperGpuStats(chunks).bytes+staged};
}

// Retain only resident replacement work; unloaded owners are checked individually.
export function createUpperBatchBuilder(isResident){
 if(typeof isResident!=='function')throw TypeError('Invalid resident predicate');
 const batch=[];let staged=0;
 return Object.freeze({add(item){
  if(item.section>0){
   const n=validateUpperSectionGeometry(item.vertices,item.water);
   if(!isResident(item.key))return;
   if(staged+n>UPPER_STAGE_BYTES)throw Error('Upper staging budget exceeded before retaining batch');
   staged+=n;
  }else if(!isResident(item.key))return;
  batch.push(item);
 },get staged(){return staged;},finish:()=>batch});
}
