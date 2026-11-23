// Phase 22: a BOUNDED, uninterrupted original stepPlayer physical traversal
// on a HYPOTHETICAL sealed future three-wide deck. Nothing is built or saved.
// All historical M7 natural AIR/ore/edits, authored cave voxels, player-added
// structures, block-shape overlays, phone performance and release remain UNKNOWN.
import {BLOCK,BODY_RADIUS,BODY_HEIGHT,collides} from '../voxel.mjs';
import {STEP_HEIGHT,WALK_SPEED,stepPlayer} from '../physics.mjs';
import {auditSupportedEntranceStairs}
 from './walkable-entrance-stairs.mjs';
import {auditCandidateUnderpassPlayerAabb}
 from './city-underpass-player-aabb-fixture.mjs';
const KEY=(x,y,z)=>x+','+y+','+z;
const INT=Number.isSafeInteger;
const MAX_CELLS=20000;
const SAME=(a,b)=>a.x===b.x&&a.y===b.y&&a.z===b.z;
const refuse=(reason,extra={})=>Object.freeze({
 ok:false,reason,...extra,originalStepPlayerImported:true,
 authenticOriginalM7WorldTested:false,realWorldWalkabilityProven:false,
 originalGamePhysicsFilesModified:false,installedHomeScreenPwaTested:false,
 originalWorldModified:false,noWorldWrites:true
});
function strictRaster(proposal){
 if(!proposal||proposal.ok!==true||!Array.isArray(proposal.segments))
  return {ok:false,reason:'CONTINUOUS_MISSING_STAIR_PROPOSAL'};
 const graded=auditSupportedEntranceStairs(proposal,{maxCells:MAX_CELLS});
 if(!graded.ok)return {ok:false,reason:'CONTINUOUS_ORIGINAL_STAIR_GRADE_UNSAFE',
  failures:graded.failures};
 const support=new Set(),air=new Set(),sections=[];
 let previous=null;
 for(const {a,b} of proposal.segments){
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  const total=Math.max(Math.abs(dx),Math.abs(dz));
  const xMajor=Math.abs(dx)>=Math.abs(dz);
  for(let i=0;i<=total;i++){
   const t=i/total,at={x:Math.round(a.x+dx*t),
    y:Math.round(a.y+dy*t),z:Math.round(a.z+dz*t)};
   if(previous&&at.x===previous.x&&at.z===previous.z){
    if(at.y!==previous.y)
     return {ok:false,reason:'CONTINUOUS_VERTICAL_ONLY_SECTION'};
    continue;
   }
   for(const [ox,oz] of (xMajor?[[0,-1],[0,0],[0,1]]:
    [[-1,0],[0,0],[1,0]])){
    const x=at.x+ox,z=at.z+oz;
    support.add(KEY(x,at.y-1,z));
    for(let h=0;h<3;h++)air.add(KEY(x,at.y+h,z));
   }
   sections.push(Object.freeze(at));previous=at;
  }
 }
 if(graded.supportCells!==support.size||
    graded.clearanceCells!==air.size)
  return {ok:false,reason:'CONTINUOUS_ORIGINAL_RASTER_PARITY_VETO'};
 return {ok:true,support,air,sections};
}
export function auditCandidateUnderpassContinuousStepPlayer({
 accessProposal,underpassProposal,centerSidePad,floorY,
 maxCandidateCells=MAX_CELLS,maxWaypoints=256,
 maxFramesPerWaypoint=180,maxTotalFrames=16000,frameDt=1/60
}={}){
 if(!centerSidePad||!['x','y','z'].every(k=>INT(centerSidePad[k]))||
    !INT(floorY)||centerSidePad.y!==floorY+1||
    !INT(maxCandidateCells)||maxCandidateCells<100||
    maxCandidateCells>MAX_CELLS||
    !INT(maxWaypoints)||maxWaypoints<2||maxWaypoints>256||
    !INT(maxFramesPerWaypoint)||maxFramesPerWaypoint<10||
    maxFramesPerWaypoint>240||
    !INT(maxTotalFrames)||maxTotalFrames<20||
    maxTotalFrames>16000||
    !Number.isFinite(frameDt)||frameDt<1/120||frameDt>1/30)
  throw TypeError('Invalid original continuous stepPlayer research fixture');
 if(BODY_RADIUS!==.28||BODY_HEIGHT!==1.78||
    STEP_HEIGHT!==1.01||WALK_SPEED!==4.25)
  return refuse('CONTINUOUS_ORIGINAL_PLAYER_PHYSICS_CHANGED');
 const body=auditCandidateUnderpassPlayerAabb({
  accessProposal,underpassProposal,centerSidePad,floorY,maxCandidateCells
 });
 if(!body.ok)return refuse('CONTINUOUS_PRECONDITION_AABB_REFUSED',{
  aabbReason:body.reason,physicsInvoked:false});
 const a=strictRaster(accessProposal),b=strictRaster(underpassProposal);
 if(!a.ok)return refuse(a.reason,{physicsInvoked:false});
 if(!b.ok)return refuse(b.reason,{physicsInvoked:false});
 const support=new Set([...a.support,...b.support]),
  air=new Set([...a.air,...b.air]);
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
  for(let y=floorY-5;y<=floorY+9;y++){
   const key=KEY(centerSidePad.x+dx,y,centerSidePad.z+dz);
   if(y<=floorY)support.add(key);else air.add(key);
  }
 if(support.size!==body.supportCells||
    air.size!==body.explicitFutureAirCells||
    support.size+air.size>maxCandidateCells)
  return refuse('CONTINUOUS_AABB_VOXEL_PARITY_VETO',{
   physicsInvoked:false});
 for(const k of support)if(air.has(k))
  return refuse('CONTINUOUS_SUPPORT_AIR_INTERSECTION',{cell:k,
   physicsInvoked:false});
 const raw=[...a.sections,...b.sections],walk=[];
 if(raw.length!==body.routeThreeWideSections)
  return refuse('CONTINUOUS_AABB_SECTION_PARITY_VETO',{
   physicsInvoked:false});
 for(const p of raw){
  if(walk.length&&SAME(walk.at(-1),p))continue;
  if(walk.length){
   const prev=walk.at(-1),dx=Math.abs(p.x-prev.x),
    dz=Math.abs(p.z-prev.z),dy=Math.abs(p.y-prev.y);
   if(dx>1||dz>1||dy>1||dx===0&&dz===0)
    return refuse('CONTINUOUS_NONADJACENT_WAYPOINT',{
     previous:prev,next:p,physicsInvoked:false});
  }
  walk.push(p);
 }
 if(walk.length>maxWaypoints)
  return refuse('CONTINUOUS_WAYPOINT_BUDGET',{
   waypoints:walk.length,maxWaypoints,physicsInvoked:false});
 if(walk.length<2||!SAME(walk.at(-1),centerSidePad))
  return refuse('CONTINUOUS_MISSING_PAD_ENDPOINT',{
   physicsInvoked:false});
 let elevationEdges=0;
 for(let i=1;i<walk.length;i++)
  if(walk[i].y!==walk[i-1].y)elevationEdges++;
 if(elevationEdges!==body.skippedElevationEdges)
  return refuse('CONTINUOUS_AABB_ELEVATION_PARITY_VETO',{
   elevationEdges,aabbElevationEdges:body.skippedElevationEdges,
   physicsInvoked:false});
 // No fallback to native M7: outside the explicitly staged AIR is STONE.
 const world={get:(x,y,z)=>air.has(KEY(x,y,z))?BLOCK.AIR:BLOCK.STONE};
 const goalRange=.12,elevationRange=.025;
 let totalFrames=0,stepEvents=0,landings=0;
 const directionResults=[];
 const run=(direction,points)=>{
  const origin=points[0],p={x:origin.x+.5,z:origin.z+.5,
   feet:origin.y,yaw:0,pitch:0,vX:0,vY:0,vZ:0,
   onGround:true,coyote:.09,jumpBuffer:0};
  if(collides(world,p.x,p.feet,p.z)||
     !collides(world,p.x,p.feet-.002,p.z))
   return refuse('CONTINUOUS_UNSUPPORTED_OR_BLOCKED_START',{
    direction,physicsInvoked:false});
  let thisDirectionFrames=0,waypointsReached=0,
   thisDirectionSteps=0,thisDirectionLandings=0;
  for(let i=1;i<points.length;i++){
   const target=points[i],tx=target.x+.5,tz=target.z+.5;
   let reached=false,frames=0;
   for(;frames<maxFramesPerWaypoint;frames++){
    if(totalFrames>=maxTotalFrames)
     return refuse('CONTINUOUS_TOTAL_FRAME_BUDGET',{
      direction,waypoint:i,framesUsed:totalFrames,
      maxTotalFrames,physicsInvoked:true});
    const dx=tx-p.x,dz=tz-p.z,
     distance=Math.hypot(dx,dz),forward=distance>.085?1:0;
    if(forward)p.yaw=Math.atan2(dx,dz);
    const output=stepPlayer(world,p,{
     forward,strafe:0,jump:false
    },frameDt);
    totalFrames++;thisDirectionFrames++;
    if(output.jumped)
     return refuse('CONTINUOUS_UNCOMMANDED_JUMP',{
      direction,waypoint:i,physicsInvoked:true});
    if(output.stepped){stepEvents++;thisDirectionSteps++;}
    if(output.landed){landings++;thisDirectionLandings++;}
    if(![p.x,p.z,p.feet,p.vX,p.vZ,p.vY].every(Number.isFinite)||
       collides(world,p.x,p.feet,p.z))
     return refuse('CONTINUOUS_PLAYER_COLLISION_OR_NONFINITE',{
      direction,waypoint:i,frame:frames,physicsInvoked:true});
    const travelled=Math.hypot(tx-p.x,tz-p.z);
    if(travelled<=goalRange&&
       Math.abs(p.feet-target.y)<=elevationRange&&
       p.onGround&&collides(world,p.x,p.feet-.002,p.z)){
      reached=true;waypointsReached++;break;
    }
   }
   if(!reached)
    return refuse('CONTINUOUS_PHYSICS_WAYPOINT_UNREACHABLE',{
     direction,waypoint:i,target:Object.freeze({...target}),
     position:Object.freeze({x:p.x,feet:p.feet,z:p.z}),
     framesUsed:frames,thisDirectionFrames,waypointsReached,
     totalFrames,physicsInvoked:true});
  }
  return Object.freeze({direction,
   waypointsReached,frames:thisDirectionFrames,
   stepEvents:thisDirectionSteps,landings:thisDirectionLandings,
   finalPosition:Object.freeze({x:p.x,feet:p.feet,z:p.z}),
   exactFinalPadReached:true});
 };
 const forward=run('access-to-pad',walk);
 if(forward.ok===false)return forward;
 directionResults.push(forward);
 const backward=run('pad-to-access',[...walk].reverse());
 if(backward.ok===false)return backward;
 directionResults.push(backward);
 return Object.freeze({ok:true,
  kind:'actual-original-stepPlayer-physics-on-sealed-synthetic-candidate',
  completeForwardAndReverseWithoutPositionReset:true,
  initialPlayerResetOnlyBetweenOppositeDirections:true,
  originalStepPlayerExecuted:true,
  originalCollidesExecuted:true,
  gradeElevationEdges:elevationEdges,routeWaypoints:walk.length,
  directions:Object.freeze(directionResults),
  totalFrames,stepEvents,landings,frameDt,
  hypotheticalSolidCells:support.size,hypotheticalAirCells:air.size,
  sourceMaterialAndOwnershipNotAuditedHere:true,
  livePack2Biome130Pack3Pack5NonblockCollidersNotSimulated:true,
  authenticOriginalM7WorldTested:false,realWorldWalkabilityProven:false,
  installedHomeScreenPwaTested:false,originalWorldModified:false,
  noWorldWrites:true});
}
