// MYTHWROUGHT D31: unregistered oblique preview of original Pack2 ID61 boxes.
// A longitudinally stretched and rotated owner mesh is NOT an authorized Pack2
// variant, new collision ID, structural joint, or playable block. Read-only.
const EPS=1e-8;
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const add=(a,b)=>a.map((v,i)=>v+b[i]);
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const scale=(a,s)=>a.map(v=>v*s);
const norm=a=>Math.hypot(...a);
const good3=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isFinite);
const validBox=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
  [0,1,2].every(i=>b[i]>=0&&b[i]<b[i+3]&&b[i+3]<=1);
function corners(obb){
 const r=[];for(const a of [-1,1])for(const b of [-1,1])for(const c of [-1,1]){
  let p=obb.center;for(const [j,s] of [[0,a],[1,b],[2,c]])p=add(p,scale(obb.axes[j],s*obb.half[j]));r.push(p);
 }return r;
}
/** Exact positive-volume SAT of a transformed owner BOX and unit authored AABB. */
export function d31OBBIntersectsAABB(obb,lo,hi){
 if(!obb||!good3(obb.center)||!Array.isArray(obb.axes)||obb.axes.length!==3||
    obb.axes.some(a=>!good3(a)||Math.abs(norm(a)-1)>1e-7)||
    !good3(obb.half)||obb.half.some(v=>v<=0)||!good3(lo)||!good3(hi)||
    lo.some((x,i)=>x>=hi[i]))throw TypeError('D31 invalid exact oblique/AABB geometry');
 const center=lo.map((x,i)=>(x+hi[i])/2),half=lo.map((x,i)=>(hi[i]-x)/2),
  d=sub(obb.center,center),standard=[[1,0,0],[0,1,0],[0,0,1]],
  axes=[...obb.axes,...standard,...obb.axes.flatMap(a=>standard.map(b=>cross(a,b)))];
 for(const a of axes){if(norm(a)<EPS)continue;
  const sep=Math.abs(dot(d,a)),lhs=obb.half.reduce((s,r,i)=>s+r*Math.abs(dot(obb.axes[i],a)),0),
   rhs=half.reduce((s,r,i)=>s+r*Math.abs(a[i]),0);
  if(sep>=lhs+rhs-EPS)return false;
 }return true;
}
/** Box union intersection with a world AABB; keeps each original owner subshape. */
export function d31PreviewHitsAABB(geometry,lo,hi){
 if(!geometry||!Array.isArray(geometry.ownerOBBs))throw TypeError('D31 no physical owner boxes');
 return geometry.ownerOBBs.some(b=>d31OBBIntersectsAABB(b,lo,hi));
}
/** Unregistered owner-derived diagonal; source owns all three Pack2 boxes. */
export function deriveD31OriginalPack2Oblique(start,end,plane,ownerBoxes){
 if(!good3(start)||!good3(end)||!['x','z'].includes(plane)||
    !Array.isArray(ownerBoxes)||ownerBoxes.length!==3||ownerBoxes.some(b=>!validBox(b)))
  throw TypeError('D31 needs bounded real Pack2 ID61 owner boxes and planar endpoints');
 const v=sub(end,start),len=norm(v);
 if(len<.5||len>5||Math.abs(plane==='x'?v[2]:v[0])>1e-8||
    Math.hypot(v[0],v[2])<.5)throw RangeError('D31 invalid source web centerline length or plane');
 const e=scale(v,1/len),bY=plane==='x'?[-e[1],e[0],0]:[0,e[2],-e[1]],
  bZ=plane==='x'?[0,0,1]:[-1,0,0],axes=[e,bY,bZ];
 if(Math.abs(dot(e,bY))>EPS||Math.abs(dot(e,bZ))>EPS||Math.abs(dot(bY,bZ))>EPS)
  throw Error('D31 source owner cannot form orthonormal physical web frame');
 const transform=(p)=>add(start,add(scale(e,p[0]*len),add(scale(bY,p[1]-.5),scale(bZ,p[2]-.5))));
 const ownerOBBs=ownerBoxes.map((b,i)=>{
  const c=transform([(b[0]+b[3])/2,(b[1]+b[4])/2,(b[2]+b[5])/2]);
  return Object.freeze({ownerPart:i,center:Object.freeze(c),axes:Object.freeze(axes.map(x=>Object.freeze([...x]))),
   half:Object.freeze([(b[3]-b[0])*len/2,(b[4]-b[1])/2,(b[5]-b[2])/2])});
 });
 const bounds=corners(ownerOBBs[0]);for(const ob of ownerOBBs.slice(1))bounds.push(...corners(ob));
 const min=[0,1,2].map(i=>Math.min(...bounds.map(p=>p[i]))),
  max=[0,1,2].map(i=>Math.max(...bounds.map(p=>p[i])));
 return Object.freeze({format:'mythwrought.builder-d.d31.unregistered-owner-oblique-preview.v1',
  plane,centerlineLength:len,sourceOwnerId:61,sourceOriginalBoxes:3,
  start:Object.freeze([...start]),end:Object.freeze([...end]),
  ownerOBBs:Object.freeze(ownerOBBs),bounds:Object.freeze({min,max}),
  transform,originalPhysicalCrossSectionPreserved:true,
  sourceAxialScaleModified:true,originalOwnerShapeUnchanged:false,
  ownerMeshDerivativeOnly:true,registeredPack2DiagonalVariant:false,
  staticallyRated:false,jointsRated:false,placementAllowed:false});
}
function rayBox(obb,o,d,maxDistance){
 const rel=sub(o,obb.center),orig=obb.axes.map(a=>dot(rel,a)),dir=obb.axes.map(a=>dot(d,a));
 let near=-Infinity,far=Infinity;
 for(let i=0;i<3;i++){
  if(Math.abs(dir[i])<EPS){if(Math.abs(orig[i])>obb.half[i])return null;continue;}
  const a=(-obb.half[i]-orig[i])/dir[i],b=(obb.half[i]-orig[i])/dir[i];
  near=Math.max(near,Math.min(a,b));far=Math.min(far,Math.max(a,b));
  if(near>far)return null;
 }if(far<0||near>maxDistance)return null;return Math.max(0,near);
}
export function d31RayOwnerPreview(geometry,origin,direction,maxDistance=8){
 if(!geometry?.ownerOBBs||!good3(origin)||!good3(direction)||
    !Number.isFinite(maxDistance)||maxDistance<=0||norm(direction)<EPS)
  throw TypeError('D31 invalid physical source picking ray');
 const d=scale(direction,1/norm(direction));let nearest=null;
 for(const ob of geometry.ownerOBBs){const hit=rayBox(ob,origin,d,maxDistance);
  if(hit!==null&&(nearest===null||hit<nearest))nearest=hit;}
 return nearest;
}
/** Transform original colored owner mesh without generating fake colors. Preview only. */
export function d31TransformOriginalPack2Mesh(geometry,sourceMesh,{maxVertices=8000}={}){
 if(!geometry?.transform||!(sourceMesh?.positions instanceof Float32Array)||
    !(sourceMesh?.colors instanceof Float32Array)||
    !(sourceMesh?.indices instanceof Uint16Array)||
    sourceMesh.positions.length===0||sourceMesh.indices.length===0||
    sourceMesh.positions.length!==sourceMesh.colors.length||sourceMesh.positions.length%3||
    sourceMesh.indices.length%3||!sourceMesh.positions.every(Number.isFinite)||
    !sourceMesh.colors.every(Number.isFinite)||
    Array.from(sourceMesh.indices).some(i=>i>=sourceMesh.positions.length/3)||
    sourceMesh.positions.length/3>maxVertices||!Number.isSafeInteger(maxVertices)||maxVertices<1)
  throw Error('D31 missing genuine bounded original Pack2 owner mesh');
 const positions=new Float32Array(sourceMesh.positions.length);
 for(let i=0;i<positions.length;i+=3){const p=geometry.transform(Array.from(sourceMesh.positions.slice(i,i+3)));
  for(let j=0;j<3;j++)positions[i+j]=p[j];}
 if(!positions.every(Number.isFinite))throw Error('D31 transformed source vertices nonfinite');
 return Object.freeze({positions,colors:new Float32Array(sourceMesh.colors),indices:new Uint16Array(sourceMesh.indices),
  coloredOriginalOwnerSource:true,derivedUnregistered:true,byteLength:positions.byteLength+sourceMesh.colors.byteLength+sourceMesh.indices.byteLength});
}
export function d31RayPreviewTriangles(mesh,origin,direction,limit=8){
 if(!mesh?.positions||!mesh?.indices||!good3(origin)||!good3(direction)||norm(direction)<EPS)
  throw TypeError('D31 invalid original mesh ray');
 const d=scale(direction,1/norm(direction)),a=mesh.positions,idx=mesh.indices;let best=null;
 for(let i=0;i<idx.length;i+=3){
  const A=Array.from(a.slice(idx[i]*3,idx[i]*3+3)),B=Array.from(a.slice(idx[i+1]*3,idx[i+1]*3+3)),
   C=Array.from(a.slice(idx[i+2]*3,idx[i+2]*3+3)),e1=sub(B,A),e2=sub(C,A),h=cross(d,e2),det=dot(e1,h);
  if(Math.abs(det)<1e-10)continue;
  const f=1/det,s=sub(origin,A),u=f*dot(s,h);if(u<-EPS||u>1+EPS)continue;
  const q=cross(s,e1),v=f*dot(d,q);if(v<-EPS||u+v>1+EPS)continue;
  const t=f*dot(e2,q);
  if(t>=0&&t<=limit&&(best===null||t<best))best=t;
 }return best;
}

/** SAT between two original Pack2 owner-derived oriented sub-boxes. */
export function d31OBBsOverlap(a,b){
 if(!a||!b||!Array.isArray(a.axes)||!Array.isArray(b.axes))throw TypeError('D31 missing actual owner sub-boxes');
 const d=sub(a.center,b.center),axes=[...a.axes,...b.axes,...a.axes.flatMap(x=>b.axes.map(y=>cross(x,y)))];
 for(const axis of axes){if(norm(axis)<EPS)continue;
  const ra=a.half.reduce((v,h,i)=>v+h*Math.abs(dot(axis,a.axes[i])),0),
   rb=b.half.reduce((v,h,i)=>v+h*Math.abs(dot(axis,b.axes[i])),0);
  if(Math.abs(dot(d,axis))>=ra+rb-EPS)return false;
 }return true;
}

/** Original Pack2 ID62 one-voxel vertical post owner, at a provisional joint.
 * A fractional horizontal joint position is NOT original grid placement. */
export function deriveD31OriginalPack2Vertical(start,end,ownerBoxes){
 if(!good3(start)||!good3(end)||Math.abs(start[0]-end[0])>EPS||
    Math.abs(start[2]-end[2])>EPS||Math.abs(Math.abs(start[1]-end[1])-1)>EPS||
    !Array.isArray(ownerBoxes)||ownerBoxes.length!==3||ownerBoxes.some(x=>!validBox(x)))
  throw TypeError('D31 original vertical Pack2 ID62 requires one-voxel post geometry');
 const y=Math.min(start[1],end[1]),axes=[[1,0,0],[0,1,0],[0,0,1]];
 const transform=p=>[start[0]+p[0]-.5,y+p[1],start[2]+p[2]-.5];
 const ownerOBBs=ownerBoxes.map((b,i)=>Object.freeze({ownerPart:i,
  center:Object.freeze(transform([(b[0]+b[3])/2,(b[1]+b[4])/2,(b[2]+b[5])/2])),
  axes:Object.freeze(axes.map(a=>Object.freeze(a))),
  half:Object.freeze([(b[3]-b[0])/2,(b[4]-b[1])/2,(b[5]-b[2])/2])}));
 const all=ownerOBBs.flatMap(corners),min=[0,1,2].map(i=>Math.min(...all.map(v=>v[i]))),
  max=[0,1,2].map(i=>Math.max(...all.map(v=>v[i])));
 return Object.freeze({format:'mythwrought.builder-d.d31.unregistered-one-cell-post-preview.v1',
  sourceOwnerId:62,sourceOriginalBoxes:3,centerlineLength:1,
  start:Object.freeze([...start]),end:Object.freeze([...end]),
  ownerOBBs:Object.freeze(ownerOBBs),bounds:Object.freeze({min,max}),transform,
  sourceAxialScaleModified:false,sourceOwnerShapePreserved:true,
  registeredPack2DiagonalVariant:false,liveCellRegistered:false,
  ratedPinConnection:false,placementAllowed:false});
}
