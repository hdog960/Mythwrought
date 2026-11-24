// ORIGINAL M7 upper mineral branch, lateral 34-cell natural author-source
// corridor and main-route rejoin. This route is authentic only when the
// actual original upperCaveCells owner, combined cave reader, world.get,
// 3 exact AIR headroom cells and whole-body support certify every floor.
// No invented bridge, synthetic floor, portal, teleport, player reset or
// production source modifications. Real unchanged 25ms stepPlayer must walk
// outside→main→lateral→vault lip→same main→main endpoint.
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';
import {UPPER_SITES} from '../cave-approaches/upper-network.mjs';
import {
 auditOriginalM7UpperAnchorWalk,originalM7UpperOwnedPhysicalFloor
} from './enchanted-original-upper-owner-walk-audit.mjs';
import {replayFullOriginalM7CaveAnchorWalk}
 from './enchanted-original-full-anchor-continuity.mjs';
export const ORIGINAL_UPPER_LATERAL_LIMIT=Object.freeze({
 mainJunctionStep:110,sideStepsMax:34,mainFinishStep:120,
 branches:Object.freeze(['upper24-windcut','upper24-hollowbend'])
});
const reject=(reason,detail={})=>Object.freeze({ok:false,reason,...detail});
const three=p=>[p.x,p.surface,p.z];
export function planOriginalM7UpperMineralSideReturn(world,name,{sideSteps=34}={}){
 if(world?.profile?.generator!==M7_ENVIRONMENT_GENERATOR||
   !Number.isInteger(world.seed)||world.seed!==(world.seed|0)||
   !ORIGINAL_UPPER_LATERAL_LIMIT.branches.includes(name)||
   !Number.isInteger(sideSteps)||sideSteps<1||
   sideSteps>ORIGINAL_UPPER_LATERAL_LIMIT.sideStepsMax)
   throw Error('Invalid original M7 authored side-gallery route request');
 const q=auditOriginalM7UpperAnchorWalk(world,name,{
    ownerSteps:ORIGINAL_UPPER_LATERAL_LIMIT.mainFinishStep,
    sourceOnly:true
 });
 if(!q.ok)return reject('original-upper-main-source-absent',
    {sourceReason:q.reason,sourceStep:q.atStep??null});
 if(q.upperPhysicsAccepted||!q.originalOwnerSourcePlan?.path)
   throw Error('Original upper side planner may only use unwalked authenticated source');
 const main=q.originalOwnerSourcePlan;
 const index=main.path.findIndex(p=>p.upperRouteStep===
   ORIGINAL_UPPER_LATERAL_LIMIT.mainJunctionStep&&p.corner===false);
 if(index<0)throw Error('Actual original upper main junction missing');
 const center=main.path[index];
 const site=UPPER_SITES[name==='upper24-windcut'?0:1];
 const baseZ=site.z+Math.round(3*Math.sin(110/13));
 const originalFloor=-8-Math.floor(110/6);
 if(center.x!==site.x+110||center.z!==baseZ||
   center.surface!==originalFloor)
  throw Error('Actual original side junction not equal to upper author d=110 geometry');
 const direction=site.x<0?-1:1;
 const away=[];
 for(let i=1;i<=sideSteps;i++){
  const x=center.x,z=center.z+direction*i;
  const source=originalM7UpperOwnedPhysicalFloor(world,name,x,originalFloor,z);
  if(!source)return reject('original-lateral-owner-floor-or-air-absent',
   {name,atLateralStep:i,originalCell:[x,originalFloor,z],
    genuinelyAuthoredSteps:away.length});
  if(Math.abs(source.feet-center.feet)>1.01)
   return reject('original-lateral-physical-drop-unadmitted',
    {name,atLateralStep:i,actualFeet:source.feet,mainFeet:center.feet});
  away.push(Object.freeze({...source,originalUpperLateralStep:i}));
 }
 const back=[...away.slice(0,-1)].reverse();
 const full=[
   ...main.path.slice(0,index+1),
   ...away,...back,
   Object.freeze({...center,originalLateralReturnToMain:true}),
   ...main.path.slice(index+1)
 ];
 for(let i=1;i<full.length;i++){
  const a=full[i-1],b=full[i];
  if(Math.abs(a.x-b.x)+Math.abs(a.z-b.z)!==1||
     Math.abs(a.feet-b.feet)>1.01)
   throw Error('Original upper side route did not remain cardinal and source-height admissible');
 }
 return Object.freeze({ok:true,name,sideSteps,
  realJunction:Object.freeze(three(center)),
  authenticSideEnd:Object.freeze(three(away.at(-1))),
  originalAuthenticatedSideFloors:Object.freeze(away),
  physicallyWalked:false,sourceOnly:true,
  originalMain120Cells:main.path.length,
  completeContinuousSourcePlan:Object.freeze({...main,
    path:Object.freeze(full),originalSideBranchOutAndBack:2*sideSteps,
    sourceOwnedUpperRouteSteps:120,
    fullDeepNetworkAccepted:false}),
  sideVaultInteriorFullyProven:false});
}
export function surveyOriginalM7UpperMineralSideReturn(world,name,{sideSteps=34}={}){
 const plan=planOriginalM7UpperMineralSideReturn(world,name,{sideSteps});
 if(!plan.ok)return plan;
 const real=replayFullOriginalM7CaveAnchorWalk(world,plan.completeContinuousSourcePlan);
 if(!real.ok)return reject('original-lateral-player-physics-failed',{
  name,sourceAuthenticated:true,sideSteps,
  exactPhysicsFailure:real.reason,actualTicks:real.ticks,
  firstBlockedIndex:real.failedAt??null,
  actualPlayer:real.actualPlayer??null});
 const end=plan.authenticSideEnd;
 if(!real.legs.some(l=>l.target.join(',')===end.join(','))||
    !real.legs.some(l=>l.target.join(',')===plan.realJunction.join(',')))
   throw Error('Actual original player failed to visit and return from lateral branch');
 return Object.freeze({ok:true,name,sideSteps,
  sourcePlan:plan,realPlayer:real,
  physicallyVisitedOriginalVaultBranch:true,
  physicallyReturnedToOriginalUpperMain:true,
  physicallyFinishedOriginalUpperMain120:true,
  wholeUpperNetworkAccepted:false,sideVaultInteriorFullyProven:false});
}
