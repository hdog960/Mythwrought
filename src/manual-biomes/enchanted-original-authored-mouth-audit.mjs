// Phase 2 isolated ORIGINAL-M7 cave-mouth evidence gate. The original
// combinedEnvironmentCaves reader owns these mouths; neither an unrelated
// AIR pocket nor a neighboring source-ground stand is a cave entrance proof.
// This source is read-only, never production-wired and never changes a save.
import {BLOCK,collides,terrainHeight} from '../voxel.mjs';
import {GROUND_PROBE} from '../physics.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {originalM7PhysicalGroundCap} from './enchanted-original-standing-diagnostic.mjs';
import {originalM7PhysicsRouteReplay} from './enchanted-original-physics-route.mjs';
import {auditOriginalM7PhysicallyWalkedSource}
  from './enchanted-original-route-evidence.mjs';

function historicalMouths(world){
  const sites=world?.environmentCaves?.entranceSites;
  if(world?.profile?.generator!==M7_ENVIRONMENT_GENERATOR||
     !Number.isSafeInteger(world?.seed)||world.seed!==(world.seed|0)||
     !Array.isArray(sites)||sites.length!==4||
     typeof world.environmentCaves.get!=='function'||
     typeof world.get!=='function'||
     typeof world._environmentBaseline!=='function')
    throw Error('Original M7 cave mouth source required');
  const names=new Set(),locations=new Set();
  for(const site of sites){
    const mouth=site?.mouth;
    if(typeof site?.name!=='string'||!site.name||
       !Number.isSafeInteger(mouth?.x)||
       !Number.isSafeInteger(mouth?.y)||
       !Number.isSafeInteger(mouth?.z)||
       names.has(site.name)||
       locations.has(mouth.x+','+mouth.y+','+mouth.z))
      throw Error('Invalid or duplicate authored original M7 mouth');
    names.add(site.name);
    locations.add(mouth.x+','+mouth.y+','+mouth.z);
  }
  return sites;
}

// Source-owner facts only. Do not interpret ground+clearance at a fixed
// coordinate as real entry: an actual non-teleported stepPlayer route is
// separately required. Source values (including AIR=0) remain exact.
export function inspectOriginalM7AuthoredCaveMouth(world,name){
  if(typeof name!=='string'||!name)
    throw Error('Named original M7 cave mouth required');
  const site=historicalMouths(world).find(a=>a.name===name);
  if(!site)throw Error('Unknown original M7 authored cave mouth');
  const {x,y,z}=site.mouth,cave=world.environmentCaves;
  const sourceFloor=cave.get(x,y-1,z);
  const sourceHead=[0,1,2].map(d=>cave.get(x,y+d,z));
  const realFloor=world.get(x,y-1,z);
  const realHead=[0,1,2].map(d=>world.get(x,y+d,z));
  const sourceFloorSolid=sourceFloor!==undefined&&sourceFloor!==BLOCK.AIR;
  const sourceHeadAIR=sourceHead.every(id=>id===BLOCK.AIR);
  const worldSourceMatches=sourceFloorSolid&&sourceHeadAIR&&
    realFloor===sourceFloor&&realHead.every((id,i)=>id===sourceHead[i]);
  const physicalBodyClear=!collides(world,x+.5,y,z+.5);
  const actualGroundProbe=collides(world,x+.5,y-GROUND_PROBE,z+.5);
  const fullMouthSource=sourceFloorSolid&&sourceHeadAIR&&worldSourceMatches;
  // The legacy terrain height is an OBSERVATION, not a substitute cave
  // surface or a fabricated support height. The physical cap is queried
  // but is never used to fill a source-owned entrance.
  const legacyTop=terrainHeight(x,z,world.seed);
  const legacyCap=originalM7PhysicalGroundCap(world,x,z);
  return Object.freeze({
    name,x,y,z,legacyTop,legacyCapFeet:legacyCap?.feet??null,
    sourceFloor,sourceHead:Object.freeze(sourceHead),
    realFloor,realHead:Object.freeze(realHead),
    sourceFloorSolid,sourceHeadAIR,worldSourceMatches,
    fullMouthSource,physicalBodyClear,actualGroundProbe,
    playerBodySupportedAtMouth:fullMouthSource&&physicalBodyClear&&actualGroundProbe,
    // This is not an actual original-M7 player route.
    physicallyWalked:false,caveDescentWalked:false
  });
}

export function inspectAllOriginalM7AuthoredCaveMouths(world){
  return Object.freeze(historicalMouths(world).map(site=>
    inspectOriginalM7AuthoredCaveMouth(world,site.name)));
}

// A true witness must first complete the continuous unchanged original
// stepPlayer full-route replay. It must include an INTERIOR waypoint at
// the exact named, source-authored cave mouth with feet matching original
// source floor. A path that only passes nearby is NOT an accepted witness.
// This proves an authored mouth waypoint was walked, NOT deep descent.
export function witnessOriginalM7AuthoredMouthWaypoint(world,path,name){
  const mouth=inspectOriginalM7AuthoredCaveMouth(world,name);
  if(!mouth.fullMouthSource||!mouth.playerBodySupportedAtMouth)
    return Object.freeze({ok:false,reason:'authored-mouth-source-or-body-unsafe',
      mouth,physics:null});
  const audit=auditOriginalM7PhysicallyWalkedSource(world,path);
  if(!audit.ok)return Object.freeze({ok:false,reason:'original-stepPlayer-replay-failed',
    mouth,physics:audit.physics});
  const reached=audit.cells.findIndex((p,i)=>
    i>0&&i<audit.cells.length-1&&
    p.x===mouth.x&&p.z===mouth.z&&
    Math.abs(p.feet-mouth.y)<1e-5);
  if(reached<0)return Object.freeze({ok:false,
    reason:'no-interior-original-authored-mouth-waypoint',
    mouth,physics:audit.physics,nearestHorizontalDistance:Math.min(
      ...audit.cells.map(p=>Math.hypot(p.x-mouth.x,p.z-mouth.z)))});
  // An actual completed player physics replay is mandatory. Never certify
  // cave depth traversal, sunlight/line-of-sight, a landmark, or full
  // original M7 cave acceptance from a surface-mouth waypoint alone.
  return Object.freeze({ok:true,
    classification:'source-authored-mouth-waypoint-physically-replayed',
    name,atLeg:reached,physics:audit.physics,
    groundProvenance:audit.cells[reached].source,
    caveDescentWalked:false,installedIphoneMeasured:false});
}

// A narrow, deliberately non-mandatory *attempt* to find actual original
// physics through an authored mouth. If source body/ground standing is not
// compatible with the existing conservative research cap, there is NO
// reprofile, synthetic floor, implied teleport, or success claim.
export function surveyOriginalM7MouthWaypointPhysics(world,name){
  const mouth=inspectOriginalM7AuthoredCaveMouth(world,name);
  const candidates=[],reasons={noSourceCap:0,noNeighborCap:0,physicalReplayFailure:0};
  if(!mouth.playerBodySupportedAtMouth)
    return Object.freeze({name,mouth,attempts:0,witnesses:Object.freeze([]),
      reasons:Object.freeze({sourceMouthUnsafe:true}),caveDescentWalked:false});
  const center=originalM7PhysicalGroundCap(world,mouth.x,mouth.z);
  if(!center||Math.abs(center.feet-mouth.y)>1e-5){
    reasons.noSourceCap++;
    return Object.freeze({name,mouth,attempts:0,witnesses:Object.freeze([]),
      reasons:Object.freeze(reasons),caveDescentWalked:false});
  }
  const deltas=[[1,0],[-1,0],[0,1],[0,-1]];
  let attempts=0;
  for(const [dx,dz] of deltas){
    const before=originalM7PhysicalGroundCap(world,mouth.x-dx,mouth.z-dz);
    const after=originalM7PhysicalGroundCap(world,mouth.x+dx,mouth.z+dz);
    if(!before||!after){reasons.noNeighborCap++;continue;}
    const path=[before,center,after];
    // Accept the witness ONLY after actual uninterrupted M7 physics;
    // never use a local cave AIR/ground check as a walking certificate.
    attempts++;
    const witness=witnessOriginalM7AuthoredMouthWaypoint(world,path,name);
    if(witness.ok)candidates.push(Object.freeze({
      axis:[dx,dz],legs:witness.physics.legs,
      ticks:witness.physics.ticks,class:witness.classification
    }));
    else reasons.physicalReplayFailure++;
  }
  return Object.freeze({name,mouth,attempts,
    witnesses:Object.freeze(candidates),reasons:Object.freeze(reasons),
    caveDescentWalked:false});
}
