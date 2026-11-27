// Detached geometric alternatives, not arbitrary cell filtering by budget.
// Original gallery routes remain the horizontal pedestrian spine. Widen only
// above its rounded grade, and use smaller explicit room and vertical shapes.
import {planUnderworldRegion,UNDERWORLD_REGION_SIDE} from './worldwide-network.mjs';
import {compactUpperHubResearchAirAt} from './compact-upper-hub-research.mjs';
const freeze=Object.freeze;
export const COMPACT_DECK_PROFILES=freeze([
 freeze({id:'grade-hall-a',roomScale:.18,halfWidth:1.25,shaftRadius:1.05,roomHeight:3}),
 freeze({id:'grade-hall-b',roomScale:.25,halfWidth:1.65,shaftRadius:1.15,roomHeight:3}),
 freeze({id:'grade-hall-c',roomScale:.32,halfWidth:2.05,shaftRadius:1.35,roomHeight:4}),
 freeze({id:'grade-hall-d',roomScale:.39,halfWidth:2.4,shaftRadius:1.55,roomHeight:4})
]);
const clamp=t=>Math.max(0,Math.min(1,t));
function gradeBand(x,y,z,t,width){
 const dx=t.b.x-t.a.x,dz=t.b.z-t.a.z;
 const d=dx*dx+dz*dz;if(!d)return false;
 const f=clamp(((x-t.a.x)*dx+(z-t.a.z)*dz)/d);
 const a=x-t.a.x-f*dx,b=z-t.a.z-f*dz;
 const grade=Math.round(t.a.y+(t.b.y-t.a.y)*f);
 return a*a+b*b<=width*width&&y>=grade&&y<=grade+2;
}
function shaft(x,y,z,t,r){
 const dx=t.b.x-t.a.x,dy=(t.b.y-t.a.y)*1.5,dz=t.b.z-t.a.z;
 const a=x-t.a.x,b=(y-t.a.y)*1.5,c=z-t.a.z;
 const d=dx*dx+dy*dy+dz*dz,f=d?clamp((a*dx+b*dy+c*dz)/d):0;
 return (a-f*dx)**2+(b-f*dy)**2+(c-f*dz)**2<=r*r;
}
function room(x,y,z,r,p){
 const a=(x-r.x)/(r.rx*p.roomScale),b=(z-r.z)/(r.rz*p.roomScale);
 return a*a+b*b<=1&&y>=r.y-1&&y<r.y-1+p.roomHeight;
}
export function gradeHallAirAt(seed,x,y,z,profile){
 if(!COMPACT_DECK_PROFILES.includes(profile))throw Error('UNKNOWN_FROZEN_COMPACT_PROFILE');
 if(!compactUpperHubResearchAirAt(seed,x,y,z))return false;
 return gradeHallInsideOriginalMask(seed,x,y,z,profile);
}
// Call only with already authenticated membership in compact original mask.
export function gradeHallInsideOriginalMask(seed,x,y,z,p){
 if(y<=-80)return true;
 const plan=planUnderworldRegion(seed,Math.floor(x/UNDERWORLD_REGION_SIDE),Math.floor(z/UNDERWORLD_REGION_SIDE));
 if(plan.capsules.length!==36||plan.layers.length!==4)throw Error('FROZEN_NETWORK_TOPOLOGY_CHANGED');
 for(let i=0;i<plan.layers.length;i++){
  const r=plan.layers[i].room;
  if(i<2?room(x,y,z,r,p):((x-r.x)/r.rx)**2+((y-r.y)/r.ry)**2+((z-r.z)/r.rz)**2<=1)return true;
 }
 for(let i=0;i<plan.capsules.length;i++){
  const t=plan.capsules[i];
  if(i<16){if(gradeBand(x,y,z,t,p.halfWidth))return true;}
  else if(i===16||i===35){if(shaft(x,y,z,t,p.shaftRadius))return true;}
  else if(shaft(x,y,z,t,t.radius))return true;
 }
 return false;
}
