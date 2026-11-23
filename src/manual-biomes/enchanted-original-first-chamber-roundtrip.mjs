// MYTHWROUGHT Enchanted P2 ORIGINAL-M7 read-only first deep-chamber
// internal spoke + return + deep spiral physical source witness.
// No synthetic chamber floor, no staged cave assembly, no standing bypass,
// no player teleport/reset, no edits to original runtime/physics/saves.
// The chamber floor is accepted ONLY if the exact ORIGINAL :24 cave author
// mapped it as solid, all 3 AIR headroom cells match M7 world.get and
// the real original collision/ground probe admits a supported player.
import {BLOCK,worldKey} from '../voxel.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {deepCaveCells,DEEP_CAVE_ORIGIN,deepCaveRoute}
 from '../deep-cave-network.mjs';
import {originalM7AuthoredCaveFloorCap}
 from './enchanted-original-cave-descent-evidence.mjs';
import {planFullOriginalM7CaveAnchorWalk,
 replayFullOriginalM7CaveAnchorWalk}
 from './enchanted-original-full-anchor-continuity.mjs';

export const ORIGINAL_FIRST_CHAMBER_GATE=Object.freeze({
 centerSourceSpiralStep:104,sourceFloor:-30,maxSpoke:5,
 resumeSpiralStep:112,
 directions:Object.freeze([[0,1],[1,0],[0,-1],[-1,0]])
});
const reject=(reason,extra={})=>Object.freeze({ok:false,reason,...extra});
const coord=p=>[p.x,p.surface,p.z];
function authorCap(world,author,x,floor,z){
 const actual=originalM7AuthoredCaveFloorCap(world,x,floor,z);
 const key=worldKey(x,floor,z);
 const id=author.get(key);
 const heads=[1,2,3].map(d=>author.get(worldKey(x,floor+d,z)));
 if(!actual||id===undefined||id===BLOCK.AIR||
    actual.material!==id||!heads.every(v=>v===BLOCK.AIR))
   return null;
 return Object.freeze({...actual,
  chamberAuthor:'original-deep24-chamber-30'});
}

// Even the first chamber's *center* must be the actual original spiral
// coordinate at floor -30; never infer a cave from a flat AIR/solid column.
export function planOriginalM7FirstChamberRoundTrip(world,{spoke=3}={}){
 if(world?.profile?.generator!==M7_ENVIRONMENT_GENERATOR||
    !Number.isSafeInteger(world.seed)||
    !Number.isInteger(spoke)||spoke<2||
    spoke>ORIGINAL_FIRST_CHAMBER_GATE.maxSpoke)
   throw Error('Invalid original M7 first chamber interior research');
 const original=planFullOriginalM7CaveAnchorWalk(world,'old-deep24',
  {spiralSteps:ORIGINAL_FIRST_CHAMBER_GATE.resumeSpiralStep});
 if(!original.ok)return reject('original-deep24-source-not-authored',
  {detail:original});
 const route=deepCaveRoute(DEEP_CAVE_ORIGIN);
 const center=route[ORIGINAL_FIRST_CHAMBER_GATE.centerSourceSpiralStep];
 if(center.floor!==ORIGINAL_FIRST_CHAMBER_GATE.sourceFloor)
   throw Error('Real -30 original deep chamber route identity drift');
 const index=original.path.findIndex(p=>
    p.spiralStep===ORIGINAL_FIRST_CHAMBER_GATE.centerSourceSpiralStep);
 if(index<0||original.path[index].x!==center.x||
    original.path[index].z!==center.z||
    original.path[index].surface!==center.floor)
   throw Error('Original spiral center is NOT original chamber route step');
 const author=deepCaveCells(DEEP_CAVE_ORIGIN);
 const centerCap=authorCap(world,author,center.x,center.floor,center.z);
 if(!centerCap)return reject('original-chamber-center-source-unavailable',
  {center:[center.x,center.floor,center.z]});
 const observations=[],candidates=[];
 for(const [dx,dz] of ORIGINAL_FIRST_CHAMBER_GATE.directions){
  const spokeCaps=[],missing=[];
  for(let i=1;i<=spoke;i++){
   const x=center.x+i*dx,z=center.z+i*dz;
   const cap=authorCap(world,author,x,center.floor,z);
   if(!cap){missing.push([x,center.floor,z]);break;}
   spokeCaps.push(Object.freeze({...cap,chamberSpokeStep:i}));
  }
  observations.push(Object.freeze({direction:[dx,dz],
    authorOwnedCells:spokeCaps.length,
    missing:Object.freeze(missing)}));
  if(spokeCaps.length===spoke)
    candidates.push(Object.freeze({direction:Object.freeze([dx,dz]),
      cells:Object.freeze(spokeCaps)}));
 }
 if(!candidates.length)return reject('no-original-author-owned-chamber-spoke',
  {center:[center.x,center.floor,center.z],
   observations:Object.freeze(observations)});
 // Only original author-owned voxel facts are used for the route.
 // A source-authored *proposed* path remains unaccepted until unchanged
 // original stepPlayer finishes the entire outside→chamber→return walk.
 const plans=candidates.map(c=>{
  const outward=c.cells;
  const returning=[...outward.slice(0,-1)].reverse();
  const path=[
    ...original.path.slice(0,index+1),
    ...outward,
    ...returning,
    Object.freeze({...centerCap,chamberReturnToOriginalSpiral:true}),
    ...original.path.slice(index+1)
  ];
  // Original player replay admits only CARDINAL full-body steps, no
  // diagonal corner shortcut or input-specified teleport.
  for(let i=1;i<path.length;i++)
   if(Math.abs(path[i].x-path[i-1].x)+
      Math.abs(path[i].z-path[i-1].z)!==1)
    throw Error('Original authored chamber roundtrip is not cardinal');
  return Object.freeze({...original,path:Object.freeze(path),
   chamberCenter:Object.freeze({x:center.x,floor:center.floor,z:center.z}),
   chamberDirection:c.direction,
   chamberOutAndBackSteps:2*spoke,
   chamberActualSpokeCells:Object.freeze(outward),
   sourceOnly:true,physicallyWalked:false,
   originalChamberInteriorAccepted:false,
   fullDeepNetworkAccepted:false});
 });
 return Object.freeze({ok:true,
  authenticCenter:coord(centerCap),
  observations:Object.freeze(observations),
  candidatePlans:Object.freeze(plans),
  allCandidatesOriginalAuthored:true,
  physicallyWalked:false});
}
export function surveyOriginalM7FirstChamberPhysicalRoundTrip(world,{spoke=3}={}){
 const source=planOriginalM7FirstChamberRoundTrip(world,{spoke});
 if(!source.ok)return source;
 const attempts=[];
 for(const plan of source.candidatePlans){
  const replay=replayFullOriginalM7CaveAnchorWalk(world,plan);
  attempts.push(Object.freeze({
   direction:plan.chamberDirection,
   physicalSuccess:replay.ok,
   physicallyWalkedSpokeSteps:replay.ok?plan.chamberOutAndBackSteps:0,
   ticks:replay.ticks,
   reason:replay.ok?null:replay.reason,
   failedAt:replay.ok?null:replay.failedAt??null
  }));
  if(replay.ok){
   const i=plan.path.findIndex(p=>p.chamberSpokeStep===spoke);
   if(i<0||!replay.legs[i-1]||
      replay.legs[i-1].target.join(',')!==
        [plan.path[i].x,plan.path[i].surface,plan.path[i].z].join(','))
     throw Error('Chamber interior was not actually reached by original controller');
   return Object.freeze({ok:true,
    sourcePlan:plan,replay,
    attempts:Object.freeze(attempts),
    physicallyVisitedOriginalChamberInterior:true,
    returnedToOriginalRoute:true,
    continuedOriginalDeepSpiralSteps:plan.lastOriginalSpiralStep,
    completeFirstChamberAccepted:false,
    wholeDeepNetworkAccepted:false});
  }
 }
 return reject('original-chamber-author-floor-not-physically-walkable',
  {originalAuthorFloorPresent:true,attempts:Object.freeze(attempts),
   completeFirstChamberAccepted:false});
}
