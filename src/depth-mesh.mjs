// Depth-owned, section-local solid voxel mesher. No biome, cave, landmark,
// flora, or manual-block generation belongs here. Only world.get defines cells.
import {BLOCK,CHUNK_SIZE} from './voxel.mjs';
import {isPack2LiveId,pack2WorldVertices} from './pack2-integration.mjs';
import {isBiome130BlockId,biome130Block,biome130Color} from './biome130-registry.mjs';
import {prototypeSurfaceMesh} from './shape-prototypes.mjs';
import {sectionBounds} from './depth.mjs';

const FACES=[
  {d:[1,0,0],q:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],lit:.77},
  {d:[-1,0,0],q:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],lit:.73},
  {d:[0,1,0],q:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],lit:1},
  {d:[0,-1,0],q:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],lit:.48},
  {d:[0,0,1],q:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]],lit:.85},
  {d:[0,0,-1],q:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]],lit:.67}
];
const UV=[[0,0],[0,1],[1,1],[1,0]];
const shapeCache=new Map(); // At most 57 authored IDs x 4 rotations.
const COLORS={
  1:[.35,.64,.32],2:[.48,.34,.24],3:[.48,.51,.55],
  4:[.60,.39,.23],5:[.36,.79,.92],6:[.70,.58,.33],
  7:[.27,.57,.31],8:[.32,.39,.48]
};
// Per-world, transient column meshes: mining one voxel changes faces in at
// most five horizontal columns per affected section. The authoritative full
// pass remains the fallback for non-edit callers and cache misses. No save data.
const EMPTY_COLUMN=new Float32Array(0);
const MAX_CACHED_SECTIONS=36;
const MAX_COLUMN_CACHE_BYTES=12*1024*1024;
const columnMeshes=new WeakMap();
const sectionKey=(cx,cz,section)=>cx+','+cz+','+section;
export function discardDepthMeshCache(world){
  if(world&&(typeof world==='object'||typeof world==='function'))
    columnMeshes.delete(world);
}
function rememberColumns(world,key,columns){
  let cache=columnMeshes.get(world);
  if(!cache){cache=new Map();columnMeshes.set(world,cache);}
  const bytes=columns.reduce((n,c)=>n+(c?.byteLength??0),0);
  cache.delete(key);
  if(bytes>MAX_COLUMN_CACHE_BYTES)return;
  cache.set(key,{columns,bytes});
  let total=0;
  for(const entry of cache.values())total+=entry.bytes;
  while(cache.size>MAX_CACHED_SECTIONS||total>MAX_COLUMN_CACHE_BYTES){
    const oldest=cache.keys().next().value,removed=cache.get(oldest);
    cache.delete(oldest);total-=removed.bytes;
  }
}
function joinColumns(columns){
  let length=0;
  for(const column of columns)length+=column.length;
  const result=new Float32Array(length);
  let offset=0;
  for(const column of columns){result.set(column,offset);offset+=column.length;}
  return result;
}
export function meshDepthSection(world,cx,cz,section,editedCell=null){
  if(!world||typeof world.get!=='function'||![cx,cz,section].every(Number.isInteger)||section>=0)
    throw Error('Invalid deep mesh request');
  const key=sectionKey(cx,cz,section);
  const previous=columnMeshes.get(world)?.get(key);
  let dirty=null;
  if(previous&&Array.isArray(editedCell)&&editedCell.length===3&&
     editedCell.every(Number.isInteger)){
    const [x,,z]=editedCell,originX=cx*CHUNK_SIZE,originZ=cz*CHUNK_SIZE;
    dirty=new Set();
    for(const [dx,dz] of [[0,0],[1,0],[-1,0],[0,1],[0,-1]]){
      const localX=x+dx-originX,localZ=z+dz-originZ;
      if(localX>=0&&localX<CHUNK_SIZE&&localZ>=0&&localZ<CHUNK_SIZE)
        dirty.add(localX*CHUNK_SIZE+localZ);
    }
    if(!dirty.size)dirty=null;
  }
  const next=buildDepthColumns(world,cx,cz,section,dirty);
  if(dirty){
    const updated=previous.columns.slice();
    for(const index of dirty)updated[index]=next.columns[index];
    rememberColumns(world,key,updated);
    return joinColumns(updated);
  }
  rememberColumns(world,key,next.columns);
  return next.vertices;
}
function buildDepthColumns(world,cx,cz,section,dirtyColumns){

  if(!world||typeof world.get!=='function'||![cx,cz,section].every(Number.isInteger)||section>=0)
    throw Error('Invalid deep mesh request');
  const bounds=sectionBounds(section);
  const side=CHUNK_SIZE+2,depth=bounds.maxY-bounds.minY+3;
  const minX=cx*CHUNK_SIZE-1,minZ=cz*CHUNK_SIZE-1,minY=bounds.minY-1;
  const cells=new Uint16Array(side*side*depth);
  cells.fill(65535); // High-ID biome130 physical cells cannot wrap into 8-bit cache.
  const outside=new Map();
  const blockAt=(x,y,z)=>{
    if(x<minX||x>=minX+side||z<minZ||z>=minZ+side||y<minY||y>=minY+depth){
      const key=x+','+y+','+z;
      if(!outside.has(key))outside.set(key,world.get(x,y,z));
      return outside.get(key);
    }
    const index=((x-minX)*side+(z-minZ))*depth+(y-minY);
    if(cells[index]!==65535)return cells[index];
    return (cells[index]=world.get(x,y,z));
  };
  let vertices=new Float32Array(4096),length=0;
  const emit=(x,y,z,r,g,b,u,v,mat)=>{
    if(length+9>vertices.length){
      const bigger=new Float32Array(vertices.length*2);
      bigger.set(vertices);vertices=bigger;
    }
    vertices[length++]=x;vertices[length++]=y;vertices[length++]=z;
    vertices[length++]=r;vertices[length++]=g;vertices[length++]=b;
    vertices[length++]=u;vertices[length++]=v;vertices[length++]=mat;
  };
  const columns=new Array(CHUNK_SIZE*CHUNK_SIZE);
  for(let x=cx*CHUNK_SIZE;x<(cx+1)*CHUNK_SIZE;x++)
    for(let z=cz*CHUNK_SIZE;z<(cz+1)*CHUNK_SIZE;z++){
      const index=(x-cx*CHUNK_SIZE)*CHUNK_SIZE+z-cz*CHUNK_SIZE;
      if(dirtyColumns&&!dirtyColumns.has(index))continue;
      const columnStart=length;
      for(let y=bounds.minY;y<=bounds.maxY;y++){
        const id=blockAt(x,y,z);
        if(id===BLOCK.AIR)continue;
        if(isPack2LiveId(id)){
          if(id!==76){
            const state=world.getPack2State?.(x,y,z);
            if(!state)throw Error('Deep Pack 2 mesh missing physical state');
            const mesh=pack2WorldVertices(id,state,[x,y,z]);
            for(let k=0;k<mesh.length;k+=9)emit(...mesh.subarray(k,k+9));
          }
          continue;
        }
        if(isBiome130BlockId(id)){
          const rotation=world.rotationAt?.(x,y,z)??0,key=id*4+rotation;
          let mesh=shapeCache.get(key);
          if(!mesh){
            const asset=biome130Block(id,rotation);
            mesh=prototypeSurfaceMesh({prototypeOnly:true,boxes:asset.boxes});
            if(mesh.indices.length>12000)throw Error('Biome surface budget exceeded');
            shapeCache.set(key,mesh);
          }
          for(let t=0;t<mesh.indices.length;t+=3){
            const n=mesh.indices[t]*3,nx=mesh.normals[n],
              ny=mesh.normals[n+1],nz=mesh.normals[n+2];
            let boundary=true;
            for(let k=t;k<t+3;k++){
              const i=mesh.indices[k]*3;
              if(nx&&Math.abs(mesh.positions[i]-(nx>0?1:0))>1e-6||
                 ny&&Math.abs(mesh.positions[i+1]-(ny>0?1:0))>1e-6||
                 nz&&Math.abs(mesh.positions[i+2]-(nz>0?1:0))>1e-6){
                boundary=false;break;
              }
            }
            if(boundary&&blockAt(x+nx,y+ny,z+nz)!==BLOCK.AIR &&
               !isBiome130BlockId(blockAt(x+nx,y+ny,z+nz))&&
               !isPack2LiveId(blockAt(x+nx,y+ny,z+nz)))continue;
            const face=nx>0?0:nx<0?1:ny>0?2:ny<0?3:nz>0?4:5;
            const rgb=biome130Color(id,x,y,z,face),lit=[.77,.73,1,.48,.85,.67][face];
            for(let k=t;k<t+3;k++){
              const i=mesh.indices[k]*3,px=mesh.positions[i],py=mesh.positions[i+1],pz=mesh.positions[i+2];
              emit(x+px,y+py,z+pz,rgb[0]*lit,rgb[1]*lit,rgb[2]*lit,nx?pz:px,ny?pz:py,0);
            }
          }
          continue;
        }
        const color=COLORS[id]||COLORS[3];
        for(const face of FACES){
          const neighbor=blockAt(x+face.d[0],y+face.d[1],z+face.d[2]);
          if(neighbor!==BLOCK.AIR&&!isPack2LiveId(neighbor))continue;
          const shade=.91+((Math.abs(x*13+y*7+z*17)%17)/17)*.12;
          const [r,g,b]=color.map(c=>Math.min(1,c*shade*face.lit));
          for(const k of [0,1,2,0,2,3]){
            const p=face.q[k],uv=UV[k];
            emit(x+p[0],y+p[1],z+p[2],r,g,b,uv[0],uv[1],
              id===BLOCK.LEAVES?18:id===BLOCK.DEEPSTONE?19:id);
          }
        }
      }
      columns[index]=length===columnStart?EMPTY_COLUMN:vertices.slice(columnStart,length);
    }
  return {vertices:vertices.slice(0,length),columns};
}
