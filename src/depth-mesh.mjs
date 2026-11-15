// Depth-owned, section-local solid voxel mesher. No biome, cave, landmark,
// flora, or manual-block generation belongs here. Only world.get defines cells.
import {BLOCK,CHUNK_SIZE} from './voxel.mjs';
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
const COLORS={
  1:[.35,.64,.32],2:[.48,.34,.24],3:[.48,.51,.55],
  4:[.60,.39,.23],5:[.36,.79,.92],6:[.70,.58,.33],
  7:[.27,.57,.31],8:[.32,.39,.48]
};
// Source-owned per-world/per-section cached vertical columns.
// An edit exposes faces only in its own horizontal column and four neighbors,
// not in all 256 columns of a 16x16 section. Each GPU replacement still
// publishes one complete 9-float mesh, preserving all previous API/shader data.
const MAX_CACHED_DEPTH_SECTIONS=36;
const sectionColumnsByWorld=new WeakMap();
export function invalidateDepthMeshCache(world){
  sectionColumnsByWorld.delete(world);
}
export function meshDepthSection(world,cx,cz,section,dirty=null){
  if(!world||typeof world.get!=='function'||![cx,cz,section].every(Number.isInteger)||section>=0)
    throw Error('Invalid deep mesh request');
  if(dirty!==null&&(!dirty||!Number.isInteger(dirty.x)||!Number.isInteger(dirty.z)))
    throw Error('Invalid deep mesh edit location');
  const bounds=sectionBounds(section),side=CHUNK_SIZE+2;
  const depth=bounds.maxY-bounds.minY+3;
  const minX=cx*CHUNK_SIZE-1,minZ=cz*CHUNK_SIZE-1,minY=bounds.minY-1;
  let sections=sectionColumnsByWorld.get(world);
  if(!sections){sections=new Map();sectionColumnsByWorld.set(world,sections);}
  const key=cx+','+cz+','+section;
  const cached=dirty===null?null:sections.get(key);
  // A regular stream/no-dirty call always regenerates from authoritative
  // world.get: external fixtures, imports and missed unloaded edits cannot
  // create stale geometry. Only the synchronous edit caller uses dirty.
  const columns=cached?cached.columns.slice():new Array(CHUNK_SIZE*CHUNK_SIZE);
  const cells=new Uint8Array(side*side*depth);
  cells.fill(255);
  const outside=new Map();
  const blockAt=(x,y,z)=>{
    if(x<minX||x>=minX+side||z<minZ||z>=minZ+side||y<minY||y>=minY+depth){
      const cellKey=x+','+y+','+z;
      if(!outside.has(cellKey))outside.set(cellKey,world.get(x,y,z));
      return outside.get(cellKey);
    }
    const index=((x-minX)*side+(z-minZ))*depth+(y-minY);
    if(cells[index]!==255)return cells[index];
    return (cells[index]=world.get(x,y,z));
  };
  const columnAt=(x,z)=>{
    let vertices=new Float32Array(256),length=0;
    const emit=(x,y,z,r,g,b,u,v,mat)=>{
      if(length+9>vertices.length){
        const bigger=new Float32Array(vertices.length*2);
        bigger.set(vertices);vertices=bigger;
      }
      vertices[length++]=x;vertices[length++]=y;vertices[length++]=z;
      vertices[length++]=r;vertices[length++]=g;vertices[length++]=b;
      vertices[length++]=u;vertices[length++]=v;vertices[length++]=mat;
    };
    for(let y=bounds.minY;y<=bounds.maxY;y++){
      const id=blockAt(x,y,z);
      if(id===BLOCK.AIR)continue;
      const color=COLORS[id]||COLORS[3];
      for(const face of FACES){
        if(blockAt(x+face.d[0],y+face.d[1],z+face.d[2])!==BLOCK.AIR)continue;
        const shade=.91+((Math.abs(x*13+y*7+z*17)%17)/17)*.12;
        const [r,g,b]=color.map(c=>Math.min(1,c*shade*face.lit));
        for(const k of [0,1,2,0,2,3]){
          const p=face.q[k],uv=UV[k];
          emit(x+p[0],y+p[1],z+p[2],r,g,b,uv[0],uv[1],
            id===BLOCK.LEAVES?18:id===BLOCK.DEEPSTONE?19:id);
        }
      }
    }
    return vertices.slice(0,length);
  };
  for(let lx=0;lx<CHUNK_SIZE;lx++)
    for(let lz=0;lz<CHUNK_SIZE;lz++){
      const x=cx*CHUNK_SIZE+lx,z=cz*CHUNK_SIZE+lz;
      // A changed (x,z) cell affects its own column and the four face-adjacent
      // columns, including columns in neighboring loaded horizontal chunks.
      if(cached&&Math.abs(x-dirty.x)+Math.abs(z-dirty.z)>1)continue;
      columns[lx*CHUNK_SIZE+lz]=columnAt(x,z);
    }
  let floatCount=0;
  for(const column of columns)floatCount+=column.length;
  const mesh=new Float32Array(floatCount);
  let offset=0;
  for(const column of columns){mesh.set(column,offset);offset+=column.length;}
  sections.delete(key);sections.set(key,{columns});
  while(sections.size>MAX_CACHED_DEPTH_SECTIONS)
    sections.delete(sections.keys().next().value);
  return mesh;
}
