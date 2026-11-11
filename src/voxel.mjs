// MYTHWROUGHT v0.01: deterministic, editable, dependency-free voxel foundation.
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
    if(!payload||payload.schema!==1||!Number.isInteger(payload.seed)||!Array.isArray(payload.edits)||payload.edits.length>300000)throw Error('Unsupported or invalid Mythwrought save');
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
        const variance=.93+hash(x+y*5,z-y*3,world.seed+91)*.14;
        for(const face of FACE){
          if(world.get(x+face.d[0],y+face.d[1],z+face.d[2])!==BLOCK.AIR)continue;
          for(const k of [0,1,2,0,2,3]){
            const p=face.q[k];
            vertices.push(x+p[0],y+p[1],z+p[2],...color.map(c=>clamp(c*variance*face.lit,0,1)));
          }
        }
      }
  return new Float32Array(vertices);
}
export function raycast(world,eye,direction,maxDistance=7){
  let lastKey=null,previous=null;
  const count=Math.ceil(maxDistance/.035);
  for(let i=0;i<=count;i++){
    const t=i*.035;
    const x=Math.floor(eye[0]+direction[0]*t);
    const y=Math.floor(eye[1]+direction[1]*t);
    const z=Math.floor(eye[2]+direction[2]*t);
    const k=worldKey(x,y,z);
    if(k===lastKey)continue;
    lastKey=k;
    if(world.get(x,y,z)!==BLOCK.AIR)return {hit:[x,y,z],adjacent:previous,distance:t};
    previous=[x,y,z];
  }
  return null;
}
export function collides(world,x,feet,z){
  for(const xx of [x-.25,x+.25])for(const zz of [z-.25,z+.25])
    for(const yy of [feet+.06,feet+.90,feet+1.60]){
      if(world.get(Math.floor(xx),Math.floor(yy),Math.floor(zz))!==BLOCK.AIR)return true;
    }
  return false;
}
