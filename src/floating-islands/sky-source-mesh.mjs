// MYTHWROUGHT Floating Islands: physical, source-backed upper-section meshing.
// Deliberately independent of any particular island generator. All voxels and
// edits come from authoritative host callbacks; no island generator is copied.
// Produces the existing game's opaque 9-float WebGL2 terrain vertex format.
// No GPU allocations, world writes, persistence writes, or ground shadow pass.
import {skyIslandSectionBounds,skyIslandMeshKey} from './sky-runtime-adapter.mjs';

export const SKY_MESH_FLOATS_PER_VERTEX=9;
export const SKY_MESH_VERTEX_BYTES=36;
export const SKY_MESH_MAX_VERTICES=24576; // <= 864 KiB per upper-section mesh
export const SKY_MESH_MAX_STAGED_BYTES=2*1024*1024;
const AIR=0,EDGE=16,MAX_ID=65534;
const faces=[
  {n:[1,0,0],corners:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],lit:.77},
  {n:[-1,0,0],corners:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],lit:.73},
  {n:[0,1,0],corners:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],lit:1},
  {n:[0,-1,0],corners:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],lit:.48},
  {n:[0,0,1],corners:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]],lit:.85},
  {n:[0,0,-1],corners:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]],lit:.67}
];
const triangles=[0,1,2,0,2,3],uv=[[0,0],[0,1],[1,1],[1,0]];
const valid=n=>typeof n==='number'&&Number.isFinite(n);
const safe=n=>Number.isSafeInteger(n);
const fail=s=>{throw new TypeError('Sky physical mesh: '+s);};
const cellKey=(x,y,z)=>x+','+y+','+z;
const validateCellId=id=>{
  if(!Number.isInteger(id)||id<0||id>MAX_ID)fail('invalid voxel ID from physical source');
  return id;
};
function validateCoords(cx,cz){
  if(!safe(cx)||!safe(cz)||!safe(cx*EDGE-1)||!safe(cz*EDGE-1)||
    !safe((cx+1)*EDGE)||!safe((cz+1)*EDGE))fail('unsafe world chunk coordinates');
}
// The separate sky edit map overrides upper generated voxels INCLUDING AIR=0.
// This returns a read-only union with untouched surface/cave reads at y<=19.
export function createSkyIslandSourceView({groundGet,skyGet,skyEdits=new Map()}={}){
  if(typeof groundGet!=='function'||typeof skyGet!=='function'||
    !(skyEdits instanceof Map))fail('real ground, sky source and edit sidecar required');
  return Object.freeze({
    get(x,y,z){
      if(![x,y,z].every(safe))fail('unsafe voxel coordinates');
      if(y<20)return validateCellId(groundGet(x,y,z));
      if(y>256)return AIR;
      const key=cellKey(x,y,z);
      return validateCellId(skyEdits.has(key)?skyEdits.get(key):skyGet(x,y,z));
    }
  });
}

// The host resolves opaque, full-voxel assets. Shaped blocks must pass through
// the original shaped-geometry pipeline — never silently draw them as cubes.
export function meshSkyIslandSection({source,cx,cz,section,shapeFor,appearanceFor,
  maxVertices=SKY_MESH_MAX_VERTICES}={}){
  if(!source||typeof source.get!=='function'||typeof shapeFor!=='function'||
    typeof appearanceFor!=='function'||!safe(maxVertices)||maxVertices<6||
    maxVertices>SKY_MESH_MAX_VERTICES||maxVertices%6!==0)
    fail('source, material authority and bounded vertex quota required');
  validateCoords(cx,cz);
  const bounds=skyIslandSectionBounds(section);
  const minX=cx*EDGE-1,minZ=cz*EDGE-1,minY=bounds.minY-1;
  const height=bounds.maxY-bounds.minY+3,side=EDGE+2;
  const cache=new Int32Array(side*side*height);cache.fill(-1);
  const outside=new Map();let sourceReads=0,solidCount=0,exposedFaces=0;
  const get=(x,y,z)=>{
    const ix=x-minX,iz=z-minZ,iy=y-minY;
    if(ix<0||ix>=side||iz<0||iz>=side||iy<0||iy>=height){
      const key=cellKey(x,y,z);
      if(outside.has(key))return outside.get(key);
      const id=validateCellId(source.get(x,y,z));sourceReads++;outside.set(key,id);return id;
    }
    const i=(ix*side+iz)*height+iy;
    if(cache[i]!==-1)return cache[i];
    const id=validateCellId(source.get(x,y,z));sourceReads++;
    cache[i]=id;return id;
  };
  const shapeCache=new Map();
  const shape=id=>{
    if(shapeCache.has(id))return shapeCache.get(id);
    const row=shapeFor(id);
    if(!row||typeof row!=='object'||typeof row.cube!=='boolean'||
      typeof row.opaque!=='boolean')fail('missing real voxel geometry metadata');
    if(!row.cube)fail('non-cube sky asset requires original shaped-geometry mesher');
    const resolved=Object.freeze({cube:row.cube,opaque:row.opaque});
    shapeCache.set(id,resolved);return resolved;
  };
  const maxFloats=maxVertices*SKY_MESH_FLOATS_PER_VERTEX;
  let array=new Float32Array(Math.min(maxFloats,9216));let used=0;
  const emit=(x,y,z,r,g,b,u,v,mat)=>{
    if(used+9>maxFloats)fail('upper-section geometry exceeds iPhone mesh budget');
    if(used+9>array.length){
      const grown=new Float32Array(Math.min(maxFloats,Math.max(used+9,array.length*2)));
      grown.set(array.subarray(0,used));array=grown;
    }
    array[used++]=x;array[used++]=y;array[used++]=z;
    array[used++]=r;array[used++]=g;array[used++]=b;
    array[used++]=u;array[used++]=v;array[used++]=mat;
  };
  for(let x=cx*EDGE;x<(cx+1)*EDGE;x++)for(let z=cz*EDGE;z<(cz+1)*EDGE;z++)
    for(let y=bounds.minY;y<=bounds.maxY;y++){
      const id=get(x,y,z);if(id===AIR)continue;
      shape(id);solidCount++;
      for(let f=0;f<faces.length;f++){
        const face=faces[f],neighbor=get(x+face.n[0],y+face.n[1],z+face.n[2]);
        if(neighbor!==AIR&&shape(neighbor).opaque)continue;
        const material=appearanceFor(id,x,y,z,f);
        if(!material||!Array.isArray(material.color)||material.color.length!==3||
          !material.color.every(n=>valid(n)&&n>=0&&n<=1)||
          !safe(material.mat)||material.mat<0||material.mat>255)
          fail('invalid physical block face appearance');
        if(used+54>maxFloats)fail('upper-section geometry exceeds iPhone mesh budget');
        exposedFaces++;
        for(const index of triangles){
          const p=face.corners[index],t=uv[index];
          emit(x+p[0],y+p[1],z+p[2],
            material.color[0]*face.lit,material.color[1]*face.lit,
            material.color[2]*face.lit, t[0],t[1],material.mat);
        }
      }
    }
  const vertices=array.slice(0,used);
  return Object.freeze({key:skyIslandMeshKey(cx,cz,section),cx,cz,section,
    vertices,vertexCount:vertices.length/9,triangles:vertices.length/27,
    bytes:vertices.byteLength,solidCount,exposedFaces,sourceReads,
    sourceAuthoritative:true,stagedOnly:true});
}

// One transaction: if ANY source read or geometry quota fails, return nothing.
// The owner still decides when/how to stage and atomically swap GPU buffers.
export function prepareSkyIslandSectionBatch({jobs=[],maxBatchBytes=SKY_MESH_MAX_STAGED_BYTES,
  ...host}={}){
  if(!Array.isArray(jobs)||jobs.length>2||!safe(maxBatchBytes)||
    maxBatchBytes<0||maxBatchBytes>SKY_MESH_MAX_STAGED_BYTES)
    fail('at most two bounded sky jobs per batch');
  const keys=new Set(),meshes=[];let bytes=0;
  for(const job of jobs){
    if(!job||!safe(job.cx)||!safe(job.cz)||!safe(job.section))fail('invalid mesh job');
    const key=skyIslandMeshKey(job.cx,job.cz,job.section);
    if(keys.has(key))fail('duplicate sky mesh job');keys.add(key);
    const mesh=meshSkyIslandSection({...host,cx:job.cx,cz:job.cz,section:job.section});
    bytes+=mesh.bytes;
    if(bytes>maxBatchBytes)fail('sky mesh staging bytes exceed per-frame budget');
    meshes.push(mesh);
  }
  return Object.freeze({meshes:Object.freeze(meshes),totalBytes:bytes,
    // Never implies render-ready until the real GPU owner succeeds in upload.
    published:false,requiresAtomicGpuCommit:true});
}
