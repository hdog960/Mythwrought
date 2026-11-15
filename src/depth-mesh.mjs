// Depth-owned, section-local solid voxel mesher. No biome, cave, landmark,
// flora, or manual-block generation belongs here. Only world.get defines cells.
import {BLOCK,CHUNK_SIZE} from './voxel.mjs';
import {sectionBounds} from './depth.mjs';
import {isPack2LiveId,pack2WorldVertices} from './pack2-integration.mjs';

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
export function meshDepthSection(world,cx,cz,section){
  if(!world||typeof world.get!=='function'||![cx,cz,section].every(Number.isInteger)||section>=0)
    throw Error('Invalid deep mesh request');
  const bounds=sectionBounds(section);
  const side=CHUNK_SIZE+2,depth=bounds.maxY-bounds.minY+3;
  const minX=cx*CHUNK_SIZE-1,minZ=cz*CHUNK_SIZE-1,minY=bounds.minY-1;
  const cells=new Uint8Array(side*side*depth);
  cells.fill(255); // Unvisited marker: all physical voxel IDs are 0..254.
  const outside=new Map();
  const blockAt=(x,y,z)=>{
    if(x<minX||x>=minX+side||z<minZ||z>=minZ+side||y<minY||y>=minY+depth){
      const key=x+','+y+','+z;
      if(!outside.has(key))outside.set(key,world.get(x,y,z));
      return outside.get(key);
    }
    const index=((x-minX)*side+(z-minZ))*depth+(y-minY);
    if(cells[index]!==255)return cells[index];
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
  for(let x=cx*CHUNK_SIZE;x<(cx+1)*CHUNK_SIZE;x++)
    for(let z=cz*CHUNK_SIZE;z<(cz+1)*CHUNK_SIZE;z++)
      for(let y=bounds.minY;y<=bounds.maxY;y++){
        const id=blockAt(x,y,z);
        if(id===BLOCK.AIR)continue;
        if(isPack2LiveId(id)){
          if(id!==76){
            const state=world.getPack2State?.(x,y,z);
            if(!state)throw Error('Deep Pack 2 mesh missing physical state');
            const vertices=pack2WorldVertices(id,state,[x,y,z]);
            for(let k=0;k<vertices.length;k+=9)emit(...vertices.subarray(k,k+9));
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
  return vertices.slice(0,length);
}
