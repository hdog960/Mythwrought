// MYTHWROUGHT manual M5: fail-closed spawn-to-biome walking audit.
// Never teleports, paints fake roads, digs protected terrain, changes a save,
// alters a biome generator, or marks an unexplored minimap cell as visited.
// Paths are found over actual Pack2LiveWorld collision cells and then replayed
// by the existing production stepPlayer. Negative results are hard blockers.
import {BLOCK,collides} from '../voxel.mjs';
import {newPlayer,stepPlayer,STEP_HEIGHT,GROUND_PROBE,COYOTE_TIME}
  from '../physics.mjs';
import {walkableSurfaceCell} from './shoulder-traversal.mjs';
import {SURFACE_BIOME_REGIONS,surfaceBiomeAt} from '../surface-regions/regions.mjs';

const OFFSETS=Object.freeze([[1,0],[0,1],[-1,0],[0,-1]]);
const key=(x,z)=>x+','+z;
const distance=(x,z,a,b)=>Math.hypot(x-a,z-b);
const TARGETS=Object.freeze(SURFACE_BIOME_REGIONS.map(b=>Object.freeze({
  name:b.name,x:b.x,z:b.z
})));
export const M5_OVERLAND_TARGETS=TARGETS;
export const M5_ROUTE_RULES=Object.freeze({
  goalRadius:22,minBiomeWeight:.72,detourRadius:160,
  maxVisited:70000,maxSampled:120000
});
class MinQueue {
  a=[];
  push(item){
    const a=this.a;let i=a.length;a.push(item);
    while(i){const p=(i-1)>>1;if(a[p].f<=item.f)break;
      a[i]=a[p];i=p;}a[i]=item;
  }
  pop(){
    const a=this.a,top=a[0],last=a.pop();
    if(a.length){
      let i=0;while(true){
        const l=i*2+1;if(l>=a.length)break;
        const r=l+1,j=r<a.length&&a[r].f<a[l].f?r:l;
        if(a[j].f>=last.f)break;a[i]=a[j];i=j;
      }a[i]=last;
    }
    return top;
  }
  get length(){return this.a.length}
}
function validSupport(world,src,dst){
  if(!src||!dst)return false;
  const rise=dst.feet-src.feet;
  if(rise>STEP_HEIGHT||rise<-(STEP_HEIGHT+.08))return false;
  const midX=(src.x+dst.x)/2+.5,midZ=(src.z+dst.z)/2+.5;
  const ceiling=Math.max(src.feet,dst.feet)+.002;
  if(collides(world,midX,ceiling,midZ)||
     collides(world,dst.x+.5,dst.feet+.002,dst.z+.5))
    return false;
  return true;
}
function offsetToSegment(x,z,ax,az,bx,bz){
  const dx=bx-ax,dz=bz-az,len=dx*dx+dz*dz;
  const t=len===0?0:Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/len));
  return distance(x,z,ax+t*dx,az+t*dz);
}
/** Search is read-only, deterministic and bounded. A path exists ONLY if
 * every tile has an authentic 1.78m AABB clear body and floor collision,
 * every neighbor crosses an actual collider-clear midpoint, and the goal
 * enters the requested biome at sufficient genuine generation weight.
 * No debug teleport or artificial straight-line route may qualify.
 */
export function planM5NaturalOverland(world,{
  seed=179,target,goalRadius=M5_ROUTE_RULES.goalRadius,
  detourRadius=M5_ROUTE_RULES.detourRadius,
  maxVisited=M5_ROUTE_RULES.maxVisited,
  maxSampled=M5_ROUTE_RULES.maxSampled
}={}){
  if(!world||typeof world.get!=='function'||world.seed!==seed)
    throw Error('M5 route must use exact active authoritative world/seed');
  const goal=TARGETS.find(p=>p.name===target);
  if(!goal)throw Error('Unknown manual four-biome target');
  if(![goalRadius,detourRadius,maxVisited,maxSampled].every(Number.isInteger)||
     goalRadius<8||goalRadius>64||detourRadius<8||detourRadius>256||
     maxVisited<1||maxVisited>100000||maxSampled<1||maxSampled>150000)
    throw Error('M5 bounded route parameters invalid');
  const startPlayer=newPlayer(world),sx=Math.floor(startPlayer.x),
    sz=Math.floor(startPlayer.z),sampled=new Map(),queue=new MinQueue(),
    predecessor=new Map(),bestCost=new Map(),closed=new Set();
  let unsafe=0,sampledLimit=false;
  function sample(x,z){
    const id=key(x,z);
    if(sampled.has(id))return sampled.get(id);
    if(sampled.size>=maxSampled){sampledLimit=true;return null;}
    // Reject regions distant from a genuine start→target corridor,
    // but allow a wide detour around ordinary cliffs/landmarks.
    if(offsetToSegment(x,z,sx,sz,goal.x,goal.z)>detourRadius){
      sampled.set(id,null);unsafe++;return null;
    }
    const cell=walkableSurfaceCell(world,x,z);
    sampled.set(id,cell);if(!cell)unsafe++;
    return cell;
  }
  const start=sample(sx,sz);
  if(!start)return Object.freeze({
    ok:false,target,reason:'No authentic collidable spawn tile',
    sampled:sampled.size,visited:0,unsafe,withoutTerrainEdits:true
  });
  const targetDist=(cell)=>distance(cell.x,cell.z,goal.x,goal.z);
  let destination=null,iterations=0,closest=null;
  const id0=key(sx,sz);
  bestCost.set(id0,0);predecessor.set(id0,null);
  queue.push({x:sx,z:sz,f:targetDist(start),g:0});
  while(queue.length&&iterations<maxVisited&&!sampledLimit){
    const current=queue.pop(),id=key(current.x,current.z);
    if(closed.has(id)||current.g>bestCost.get(id)+1e-6)continue;
    closed.add(id);iterations++;
    const tile=sample(current.x,current.z);
    if(!tile)continue;
    const remaining=targetDist(tile);
    if(!closest||remaining<closest.distanceToTarget)
      closest={x:tile.x,z:tile.z,feet:tile.feet,distanceToTarget:remaining};
    const r=surfaceBiomeAt(tile.x,tile.z,seed);
    if(targetDist(tile)<=goalRadius&&r?.name===target&&
       r.weight>=M5_ROUTE_RULES.minBiomeWeight){
      destination=tile;break;
    }
    for(const [dx,dz] of OFFSETS){
      const x=tile.x+dx,z=tile.z+dz,n=key(x,z);
      if(closed.has(n)||sampledLimit)continue;
      const next=sample(x,z);
      if(!validSupport(world,tile,next))continue;
      const step=1+Math.max(0,next.feet-tile.feet)*.25;
      const cost=current.g+step;
      if(cost>= (bestCost.get(n)??Infinity))continue;
      bestCost.set(n,cost);predecessor.set(n,id);
      queue.push({x,z,g:cost,f:cost+targetDist(next)});
    }
  }
  if(!destination)return Object.freeze({
    ok:false,target,reason:sampledLimit?
      'Natural route search reached hard sample limit':
      iterations>=maxVisited?'Natural route search reached hard visit limit':
      'No natural walkable route to biome',
    from:{x:sx,z:sz,feet:start.feet},toward:{x:goal.x,z:goal.z},
    visited:iterations,sampled:sampled.size,unsafe,closest,
    withoutTerrainEdits:true,needActualGameWalk:true
  });
  const path=[];let at=key(destination.x,destination.z);
  while(at!==null){const cell=sampled.get(at);
    if(!cell)throw Error('Route contains an unsampled invented tile');
    path.push({...cell});at=predecessor.get(at);
  }
  path.reverse();
  for(let i=1;i<path.length;i++){
    if(Math.abs(path[i].x-path[i-1].x)+Math.abs(path[i].z-path[i-1].z)!==1||
       !validSupport(world,path[i-1],path[i]))
      throw Error('Route reconstruction contains a fake or blocked step');
  }
  return Object.freeze({
    ok:true,target,seed,
    start:{x:start.x,z:start.z,feet:start.feet},
    end:{x:destination.x,z:destination.z,feet:destination.feet},
    path:Object.freeze(path.map(p=>Object.freeze(p))),
    visited:iterations,sampled:sampled.size,unsafe,
    withoutTerrainEdits:true,needActualGameWalk:true
  });
}
/** Replay EVERY one-cell route leg using the actual grounded production
 * physics, never by setting player.x/y/z to the next route point. This is
 * an accelerated deterministic source witness, NOT a touchscreen test.
 * A route is certified only if the actor reaches its target under stepPlayer.
 */
export function replayM5PhysicalWalk(world,plan,{
  maxFramesPerCell=28,dt=.05,onAdvance=null
}={}){
  if(!plan?.ok||!Array.isArray(plan.path)||!plan.path.length)
    throw Error('Cannot replay an unsuccessful or fabricated route');
  if(!Number.isInteger(maxFramesPerCell)||maxFramesPerCell<4||
     maxFramesPerCell>80||!Number.isFinite(dt)||dt<=0||dt>.05)
    throw Error('Invalid physics replay budget');
  const player=newPlayer(world),first=plan.path[0];
  if(distance(player.x,player.z,first.x+.5,first.z+.5)>.75)
    throw Error('Player did not spawn at route source');
  let frames=0,steps=0;
  for(let i=1;i<plan.path.length;i++){
    const cell=plan.path[i],targetX=cell.x+.5,targetZ=cell.z+.5;
    let reached=false;
    for(let f=0;f<maxFramesPerCell;f++){
      const dx=targetX-player.x,dz=targetZ-player.z,dist=Math.hypot(dx,dz);
      if(dist<=.20){reached=true;break;}
      player.yaw=Math.atan2(dx,dz);
      const response=stepPlayer(world,player,{forward:1,strafe:0,jump:false},dt);
      frames++;
      if(![player.x,player.feet,player.z].every(Number.isFinite)||
         collides(world,player.x,player.feet+.003,player.z))
        return Object.freeze({ok:false,target:plan.target,
          reason:'Actual player penetrated obstacle',step:i,frames,player:{...player}});
      if(response.hitWall&&f===maxFramesPerCell-1)break;
    }
    if(!reached&&distance(player.x,player.z,targetX,targetZ)>.28)
      return Object.freeze({ok:false,target:plan.target,
        reason:'Production stepPlayer could not traverse planned cell',
        step:i,frames,player:{x:player.x,z:player.z,feet:player.feet},
        expected:{x:targetX,z:targetZ,feet:cell.feet}});
    steps++;onAdvance?.({x:player.x,z:player.z,feet:player.feet,step:i});
  }
  const region=surfaceBiomeAt(player.x,player.z,plan.seed);
  const reached=region?.name===plan.target&&
    region.weight>=M5_ROUTE_RULES.minBiomeWeight;
  return Object.freeze({ok:reached,target:plan.target,frames,steps,
    end:{x:player.x,z:player.z,feet:player.feet},
    reason:reached?'Actual production physics reached biome':
      'Player ended outside natural target biome'});
}
