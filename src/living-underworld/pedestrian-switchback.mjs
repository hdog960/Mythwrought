// Living Underworld P3 - proposed PEDESTRIAN switchback for steep detached tunnels.
// Never carves voxels, builds steps, bypasses original source ownership, or
// changes original M7 player physics. The -4 socket is NOT an approved surface
// entrance: the switchback ends at -7, before protected legacy strata.
import {planUnderworldRegion,UNDERWORLD_REGION_SIDE}
 from './worldwide-network.mjs';
import {auditSupportedEntranceStairs}
 from './walkable-entrance-stairs.mjs';
import {auditCaveCenterline}
 from './physical-connectivity-audit.mjs';
import {proposedSurfaceAirAt}
 from './surface-entrance-proposal.mjs';

const INT=Number.isSafeInteger;
const CONNECTOR_INDICES=Object.freeze([16,25,34,35]);
const asPoint=(x,y,z)=>Object.freeze({x,y,z});
const eq=(a,b)=>a.x===b.x&&a.y===b.y&&a.z===b.z;
export function planDetachedPedestrianSwitchback(seed,rx,rz,index){
 if(!INT(seed)||seed!==(seed|0)||![rx,rz].every(INT)||
    !CONNECTOR_INDICES.includes(index))
  throw new TypeError('Invalid protected pedestrian connector input');
 const region=planUnderworldRegion(seed,rx,rz);
 const original=region.capsules[index],isSocket=index===35;
 const a=original.a;
 const b=isSocket?asPoint(original.b.x,-7,original.b.z):original.b;
 const cx=Math.round((a.x+b.x)/2),cz=Math.round((a.z+b.z)/2);
 const R=44,FLAT=8;
 const ys=[a.y,...[1,2,3].map(k=>
  Math.round(a.y+(b.y-a.y)*k/4)),b.y];
 const [y0,y1,y2,y3,y4]=ys;
 const pts=[a,
  asPoint(cx+R,y0,cz+R),
  asPoint(cx+R-FLAT,y0,cz+R),
  asPoint(cx-R+FLAT,y1,cz+R),
  asPoint(cx-R,y1,cz+R),
  asPoint(cx-R,y1,cz+R-FLAT),
  asPoint(cx-R,y2,cz-R+FLAT),
  asPoint(cx-R,y2,cz-R),
  asPoint(cx-R+FLAT,y2,cz-R),
  asPoint(cx+R-FLAT,y3,cz-R),
  asPoint(cx+R,y3,cz-R),
  asPoint(cx+R,y3,cz-R+FLAT),
  asPoint(cx+R,y4,cz+R-FLAT),
  asPoint(cx+R,y4,cz+R),b];
 const segments=Object.freeze(pts.slice(1).map((v,i)=>
  Object.freeze({a:pts[i],b:v,radius:3.8}))
  .filter(s=>!eq(s.a,s.b)));
 return Object.freeze({ok:true,seed,rx,rz,index,
  kind:isSocket?'underground-socket-handoff':'deep-interlevel-ramp',
  original,from:a,to:b,segments,
  radius:3.8,threeWideDryRunOnly:true,
  stopsBeforeProtectedSurface:isSocket,
  remainingOriginalSocketRise:isSocket?original.b.y-b.y:0,
  notExistingAir:true,notPlacedInWorld:true,
  physicalPlayerCollisionUnverified:true,
  existingVoxelOrAuthoredSourceProvenanceUnverified:true});
}
export function auditDetachedPedestrianSwitchback(seed,rx,rz,index,
 {validateCandidateAir=false}={}){
 if(typeof validateCandidateAir!=='boolean')
  throw new TypeError('Invalid switchback AIR sampling flag');
 const proposal=planDetachedPedestrianSwitchback(seed,rx,rz,index);
 const step=auditSupportedEntranceStairs(proposal,{maxCells:20000});
 const isLocal=proposal.segments.every(({a,b})=>
  [a,b].every(p=>Math.floor(p.x/UNDERWORLD_REGION_SIDE)===rx&&
   Math.floor(p.z/UNDERWORLD_REGION_SIDE)===rz)&&
  [a,b].every(p=>p.y>=-210&&p.y<=-4));
 const corridor=validateCandidateAir?
  proposal.segments.map(({a,b})=>auditCaveCenterline(a,b,
   (x,y,z)=>proposedSurfaceAirAt(proposal,x,y,z))):[];
 const routeFaceConnected=validateCandidateAir?
  corridor.every(q=>q.ok):null;
 return Object.freeze({ok:step.ok&&isLocal&&
  (routeFaceConnected===null||routeFaceConnected),
  seed,rx,rz,index,kind:proposal.kind,
  originalDirectGradePass:auditSupportedEntranceStairs({
   ok:true,segments:[proposal.original]}).ok,
  proposedStairGeometryPass:step.ok,
  candidateRouteFaceConnected:routeFaceConnected,
  withinOriginalRegion:isLocal,
  candidateSupportCells:step.supportCells,
  candidateClearanceCells:step.clearanceCells,
  conflicts:step.conflictCells,
  maximumStepRise:step.maximumStepRise,
  plannedSegments:proposal.segments.length,
  caveVolumeActuallyCarved:false,stepsActuallyPlaced:false,
  originalM7ProtectionAudited:false,
  sourceVoxelParityNotProven:true,playerWalkingNotProven:true,
  protectedSurfaceHandoffRequired:proposal.stopsBeforeProtectedSurface,
  remainingOriginalSocketRise:proposal.remainingOriginalSocketRise,
  reasons:Object.freeze([
   ...step.failures,...(!isLocal?['OUTSIDE_REGION_OR_WORLD']:[]),
   ...corridor.filter(q=>!q.ok).map(q=>q.reason)
  ])});
}
export function auditDetachedNetworkPedestrianReadiness(seed,rx,rz){
 const network=planUnderworldRegion(seed,rx,rz),stairs=auditSupportedEntranceStairs;
 const horizontalPairs=[],originals=[],switchbacks=[];
 for(const first of [0,8,17,26])for(let j=0;j<4;j++){
  const i=first+j*2,check=stairs({ok:true,segments:[
   network.capsules[i],network.capsules[i+1]
  ]});
  horizontalPairs.push(Object.freeze({index:i,ok:check.ok,
   reason:check.failures}));
 }
 for(const i of CONNECTOR_INDICES){
  const current=auditDetachedPedestrianSwitchback(seed,rx,rz,i);
  originals.push(Object.freeze({index:i,ok:current.originalDirectGradePass}));
  switchbacks.push(current);
 }
 return Object.freeze({seed,rx,rz,
  horizontalPairedTotal:horizontalPairs.length,
  horizontalPairedPassed:horizontalPairs.filter(v=>v.ok).length,
  directConnectorTotal:originals.length,
  directConnectorPassed:originals.filter(v=>v.ok).length,
  proposedSwitchbackTotal:switchbacks.length,
  proposedSwitchbackPassed:switchbacks.filter(v=>v.ok).length,
  horizontalPairs:Object.freeze(horizontalPairs),
  directConnectors:Object.freeze(originals),
  switchbacks:Object.freeze(switchbacks),
  onlyDryRunGeometricCandidates:true,
  realPlayerWalkingNotProven:true,
  actualM7AirCarved:false});
}
