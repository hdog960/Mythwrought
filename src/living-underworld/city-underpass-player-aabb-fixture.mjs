// PHASE 21 read-only PLAYER AABB fixture against the ORIGINAL game's
// collides(world,x,feet,z), BODY_RADIUS=.28, BODY_HEIGHT=1.78.
// Builds a deliberately conservative hypothetical STAGED voxel mask for
// candidate stairs/access/pad. Every outside/unknown cell is SOLID, not
// magically assumed existing cave AIR. This is NOT original M7, player
// stepPlayer simulation, saved-world construction or PWA validation.
import {BLOCK,BODY_RADIUS,BODY_HEIGHT,collides}
 from '../voxel.mjs';
import {auditSupportedEntranceStairs}
 from './walkable-entrance-stairs.mjs';
const INT=Number.isSafeInteger;
const KEY=(x,y,z)=>x+','+y+','+z;
const XYZ=k=>k.split(',').map(Number);
const MAX_CELLS=20000;
const fail=(reason,details={})=>Object.freeze({
 ok:false,reason,...details,originalM7SourceAuthenticated:false,
 actualPlayerMovementSimulated:false,noWorldWrites:true
});
function raster(proposal){
 if(!proposal||proposal.ok!==true||!Array.isArray(proposal.segments))
  return null;
 const grade=auditSupportedEntranceStairs(proposal,{maxCells:20000});
 if(!grade.ok)return {ok:false,reason:'ORIGINAL_THREE_WIDE_STAIR_GRADE_UNSAFE',
  gradeFailures:grade.failures};
 const support=new Set(),air=new Set(),sections=[];
 let previous=null;
 for(const {a,b} of proposal.segments){
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  const total=Math.max(Math.abs(dx),Math.abs(dz)),
   alongX=Math.abs(dx)>=Math.abs(dz);
  for(let i=0;i<=total;i++){
   const t=i/total,x=Math.round(a.x+dx*t),
    y=Math.round(a.y+dy*t),z=Math.round(a.z+dz*t);
   if(previous&&previous.x===x&&previous.z===z)continue;
   const lateral=[];
   for(const [ox,oz] of (alongX?[[0,-1],[0,0],[0,1]]:
    [[-1,0],[0,0],[1,0]])){
    const bx=x+ox,bz=z+oz;
    support.add(KEY(bx,y-1,bz));
    for(let h=0;h<3;h++)air.add(KEY(bx,y+h,bz));
    lateral.push(Object.freeze({x:bx,y,z:bz}));
   }
   sections.push(Object.freeze({x,y,z,lateral:Object.freeze(lateral)}));
   previous={x,y,z};
  }
 }
 if(support.size!==grade.supportCells||
  air.size!==grade.clearanceCells)
  throw Error('Original player AABB proposal geometry diverges from strict stair source');
 return {ok:true,support,air,sections};
}
export function auditCandidateUnderpassPlayerAabb({
 accessProposal,underpassProposal,centerSidePad,floorY,
 maxCandidateCells=MAX_CELLS,interpolationStep=.125
}={}){
 if(!centerSidePad||!['x','y','z'].every(k=>INT(centerSidePad[k]))||
  !INT(floorY)||centerSidePad.y!==floorY+1||
  !INT(maxCandidateCells)||maxCandidateCells<100||
  maxCandidateCells>MAX_CELLS||
  !Number.isFinite(interpolationStep)||interpolationStep<.0625||
  interpolationStep>.25)
  throw TypeError('Invalid original-game-player AABB fixture inputs');
 if(BODY_RADIUS!==.28||BODY_HEIGHT!==1.78)
  return fail('ORIGINAL_PLAYER_AABB_DIMENSIONS_CHANGED',{
   radius:BODY_RADIUS,height:BODY_HEIGHT});
 const access=raster(accessProposal),bridge=raster(underpassProposal);
 if(!access?.ok)return fail(access?.reason??'MISSING_ACCESS_PROPOSAL');
 if(!bridge?.ok)return fail(bridge?.reason??'MISSING_BRIDGE_PROPOSAL');
 const start=access.sections.at(-1),seam=bridge.sections[0],
  end=bridge.sections.at(-1);
 if(!start||!seam||!end||
  [start.x,start.y,start.z].some((v,i)=>v!==[seam.x,seam.y,seam.z][i])||
  [end.x,end.y,end.z].some((v,i)=>
   v!==[centerSidePad.x,centerSidePad.y,centerSidePad.z][i]))
  return fail('AABB_ACCESS_BRIDGE_OR_PAD_ENDPOINT_DISCONTINUITY');
 const solid=new Set([...access.support,...bridge.support]),
  air=new Set([...access.air,...bridge.air]);
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
  for(let y=floorY-5;y<=floorY+9;y++){
   const k=KEY(centerSidePad.x+dx,y,centerSidePad.z+dz);
   if(y<=floorY)solid.add(k);else air.add(k);
  }
 if(solid.size+air.size>maxCandidateCells)
  return fail('AABB_STAGED_VOXEL_BUDGET',{
   combinedCells:solid.size+air.size,maxCandidateCells});
 for(const k of solid)if(air.has(k))
  return fail('AABB_STAGED_SOLID_INTERSECTS_STAGED_AIR',{cell:k});
 // Transparent voxel fixture deliberately seals every unknown cell. Only
 // explicitly audited future clearance voxels are considered AIR; no
 // historical cave AIR or original-world overlays are synthesized.
 const staged={
  get:(x,y,z)=>air.has(KEY(x,y,z))?BLOCK.AIR:BLOCK.STONE
 };
 const sections=[...access.sections,...bridge.sections],
  pads=[];for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
   pads.push(Object.freeze({x:centerSidePad.x+dx,
    y:centerSidePad.y,z:centerSidePad.z+dz}));
 let sampledBodyPositions=0,groundProbes=0;
 const sample=(x,feet,z,label)=>{
  sampledBodyPositions++;
  if(collides(staged,x,feet,z))
   return fail('ORIGINAL_AABB_BODY_BLOCKED',{label,
    at:Object.freeze({x,feet,z}),sampledBodyPositions,groundProbes});
  groundProbes++;
  if(!collides(staged,x,feet-.002,z))
   return fail('ORIGINAL_AABB_FLOOR_SUPPORT_MISSING',{label,
    at:Object.freeze({x,feet,z}),sampledBodyPositions,groundProbes});
  return null;
 };
 for(const section of sections){
  for(const p of section.lateral){
   const rejected=sample(p.x+.5,p.y,p.z+.5,'three-wide-route');
   if(rejected)return rejected;
  }
 }
 for(const p of pads){
  const rejected=sample(p.x+.5,p.y,p.z+.5,'nine-cell-full-pad');
  if(rejected)return rejected;
 }
 let sweptFlatEdges=0,skippedElevationEdges=0,
  flatBodySamples=0;
 // At the center of every exact ORIGINAL rasterized stair step, run
 // dense AABB sweeps for adjacent SAME-ELEVATION centers and separately
 // mark untested height-changing edges, which need actual stepPlayer().
 for(let i=1;i<sections.length;i++){
  const a=sections[i-1],b=sections[i];
  if(a.y!==b.y){skippedElevationEdges++;continue}
  const length=Math.hypot(b.x-a.x,b.z-a.z),
   steps=Math.max(1,Math.ceil(length/interpolationStep));
  if(length>Math.SQRT2+1e-7)
   return fail('ORIGINAL_AABB_CENTERLINE_HAS_LONG_GAP',{
    edgeIndex:i-1,length});
  for(let j=0;j<=steps;j++){
   const t=j/steps,x=a.x+.5+(b.x-a.x)*t,
    z=a.z+.5+(b.z-a.z)*t;
   const rejected=sample(x,a.y,z,'swept-level-centerline');
   if(rejected)return {...rejected,edgeIndex:i-1,frac:t};
   flatBodySamples++;
  }
  sweptFlatEdges++;
 }
 return Object.freeze({ok:true,
  kind:'original-game-player-aabb-on-hypothetical-staged-voxels',
  radius:BODY_RADIUS,height:BODY_HEIGHT,
  supportCells:solid.size,explicitFutureAirCells:air.size,
  routeThreeWideSections:sections.length,
  fullLandingFeet:9,
  sampledBodyPositions,groundProbes,
  sweptFlatEdges,flatBodySamples,
  skippedElevationEdges,
  originalCollidesFunctionUsed:true,
  outsideStagedClearanceConservativelySolid:true,
  noOriginalM7TerrainRead:true,
  noOriginalM7VoxelEdit:true,
  noNativeStepPlayerSimulation:true,
  existingAdditionalBlockShapeOverlaysNotSimulated:true,
  realPlayerCollisionAndInstalledPwaNotApproved:true,
  noWorldWrites:true});
}
