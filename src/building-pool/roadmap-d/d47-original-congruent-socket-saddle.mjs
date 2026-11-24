// D47: exact convex D36 socket face and original authored-volume witnesses.
// Completely unregistered. Source ID61 RGB is only a palette reference, never
// a newly registered ID61 owner, fastener, load path, or construction approval.
import {d31RayPreviewTriangles} from './d31-pack2-owner-oblique-preview.mjs';
const EPS=1e-8,WIDTH=.08;
const v3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const add=(a,b)=>a.map((x,i)=>x+b[i]);
const sub=(a,b)=>a.map((x,i)=>x-b[i]);
const scale=(a,k)=>a.map(x=>x*k);
const dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>Math.hypot(...a);
const normalize=a=>{const d=norm(a);if(d<EPS)throw Error('D47 degenerate convex face normal');return scale(a,1/d);};
const area=(a,b,c)=>norm(cross(sub(b,a),sub(c,a)))/2;
const minmax=(list)=>({min:[0,1,2].map(i=>Math.min(...list.map(p=>p[i]))),max:[0,1,2].map(i=>Math.max(...list.map(p=>p[i])))});
const asPoly=(points,faces,edges)=>({vertices:points,faces:faces.map(n=>({normal:n})),edges});
const project=(vertices,n)=>{const x=vertices.map(p=>dot(p,n));return [Math.min(...x),Math.max(...x)];};
const diff=(a,b)=>a[1]>b[0]+EPS&&b[1]>a[0]+EPS;
/** Positive-volume convex SAT. A mere coplanar touching face is not penetration. */
export function d47ConvexPositiveVolumeCollision(a,b){
 if(!Array.isArray(a?.vertices)||!Array.isArray(b?.vertices)||
    !Array.isArray(a.faces)||!Array.isArray(b.faces)||!Array.isArray(a.edges)||!Array.isArray(b.edges))
  throw TypeError('D47 two genuine convex physical-owner hulls required');
 const axes=[...a.faces.map(f=>f.normal),...b.faces.map(f=>f.normal)];
 for(const [i,j] of a.edges)for(const [k,l] of b.edges){const z=cross(sub(a.vertices[j],a.vertices[i]),sub(b.vertices[l],b.vertices[k]));if(norm(z)>1e-9)axes.push(z);}
 for(const axis of axes){if(norm(axis)<1e-9)continue;if(!diff(project(a.vertices,axis),project(b.vertices,axis)))return false;}
 return true;
}
function toAABB(lo,hi){const pts=[];for(const x of [lo[0],hi[0]])for(const y of [lo[1],hi[1]])for(const z of [lo[2],hi[2]])pts.push([x,y,z]);
 const edges=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if([0,1,2].filter(d=>Math.abs(pts[i][d]-pts[j][d])>EPS).length===1)edges.push([i,j]);
 return asPoly(pts,[[1,0,0],[0,1,0],[0,0,1]],edges);
}
const canonicalPalette=p=>JSON.stringify(p?.base)==='[0.4,0.24,0.17]'&&
 JSON.stringify(p?.metal)==='[0.29,0.32,0.33]'&&JSON.stringify(p?.grain)==='[0.22,0.13,0.11]';
/** A source-authentic *slope face* on an unapproved eight-vertex D36 socket.
 * Inset triangle by 12% to avoid the shared convex edges, and extrude its
 * OUTWARD hull normal by 0.025. The base triangle must coincide pointwise
 * with the D36 face, never merely with its AABB edge.
 */
export function deriveD47UnregisteredCongruentSaddle(socket,side,palette,{thickness=.025,inset=.12}={}){
 if(socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||
   socket.constructionAllowed!==false||socket.vertices?.length!==8||
   !Array.isArray(socket.faces)||!Array.isArray(socket.edges)||
   !['x','z'].includes(socket.plane)||![-1,1].includes(side)||
   !canonicalPalette(palette)||thickness!==.025||inset!==.12)
  throw TypeError('D47 immutable D36 source socket, precise owner colors and bounded unregistered saddle required');
 const axial=socket.plane==='x'?0:2,lateral=axial===0?2:0;
 const candidates=socket.faces.filter(f=>f.ids.length===3&&f.normal[lateral]*side>.28&&f.normal[axial]*(socket.rootAtEnd?-1:1)<-.35)
  .sort((a,b)=>b.normal[lateral]*side-a.normal[lateral]*side);
 if(!candidates.length)throw Error('D47 no source-authentic three-vertex sloped lateral convex face');
 const face=candidates[0],center=face.ids.map(i=>socket.vertices[i]).reduce((s,p)=>add(s,p),[0,0,0]).map(x=>x/3),
  inner=face.ids.map(i=>add(scale(socket.vertices[i],1-inset),scale(center,inset))),
  outer=inner.map(p=>add(p,scale(face.normal,thickness))),points=[...inner,...outer];
 const trueArea=area(...inner),actualFaceArea=area(...face.ids.map(i=>socket.vertices[i]));
 if(!(trueArea>.001)||!(actualFaceArea>trueArea)||
  inner.some(p=>Math.abs(dot(face.normal,sub(p,face.center)))>5e-7))
   throw Error('D47 actual socket face contact polygon is not coplanar and positive area');
 const tris=[[0,2,1],[3,4,5],[0,1,4],[0,4,3],[1,2,5],[1,5,4],[2,0,3],[2,3,5]],
  meshPositions=[],meshColors=[],indices=[];
 for(const [a,b,c] of tris){const at=meshPositions.length/3;
  for(const p of [points[a],points[b],points[c]]){meshPositions.push(...p);meshColors.push(...palette.metal);}
  indices.push(at,at+1,at+2);
 }
 const edges=[[0,1],[1,2],[2,0],[3,4],[4,5],[5,3],[0,3],[1,4],[2,5]];
 const convex=asPoly(points,[face.normal,scale(face.normal,-1),...[[0,1],[1,2],[2,0]].map(([i,j])=>normalize(cross(sub(inner[j],inner[i]),face.normal)))],edges);
 const physicallyOverlapsSocket=d47ConvexPositiveVolumeCollision(convex,socket);
 if(physicallyOverlapsSocket)throw Error('D47 congruent slope saddle penetrates original unregistered socket');
 const geometry=Object.freeze({...convex,bounds:minmax(points),mesh:{positions:Float32Array.from(meshPositions),
  colors:Float32Array.from(meshColors),indices:Uint16Array.from(indices)},
  actualSocketFaceVertices:Object.freeze(face.ids.map(i=>Object.freeze([...socket.vertices[i]]))),
  faceNormal:Object.freeze([...face.normal]),side,plane:socket.plane,originalPaletteOwnerId:61,
  originalSourceOwnerShapeUntouched:true,actualSocketContactArea:trueArea,
  actualFullSocketFaceArea:actualFaceArea,uniqueCoplanarInsetTriangle:true,
  genuineSocketPositiveVolumeOverlap:false,registeredFastener:false,
  sourceColorOnlyNotRegisteredPack2:true,realMechanicalCapture:false,
  axialTensionStrengthCertified:false,constructionAllowed:false,
  format:'mythwrought.d47.unregistered-original-socket-slope-contact-saddle.v1'});
 return geometry;
}
const atKey=(x,y,z)=>`${x},${y},${z}`;
export function auditD47SaddleSourceAndOwnerClearance(saddle,source,{otherOwners=[],maxCells=64}={}){
 if(saddle?.format!=='mythwrought.d47.unregistered-original-socket-slope-contact-saddle.v1'||
    typeof source?.get!=='function'||!(source.nav instanceof Set)||
    !Array.isArray(otherOwners)||otherOwners.length>90||
    !Number.isSafeInteger(maxCells)||maxCells<1||maxCells>128)
  throw TypeError('D47 source-owned convex saddle and bounded immutable source required');
 const lo=saddle.bounds.min.map(v=>Math.floor(v+EPS)),hi=saddle.bounds.max.map(v=>Math.ceil(v-EPS)-1);
 const budget=lo.reduce((v,x,i)=>v*(hi[i]-x+1),1);
 if(budget<1||budget>maxCells)throw RangeError('D47 physical swept convex source budget');
 const solids=[],walk=[];for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
  const cell=toAABB([x,y,z],[x+1,y+1,z+1]);
  if(source.get(x,y,z)&&d47ConvexPositiveVolumeCollision(saddle,cell))
   solids.push(Object.freeze({at:Object.freeze([x,y,z]),role:source.get(x,y,z)?.role,asset:source.get(x,y,z)?.asset}));
  if(source.nav.has(atKey(x,2,z))&&
     d47ConvexPositiveVolumeCollision(saddle,toAABB([x+.2,2,z+.2],[x+.8,4.5,z+.8])))walk.push([x,2,z]);
 }
 // Original D31 owner boxes, as exact true source-oriented OBB 8 corners.
 let ownerHits=0;
 for(const g of otherOwners)for(const obb of g?.ownerOBBs??[]){
  const o=[];for(const a of [-1,1])for(const b of [-1,1])for(const c of [-1,1]){
   let p=[...obb.center];for(const [sgn,k] of [[a,0],[b,1],[c,2]])p=add(p,scale(obb.axes[k],obb.half[k]*sgn));o.push(p);
  }
  // For rotated boxes, index adjacency is fixed, rather than world-axis changes.
  const ee=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if((i^j)===1||(i^j)===2||(i^j)===4)ee.push([i,j]);
  if(d47ConvexPositiveVolumeCollision(saddle,asPoly(o,obb.axes,ee)))ownerHits++;
 }
 return Object.freeze({authoredSolidClashes:solids.length,authoredWalkClashes:walk.length,
  otherUninstalledMemberBoxClashes:ownerHits,firstOriginalSolidWitness:solids[0]??null,
  geometricallyClearOfSourceAndOtherOwners:solids.length===0&&walk.length===0&&ownerHits===0,
  originalEdits:0,constructionAllowed:false});
}
/** Independent analytical outward-normal line/plane hit against the *actual*
 * inset face, compared with colored triangle ray. Never gameplay picking. */
export function sampleD47SaddleTriangleParity(saddle){
 if(saddle?.format!=='mythwrought.d47.unregistered-original-socket-slope-contact-saddle.v1')
  throw TypeError('D47 original slope preview required');
 const inner=saddle.vertices.slice(0,3),center=inner.reduce((s,p)=>add(s,p),[0,0,0]).map(x=>x/3),
  n=saddle.faceNormal,from=add(center,scale(n,.5+saddle.vertices.reduce((z,p,i)=>i===3?norm(sub(p,inner[0])):z,0))),
  dir=scale(n,-1),physical=.5,mesh=d31RayPreviewTriangles(saddle.mesh,from,dir,2);
 if(mesh===null||Math.abs(mesh-physical)>1e-5)throw Error('D47 independent source RGB saddle-mesh/actual convex surface ray disagreement');
 return Object.freeze({triangles:saddle.mesh.indices.length/3,originalPaletteOwnerId:61,
  colorPreserved:true,rayDelta:Math.abs(mesh-physical),
  realOriginalPack2RegisteredSource:false,physicalGameplayRaycastAccepted:false,
  constructionAllowed:false});
}
/** FIRST physical voxel entry on each independently re-evaluated D46 path,
 * including the 0.08-unit half-width and true segment order. Not merely first
 * lexicographically enumerated solid or cumulative collision event counts. */
export function inspectD47FirstFractionalVoxelBarrier(route,source,{halfWidth=WIDTH,maxCells=256}={}){
 if(!Array.isArray(route?.points)||route.points.length<2||route.points.length>4||
    route.points.some(p=>!v3(p))||typeof source?.get!=='function'||!(source.nav instanceof Set)||
    halfWidth!==WIDTH||!Number.isSafeInteger(maxCells)||maxCells<8||maxCells>512)
  throw TypeError('D47 genuine short fractional original-source path required');
 let totalHits=0,first=null,scanned=0;
 for(let i=1;i<route.points.length;i++){
  const a=route.points[i-1],b=route.points[i],delta=sub(b,a),change=delta.filter(v=>Math.abs(v)>EPS).length;
  if(change!==1)throw Error('D47 source fractional route includes nonaxis-aligned segment');
  const ax=delta.findIndex(v=>Math.abs(v)>EPS),vol=minmax([a,b]),lo=vol.min.map(v=>Math.floor(v-WIDTH+EPS)),
   hi=vol.max.map(v=>Math.ceil(v+WIDTH-EPS)-1),budget=lo.reduce((v,x,j)=>v*(hi[j]-x+1),1);
  if(budget<1||budget>maxCells)throw RangeError('D47 original fractional wall-voxel entry budget');
  for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
   scanned++;const c=source.get(x,y,z);if(!c)continue;
   const cell=[x,y,z],limits=cell.map(v=>[v-WIDTH,v+1+WIDTH]);
   if([0,1,2].some(k=>k!==ax&&(a[k]>limits[k][1]-EPS||a[k]<limits[k][0]+EPS)))continue;
   const p0=(limits[ax][0]-a[ax])/delta[ax],p1=(limits[ax][1]-a[ax])/delta[ax],t=Math.max(0,Math.min(p0,p1)),to=Math.min(1,Math.max(p0,p1));
   if(t>to+EPS||to<0||t>1)continue;
   totalHits++;
   if(!first||i-1<first.segmentIndex||i-1===first.segmentIndex&&t<first.fraction-1e-10){
    first=Object.freeze({segmentIndex:i-1,fraction:t,at:Object.freeze(cell),role:c.role,asset:c.asset,
     point:Object.freeze(a.map((v,j)=>v+delta[j]*t)),
     segmentPosition:i===1?'first-extension-segment':i===route.points.length-1?'last-extension-segment':'middle-extension-segment'});
   }
  }
 }
 return Object.freeze({firstOriginalVoxel:first,totalSourceVolumeHits:totalHits,sourceCellsInspected:scanned,
  usesFractionalSweepVolumeNotPointCenter:true,worldEdits:0,constructionAllowed:false});
}
