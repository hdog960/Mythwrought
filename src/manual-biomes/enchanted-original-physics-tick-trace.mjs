// Isolated Phase 2 per-TICK original M7 physics witness. This duplicates
// NO physics rules: it calls unchanged stepPlayer each 25 ms, replays the
// entire route with inherited momentum and requires exact parity with the
// previously accepted original-M7 full-route replay result. Read-only.
// Signed chunk seams / vertical changes derive from REAL player positions,
// not from waypoint guesses or fabricated ground.
import {BLOCK,chunkCoord,collides} from '../voxel.mjs';
import {GROUND_PROBE,stepPlayer} from '../physics.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {originalM7PhysicalGroundCap} from './enchanted-original-standing-diagnostic.mjs';
import {ENCHANTED_PHYSICS_ROUTE_LIMITS,originalM7PhysicsRouteReplay}
  from './enchanted-original-physics-route.mjs';

function startingPlayer(cap){
  return {x:cap.x+.5,z:cap.z+.5,feet:cap.feet,
    yaw:0,pitch:0,vX:0,vZ:0,vY:0,onGround:true,
    coyote:0,jumpBuffer:0};
}
function frame(world,p,tick,leg){
  const x=Math.floor(p.x),z=Math.floor(p.z);
  const caveAtFeet=world.environmentCaves?.get(x,Math.floor(p.feet),z);
  return Object.freeze({tick,leg,x:p.x,z:p.z,feet:p.feet,
    vX:p.vX,vZ:p.vZ,vY:p.vY,onGround:p.onGround,
    blockX:x,blockZ:z,chunkX:chunkCoord(x),chunkZ:chunkCoord(z),
    originalGroundProbe:collides(world,p.x,p.feet-GROUND_PROBE,p.z),
    // This sample does not identify a cave mouth or prove cave descent.
    sourceCaveAirAtFeet:caveAtFeet===BLOCK.AIR});
}
export function traceOriginalM7PhysicalWalkTicks(world,path,{edgeTicks=48}={}){
  if(world?.profile?.generator!==M7_ENVIRONMENT_GENERATOR||
     !Number.isSafeInteger(world.seed)||world.seed!==(world.seed|0)||
     !Array.isArray(path)||path.length<2||
     path.length>ENCHANTED_PHYSICS_ROUTE_LIMITS.depth+1||
     !Number.isInteger(edgeTicks)||edgeTicks<1||
     edgeTicks>ENCHANTED_PHYSICS_ROUTE_LIMITS.edgeTicks)
    throw Error('Invalid original M7 physical tick trace');
  // The existing physical cap and FULL original replay remain the
  // acceptance authority. If it fails, do not produce a misleading trace.
  const proof=originalM7PhysicsRouteReplay(world,path,
    {groundMode:'physical',edgeTicks});
  if(!proof.ok)return Object.freeze({
    ok:false,reason:proof.reason,originalPhysics:proof,frames:Object.freeze([])
  });
  const cap=originalM7PhysicalGroundCap(world,path[0].x,path[0].z);
  if(!cap||Math.abs(cap.feet-path[0].feet)>1e-5)
    throw Error('Original M7 trace initial source drift');
  const p=startingPlayer(cap);
  const samples=[frame(world,p,0,0)],perLegTicks=[],perLegSteps=[];
  let ticks=0,stepped=0;
  for(let i=1;i<path.length;i++){
    const next=originalM7PhysicalGroundCap(world,path[i].x,path[i].z);
    if(!next||Math.abs(next.feet-path[i].feet)>1e-5)
      throw Error('Original M7 source changed after successful route replay');
    if(Math.max(Math.abs(next.x-path[i-1].x),
                Math.abs(next.z-path[i-1].z))!==1)
      throw Error('Original M7 nonadjacent trace after successful replay');
    const tx=next.x+.5,tz=next.z+.5;
    let legTicks=0,legSteps=0,reached=false;
    for(let j=0;j<edgeTicks;j++){
      p.yaw=Math.atan2(tx-p.x,tz-p.z);
      const outcome=stepPlayer(world,p,{forward:1,strafe:0,jump:false},.025);
      ticks++;legTicks++;
      if(outcome.stepped){stepped++;legSteps++;}
      if(outcome.hitWall||outcome.ceiling||collides(world,p.x,p.feet,p.z))
        throw Error('Original M7 per-tick physics contradicted accepted replay');
      samples.push(frame(world,p,ticks,i));
      if(Math.hypot(p.x-tx,p.z-tz)<=.24){reached=true;break;}
    }
    if(!reached)throw Error('Original M7 trace did not reach replayed waypoint');
    perLegTicks.push(legTicks);perLegSteps.push(legSteps);
  }
  if(ticks!==proof.ticks||stepped!==proof.steps||
     Math.abs(p.x-proof.finalX)>1e-9||
     Math.abs(p.z-proof.finalZ)>1e-9||
     Math.abs(p.feet-proof.finalFeet)>1e-9)
    throw Error('Original M7 tick-level physics source/replay parity drift');
  const seams=[];
  let minFeet=samples[0].feet,maxFeet=samples[0].feet;
  let maxTickMotion=0,groundContactTicks=0,groundlessTicks=0,sourceCaveAIRSampleTicks=0;
  for(let i=1;i<samples.length;i++){
    const a=samples[i-1],b=samples[i];
    if(a.chunkX!==b.chunkX||a.chunkZ!==b.chunkZ)
      seams.push(Object.freeze({tick:i,
        from:[a.chunkX,a.chunkZ],to:[b.chunkX,b.chunkZ],
        physicalPosition:[b.x,b.feet,b.z]}));
    minFeet=Math.min(minFeet,b.feet);maxFeet=Math.max(maxFeet,b.feet);
    maxTickMotion=Math.max(maxTickMotion,
      Math.hypot(b.x-a.x,b.feet-a.feet,b.z-a.z));
    if(b.originalGroundProbe)groundContactTicks++;else groundlessTicks++;
    if(b.sourceCaveAirAtFeet)sourceCaveAIRSampleTicks++;
  }
  return Object.freeze({ok:true,originalPhysics:proof,
    frames:Object.freeze(samples),
    perLegTicks:Object.freeze(perLegTicks),
    perLegSteps:Object.freeze(perLegSteps),
    seams:Object.freeze(seams),
    metrics:Object.freeze({
      actualPhysicsTicks:ticks,actualLegs:path.length-1,
      actualSignedChunkSeams:seams.length,
      minPlayerFeet:minFeet,maxPlayerFeet:maxFeet,
      actualFeetVerticalRange:maxFeet-minFeet,
      maxPlayerMotionPer25msTick:maxTickMotion,
      groundContactTicks,groundlessTicks,
      // Source cave AIR observations alone NEVER certify cave passage.
      sourceCaveAIRSampleTicks,
      realCaveMouthTraversalsCertified:0,
      physicalIphonePwaMeasured:false
    })});
}
