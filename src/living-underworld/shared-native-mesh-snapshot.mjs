// Detached transaction-scoped original source snapshot for real native
// mesher calls. No live renderer hookup, writes or cross-frame cache.
import {meshChunk} from '../voxel.mjs';
import {meshDepthSection} from '../depth-mesh.mjs';
import {sectionBounds,depthMeshKey} from '../depth.mjs';
import {GALLERY_CONSTRUCTION_LIMITS as limits} from './physical-gallery-construction.mjs';
const decode=k=>{const [cx,cz,s=0]=k.split(',').map(Number);return {cx,cz,s};};
export function meshHaloBounds(k){
 const {cx,cz,s}=decode(k),b=sectionBounds(s);
 if(depthMeshKey(cx,cz,s)!==k)throw TypeError('Noncanonical engine owner key');
 return [cx*16-1,b.minY-1,cz*16-1,cx*16+17,b.maxY+2,cz*16+17];
}
// Exact union volume via coordinate compression; boxes are half-open.
export function sharedMeshHaloCells(keys){
 const boxes=[...new Set(keys)].map(meshHaloBounds);
 const axis=i=>[...new Set(boxes.flatMap(b=>[b[i],b[i+3]]))].sort((a,b)=>a-b);
 const [xs,ys,zs]=[axis(0),axis(1),axis(2)];
 let volume=0;
 for(let i=1;i<xs.length;i++)for(let j=1;j<ys.length;j++)for(let k=1;k<zs.length;k++){
  const x=xs[i-1],y=ys[j-1],z=zs[k-1];
  if(boxes.some(b=>x>=b[0]&&x<b[3]&&y>=b[1]&&y<b[4]&&z>=b[2]&&z<b[5]))
   volume+=(xs[i]-x)*(ys[j]-y)*(zs[k]-z);
 }
 return volume;
}
export function meshReadOnlySharedBatch(world,keys){
 if(!world||typeof world.get!=='function'||!Array.isArray(keys)||!keys.length||
    keys.length>6||new Set(keys).size!==keys.length)
  throw TypeError('Bounded six-section native transaction required');
 const theoretical=sharedMeshHaloCells(keys);
 if(theoretical>limits.originalNaturalReads)
  return {ok:false,reason:'SHARED_HALO_READ_BUDGET',theoretical,meshes:[]};
 const cache=new Map();let calls=0,hits=0;
 const view=Object.create(world);
 Object.defineProperty(view,'get',{value(x,y,z){
  const k=x+','+y+','+z;
  if(cache.has(k)){hits++;return cache.get(k);}
  // Real mesher may use extra reads outside its nominal voxel halo.
  // Count them too. Never return a fabricated value or partially admit.
  if(calls>=limits.originalNaturalReads)throw Error('NATIVE_MESH_SOURCE_READ_BUDGET');
  const v=world.get(x,y,z);calls++;cache.set(k,v);return v;
 }});
 const meshes=[];
 try{
  for(const k of keys){
   const {cx,cz,s}=decode(k);
   const vertices=s===0?meshChunk(view,cx,cz):meshDepthSection(view,cx,cz,s);
   meshes.push({key:k,vertices});
  }
 }catch(error){
  if(error.message!=='NATIVE_MESH_SOURCE_READ_BUDGET')throw error;
  return {ok:false,reason:error.message,theoretical,calls,hits,meshes:[]};
 }
 return {ok:true,theoretical,calls,hits,meshes,
  sourceCacheTransactionOnly:true,actualGpuVerified:false,constructionAdmission:false};
}
