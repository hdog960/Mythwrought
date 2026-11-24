// Isolated #291 experimental derivative of original depth-mesh blob e822761d2ed1bc44a9316bbc97cf908cdf2997cb
// Depth-owned, section-local solid voxel mesher. No biome, cave, landmark,
// flora, or manual-block generation belongs here. Only world.get defines cells.
import {BLOCK,CHUNK_SIZE} from './voxel.mjs';
import {isPack2LiveId,pack2WorldVertices} from './pack2-integration.mjs';
import {isBiome130BlockId,biome130Block,biome130Color} from './biome130-registry.mjs';
import {prototypeSurfaceMesh} from './shape-prototypes.mjs';
import {environmentGround} from './environment-ground.mjs';
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
const TRIANGLE_CORNERS=[0,1,2,0,2,3];
const shapeCache=new Map(); // At most 57 authored IDs x 4 rotations.
const COLORS={
  1:[.35,.64,.32],2:[.48,.34,.24],3:[.48,.51,.55],
  4:[.60,.39,.23],5:[.36,.79,.92],6:[.70,.58,.33],
  7:[.27,.57,.31],8:[.32,.39,.48]
};
// Registry functions are pure lookups over the original immutable ID tables.
// Certify the hot legacy rock IDs against all three authoritative registries
// once. If a registry ever claims either ID, preserve the generic path.
const plainRock=id=>!isPack2LiveId(id)&&!isBiome130BlockId(id)&&!environmentGround(id);
const plainStone=plainRock(BLOCK.STONE),plainDeepstone=plainRock(BLOCK.DEEPSTONE);
const isPlainRock=id=>(id===BLOCK.STONE&&plainStone)||
  (id===BLOCK.DEEPSTONE&&plainDeepstone);
export function meshDepthSection291(world,cx,cz,section){
  if(!world||typeof world.get!=='function'||![cx,cz,section].every(Number.isInteger)||section>=0)
    throw Error('Invalid deep mesh request');
  const bounds=sectionBounds(section);
  const side=CHUNK_SIZE+2,depth=bounds.maxY-bounds.minY+3;
  const minX=cx*CHUNK_SIZE-1,minZ=cz*CHUNK_SIZE-1,minY=bounds.minY-1;
  const cells=new Uint16Array(side*side*depth);
  cells.fill(65535); // High-ID biome130 physical cells cannot wrap into 8-bit cache.
  const outside=new Map();
  // Center and axial cube neighbors are guaranteed inside the one-cell halo
  // for safe integer chunk coordinates. Shaped normals keep the original
  // general lookup and its outside-map behavior.
  const fastHalo=Number.isSafeInteger(minX)&&Number.isSafeInteger(minX+side)&&
    Number.isSafeInteger(minZ)&&Number.isSafeInteger(minZ+side);
  const plane=side*depth;
  const faceOffsets=[plane,-plane,1,-1,depth,-depth];
  const blockAtIndex=(index,x,y,z)=>{
    const cached=cells[index];
    return cached!==65535?cached:(cells[index]=world.get(x,y,z));
  };
  const blockAt=(x,y,z)=>{
    if(x<minX||x>=minX+side||z<minZ||z>=minZ+side||y<minY||y>=minY+depth){
      const key=x+','+y+','+z;
      if(!outside.has(key))outside.set(key,world.get(x,y,z));
      return outside.get(key);
    }
    const index=((x-minX)*side+(z-minZ))*depth+(y-minY);
    return blockAtIndex(index,x,y,z);
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
  for(let x=cx*CHUNK_SIZE;x<(cx+1)*CHUNK_SIZE;x++)
    for(let z=cz*CHUNK_SIZE;z<(cz+1)*CHUNK_SIZE;z++)
      for(let y=bounds.minY;y<=bounds.maxY;y++){
        const center=((x-minX)*side+(z-minZ))*depth+(y-minY);
        const id=fastHalo?blockAtIndex(center,x,y,z):blockAt(x,y,z);
        if(id===BLOCK.AIR)continue;
        const rock=isPlainRock(id);
        if(!rock&&isPack2LiveId(id)){
          if(id!==76){
            const state=world.getPack2State?.(x,y,z);
            if(!state)throw Error('Deep Pack 2 mesh missing physical state');
            const mesh=pack2WorldVertices(id,state,[x,y,z]);
            for(let k=0;k<mesh.length;k+=9)emit(...mesh.subarray(k,k+9));
          }
          continue;
        }
        if(!rock&&isBiome130BlockId(id)){
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
        // Defer pure color/material lookup and lighting until the first
        // visible ordinary face; enclosed cells emit no color or material.
        let shade,color,material;
        for(let f=0;f<FACES.length;f++){
          const face=FACES[f],nx=x+face.d[0],ny=y+face.d[1],nz=z+face.d[2];
          const neighbor=fastHalo?blockAtIndex(center+faceOffsets[f],nx,ny,nz):
            blockAt(nx,ny,nz);
          if(neighbor!==BLOCK.AIR&&
             (isPlainRock(neighbor)||!isPack2LiveId(neighbor)))continue;
          if(shade===undefined){
            const naturalGround=rock?undefined:environmentGround(id);
            color=naturalGround?.color??COLORS[id]??COLORS[3];
            material=naturalGround?0:id===BLOCK.LEAVES?18:id===BLOCK.DEEPSTONE?19:id;
            shade=.91+((Math.abs(x*13+y*7+z*17)%17)/17)*.12;
          }
          const r=Math.min(1,color[0]*shade*face.lit),
            g=Math.min(1,color[1]*shade*face.lit),
            b=Math.min(1,color[2]*shade*face.lit);
          // Reserve the complete ordinary cube face once. Shaped vertices
          // retain the original single-vertex emitter and growth contract.
          if(length+54>vertices.length){
            const bigger=new Float32Array(vertices.length*2);
            bigger.set(vertices);vertices=bigger;
          }
          for(const k of TRIANGLE_CORNERS){
            const p=face.q[k],uv=UV[k];
            vertices[length++]=x+p[0];vertices[length++]=y+p[1];
            vertices[length++]=z+p[2];vertices[length++]=r;
            vertices[length++]=g;vertices[length++]=b;
            vertices[length++]=uv[0];vertices[length++]=uv[1];
            vertices[length++]=material;
          }
        }
      }
  return vertices.slice(0,length);
}
