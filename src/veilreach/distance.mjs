import {createSkylands} from './generation.mjs';
import {BLOCK,voxelTerrainAppearance} from '../voxel.mjs';
import {ENVIRONMENT_GROUND as G} from '../environment-ground.mjs';
import {runtimeMeshKey,runtimeSectionBounds,runtimeSectionForY} from '../world-height.mjs';
import {GpuUploadRetry,validateChunkUploadBytes} from '../gpu-recovery.mjs';
import {createMobSourceRevision} from '../mobs/source-edit-epoch.mjs';

export const VEILREACH_DISTANCE_OFFSET=512;
export const VEILREACH_DISTANCE_MAX_BYTES=24_576*36;
const maxVertices=VEILREACH_DISTANCE_MAX_BYTES/36;
const radius=420;
const handoffRadius=112;
const uploadFloats=16_384;
const light=[[.73,.77],[.48,1],[.67,.85]];
const planes=[
  {axis:0,axes:[1,2]}, {axis:1,axes:[0,2]}, {axis:2,axes:[0,1]}
];
const leaves=new Set([BLOCK.LEAVES,G.coldNeedles,G.moonLeaves]);
const trunks=new Set([BLOCK.WOOD,G.aetherBark]);

function appearance(id){
  const value=voxelTerrainAppearance(id);
  return leaves.has(id)?{...value,tag:18}:trunks.has(id)?{...value,tag:4}:value;
}

function pushFace(vertices,axis,positive,plane,[u0,v0,u1,v1],id){
  const [u,v]=planes[axis].axes;
  const {rgb,tag}=appearance(id);
  const color=rgb.map(n=>n*light[axis][Number(positive)]);
  const indices=positive===(axis!==1)?[0,1,2,0,2,3]:[0,2,1,0,3,2];
  const corners=[[u0,v0],[u1,v0],[u1,v1],[u0,v1]];
  for(const index of indices){
    const [a,b]=corners[index],position=[];
    position[axis]=plane;
    position[u]=a;
    position[v]=b;
    vertices.push(...position,...color,axis===0?b:a,axis===0?a:b,tag+VEILREACH_DISTANCE_OFFSET);
  }
}

// Merge only faces with identical material, normal and physical plane.
// Two directional passes preserve every exposed sample and its world UV.
function mergeRectangles(rects,axis){
  const other=1-axis;
  const sorted=rects.sort((a,b)=>a[other]-b[other]||a[other+2]-b[other+2]||a[axis]-b[axis]);
  const merged=[];
  for(const rect of sorted){
    const last=merged.at(-1);
    if(last&&last[other]===rect[other]&&last[other+2]===rect[other+2]&&last[axis+2]===rect[axis]){
      last[axis+2]=rect[axis+2];
    }else merged.push(rect);
  }
  return merged;
}

function* editSnapshot(world,x,z){
  const rows=new Map();
  let scanned=0;
  for(const [key,id] of world?.edits??[]){
    if(++scanned%256===0)yield;
    const [px,py,pz]=key.split(',').map(Number);
    if(runtimeSectionForY(py)<=0||Math.abs(px-x)>radius+32||Math.abs(pz-z)>radius+32)continue;
    const cx=Math.floor(px/16),cz=Math.floor(pz/16),chunk=cx+','+cz;
    if(!rows.has(chunk))rows.set(chunk,{cells:new Map(),columns:new Map()});
    const tile=rows.get(chunk),column=px+','+pz;
    tile.cells.set(key,id);
    if(!tile.columns.has(column))tile.columns.set(column,[]);
    tile.columns.get(column).push([py,id]);
  }
  return rows;
}

// One proxy column samples one actual physical column. Use every occupied
// layer and material along that column, so cliffs, undercuts and strata are
// sourced from voxels. Grid footprints still simplify horizontal detail.
function* chunkMesh(terrain,cx,cz,step,edits,sectionMask=-1){
  const x0=cx*16,z0=cz*16,half=Math.floor(step/2);
  const columns=new Map(),owners=new Map();
  const readEdits=edits.get(cx+','+cz);
  function column(x,z){
    const key=x+','+z;
    if(columns.has(key))return columns.get(key);
    const sampleX=x+half,sampleZ=z+half;
    const span=terrain.rockSpan(sampleX,sampleZ);
    const outside=edits.get(Math.floor(x/16)+','+Math.floor(z/16));
    const values=new Uint16Array(257);
    let minY=span?.minY??257,maxY=span?.maxY??19;
    if(span)for(let y=minY;y<=maxY;y++)values[y]=terrain.rock(sampleX,y,sampleZ);
    for(const [y,id] of outside?.columns.get(sampleX+','+sampleZ)??[]){
      minY=Math.min(minY,y);
      maxY=Math.max(maxY,y);
      values[y]=id;
    }
    const result={values,minY,maxY};
    columns.set(key,result);
    return result;
  }
  function face(y,axis,positive,plane,rect,id){
    const section=runtimeSectionForY(y);
    if(!(sectionMask&1<<(section-1)))return;
    if(!owners.has(section))owners.set(section,new Map());
    const groups=owners.get(section);
    const key=[axis,positive,plane,id].join('|');
    if(!groups.has(key))groups.set(key,{axis,positive,plane,id,rects:[]});
    groups.get(key).rects.push(rect);
  }

  // Merge collinear side faces within an owner. Keep real Y planes instead
  // of rounding elevations or painting the whole vertical interval a color.
  for(let x=x0;x<x0+16;x+=step)for(let z=z0;z<z0+16;z+=step){
    if(step===1&&z===z0&&x!==x0&&(x-x0)%4===0)yield;
    const {values:cells,minY,maxY}=column(x,z);
    if(minY>maxY)continue;
    for(let y=minY;y<=maxY;y++){
      const id=cells[y];
      if(!id)continue;
      if(!cells[y-1])face(y,1,false,y,[x,z,x+step,z+step],id);
      if(!cells[y+1])face(y,1,true,y+1,[x,z,x+step,z+step],id);
    }
    for(const [axis,positive,dx,dz] of [[0,false,-step,0],[0,true,step,0],[2,false,0,-step],[2,true,0,step]]){
      const neighbor=column(x+dx,z+dz).values;
      const plane=(axis===0?x:z)+(positive?step:0),start=axis===0?z:x;
      for(let y=minY;y<=maxY;){
        const id=cells[y];
        if(!id||neighbor[y]){y++;continue;}
        const section=runtimeSectionForY(y);
        const end=runtimeSectionBounds(section).maxY+1;
        let top=y+1;
        while(top<end&&cells[top]===id&&!neighbor[top])top++;
        const rect=axis===0?[y,start,top,start+step]:[start,y,start+step,top];
        face(y,axis,positive,plane,rect,id);
        y=top;
      }
    }
  }

  // Group only resolved native trunk/canopy cells. With a two-band canopy,
  // tree XZ, top Y and bottom Y remain tied to the actual tree. Split at
  // owner boundaries before batching so physical publication can hide the
  // matching part of a tree without a second mesh upload.
  const plants=new Map();
  for(const {cell:[x,y,z],id,owner:key} of terrain.vegetationCells(cx,cz)){
    if(!leaves.has(id)&&!trunks.has(id))continue;
    if(readEdits?.cells.has(`${x},${y},${z}`)||terrain.rock(x,y,z))continue;
    const section=runtimeSectionForY(y);
    const leaf=leaves.has(id);
    const group=key+'|'+section+'|'+id+(leaf?'':'|'+x+','+z);
    if(!plants.has(group))plants.set(group,{section,id,leaf,cells:[]});
    plants.get(group).cells.push([x,y,z]);
  }
  // Resolve neighboring canopies as one opaque volume. Overlapping summaries
  // no longer draw coincident outer surfaces or leaves through an authored cell.
  const vegetation=new Map();
  const plantAt=(x,y,z)=>{
    if(x<x0||x>=x0+16||z<z0||z>=z0+16)return 0;
    return vegetation.get(y)?.[(x-x0)*16+z-z0]??0;
  };
  function addPlant(x,y,z,id){
    if(readEdits?.cells.has(`${x},${y},${z}`)||terrain.rock(x,y,z))return;
    if(!vegetation.has(y))vegetation.set(y,new Uint16Array(256));
    const slice=vegetation.get(y),index=(x-x0)*16+z-z0;
    if(!slice[index]||trunks.has(id))slice[index]=id;
  }
  for(const {id,leaf,cells} of plants.values()){
    if(readEdits){
      for(const [x,y,z] of cells)addPlant(x,y,z,id);
      continue;
    }
    const bottom=Math.min(...cells.map(c=>c[1])),top=Math.max(...cells.map(c=>c[1]));
    const middle=Math.floor((bottom+top)/2);
    const bands=leaf&&top-bottom>=2?
      [cells.filter(c=>c[1]<=middle),cells.filter(c=>c[1]>middle)]:[cells];
    for(const band of bands){
      const min=[0,1,2].map(axis=>Math.min(...band.map(c=>c[axis])));
      const max=[0,1,2].map(axis=>Math.max(...band.map(c=>c[axis]))+1);
      for(let x=min[0];x<max[0];x++)for(let y=min[1];y<max[1];y++)for(let z=min[2];z<max[2];z++)
        addPlant(x,y,z,id);
    }
  }
  for(const [y,slice] of vegetation){
    for(let i=0;i<slice.length;i++){
      const id=slice[i];
      if(!id)continue;
      const x=x0+Math.floor(i/16),z=z0+i%16,at=[x,y,z];
      for(const {axis,axes:[u,v]} of planes)for(const d of [-1,1]){
        const adjacent=at.slice();
        adjacent[axis]+=d;
        if(plantAt(...adjacent))continue;
        face(y,axis,d>0,at[axis]+Number(d>0),[at[u],at[v],at[u]+1,at[v]+1],id);
      }
    }
  }
  return [...owners].map(([section,groups])=>{
    const values=[];
    for(const {axis,positive,plane,rects,id} of groups.values()){
      for(const rect of mergeRectangles(mergeRectangles(rects,0),1))
        pushFace(values,axis,positive,plane,rect,id);
    }
    return {key:runtimeMeshKey(cx,cz,section),section,cx,cz,values};
  });
}

function islandChunks(island,x,z){
  const span=Math.max(island.rx,island.rz)*1.34+6;
  const tiles=[];
  for(let cx=Math.floor((island.x-span)/16);cx<=Math.floor((island.x+span)/16);cx++)
    for(let cz=Math.floor((island.z-span)/16);cz<=Math.floor((island.z+span)/16);cz++)
      tiles.push({cx,cz});
  return tiles.sort((a,b)=>Math.hypot(a.cx*16+8-x,a.cz*16+8-z)-
    Math.hypot(b.cx*16+8-x,b.cz*16+8-z));
}

function* prepareAtlas(terrain,x,z,world){
  const edits=yield* editSnapshot(world,x,z);
  const islands=terrain.nearby(x,z,radius)
    .map(island=>({island,distance:Math.hypot(island.x-x,island.z-z)}))
    .filter(row=>row.distance<radius)
    .sort((a,b)=>a.distance-b.distance).slice(0,14);
  const rows=[],claimed=new Set();
  let count=0;
  // Include nearby authored voxel construction outside natural silhouettes.
  // Leave most of the bank available for the islands themselves.
  const authored=[...edits.keys()].map(key=>{
    const [cx,cz]=key.split(',').map(Number);
    return {key,cx,cz,distance:Math.hypot(cx*16+8-x,cz*16+8-z)};
  }).filter(tile=>tile.distance<radius).sort((a,b)=>a.distance-b.distance||a.key.localeCompare(b.key)).slice(0,24);
  for(const {key,cx,cz} of authored){
    const tile=yield* chunkMesh(terrain,cx,cz,1,edits);
    const vertices=tile.reduce((sum,row)=>sum+row.values.length/9,0);
    yield;
    if(count+vertices>maxVertices/3)continue;
    count+=vertices;
    rows.push(...tile);
    claimed.add(key);
  }
  for(const {island,distance} of islands){
    if(count>=maxVertices)break;
    const tiles=islandChunks(island,x,z).filter(({cx,cz})=>!claimed.has(cx+','+cz));
    const steps=distance<160?[4,8,16]:[8,16];
    for(const step of steps){
      let groupCount=0;
      const group=[],admitted=[];
      for(const {cx,cz} of tiles){
        const modified=edits.has(cx+','+cz);
        const tile=yield* chunkMesh(terrain,cx,cz,modified?1:step,edits);
        if(!modified&&Math.hypot(cx*16+8-x,cz*16+8-z)<=handoffRadius){
          const covered=tile.reduce((mask,row)=>mask|1<<(row.section-1),0);
          const missing=terrain.sectionMask(cx,cz)&~covered;
          if(missing){
            // A coarse column can miss a thin ledge or the only voxel in a
            // section. Keep those owners from disappearing at handoff.
            yield;
            tile.push(...(yield* chunkMesh(terrain,cx,cz,1,edits,missing)));
          }
        }
        groupCount+=tile.reduce((sum,row)=>sum+row.values.length/9,0);
        yield;
        if(count+groupCount>maxVertices)break;
        if(tile.length){group.push(...tile);admitted.push(cx+','+cz);}
      }
      if(count+groupCount>maxVertices)continue;
      for(const key of admitted)claimed.add(key);
      rows.push(...group);count+=groupCount;
      if(group.length)yield rows;
      break;
    }
  }
  return rows;
}

function pack(rows){
  const data=new Float32Array(rows.reduce((n,row)=>n+row.values.length,0));
  const owners=[];
  let offset=0;
  for(const row of rows){
    data.set(row.values,offset);
    owners.push({key:row.key,first:offset/9,count:row.values.length/9});
    offset+=row.values.length;
  }
  return {data,owners};
}

export function veilreachDrawRanges(owners,detailed){
  const ranges=[];
  for(const section of owners){
    if(detailed.has(section.key))continue;
    const previous=ranges.at(-1);
    if(previous&&previous.first+previous.count===section.first)previous.count+=section.count;
    else ranges.push({first:section.first,count:section.count});
  }
  return ranges;
}

// Native qualification path uses the same builder as runtime. Detail boxes
// are only used by standalone tooling. Runtime selects whole section owners.
export function farSkyMesh(terrain,x,z,detail=[],world){
  const prep=prepareAtlas(terrain,x,z,world);
  let result=prep.next();
  while(!result.done)result=prep.next();
  const rows=result.value.filter(({cx,cz,section})=>{
    const {minY,maxY}=runtimeSectionBounds(section);
    return !detail.some(({min,max})=>cx*16>=min[0]&&(cx+1)*16<=max[0]&&
      cz*16>=min[2]&&(cz+1)*16<=max[2]&&minY>=min[1]&&maxY+1<=max[1]);
  });
  return pack(rows).data;
}

// The staging buffer is private until all bounded writes have succeeded.
// The 864 KiB visual cap leaves room for both old and new visual allocations.
function stageUpload(gl,{data,owners}){
  const bytes=validateChunkUploadBytes(data,VEILREACH_DISTANCE_MAX_BYTES);
  let buffer=null,offset=0;
  const check=measure=>{
    const error=measure('check',()=>gl.getError());
    if(error!==gl.NO_ERROR)throw Error('Veilreach visual upload error '+error);
  };
  function slice(measure){
    if(!bytes)return true;
    if(!buffer){
      for(let i=0;i<8;i++){
        if(measure('drain',()=>gl.getError())===gl.NO_ERROR)break;
        if(i===7)throw Error('Veilreach upload error queue did not clear');
      }
      buffer=measure('create',()=>gl.createBuffer());
      if(!buffer)throw Error('Veilreach visual buffer unavailable');
      measure('bind',()=>gl.bindBuffer(gl.ARRAY_BUFFER,buffer));
      measure('allocate',()=>gl.bufferData(gl.ARRAY_BUFFER,bytes,gl.STATIC_DRAW));
      check(measure);
      return false;
    }
    const end=Math.min(offset+uploadFloats,data.length);
    measure('bind',()=>gl.bindBuffer(gl.ARRAY_BUFFER,buffer));
    measure('transfer',()=>gl.bufferSubData(gl.ARRAY_BUFFER,offset*4,data.subarray(offset,end)));
    check(measure);
    offset=end;
    return offset===data.length;
  }
  return {slice,finish:()=>({buffer,owners,bytes}),
    dispose(lost){if(buffer&&!lost)gl.deleteBuffer(buffer);}};
}

export function createVeilreachDistanceRenderer(gl){
  const retry=new GpuUploadRetry();
  let identity=null,terrain=null,readRevision=null,buffer=null,owners=[],drawKey='',job=null;
  let center=null,atlasBytes=0,rebuilds=0,preparedTiles=0,lastPreparationMs=0,lastUploadMs=0;
  let fence=null,gpuDeferredFrames=0;
  let uploadPhases={};
  function measureUpload(name,action){
    const started=performance.now();
    try{return action();}
    finally{uploadPhases[name]=(uploadPhases[name]??0)+performance.now()-started;}
  }
  function releaseFence(lost=false){
    if(fence&&!lost)gl.deleteSync(fence);
    fence=null;
  }
  function rendererReady(){
    if(!fence)return true;
    const status=measureUpload('fencePoll',()=>gl.clientWaitSync(fence,0,0));
    if(status===gl.TIMEOUT_EXPIRED){gpuDeferredFrames++;return false;}
    releaseFence(gl.isContextLost());
    if(status!==gl.ALREADY_SIGNALED&&status!==gl.CONDITION_SATISFIED)
      throw Error('Veilreach GPU readiness check failed');
    return true;
  }
  function finishFrame(){
    // The fence follows every draw in the current frame. A busy renderer can
    // keep drawing the visible bank while the next staged transfer waits.
    if(job?.ready&&!fence&&!gl.isContextLost()&&typeof gl.fenceSync==='function'){
      fence=gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE,0);
      if(fence)gl.flush();
    }
  }
  function invalidate(lost=false){
    releaseFence(lost);
    if(buffer&&!lost)gl.deleteBuffer(buffer);
    buffer=null;
    job?.upload?.dispose(lost);
    owners=[];
    atlasBytes=0;
    drawKey='';
    job=null;
    retry.clear();
  }
  function publish(next){
    if(buffer)gl.deleteBuffer(buffer);
    buffer=next.buffer;
    owners=next.owners;
    atlasBytes=next.bytes;
    rebuilds++;
  }

  function prepare({world,player,caveShade}){
    const source=world?.upperSourceProfile;
    if(source!==identity){
      invalidate();
      identity=source;
      terrain=source?createSkylands(source.seed):null;
      readRevision=source?createMobSourceRevision(world):null;
      center=null;
    }
    if(!terrain||caveShade>.35||gl.isContextLost())return;
    lastPreparationMs=0;
    lastUploadMs=0;
    uploadPhases={};
    if(!center||Math.max(Math.abs(player.x-center.x),Math.abs(player.z-center.z))>64)
      center={x:Math.floor(player.x/32)*32+16,z:Math.floor(player.z/32)*32+16};
    const key=[center.x,center.z,readRevision()].join('|');
    if(key!==drawKey){
      releaseFence();
      job?.upload?.dispose(false);
      drawKey=key;
      job={prep:prepareAtlas(terrain,center.x,center.z,world),ready:null,upload:null,done:false};
    }
    const retryKey='veilreach-distance';
    const now=performance.now();
    if(job&&retry.ready(retryKey,now)){
      try{
        const begin=performance.now();
        let work=0;
        while(!job.done&&!job.ready&&work<6&&performance.now()-begin<4){
          const result=job.prep.next();
          job.done=result.done;
          if(result.done||!buffer&&result.value?.length)job.ready=result.value.slice();
          else if(!result.value){preparedTiles++;work++;}
        }
        lastPreparationMs=performance.now()-begin;
        if(job.ready){
          const beginUpload=performance.now();
          try{
            if(rendererReady()){
              if(!job.upload)job.upload=measureUpload('pack',()=>stageUpload(gl,pack(job.ready)));
              if(job.upload.slice(measureUpload)){
                publish(job.upload.finish());
                job.upload=null;job.ready=null;
                retry.success(retryKey);
              }
            }
          }finally{
            lastUploadMs=performance.now()-beginUpload;
          }
        }
        if(job.done&&!job.ready)job=null;
      }catch(error){
        job.upload?.dispose(gl.isContextLost());
        job.upload=null;
        retry.fail(retryKey,performance.now(),error.message);
      }
    }
  }

  return Object.freeze({invalidate,prepare,finishFrame,hasVisual:key=>owners.some(owner=>owner.key===key),
    draw({world,chunks,caveShade,atPos,atColor,atUv,atMat}){
    if(!terrain||caveShade>.35||gl.isContextLost())return 0;
    const detailed=new Set();
    for(const [key,c] of chunks){
      if(c.section>0&&(c.buffer&&c.count||world.upperNaturalOccupied(key)))detailed.add(key);
    }
    const ranges=veilreachDrawRanges(owners,detailed);
    if(gl.canvas?.dataset){
      gl.canvas.dataset.veilreachAtlas=JSON.stringify({bytes:atlasBytes,rebuilds,preparedTiles,
        pending:Boolean(job),drawCalls:ranges.length,prepareMs:lastPreparationMs,uploadMs:lastUploadMs,uploadPhases,gpuDeferredFrames});
    }
    if(!buffer||!ranges.length)return 0;
    gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.vertexAttribPointer(atPos,3,gl.FLOAT,false,36,0);
    gl.vertexAttribPointer(atColor,3,gl.FLOAT,false,36,12);
    gl.vertexAttribPointer(atUv,2,gl.FLOAT,false,36,24);
    gl.vertexAttribPointer(atMat,1,gl.FLOAT,false,36,32);
    let visible=0;
    for(const {first,count} of ranges){gl.drawArrays(gl.TRIANGLES,first,count);visible+=count;}
    return visible;
  }});
}
