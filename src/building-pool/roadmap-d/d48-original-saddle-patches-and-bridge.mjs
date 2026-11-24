// D48 — physical negative/positive geometry witnesses, NEVER a rated connector.
// D47 sloped original D36 socket face remains immutable; proposed saddle patches
// and an unregistered triangular swept bridge never edit an original voxel.
import {d47ConvexPositiveVolumeCollision} from './d47-original-congruent-socket-saddle.mjs';
import {d31RayPreviewTriangles} from './d31-pack2-owner-oblique-preview.mjs';
const EPS=1e-8, V=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const add=(a,b)=>a.map((x,i)=>x+b[i]), sub=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,k)=>a.map(v=>v*k), dot=(a,b)=>a.reduce((n,x,i)=>n+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=a=>Math.hypot(...a), unit=a=>{const k=len(a);if(k<EPS)throw Error('D48 zero-volume connector');return mul(a,1/k);};
const triArea=(p)=>len(cross(sub(p[1],p[0]),sub(p[2],p[0])))/2;
const centroid=p=>mul(p.reduce((s,v)=>add(s,v),[0,0,0]),1/p.length);
const bounds=points=>({min:[0,1,2].map(i=>Math.min(...points.map(p=>p[i]))),max:[0,1,2].map(i=>Math.max(...points.map(p=>p[i])))});
const edges=[[0,1],[1,2],[2,0],[3,4],[4,5],[5,3],[0,3],[1,4],[2,5]];
function prism(low,high,normal){
 const vertices=[...low,...high],faces=[{normal:[...normal]},{normal:mul(normal,-1)},
  ...[[0,1],[1,2],[2,0]].map(([i,j])=>({normal:unit(cross(sub(low[j],low[i]),sub(high[i],low[i])))}))];
 return {vertices,faces,edges,bounds:bounds(vertices)};
}
function cube(at){const v=[];for(const x of [at[0],at[0]+1])for(const y of [at[1],at[1]+1])for(const z of [at[2],at[2]+1])v.push([x,y,z]);
 const e=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if([1,2,4].includes(i^j))e.push([i,j]);
 return {vertices:v,faces:[{normal:[1,0,0]},{normal:[0,1,0]},{normal:[0,0,1]}],edges:e};
}
function owner(ob){const vertices=[];for(const s0 of [-1,1])for(const s1 of [-1,1])for(const s2 of [-1,1]){
  let p=[...ob.center];for(const [i,s] of [s0,s1,s2].entries())p=add(p,mul(ob.axes[i],ob.half[i]*s));vertices.push(p);
 }const e=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if([1,2,4].includes(i^j))e.push([i,j]);
 return {vertices,faces:ob.axes.map(normal=>({normal})),edges:e};
}
function mesh(prismBody,color){const positions=[],colors=[],indices=[];
 for(const face of [[0,2,1],[3,4,5],[0,1,4],[0,4,3],[1,2,5],[1,5,4],[2,0,3],[2,3,5]]){
  const at=positions.length/3;for(const i of face){positions.push(...prismBody.vertices[i]);colors.push(...color);}
  indices.push(at,at+1,at+2);
 }return {positions:Float32Array.from(positions),colors:Float32Array.from(colors),indices:Uint16Array.from(indices)};
}
const ownerColor=p=>JSON.stringify(p?.metal)==='[0.29,0.32,0.33]'&&JSON.stringify(p?.base)==='[0.4,0.24,0.17]'&&JSON.stringify(p?.grain)==='[0.22,0.13,0.11]';
/** Four contact-preserving sub-triangles are exact convex combinations within
 * the D47 source-authentic face, not face offsets or clipping of original wall. */
export function deriveD48UnregisteredSlopedContactPatch(saddle,variant,palette){
 if(saddle?.format!=='mythwrought.d47.unregistered-original-socket-slope-contact-saddle.v1'||
    saddle.constructionAllowed!==false||saddle.vertices?.length!==6||saddle.actualSocketFaceVertices?.length!==3||
    !['center','corner0','corner1','corner2'].includes(variant)||!ownerColor(palette))
  throw TypeError('D48 requires original D47 source-congruent sloped face and Pack2 RGB');
 const original=saddle.vertices.slice(0,3),focus=variant==='center'?centroid(original):original[Number(variant.slice(-1))],
  low=original.map(p=>add(mul(p,.48),mul(focus,.52))),
  high=low.map(p=>add(p,mul(saddle.faceNormal,.0125))),base=prism(low,high,saddle.faceNormal),
  area=triArea(low),measuredPlane=saddle.actualSocketFaceVertices[0];
 if(area<.008||Math.abs(area/saddle.actualSocketContactArea-.48*.48)>1e-6||
    low.some(p=>Math.abs(dot(saddle.faceNormal,sub(p,measuredPlane)))>1e-6))
  throw Error('D48 variant loses genuine positive sloped-face contact');
 return Object.freeze({...base,mesh:mesh(base,palette.metal),format:'mythwrought.d48.unregistered-slope-subface-patch.v1',
  variant,faceNormal:[...saddle.faceNormal],actualSourceContactArea:area,
  parentD47FullArea:saddle.actualSocketContactArea,originalOwnerPaletteId:61,
  exactSocketFaceCoplanar:true,independentFastener:false,materialCapacity:null,
  sourceOwnerUnmodified:true,constructionAllowed:false});
}
/** Full convex SAT against source cells and original D31 OBBs. Keep exact
 * coordinate/role/relative-to-root witnesses, not only a rounded AABB hit. */
export function inspectD48ExactConvexSourceAndOwnerHits(shape,source,wall,{otherOwners=[],maxCells=192}={}){
 if(!['mythwrought.d48.unregistered-slope-subface-patch.v1','mythwrought.d48.unregistered-saddle-dogleg-bridge.v1',
   'mythwrought.d47.unregistered-original-socket-slope-contact-saddle.v1'].includes(shape?.format)||
   !V(wall)||!wall.every(Number.isSafeInteger)||typeof source?.get!=='function'||!(source.nav instanceof Set)||
   !Array.isArray(otherOwners)||otherOwners.length>90||!Number.isSafeInteger(maxCells)||maxCells<8||maxCells>512)
  throw TypeError('D48 original authored source and unregistered physical convex hull required');
 const lo=shape.bounds.min.map(x=>Math.floor(x+EPS)),hi=shape.bounds.max.map(x=>Math.ceil(x-EPS)-1),
  budget=lo.reduce((n,x,i)=>n*(hi[i]-x+1),1);if(budget<1||budget>maxCells)throw RangeError('D48 owner-bounded real solid sweep budget');
 const blockers=[],walk=[];
 for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
  const p=[x,y,z],c=source.get(x,y,z),b=cube(p);
  if(c&&d47ConvexPositiveVolumeCollision(shape,b))blockers.push(Object.freeze({at:p,relativeToRoot:p.map((v,i)=>v-wall[i]),role:c.role,asset:c.asset}));
  if(source.nav.has(`${x},2,${z}`)){
   const stand={vertices:[],faces:[{normal:[1,0,0]},{normal:[0,1,0]},{normal:[0,0,1]}],edges:[]};
   // Use the exact conservative Y2 WALK AABB as an axis-aligned convex volume.
   const p=[x+.2,2,z+.2],q=[x+.8,4.5,z+.8];
   for(const xx of [p[0],q[0]])for(const yy of [p[1],q[1]])for(const zz of [p[2],q[2]])stand.vertices.push([xx,yy,zz]);
   for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if([1,2,4].includes(i^j))stand.edges.push([i,j]);
   if(d47ConvexPositiveVolumeCollision(shape,stand))walk.push([x,2,z]);
  }
 }
 let ownerHits=0;for(const m of otherOwners)for(const ob of m?.ownerOBBs??[])if(d47ConvexPositiveVolumeCollision(shape,owner(ob)))ownerHits++;
 return Object.freeze({sourceSolidCount:blockers.length,sourceWallCount:blockers.filter(v=>v.role==='wall').length,
  sourceNonWallCount:blockers.filter(v=>v.role!=='wall').length,
  rootCellHit:blockers.some(v=>v.relativeToRoot.every(x=>x===0)),
  blockerCoordinates:Object.freeze(blockers),walkCount:walk.length,otherMemberOBBCount:ownerHits,
  sourceAndOwnerClear:blockers.length===0&&walk.length===0&&ownerHits===0,
  physicallyUnapproved:true,originalWrites:0,constructionAllowed:false});
}
/** A genuine *whole-volume* triangular translation prism between the actual
 * proposed saddle outer face and the physical D45 dogleg start. Non-axis
 * diagonal edges are tested with full convex SAT, not sparse center samples.
 * Face contact and positive dogleg overlap are geometrical, not tensile fastening. */
export function deriveD48UnregisteredSaddleDoglegBridge(patch,dog,palette){
 if(patch?.format!=='mythwrought.d48.unregistered-slope-subface-patch.v1'||
  dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
  dog.constructionAllowed!==false||dog.path?.length!==3||dog.fullPrismBounds?.length!==2||
  !V(dog.path[0])||!ownerColor(palette))
  throw TypeError('D48 requires original D45 dogleg and D48 source-face patch');
 const low=patch.vertices.slice(3,6),from=centroid(low),target=dog.path[0],delta=sub(target,from),
  high=low.map(p=>add(p,delta)),b=prism(low,high,patch.faceNormal);
 if(len(delta)<.02)throw Error('D48 degenerate bridge');
 return Object.freeze({...b,format:'mythwrought.d48.unregistered-saddle-dogleg-bridge.v1',
  mesh:mesh(b,palette.metal),genuinePositiveAreaPatchEndContact:triArea(low),
  proposedDoglegStartCentroid:target,bridgeVector:delta,
  outwardNormalDisplacement:dot(delta,patch.faceNormal),
  originalPaletteOwnerId:61,registeredConnector:false,
  jointStrengthAuthenticated:false,constructionAllowed:false});
}
export function inspectD48BridgeContactAndCollisions(bridge,patch,dog,socket,source,wall,{otherOwners=[]}={}){
 if(bridge?.format!=='mythwrought.d48.unregistered-saddle-dogleg-bridge.v1'||
  patch?.format!=='mythwrought.d48.unregistered-slope-subface-patch.v1'||
  socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1')
  throw TypeError('D48 original D36/D45/D47 physical evidence required');
 const scan=inspectD48ExactConvexSourceAndOwnerHits(bridge,source,wall,{otherOwners}),
  v=dog.fullPrismBounds[0],firstDog=cube([0,0,0]);
 // Use the D45 physical first full swept AABB (NOT a one-block voxel).
 firstDog.vertices=[];for(const x of [v.min[0],v.max[0]])for(const y of [v.min[1],v.max[1]])for(const z of [v.min[2],v.max[2]])firstDog.vertices.push([x,y,z]);
 const socketHit=d47ConvexPositiveVolumeCollision(bridge,socket),dogHit=d47ConvexPositiveVolumeCollision(bridge,firstDog);
 return Object.freeze({...scan,actualD36PositiveVolumeIntrusion:socketHit,
  physicalFirstDoglegPositiveVolumeOverlap:dogHit,
  geometricBothEndsReachable:scan.sourceAndOwnerClear&&!socketHit&&dogHit&&bridge.outwardNormalDisplacement>0,
  actualLoadPathProven:false,realFastenerAuth:false,foundationCertified:false,constructionAllowed:false});
}
export function sampleD48OriginalPaletteTriangleRay(shape){
 if(!['mythwrought.d48.unregistered-slope-subface-patch.v1','mythwrought.d48.unregistered-saddle-dogleg-bridge.v1'].includes(shape?.format))
  throw TypeError('D48 authentic unregistered colored triangular mesh required');
 const hi=shape.vertices.slice(3,6),center=centroid(hi),normal=shape.format.includes('bridge')?unit(shape.bridgeVector):shape.faceNormal,
  from=add(center,mul(normal,.6)),dir=mul(normal,-1),hit=d31RayPreviewTriangles(shape.mesh,from,dir,3);
 // The oblique bridge end may not face along its axis; use its exact face
 // plane and reject ambiguous parity instead of faking a known hit.
 const distance=dot(sub(hi[0],from),normal)/dot(dir,normal);
 if(hit===null||Math.abs(hit-distance)>1e-5)throw Error('D48 genuine source-colored physical triangle ray parity failed');
 return Object.freeze({rayDelta:Math.abs(hit-distance),triangles:shape.mesh.indices.length/3,
  previewOnly:true,actualProductionPickingValidated:false,constructionAllowed:false});
}
