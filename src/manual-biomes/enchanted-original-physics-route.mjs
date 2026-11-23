// ISOLATED Enchanted Phase 2 research: bounded PHYSICS-ADMITTED pedestrian
// route search using unchanged real M7 stepPlayer for *every edge*.
// The earlier source-only BFS is deliberately untouched; its geometry
// proposals are not physics evidence. Here, each queued state carries the
// original player velocity/feet/yaw from all preceding legs. A child is
// admitted only if the unmodified player controller actually reaches it.
// No production invocation, world mutation, save schema, fake floors,
// teleport between route legs, or cross-chunk persistent state.
import {BLOCK,collides} from '../voxel.mjs';
import {GROUND_PROBE,stepPlayer,STEP_HEIGHT} from '../physics.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {originalM7PedestrianCap} from './enchanted-original-pedestrian-search.mjs';

export const ENCHANTED_PHYSICS_ROUTE_LIMITS=Object.freeze({
  radius:16,visits:192,depth:24,routes:3,
  edgeAttempts:512,physicsTicks:8192,edgeTicks:48
});
const moves=Object.freeze([[1,0],[0,1],[-1,0],[0,-1],
  [1,1],[-1,1],[-1,-1],[1,-1]].map(v=>Object.freeze(v)));
const key=(x,z)=>x+','+z;
const climate=(x,z,seed)=>v6BiomeAt(x,z,seed)?.name??'plains';
const playerAt=n=>({x:n.x+.5,z:n.z+.5,feet:n.feet,
  yaw:0,pitch:0,vX:0,vZ:0,vY:0,onGround:true,
  coyote:0,jumpBuffer:0});

// Explicitly clones a full real controller state at branching points.
// This is NOT a teleport in any returned path: the descendant is created
// only by integrating 25ms actual physics ticks from its parent state.
function physicsEdge(world,prior,to,maxTicks){
  const p={...prior};
  const tx=to.x+.5,tz=to.z+.5;
  let ticks=0,stepped=0;
  for(let j=0;j<maxTicks;j++){
    p.yaw=Math.atan2(tx-p.x,tz-p.z);
    const outcome=stepPlayer(world,p,
      {forward:1,strafe:0,jump:false},.025);
    ticks++;
    if(outcome.stepped)stepped++;
    if(outcome.hitWall||outcome.ceiling||
       collides(world,p.x,p.feet,p.z))
      return {ok:false,ticks,reason:'original-collision'};
    if(Math.hypot(p.x-tx,p.z-tz)<=.24)
      return {ok:true,ticks,stepped,player:p};
  }
  return {ok:false,ticks,reason:'original-waypoint-not-reached'};
}
function trace(node){
  const path=[],ticksPerLeg=[];
  for(let at=node;at!==null;at=at.parent){
    path.push(at.ground);
    if(at.edgeTicks!==null)ticksPerLeg.push(at.edgeTicks);
  }
  return {path:path.reverse(),ticksPerLeg:ticksPerLeg.reverse()};
}
export function originalM7PhysicsRouteReplay(world,path,{edgeTicks=48}={}){
  if(!Array.isArray(path)||path.length<1||
     !Number.isInteger(edgeTicks)||edgeTicks<1||
     edgeTicks>ENCHANTED_PHYSICS_ROUTE_LIMITS.edgeTicks)
    throw Error('Invalid original M7 physics route replay');
  const first=path[0];
  const cap=originalM7PedestrianCap(world,first.x,first.z);
  if(!cap||Math.abs(cap.feet-first.feet)>.00001)
    return {ok:false,reason:'source-spawn-not-supported',legs:0,ticks:0};
  let p=playerAt(cap),ticks=0,steps=0;
  for(let i=1;i<path.length;i++){
    const next=path[i],verified=originalM7PedestrianCap(world,next.x,next.z);
    if(!verified||Math.abs(next.feet-verified.feet)>.00001)
      return {ok:false,reason:'original-ground-changed',legs:i-1,ticks};
    if(Math.max(Math.abs(verified.x-path[i-1].x),
                Math.abs(verified.z-path[i-1].z))!==1)
      return {ok:false,reason:'nonadjacent-waypoint',legs:i-1,ticks};
    const result=physicsEdge(world,p,verified,edgeTicks);
    ticks+=result.ticks;
    if(!result.ok)return {ok:false,reason:result.reason,legs:i-1,ticks};
    p=result.player;steps+=result.stepped;
  }
  return {ok:true,legs:path.length-1,ticks,steps,
    finalFeet:p.feet,finalX:p.x,finalZ:p.z};
}
export function searchOriginalM7PhysicsAdmittedRoutes(world,{
  seed=world?.seed,x,z,targetBiome=null,
  radius=12,maxVisits=ENCHANTED_PHYSICS_ROUTE_LIMITS.visits,
  maxSteps=ENCHANTED_PHYSICS_ROUTE_LIMITS.depth,
  maxRoutes=ENCHANTED_PHYSICS_ROUTE_LIMITS.routes,
  maxEdgeAttempts=ENCHANTED_PHYSICS_ROUTE_LIMITS.edgeAttempts,
  maxPhysicsTicks=ENCHANTED_PHYSICS_ROUTE_LIMITS.physicsTicks,
  minDisplacement=4,maxArrivalsPerCell=1,corridor=null
}={}){
  const lim=ENCHANTED_PHYSICS_ROUTE_LIMITS;
  if(world?.profile?.generator!==M7_ENVIRONMENT_GENERATOR||
     world.experimentalEnchantedTrees!==false||
     !Number.isInteger(seed)||seed!==(seed|0)||seed!==world.seed||
     !Number.isSafeInteger(x)||!Number.isSafeInteger(z)||
     !Number.isInteger(radius)||radius<1||radius>lim.radius||
     !Number.isInteger(maxVisits)||maxVisits<1||maxVisits>lim.visits||
     !Number.isInteger(maxSteps)||maxSteps<1||maxSteps>lim.depth||
     !Number.isInteger(maxRoutes)||maxRoutes<1||maxRoutes>lim.routes||
     !Number.isInteger(maxEdgeAttempts)||maxEdgeAttempts<1||maxEdgeAttempts>lim.edgeAttempts||
     !Number.isInteger(maxPhysicsTicks)||maxPhysicsTicks<1||maxPhysicsTicks>lim.physicsTicks||
     !Number.isInteger(minDisplacement)||minDisplacement<1||minDisplacement>radius*2||
     !Number.isInteger(maxArrivalsPerCell)||maxArrivalsPerCell<1||
     maxArrivalsPerCell>2||
     (corridor!==null&&(
       typeof corridor!=='object'||Array.isArray(corridor)||
       !['west','east','north','south'].includes(corridor.direction)||
       !Number.isInteger(corridor.width)||corridor.width<1||
       corridor.width>12||
       !Number.isInteger(corridor.backtrack)||corridor.backtrack<0||
       corridor.backtrack>4
     ))||
     targetBiome!==null&&(typeof targetBiome!=='string'||!targetBiome))
    throw Error('Invalid original M7 physics-admitted route query');
  const sourceBiome=climate(x,z,seed);
  const stats={seed,origin:[x,z],sourceBiome,targetBiome,
    maxVisits,maxSteps,maxEdgeAttempts,maxPhysicsTicks,radius,maxArrivalsPerCell,
    visited:0,supported:0,edgeAttempts:0,physicsTicks:0,
    corridor:corridor?Object.freeze({
      direction:corridor.direction,width:corridor.width,
      backtrack:corridor.backtrack
    }):null,
    rejectedCorridor:0,visitedTargetBiome:0,
    alternateArrivals:0,duplicateArrivalRejected:0,
    distinctCells:0,peakArrivalsAtCell:0,
    rejectedGround:0,rejectedHeight:0,rejectedCorners:0,
    rejectedPhysics:0,rejectedOverBudget:0,
    accepted:0,queuedPeak:0,truncated:false};
  const start=originalM7PedestrianCap(world,x,z);
  if(!start)return {routes:[],stats:{...stats,startSupported:false}};
  const root={ground:start,player:playerAt(start),parent:null,
    depth:0,edgeTicks:null};
  // The original single-arrival FIFO is preserved byte-for-byte when
  // maxArrivalsPerCell=1. Opt-in two-arrival research permits the SAME
  // physical cell to be reached with distinct incoming directions and
  // thus genuinely different original stepPlayer velocity/ground state.
  // Never merge those states or reset velocity to synthesize a passage.
  // Limit to two distinct headings per physical cell, and only admit a
  // heading AFTER a complete original physics edge has succeeded.
  const originKey=key(x,z);
  const arrivals=new Map([[originKey,new Set(['origin'])]]);
  const queue=[root],sampled=new Map([[originKey,start]]);
  stats.distinctCells=1;
  stats.peakArrivalsAtCell=1;
  const supported=(a,b)=>{
    const id=key(a,b);
    if(sampled.has(id))return sampled.get(id);
    const cap=originalM7PedestrianCap(world,a,b);
    sampled.set(id,cap);
    return cap;
  };
  const routes=[];
  for(let cursor=0;cursor<queue.length&&stats.visited<maxVisits;cursor++){
    const item=queue[cursor],here=item.ground;
    stats.visited++;
    const biome=climate(here.x,here.z,seed);
    if(biome===targetBiome)stats.visitedTargetBiome++;
    if(item.depth>0&&
       Math.hypot(here.x-x,here.z-z)>=minDisplacement&&
       biome!==sourceBiome&&
       (sourceBiome==='enchanted'||biome==='enchanted')&&
       (targetBiome===null||biome===targetBiome)){
      const route=trace(item);
      // Each edge was previously admitted with original stepPlayer;
      // replay from the original initial state also certifies the full route.
      const replay=originalM7PhysicsRouteReplay(world,route.path);
      if(!replay.ok)throw Error('Internal original-M7 physical route replay drift');
      routes.push({...route,physics:replay});
      stats.accepted++;
      if(routes.length>=maxRoutes)break;
    }
    if(item.depth>=maxSteps)continue;
    for(const [dx,dz] of moves){
      if(stats.edgeAttempts>=maxEdgeAttempts||
         stats.physicsTicks>=maxPhysicsTicks){stats.truncated=true;break;}
      const nx=here.x+dx,nz=here.z+dz,id=key(nx,nz);
      if(id===originKey||Math.abs(nx-x)>radius||Math.abs(nz-z)>radius)continue;
      if(corridor){
        // Deterministic straight physical search WINDOW, not directional
        // priority or a fabricated route. Never changes FIFO node ordering.
        // All candidate edges are still admitted by original stepPlayer.
        const fx=nx-x,fz=nz-z;
        const forward=corridor.direction==='west'?-fx:
          corridor.direction==='east'?fx:
          corridor.direction==='north'?-fz:fz;
        const lateral=corridor.direction==='west'||
          corridor.direction==='east'?fz:fx;
        if(forward< -corridor.backtrack||
           Math.abs(lateral)>corridor.width){
          stats.rejectedCorridor++;continue;
        }
      }
      const heading=dx+','+dz,priorArrivals=arrivals.get(id);
      if(priorArrivals&&(priorArrivals.has(heading)||
        priorArrivals.size>=maxArrivalsPerCell)){
        stats.duplicateArrivalRejected++;
        continue;
      }
      const next=supported(nx,nz);
      if(!next){stats.rejectedGround++;continue;}
      if(Math.abs(next.feet-here.feet)>Math.min(1,STEP_HEIGHT)){
        stats.rejectedHeight++;continue;
      }
      if(dx&&dz){
        const a=supported(here.x+dx,here.z);
        const b=supported(here.x,here.z+dz);
        if(!a||!b||
           Math.abs(a.feet-here.feet)>1||
           Math.abs(b.feet-here.feet)>1){
          stats.rejectedCorners++;continue;
        }
      }
      if(maxPhysicsTicks-stats.physicsTicks<lim.edgeTicks){
        stats.rejectedOverBudget++;stats.truncated=true;break;
      }
      stats.edgeAttempts++;
      const attempt=physicsEdge(world,item.player,next,lim.edgeTicks);
      stats.physicsTicks+=attempt.ticks;
      if(!attempt.ok){stats.rejectedPhysics++;continue;}
      const headings=priorArrivals??new Set();
      headings.add(heading);
      arrivals.set(id,headings);
      if(!priorArrivals)stats.distinctCells++;
      else stats.alternateArrivals++;
      stats.peakArrivalsAtCell=Math.max(stats.peakArrivalsAtCell,headings.size);
      queue.push({ground:next,player:attempt.player,parent:item,
        depth:item.depth+1,edgeTicks:attempt.ticks});
      stats.supported++;
    }
    stats.queuedPeak=Math.max(stats.queuedPeak,queue.length-stats.visited);
    if(stats.truncated)break;
  }
  if(stats.visited>=maxVisits&&queue.length>stats.visited)stats.truncated=true;
  return {routes,stats};
}
