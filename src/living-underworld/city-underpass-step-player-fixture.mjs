// Living Underworld Phase 21: strictly read-only, hypothetical movement gate.
// Executes the ORIGINAL game stepPlayer() and collides() against a sealed
// PROPOSED voxel deck. Does not read M7, mutate saves, place a bridge, or
// establish any actual player/iPhone/installed-PWA acceptance.
import {BLOCK,BODY_RADIUS,BODY_HEIGHT,collides} from '../voxel.mjs';
import {STEP_HEIGHT,stepPlayer} from '../physics.mjs';
import {auditCandidateUnderpassPlayerAabb}
 from './city-underpass-player-aabb-fixture.mjs';
import {auditSupportedEntranceStairs} from './walkable-entrance-stairs.mjs';
const INT=Number.isSafeInteger;
const KEY=(x,y,z)=>x+','+y+','+z;
const MAX_CELLS=20000;
const reject=(reason,details={})=>Object.freeze({ok:false,reason,
 ...details,originalStepPlayerImported:true,
 actualOriginalStepPlayerInvoked:details.actualOriginalStepPlayerInvoked===true,
 originalM7SourceAuthenticated:false,existingM7TerrainRead:false,
 genuineWorldWalkingProven:false,installedPwaAccepted:false,
 worldChanged:false,noWorldWrites:true});
function raster(proposal){
 const grade=auditSupportedEntranceStairs(proposal,{maxCells:MAX_CELLS});
 if(!grade.ok)return {ok:false,reason:'STEP_ORIGINAL_STAIR_GRADE_VETO',
  failures:grade.failures};
 const supports=new Set(),air=new Set(),sections=[];
 let previous=null;
 for(const {a,b} of proposal.segments){
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  const n=Math.max(Math.abs(dx),Math.abs(dz));
  const alongX=Math.abs(dx)>=Math.abs(dz);
  for(let i=0;i<=n;i++){
   const t=i/n,x=Math.round(a.x+dx*t),
    y=Math.round(a.y+dy*t),z=Math.round(a.z+dz*t);
   if(previous&&previous.x===x&&previous.z===z)continue;
   for(const [ox,oz] of (alongX?[[0,-1],[0,0],[0,1]]:
    [[-1,0],[0,0],[1,0]])){
    const sx=x+ox,sz=z+oz;
    supports.add(KEY(sx,y-1,sz));
    for(let h=0;h<3;h++)air.add(KEY(sx,y+h,sz));
   }
   sections.push(Object.freeze({x,y,z}));
   previous={x,y,z};
  }
 }
 if(supports.size!==grade.supportCells||air.size!==grade.clearanceCells)
  return {ok:false,reason:'STEP_STAIR_RASTER_PARITY_VETO'};
 return {ok:true,supports,air,sections};
}
// Tests BOTH directions for each changed-height edge. A grade may be
// geometrically supported but fail the actual step-up/down controller.
export function auditCandidateUnderpassStepPlayer({
 accessProposal,underpassProposal,centerSidePad,floorY,
 maxCandidateCells=MAX_CELLS,maxElevationEdges=128,
 maxFramesPerEdge=120,frameDt=1/60
}={}){
 if(!centerSidePad||!['x','y','z'].every(k=>INT(centerSidePad[k]))||
  !INT(floorY)||centerSidePad.y!==floorY+1||
  !INT(maxCandidateCells)||maxCandidateCells<100||maxCandidateCells>MAX_CELLS||
  !INT(maxElevationEdges)||maxElevationEdges<1||maxElevationEdges>128||
  !INT(maxFramesPerEdge)||maxFramesPerEdge<12||maxFramesPerEdge>240||
  !Number.isFinite(frameDt)||frameDt<1/120||frameDt>1/30)
  throw TypeError('Invalid original-stepPlayer sealed fixture inputs');
 if(BODY_RADIUS!==.28||BODY_HEIGHT!==1.78||STEP_HEIGHT!==1.01)
  return reject('ORIGINAL_PLAYER_PHYSICS_CONTRACT_CHANGED');
 const body=auditCandidateUnderpassPlayerAabb({
  accessProposal,underpassProposal,centerSidePad,floorY,maxCandidateCells
 });
 if(!body.ok)return reject('STEP_REQUIRES_ORIGINAL_AABB_PASS',{
  aabbReason:body.reason});
 const access=raster(accessProposal),bridge=raster(underpassProposal);
 if(!access.ok)return reject(access.reason);
 if(!bridge.ok)return reject(bridge.reason);
 const supports=new Set([...access.supports,...bridge.supports]),
  air=new Set([...access.air,...bridge.air]);
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
  for(let y=floorY-5;y<=floorY+9;y++){
   const k=KEY(centerSidePad.x+dx,y,centerSidePad.z+dz);
   if(y<=floorY)supports.add(k);else air.add(k);
  }
 if(supports.size+air.size>maxCandidateCells||
  supports.size!==body.supportCells||air.size!==body.explicitFutureAirCells)
  return reject('STEP_AABB_STENCIL_PARITY_VETO');
 for(const k of supports)if(air.has(k))
  return reject('STEP_STAGED_VOXEL_INTERSECTION',{cell:k});
 const sections=[...access.sections,...bridge.sections];
 if(sections.length!==body.routeThreeWideSections)
  return reject('STEP_ROUTE_SECTION_PARITY_VETO');
 const edges=[];
 for(let i=1;i<sections.length;i++){
  const a=sections[i-1],b=sections[i];
  // Original access and bridge both include their shared terminal cell.
  if(a.x===b.x&&a.z===b.z&&a.y===b.y)continue;
  if(Math.abs(a.x-b.x)>1||Math.abs(a.z-b.z)>1||
    Math.abs(a.y-b.y)>1||a.x===b.x&&a.z===b.z)
   return reject('STEP_NONADJACENT_CENTERLINE',{edgeIndex:i-1});
  if(a.y!==b.y)edges.push(Object.freeze({index:i-1,a,b}));
 }
 if(edges.length!==body.skippedElevationEdges)
  return reject('STEP_ELEVATION_CENSUS_DRIFT',{
   actual:edges.length,aabb:body.skippedElevationEdges});
 if(edges.length>maxElevationEdges)
  return reject('STEP_GRADE_EDGE_BUDGET',{
   elevationEdges:edges.length,maxElevationEdges});
 // Unknown voxels remain STONE, even if the historical world might have AIR.
 // There is NO write method or production world reference in this fixture.
 const world={get:(x,y,z)=>air.has(KEY(x,y,z))?BLOCK.AIR:BLOCK.STONE};
 let totalFrames=0,totalStepEvents=0,forwardChecks=0,reverseChecks=0;
 const moves=[];
 const drive=(a,b,direction,index)=>{
  const targetX=b.x+.5,targetZ=b.z+.5;
  const p={x:a.x+.5,z:a.z+.5,feet:a.y,
   yaw:Math.atan2(b.x-a.x,b.z-a.z),pitch:0,
   vX:0,vZ:0,vY:0,onGround:true,coyote:.09,jumpBuffer:0};
  if(collides(world,p.x,p.feet,p.z)||
    !collides(world,p.x,p.feet-.002,p.z))
   return reject('STEP_INITIAL_BODY_OR_SUPPORT_INVALID',{
    edgeIndex:index,direction});
  let arrived=false,stepEvents=0,blockedFrames=0,frames=0;
  for(;frames<maxFramesPerEdge;frames++){
   const distance=Math.hypot(targetX-p.x,targetZ-p.z);
   const forward=distance>.085?1:0;
   if(forward)p.yaw=Math.atan2(targetX-p.x,targetZ-p.z);
   const event=stepPlayer(world,p,{forward,strafe:0,jump:false},frameDt);
   totalFrames++;if(event.stepped){stepEvents++;totalStepEvents++;}
   if(event.hitWall)blockedFrames++;
   if(collides(world,p.x,p.feet,p.z))
    return reject('STEP_ORIGINAL_PLAYER_BODY_COLLIDED',{
     edgeIndex:index,direction,frame:frames,
     actualOriginalStepPlayerInvoked:true});
   if(Math.hypot(targetX-p.x,targetZ-p.z)<=.12&&
      Math.abs(p.feet-b.y)<=.025&&
      p.onGround&&collides(world,p.x,p.feet-.002,p.z)){
    arrived=true;break;
   }
  }
  const record=Object.freeze({edgeIndex:index,direction,arrived,
   frames:frames+Number(arrived),stepEvents,blockedFrames,
   end:Object.freeze({x:p.x,feet:p.feet,z:p.z}),
   desired:Object.freeze({x:targetX,feet:b.y,z:targetZ})});
  moves.push(record);
  if(!arrived)return reject('STEP_ORIGINAL_MOVEMENT_DID_NOT_REACH_TARGET',{
    ...record,elevationEdges:edges.length,checkedMoves:moves.length,
    totalFrames,actualOriginalStepPlayerInvoked:true});
  return null;
 };
 for(const {index,a,b} of edges){
  const f=drive(a,b,'forward',index);if(f)return f;
  forwardChecks++;
  const r=drive(b,a,'reverse',index);if(r)return r;
  reverseChecks++;
 }
 return Object.freeze({ok:true,
  kind:'original-stepPlayer-on-hypothetical-sealed-three-wide-stair-deck',
  elevationEdges:edges.length,forwardChecks,reverseChecks,
  totalFrames,totalStepEvents,frameDt,maxFramesPerEdge,
  actualOriginalStepPlayerInvoked:edges.length>0,
  originalCollidesUsedForEveryMovementFrame:edges.length>0,
  repeatedOriginalPhysicsSubstepsPreserved:edges.length>0,
  allChangedHeightEdgesBidirectionallyTraversed:true,
  existingBlockShapeOverlaysNotSimulated:true,
  originalM7SourceAuthenticated:false,
  genuineWorldWalkingProven:false,installedPwaAccepted:false,
  outsideStagedClearanceConservativelySolid:true,
  noWorldWrites:true,worldChanged:false});
}
