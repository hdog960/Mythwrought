// MYTHWROUGHT v0.07: deterministic editable voxel terrain with world-coherent chunk edges.
import {meadowAccentVertices} from './meadow.mjs';
import {storybookGroveVertices} from './grove.mjs';
import {woodlandCanopyVertices} from './canopy.mjs';
import {grottoAccentVertices} from './grotto.mjs';
import {caveRuneVertices} from './cave-runes.mjs';
import {waystoneVertices} from './waystones.mjs';
// This is an engineering prototype, not the finished game's terrain art or save system.
export const CHUNK_SIZE = 16;
export const WORLD_MIN_Y = -3;
export const WORLD_MAX_Y = 19;
export const BLOCK = Object.freeze({ AIR:0, GRASS:1, DIRT:2, STONE:3, WOOD:4, CRYSTAL:5, ORE:6 });
const COLORS = {
  1:[0.35,0.64,0.32], 2:[0.48,0.34,0.24], 3:[0.48,0.51,0.55],
  4:[0.60,0.39,0.23], 5:[0.36,0.79,0.92], 6:[0.70,0.58,0.33]
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
  if(y<WORLD_MIN_Y||y>WORLD_MAX_Y)return BLOCK.AIR;
  const h=terrainHeight(x,z,seed);
  if(y>h)return BLOCK.AIR;
  if(y<=WORLD_MIN_Y+1)return BLOCK.STONE;
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
  }
  get(x,y,z){
    const key=worldKey(x,y,z);
    return this.edits.has(key)?this.edits.get(key):baseBlock(x,y,z,this.seed);
  }
  set(x,y,z,id){
    if(![x,y,z,id].every(Number.isInteger)||y<WORLD_MIN_Y||y>WORLD_MAX_Y||id<0||id>6)return false;
    const key=worldKey(x,y,z);
    if(baseBlock(x,y,z,this.seed)===id)this.edits.delete(key);
    else this.edits.set(key,id);
    return true;
  }
  save(){
    const edits=[...this.edits.entries()].map(([k,id])=>[...k.split(',').map(Number),id]);
    edits.sort((a,b)=>a[0]-b[0]||a[1]-b[1]||a[2]-b[2]);
    return {schema:1,seed:this.seed,edits};
  }
  static restore(payload){
    if(!payload||payload.schema!==1||!Number.isInteger(payload.seed)||payload.seed!==(payload.seed|0)||!Array.isArray(payload.edits)||payload.edits.length>300000)throw Error('Unsupported or invalid Mythwrought save');
    const world=new VoxelWorld(payload.seed);
    for(const row of payload.edits){
      if(!Array.isArray(row)||row.length!==4||!world.set(...row))throw Error('Save contains invalid voxel edit');
    }
    return world;
  }
}
export function meshChunk(world,cx,cz){
  const vertices=[];
  for(let x=cx*CHUNK_SIZE;x<(cx+1)*CHUNK_SIZE;x++)
    for(let z=cz*CHUNK_SIZE;z<(cz+1)*CHUNK_SIZE;z++)
      for(let y=WORLD_MIN_Y;y<=WORLD_MAX_Y;y++){
        const id=world.get(x,y,z);
        if(id===BLOCK.AIR)continue;
        const color=COLORS[id]||COLORS[3];
        // Most underground voxels are fully enclosed. Defer the two noise
        // samples and tint calculation until the FIRST exposed face; otherwise
        // a solid chunk pays for shading thousands of invisible blocks.
        // Keep world-space inputs and face order identical for save/seed parity.
        let variance;
        for(const face of FACE){
          if(world.get(x+face.d[0],y+face.d[1],z+face.d[2])!==BLOCK.AIR)continue;
          if(variance===undefined)variance=.90+noise(x/9,z/9,world.seed+91)*.14+
            hash(x+y*5,z-y*3,world.seed+91)*.08;
          const r=clamp(color[0]*variance*face.lit,0,1);
          const g=clamp(color[1]*variance*face.lit,0,1);
          const b=clamp(color[2]*variance*face.lit,0,1);
          for(const k of [0,1,2,0,2,3]){
            const p=face.q[k],uv=FACE_UV[k];
            vertices.push(x+p[0],y+p[1],z+p[2],r,g,b,uv[0],uv[1],id);
          }
        }
      }
  // Decorative meadows are purely rendered geometry anchored to the current
  // grass voxel. They never enter world.get(), raycasts, collisions or saves.
  // Crucially, they piggyback the existing chunk buffer and mesh invalidation.
  const grove=storybookGroveVertices(world,cx,cz,{
    chunkSize:CHUNK_SIZE,heightAt:terrainHeight,baseAt:baseBlock,
    grass:BLOCK.GRASS,air:BLOCK.AIR
  });
  const canopy=woodlandCanopyVertices(world,cx,cz,{
    chunkSize:CHUNK_SIZE,heightAt:terrainHeight,baseAt:baseBlock,
    grass:BLOCK.GRASS,air:BLOCK.AIR
  });
  const meadow=meadowAccentVertices(world,cx,cz,{
    chunkSize:CHUNK_SIZE,heightAt:terrainHeight,grass:BLOCK.GRASS,air:BLOCK.AIR
  });
  // Underground mushrooms and crystal tips reuse this SAME chunk mesh and
  // existing edit invalidation; no physics, lighting pass or persisted blocks.
  const grotto=grottoAccentVertices(world,cx,cz,{
    chunkSize:CHUNK_SIZE,minY:WORLD_MIN_Y,maxY:WORLD_MAX_Y,
    heightAt:terrainHeight,baseAt:baseBlock,
    air:BLOCK.AIR,stone:BLOCK.STONE,ore:BLOCK.ORE
  });
  const runes=caveRuneVertices(world,cx,cz,{
    chunkSize:CHUNK_SIZE,minY:WORLD_MIN_Y,maxY:WORLD_MAX_Y,
    heightAt:terrainHeight,baseAt:baseBlock,
    air:BLOCK.AIR,stone:BLOCK.STONE,ore:BLOCK.ORE
  });
  const waystones=waystoneVertices(world,cx,cz,{chunkSize:CHUNK_SIZE,heightAt:terrainHeight,baseAt:baseBlock,grass:BLOCK.GRASS,air:BLOCK.AIR});
  const solid=new Float32Array(vertices);
  if(!canopy.length&&!grove.length&&!meadow.length&&!grotto.length&&!runes.length&&!waystones.length)return solid;
  const combined=new Float32Array(solid.length+canopy.length+grove.length+meadow.length+runes.length+grotto.length+waystones.length);
  combined.set(solid);combined.set(canopy,solid.length);
  combined.set(grove,solid.length+canopy.length);
  combined.set(meadow,solid.length+canopy.length+grove.length);
  combined.set(runes,solid.length+canopy.length+grove.length+meadow.length);
  // Existing meadow and grotto tail positions retain their regression invariants.
  combined.set(grotto,solid.length+canopy.length+grove.length+meadow.length+runes.length);
  combined.set(waystones,combined.length-waystones.length);
  return combined;
}
// Exact voxel grid traversal: consistent selection through chunk borders and negative space.
// Start at the eye point, traverse each crossed cell, and preserve the adjacent empty cell
// so placement and removal share the same pixel-accurate targeting rule.
export function raycast(world,eye,direction,maxDistance=7){
  if(!Array.isArray(eye)||!Array.isArray(direction)||eye.length!==3||direction.length!==3||
     ![...eye,...direction,maxDistance].every(Number.isFinite)||maxDistance<0)return null;
  const len=Math.hypot(...direction);
  if(len<1e-9)return null;
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
      return {hit:[...cell],adjacent:previous,distance};
    }
    const next=Math.min(...tMax);
    if(!Number.isFinite(next)||next>maxDistance+epsilon)return null;
    previous=[...cell];distance=Math.max(0,next);
    // Traverse touching grid planes together so an edge hit cannot select a phantom cell.
    for(let axis=0;axis<3;axis++){
      if(tMax[axis]<=next+epsilon){
        cell[axis]+=step[axis];
        tMax[axis]+=tDelta[axis];
      }
    }
  }
  return null;
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
        if(world.get(bx,by,bz)!==BLOCK.AIR)return true;
  return false;
}
