// Read-only voxel-column connectivity proof for the FUTURE thin city
// underpass, original city approach and full-depth destination landing.
// Independently reconstructs the original 3-wide stepped pedestrian masks.
// Never writes M7, certifies original source ownership, builds settlements,
// simulates player physics or approves an installed PWA.
import {auditSupportedEntranceStairs}
 from './walkable-entrance-stairs.mjs';
const INT=Number.isSafeInteger;
const KEY=(x,y,z)=>x+','+y+','+z;
const XYZ=k=>k.split(',').map(Number);
const SAME=(a,b)=>a&&b&&['x','y','z'].every(k=>a[k]===b[k]);
const NEIGHBORS=Object.freeze([[1,0],[-1,0],[0,1],[0,-1]]);
const MAX_VOXELS=50000;
const refuse=(reason,extra={})=>Object.freeze({
 ok:false,reason,...extra,provenOriginalM7PhysicalWalking:false,
 sourceTerrainNeverRead:true,worldChanged:false
});
function raster(proposal,kind,maxCells){
 if(!proposal||proposal.ok!==true||!Array.isArray(proposal.segments)||
  proposal.segments.length<1)return null;
 const g=auditSupportedEntranceStairs(proposal,{maxCells:20000});
 if(!g.ok)return {ok:false,reason:'ORIGINAL_THREE_WIDE_GRADE_VETO',
  gradeFailures:g.failures};
 const supports=new Set(),air=new Set(),sections=[];
 let previous=null;
 for(const {a,b} of proposal.segments){
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z,
   horizontal=Math.max(Math.abs(dx),Math.abs(dz));
  const alongX=Math.abs(dx)>=Math.abs(dz);
  for(let i=0;i<=horizontal;i++){
   const t=i/horizontal,x=Math.round(a.x+dx*t),
    y=Math.round(a.y+dy*t),z=Math.round(a.z+dz*t);
   if(previous&&previous.x===x&&previous.z===z)continue;
   const offsets=alongX?[[0,-1],[0,0],[0,1]]:
    [[-1,0],[0,0],[1,0]];
   const cells=[];
   for(const [ox,oz] of offsets){
    const xx=x+ox,zz=z+oz;
    const foot=KEY(xx,y,zz);
    supports.add(KEY(xx,y-1,zz));
    for(let h=0;h<3;h++)air.add(KEY(xx,y+h,zz));
    cells.push(foot);
   }
   sections.push(Object.freeze({center:KEY(x,y,z),
    lateral:Object.freeze(cells)}));
   previous={x,y,z};
   if(supports.size+air.size>maxCells)
    return {ok:false,reason:'WALKABLE_NETWORK_VOXEL_BUDGET'};
  }
 }
 if(g.supportCells!==supports.size||g.clearanceCells!==air.size)
  return {ok:false,reason:'ORIGINAL_STAIR_RASTER_PARITY_VETO'};
 return {ok:true,kind,supports,air,sections,
  start:proposal.segments[0].a,end:proposal.segments.at(-1).b};
}
export function auditThinUnderpassPedestrianConnectivity({
 accessProposal,underpassProposal,centerSidePad,floorY,
 maxVoxelCells=MAX_VOXELS,maxWalkNodes=12000
}={}){
 if(!accessProposal||!underpassProposal||
  !centerSidePad||!['x','y','z'].every(k=>INT(centerSidePad[k]))||
  !INT(floorY)||floorY< -209||floorY>9||
  centerSidePad.y!==floorY+1||
  !INT(maxVoxelCells)||maxVoxelCells<100||maxVoxelCells>MAX_VOXELS||
  !INT(maxWalkNodes)||maxWalkNodes<9||maxWalkNodes>12000)
  throw TypeError('Invalid read-only three-wide physical connectivity proof');
 const access=raster(accessProposal,'city-access',maxVoxelCells);
 const bridge=raster(underpassProposal,'thin-underpass',maxVoxelCells);
 if(!access?.ok)return refuse(access?.reason??'INVALID_CITY_APPROACH',{
  gradeFailures:access?.gradeFailures??[]});
 if(!bridge?.ok)return refuse(bridge?.reason??'INVALID_UNDERPASS',{
  gradeFailures:bridge?.gradeFailures??[]});
 if(!SAME(access.end,bridge.start)||
    !SAME(bridge.end,centerSidePad))
  return refuse('CITY_APPROACH_UNDERPASS_PAD_ENDPOINT_DISCONTINUITY');
 const support=new Set([...access.supports,...bridge.supports]),
  air=new Set([...access.air,...bridge.air]);
 // Full center-side 3x3 landing consists of SIX support courses and NINE
 // clearance courses: a thin walking point is NOT an adequate destination.
 let padSupport=0,padAir=0;
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++){
  const x=centerSidePad.x+dx,z=centerSidePad.z+dz;
  for(let y=floorY-5;y<=floorY+9;y++){
   if(y<=floorY){support.add(KEY(x,y,z));padSupport++;}
   else{air.add(KEY(x,y,z));padAir++;}
  }
 }
 if(padSupport!==54||padAir!==81)
  throw Error('Underpass full center-side pad raster drifted');
 if(support.size+air.size>maxVoxelCells)
  return refuse('COMBINED_UNDERPASS_AND_PAD_VOXEL_BUDGET',{
   supportCells:support.size,airCells:air.size});
 for(const k of support)if(air.has(k))
  return refuse('UNDERPASS_SUPPORT_BLOCKS_WALKING_AIR',{
   conflictingCell:k});
 const walkable=new Set();
 for(const k of support){
  const [x,y,z]=XYZ(k),foot=KEY(x,y+1,z);
  if(air.has(foot)&&air.has(KEY(x,y+2,z))&&
     air.has(KEY(x,y+3,z)))walkable.add(foot);
 }
 if(walkable.size>maxWalkNodes)return refuse('WALKABLE_NETWORK_NODE_BUDGET',{
  nodes:walkable.size,maxWalkNodes});
 const from=KEY(access.start.x,access.start.y,access.start.z),
  seam=KEY(bridge.start.x,bridge.start.y,bridge.start.z),
  end=KEY(centerSidePad.x,centerSidePad.y,centerSidePad.z);
 if(!walkable.has(from)||!walkable.has(seam)||!walkable.has(end))
  return refuse('UNDERPASS_ACCESS_SEAM_OR_PAD_NOT_GROUNDED',{
   firstStepGrounded:walkable.has(from),seamGrounded:walkable.has(seam),
   padGrounded:walkable.has(end)});
 // Four-neighbor horizontal movement plus bounded single-step rises/falls:
 // corner-touching diagonal-only pixels cannot impersonate a walkable route.
 const queue=[from],visited=new Set([from]),distance=new Map([[from,0]]);
 for(let i=0;i<queue.length;i++){
  const [x,y,z]=XYZ(queue[i]);
  for(const [dx,dz] of NEIGHBORS)for(const rise of [0,1,-1]){
   const next=KEY(x+dx,y+rise,z+dz);
   if(walkable.has(next)&&!visited.has(next)){
    visited.add(next);distance.set(next,distance.get(queue[i])+1);
    queue.push(next);
   }
  }
 }
 const allSections=[...access.sections,...bridge.sections];
 let fullWidthSections=0,firstNarrow=null;
 for(const section of allSections){
  if(section.lateral.length===3&&
    section.lateral.every(k=>visited.has(k)))fullWidthSections++;
  else if(!firstNarrow)firstNarrow=section.center;
 }
 let landingFootCells=0;
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
  if(visited.has(KEY(centerSidePad.x+dx,centerSidePad.y,
   centerSidePad.z+dz)))landingFootCells++;
 const connected=visited.has(seam)&&visited.has(end)&&
  fullWidthSections===allSections.length&&landingFootCells===9;
 if(!connected)return refuse('THREE_WIDE_PEDESTRIAN_GRAPH_DISCONNECTED',{
  firstNarrowSection:firstNarrow,
  accessToPadReached:visited.has(end),
  fullWidthSections,requiredFullWidthSections:allSections.length,
  landingFootCells,reachableNodes:visited.size,
  totalCandidateNodes:walkable.size});
 return Object.freeze({
  ok:true,kind:'detached-three-wide-underpass-access-and-pad-footgraph',
  originalCityApproachThreeWideConnected:true,
  underpassAllThreeWideSectionsReached:true,
  centerSideLandingAllNineFootPositionsReached:true,
  fourNeighborFootstepsWithAtMostOneRiseVerified:true,
  fullWidthSections,reachableNodes:visited.size,
  totalCandidateNodes:walkable.size,accessToPadMinSteps:distance.get(end),
  supportCells:support.size,clearanceCells:air.size,
  centerPadSupportCells:padSupport,centerPadClearanceCells:padAir,
  accessStart:access.start,sharedCityAccessUnderpassSeam:bridge.start,
  centerSidePad,
  originalM7VoxelSourceUnverified:true,
  actualThreeWidePlayerAabbCollisionUnverified:true,
  renderGeometryAndGpuUnverified:true,
  actualPlayerWalkingUnverified:true,worldChanged:false
 });
}
