import {createSkylands} from './generation.mjs';
import {BLOCK,voxelTerrainAppearance} from '../voxel.mjs';
import {runtimeSectionBounds} from '../world-height.mjs';
import {GpuUploadRetry,uploadChunkBuffer} from '../gpu-recovery.mjs';

// The base tag still selects the original game's block texture. This offset
// only changes projection and fog for the distant terrain draw.
export const VEILREACH_DISTANCE_OFFSET=512;
export const VEILREACH_DISTANCE_MAX_BYTES=24_576*36;
const maxVertices=VEILREACH_DISTANCE_MAX_BYTES/36;
const radius=420;
const light=[[.73,.77],[.48,1],[.67,.85]];

function subtractRect(rect,clip){
  const [u0,v0,u1,v1]=rect;
  const a=Math.max(u0,clip[0]),b=Math.max(v0,clip[1]);
  const c=Math.min(u1,clip[2]),d=Math.min(v1,clip[3]);
  if(a>=c||b>=d)return [rect];
  return [[u0,v0,a,v1],[c,v0,u1,v1],[a,v0,c,b],[a,d,c,v1]]
    .filter(([l,t,r,k])=>r>l&&k>t);
}

function islandMesh(terrain,island,step,detail,limit){
  const vertices=[],columns=new Map();
  const radius=Math.max(island.rx,island.rz)*1.34;
  const key=(x,z)=>x+','+z;
  const startX=Math.floor((island.x-radius)/step)*step;
  const startZ=Math.floor((island.z-radius)/step)*step;
  for(let x=startX;x<=island.x+radius;x+=step)for(let z=startZ;z<=island.z+radius;z+=step){
    const sx=x+Math.floor(step/2),sz=z+Math.floor(step/2);
    const source=terrain.shapeAt(island,sx,sz);
    if(!source)continue;
    // Keep stepped ledges at both elevations, including the underside.
    const rise=step/2;
    const bottom=Math.round(source.bottom/rise)*rise;
    const top=Math.max(bottom+rise,Math.round((source.top+1)/rise)*rise);
    columns.set(key(x,z),{x,z,sx,sz,bottom,top,source});
  }

  function face(axis,positive,plane,rect,id){
    const axes=[0,1,2].filter(i=>i!==axis);
    const [u,v]=axes;
    let pieces=[rect];
    for(const {min,max} of detail){
      if(plane<=min[axis]||plane>=max[axis])continue;
      pieces=pieces.flatMap(piece=>subtractRect(piece,[min[u],min[v],max[u],max[v]]));
    }
    const {rgb,tag}=voxelTerrainAppearance(id);
    const shade=light[axis][Number(positive)];
    const color=rgb.map(n=>n*shade);
    const indices=positive===(axis!==1)?[0,1,2,0,2,3]:[0,2,1,0,3,2];
    for(const [u0,v0,u1,v1] of pieces){
      const corners=[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];
      for(const index of indices){
        const [a,b]=corners[index],position=[];
        position[axis]=plane;position[u]=a;position[v]=b;
        vertices.push(...position,...color,axis===0?b:a,axis===0?a:b,tag+VEILREACH_DISTANCE_OFFSET);
      }
    }
  }

  for(const {x,z,sx,sz,bottom,top,source} of columns.values()){
    const sample=y=>terrain.rockMaterial(source,sx,y,sz)||BLOCK.STONE;
    face(1,true,top,[x,z,x+step,z+step],sample(source.top));
    face(1,false,bottom,[x,z,x+step,z+step],sample(source.bottom));
    for(const [axis,positive,dx,dz] of [[0,false,-step,0],[0,true,step,0],[2,false,0,-step],[2,true,0,step]]){
      const neighbor=columns.get(key(x+dx,z+dz));
      const intervals=neighbor?[[bottom,Math.min(top,neighbor.bottom)],
        [Math.max(bottom,neighbor.top),top]]:[[bottom,top]];
      const start=axis===0?z:x,plane=(axis===0?x:z)+(positive?step:0);
      const baseBand=Math.min(top,bottom+Math.min(3,Math.floor((top-bottom)/2)));
      const capBand=Math.max(baseBand,top-3);
      const layers=[[bottom,baseBand,source.bottom],
        [baseBand,capBand,Math.floor((source.bottom+source.top)/2)],
        [capBand,top,Math.max(source.bottom,source.top-1)]];
      for(const [low,high] of intervals){
        if(low>=high)continue;
        for(const [layerMin,layerMax,y] of layers){
          const lo=Math.max(low,layerMin),hi=Math.min(high,layerMax);
          if(lo>=hi)continue;
          const rect=axis===0?[lo,start,hi,start+step]:[start,lo,start+step,hi];
          face(axis,positive,plane,rect,sample(y));
        }
      }
    }
    if(vertices.length/9>limit)return null;
  }
  return vertices;
}

export function farSkyMesh(terrain,x,z,detail=[]){
  const islands=terrain.nearby(x,z,radius)
    .map(island=>({island,distance:Math.hypot(island.x-x,island.z-z)}))
    .filter(row=>row.distance<radius)
    .sort((a,b)=>a.distance-b.distance).slice(0,14);
  const meshes=[];
  let vertices=0;
  for(const {island,distance} of islands){
    const steps=distance<160?[4,8,16]:[8,16];
    for(const step of steps){
      const mesh=islandMesh(terrain,island,step,detail,maxVertices-vertices);
      if(!mesh)continue;
      meshes.push(mesh);
      vertices+=mesh.length/9;
      break;
    }
  }
  const packed=new Float32Array(vertices*9);
  let offset=0;
  for(const mesh of meshes){packed.set(mesh,offset);offset+=mesh.length;}
  return packed;
}

export function createVeilreachDistanceRenderer(gl){
  const retry=new GpuUploadRetry();
  let identity=null,terrain=null,buffer=null,count=0,drawKey='';
  function invalidate(lost=false){
    if(buffer&&!lost)gl.deleteBuffer(buffer);
    buffer=null;
    count=0;
    drawKey='';
    retry.clear();
  }
  return Object.freeze({invalidate,draw({world,player,chunks,caveShade,atPos,atColor,atUv,atMat}){
    const source=world?.upperSourceProfile;
    if(source!==identity){
      invalidate();
      identity=source;
      terrain=source?createSkylands(source.seed):null;
    }
    if(!terrain||caveShade>.35||gl.isContextLost())return 0;
    const cx=Math.floor(player.x/16),cz=Math.floor(player.z/16),level=Math.floor(player.feet/8);
    const detailed=[];
    for(const [key,c] of chunks){
      if(c.section<=0||!c.count&&!world.upperNaturalOccupied(key))continue;
      const {minY,maxY}=runtimeSectionBounds(c.section);
      if(maxY<level*8-32||minY>level*8+32)continue;
      detailed.push({key,min:[c.x*16,minY,c.z*16],max:[(c.x+1)*16,maxY+1,(c.z+1)*16]});
    }
    const key=[cx,cz,...detailed.map(c=>c.key).sort()].join('|');
    const now=performance.now();
    const retryKey='veilreach-distance';
    if(key!==drawKey&&retry.ready(retryKey,now)){
      try{
        const mesh=farSkyMesh(terrain,cx*16+8,cz*16+8,detailed);
        if(mesh.byteLength>VEILREACH_DISTANCE_MAX_BYTES)throw Error('Veilreach distance mesh exceeds budget');
        const replacement=mesh.length?uploadChunkBuffer(gl,mesh):null;
        if(buffer)gl.deleteBuffer(buffer);
        buffer=replacement;
        count=mesh.length/9;
        drawKey=key;
        retry.success(retryKey);
      }catch(error){retry.fail(retryKey,now,error.message);}
    }
    if(!buffer||!count)return 0;
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);
    gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);
    gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);
    gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);
    gl.drawArrays(gl.TRIANGLES,0,count);
    return count;
  }});
}
