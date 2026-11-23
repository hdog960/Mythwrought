// Phase 26: independent expected ORIGINAL reader-cell footprint from a proposed
// future 3-wide bridge and full-depth 3x3 landing. No source callbacks, no
// mutation, no M7 identity authentication, and no real-game walking proof.
const INT=Number.isSafeInteger;
const K=(x,y,z)=>`${x},${y},${z}`;
const refuse=(reason,extra={})=>Object.freeze({ok:false,reason,...extra,
 originalM7WorldAuthenticated:false,worldChanged:false,noWorldWrites:true});
export function deriveExpectedUnderpassSourceCoordinates({
 bridgeProposal,centerSidePad,floorY,maxCells=20000
}={}){
 if(!bridgeProposal||bridgeProposal.ok!==true||
    !Array.isArray(bridgeProposal.segments)||
    bridgeProposal.segments.length<1||bridgeProposal.segments.length>128||
    !centerSidePad||!INT(floorY)||
    !['x','y','z'].every(k=>INT(centerSidePad[k]))||
    centerSidePad.y!==floorY+1||!INT(maxCells)||
    maxCells<135||maxCells>20000)
  throw TypeError('Invalid independent underpass source footprint request');
 const support=new Set(),air=new Set();
 let first=null,previous=null,steps=0;
 for(const {a,b} of bridgeProposal.segments){
  if(!a||!b||![a.x,a.y,a.z,b.x,b.y,b.z].every(INT))
   return refuse('EXPECTED_BRIDGE_INVALID_ENDPOINT');
  const dx=b.x-a.x,dy=b.y-a.y,dz=b.z-a.z;
  if(![dx,dy,dz].every(Number.isSafeInteger))
   return refuse('EXPECTED_BRIDGE_COORDINATE_OVERFLOW');
  const length=Math.max(Math.abs(dx),Math.abs(dz));
  if(length<1||length>maxCells||Math.abs(dy)>length)
   return refuse('EXPECTED_BRIDGE_UNSUPPORTED_GRADE');
  const offsets=Math.abs(dx)>=Math.abs(dz)?[[0,-1],[0,0],[0,1]]:
   [[-1,0],[0,0],[1,0]];
  for(let i=0;i<=length;i++){
   const t=i/length,p={x:Math.round(a.x+dx*t),
    y:Math.round(a.y+dy*t),z:Math.round(a.z+dz*t)};
   if(![p.x,p.y,p.z].every(INT))
    return refuse('EXPECTED_BRIDGE_COORDINATE_OVERFLOW');
   if(!first)first=p;
   if(previous&&previous.x===p.x&&previous.z===p.z){
    if(previous.y!==p.y)return refuse('EXPECTED_BRIDGE_VERTICAL_ONLY');
    continue;
   }
   if(previous&&(Math.abs(previous.x-p.x)>1||
     Math.abs(previous.y-p.y)>1||Math.abs(previous.z-p.z)>1))
    return refuse('EXPECTED_BRIDGE_NONADJACENT_WALK');
   if(p.y-1< -210||p.y+2>19)
    return refuse('EXPECTED_BRIDGE_OUTSIDE_WORLD_BOUNDS');
   for(const [ox,oz] of offsets){
    const x=p.x+ox,z=p.z+oz;
    if(!INT(x)||!INT(z))
     return refuse('EXPECTED_BRIDGE_COORDINATE_OVERFLOW');
    support.add(K(x,p.y-1,z));
    for(let h=0;h<3;h++)air.add(K(x,p.y+h,z));
   }
   previous=p;steps++;
   if(steps>maxCells||support.size+air.size>maxCells)
    return refuse('EXPECTED_BRIDGE_VOXEL_BUDGET');
  }
 }
 if(!first||!previous||!bridgeProposal.segments[0]||
   !['x','y','z'].every(k=>
     first[k]===bridgeProposal.segments[0].a[k]&&
     previous[k]===bridgeProposal.segments.at(-1).b[k]))
  return refuse('EXPECTED_BRIDGE_ENDPOINT_MISMATCH');
 for(const k of support)if(air.has(k))
  return refuse('EXPECTED_BRIDGE_SUPPORT_AIR_CONFLICT');
 const bridge=new Set([...support,...air]);
 const pad=new Set();
 for(let dx=-1;dx<=1;dx++)for(let dz=-1;dz<=1;dz++)
  for(let y=floorY-5;y<=floorY+9;y++){
   if(y< -210||y>19)return refuse('EXPECTED_PAD_OUTSIDE_WORLD_BOUNDS');
   const x=centerSidePad.x+dx,z=centerSidePad.z+dz;
   if(!INT(x)||!INT(z))return refuse('EXPECTED_PAD_COORDINATE_OVERFLOW');
   pad.add(K(x,y,z));
  }
 if(pad.size!==135||bridge.size!==support.size+air.size||
   pad.size>maxCells||bridge.size>maxCells)
  return refuse('EXPECTED_SOURCE_FOOTPRINT_PARITY_VETO');
 let overlapCells=0;
 for(const k of pad)if(bridge.has(k))overlapCells++;
 return Object.freeze({ok:true,
  bridgeCoordinates:Object.freeze([...bridge]),
  padCoordinates:Object.freeze([...pad]),
  bridgeSupportCells:support.size,bridgeAirCells:air.size,
  bridgeCells:bridge.size,padCells:pad.size,
  expectedOverlapCells:overlapCells,
  expectedCombinedUniqueCells:bridge.size+pad.size-overlapCells,
  centerlineSteps:steps,
  sourceReaderIdentityCallerOnly:true,
  originalM7WorldAuthenticated:false,worldChanged:false,noWorldWrites:true});
}
