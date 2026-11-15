// Pack 1 + Pack 4 authored physical faces for the existing nine-float terrain
// vertex ABI. No new shader, texture IDs, biome130 registration or world writes.
// Pack 1 uses original source face pixels (bounded 4x4 texel bake); Pack 4
// preserves its original opaque and translucent source material triangles.
import {CHUNK_SIZE} from '../voxel.mjs';
import {sectionBounds} from '../depth.mjs';
import {candidateSurface,candidateFaceTexture} from '../block-packs/pack-1/webgl2-candidates.mjs';
import {pack4BuilderAsset} from '../block-packs/pack-4/builder-handoff.mjs';

export const MANUAL14_VERTICES_PER_CHUNK=12000;
const MATERIAL_COLOR=0; // Preserve source RGB without legacy terrain-specific art.
const MATERIAL_ALPHA=20; // Existing blended, source-alpha Pack 2 shader path.
const FACE_LIGHT={west:.78,east:.91,bottom:.54,top:1,north:.84,south:.94};
const CACHE_LIMIT=40,geometryCache=new Map();
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function emit(out,at,p,rgb,alpha=1,uv=[0,0]){
 out.push(p[0]+at[0],p[1]+at[1],p[2]+at[2],
  rgb[0],rgb[1],rgb[2],uv[0],uv[1],
  alpha<.999?MATERIAL_ALPHA+clamp(alpha,.02,.998):MATERIAL_COLOR);
}
const cross=(a,b,t)=>a.map((v,i)=>v+(b[i]-v)*t);
function texel(texture,u,v){
 const w=texture.width,h=texture.height,px=texture.pixels;
 const x=clamp(Math.floor(clamp(u,0,1-1e-7)*w),0,w-1);
 const y=clamp(Math.floor(clamp(v,0,1-1e-7)*h),0,h-1);
 const offset=4*(y*w+x);
 return [px[offset]/255,px[offset+1]/255,px[offset+2]/255,px[offset+3]/255];
}
function trianglesForPack1(asset){
 const out=[],transparent=[];
 const original=candidateSurface(asset.numericId,asset.orientation);
 const textureCache=new Map();
 // Source exact six corners preserve the original front-face winding.
 // Four subdivisions of each source triangle preserve distinct texture color
 // at handheld scale without creating a second GPU atlas or a large draw call.
 const steps=4;
 for(const face of original.quads){
  const textureKey=face.role+'|'+face.face;
  let texture=textureCache.get(textureKey);
  if(!texture){texture=candidateFaceTexture(asset.numericId,face.role,face.face,24);textureCache.set(textureKey,texture);}
  const light=FACE_LIGHT[face.face]??.85;
  for(let start=0;start<6;start+=3){
   const points=face.positions.slice(start,start+3),uv=face.uv.slice(start,start+3);
   const interpolate=(i,j)=>{
    const a=i/steps,b=j/steps,c=1-a-b;
    return {p:points[0].map((v,k)=>c*v+a*points[1][k]+b*points[2][k]),
      uv:uv[0].map((v,k)=>c*v+a*uv[1][k]+b*uv[2][k])};
   };
   function tri(A,B,C){
    const middle=A.uv.map((v,k)=>(v+B.uv[k]+C.uv[k])/3);
    const rgba=texel(texture,...middle);
    if(rgba[3]<.5)return; // Exact source alpha-cutout art, never opaque foliage planes.
    const output=rgba[3]<.999?transparent:out;
    const rgb=rgba.slice(0,3).map(c=>c*light);
    for(const v of [A,B,C])emit(output,[0,0,0],v.p,rgb,rgba[3],v.uv);
   }
   for(let i=0;i<steps;i++)for(let j=0;j<steps-i;j++){
    const a=interpolate(i,j),b=interpolate(i+1,j),c=interpolate(i,j+1);
    tri(a,b,c);
    if(i+j<steps-1)tri(b,interpolate(i+1,j+1),c);
   }
  }
 }
 return {opaque:new Float32Array(out),transparent:new Float32Array(transparent)};
}
function trianglesForPack4(asset){
 const rendered=pack4BuilderAsset(asset.asset,{candidateId:asset.numericId,rotation:asset.orientation});
 const opaque=[],transparent=[];
 for(const [source,out] of [[rendered.previewMesh.opaque,opaque],
                            [rendered.previewMesh.translucent,transparent]]){
  const stride=rendered.previewMesh.stride;
  if(stride!==10||source.length%stride)throw Error('Invalid authored Pack 4 preview ABI');
  for(let i=0;i<source.length;i+=stride){
   const p=[source[i],source[i+1],source[i+2]],color=[source[i+6],source[i+7],source[i+8]];
   const a=source[i+9];
   if(a>.001)emit(a<.999?transparent:out,[0,0,0],p,color,a,[p[0],p[1]]);
  }
 }
 return {opaque:new Float32Array(opaque),transparent:new Float32Array(transparent)};
}
function geometry(asset){
 const key=[asset.numericId,asset.orientation,asset.variant??''].join(':');
 if(geometryCache.has(key))return geometryCache.get(key);
 // Pack 1 upper slabs/stairs have variant-owned physical geometry. Never
 // silently substitute lower faces; the generic union renderer is used instead.
 let parts;
 if(asset.sourcePack===1&&asset.variant==='upper'){
  const out=[];
  const faces=[
   {corners:b=>[[b[0],b[1],b[2]],[b[0],b[1],b[5]],[b[0],b[4],b[5]],[b[0],b[4],b[2]]],side:'west'},
   {corners:b=>[[b[3],b[1],b[5]],[b[3],b[1],b[2]],[b[3],b[4],b[2]],[b[3],b[4],b[5]]],side:'east'},
   {corners:b=>[[b[0],b[1],b[5]],[b[3],b[1],b[5]],[b[3],b[1],b[2]],[b[0],b[1],b[2]]],side:'bottom'},
   {corners:b=>[[b[0],b[4],b[2]],[b[3],b[4],b[2]],[b[3],b[4],b[5]],[b[0],b[4],b[5]]],side:'top'},
   {corners:b=>[[b[3],b[1],b[2]],[b[0],b[1],b[2]],[b[0],b[4],b[2]],[b[3],b[4],b[2]]],side:'north'},
   {corners:b=>[[b[0],b[1],b[5]],[b[3],b[1],b[5]],[b[3],b[4],b[5]],[b[0],b[4],b[5]]],side:'south'}
  ];
  for(const box of asset.shape.visibleBoxes){
   for(const {corners,side} of faces){
    const p=corners(box),t=candidateFaceTexture(asset.numericId,'stone',side,24);
    const rgba=texel(t,.5,.5),rgb=rgba.slice(0,3).map(x=>x*FACE_LIGHT[side]);
    for(const idx of [0,1,2,0,2,3])emit(out,[0,0,0],p[idx],rgb,rgba[3]);
   }
  }
  parts={opaque:new Float32Array(out),transparent:new Float32Array(0)};
 }else{
  parts=asset.sourcePack===1?trianglesForPack1(asset):trianglesForPack4(asset);
 }
 if((parts.opaque.length+parts.transparent.length)/9>MANUAL14_VERTICES_PER_CHUNK)
  throw RangeError('One authored manual1/4 shape exceeds mobile vertex budget');
 if(geometryCache.size>=CACHE_LIMIT)geometryCache.delete(geometryCache.keys().next().value);
 geometryCache.set(key,parts);
 return parts;
}
export function meshManual14Chunk(layer,cx,cz,section=0,{maxVertices=MANUAL14_VERTICES_PER_CHUNK}={}){
 if(!layer||typeof layer.entries!=='function'||![cx,cz,section,maxVertices].every(Number.isInteger)||
   maxVertices<0||maxVertices>MANUAL14_VERTICES_PER_CHUNK)
  throw TypeError('Invalid manual1/4 chunk mesh request');
 const {minY,maxY}=sectionBounds(section),worldX=cx*CHUNK_SIZE,worldZ=cz*CHUNK_SIZE;
 const opaque=[],transparent=[];
 let included=0,vertexCount=0;
 for(const asset of layer.entries()){
  const [x,y,z]=asset.at;
  if(x<worldX||x>=worldX+CHUNK_SIZE||z<worldZ||z>=worldZ+CHUNK_SIZE||
     y<minY||y>maxY)continue;
  const parts=geometry(asset);
  const newCount=(parts.opaque.length+parts.transparent.length)/9;
  if(vertexCount+newCount>maxVertices)
   throw RangeError('Manual 1/4 chunk exceeds bounded iPhone triangle budget');
  vertexCount+=newCount;included++;
  const add=(dest,arr)=>{for(let i=0;i<arr.length;i+=9){
    dest.push(arr[i]+x,arr[i+1]+y,arr[i+2]+z,
      arr[i+3],arr[i+4],arr[i+5],arr[i+6],arr[i+7],arr[i+8]);
  }};
  add(opaque,parts.opaque);add(transparent,parts.transparent);
 }
 return Object.freeze({opaque:new Float32Array(opaque),transparent:new Float32Array(transparent),
   instances:included,vertices:vertexCount,authoringSource:'original-Pack1-pixels-and-Pack4-material-meshes'});
}
