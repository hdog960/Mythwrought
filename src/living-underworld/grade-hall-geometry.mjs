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
// New authored cross-vault shapes retain the lower-room crown and the
// original cardinal room axes. These are independent geometry parameters,
// not budget-dependent cut removal. Four-block headroom starts at the
// frozen middle hub grade, with a narrow raised central junction.
export const CROWN_HALL_PROFILES=freeze([
 freeze({id:'cross-vault-narrow',roomScale:.16,halfWidth:1.55,shaftRadius:1.15,roomHeight:3,crownWidth:0,crownHeight:4,junctionRadius:2}),
 freeze({id:'cross-vault-balanced',roomScale:.18,halfWidth:1.65,shaftRadius:1.15,roomHeight:3,crownWidth:1,crownHeight:4,junctionRadius:2}),
 freeze({id:'cross-vault-narrow-raised',roomScale:.16,halfWidth:1.55,shaftRadius:1.65,roomHeight:3,crownWidth:0,crownHeight:5,junctionRadius:2}),
 freeze({id:'cross-vault-balanced-raised',roomScale:.18,halfWidth:1.65,shaftRadius:1.65,roomHeight:3,crownWidth:1,crownHeight:5,junctionRadius:3})
]);
export const JOINED_CROWN_PROFILES=freeze([
 freeze({...CROWN_HALL_PROFILES[0],id:'joined-crown-slender',roomScale:.12,halfWidth:1.55,westSpoke:1,collarRadius:1.8}),
 freeze({...CROWN_HALL_PROFILES[0],id:'joined-crown-graded',roomScale:.14,halfWidth:1.55,westSpoke:1,collarRadius:2.2})
]);
// Preserve actual middle hall grades and original gallery clearance; taper
// the overly broad below-room transition into the original deep tube.
// These are geometry profiles, never a cut-budget-based truncation.
const taperedSocketHall=freeze({...JOINED_CROWN_PROFILES[0],id:'socket-union-tapered',middleWidth:1.15,middleTailRadius:1.35,crownHeight:3,collarRadius:1.5});
export const SOCKET_UNION_PROFILES=freeze([
 freeze({...JOINED_CROWN_PROFILES[0],id:'socket-union-slender-baseline'}),
 taperedSocketHall,
 freeze({...JOINED_CROWN_PROFILES[0],id:'socket-union-ribbed',middleWidth:1.35,middleTailRadius:1.7,crownHeight:4,collarRadius:1.5})
]);
// The captured projection supplies both qualified stair volumes independently.
// Keep the hall and portal geometry while dropping the duplicate round shafts.
export const EXACT_STAIR_HALL_PROFILE=freeze({...taperedSocketHall,id:'socket-union-exact-stairs',exactStairways:true});
function middleCross(x,y,z,r,p){
 const dx=x-r.x,dz=z-r.z;
 if(y<r.y||y>=r.y+p.crownHeight)return false;
 // Cross-shaped supported lower hall with unchanged frozen room envelope.
 // Upper slice alone cannot prove its floor, which is below the old window.
 return (Math.abs(dz)<=p.crownWidth&&Math.abs(dx)<=r.rx)||
        (Math.abs(dx)<=p.crownWidth&&Math.abs(dz)<=r.rz)||
        (dx*dx+dz*dz<=p.junctionRadius*p.junctionRadius);
}
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
 if(!COMPACT_DECK_PROFILES.includes(profile)&&!CROWN_HALL_PROFILES.includes(profile)&&!JOINED_CROWN_PROFILES.includes(profile)&&!SOCKET_UNION_PROFILES.includes(profile))throw Error('UNKNOWN_FROZEN_COMPACT_PROFILE');
 if(!compactUpperHubResearchAirAt(seed,x,y,z))return false;
 return gradeHallInsideOriginalMask(seed,x,y,z,profile);
}
// Call only with already authenticated membership in compact original mask.
export function gradeHallInsideOriginalMask(seed,x,y,z,p){
 if(y<=-80&&(!p.middleTailRadius||y<=-90))return true;
 const plan=planUnderworldRegion(seed,Math.floor(x/UNDERWORLD_REGION_SIDE),Math.floor(z/UNDERWORLD_REGION_SIDE));
 if(plan.capsules.length!==36||plan.layers.length!==4)throw Error('FROZEN_NETWORK_TOPOLOGY_CHANGED');
 for(let i=0;i<plan.layers.length;i++){
  const r=plan.layers[i].room;
  if(i===1&&p.crownHeight&&middleCross(x,y,z,r,p))return true;
  if(i===1&&p.westSpoke){
   // Directional room branch at the measured missing west crown aperture.
   // Original mask remains the hard envelope; do not invent exterior rock cuts.
   const t={a:{x:r.x,y:r.y,z:r.z},b:{x:r.x-r.rx,y:r.y+1,z:r.z+Math.round(r.rz*.3)}};
   if(gradeBand(x,y,z,t,p.westSpoke))return true;
  }
  if(i<2?room(x,y,z,r,p):((x-r.x)/r.rx)**2+((y-r.y)/r.ry)**2+((z-r.z)/r.rz)**2<=1)return true;
 }
 for(let i=0;i<plan.capsules.length;i++){
  const t=plan.capsules[i];
  if(i<16){if(gradeBand(x,y,z,t,i>=8&&p.middleWidth?p.middleWidth:p.halfWidth))return true;}
  else if(i===16||i===35){
   if(p.exactStairways)continue;
   const radius=i===16&&p.collarRadius&&y>=plan.layers[0].hub.y-7?p.collarRadius:p.shaftRadius;
   if(shaft(x,y,z,t,radius))return true;
  }
  else if(i===25&&p.middleTailRadius){const mix=clamp((-80-y)/10),radius=p.middleTailRadius+(t.radius-p.middleTailRadius)*mix;if(shaft(x,y,z,t,radius))return true;}
  else if(shaft(x,y,z,t,t.radius))return true;
 }
 return false;
}
