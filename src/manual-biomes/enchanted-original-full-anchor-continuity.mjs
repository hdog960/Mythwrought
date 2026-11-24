// MYTHWROUGHT Enchanted Phase 2: isolated, READ-ONLY complete original-M7
// entrance-to-source-anchor research, optionally continuing through the
// ORIGINAL old :24 deep spiral. This is NOT a change to cave generation,
// terrain, engine physics, saved worlds, generator version or the live PWA.
// Every waypoint uses the actual authored cave reader, original world.get,
// unchanged full-body AABB and ground probe; every leg runs real stepPlayer
// with inherited momentum, gravity, grounded state and no teleports.
import {BLOCK,collides,chunkCoord} from '../voxel.mjs';
import {GROUND_PROBE,STEP_HEIGHT,stepPlayer} from '../physics.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {originalCaveEntranceSites} from '../manual-caves/entrance-preflight.mjs';
import {DEEP_CAVE_ORIGIN,deepCaveRoute} from '../deep-cave-network.mjs';
import {originalM7PhysicalGroundCap} from './enchanted-original-standing-diagnostic.mjs';
import {originalM7AuthoredCaveFloorCap} from './enchanted-original-cave-descent-evidence.mjs';

export const M7_FULL_SOURCE_WALK_BOUNDS=Object.freeze({
  // Detached research-only expansion for the *unchanged* original deep
  // spiral. 112 steps reaches the first original -30 chamber approach.
  // This does not authorize or alter any cave, save or production world.
  // Research-only envelope covers the *original* second (-75) rest
  // chamber and leaves room for an authored interior visit and return.
  // No original cave writer, physics, save or generator identity change.
  // Detached research-only bound through third (-130) rest chamber.
  // Original cave geometry, player physics, saves and production unchanged.
  // Final original spiral endpoint; detached research only.
  authoredSteps:64,spiralSteps:824,waypoints:920,
  ticksPerLeg:48,allTicks:44160
});
const validWorld=w=>w?.profile?.generator===M7_ENVIRONMENT_GENERATOR&&
  Number.isInteger(w.seed)&&w.seed===(w.seed|0)&&
  typeof w.environmentCaves?.get==='function'&&
  Array.isArray(w.environmentCaves.entranceSites)&&
  typeof w.get==='function'&&
  (w.experimentalEnchantedTrees===false||w.experimentalEnchantedTrees===true);
const coordinate=(p)=>[p.x,p.surface,p.z];
const playerAt=p=>({x:p.x+.5,z:p.z+.5,feet:p.feet,
  yaw:0,pitch:0,vX:0,vZ:0,vY:0,onGround:true,
  coyote:0,jumpBuffer:0});
const arrival=(p,to)=>Math.hypot(p.x-(to.x+.5),p.z-(to.z+.5))<=.12;
const refuse=(reason,extra={})=>Object.freeze({ok:false,reason,...extra});

// The ORIGINAL preflight's named entrance, direction and length determine
// every voxel. A generated cave source floor is never inferred from height.
// A historical source conflict, missing original body contact, or omitted
// authored AIR causes an explicit failure rather than a fabricated bridge.
export function planFullOriginalM7CaveAnchorWalk(world,name,{spiralSteps=0}={}){
  if(!validWorld(world)||typeof name!=='string'||!name||
     !Number.isInteger(spiralSteps)||spiralSteps<0||
     spiralSteps>M7_FULL_SOURCE_WALK_BOUNDS.spiralSteps)
    throw Error('Invalid original M7 full anchor walking source');
  if(spiralSteps&&name!=='old-deep24')
    throw Error('Original :24 deep spiral continuation requires old-deep24 source');
  const anchor=originalCaveEntranceSites().find(p=>p.name===name);
  const site=world.environmentCaves.entranceSites.find(p=>p.name===name);
  if(!anchor||!site)throw Error('Unknown original M7 authored entrance');
  const mouth=site.mouth,s=mouth?.approachSteps-1;
  if(!Number.isSafeInteger(s)||s<4||s>M7_FULL_SOURCE_WALK_BOUNDS.authoredSteps)
    return refuse('original-authored-entrance-length-out-of-bounds',{name,s});
  const dx=(mouth.x-anchor.x)/s,dz=(mouth.z-anchor.z)/s;
  if(!Number.isInteger(dx)||!Number.isInteger(dz)||
     Math.abs(dx)+Math.abs(dz)!==1||
     mouth.y!==anchor.floor+Math.floor(s/2)+1)
    throw Error('Original M7 mouth not aligned with its author-owned anchor');
  const cave=[];
  for(let t=s;t>=0;t--){
    const x=anchor.x+dx*t,z=anchor.z+dz*t;
    const surface=anchor.floor+Math.floor(t/2);
    const cap=originalM7AuthoredCaveFloorCap(world,x,surface,z);
    if(!cap)return refuse('original-authored-floor-or-AIR-unavailable',
      {name,sourceStep:t,verifiedCaveCells:cave.length,
        position:[x,surface,z]});
    cave.push(Object.freeze({...cap,sourceStep:t}));
  }
  const atAnchor=cave.at(-1);
  if(atAnchor.x!==anchor.x||atAnchor.z!==anchor.z||
     atAnchor.surface!==anchor.floor)
    throw Error('Original M7 source floor does not reach authentic anchor');
  // Outside uses only the actual previously accepted M7 original standing
  // reader. It cannot invent a cave-mouth entry or force a historic save.
  const outside=originalM7PhysicalGroundCap(world,mouth.x+dx,mouth.z+dz);
  if(!outside||Math.abs(outside.feet-cave[0].feet)>Math.min(1,STEP_HEIGHT))
    return refuse('original-outside-surface-approach-unavailable',{name});
  const path=[Object.freeze({...outside,
    owner:'original-legacy-or-overlay-ground'}),...cave];
  const spiral=[];
  if(spiralSteps){
    const route=deepCaveRoute(DEEP_CAVE_ORIGIN);
    const first=route[0];
    if(name!=='old-deep24'||first.x!==anchor.x||
       first.z!==anchor.z||first.floor!==anchor.floor||
       coordinate(atAnchor).join(',')!==[first.x,first.floor,first.z].join(','))
      throw Error('Original :24 deep spiral and authored source anchor disagree');
    for(let i=1;i<=spiralSteps;i++){
      const step=route[i];
      const cap=originalM7AuthoredCaveFloorCap(world,step.x,step.floor,step.z);
      if(!cap)return refuse('original-deep-spiral-floor-or-AIR-unavailable',
        {name,spiralStep:i,verifiedSpiralCells:spiral.length,
          position:[step.x,step.floor,step.z]});
      spiral.push(Object.freeze({...cap,spiralStep:i}));
      path.push(spiral.at(-1));
    }
  }
  if(path.length>M7_FULL_SOURCE_WALK_BOUNDS.waypoints)
    throw Error('Original M7 walking path over research waypoint limit');
  for(let i=1;i<path.length;i++){
    const a=path[i-1],b=path[i];
    if(Math.abs(b.x-a.x)+Math.abs(b.z-a.z)!==1||
       Math.abs(b.feet-a.feet)>Math.min(1,STEP_HEIGHT))
      return refuse('original-authored-route-discontinuous',
        {name,atIndex:i,from:coordinate(a),to:coordinate(b)});
  }
  return Object.freeze({ok:true,name,
    sourceAnchor:Object.freeze({...anchor}),
    sourceMouth:Object.freeze({...mouth}),
    outwardDirection:Object.freeze([dx,dz]),
    sourceApproachSteps:s,sourceOwnedCaveCells:cave.length,
    sourceOwnedDeepSpiralCells:spiral.length,
    initialOutside:coordinate(path[0]),
    completedSourceAnchor:coordinate(atAnchor),
    path:Object.freeze(path),
    anchorIndex:1+s,
    lastOriginalSpiralStep:spiralSteps,
    authoredFloorDrop:cave[0].surface-atAnchor.surface,
    sourceOnly:true,physicallyWalked:false,
    fullDeepNetworkAccepted:false});
}

// A standalone continuous controller from true original surface through
// every generated author-owned ramp step and optional original deep spiral.
// NO per-window newPlayer, playerAt, reset velocity, interpolation to cells,
// ground fabrication, jump, or physics/collision exception.
export function replayFullOriginalM7CaveAnchorWalk(world,plan,{
  ticksPerLeg=M7_FULL_SOURCE_WALK_BOUNDS.ticksPerLeg
}={}){
  if(!validWorld(world)||!plan?.ok||!Array.isArray(plan.path)||
     plan.path.length<3||plan.path.length>M7_FULL_SOURCE_WALK_BOUNDS.waypoints||
     !Number.isInteger(ticksPerLeg)||ticksPerLeg<1||
     ticksPerLeg>M7_FULL_SOURCE_WALK_BOUNDS.ticksPerLeg)
    throw Error('Invalid original M7 cave-anchor physics replay');
  const path=plan.path;
  // Player edits can invalidate any original source voxel. Fail before
  // physics so a mined AIR floor cannot be bridged by precomputed metadata.
  for(let i=0;i<path.length;i++){
    const p=path[i];
    const checked=p.owner==='original-legacy-or-overlay-ground'?
      originalM7PhysicalGroundCap(world,p.x,p.z):
      originalM7AuthoredCaveFloorCap(world,p.x,p.surface,p.z);
    if(!checked||Math.abs(checked.feet-p.feet)>1e-5)
      return refuse('original-authored-source-was-edited',
        {name:plan.name,index:i,position:coordinate(p),ticks:0});
  }
  const p=playerAt(path[0]),initialFeet=p.feet;
  let totalTicks=0,stepped=0,groundTicks=0;
  let deepestFeet=p.feet,chunkSeams=0,anchorWalked=false;
  const legs=[];
  for(let i=1;i<path.length;i++){
    const to=path[i],before=path[i-1];
    if(Math.abs(to.x-before.x)+Math.abs(to.z-before.z)!==1||
       Math.abs(to.feet-before.feet)>Math.min(1,STEP_HEIGHT))
      throw Error('Original M7 cave source route is not single-step continuous');
    let completed=false,reason='original-physics-target-not-grounded';
    const started=totalTicks;
    for(let k=0;k<ticksPerLeg;k++){
      const prevChunk=[chunkCoord(Math.floor(p.x)),chunkCoord(Math.floor(p.z))];
      p.yaw=Math.atan2(to.x+.5-p.x,to.z+.5-p.z);
      const result=stepPlayer(world,p,{
        forward:arrival(p,to)?0:1,strafe:0,jump:false
      },.025);
      totalTicks++;
      if(totalTicks>M7_FULL_SOURCE_WALK_BOUNDS.allTicks)
        throw Error('Unbounded original-M7 continuous physics research');
      stepped+=Number(result.stepped);
      if(result.hitWall||result.ceiling||collides(world,p.x,p.feet,p.z)){
        reason='original-physics-collision';break;
      }
      const currentChunk=[chunkCoord(Math.floor(p.x)),chunkCoord(Math.floor(p.z))];
      if(currentChunk[0]!==prevChunk[0]||currentChunk[1]!==prevChunk[1])
        chunkSeams++;
      deepestFeet=Math.min(deepestFeet,p.feet);
      const genuineContact=p.onGround&&
        collides(world,p.x,p.feet-GROUND_PROBE,p.z);
      if(genuineContact)groundTicks++;
      if(arrival(p,to)&&genuineContact&&Math.abs(p.feet-to.feet)<=.075){
        completed=true;break;
      }
    }
    if(!completed)return refuse(reason,{name:plan.name,
      walkedLegs:i-1,ticks:totalTicks,failedAt:i,
      failedSourceCell:coordinate(to),
      actualPlayer:[p.x,p.feet,p.z],
      currentGrounded:p.onGround,
      sourceAnchorActuallyWalked:anchorWalked});
    if(i===plan.anchorIndex)anchorWalked=true;
    legs.push(Object.freeze({target:coordinate(to),
      ticks:totalTicks-started,finalFeet:p.feet,
      reachedOriginalAnchor:i===plan.anchorIndex,
      reachedSpiralStep:to.spiralStep??null}));
  }
  const gotSpiral=plan.sourceOwnedDeepSpiralCells>0&&
    legs.at(-1).reachedSpiralStep===plan.sourceOwnedDeepSpiralCells;
  return Object.freeze({ok:true,name:plan.name,
    walkedLegs:legs.length,ticks:totalTicks,stepped,
    preservedOriginalControllerMomentum:true,
    sourceAnchorActuallyWalked:anchorWalked,
    actualDeepSpiralStepsWalked:gotSpiral?plan.sourceOwnedDeepSpiralCells:0,
    originalDeepSpiralPhysicallyReached:gotSpiral,
    realChunkSeams:chunkSeams,groundContactTicks:groundTicks,
    startingFeet:initialFeet,finalFeet:p.feet,deepestPlayerFeet:deepestFeet,
    actualPlayerFeetDrop:initialFeet-p.feet,
    legs:Object.freeze(legs),
    fullDeepNetworkAccepted:false,
    installedHomeScreenPwaTested:false});
}
