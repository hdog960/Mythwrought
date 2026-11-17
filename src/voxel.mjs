// MYTHWROUGHT v0.07: deterministic editable voxel terrain with world-coherent chunk edges.
import {WORLD_MIN_Y as DEEP_WORLD_MIN_Y,WORLD_MAX_Y,LEGACY_WORLD_MIN_Y} from './depth.mjs';
import {isPack2LiveId,pack2WorldVertices,pack2ShapeOf,pack2RayHit,
  pack2BodyIntersects} from './pack2-integration.mjs';
import {biome130Block,biome130Color,isBiome130BlockId} from './biome130-registry.mjs';
import {biome130TriangleMaterialTag} from './biome130-render.mjs';
import {prototypeSurfaceMesh} from './shape-prototypes.mjs';
import {FULL_CUBE,raycastShapes} from './voxel-shape-interactions.mjs';
// Existing world generators import WORLD_MIN_Y to clamp legacy seeded caves.
// Keep that public contract at -3; the expanded editable engine range is
// separately exported by depth.mjs so old cave floors do not shift.
export const WORLD_MIN_Y=LEGACY_WORLD_MIN_Y;
export {WORLD_MAX_Y} from './depth.mjs';
import {meadowAccentVertices} from './meadow.mjs';
import {storybookGroveVertices} from './grove.mjs';
import {woodlandCanopyVertices} from './canopy.mjs';
import {grottoAccentVertices} from './grotto.mjs';
import {caveRuneVertices} from './cave-runes.mjs';
import {caveThresholdVertices} from './cave-thresholds.mjs';
import {voxelLandmarksForChunk,VOXEL_LANDMARK_CACHE_LIMIT} from './voxel-landmarks.mjs';
import {moonbellVertices} from './moonbells.mjs';
import {ridgeStrataVertices} from './ridge-strata.mjs';
import {liveVoxelDistrict,LIVE_DISTRICT_SIZE,LIVE_DISTRICT_CACHE_LIMIT} from './live-voxel-world.mjs';
// This is an engineering prototype, not the finished game's terrain art or save system.
export const CHUNK_SIZE = 16;
export const BLOCK = Object.freeze({ AIR:0, GRASS:1, DIRT:2, STONE:3, WOOD:4, CRYSTAL:5, ORE:6, LEAVES:7, DEEPSTONE:8 });
const COLORS = {
  1:[0.35,0.64,0.32], 2:[0.48,0.34,0.24], 3:[0.48,0.51,0.55],
  4:[0.60,0.39,0.23], 5:[0.36,0.79,0.92], 6:[0.70,0.58,0.33],
  7:[0.27,0.57,0.31], 8:[0.32,0.39,0.48]
};
const FACE = [
  {d:[1,0,0],q:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],lit:.77},
  {d:[-1,0,0],q:[[0,0,1],[0,1,1],[0,1,0],[0,0,0]],lit:.73},
  {d:[0,1,0],q:[[0,1,1],[1,1,1],[1,1,0],[0,1,0]],lit:1},
  {d:[0,-1,0],q:[[0,0,0],[1,0,0],[1,0,1],[0,0,1]],lit:.48},
  {d:[0,0,1],q:[[1,0,1],[1,1,1],[0,1,1],[0,0,1]],lit:.85},
  {d:[0,0,-1],q:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]],lit:.67}
];
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const FACE_UV=[[0,0],[0,1],[1,1],[1,0]];
function hash(x,z,seed){
  let h=Math.imul((x|0)^seed,0x27d4eb2d) ^ Math.imul((z|0)+seed,0x165667b1);
  h^=h>>>15;h=Math.imul(h,0x85ebca6b);h^=h>>>13;
  return (h>>>0)/4294967295;
}
const smooth=t=>t*t*(3-2*t);
function noise(x,z,seed){
  const a=Math.floor(x),b=Math.floor(z),u=smooth(x-a),v=smooth(z-b);
  const c=(i,j)=>hash(i,j,seed);
  const p=c(a,b)*(1-u)+c(a+1,b)*u;
  const q=c(a,b+1)*(1-u)+c(a+1,b+1)*u;
  return p*(1-v)+q*v;
}
export function chunkCoord(x){return Math.floor(x/CHUNK_SIZE);}
export function chunkWindow(x,z,radius=2){
  if(!Number.isInteger(radius)||radius<0||radius>4)throw Error('Invalid chunk radius');
  const cx=chunkCoord(x),cz=chunkCoord(z),list=[];
  for(let dz=-radius;dz<=radius;dz++)for(let dx=-radius;dx<=radius;dx++)
    list.push({cx:cx+dx,cz:cz+dz,distance:dx*dx+dz*dz});
  list.sort((a,b)=>a.distance-b.distance||a.cz-b.cz||a.cx-b.cx);
  return list;
}
export function terrainHeight(x,z,seed=179){
  const n=noise(x/29,z/29,seed)*7+noise(x/11,z/11,seed+17)*3;
  return clamp(Math.floor(2+n),2,12);
}
export function worldKey(x,y,z){return x+','+y+','+z;}
function cave(x,y,z,seed){
  const n=Math.sin((x+seed%127)*.18+y*.28)+Math.cos(z*.16-y*.39)+Math.sin((x+z)*.11);
  return n>2.07;
}
export function baseBlock(x,y,z,seed=179){
  if(!Number.isInteger(x)||!Number.isInteger(y)||!Number.isInteger(z))return BLOCK.AIR;
  if(y<DEEP_WORLD_MIN_Y||y>WORLD_MAX_Y)return BLOCK.AIR;
  // New geology begins strictly BELOW the unmodified original [-3,19] world.
  // :24 retains exclusive ownership of all future deep-cave generation.
  if(y<LEGACY_WORLD_MIN_Y)return y<-32?BLOCK.DEEPSTONE:BLOCK.STONE;
  const h=terrainHeight(x,z,seed);
  if(y>h)return BLOCK.AIR;
  if(y<=LEGACY_WORLD_MIN_Y+1)return BLOCK.STONE;
  if(y<h-2 && cave(x,y,z,seed))return BLOCK.AIR;
  if(y===h)return BLOCK.GRASS;
  if(y>=h-3)return BLOCK.DIRT;
  if(y<h-2 && y>0 && hash(x*3+y,z*7-y,seed+55)>.975)return BLOCK.ORE;
  return BLOCK.STONE;
}
export class VoxelWorld{
  constructor(seed=179){
    this.seed=seed|0;
    this.edits=new Map();
    this.rotations=new Map();
    this.biomeCellCount=0;
    // Limited per-world cache: streaming an endless world cannot retain every
    // visited district forever. Geometry is recreated from the original seed.
    this.landmarkCache=new Map();
    this.liveDistrictCache=new Map();
  }
  legacyBlockAt(x,y,z){
    const natural=baseBlock(x,y,z,this.seed);
    if(natural!==BLOCK.AIR||y<=0||y>WORLD_MAX_Y||
       ![x,y,z].every(Number.isInteger))return natural;
    const cx=chunkCoord(x),cz=chunkCoord(z),chunk= cx+','+cz;
    let blocks=this.landmarkCache.get(chunk);
    if(!blocks){
      blocks=voxelLandmarksForChunk(cx,cz,this.seed,{
        heightAt:terrainHeight,baseAt:baseBlock,maxY:WORLD_MAX_Y,
        grass:BLOCK.GRASS,air:BLOCK.AIR,stone:BLOCK.STONE,
        wood:BLOCK.WOOD,crystal:BLOCK.CRYSTAL,ore:BLOCK.ORE
      }).blocks;
      this.landmarkCache.set(chunk,blocks);
      if(this.landmarkCache.size>VOXEL_LANDMARK_CACHE_LIMIT)
        this.landmarkCache.delete(this.landmarkCache.keys().next().value);
    }
    return blocks.get(worldKey(x,y,z))??natural;
  }
  naturalAndLandmarkBlock(x,y,z){
    // Construct only inside the valid voxel height. This overlay is a pure
    // deterministic view; it never writes to this.edits or schema-1 storage.
    const ordinary=this.legacyBlockAt(x,y,z);
    // Deep substrate is an engine-only layer, not a new :24/:36/:48
    // generation envelope. Avoid creating expensive surface districts for
    // every buried rock queried by the 16-block vertical mesh slices.
    if(![x,y,z].every(Number.isInteger)||y<DEEP_WORLD_MIN_Y||y>WORLD_MAX_Y||
       y<LEGACY_WORLD_MIN_Y)return ordinary;
    const dx=Math.floor(x/LIVE_DISTRICT_SIZE),dz=Math.floor(z/LIVE_DISTRICT_SIZE);
    const districtKey=dx+','+dz;
    let district=this.liveDistrictCache.get(districtKey);
    if(!district){
      district=liveVoxelDistrict(this.seed,dx,dz,(px,py,pz)=>this.legacyBlockAt(px,py,pz));
      this.liveDistrictCache.set(districtKey,district);
      if(this.liveDistrictCache.size>LIVE_DISTRICT_CACHE_LIMIT)
        this.liveDistrictCache.delete(this.liveDistrictCache.keys().next().value);
    }
    return district.get(x,y,z,ordinary);
  }

  get(x,y,z){
    const key=worldKey(x,y,z);
    return this.edits.has(key)?this.edits.get(key):this.naturalAndLandmarkBlock(x,y,z);
  }
  rotationAt(x,y,z){return this.rotations.get(worldKey(x,y,z))??0;}
  set(x,y,z,id,rotation=0){
    if(![x,y,z,id,rotation].every(Number.isInteger)||
       y<DEEP_WORLD_MIN_Y||y>WORLD_MAX_Y||
       !(id>=0&&id<=8||isBiome130BlockId(id))||
       rotation<0||rotation>3||rotation!==0&&!isBiome130BlockId(id))return false;
    const key=worldKey(x,y,z),previous=this.edits.get(key);
    if(isBiome130BlockId(previous))this.biomeCellCount--;
    if(this.naturalAndLandmarkBlock(x,y,z)===id)this.edits.delete(key);
    else this.edits.set(key,id);
    if(isBiome130BlockId(id)){
      this.biomeCellCount++;
      if(rotation)this.rotations.set(key,rotation);
      else this.rotations.delete(key);
    }else this.rotations.delete(key);
    return true;
  }
  save(){
    const edits=[...this.edits.entries()].map(([k,id])=>[...k.split(',').map(Number),id]);
    edits.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
    const payload={schema:1,seed:this.seed,edits};
    // Compatible extension: existing schema-1 byte shape is unchanged when no
    // rotated biome material was placed. Old worlds load without migration.
    if(this.rotations.size)payload.rotations=[...this.rotations.entries()]
      .filter(([k])=>isBiome130BlockId(this.edits.get(k)))
      .map(([k,turns])=>[...k.split(',').map(Number),turns])
      .sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
    return payload;
  }
  static restore(payload){
    if(!payload||payload.schema!==1||!Number.isInteger(payload.seed)||payload.seed!==(payload.seed|0)||!Array.isArray(payload.edits)||payload.edits.length>300000)throw Error('Unsupported or invalid Mythwrought save');
    const world=new VoxelWorld(payload.seed);
    for(const row of payload.edits){
      if(!Array.isArray(row)||row.length!==4||!world.set(...row))throw Error('Save contains invalid voxel edit');
    }
    if(payload.rotations!==undefined){
      if(!Array.isArray(payload.rotations)||payload.rotations.length>300000)throw Error('Invalid rotated block state');
      const seen=new Set();
      for(const row of payload.rotations){
        if(!Array.isArray(row)||row.length!==4||!row.every(Number.isInteger)||
          row[3]<1||row[3]>3)throw Error('Invalid rotated voxel');
        const k=worldKey(...row.slice(0,3));
        if(seen.has(k)||!isBiome130BlockId(world.edits.get(k)))throw Error('Stale/duplicate rotated block');
        seen.add(k);world.rotations.set(k,row[3]);
      }
    }
    return world;
  }
}
export function meshChunk(world,cx,cz){
  // A face check repeatedly visits the same neighboring voxel (often six
  // times). Cache only cells actually queried by this synchronous rebuild.
  // The one-block halo includes chunk boundaries and the vertical limits;
  // reads still go through world.get so schema-1 edits override seeded caves.
  const side=CHUNK_SIZE+2, depth=WORLD_MAX_Y-LEGACY_WORLD_MIN_Y+3;
  const minX=cx*CHUNK_SIZE-1,minZ=cz*CHUNK_SIZE-1,minY=LEGACY_WORLD_MIN_Y-1;
  const cells=new Uint16Array(side*side*depth);
  cells.fill(65535); // 16-bit sentinel: old 255 remains reserved; biome130 uses 256..312.
  const extra=new Map();
  const blockAt=(x,y,z)=>{
    if(x<minX||x>=minX+side||z<minZ||z>=minZ+side||y<minY||y>=minY+depth){
      const key=x+','+y+','+z;
      if(extra.has(key))return extra.get(key);
      const id=world.get(x,y,z);extra.set(key,id);return id;
    }
    const index=((x-minX)*side+(z-minZ))*depth+(y-minY);
    const cached=cells[index];
    if(cached!==65535)return cached;
    const id=world.get(x,y,z);
    cells[index]=id;
    return id;
  };
  const readWorld={seed:world.seed,get:blockAt};
  // Each authored multi-box shape is surface-unioned only once per rotation.
  // No false full-cube fallback for these physical automation materials.
  const getBiomeGeometry=(id,rotation)=>{
    const cacheKey=id*4+rotation;
    let mesh=biomeSurfaceCache.get(cacheKey);
    if(!mesh){
      const block=biome130Block(id,rotation);
      mesh=prototypeSurfaceMesh({prototypeOnly:true,boxes:block.boxes});
      if(mesh.indices.length>12000)throw Error('Biome voxel surface budget exceeded');
      biomeSurfaceCache.set(cacheKey,mesh);
    }
    return mesh;
  };
  // Typed solid-mesh staging: conserve allocations while preserving exactly
  // the original 9-float vertex layout and existing seed/save semantics.
  let solidBuffer=new Float32Array(16384),solidLength=0;
  const appendVertex=(x,y,z,r,g,b,u,w,id)=>{
    if(solidLength+9>solidBuffer.length){
      const grown=new Float32Array(solidBuffer.length*2);
      grown.set(solidBuffer);solidBuffer=grown;
    }
    solidBuffer[solidLength++]=x;solidBuffer[solidLength++]=y;
    solidBuffer[solidLength++]=z;solidBuffer[solidLength++]=r;
    solidBuffer[solidLength++]=g;solidBuffer[solidLength++]=b;
    solidBuffer[solidLength++]=u;solidBuffer[solidLength++]=w;
    solidBuffer[solidLength++]=id;
  };
  for(let x=cx*CHUNK_SIZE;x<(cx+1)*CHUNK_SIZE;x++)
    for(let z=cz*CHUNK_SIZE;z<(cz+1)*CHUNK_SIZE;z++)
      for(let y=LEGACY_WORLD_MIN_Y;y<=WORLD_MAX_Y;y++){
        const id=blockAt(x,y,z);
        if(id===BLOCK.AIR)continue;
        if(isPack2LiveId(id)){
          if(id!==76){
            const state=world.getPack2State?.(x,y,z);
            if(!state)throw Error('Pack 2 physical mesh missing actual cell state');
            const physical=pack2WorldVertices(id,state,[x,y,z]);
            for(let j=0;j<physical.length;j+=9)
              appendVertex(...physical.subarray(j,j+9));
          }
          continue;
        }
        if(isBiome130BlockId(id)){
          const rotation=world.rotationAt?.(x,y,z)??0;
          const surface=getBiomeGeometry(id,rotation);
          // Source-accurate union surface geometry; full neighboring legacy
          // solids hide only true boundary faces, preserving internal shapes.
          for(let t=0;t<surface.indices.length;t+=3){
            const vi=surface.indices[t],ni=vi*3;
            const nx=surface.normals[ni],ny=surface.normals[ni+1],nz=surface.normals[ni+2];
            const neighbor=blockAt(x+nx,y+ny,z+nz);
            let boundary=true;
            for(let u=t;u<t+3;u++){
              const i=surface.indices[u]*3;
              if(nx&&Math.abs(surface.positions[i]-(nx>0?1:0))>1e-6||
                 ny&&Math.abs(surface.positions[i+1]-(ny>0?1:0))>1e-6||
                 nz&&Math.abs(surface.positions[i+2]-(nz>0?1:0))>1e-6){
                boundary=false;break;
              }
            }
            if(boundary&&neighbor!==BLOCK.AIR&&
                !isBiome130BlockId(neighbor)&&!isPack2LiveId(neighbor))continue;
            const face=nx>0?0:nx<0?1:ny>0?2:ny<0?3:nz>0?4:5;
            const lit=[.77,.73,1,.48,.85,.67][face];
            const color=biome130Color(id,x,y,z,face);
            const material=biome130TriangleMaterialTag(
              id,rotation,surface.positions,surface.indices,t);
            for(let u=t;u<t+3;u++){
              const i=surface.indices[u]*3,px=surface.positions[i],
                    py=surface.positions[i+1],pz=surface.positions[i+2];
              appendVertex(x+px,y+py,z+pz,color[0]*lit,color[1]*lit,color[2]*lit,
                nx?pz:px,ny?pz:py,material);
            }
          }
          continue;
        }
        const color=COLORS[id]||COLORS[3];
        // Most underground voxels are fully enclosed. Defer the two noise
        // samples and tint calculation until the FIRST exposed face; otherwise
        // a solid chunk pays for shading thousands of invisible blocks.
        // Keep world-space inputs and face order identical for save/seed parity.
        let variance;
        for(const face of FACE){
          const neighbor=blockAt(x+face.d[0],y+face.d[1],z+face.d[2]);
          if(neighbor!==BLOCK.AIR&&!isPack2LiveId(neighbor))continue;
          if(variance===undefined)variance=.90+noise(x/9,z/9,world.seed+91)*.14+
            hash(x+y*5,z-y*3,world.seed+91)*.08;
          const r=clamp(color[0]*variance*face.lit,0,1);
          const g=clamp(color[1]*variance*face.lit,0,1);
          const b=clamp(color[2]*variance*face.lit,0,1);
          for(const k of [0,1,2,0,2,3]){
            const p=face.q[k],uv=FACE_UV[k];
            appendVertex(x+p[0],y+p[1],z+p[2],r,g,b,uv[0],uv[1],id===BLOCK.LEAVES?18:id===BLOCK.DEEPSTONE?19:id);
          }
        }
      }
  // Decorative meadows are purely rendered geometry anchored to the current
  // grass voxel. They never enter world.get(), raycasts, collisions or saves.
  // Crucially, they piggyback the existing chunk buffer and mesh invalidation.
  const grove=storybookGroveVertices(readWorld,cx,cz,{
    chunkSize:CHUNK_SIZE,heightAt:terrainHeight,baseAt:baseBlock,
    grass:BLOCK.GRASS,air:BLOCK.AIR
  });
  const canopy=woodlandCanopyVertices(readWorld,cx,cz,{
    chunkSize:CHUNK_SIZE,heightAt:terrainHeight,baseAt:baseBlock,
    grass:BLOCK.GRASS,air:BLOCK.AIR
  });
  const meadow=meadowAccentVertices(readWorld,cx,cz,{
    chunkSize:CHUNK_SIZE,heightAt:terrainHeight,grass:BLOCK.GRASS,air:BLOCK.AIR
  });
  // Underground mushrooms and crystal tips reuse this SAME chunk mesh and
  // existing edit invalidation; no physics, lighting pass or persisted blocks.
  const grotto=grottoAccentVertices(readWorld,cx,cz,{
    chunkSize:CHUNK_SIZE,minY:LEGACY_WORLD_MIN_Y,maxY:WORLD_MAX_Y,
    heightAt:terrainHeight,baseAt:baseBlock,
    air:BLOCK.AIR,stone:BLOCK.STONE,ore:BLOCK.ORE
  });
  const runes=caveRuneVertices(readWorld,cx,cz,{
    chunkSize:CHUNK_SIZE,minY:LEGACY_WORLD_MIN_Y,maxY:WORLD_MAX_Y,
    heightAt:terrainHeight,baseAt:baseBlock,
    air:BLOCK.AIR,stone:BLOCK.STONE,ore:BLOCK.ORE
  });
  const caveThresholds=caveThresholdVertices(readWorld,cx,cz,{chunkSize:CHUNK_SIZE,heightAt:terrainHeight,baseAt:baseBlock,air:BLOCK.AIR,stoneId:BLOCK.STONE,minY:LEGACY_WORLD_MIN_Y,maxY:WORLD_MAX_Y});
  // Waystones, towers, shrines, arches and causeways are now real voxels from
  // VoxelWorld.get(). Do NOT append the old non-collidable meshes as duplicates.
  const moonbells=moonbellVertices(readWorld,cx,cz,{chunkSize:CHUNK_SIZE,heightAt:terrainHeight,baseAt:baseBlock,grass:BLOCK.GRASS,air:BLOCK.AIR});
  const ridgeStrata=ridgeStrataVertices(readWorld,cx,cz,{chunkSize:CHUNK_SIZE,heightAt:terrainHeight,stone:BLOCK.STONE,air:BLOCK.AIR});
  // Ruined bridge prototype remains staged but disabled: terrain must first
  // establish a REAL natural crossing; never paint an invented river.
  const solid=solidBuffer.slice(0,solidLength);
  const ornaments=[canopy,grove,meadow,runes,grotto,moonbells,ridgeStrata,caveThresholds];
  let total=solid.length;
  for(const part of ornaments)total+=part.length;
  if(total===solid.length)return solid;
  const combined=new Float32Array(total);
  combined.set(solid);
  let offset=solid.length;
  for(const part of ornaments){combined.set(part,offset);offset+=part.length;}
  return combined;
}
const biomeSurfaceCache=new Map(); // 57 assets x 4 rotations, bounded by registry.
// Exact voxel grid traversal: consistent selection through chunk borders and negative space.
// Start at the eye point, traverse each crossed cell, and preserve the adjacent empty cell
// so placement and removal share the same pixel-accurate targeting rule.
export function raycast(world,eye,direction,maxDistance=7){
  if(!Array.isArray(eye)||!Array.isArray(direction)||eye.length!==3||direction.length!==3||
     ![...eye,...direction,maxDistance].every(Number.isFinite)||maxDistance<0)return null;
  const len=Math.hypot(...direction);
  if(len<1e-9)return null;
  // Pack 3's additive physical sidecar never replaces the canonical ray; the
  // already-authored Pack 2 sloped-water hit always competes at true distance.
  const pack3Target=world?.pack3Runtime?.size?.()>0?
    world.pack3Runtime.target(eye,direction,maxDistance):null;
  const manual14Target=world?.manual14Layer?.size?.()>0?
    world.manual14Layer.target(eye,direction,maxDistance):null;
  const overlay=!pack3Target?manual14Target:
    !manual14Target?pack3Target:
    pack3Target.distance<=manual14Target.distance?pack3Target:manual14Target;
  const withPhysical=base=>{
    if(!overlay||(base&&base.distance<=overlay.distance+1e-8))return base;
    return {hit:overlay.cell,adjacent:overlay.normal.some(Boolean)?
      overlay.cell.map((v,i)=>v+overlay.normal[i]):null,distance:overlay.distance};
  };
  if(world?.biomeCellCount>0||world?.pack2Cells?.size>0){
    // Mixed physical catalogs: one box-accurate collision ray for all legacy,
    // manual solids and registered biome130 shapes. Static clear-rill water
    // has a sloped surface and is ray-tested separately by exact triangles.
    const solid=raycastShapes(eye,direction,(x,y,z)=>{
      const id=world.get(x,y,z);
      if(id===BLOCK.AIR||id===76)return null;
      if(isPack2LiveId(id))
        return {boxes:pack2ShapeOf(id,world.getPack2State(x,y,z)).boxes};
      if(isBiome130BlockId(id))
        return {boxes:biome130Block(id,world.rotationAt?.(x,y,z)??0).boxes};
      return FULL_CUBE;
    },maxDistance);
    let nearestWater=null;
    if(world?.pack2Cells?.size){
      const unit=direction.map(v=>v/len),cell=eye.map(Math.floor);
      const step=unit.map(Math.sign);
      const tDelta=unit.map(v=>v===0?Infinity:Math.abs(1/v));
      const tMax=unit.map((v,i)=>v===0?Infinity:
        ((v>0?cell[i]+1:cell[i])-eye[i])/v);
      for(let i=0;i<Math.ceil(maxDistance*3)+6;i++){
        if(world.get(...cell)===76){
          const hit=pack2RayHit(76,world.getPack2State(...cell),eye,unit,cell,maxDistance);
          if(hit&&(!nearestWater||hit.distance<nearestWater.distance)){
            const normal=hit.normal||[0,0,0],axis=normal.reduce(
              (best,v,j)=>Math.abs(v)>Math.abs(normal[best])?j:best,0);
            const offset=[0,0,0];
            if(Math.abs(normal[axis])>1e-7)offset[axis]=Math.sign(normal[axis]);
            nearestWater={hit:[...cell],adjacent:offset.some(Boolean)?
              cell.map((v,j)=>v+offset[j]):null,distance:hit.distance};
          }
        }
        const next=Math.min(...tMax);
        if(!Number.isFinite(next)||next>maxDistance+1e-9)break;
        for(let axis=0;axis<3;axis++)if(tMax[axis]<=next+1e-9){
          cell[axis]+=step[axis];tMax[axis]+=tDelta[axis];
        }
      }
    }
    const solidResult=solid?{hit:solid.cell,adjacent:solid.normal.some(Boolean)?
      solid.cell.map((v,i)=>v+solid.normal[i]):null,distance:solid.distance}:null;
    return withPhysical(nearestWater&&(!solidResult||nearestWater.distance<solidResult.distance)?
      nearestWater:solidResult);
  }
  const dir=direction.map(v=>v/len),cell=eye.map(Math.floor);
  const step=dir.map(v=>Math.sign(v));
  const tDelta=dir.map(v=>v===0?Infinity:Math.abs(1/v));
  const tMax=dir.map((v,i)=>{
    if(v===0)return Infinity;
    return ((v>0?cell[i]+1:cell[i])-eye[i])/v;
  });
  let previous=null,distance=0;
  const epsilon=1e-9;
  for(let i=0;i<Math.ceil(maxDistance*3)+5;i++){
    if(world.get(cell[0],cell[1],cell[2])!==BLOCK.AIR){
      return withPhysical({hit:[...cell],adjacent:previous,distance});
    }
    const next=Math.min(...tMax);
    if(!Number.isFinite(next)||next>maxDistance+epsilon)return withPhysical(null);
    previous=[...cell];distance=Math.max(0,next);
    // Traverse touching grid planes together so an edge hit cannot select a phantom cell.
    for(let axis=0;axis<3;axis++){
      if(tMax[axis]<=next+epsilon){
        cell[axis]+=step[axis];
        tMax[axis]+=tDelta[axis];
      }
    }
  }
  return withPhysical(null);
}
export function outlineVertices(cell,color=[.81,.91,.63]){
  if(!Array.isArray(cell)||cell.length!==3||!cell.every(Number.isInteger))return new Float32Array();
  const [x,y,z]=cell,e=.004;
  const segments=[
    [0,0,0,1,0,0],[0,1,0,1,1,0],[0,0,1,1,0,1],[0,1,1,1,1,1],
    [0,0,0,0,1,0],[1,0,0,1,1,0],[0,0,1,0,1,1],[1,0,1,1,1,1],
    [0,0,0,0,0,1],[1,0,0,1,0,1],[0,1,0,0,1,1],[1,1,0,1,1,1]
  ];
  const result=[];
  for(const segment of segments){
    for(let i=0;i<6;i+=3){
      const p=segment.slice(i,i+3).map((v,j)=>cell[j]+v+(v===0?-e:e));
      result.push(...p,...color,0,0,1);
    }
  }
  return new Float32Array(result);
}
// Exact player-sized axis-aligned bounds against every intersecting voxel.
// Sampling only three body heights missed low ceilings and thin corner contacts.
export const BODY_RADIUS=.28;
export const BODY_HEIGHT=1.78;
export function collides(world,x,feet,z){
  if(![x,feet,z].every(Number.isFinite))return true;
  const e=1e-5;
  for(let bx=Math.floor(x-BODY_RADIUS+e);bx<=Math.floor(x+BODY_RADIUS-e);bx++)
    for(let bz=Math.floor(z-BODY_RADIUS+e);bz<=Math.floor(z+BODY_RADIUS-e);bz++)
      for(let by=Math.floor(feet+e);by<=Math.floor(feet+BODY_HEIGHT-e);by++)
        {
          const id=world.get(bx,by,bz);
          if(id===BLOCK.AIR)continue;
          if(isPack2LiveId(id)){
            const state=world.getPack2State?.(bx,by,bz);
            if(!state)throw Error('Pack 2 collision lacks real state');
            if(pack2BodyIntersects(id,state,[bx,by,bz],
              {x,z,feet,radius:BODY_RADIUS,height:BODY_HEIGHT}))return true;
            continue;
          }
          if(!isBiome130BlockId(id))return true;
          const asset=biome130Block(id,world.rotationAt?.(bx,by,bz)??0);
          if(!asset.solid)continue;
          for(const box of asset.boxes){
            if(x+BODY_RADIUS>bx+box[0]+e&&x-BODY_RADIUS<bx+box[3]-e&&
               feet+BODY_HEIGHT>by+box[1]+e&&feet<by+box[4]-e&&
               z+BODY_RADIUS>bz+box[2]+e&&z-BODY_RADIUS<bz+box[5]-e)return true;
          }
        }
  // Additional source-owned, seed-bound physical overlays are additive; never
  // treat passable biome130 plants or Pack 2 water as solid full cubes.
  const body=[x-BODY_RADIUS,feet,z-BODY_RADIUS,x+BODY_RADIUS,feet+BODY_HEIGHT,z+BODY_RADIUS];
  if(world?.pack3Runtime?.size?.()>0 && !world.pack3Runtime.playerFits(body).fits)return true;
  if(typeof world?.manual14Collision==='function'&&world.manual14Collision(body))return true;
  if(typeof world?.pack5Collision==='function'&&world.pack5Collision(body))return true;
  return false;
}
