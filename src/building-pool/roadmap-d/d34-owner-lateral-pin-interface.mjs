// D34 independent source-only physical triage: original Pack2 ID61 diagonal
// owner relocated into a parallel plane. NO new registered variant, renderer,
// fastener, wall edit, rated joint, physical block or gameplay placement.
import {d31OBBsOverlap,d31RayOwnerPreview,d31PreviewHitsAABB}
 from './d31-pack2-owner-oblique-preview.mjs';
import {clipD32OriginalOwnerAxially} from './d32-pack2-wall-seat-joint-ports.mjs';
const E=1e-8,finite=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const touch=(a,b)=>a.ownerOBBs.some(x=>b.ownerOBBs.some(y=>d31OBBsOverlap(x,y)));
const plus=(a,b)=>a.map((x,i)=>x+b[i]);
const solid=o=>o&&finite(o.center)&&Array.isArray(o.axes)&&o.axes.length===3&&
 o.axes.every(finite)&&finite(o.half)&&o.half.every(x=>x>0);
const bounds=boxes=>{const lo=[Infinity,Infinity,Infinity],hi=[-Infinity,-Infinity,-Infinity];
 for(const b of boxes)for(let j=0;j<3;j++){
  const r=b.half.reduce((t,h,i)=>t+h*Math.abs(b.axes[i][j]),0);
  lo[j]=Math.min(lo[j],b.center[j]-r);hi[j]=Math.max(hi[j],b.center[j]+r);
 }return Object.freeze({min:Object.freeze(lo),max:Object.freeze(hi)});};
/** Only the original ID61 *three-box* owner and an untouched oblique D31
 * geometry can be translated. It is NOT an approved original Pack2 rotation.
 * 0.60 is the source collar's total 0.30+0.30 half-thickness. */
export function deriveD34LateralOriginalWeb(g,plane,side,{offset=.6}={}){
 if(g?.sourceOwnerId!==61||g.sourceOriginalBoxes!==3||
    g.registeredPack2DiagonalVariant!==false||g.plane!==plane||
    !['x','z'].includes(plane)||![1,-1].includes(side)||
    !Number.isFinite(offset)||offset<.6||offset>.9||!finite(g.start)||!finite(g.end)||
    !Array.isArray(g.ownerOBBs)||g.ownerOBBs.length!==3||g.ownerOBBs.some(x=>!solid(x))||
    typeof g.transform!=='function'||!(g.centerlineLength>.5))
  throw TypeError('D34 requires authentic unregistered original ID61 three-box oblique geometry');
 // Genuine original: core 0.48 and collars 0.60 across source width.
 const j=plane==='x'?2:0;
 if(g.ownerOBBs.some((x,i)=>Math.abs(x.half[2]-(i===0?.24:.30))>1e-7))
  throw Error('D34 original Pack2 ID61 lateral source section drifted');
 const shift=[0,0,0];shift[j]=side*offset;
 const boxes=g.ownerOBBs.map(x=>Object.freeze({...x,center:Object.freeze(plus(x.center,shift))}));
 const move=p=>plus(g.transform(p),shift);
 return Object.freeze({format:'mythwrought.builder-d.d34.unregistered-separated-plane-id61.v1',
  sourceOwnerId:61,sourceOriginalBoxes:3,plane,side,offset,
  start:Object.freeze(plus(g.start,shift)),end:Object.freeze(plus(g.end,shift)),
  centerlineLength:g.centerlineLength,ownerOBBs:Object.freeze(boxes),bounds:bounds(boxes),
  transform:move,sourceOriginalRGBPreserved:true,originalOwnerPartCountPreserved:true,
  sourceMeshNeedsNewEndCaps:true,registeredPack2DiagonalVariant:false,
  structuralPinConnectionRated:false,physicalFastenerOrWallSeatInstalled:false,
  originalSourceCellsModified:0,constructionAllowed:false});
}
const polygon=(o,lateral)=>{
 const j=o.axes.findIndex(a=>Math.abs(a[lateral])>1-E);
 if(j<0)throw Error('D34 source-bearing face is not parallel to the offset plane');
 const inPlane=[0,1,2].filter(k=>k!==j),a=o.axes[inPlane[0]],b=o.axes[inPlane[1]],c=o.center,h=o.half;
 return {j,vertices:[[-1,-1],[1,-1],[1,1],[-1,1]].map(([u,v])=>
  [c[0]+u*a[0]*h[inPlane[0]]+v*b[0]*h[inPlane[1]],
   c[1]+u*a[1]*h[inPlane[0]]+v*b[1]*h[inPlane[1]],
   c[2]+u*a[2]*h[inPlane[0]]+v*b[2]*h[inPlane[1]]])};
};
const area2=p=>p.length<3?0:p.reduce((v,x,i)=>v+x[0]*p[(i+1)%p.length][1]-x[1]*p[(i+1)%p.length][0],0)/2;
function cross2(a,b,p){return (b[0]-a[0])*(p[1]-a[1])-(b[1]-a[1])*(p[0]-a[0]);}
function intersectPoly(subject,clip){
 const winding=Math.sign(area2(clip));if(winding===0)return [];
 let out=subject;
 for(let i=0;i<clip.length&&out.length;i++){
  const a=clip[i],b=clip[(i+1)%clip.length],input=out;out=[];
  for(let j=0;j<input.length;j++){
   const p=input[j],q=input[(j+1)%input.length],fp=winding*cross2(a,b,p),fq=winding*cross2(a,b,q);
   if(fp>=-E)out.push(p);
   if((fp>=-E)!==(fq>=-E)){
    const t=fp/(fp-fq);out.push([p[0]+t*(q[0]-p[0]),p[1]+t*(q[1]-p[1])]);
   }
  }
 }
 return out;
}
/** Measure actual touching *side faces*, not adjacent bounding boxes. */
export function measureD34OriginalLateralFaceArea(first,second,plane){
 if(!['x','z'].includes(plane)||!Array.isArray(first?.ownerOBBs)||
    !Array.isArray(second?.ownerOBBs))throw TypeError('D34 source face contact geometry');
 const lateral=plane==='x'?2:0,uv=plane==='x'?[0,1]:[2,1];let count=0,area=0;
 for(const a of first.ownerOBBs)for(const b of second.ownerOBBs){
  if(!solid(a)||!solid(b))throw Error('D34 invalid source-bearing face');
  const A=polygon(a,lateral),B=polygon(b,lateral);
  const face=(o,j,sgn)=>o.center[lateral]+sgn*o.half[j];
  if(Math.abs(face(a,A.j,1)-face(b,B.j,-1))>E&&
     Math.abs(face(a,A.j,-1)-face(b,B.j,1))>E)continue;
  const proj=verts=>verts.map(p=>[p[uv[0]],p[uv[1]]]);
  const intersection=intersectPoly(proj(A.vertices),proj(B.vertices)),s=Math.abs(area2(intersection));
  if(s>E){count++;area+=s;}
 }
 if(!Number.isFinite(area))throw Error('D34 source contact overflow');
 return Object.freeze({sourceSectionFacePairs:count,unratedPositiveAreaContact:area,
  validGeometryOnly:true,connectorFasteningStrengthKnown:false,
  originalOwnerSurfaceMaterialRatingKnown:false,canBuild:false});
}
/** At the original hypothetical pin, classify actual source-owned intersections
 * and still-unrated side-face contacts AFTER conservative D32 end cutbacks. */
export function auditD34PinSplitPlane(node,members,plane,owner={offset:.6,cutback:.45}){
 if(!node||typeof node.id!=='string'||!finite(node.worldAt)||
    !Array.isArray(members)||members.length<2||members.length>8||
    !['x','z'].includes(plane)||!Number.isFinite(owner.offset)||
    owner.offset<.6||owner.offset>.9||!Number.isFinite(owner.cutback)||
    owner.cutback<0||owner.cutback>.45)throw TypeError('D34 genuine pin source interface or budget');
 const built=[];let diagonals=0;
 for(const row of members){
  if(!row?.member||!row.shape||row.member.from!==node.id&&row.member.to!==node.id)
   throw Error('D34 source node and owner incident member mismatch');
  const g=row.shape,L=g.centerlineLength,t=Math.min(owner.cutback,(L-.06)/2);
  const c=clipD32OriginalOwnerAxially(g,t,t);
  if(row.member.type==='diagonal-web'){
   const plus=deriveD34LateralOriginalWeb(g,plane,1,{offset:owner.offset});
   // D32 end cutback applied BEFORE shifting so original collar volumes remain honest.
   const s=clipD32OriginalOwnerAxially(plus,t,t);built.push({...row,part:s,geometricOwner:plus});diagonals++;
  }else built.push({...row,part:c,geometricOwner:g});
 }
 let oldOverlaps=0,remaining=0,faceContact=0,faceArea=0;const overlapsByType={};
 for(let i=0;i<built.length;i++)for(let j=i+1;j<built.length;j++){
  const a=built[i],b=built[j],typ=[a.member.type,b.member.type].sort().join('+');
  const oldA=clipD32OriginalOwnerAxially(a.shape,Math.min(owner.cutback,(a.shape.centerlineLength-.06)/2),Math.min(owner.cutback,(a.shape.centerlineLength-.06)/2));
  const oldB=clipD32OriginalOwnerAxially(b.shape,Math.min(owner.cutback,(b.shape.centerlineLength-.06)/2),Math.min(owner.cutback,(b.shape.centerlineLength-.06)/2));
  if(touch(oldA,oldB)){oldOverlaps++;overlapsByType[typ]=(overlapsByType[typ]||0)+1;}
  if(touch(a.part,b.part))remaining++;
  if(a.member.type==='diagonal-web'||b.member.type==='diagonal-web'){
   const face=measureD34OriginalLateralFaceArea(a.part,b.part,plane);
   faceContact+=face.sourceSectionFacePairs;faceArea+=face.unratedPositiveAreaContact;
  }
 }
 return Object.freeze({originalSamePlaneCollisionPairs:oldOverlaps,
  remainingSplitPlanePositiveVolumePairs:remaining,
  oldOverlapTypes:Object.freeze(overlapsByType),unratedLateralSurfaceFacePairs:faceContact,
  unratedLateralFaceArea:faceArea,originalDiagonalCount:diagonals,
  transformed:Object.freeze(built),originalWallNotModified:true,
  physicalFasteningProven:false,realAxialTransferAuthenticated:false,
  collidersRegistered:false,constructionAllowed:false});
}
/** Strictly source-only geometry; do not import or touch live runtime state. */
export function d34ProbeSourceCellIntersections(g,get,{maxCells=128}={}){
 if(!g?.bounds||!Array.isArray(g.ownerOBBs)||typeof get!=='function'||
    !Number.isSafeInteger(maxCells)||maxCells<1||maxCells>256)
  throw TypeError('D34 source-cell collision query invalid');
 const lo=g.bounds.min.map(v=>Math.floor(v+E)),hi=g.bounds.max.map(v=>Math.ceil(v-E)-1),
  count=hi.reduce((v,n,i)=>v*(n-lo[i]+1),1);
 if(count<1||count>maxCells)throw RangeError('D34 original cell collision sweep budget');
 const hits=[];
 for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
  const c=get(x,y,z);if(c&&d31PreviewHitsAABB(g,[x,y,z],[x+1,y+1,z+1]))hits.push({at:[x,y,z],role:c.role,asset:c.asset});
 }
 return hits;
}
