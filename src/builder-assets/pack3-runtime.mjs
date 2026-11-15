// Pack 3 isolated physical runtime bridge candidate. Not activated in main.mjs.
// The existing VoxelWorld, schema-1 saves and player control path are unchanged.
import {resolvePack3BuilderAsset,PACK3_BUILDER_SYMBOLS} from './pack3.mjs';
import {FULL_CUBE,raycastShapes} from '../voxel-shape-interactions.mjs';
import {inspectBodyFit} from '../voxel-shape-fit.mjs';
import {CHUNK_SIZE,BLOCK} from '../voxel.mjs';
import {biome130Block,isBiome130BlockId} from '../biome130-registry.mjs';
import {WORLD_MIN_Y,WORLD_MAX_Y,sectionBounds,sectionForY} from '../depth.mjs';

export const PACK3_RUNTIME_FORMAT='mythwrought.pack3-construction-overlay.v1';
export const PACK3_RUNTIME_LIMIT=4096;
export const PACK3_RUNTIME_LIVE=false; // Explicitly NOT wired into production world/renderer.
const KEY=/^-?(0|[1-9]\d*),-?(0|[1-9]\d*),-?(0|[1-9]\d*)$/;
const LIGHTS=[[.73,.77],[.48,1],[.67,.85]];
const colorCache=new Map();
const meshCache=new Map();
const coord=at=>{
  if(!Array.isArray(at)||at.length!==3||!at.every(Number.isSafeInteger))
    throw new TypeError('Pack 3 cell coordinates must be safe integers');
  if(at[1]<WORLD_MIN_Y||at[1]>WORLD_MAX_Y)throw new RangeError('Outside editable world depth');
  return at;
};
const key=at=>coord(at).join(',');
const parseKey=k=>{
  if(!KEY.test(k))throw new TypeError('Invalid cell key');
  return k.split(',').map(Number);
};
const rgb=hex=>{
  if(colorCache.has(hex))return colorCache.get(hex);
  if(!/^#[0-9a-f]{6}$/i.test(hex))throw new TypeError('Invalid material color');
  const x=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255);
  colorCache.set(hex,x);
  return x;
};
// A material exists at a subvoxel point exactly when one of the approved
// occupied physical parts contains the point. Newer trim parts shade above base.
function sample(parts,p){
  let tone=null;
  for(const part of parts){
    const b=part.box;
    if(p.every((x,i)=>x>=b[i]&&x<b[i+3]))tone=part.color;
  }
  return tone;
}
const axisPoint=(axis,p,u,v)=>axis===0?[p,u,v]:axis===1?[u,p,v]:[u,v,p];
function corners(axis,p,u0,u1,v0,v1,dir){
  if(axis===0)return dir<0?[[p,u0,v0],[p,u0,v1],[p,u1,v1],[p,u1,v0]]:
    [[p,u0,v1],[p,u0,v0],[p,u1,v0],[p,u1,v1]];
  if(axis===1)return dir<0?[[u0,p,v1],[u0,p,v0],[u1,p,v0],[u1,p,v1]]:
    [[u0,p,v0],[u0,p,v1],[u1,p,v1],[u1,p,v0]];
  return dir<0?[[u1,v0,p],[u0,v0,p],[u0,v1,p],[u1,v1,p]]:
    [[u0,v0,p],[u1,v0,p],[u1,v1,p],[u0,v1,p]];
}
// Genuine source physical AABB union surface tessellation: internal faces
// disappear; each exposed quad retains its own material/tone, not a cubic proxy.
// Returns the existing renderer's nine-float interleaved vertex layout.
export function meshPack3PhysicalAsset(symbol,orientation='north'){
  const asset=resolvePack3BuilderAsset(symbol,orientation),cacheKey=asset.blockId+':'+asset.yaw;
  if(meshCache.has(cacheKey))return meshCache.get(cacheKey);
  const parts=asset.parts;
  const bounds=[0,1,2].map(i=>[...new Set(parts.flatMap(q=>[q.box[i],q.box[i+3]]))].sort((a,b)=>a-b));
  const data=[];let exposedQuads=0;
  const emit=(axis,p,u0,u1,v0,v1,dir,hex)=>{
    const vertices=corners(axis,p,u0,u1,v0,v1,dir),shade=LIGHTS[axis][dir>0?1:0];
    const col=rgb(hex).map(c=>c*shade);
    const uv=[[0,0],[0,1],[1,1],[1,0]];
    for(const i of [0,1,2,0,2,3])data.push(...vertices[i],...col,...uv[i],3);
    exposedQuads++;
  };
  const EPS=1e-7;
  for(let axis=0;axis<3;axis++){
    const others=[0,1,2].filter(i=>i!==axis);
    const planes=bounds[axis],us=bounds[others[0]],vs=bounds[others[1]];
    for(const p of planes)for(const dir of [-1,1]){
      const grid=Array.from({length:vs.length-1},(_,v)=>
        Array.from({length:us.length-1},(_,u)=>{
          const midU=(us[u]+us[u+1])/2,midV=(vs[v]+vs[v+1])/2;
          const a=axisPoint(axis,p-dir*EPS,midU,midV);
          const b=axisPoint(axis,p+dir*EPS,midU,midV);
          const inside=sample(parts,a);
          return inside&&!sample(parts,b)?inside:null;
        }));
      const used=grid.map(row=>row.map(()=>false));
      for(let v=0;v<grid.length;v++)for(let u=0;u<grid[v].length;u++){
        const col=grid[v][u];
        if(!col||used[v][u])continue;
        let w=1;
        while(u+w<grid[v].length&&!used[v][u+w]&&grid[v][u+w]===col)w++;
        let h=1;
        next:while(v+h<grid.length){
          for(let j=0;j<w;j++)if(used[v+h][u+j]||grid[v+h][u+j]!==col)break next;
          h++;
        }
        for(let row=v;row<v+h;row++)for(let x=u;x<u+w;x++)used[row][x]=true;
        emit(axis,p,us[u],us[u+w],vs[v],vs[v+h],dir,col);
      }
    }
  }
  if(!exposedQuads||data.length>9*6*5000)throw Error('Pack 3 physical mesh exceeds safe budget');
  const record=Object.freeze({blockId:asset.blockId,yaw:asset.yaw,
    vertexCount:data.length/9,triangleCount:data.length/27,
    exposedQuads,vertices:new Float32Array(data)});
  meshCache.set(cacheKey,record);
  return record;
}
const compare=(a,b)=>a.at[0]-b.at[0]||a.at[1]-b.at[1]||a.at[2]-b.at[2];
function validWorld(world){
  if(!world||typeof world.get!=='function'||!(world.edits instanceof Map)||
    !Number.isSafeInteger(world.seed))throw new TypeError('Expected seed-specific VoxelWorld');
}
function worldIdentity(worldId){
  if(typeof worldId!=='string'||!/^[a-zA-Z0-9._:-]{1,128}$/.test(worldId))
    throw new TypeError('Invalid world identity');
  return worldId;
}
// Stage for eventual integration: fully shaped read/target/fit/mesh and
// separate bounded orientation persistence. Does NOT mutate the live game
// or claim to replace VoxelWorld.set / schema-1 saves.
export function createPack3RuntimeStage(world,{worldId='builder-preview',maxCells=PACK3_RUNTIME_LIMIT}={}){
  validWorld(world);worldIdentity(worldId);
  if(!Number.isSafeInteger(maxCells)||maxCells<1||maxCells>PACK3_RUNTIME_LIMIT)
    throw new RangeError('Invalid construction overlay budget');
  const overlays=new Map(),byChunk=new Map();
  const bucketKey=at=>Math.floor(at[0]/CHUNK_SIZE)+','+
    Math.floor(at[2]/CHUNK_SIZE)+','+sectionForY(at[1]);
  function register(entry){
    const k=key(entry.at),bucket=bucketKey(entry.at);
    let cells=byChunk.get(bucket);
    if(!cells){cells=new Map();byChunk.set(bucket,cells);}
    overlays.set(k,entry);cells.set(k,entry);
  }
  function unregister(at){
    const k=key(at),entry=overlays.get(k);
    if(!entry)return false;
    const bucket=bucketKey(entry.at),cells=byChunk.get(bucket);
    if(!cells||!cells.delete(k))throw new Error('Pack 3 chunk index desynchronized');
    if(!cells.size)byChunk.delete(bucket);
    overlays.delete(k);
    return true;
  }
  function normalize(record){
    if(!record||typeof record!=='object')throw new TypeError('Invalid physical placement');
    const at=[...coord(record.at)],symbol=record.asset;
    if(!PACK3_BUILDER_SYMBOLS.includes(symbol))throw new RangeError('Unregistered Pack 3 symbol');
    const asset=resolvePack3BuilderAsset(symbol,record.orientation??'north');
    return Object.freeze({at:Object.freeze(at),asset:symbol,id:asset.blockId,yaw:asset.yaw});
  }
  function available(entry,temporary){
    const k=key(entry.at);
    if((overlays.has(k)&&!temporary?.has(k))||world.edits.has(k)||world.get(...entry.at)!==BLOCK.AIR)
      throw new Error('Occupied or player-edited voxel cannot be replaced');
  }
  function placeMany(records,{playerBody=null}={}){
    if(!Array.isArray(records)||!records.length||records.length>maxCells)
      throw new RangeError('Invalid construction placements');
    if(overlays.size+records.length>maxCells)throw new RangeError('Construction overlay full');
    const planned=new Map();
    for(const raw of records){
      const e=normalize(raw),k=key(e.at);
      if(planned.has(k))throw new Error('Duplicate construction cell');
      available(e,planned);
      planned.set(k,e);
    }
    if(playerBody){
      const proposed=(x,y,z)=>{
        const k=[x,y,z].join(','),e=planned.get(k);
        return e?resolvePack3BuilderAsset(e.asset,e.yaw).shape:readCollisionShape(x,y,z);
      };
      if(!inspectBodyFit(playerBody,proposed).fits)
        throw new Error('Physical construction intersects player');
    }
    for(const e of planned.values())register(e);
    return records.length;
  }
  function readShape(x,y,z){
    // Player eyes and targeting rays may legitimately be above the highest
    // voxel or below the minimum depth. Treat those empty cells as air.
    if(![x,y,z].every(Number.isSafeInteger))throw new TypeError('Invalid shape cell');
    if(y<WORLD_MIN_Y||y>WORLD_MAX_Y)return null;
    const k=key([x,y,z]),e=overlays.get(k);
    if(e)return resolvePack3BuilderAsset(e.asset,e.yaw).shape;
    const id=world.get(x,y,z);
    if(id===BLOCK.AIR)return null;
    if(isBiome130BlockId(id)){
      const source=biome130Block(id,world.rotationAt?.(x,y,z)??0);
      return {boxes:source.boxes};
    }
    if(Number.isInteger(id)&&id>0&&id<=BLOCK.DEEPSTONE)return FULL_CUBE;
    throw new Error('Unknown live block identity; cannot synthesize geometry');
  }
  function readCollisionShape(x,y,z){
    // Biome130 intentionally includes nonsolid plants. The Pack 3 combined
    // collision path must keep those passable, exactly as the live engine does.
    const id=world.get(x,y,z);
    if(isBiome130BlockId(id)&&!biome130Block(id,world.rotationAt?.(x,y,z)??0).solid)
      return null;
    return readShape(x,y,z);
  }
  function remove(at){return unregister(at);}
  function get(at){return overlays.get(key(at))??null;}
  function entries(){return Object.freeze([...overlays.values()].sort(compare));}
  function target(origin,direction,reach=6){
    return raycastShapes(origin,direction,readShape,reach);
  }
  function playerFits(bounds){return inspectBodyFit(bounds,readCollisionShape);}
  function chunkMesh(cx,cz,section=0,{maxVertices=100000}={}){
    if(![cx,cz,section].every(Number.isInteger)||section>0||
        !Number.isSafeInteger(maxVertices)||maxVertices<1)throw new TypeError('Invalid chunk request');
    const y=sectionBounds(section),selected=[],startX=cx*CHUNK_SIZE,startZ=cz*CHUNK_SIZE;
    // Dense settlements must not scan every placed block to build one
    // nearby section. The index follows the same world cell and depth key.
    const candidates=byChunk.get(cx+','+cz+','+section);
    let count=0;
    // Two bounded passes: calculate exact required output before allocating.
    // The former per-vertex src.slice() created thousands of small arrays and
    // an additional untyped JS array for every edited construction chunk.
    for(const e of candidates?.values()??[]){
      const [x,atY,z]=e.at;
      if(x<startX||x>=startX+CHUNK_SIZE||z<startZ||z>=startZ+CHUNK_SIZE||
          atY<y.minY||atY>y.maxY)continue;
      const model=meshPack3PhysicalAsset(e.asset,e.yaw);
      count+=model.vertexCount;
      if(count>maxVertices)throw new RangeError('Pack 3 chunk triangle budget exceeded');
      selected.push({model,x,y:atY,z});
    }
    const out=new Float32Array(count*9);
    let cursor=0;
    for(const {model,x,y,z} of selected){
      const src=model.vertices;
      for(let i=0;i<src.length;i+=9){
        out[cursor++]=src[i]+x;out[cursor++]=src[i+1]+y;out[cursor++]=src[i+2]+z;
        for(let j=3;j<9;j++)out[cursor++]=src[i+j];
      }
    }
    return out;
  }
  function serialize(){
    const doc={format:PACK3_RUNTIME_FORMAT,seed:world.seed,worldId,
      entries:entries().map(e=>({at:e.at,asset:e.asset,orientation:e.yaw}))};
    const raw=JSON.stringify(doc);
    if(raw.length>400000)throw new RangeError('Pack 3 overlay exceeds storage limit');
    return raw; // This is NOT the game's schema-1 save.
  }
  function restore(raw){
    if(typeof raw!=='string'||raw.length>400000)throw new TypeError('Invalid physical overlay JSON');
    let doc;try{doc=JSON.parse(raw);}catch{throw new TypeError('Malformed physical overlay JSON');}
    if(!doc||doc.format!==PACK3_RUNTIME_FORMAT||doc.seed!==world.seed||
        doc.worldId!==worldId||!Array.isArray(doc.entries)||doc.entries.length>maxCells)
      throw new Error('Foreign or invalid physical overlay');
    if(overlays.size)throw new Error('Restore requires a fresh, empty overlay');
    if(doc.entries.length===0)return 0;
    return placeMany(doc.entries);
  }
  return Object.freeze({
    format:PACK3_RUNTIME_FORMAT,liveGameRegistered:false,
    placeMany,remove,get,entries,readShape,target,playerFits,chunkMesh,
    serialize,restore,size:()=>overlays.size
  });
}
