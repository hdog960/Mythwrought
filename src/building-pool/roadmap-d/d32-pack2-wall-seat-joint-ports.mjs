// MYTHWROUGHT D32. Read-only clearance research of genuine Pack2-source OBBs.
// Source owner OBBs are clipped along their own centerline, never altering
// original walls, roofs, WALK, Pack2 block IDs, registry or gameplay.  Source-
// clear volume is NOT a load-rated joint, mesh, block, save, or approval.
import {d31PreviewHitsAABB,d31OBBsOverlap,d31RayOwnerPreview}
 from './d31-pack2-owner-oblique-preview.mjs';
const EPS=1e-8;
const dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const vsub=(a,b)=>a.map((x,i)=>x-b[i]);
const vadd=(a,b)=>a.map((x,i)=>x+b[i]);
const mul=(a,f)=>a.map(x=>x*f);
const len=a=>Math.hypot(...a);
const finite3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const own=o=>o&&finite3(o.center)&&Array.isArray(o.axes)&&o.axes.length===3&&
 o.axes.every(finite3)&&finite3(o.half)&&o.half.every(n=>n>EPS);
const bounds=parts=>{const min=[Infinity,Infinity,Infinity],max=[-Infinity,-Infinity,-Infinity];
 for(const b of parts){for(let j=0;j<3;j++){
  const r=b.half.reduce((s,h,i)=>s+h*Math.abs(b.axes[i][j]),0);
  min[j]=Math.min(min[j],b.center[j]-r);max[j]=Math.max(max[j],b.center[j]+r);
 }}return Object.freeze({min:Object.freeze(min),max:Object.freeze(max)});};
/** Clip each ORIGINAL 3-box owner's transformed OBB on planes perpendicular
 * to its member axis. Exact box intersection; preserves original transverse
 * cross-sections. This CANNOT generate an approved rendered end cap. */
export function clipD32OriginalOwnerAxially(g,cutStart=0,cutEnd=0){
 if(!g||![61,62].includes(g.sourceOwnerId)||!finite3(g.start)||!finite3(g.end)||
    !Array.isArray(g.ownerOBBs)||g.ownerOBBs.length!==3||g.ownerOBBs.some(x=>!own(x))||
    ![cutStart,cutEnd].every(x=>Number.isFinite(x)&&x>=0))
  throw TypeError('D32 authentic three-part Pack2 owner geometry required');
 const v=vsub(g.end,g.start),L=len(v),u=mul(v,1/L);
 if(!(L>=.5&&L<=5)||cutStart+cutEnd>=L-.05)
  throw RangeError('D32 a physical member must retain a bounded positive length');
 const obbs=[];
 for(const ob of g.ownerOBBs){
  const idx=ob.axes.findIndex(a=>Math.abs(dot(a,u))>1-1e-7);
  if(idx<0)throw Error('D32 owner longitudinal physical axis changed');
  const half=ob.half[idx],center=dot(vsub(ob.center,g.start),u),
   lo=Math.max(center-half,cutStart),hi=Math.min(center+half,L-cutEnd);
  if(hi-lo<=EPS)continue;
  const nextCenter=vadd(ob.center,mul(u,(lo+hi)/2-center));
  const nextHalf=[...ob.half];nextHalf[idx]=(hi-lo)/2;
  obbs.push(Object.freeze({ownerPart:ob.ownerPart,center:Object.freeze(nextCenter),
   axes:ob.axes,half:Object.freeze(nextHalf)}));
 }
 if(!obbs.length)throw Error('D32 axial cut deletes every true original owner part');
 return Object.freeze({format:'mythwrought.builder-d.d32.unregistered-source-clip.v1',
  start:g.start,end:g.end,sourceOwnerId:g.sourceOwnerId,
  ownerOBBs:Object.freeze(obbs),bounds:bounds(obbs),cutStart,cutEnd,
  physicalSourceBoxClippingExact:true,originalOwnerModified:false,
  originalMeshEndCapsNotAuthored:true,approvedCompositeCollider:false,
  slotOrFastenerPhysicallyInstalled:false,constructionAllowed:false});
}
/** Original wall source stays an unmodified full cube at x/z anchored endpoint.
 * Discover the minimum source-preserving axial cut. A tangent/point contact
 * is NOT a positive area bearing and cannot transmit proven loads. */
export function findD32NonintrusiveWallSeat(g,wall,{atEnd=false,maxCut=1.5}={}){
 if(!Array.isArray(wall)||wall.length!==3||!wall.every(Number.isSafeInteger)||
    typeof atEnd!=='boolean'||!Number.isFinite(maxCut)||maxCut<=0||maxCut>1.5)
  throw TypeError('D32 exact original integer rooted wall and budget required');
 const lo=wall,hi=wall.map(x=>x+1),lo5=[wall[0],5,wall[2]],
  hi5=[wall[0]+1,6,wall[2]+1],
  L=len(vsub(g.end,g.start)),max=Math.min(maxCut,L-.1),
  cut=t=>clipD32OriginalOwnerAxially(g,atEnd?0:t,atEnd?t:0),
  collides=part=>d31PreviewHitsAABB(part,lo,hi)||d31PreviewHitsAABB(part,lo5,hi5);
 if(max<=0||collides(cut(max)))
  return Object.freeze({seatable:false,cut:null,sourceWallIntersectionUnresolved:true,
   capWallFaceArea:0,constructionAllowed:false});
 let left=0,right=max;
 for(let i=0;i<32;i++){const mid=(left+right)/2;
  if(collides(cut(mid)))left=mid;else right=mid;}
 const t=Math.min(max,right+1e-6),trim=cut(t);
 if(collides(trim))throw Error('D32 original wall source penetration after axial truncation');
 // Parallel roof chord: true planar cap may be flush to the wall face, but
 // this numerical epsilon clearance means it has no ACTUAL positive-area
 // wall touching surface. Diagonal oblique cap has no coincident wall plane.
 const u=mul(vsub(g.end,g.start),1/L),axis=Math.abs(u[0])>.99?0:Math.abs(u[2])>.99?2:-1;
 const wallFaceAxis=wall[0]+.5===g.start[0]||wall[0]+.5===g.end[0]?0:
   wall[2]+.5===g.start[2]||wall[2]+.5===g.end[2]?2:-1;
 const parallelCapToWall=axis===wallFaceAxis&&axis>=0;
 return Object.freeze({seatable:true,cut:t,trimmed:trim,
  sourceWallIntersectionUnresolved:false,
  parallelCapToWall,capWallFaceArea:0,
  positiveAreaWallTransferCertified:false,
  originalWallUnaltered:true,physicalFastenerAbsent:true,
  sourceOwnerWorldMeshNeedsNewCap:true,constructionAllowed:false});
}
/** Reserve finite axial clearance at both theoretical pin ends; residual
 * overlapping physical pieces are counted rather than silently reclassified
 * as rated sockets. The deliberately disconnected joint port is NOT a joint. */
export function inspectD32UnratedPinPorts(members,sourceNodes,{cutback=.35,maxPairs=4096}={}){
 if(!Array.isArray(members)||!Array.isArray(sourceNodes)||!Number.isFinite(cutback)||
    cutback<0||cutback>.45||!Number.isSafeInteger(maxPairs)||maxPairs<1||maxPairs>10000)
  throw TypeError('D32 physical joint port study invalid');
 const ports=new Map(sourceNodes.map(n=>[n.id,[]]));let residual=0,baseline=0,pairs=0,clippedMemberCount=0;
 for(let i=0;i<members.length;i++){
  const {member,shape}=members[i];if(!member||!shape||!ports.has(member.from)||!ports.has(member.to))
   throw Error('D32 source graph or owner material counterfeit');
  const L=len(vsub(shape.end,shape.start));const trim=Math.min(cutback,(L-.06)/2);
  const physical=clipD32OriginalOwnerAxially(shape,trim,trim);clippedMemberCount++;
  ports.get(member.from).push({i,physical,original:shape});ports.get(member.to).push({i,physical,original:shape});
 }
 for(const arr of ports.values())for(let i=0;i<arr.length;i++)for(let j=i+1;j<arr.length;j++){
  if(++pairs>maxPairs)throw RangeError('D32 incident joint pair budget');
  if(arr[i].original.ownerOBBs.some(a=>arr[j].original.ownerOBBs.some(b=>d31OBBsOverlap(a,b))))baseline++;
  if(arr[i].physical.ownerOBBs.some(a=>arr[j].physical.ownerOBBs.some(b=>d31OBBsOverlap(a,b))))residual++;
 }
 return Object.freeze({nodes:sourceNodes.length,members:clippedMemberCount,pairs,
  originalOverlappingPairs:baseline,overlappingResidualPairs:residual,unresolvedOriginalPinNodes:sourceNodes.length,
  jointPortsAreDisconnectedWithoutOwnerApprovedConnector:true,
  physicalClipsUnregistered:true,realMomentAndAxialStrengthUnknown:true,
  proofOfNonoverlapAndRatedConnection:false,constructionAllowed:false});
}
/** Picking probe uses the same exact physical source OBBs after clipping.
 * The original uncapped textured mesh CANNOT be accepted for rendering. */
export function d32RayClippedOwner(g,origin,direction,limit=8){
 return d31RayOwnerPreview(g,origin,direction,limit);
}
