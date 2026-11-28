// Phase 2 — source-exact 6-connected path audits of the DETACHED cave proposal.
// Does not import any production world. A 6-connected voxel path proves geometric
// air continuity, NOT walking grade, collision physics, renderability or gameplay.
import {planUnderworldRegion,UNDERWORLD_LEVELS,UNDERWORLD_REGION_SIDE}
 from './worldwide-network.mjs';
import {detachedCalibratedUnderworldAirAt}
 from './depth-calibrated-proposal.mjs';
import {proposedSurfaceAirAt} from './surface-entrance-proposal.mjs';

const coord=v=>v&&[v.x,v.y,v.z].every(Number.isSafeInteger);
const orders=Object.freeze([[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]]);
const triplet=p=>[p.x,p.y,p.z];
const key=p=>p.join(',');
function testManhattan(a,b,airAt){
 const delta=b.map((x,i)=>x-a[i]);
 if(delta.some(d=>Math.abs(d)>1))return {ok:false,reason:'NONLOCAL_VOXEL_STEP'};
 for(const order of orders){
  const p=[...a];let good=true;
  for(const axis of order)if(delta[axis]){
   p[axis]+=delta[axis];
   if(!airAt(...p)){good=false;break;}
  }
  if(good)return {ok:true,steps:Math.abs(delta[0])+Math.abs(delta[1])+Math.abs(delta[2])};
 }
 return {ok:false,reason:'NO_FACE_CONNECTED_STEP'};
}
export function auditCaveCenterline(a,b,airAt,{samplePitch=.5,maxSamples=2000}={}){
 if(!coord(a)||!coord(b)||typeof airAt!=='function'||
   !Number.isFinite(samplePitch)||samplePitch<=0||samplePitch>1||
   !Number.isSafeInteger(maxSamples)||maxSamples<2||maxSamples>10000)
   throw new TypeError('Invalid detached cave centerline audit');
 const distance=Math.hypot(b.x-a.x,b.y-a.y,b.z-a.z);
 const divisions=Math.max(1,Math.ceil(distance/samplePitch));
 if(divisions+1>maxSamples)return Object.freeze({ok:false,reason:'SAMPLE_BUDGET',divisions});
 let faceSteps=0,uniqueCells=0,last=null;
 for(let i=0;i<=divisions;i++){
  const t=i/divisions;
  const q=[Math.round(a.x+(b.x-a.x)*t),
   Math.round(a.y+(b.y-a.y)*t),Math.round(a.z+(b.z-a.z)*t)];
  if(last&&key(q)===key(last))continue;
  if(!airAt(...q))return Object.freeze({ok:false,reason:'SEALED_CENTERLINE',at:q,index:i,divisions,faceSteps});
  if(last){
   const join=testManhattan(last,q,airAt);
   if(!join.ok)return Object.freeze({ok:false,reason:join.reason,from:last,to:q,faceSteps});
   faceSteps+=join.steps;
  }
  uniqueCells++;last=q;
 }
 return Object.freeze({ok:true,divisions,uniqueCells,faceSteps,
   faceConnectedVoxelRoute:true,playerWalkableNotProven:true});
}
export function auditRegionNetworkContinuity(seed,rx,rz){
 if(!Number.isSafeInteger(seed)||seed!==(seed|0)||
   ![rx,rz].every(Number.isSafeInteger))throw new TypeError('Invalid region connectivity audit');
 const plan=planUnderworldRegion(seed,rx,rz);
 const airAt=(x,y,z)=>detachedCalibratedUnderworldAirAt(seed,x,y,z);
 const results=[];
 // Full generator-owned corridor list: four portals x 2 segments x four
 // levels, three depth connectors, one upper access socket.
 for(let i=0;i<plan.capsules.length;i++){
  const {a,b}=plan.capsules[i];
  results.push(Object.freeze({capsule:i,...auditCaveCenterline(a,b,airAt)}));
 }
 for(let i=0;i<UNDERWORLD_LEVELS.length;i++){
  const current=plan.layers[i],neighbors=[
   ['west',rx-1,rz,'east'],['east',rx+1,rz,'west'],
   ['north',rx,rz-1,'south'],['south',rx,rz+1,'north']];
  for(const [name,nx,nz,back] of neighbors){
   const other=planUnderworldRegion(seed,nx,nz).layers[i].portals[back];
   const portal=current.portals[name];
   const match=key(triplet(portal))===key(triplet(other));
   const eastWest=name==='east'||name==='west';
   const p0={...portal,[eastWest?'x':'z']:portal[eastWest?'x':'z']-3};
   const p1={...portal,[eastWest?'x':'z']:portal[eastWest?'x':'z']+3};
   results.push(Object.freeze({portal:i+':'+name,match,
    ...auditCaveCenterline(p0,p1,airAt)}));
  }
 }
 const failures=results.filter(v=>!v.ok||v.match===false);
 return Object.freeze({
  seed,rx,rz,pass:failures.length===0,
  routesChecked:results.length,physicalVoxelRouteChecks:results.reduce((s,r)=>s+(r.faceSteps??0),0),
  failures:Object.freeze(failures.slice(0,12)),
  supportedModes:'face-connected voxel AIR and Creative flight routes ONLY',
  walkingGradeVerified:false,worldM7Integrated:false
 });
}
export function auditProposedSurfaceConnection(seed,proposal){
 if(!Number.isSafeInteger(seed)||seed!==(seed|0)||!proposal||proposal.ok!==true||
   proposal.seed!==seed)throw new TypeError('Invalid surface connection audit');
 const airAt=(x,y,z)=>proposedSurfaceAirAt(proposal,x,y,z)||
   (y<=-4&&detachedCalibratedUnderworldAirAt(seed,x,y,z));
 const results=proposal.segments.map(({a,b})=>auditCaveCenterline(a,b,airAt));
 const failures=results.filter(x=>!x.ok);
 return Object.freeze({seed,pass:failures.length===0,segments:results.length,
  physicalVoxelRouteChecks:results.reduce((s,x)=>s+(x.faceSteps??0),0),
  failures:Object.freeze(failures),
  proposedEntranceOnly:true,protectedLiveM7CellsNotChecked:true,
  walkingGradeVerified:false});
}
