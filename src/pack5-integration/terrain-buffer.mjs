/**
 * Pack 5 source-authored indexed triangles -> production Mythwrought nine-float
 * terrain shader vertices: x,y,z,r,g,b,u,v,material. No cube substitution.
 * Material 0 deliberately preserves authored colors without applying the
 * special grass/stone/timber procedural shader to furniture.
 */
import {uploadChunkBuffer,MAX_CHUNK_UPLOAD_BYTES,GpuUploadRetry} from '../gpu-recovery.mjs';
import {resolvePack5BuilderAsset} from './catalog.mjs';
export const PACK5_DRAW_INSTANCE_BUDGET=256;
export const PACK5_DRAW_DISTANCE=48;
const finite=v=>Number.isFinite(v);
const clamp=n=>Math.max(0,Math.min(1,n));

export function pack5TerrainVertices(mesh){
  if(!mesh||!mesh.positions||!mesh.colors||!mesh.indices||
      mesh.positions.length%3!==0||mesh.colors.length!==mesh.positions.length/3*4||
      mesh.indices.length%3!==0||mesh.indices.length>100000)
    throw Error('Invalid Pack 5 shaped mesh buffer');
  const vertices=mesh.positions.length/3;
  if(!Number.isInteger(vertices)||vertices<3)throw Error('Empty Pack 5 mesh');
  const output=new Float32Array(mesh.indices.length*9);
  for(let i=0;i<mesh.indices.length;i++){
    const n=mesh.indices[i];
    if(!Number.isSafeInteger(n)||n<0||n>=vertices)throw Error('Pack 5 triangle index outside mesh');
    const p=n*3,c=n*4,o=i*9;
    const x=mesh.positions[p],y=mesh.positions[p+1],z=mesh.positions[p+2];
    const r=mesh.colors[c],g=mesh.colors[c+1],b=mesh.colors[c+2],a=mesh.colors[c+3];
    if(![x,y,z,r,g,b,a].every(finite)||a<0||a>1)throw Error('Non-finite Pack 5 vertex');
    output[o]=x;output[o+1]=y;output[o+2]=z;
    output[o+3]=clamp(r);output[o+4]=clamp(g);output[o+5]=clamp(b);
    // Material 0 has no texture/material family: neutral authored pigments.
    output[o+6]=x-Math.floor(x);output[o+7]=z-Math.floor(z);
    output[o+8]=0;
  }
  if(output.byteLength>MAX_CHUNK_UPLOAD_BYTES)throw Error('Pack 5 mesh staging budget exceeded');
  return output;
}

/**
 * Paged Pack 5 renderer: bounded resident GPU bytes, at most eight draws and
 * one staged page upload per refresh. No fixed 16-object visibility cutoff.
 *
 * Only the nearest pages that fit the byte budget are resident. Full scenes
 * remain in the independent sidecar and retain exact collisions/picking even
 * when a far page is not rendered. No schema-1 changes or new numeric IDs.
 */
export const PACK5_GPU_RESIDENT_BYTES=2*1024*1024;
export const PACK5_GPU_MAX_PAGES=8;
export const PACK5_GPU_PAGE_BYTES=384*1024;
export const PACK5_GPU_PAGE_INSTANCES=12;
const byCell=(a,b)=>a.anchor[0]-b.anchor[0]||
  a.anchor[1]-b.anchor[1]||a.anchor[2]-b.anchor[2];
const rowKey=r=>r.anchor.join(',')+'/'+r.symbolicId+'/'+r.rotation+'/'+(r.variant??'');
function rowSize(record,cache){
  const key=record.symbolicId+'/'+record.rotation+'/'+(record.variant??'');
  if(!cache.has(key)){
    const {descriptor,mesh}=resolvePack5BuilderAsset(record.symbolicId,record.variant);
    const m=mesh(descriptor,{rotation:record.rotation});
    if(!m||!m.indices||!Number.isInteger(m.indices.length)||m.indices.length<3||
      m.indices.length%3!==0)throw Error('Invalid source-authored Pack 5 size');
    cache.set(key,m.indices.length*36); // same nine floats as production shader
  }
  return cache.get(key);
}
export function createPack5GpuStream(gl,layer,{
  maxInstances=PACK5_DRAW_INSTANCE_BUDGET,maxDistance=PACK5_DRAW_DISTANCE,
  maxBytes=PACK5_GPU_RESIDENT_BYTES,maxPages=PACK5_GPU_MAX_PAGES,
  pageBytes=PACK5_GPU_PAGE_BYTES,pageInstances=PACK5_GPU_PAGE_INSTANCES,
  uploadsPerRefresh=1
}={}){
  if(!gl||typeof gl.createBuffer!=='function'||typeof gl.deleteBuffer!=='function'||
    !layer||typeof layer.list!=='function'||typeof layer.meshAt!=='function'||
    !Number.isSafeInteger(maxInstances)||maxInstances<1||maxInstances>4096||
    !finite(maxDistance)||maxDistance<=0||maxDistance>128||
    !Number.isSafeInteger(maxBytes)||maxBytes<1024||maxBytes>MAX_CHUNK_UPLOAD_BYTES||
    !Number.isSafeInteger(maxPages)||maxPages<1||maxPages>16||
    !Number.isSafeInteger(pageBytes)||pageBytes<1024||pageBytes>maxBytes||
    !Number.isSafeInteger(pageInstances)||pageInstances<1||pageInstances>64||
    !Number.isSafeInteger(uploadsPerRefresh)||uploadsPerRefresh<1||uploadsPerRefresh>2)
    throw Error('Invalid Pack 5 paged GPU budget');
  const sizes=new Map(),retry=new GpuUploadRetry();
  let resident=new Map(),desired=[],pendingPages=0,visibleCandidates=0,
    budgetExcluded=0,uploadCount=0,uploadFailures=0,lastError='',
    lastDrawCalls=0,totalUploadedBytes=0,maxUploadedPageBytes=0;
  function choose(eye){
    const max2=maxDistance*maxDistance;
    const nearby=layer.list().map(record=>{
      const dx=record.anchor[0]+.5-eye[0],dz=record.anchor[2]+.5-eye[2];
      return {record,d:dx*dx+dz*dz};
    }).filter(o=>o.d<=max2&&Math.abs(o.record.anchor[1]-eye[1])<=32)
      .sort((a,b)=>a.d-b.d||byCell(a.record,b.record));
    visibleCandidates=nearby.length;
    const buckets=new Map();
    for(const {record,d} of nearby.slice(0,maxInstances)){
      const tile=[Math.floor(record.anchor[0]/12),
        Math.floor(record.anchor[1]/8),Math.floor(record.anchor[2]/12)].join(',');
      if(!buckets.has(tile))buckets.set(tile,[]);
      buckets.get(tile).push({record,d});
    }
    const pages=[];
    for(const [tile,rows] of buckets){
      rows.sort((a,b)=>byCell(a.record,b.record));
      let items=[],bytes=0,near=Infinity,index=0;
      const flush=()=>{
        if(!items.length)return;
        pages.push({key:tile+'#'+index++,items,bytes,near,
          signature:items.map(rowKey).join('|')});
        items=[];bytes=0;near=Infinity;
      };
      for(const {record,d} of rows){
        const cost=rowSize(record,sizes);
        if(cost>maxBytes)throw Error('Pack 5 authored object exceeds resident GPU budget');
        if(items.length&&(items.length>=pageInstances||bytes+cost>pageBytes))
          flush();
        // A single unusually complex source model is its own bounded page.
        items.push(record);bytes+=cost;near=Math.min(near,d);
      }
      flush();
    }
    pages.sort((a,b)=>a.near-b.near||a.key.localeCompare(b.key));
    const chosen=[];let used=0;
    for(const page of pages){
      if(chosen.length===maxPages)break;
      if(page.bytes+used>maxBytes)continue;
      chosen.push(page);used+=page.bytes;
    }
    budgetExcluded=visibleCandidates-chosen.reduce((n,p)=>n+p.items.length,0);
    return chosen;
  }
  const api={
    stats(){
      let bytes=0,instances=0,vertices=0,readyPages=0;
      for(const entry of resident.values())bytes+=entry.bytes;
      for(const page of desired){
        const entry=resident.get(page.key);
        if(entry&&entry.signature===page.signature){
          instances+=entry.instances;vertices+=entry.count;readyPages++;
        }
      }
      return {vertices,instances,bytes,hasBuffer:readyPages>0,
        pages:readyPages,drawCalls:lastDrawCalls,pendingPages,visibleCandidates,
        budgetExcluded,maxResidentBytes:maxBytes,maxPages,uploads:uploadCount,
        uploadFailures,totalUploadedBytes,maxUploadedPageBytes,lastError};
    },
    refresh(eye,now=Date.now()){
      if(!Array.isArray(eye)||eye.length!==3||!eye.every(finite)||
        !finite(now))throw Error('Invalid Pack 5 view position/time');
      const next=choose(eye),active=new Set(next.map(p=>p.key));
      let changed=false;
      for(const [key,entry] of resident){
        if(!active.has(key)){
          gl.deleteBuffer(entry.buffer);resident.delete(key);retry.success(key);changed=true;
        }
      }
      desired=next;
      let uploaded=0;
      for(const page of desired){
        if(uploaded>=uploadsPerRefresh)break;
        const existing=resident.get(page.key);
        if(existing?.signature===page.signature)continue;
        if(!retry.ready(page.key,now))continue;
        try{
          const blocks=page.items.map(row=>pack5TerrainVertices(layer.meshAt(row.anchor)));
          const total=blocks.reduce((sum,b)=>sum+b.length,0);
          if(total*4!==page.bytes||total*4>maxBytes)
            throw Error('Pack 5 source geometry size changed unexpectedly');
          const vertices=new Float32Array(total);
          let at=0;for(const block of blocks){vertices.set(block,at);at+=block.length;}
          const buffer=uploadChunkBuffer(gl,vertices);
          resident.set(page.key,{buffer,count:total/9,bytes:vertices.byteLength,
            instances:page.items.length,signature:page.signature});
          if(existing)gl.deleteBuffer(existing.buffer);
          uploadCount++;totalUploadedBytes+=vertices.byteLength;
          maxUploadedPageBytes=Math.max(maxUploadedPageBytes,vertices.byteLength);
          retry.success(page.key);lastError='';changed=true;uploaded++;
        }catch(error){
          uploadFailures++;lastError=String(error);
          retry.fail(page.key,now,error);
          // Never render stale geometry if a placement changed but upload failed.
          break;
        }
      }
      pendingPages=desired.reduce((n,page)=>{
        const entry=resident.get(page.key);
        return n+(entry?.signature===page.signature?0:1);
      },0);
      return changed;
    },
    draw({atPos,atColor,atUv,atMat}){
      for(const loc of [atPos,atColor,atUv,atMat])
        if(!Number.isInteger(loc)||loc<0)throw Error('Missing Pack 5 terrain attribute');
      let drawn=0;lastDrawCalls=0;
      for(const page of desired){
        const entry=resident.get(page.key);
        if(!entry||entry.signature!==page.signature)continue;
        gl.bindBuffer(gl.ARRAY_BUFFER,entry.buffer);
        gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);
        gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);
        gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);
        gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);
        gl.drawArrays(gl.TRIANGLES,0,entry.count);
        drawn+=entry.count;lastDrawCalls++;
      }
      return drawn;
    },
    invalidate(){
      // Lost WebGL contexts invalidate the old buffers; don't deleteBuffer.
      resident=new Map();desired=[];pendingPages=0;lastDrawCalls=0;
      retry.clear();lastError='';
    },
    dispose(){
      for(const entry of resident.values())gl.deleteBuffer(entry.buffer);
      api.invalidate();
    }
  };
  return Object.freeze(api);
}
