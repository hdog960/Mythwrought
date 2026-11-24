// Phase35: RESEARCH-ONLY subset of the existing worldwide AIR proposal.
// NO live game imports, edits, settlement generation, renderer, save or PWA.
// Keep exactly the original region graph, hub centers, bends and portals.
// Reduce only inflated upper-layer room wings and upper connecting tube radii.
// Every proposed cell MUST already belong to the original networkAirAt mask.
import {planUnderworldRegion,networkAirAt,UNDERWORLD_REGION_SIDE}
 from './worldwide-network.mjs';

export const UPPER_HUB_COMPACT_PROFILE=Object.freeze({
 name:'upper-hub-compact-research-only-v1',
 roomScale:0.7,tubeRadiusCap:3.6,
 maxFiveBiomeOwnedInteriorCuts:10000,
 originalGeometryIsAnImmutableUpperBound:true,
 generatedOriginalWorldUntouched:true,
 liveGameplayNotEnabled:true
});
const INT=Number.isSafeInteger,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const inScaledRoom=(x,y,z,r,scale)=>{
 if(Math.abs(x-r.x)>r.rx*scale||Math.abs(y-r.y)>r.ry*scale||
    Math.abs(z-r.z)>r.rz*scale)return false;
 const a=(x-r.x)/(r.rx*scale),b=(y-r.y)/(r.ry*scale),
  c=(z-r.z)/(r.rz*scale);
 return a*a+b*b+c*c<=1;
};
const inOriginalTubeAtRadius=(x,y,z,t,radius)=>{
 const b=t.bounds;
 if(x<b.minX||x>b.maxX||y<b.minY||y>b.maxY||
    z<b.minZ||z>b.maxZ)return false;
 const dx=t.b.x-t.a.x,dy=(t.b.y-t.a.y)*1.5,dz=t.b.z-t.a.z;
 const px=x-t.a.x,py=(y-t.a.y)*1.5,pz=z-t.a.z;
 const d=dx*dx+dy*dy+dz*dz;
 const f=d?clamp((px*dx+py*dy+pz*dz)/d,0,1):0;
 const ax=px-f*dx,ay=py-f*dy,az=pz-f*dz;
 return ax*ax+ay*ay+az*az<=radius*radius;
};
export function compactUpperHubResearchAirAt(seed,x,y,z){
 // Native original predicate owns all input validation and density bounds.
 // First enforce SUBSET: a compact proposal can never cut old-world voxels
 // that the original fixed route topology did not request.
 if(!networkAirAt(seed,x,y,z))return false;
 // Rare-city ellipses are far below -80; deep-city, middle/deep/lowest
 // rooms and original future access geometries stay in the original mask.
 if(y<=-80)return true;
 const rx=Math.floor(x/UNDERWORLD_REGION_SIDE),
  rz=Math.floor(z/UNDERWORLD_REGION_SIDE);
 const region=planUnderworldRegion(seed,rx,rz);
 // The frozen Phase2 region uses four levels, eight segments per level,
 // three interlevel joins and one final upper-socket tube.
 // A changed plan layout must be re-engineered, never silently accepted.
 if(region.layers.length!==4||region.capsules.length!==36)
  throw Error('COMPACT_UPPER_HUB_PLAN_LAYOUT_CHANGED');
 for(let level=0;level<region.layers.length;level++)
  if(inScaledRoom(x,y,z,region.layers[level].room,
    level===0?UPPER_HUB_COMPACT_PROFILE.roomScale:1))
   return true;
 for(let i=0;i<region.capsules.length;i++){
  const t=region.capsules[i];
  // 0..7: upper corridors, 16: upper-to-middle connection,
  // 35: surface socket. Others stay completely unchanged.
  const upper=i<8||i===16||i===35;
  const radius=upper?Math.min(t.radius,
   UPPER_HUB_COMPACT_PROFILE.tubeRadiusCap):t.radius;
  if(inOriginalTubeAtRadius(x,y,z,t,radius))return true;
 }
 return false;
}
// Deterministic physical upper hub centerline witnesses, no terrain queries.
export function compactUpperHubResearchAnchors(seed,rx,rz){
 if(!INT(rx)||!INT(rz))throw TypeError('Invalid compact research region');
 const p=planUnderworldRegion(seed,rx,rz),upper=p.layers[0];
 return Object.freeze({
  hub:upper.hub,portals:upper.portals,
  surfaceSocket:p.surfaceSocket,
  stage:'research-only',
  playerWalkingVerified:false,
  worldChanged:false
 });
}
