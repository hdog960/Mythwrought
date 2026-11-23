// Isolated Phase 2 source-proof helper: deterministic bounded search of REAL
// original M7 standing positions near warped Enchanted climate borders.
// Read-only. No synthetic terrain, movement shortcuts, edited voxels, new
// save identity, production routing, or persistent cross-chunk caches.
// A path returned here is ONLY a geometric proposal. Callers MUST admit it
// with unchanged original stepPlayer before using it as gameplay evidence.
import {BLOCK,BODY_RADIUS,BODY_HEIGHT,collides} from '../voxel.mjs';
import {GROUND_PROBE,STEP_HEIGHT} from '../physics.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';

const key=(x,z)=>x+','+z;
const directions=Object.freeze([
  Object.freeze([1,0]),Object.freeze([0,1]),Object.freeze([-1,0]),
  Object.freeze([0,-1]),Object.freeze([1,1]),Object.freeze([-1,1]),
  Object.freeze([-1,-1]),Object.freeze([1,-1])
]);
export const ENCHANTED_ORIGINAL_PATH_MAX_VISITS=384;
export const ENCHANTED_ORIGINAL_PATH_MAX_RADIUS=16;
export const ENCHANTED_ORIGINAL_PATH_MAX_STEPS=32;
export const ENCHANTED_ORIGINAL_PATH_MAX_ROUTES=4;

export function originalM7PedestrianCap(world,x,z){
  if(!world||typeof world._columnPlan!=='function'||
     typeof world._environmentBaseline!=='function'||
     !Number.isSafeInteger(x)||!Number.isSafeInteger(z))
    throw Error('Invalid original M7 standing sample');
  const col=world._columnPlan(x,z);
  if(!col?.size)return null;
  const surface=Math.max(...col.keys());
  if(surface<3||surface>WORLD_MAX_Y-3)return null;
  const source=(y)=>col.get(y)??world._environmentBaseline(x,y,z);
  // A roof, known cave/landmark or overhang does not become a fabricated
  // walking floor. Require genuine original source cap AND two clear
  // player-height air layers before performing original AABB collision.
  if(source(surface)===BLOCK.AIR||
     source(surface+1)!==BLOCK.AIR||
     source(surface+2)!==BLOCK.AIR)return null;
  const px=x+.5,pz=z+.5,feet=surface+1;
  if(world.get(x,surface,z)===BLOCK.AIR||
     collides(world,px,feet,pz)||
     !collides(world,px,feet-GROUND_PROBE,pz))return null;
  return Object.freeze({x,z,surface,feet});
}
function sourceBiome(x,z,seed){
  return v6BiomeAt(x,z,seed)?.name??'plains';
}
function reconstruct(end,parents,nodes){
  const path=[];
  for(let current=end;current!==null;current=parents.get(current)??null)
    path.push(nodes.get(current));
  return path.reverse();
}
export function searchOriginalM7PedestrianBorder(world,{
  seed=world?.seed, x,z, targetBiome=null,
  radius=12,maxVisits=ENCHANTED_ORIGINAL_PATH_MAX_VISITS,
  maxSteps=ENCHANTED_ORIGINAL_PATH_MAX_STEPS,
  minDisplacement=5,maxRoutes=ENCHANTED_ORIGINAL_PATH_MAX_ROUTES
}={}){
  if(!Number.isInteger(seed)||seed!==(seed|0)||
     seed!==world?.seed||!Number.isSafeInteger(x)||!Number.isSafeInteger(z)||
     !Number.isInteger(radius)||radius<1||radius>ENCHANTED_ORIGINAL_PATH_MAX_RADIUS||
     !Number.isInteger(maxVisits)||maxVisits<1||maxVisits>ENCHANTED_ORIGINAL_PATH_MAX_VISITS||
     !Number.isInteger(maxSteps)||maxSteps<1||maxSteps>ENCHANTED_ORIGINAL_PATH_MAX_STEPS||
     !Number.isInteger(minDisplacement)||minDisplacement<1||minDisplacement>radius*2||
     !Number.isInteger(maxRoutes)||maxRoutes<1||maxRoutes>ENCHANTED_ORIGINAL_PATH_MAX_ROUTES||
     targetBiome!==null&&(typeof targetBiome!=='string'||targetBiome==='enchanted'&&
       sourceBiome(x,z,seed)==='enchanted'))
    throw Error('Invalid original M7 bounded pedestrian path query');
  const startBiome=sourceBiome(x,z,seed);
  const start=originalM7PedestrianCap(world,x,z);
  const stats={sourceBiome:startBiome,targetBiome,seed,origin:[x,z],
    radius,maxVisits,maxSteps,minDisplacement,visited:0,supported:0,
    rejectedGround:0,rejectedHeight:0,rejectedCorner:0,
    rejectedSweep:0,proposals:0,truncated:false};
  if(!start)return {routes:[],stats:{...stats,startSupported:false}};
  const nodes=new Map([[key(x,z),start]]);
  const parents=new Map([[key(x,z),null]]);
  const depths=new Map([[key(x,z),0]]);
  const queue=[key(x,z)],routes=[];
  const sampled=new Map([[key(x,z),start]]);
  const ground=(a,b)=>{
    const k=key(a,b);
    if(sampled.has(k))return sampled.get(k);
    const support=originalM7PedestrianCap(world,a,b);
    sampled.set(k,support);return support;
  };
  for(let cursor=0;cursor<queue.length&&cursor<maxVisits;cursor++){
    const at=queue[cursor],here=nodes.get(at),d=depths.get(at);
    stats.visited++;
    const biome=sourceBiome(here.x,here.z,seed);
    // Require a meaningful spatial crossing, not a one-voxel border
    // change. A short target reached earlier may not be revisited by BFS.
    if(d>0&&Math.hypot(here.x-x,here.z-z)>=minDisplacement&&
       biome!==startBiome&&
       (startBiome==='enchanted'||biome==='enchanted')&&
       (targetBiome===null||biome===targetBiome)){
      routes.push(reconstruct(at,parents,nodes));
      stats.proposals++;
      if(routes.length>=maxRoutes)break;
    }
    if(d>=maxSteps)continue;
    for(const [dx,dz] of directions){
      const a=here.x+dx,b=here.z+dz,id=key(a,b);
      if(nodes.has(id))continue;
      if(Math.abs(a-x)>radius||Math.abs(b-z)>radius)continue;
      const next=ground(a,b);
      if(!next){stats.rejectedGround++;continue;}
      if(Math.abs(next.feet-here.feet)>Math.min(1,STEP_HEIGHT)){
        stats.rejectedHeight++;continue;
      }
      // Prevent 8-neighbor graph from cutting through original walls.
      // Orthogonal cells MUST both genuinely support the full original body.
      if(dx&&dz){
        const sideA=ground(here.x+dx,here.z);
        const sideB=ground(here.x,here.z+dz);
        if(!sideA||!sideB||
           Math.abs(sideA.feet-here.feet)>1||
           Math.abs(sideB.feet-here.feet)>1){
          stats.rejectedCorner++;continue;
        }
      }
      // Conservative six samples across this one-block segment use the
      // real original collider at the higher foot elevation, never a
      // synthetic swept AABB. Actual gravity/stepping is independently
      // checked with the unchanged stepPlayer by the caller.
      let clear=true;
      for(const t of [.16,.33,.5,.67,.84,1]){
        const px=here.x+.5+dx*t,pz=here.z+.5+dz*t;
        if(collides(world,px,Math.max(here.feet,next.feet),pz)){
          clear=false;break;
        }
      }
      if(!clear){stats.rejectedSweep++;continue;}
      nodes.set(id,next);parents.set(id,at);depths.set(id,d+1);
      queue.push(id);stats.supported++;
    }
  }
  stats.truncated=queue.length>maxVisits;
  return {routes,stats};
}
