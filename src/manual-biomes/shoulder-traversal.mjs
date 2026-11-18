// MYTHWROUGHT manual M3: read-only physical Desert shoulder route witness.
// This is not auto-terraforming, autopilot, an NPC or an exploration reveal.
// Uses the SAME per-voxel AABB collider as real player movement, honors
// naturally protected caves/landmarks, and never writes world, maps or saves.
import {BLOCK,collides} from '../voxel.mjs';
import {WORLD_MAX_Y} from '../depth.mjs';
import {surfaceBiomeAt} from '../surface-regions/regions.mjs';
import {STEP_HEIGHT,GROUND_PROBE} from '../physics.mjs';

const key=(x,z)=>x+','+z;
const NEIGHBORS=Object.freeze([[1,0],[0,1],[0,-1],[-1,0]]);
export function walkableSurfaceCell(world,x,z,{
  maxY=WORLD_MAX_Y+1,minY=0
}={}){
  if(typeof world?.get!=='function'||![x,z,maxY,minY].every(Number.isInteger)||
     maxY>WORLD_MAX_Y+1||minY<0||minY>maxY)
    throw Error('Invalid read-only physical shoulder witness');
  const px=x+.5,pz=z+.5;
  // Ground is a real supporting AABB with genuine 1.8m body clearance;
  // partial Pack2, shaped biome blocks and collision owners remain honored.
  for(let feet=maxY;feet>=minY;feet--){
    if(world.get(x,feet-1,z)===BLOCK.AIR)continue;
    if(!collides(world,px,feet,pz)&&
       collides(world,px,feet-GROUND_PROBE,pz)){
      return Object.freeze({x,z,feet,support:world.get(x,feet-1,z)});
    }
  }
  return null;
}
function physicalEdge(world,a,b){
  const rise=b.feet-a.feet;
  if(rise>STEP_HEIGHT||rise<-1.01)return false;
  const x=(a.x+b.x)/2+.5,z=(a.z+b.z)/2+.5;
  const y=Math.max(a.feet,b.feet)+.002;
  // AABB sweep midpoint: test the space THROUGH which the body moves,
  // not just an attractive floor-height discontinuity map.
  return !collides(world,x,y,z)&&
    !collides(world,b.x+.5,b.feet+.002,b.z+.5);
}
/** Proof of an actually walkable route from the Desert interior to its
 * unprofiled shoulder. Bounded BFS traverses full block cells and never
 * edits a cliff or treats debug teleport as a walking witness.
 * If no safe path exists, return a failure report: DO NOT carve terrain.
 */
export function traceDesertShoulder(world,{seed=179,xMin=617,xMax=691,
  zMin=-43,zMax=43,startX=620,finishX=677,
  minStartWeight=.62,maxFinishWeight=.24,maxVisited=8000}={}){
  if(!Number.isInteger(seed)||!Number.isInteger(startX)||
     !Number.isInteger(finishX)||![xMin,xMax,zMin,zMax,maxVisited].every(Number.isInteger)||
     xMax<xMin||zMax<zMin||startX<xMin||finishX>xMax||
     maxVisited<1||maxVisited>25000||
     !(minStartWeight>.35&&minStartWeight<=1)||
     !(maxFinishWeight>=0&&maxFinishWeight<.35))
    throw Error('Unsafe or unbounded shoulder-walk proof');
  const tiles=new Map(),predecessors=new Map(),queue=[];
  let unsafeCells=0;
  const sample=(x,z)=>{
    const k=key(x,z);
    if(tiles.has(k))return tiles.get(k);
    const tile=walkableSurfaceCell(world,x,z),weight=surfaceBiomeAt(x,z,seed)?.name==='desert'?
      surfaceBiomeAt(x,z,seed)?.weight??0:0;
    const result=tile?Object.freeze({...tile,weight}):null;
    tiles.set(k,result);if(!result)unsafeCells++;
    return result;
  };
  for(let z=zMin;z<=zMax;z++){
    const t=sample(startX,z);
    if(!t||t.weight<minStartWeight)continue;
    queue.push(t);predecessors.set(key(t.x,t.z),null);
  }
  let end=null,head=0;
  while(head<queue.length&&head<maxVisited){
    const cur=queue[head++];
    if(cur.x>=finishX&&cur.weight<=maxFinishWeight){
      end=cur;break;
    }
    for(const [dx,dz] of NEIGHBORS){
      const x=cur.x+dx,z=cur.z+dz,k=key(x,z);
      if(x<xMin||x>xMax||z<zMin||z>zMax||
         predecessors.has(k))continue;
      const t=sample(x,z);
      if(!t||!physicalEdge(world,cur,t))continue;
      predecessors.set(k,key(cur.x,cur.z));queue.push(t);
    }
  }
  if(!end)return Object.freeze({ok:false,reason:'No naturally walkable Desert shoulder crossing',
    inspected:head,unsafeCells,withoutTerrainEdits:true});
  const path=[];let at=key(end.x,end.z);
  while(at!==null){
    const t=tiles.get(at);
    if(!t)throw Error('Read-only path parent missing');
    path.push(t);at=predecessors.get(at);
  }
  path.reverse();
  if(path[0]?.weight<minStartWeight||path.at(-1)?.weight>maxFinishWeight)
    throw Error('Traversal proof has invalid region boundary');
  for(let i=1;i<path.length;i++)
    if(!physicalEdge(world,path[i-1],path[i]))
      throw Error('Traversal proof has a blocked physical step');
  return Object.freeze({
    ok:true,seed,start:Object.freeze({...path[0]}),
    end:Object.freeze({...path.at(-1)}),
    // Copy positions and measured collidable feet only. No world mutation.
    path:Object.freeze(path.map(t=>Object.freeze({...t}))),
    maxStep:Math.max(0,...path.slice(1).map((t,i)=>
      Math.abs(t.feet-path[i].feet))),
    inspected:head,unsafeCells,withoutTerrainEdits:true
  });
}
