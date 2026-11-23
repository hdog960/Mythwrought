// Detached Enchanted P2: genuine source-authored M7 entrance descent only.
// Four named mouth source anchors and per-step floor are read from the
// existing original cave entrance-preflight algorithm. Every standing floor,
// player body, AIR headroom and actual source cell is verified against the
// unmodified FourRegionWorld before unchanged stepPlayer is invoked.
// No source writes, inferred rock, teleport between legs, changed defaults,
// cave-generation modification, new generator identity or release wiring.
import {BLOCK,collides} from '../voxel.mjs';
import {GROUND_PROBE,STEP_HEIGHT,stepPlayer} from '../physics.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {originalCaveEntranceSites} from '../manual-caves/entrance-preflight.mjs';
import {originalM7PhysicalGroundCap} from './enchanted-original-standing-diagnostic.mjs';
import {inspectOriginalM7AuthoredCaveMouth}
  from './enchanted-original-authored-mouth-audit.mjs';

export const ENCHANTED_ORIGINAL_CAVE_DESCENT_LIMITS=Object.freeze({
  inwardSteps:16,edgeTicks:48,maxWaypoints:18
});
function validWorld(world){
  return world?.profile?.generator===M7_ENVIRONMENT_GENERATOR&&
    Number.isSafeInteger(world.seed)&&world.seed===(world.seed|0)&&
    typeof world.get==='function'&&
    typeof world.environmentCaves?.get==='function'&&
    Array.isArray(world.environmentCaves?.entranceSites);
}
const playerAt=cap=>({x:cap.x+.5,z:cap.z+.5,feet:cap.feet,
  yaw:0,pitch:0,vX:0,vZ:0,vY:0,onGround:true,
  coyote:0,jumpBuffer:0});
// Descending off a full-height source block requires the player's actual
// collision body to clear the prior ledge. The surface BFS's .24 waypoint
// acceptance is too early for gravity settlement; this STRICTER .12
// arrival prevents input release while still supported by that old ledge.
// Original AABB/collision/stepPlayer are completely unchanged.
const near=(p,target)=>Math.hypot(p.x-(target.x+.5),p.z-(target.z+.5))<=.12;

// Requires the ORIGINAL cave author explicitly provided real solid floor,
// three AIR headroom source cells and matching physical world.get. Never
// infer floor from legacy terrainHeight, overlay sizes or flat-world guesses.
// The old conservative overlay/legacy helper remains completely unchanged.
export function originalM7AuthoredCaveFloorCap(world,x,floor,z){
  if(!validWorld(world)||![x,floor,z].every(Number.isSafeInteger))
    throw Error('Original M7 authored cave-floor source required');
  const source=world.environmentCaves,actual=world.get(x,floor,z);
  const authored=source.get(x,floor,z);
  if(authored===undefined||authored===BLOCK.AIR||actual!==authored)
    return null;
  for(let d=1;d<=3;d++)
    if(source.get(x,floor+d,z)!==BLOCK.AIR||
       world.get(x,floor+d,z)!==BLOCK.AIR)return null;
  const feet=floor+1;
  if(collides(world,x+.5,feet,z+.5)||
     !collides(world,x+.5,feet-GROUND_PROBE,z+.5))
    return null;
  return Object.freeze({x,z,surface:floor,feet,
    owner:'original-source-authored-cave-floor',material:authored});
}

// Recover exactly the original author-selected cardinal entrance direction
// from its actual named mouth, approachSteps and immutable anchor. Never
// regenerate a portal, infer missing map cells or use a candidate tree plan.
export function originalM7NamedCaveDescentSource(world,name,{inwardSteps=12}={}){
  if(!validWorld(world)||!Number.isInteger(inwardSteps)||
     inwardSteps<2||inwardSteps>ENCHANTED_ORIGINAL_CAVE_DESCENT_LIMITS.inwardSteps)
    throw Error('Invalid original M7 cave descent research request');
  const mouth=inspectOriginalM7AuthoredCaveMouth(world,name);
  if(!mouth.fullMouthSource)
    return {ok:false,reason:'unverified-original-cave-mouth',name};
  const site=world.environmentCaves.entranceSites.find(s=>s.name===name);
  const anchor=originalCaveEntranceSites().find(s=>s.name===name);
  const s=site?.mouth?.approachSteps-1;
  if(!anchor||!Number.isSafeInteger(s)||s<4||s>64)
    throw Error('Noncanonical original M7 entrance source route length');
  const dx=(mouth.x-anchor.x)/s,dz=(mouth.z-anchor.z)/s;
  if(!Number.isInteger(dx)||!Number.isInteger(dz)||
     Math.abs(dx)+Math.abs(dz)!==1||
     anchor.floor+Math.floor(s/2)!==mouth.y-1)
    throw Error('Original M7 entrance mouth does not match original authored route');
  const inside=[];
  for(let t=s;t>=Math.max(0,s-inwardSteps);t--){
    const x=anchor.x+dx*t,z=anchor.z+dz*t;
    const floor=anchor.floor+Math.floor(t/2);
    const cap=originalM7AuthoredCaveFloorCap(world,x,floor,z);
    if(!cap)return {ok:false,reason:'original-authored-cave-floor-not-physically-present',
      name,failedAtStep:t,cellsVerified:inside.length};
    inside.push(Object.freeze({...cap,step:t}));
  }
  // An outside ordinary M7 surface approach is optional evidence only.
  // If it does not exist with genuine compatible source, start at the
  // real cave mouth. Starting there proves inward descent, not entry
  // from the open surface.
  const outsideX=mouth.x+dx,outsideZ=mouth.z+dz;
  const outside=originalM7PhysicalGroundCap(world,outsideX,outsideZ);
  const sourceSurface=outside&&
    Math.abs(outside.feet-inside[0].feet)<=Math.min(1,STEP_HEIGHT)?
    Object.freeze({...outside,owner:'original-legacy-or-overlay-ground'}):null;
  const path=sourceSurface?[sourceSurface,...inside]:inside;
  if(path.length>ENCHANTED_ORIGINAL_CAVE_DESCENT_LIMITS.maxWaypoints)
    throw Error('Unbounded original M7 authored cave descent path');
  return Object.freeze({ok:true,name,sourceAnchor:Object.freeze({...anchor}),
    mouth:Object.freeze({x:mouth.x,y:mouth.y,z:mouth.z}),
    direction:Object.freeze([dx,dz]),path:Object.freeze(path),
    mouthIndex:sourceSurface?1:0,startedOutsideMouth:!!sourceSurface,
    sourceOwnedCaveFloorCells:inside.length,
    authoredFloorDrop:inside[0].surface-inside.at(-1).surface,
    sourceOnly:true,physicallyWalked:false});
}

// No fake walking: every leg integrates actual 25 ms original M7 stepPlayer,
// inherits its preceding velocity, yaw and gravity, permits only actual
// collision-free motion, then WAITS with forward=0 until the REAL supported
// destination floor is contacted. Settling is another real physics tick;
// never set feet, onGround or velocity to the expected endpoint.
export function replayOriginalM7AuthoredCaveDescent(world,source,{edgeTicks=48}={}){
  if(!validWorld(world)||!source?.ok||!Array.isArray(source.path)||
     source.path.length<3||
     !Number.isInteger(edgeTicks)||edgeTicks<1||
     edgeTicks>ENCHANTED_ORIGINAL_CAVE_DESCENT_LIMITS.edgeTicks)
    throw Error('Invalid original M7 cave descent physics replay');
  for(let i=0;i<source.path.length;i++){
    const cap=source.path[i];
    const verified=cap.owner==='original-source-authored-cave-floor'?
      originalM7AuthoredCaveFloorCap(world,cap.x,cap.surface,cap.z):
      originalM7PhysicalGroundCap(world,cap.x,cap.z);
    if(!verified||Math.abs(verified.feet-cap.feet)>1e-5)
      return Object.freeze({ok:false,reason:'original-source-floor-changed',
        walkedLegs:Math.max(0,i-1),ticks:0});
  }
  const p=playerAt(source.path[0]),initialFeet=p.feet;
  let ticks=0,steps=0;
  const perLeg=[],frames=[];
  for(let i=1;i<source.path.length;i++){
    const to=source.path[i];
    if(Math.max(Math.abs(to.x-source.path[i-1].x),
                Math.abs(to.z-source.path[i-1].z))!==1)
      throw Error('Nonadjacent original M7 authored cave source step');
    const startTicks=ticks;
    let accepted=false,reason='original-cave-waypoint-not-grounded';
    for(let j=0;j<edgeTicks;j++){
      p.yaw=Math.atan2(to.x+.5-p.x,to.z+.5-p.z);
      // Decelerate without jumping or teleporting after nearing the
      // waypoint; gravity continues until genuine support is reached.
      const forward=near(p,to)?0:1;
      const result=stepPlayer(world,p,{forward,strafe:0,jump:false},.025);
      ticks++;
      if(result.stepped)steps++;
      if(result.hitWall||result.ceiling||collides(world,p.x,p.feet,p.z)){
        reason='original-physics-collision';break;
      }
      const grounded=p.onGround&&
        collides(world,p.x,p.feet-GROUND_PROBE,p.z);
      frames.push(Object.freeze({tick:ticks,leg:i,x:p.x,z:p.z,
        feet:p.feet,onGround:p.onGround,grounded}));
      if(near(p,to)&&Math.abs(p.feet-to.feet)<=.075&&grounded){
        accepted=true;break;
      }
    }
    if(!accepted)return Object.freeze({ok:false,reason,name:source.name,
      walkedLegs:i-1,ticks,steps,
      startedOutsideMouth:source.startedOutsideMouth,
      firstUnreachedStep:to.step??null,
      currentFeet:p.feet,targetFeet:to.feet,
      physicalProgress:Math.hypot(p.x-to.x-.5,p.z-to.z-.5)});
    perLeg.push(Object.freeze({to:[to.x,to.feet,to.z],
      ticks:ticks-startTicks,finalFeet:p.feet}));
  }
  const finalFeet=p.feet,actualDrop=initialFeet-finalFeet;
  return Object.freeze({ok:true,name:source.name,
    walkedLegs:perLeg.length,ticks,steps,
    startedOutsideMouth:source.startedOutsideMouth,
    walkedPastOriginalMouth:perLeg.length>source.mouthIndex,
    actualPlayerFeetDrop:actualDrop,
    authoredFloorDrop:source.authoredFloorDrop,
    perLeg:Object.freeze(perLeg),
    physicallyIntegratedFrames:frames.length,
    originalSourceFloorVerified:true,
    // This is not the full subterranean network, mobile performance or
    // generator-version compatibility acceptance.
    deepNetworkAccepted:false,installedIphoneMeasured:false});
}
