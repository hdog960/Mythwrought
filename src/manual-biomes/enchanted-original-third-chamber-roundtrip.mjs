// Original M7 THIRD -130 rest chamber: source-verified, physically
// walked three-cell outward spoke, return to original source route,
// then continue on same unchanged stepPlayer state to deep step 520.
// NOT a full chamber/networks/gameplay implementation. NO cave voxel edits.
import {BLOCK,worldKey} from '../voxel.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {deepCaveCells,DEEP_CAVE_ORIGIN,deepCaveRoute}
 from '../deep-cave-network.mjs';
import {originalM7AuthoredCaveFloorCap}
 from './enchanted-original-cave-descent-evidence.mjs';
import {planFullOriginalM7CaveAnchorWalk,
 replayFullOriginalM7CaveAnchorWalk}
 from './enchanted-original-full-anchor-continuity.mjs';
export const M7_THIRD_REST_CHAMBER=Object.freeze({
 centerSpiralStep:504,floor:-130,resumeSpiralStep:520,
 spoke:3,directions:Object.freeze([[0,1],[0,-1],[-1,0],[1,0]])
});
const denied=(reason,extra={})=>Object.freeze({ok:false,reason,...extra});
const pos=p=>[p.x,p.surface,p.z];
function originalCap(world,source,x,floor,z){
 const cap=originalM7AuthoredCaveFloorCap(world,x,floor,z);
 const floorId=source.get(worldKey(x,floor,z));
 if(!cap||floorId===undefined||floorId===BLOCK.AIR||
  cap.material!==floorId)return null;
 for(let h=1;h<=3;h++){
  if(source.get(worldKey(x,floor+h,z))!==BLOCK.AIR)return null;
  if(world.environmentCaves.get(x,floor+h,z)!==BLOCK.AIR)return null;
  if(world.get(x,floor+h,z)!==BLOCK.AIR)return null;
 }
 if(world.environmentCaves.get(x,floor,z)!==floorId||
    world.get(x,floor,z)!==floorId)return null;
 return Object.freeze({...cap,chamberOwnedBy:'original-deep24-third-rest-room'});
}
export function planOriginalM7ThirdChamberRoundTrip(world){
 if(world?.profile?.generator!==M7_ENVIRONMENT_GENERATOR||
   !Number.isInteger(world.seed)||world.seed!==(world.seed|0))
  throw Error('Original M7 third rest room seed/profile required');
 const plan=planFullOriginalM7CaveAnchorWalk(world,'old-deep24',
  {spiralSteps:M7_THIRD_REST_CHAMBER.resumeSpiralStep});
 if(!plan.ok)return denied('third-room-original-spiral-source-absent',
  {details:plan});
 const center=deepCaveRoute(DEEP_CAVE_ORIGIN)[M7_THIRD_REST_CHAMBER.centerSpiralStep];
 if(center.floor!==M7_THIRD_REST_CHAMBER.floor)
  throw Error('Original third authored deep room center/floor drift');
 const at=plan.path.findIndex(p=>p.spiralStep===center.step);
 if(at<0||pos(plan.path[at]).join(',')!==
    [center.x,center.floor,center.z].join(','))
  throw Error('Original deep24 step504 is not the actual third chamber center');
 const cells=deepCaveCells(DEEP_CAVE_ORIGIN);
 const centerCap=originalCap(world,cells,center.x,center.floor,center.z);
 if(!centerCap)return denied('third-room-original-center-not-author-supported',
  {center:[center.x,center.floor,center.z]});
 const proposals=[],observed=[];
 for(const [dx,dz] of M7_THIRD_REST_CHAMBER.directions){
  const out=[];let blocked=null;
  for(let n=1;n<=M7_THIRD_REST_CHAMBER.spoke;n++){
   const x=center.x+dx*n,z=center.z+dz*n;
   const c=originalCap(world,cells,x,center.floor,z);
   if(!c){blocked=[x,center.floor,z];break;}
   out.push(Object.freeze({...c,originalThirdChamberStep:n}));
  }
  observed.push(Object.freeze({direction:[dx,dz],
   supportedRealSourceSteps:out.length,blocked}));
  if(blocked)continue;
  const back=[...out.slice(0,-1)].reverse();
  const full=[...plan.path.slice(0,at+1),...out,...back,
    Object.freeze({...centerCap,originalThirdChamberReturn:true}),
    ...plan.path.slice(at+1)];
  for(let i=1;i<full.length;i++)
   if(Math.abs(full[i].x-full[i-1].x)+
      Math.abs(full[i].z-full[i-1].z)!==1)
    throw Error('Original chamber candidate has non-authored diagonal segment');
  proposals.push(Object.freeze({...plan,path:Object.freeze(full),
   originalThirdChamberSpoke:Object.freeze(out),
   originalThirdChamberDirection:Object.freeze([dx,dz]),
   originalThirdChamberOutAndBackSteps:2*out.length,
   entireThirdRestChamberAccepted:false,
   fullDeepNetworkAccepted:false}));
 }
 if(!proposals.length)return denied('no-author-supported-third-chamber-spoke',
  {center:[center.x,center.floor,center.z],
   sourceDirections:Object.freeze(observed)});
 return Object.freeze({ok:true,
  sourceCenter:Object.freeze([center.x,center.floor,center.z]),
  originalSourceDirections:Object.freeze(observed),
  candidates:Object.freeze(proposals),physicallyWalked:false});
}
export function surveyOriginalM7ThirdChamberPhysicalReturn(world){
 const source=planOriginalM7ThirdChamberRoundTrip(world);
 if(!source.ok)return source;
 const attempts=[];
 for(const plan of source.candidates){
  const result=replayFullOriginalM7CaveAnchorWalk(world,plan);
  attempts.push(Object.freeze({direction:plan.originalThirdChamberDirection,
    physicallyWalked:result.ok,reason:result.ok?null:result.reason,
    ticks:result.ticks}));
  if(!result.ok)continue;
  const far=plan.originalThirdChamberSpoke.at(-1);
  if(!result.legs.some(l=>
    l.target.join(',')===pos(far).join(',')))
   throw Error('No actual original stepPlayer waypoint reached third chamber interior');
  if(result.actualDeepSpiralStepsWalked!==
     M7_THIRD_REST_CHAMBER.resumeSpiralStep||
     !result.sourceAnchorActuallyWalked)
   throw Error('Authentic third chamber did not return and resume original deep spiral');
  return Object.freeze({ok:true,plan,
   replay:result,attempts:Object.freeze(attempts),
   physicallyReachedRealThirdChamberInterior:true,
   physicallyReturnedToOriginalSpiral:true,
   fullThirdChamberNotClaimed:true,
   deepNetworkComplete:false});
 }
 return denied('source-backed-third-chamber-not-physically-walkable',
  {sourceAuthenticated:true,attempts:Object.freeze(attempts)});
}
