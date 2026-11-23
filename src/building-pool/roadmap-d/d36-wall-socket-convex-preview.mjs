// MYTHWROUGHT D36: independent, UNREGISTERED two-interface WALL SOCKET research.
// A new authored connector is NOT part of original Pack2; only its palette may be
// traced to genuine ID61. No world block, fastener, rating or source edit exists.
import {d31RayPreviewTriangles} from './d31-pack2-owner-oblique-preview.mjs';
const E=1e-8,vec=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const plus=(a,b)=>a.map((x,i)=>x+b[i]);
const minus=(a,b)=>a.map((x,i)=>x-b[i]);
const mul=(a,s)=>a.map(x=>x*s);
const dot=(a,b)=>a.reduce((v,x,i)=>v+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const length=a=>Math.hypot(...a);
const unit=a=>{const n=length(a);if(n<1e-8)throw RangeError('D36 degenerate direction');return mul(a,1/n);};
const integerWall=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger)&&a[1]===6;
const originalPalette=p=>p&&JSON.stringify(p.base)==='[0.4,0.24,0.17]'&&
 JSON.stringify(p.grain)==='[0.22,0.13,0.11]'&&JSON.stringify(p.metal)==='[0.29,0.32,0.33]';
function uniquePlanes(vertices){
 const faces=[];
 for(let i=0;i<vertices.length;i++)for(let j=i+1;j<vertices.length;j++)for(let k=j+1;k<vertices.length;k++){
  let n=cross(minus(vertices[j],vertices[i]),minus(vertices[k],vertices[i]));
  if(length(n)<1e-7)continue;n=unit(n);
  const di=vertices.map(v=>dot(n,minus(v,vertices[i]))),min=Math.min(...di),max=Math.max(...di);
  if(min < -1e-7 && max >1e-7)continue;
  if(min>=-1e-7)n=mul(n,-1);
  const h=dot(n,vertices[i]);
  if(faces.some(f=>dot(f.normal,n)>1-1e-7&&Math.abs(f.offset-h)<1e-7))continue;
  const ids=vertices.map((v,id)=>Math.abs(dot(n,v)-h)<1e-7?id:-1).filter(id=>id>=0);
  if(ids.length<3)continue;
  const center=[0,1,2].map(d=>ids.reduce((v,id)=>v+vertices[id][d],0)/ids.length);
  const u=unit(minus(vertices[ids[0]],center)),v=cross(n,u);
  ids.sort((a,b)=>Math.atan2(dot(minus(vertices[a],center),v),dot(minus(vertices[a],center),u))-
   Math.atan2(dot(minus(vertices[b],center),v),dot(minus(vertices[b],center),u)));
  faces.push({normal:n,offset:h,ids,center});
 }
 if(faces.length<4)throw Error('D36 malformed or zero-volume socket hull');
 const uniqueEdges=new Set();
 for(const f of faces)for(let i=0;i<f.ids.length;i++){
  const a=f.ids[i],b=f.ids[(i+1)%f.ids.length];uniqueEdges.add([Math.min(a,b),Math.max(a,b)].join(','));
 }
 return {faces,edges:[...uniqueEdges].map(s=>s.split(',').map(Number))};
}
function hullFromCaps(wallCap,webCap,palette){
 const vertices=[...wallCap,...webCap],{faces,edges}=uniquePlanes(vertices);
 const positions=[],colors=[],indices=[];
 for(const f of faces){
  const begin=positions.length/3,color=f.ids.every(i=>i<4)?palette.metal:
   f.ids.every(i=>i>=4)?palette.grain:palette.base;
  for(const id of f.ids){positions.push(...vertices[id]);colors.push(...color);}
  for(let i=1;i+1<f.ids.length;i++)indices.push(begin,begin+i,begin+i+1);
 }
 const mesh={positions:Float32Array.from(positions),colors:Float32Array.from(colors),indices:Uint16Array.from(indices)};
 const bounds={min:[0,1,2].map(j=>Math.min(...vertices.map(v=>v[j]))),max:[0,1,2].map(j=>Math.max(...vertices.map(v=>v[j])))};
 return {vertices,faces,edges,mesh,bounds};
}
const span=(vertices,axis)=>{const v=vertices.map(x=>dot(x,axis));return [Math.min(...v),Math.max(...v)];};
const separated=(a,b)=>a[1]<=b[0]+E||b[1]<=a[0]+E;
const boxCorners=(center,axes,half)=>{
 const r=[];for(const i of [-1,1])for(const j of [-1,1])for(const k of [-1,1]){
  let p=center;for(const [s,c] of [[i,0],[j,1],[k,2]])p=plus(p,mul(axes[c],s*half[c]));r.push(p);
 }return r;
};
function convexIntersectsBox(g,box){
 const axes=box.axes,other=boxCorners(box.center,axes,box.half),edgeVectors=g.edges.map(([i,j])=>minus(g.vertices[j],g.vertices[i]));
 const checks=[...g.faces.map(f=>f.normal),...axes,...edgeVectors.flatMap(e=>axes.map(a=>cross(e,a)))];
 for(const n of checks){if(length(n)<1e-9)continue;if(separated(span(g.vertices,n),span(other,n)))return false;}
 return true;
}
/** Fully bounded SAT on independent convex socket against actual original cube. */
export function d36SocketHitsAABB(socket,lo,hi){
 if(socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||!vec(lo)||!vec(hi)||lo.some((x,i)=>x>=hi[i]))
  throw TypeError('D36 invalid independent socket or authentic source cell AABB');
 return convexIntersectsBox(socket,{center:lo.map((v,i)=>(v+hi[i])/2),
  axes:[[1,0,0],[0,1,0],[0,0,1]],half:lo.map((v,i)=>(hi[i]-v)/2)});
}
export function d36SocketHitsOwner(socket,originalMember){
 if(socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||
    !Array.isArray(originalMember?.ownerOBBs)||!originalMember.ownerOBBs.length)
  throw TypeError('D36 requires real independent source-owner collision surfaces');
 return originalMember.ownerOBBs.some(obb=>convexIntersectsBox(socket,obb));
}
/** Only D35-selected, actual clipped original ID61 at a rooted ORIGINAL Y6 wall.
 * Wall contact area and web end-cap contact area are calculated, not rated.
 * The socket itself is a NEW UNAPPROVED authored candidate, NOT a Pack2 shape.
 */
export function deriveD36IndependentRootSocket(clip,wall,{rootAtEnd=false,plane='x',palette=null,wallPatchWidth=.06,wallPatchHeight=.30}={}){
 if(clip?.format!=='mythwrought.builder-d.d32.unregistered-source-clip.v1'||
  clip.sourceOwnerId!==61||!Array.isArray(clip.ownerOBBs)||!clip.ownerOBBs.length||
  !vec(clip.start)||!vec(clip.end)||!integerWall(wall)||!['x','z'].includes(plane)||
  typeof rootAtEnd!=='boolean'||!originalPalette(palette)||
  !Number.isFinite(wallPatchWidth)||wallPatchWidth<=0||wallPatchWidth>.12||
  !Number.isFinite(wallPatchHeight)||wallPatchHeight<=0||wallPatchHeight>.4)
  throw TypeError('D36 needs authentic clipped ID61 root, exact original wall and approved owner RGB source');
 const forward=unit(minus(clip.end,clip.start)),lengthMember=length(minus(clip.end,clip.start)),
  axis=plane==='x'?0:2,lateral=plane==='x'?2:0,
  traverse=forward[axis];
 if(Math.abs(traverse)<.65||clip.ownerOBBs.some(o=>o.ownerPart!==0&&o.ownerPart!==1&&o.ownerPart!==2))
  throw Error('D36 root has invalid oblique ID61 owner provenance');
 const along=rootAtEnd?lengthMember-clip.cutEnd:clip.cutStart,other=clip.ownerOBBs.find(o=>o.ownerPart===0);
 if(!other||along<.2||along>lengthMember-.05)throw Error('D36 missing actual cut core and lost rooted face');
 const capCenter=plus(clip.start,mul(forward,along)),
  faceCoord=wall[axis]+(rootAtEnd?0:1),
  wallFaceDist=Math.abs(capCenter[axis]-faceCoord);
 if(wallFaceDist<.025||wallFaceDist>1.6||Math.abs(clip.start[lateral]-(wall[lateral]+.5))>1.2)
  throw Error('D36 clipped source web face is outside bounded original rooted wall transition');
 const halfY=wallPatchHeight/2,halfL=wallPatchWidth/2,
  chosenL=Math.min(wall[lateral]+1-halfL-.01,Math.max(wall[lateral]+halfL+.01,capCenter[lateral]));
 const wallCenter=[wall[0]+.5,6.5,wall[2]+.5];wallCenter[axis]=faceCoord;wallCenter[lateral]=chosenL;
 const ey=[0,1,0],el=plane==='x'?[0,0,1]:[1,0,0],
  a=other.axes[1],b=other.axes[2],hY=other.half[1],hL=other.half[2];
 // At the genuine axial cut the ID61 core 0.48 x 0.48 end cap remains.
 const rootAtCap=dot(minus(other.center,clip.start),forward)+(rootAtEnd?other.half[0]:-other.half[0]);
 if(Math.abs(rootAtCap-along)>1e-6)throw Error('D36 exact trimmed owner core end plane absent');
 const rectangle=(c,u,v,du,dv)=>[plus(plus(c,mul(u,-du)),mul(v,-dv)),
  plus(plus(c,mul(u,du)),mul(v,-dv)),plus(plus(c,mul(u,du)),mul(v,dv)),
  plus(plus(c,mul(u,-du)),mul(v,dv))];
 const wallCap=rectangle(wallCenter,ey,el,halfY,halfL),webCap=rectangle(capCenter,a,b,hY,hL),
  socket=hullFromCaps(wallCap,webCap,palette),
  webNormal=rootAtEnd?mul(forward,-1):forward;
 // The web cap must be genuinely supporting (not hidden inside the hull).
 const alongDir=rootAtEnd?mul(forward,-1):forward;
 if(Math.min(...wallCap.map(p=>dot(minus(p,capCenter),alongDir)))>=-1e-8)
  throw Error('D36 prospective connector lacks positive-volume approach to cut face');
 const obj={...socket,format:'mythwrought.d36.unregistered-wall-transition.v1',
  wall:Object.freeze([...wall]),plane,rootAtEnd,ownerPaletteSourceId:61,
  wallCap:Object.freeze(wallCap),webCap:Object.freeze(webCap),
  sourceOriginalFaceAreaWall:wallPatchHeight*wallPatchWidth,
  sourceOriginalCutFaceArea:hY*2*hL*2,webCutNormal:webNormal,
  materialSourceColorsNotFalsified:true,realMetalFastenerSourceUnknown:true,
  originalPack2RegisteredShapeUnchanged:true,originalWorldCellsModified:0,
  approvedPack2Variant:false,approvedEndCap:false,realRatedJoint:false,
  constructionAllowed:false};
 return Object.freeze(obj);
}
export function probeD36OriginalSocket(socket,source,owner,{maxCells=256}={}){
 if(socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||
  typeof source?.get!=='function'||!(source.nav instanceof Set)||
  !Number.isSafeInteger(maxCells)||maxCells<12||maxCells>256)
  throw TypeError('D36 original source read-only query and tight budget required');
 const lo=socket.bounds.min.map(v=>Math.floor(v+E)),hi=socket.bounds.max.map(v=>Math.ceil(v-E)-1);
 const cells=hi.reduce((p,v,i)=>p*(v-lo[i]+1),1);if(cells>maxCells)throw RangeError('D36 socket source collision sweep budget');
 const authored=[];let walking=0;
 for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
  const c=source.get(x,y,z);if(c&&d36SocketHitsAABB(socket,[x,y,z],[x+1,y+1,z+1]))authored.push({at:[x,y,z],role:c.role,asset:c.asset});
 }
 for(let x=lo[0];x<=hi[0];x++)for(let z=lo[2];z<=hi[2];z++){
  if(source.nav.has(`${x},2,${z}`)&&d36SocketHitsAABB(socket,[x+.2,2,z+.2],[x+.8,4.5,z+.8]))walking++;
 }
 const memberOverlap=d36SocketHitsOwner(socket,owner),sourceClear=authored.length===0&&walking===0&&!memberOverlap;
 return Object.freeze({originalAuthoredCellClashes:authored.length,sourceClashes:Object.freeze(authored.slice(0,8)),
  originalWalkBodyClashes:walking,memberPositiveVolumeOverlap:memberOverlap,
  originalY7RoofClashes:authored.filter(c=>c.at[1]>=7).length,
  originalRootWallClashes:authored.filter(c=>c.at[0]===socket.wall[0]&&c.at[2]===socket.wall[2]).length,
  sourceClear,geometricWallFaceArea:socket.sourceOriginalFaceAreaWall,
  geometricWebFaceArea:socket.sourceOriginalCutFaceArea,
  twoFaceGeometryOnly:sourceClear,originalWorldCellsModified:0,
  rendererAndLiveColliderUnregistered:true,uniqueRatedStructuralAreaUnknown:true,
  noVerifiedFasteners:true,constructionAllowed:false});
}
/** Analytic convex half-space ray, independent of the sampled preview mesh. */
export function rayD36Socket(socket,origin,direction,maxDistance=6){
 if(socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||!vec(origin)||!vec(direction)||
  length(direction)<E||!Number.isFinite(maxDistance)||maxDistance<=0||maxDistance>24)
  throw TypeError('D36 exact convex socket ray invalid');
 const d=unit(direction);let near=0,far=maxDistance;
 for(const f of socket.faces){const numerator=f.offset-dot(f.normal,origin),denominator=dot(f.normal,d);
  if(Math.abs(denominator)<1e-12){if(numerator<-1e-9)return null;continue;}
  const t=numerator/denominator;if(denominator<0)near=Math.max(near,t);else far=Math.min(far,t);
  if(far<near-1e-8)return null;
 }
 return near<=maxDistance?near:null;
}
export function previewD36PaletteAndRay(socket,{maxMeshTriangles=256}={}){
 const mesh=socket?.mesh;if(!mesh?.positions||!mesh?.colors||!mesh?.indices||
  mesh.indices.length/3>maxMeshTriangles||!Number.isSafeInteger(maxMeshTriangles)||maxMeshTriangles<1)
  throw TypeError('D36 bounded original-Palette connector preview required');
 const center=socket.wallCap.reduce((p,a)=>plus(p,mul(a,.25)),[0,0,0]);
 const normal=socket.faces.find(f=>f.ids.every(id=>id<4))?.normal;
 if(!normal)throw Error('D36 wall cap missing from actual convex mesh');
 const origin=plus(center,mul(normal,2)),direction=mul(normal,-1),
  analytic=rayD36Socket(socket,origin,direction),rendered=d31RayPreviewTriangles(mesh,origin,direction,6);
 if(analytic===null||rendered===null||Math.abs(analytic-rendered)>.00005)
  throw Error('D36 independent source-colored triangulation and exact convex collision ray differ');
 return Object.freeze({triangles:mesh.indices.length/3,bytes:mesh.positions.byteLength+mesh.colors.byteLength+mesh.indices.byteLength,
  rayDelta:Math.abs(analytic-rendered),originalOwnerPaletteId:61,
  derivedVisualEndFacesHaveNoApprovedUV:true,actualSourceOwnedRuntimeMeshRegistered:false,
  materialAndRatedConnectorUnknown:true,constructionAllowed:false});
}
