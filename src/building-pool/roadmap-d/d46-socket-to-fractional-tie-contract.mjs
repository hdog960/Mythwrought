// D46 strictly unregistered original-source geometry: D36 socket -> D45 fractional
// egress -> separately proposed D43 exterior footing. Do not install/approve.
import {d36SocketHitsAABB} from './d36-wall-socket-convex-preview.mjs';
import {d31PreviewHitsAABB,d31RayPreviewTriangles} from './d31-pack2-owner-oblique-preview.mjs';
const E=1e-8,HW=.08;
const vec=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const ibox=b=>b&&vec(b.min)&&vec(b.max)&&b.min.every((v,i)=>v<b.max[i]);
const ob=(a,b)=>a.min.every((v,i)=>v<b.max[i]-E&&b.min[i]<a.max[i]-E);
const box=(a,b)=>Object.freeze({min:Object.freeze([...a]),max:Object.freeze([...b])});
const mkBox=(a,b,r=HW)=>box(a.map((v,i)=>Math.min(v,b[i])-r),a.map((v,i)=>Math.max(v,b[i])+r));
const axisOf=p=>p==='x'?0:p==='z'?2:-1;
const key=(x,y,z)=>`${x},${y},${z}`;
const ROOT=new Set(['foundation','floor','wall','partition','column','beam']);
const isRoot=(src,p)=>p[1]===6&&src.get(p[0],0,p[2])?.role==='foundation'&&
 src.get(p[0],1,p[2])?.role==='floor'&&src.get(p[0],7,p[2])?.asset==='live:wood'&&
 Array.from({length:7},(_,i)=>ROOT.has(src.get(p[0],i,p[2])?.role)).every(Boolean);
const ensure=(socket,source)=>{
 if(socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||
    socket.constructionAllowed!==false||!Array.isArray(socket.vertices)||
    socket.vertices.length!==8||!ibox(socket.bounds)||!vec(socket.wall)||
    typeof source?.get!=='function'||!(source.nav instanceof Set))
  throw TypeError('D46 authentic unregistered D36 convex socket and original read-only cell source');
};
/** Independently sweep FULL fractional box volume, not sampled voxel centers. */
export function probeD46FractionalPhysicalSegment(a,b,source,{
 socket=null,otherOwners=[],maxCells=128,halfWidth=HW
}={}){
 if(!vec(a)||!vec(b)||Math.hypot(...a.map((v,i)=>v-b[i]))<E||
  a.filter((v,i)=>Math.abs(v-b[i])>E).length!==1||
  typeof source?.get!=='function'||!(source.nav instanceof Set)||
  !Number.isSafeInteger(maxCells)||maxCells<4||maxCells>256||halfWidth!==HW||
  (socket!==null&&!ibox(socket.bounds))||!Array.isArray(otherOwners)||otherOwners.length>90||
  otherOwners.some(o=>!Array.isArray(o?.ownerOBBs)))
  throw TypeError('D46 requires bounded source-authenticated orthogonal fractional full segment');
 const volume=mkBox(a,b),lo=volume.min.map(v=>Math.floor(v+E)),
  hi=volume.max.map(v=>Math.ceil(v-E)-1),count=lo.reduce((n,v,i)=>n*(hi[i]-v+1),1);
 if(count<1||count>maxCells)throw RangeError('D46 full-volume original-cell sweep budget');
 const solids=[],walk=[];
 for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
  const c=source.get(x,y,z),cell=box([x,y,z],[x+1,y+1,z+1]);
  if(c&&ob(volume,cell))solids.push(Object.freeze({at:Object.freeze([x,y,z]),role:c.role,asset:c.asset}));
  if(source.nav.has(key(x,2,z))&&ob(volume,box([x+.2,2,z+.2],[x+.8,4.5,z+.8])))
    walk.push(Object.freeze([x,2,z]));
 }
 const socketAABB=socket!==null&&ob(volume,socket.bounds);
 const socketExact=socketAABB&&d36SocketHitsAABB(socket,volume.min,volume.max);
 const ownerIntersections=otherOwners.filter(o=>d31PreviewHitsAABB(o,volume.min,volume.max)).length;
 return Object.freeze({format:'mythwrought.d46.original-fractional-physical-segment.v1',volume,
  sourceSolids:solids.length,authoredWALKIntersections:walk.length,
  sourceSolidWitnesses:Object.freeze(solids.slice(0,6)),socketBroadPhaseOverlap:Boolean(socketAABB),
  socketExactPositiveVolumeIntersection:Boolean(socketExact),otherOwnerIntersections:ownerIntersections,
  originalY7OrAboveHits:solids.filter(s=>s.at[1]>=7).length,
  sourceAndBodyClear:solids.length===0&&walk.length===0,
  fullGeometryClear:solids.length===0&&walk.length===0&&!socketExact&&!ownerIntersections,
  originalEdits:0,registeredConnector:false,constructionAllowed:false});
}
const area2D=(vertices,i,j)=>{
 if(vertices.length<3)return 0;
 const pts=vertices.map(v=>[v[i],v[j]]);
 const unique=[];for(const p of pts)if(!unique.some(q=>Math.hypot(p[0]-q[0],p[1]-q[1])<1e-7))unique.push(p);
 if(unique.length<3)return 0;
 const mid=[unique.reduce((v,p)=>v+p[0],0)/unique.length,unique.reduce((v,p)=>v+p[1],0)/unique.length];
 unique.sort((p,q)=>Math.atan2(p[1]-mid[1],p[0]-mid[0])-Math.atan2(q[1]-mid[1],q[0]-mid[0]));
 return Math.abs(unique.reduce((v,p,k)=>v+p[0]*unique[(k+1)%unique.length][1]-p[1]*unique[(k+1)%unique.length][0],0))/2;
};
/** Screen the MISSING socket-to-dogleg connection without inventing a fastener.
 * The optional straight-neck SAMPLE is deliberately tangent to the extreme
 * lateral face of the D36 hull, not allowed to overlap original source.
 * AABB touch is NOT positive source-hull face area: evaluate actual vertices. */
export function inspectD46ActualSocketDoglegGap(socket,dog,source,{maxCells=128}={}){
 ensure(socket,source);
 if(dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
    dog.constructionAllowed!==false||dog.wall.some((v,i)=>v!==socket.wall[i])||
    dog.plane!==socket.plane||dog.rootAtEnd!==socket.rootAtEnd||
    ![-1,1].includes(dog.side)||![5,6].includes(dog.height)||
    dog.fullPrismBounds?.length!==2||!dog.fullPrismBounds.every(ibox)||!vec(dog.path?.[0]))
   throw Error('D46 socket and original D45 two-segment source ownership mismatch');
 const axis=axisOf(socket.plane),lat=axis===0?2:0,sgn=socket.rootAtEnd?-1:1,
  first=dog.fullPrismBounds[0],socketAx=sgn>0?socket.bounds.max[axis]:socket.bounds.min[axis],
  dogAx=sgn>0?first.min[axis]:first.max[axis],signedGap=(dogAx-socketAx)*sgn,
  face=socket.wall[axis]+(socket.rootAtEnd?0:1),
  // Centerline remains >.08 outside the authored wall, so the FULL .16-wide
  // prism never clips the protected original Y6 wall.
  insideAx=face+sgn*.09,exitAx=dogAx-sgn*HW;
 const from=[...dog.path[0]],to=[...dog.path[0]];
 from[axis]=insideAx;to[axis]=exitAx;
 if((exitAx-insideAx)*sgn<=.02)throw Error('D46 no positive physical neck length');
 const neck=mkBox(from,to);
 // True socket lateral OUTER boundary has only edges in present D36 mesh.
 const extreme=dog.side>0?socket.bounds.min[lat]:socket.bounds.max[lat],
  dogNear=dog.side>0?first.max[lat]:first.min[lat],
  sideGap=dog.side*(extreme-dogNear),
  extremeVertices=socket.vertices.filter(v=>Math.abs(v[lat]-extreme)<1e-7),
  sideArea=area2D(extremeVertices,axis,1);
 if(Math.abs(sideGap)>1e-6)throw Error('D46 original socket and claimed dogleg side mismatch');
 const neckSweep=probeD46FractionalPhysicalSegment(from,to,source,{socket,maxCells}),
  actualSocketOverlap=d36SocketHitsAABB(socket,neck.min,neck.max),
  touchingDogAx=Math.abs(dogAx-(sgn>0?neck.max[axis]:neck.min[axis]))<1e-8;
 // The neck touches the dog's full square end cap, but socket-side contact
 // is only a zero-area edge if its extreme lateral hull has <3 unique points.
 const dogEndContactArea=touchingDogAx?(first.max[1]-first.min[1])*(first.max[lat]-first.min[lat]):0;
 return Object.freeze({format:'mythwrought.d46.actual-hull-and-fractional-egress-continuity-screen.v1',
  wall:Object.freeze([...socket.wall]),plane:socket.plane,side:dog.side,height:dog.height,
  signedAxialSocketToDoglegGap:signedGap,signedLateralOuterExtremeGap:sideGap,
  proposedUnregisteredNeckBounds:neck,neckSourceClear:neckSweep.sourceAndBodyClear,
  neckOriginalSourceHits:neckSweep.sourceSolids,neckWalkHits:neckSweep.authoredWALKIntersections,
  neckExactSocketPenetration:actualSocketOverlap,
  socketActualExtremeFaceArea:sideArea,socketExtremeHullVertexCount:extremeVertices.length,
  doglegNeckTruePositiveEndFaceArea:dogEndContactArea,
  positiveAreaSocketToNeckAttachmentProven:false,independentMechanicalCaptureProven:false,
  originalD36ConvexHullUnchanged:true,originalD45PrismsUnchanged:true,
  originalCellsWritten:0,constructionAllowed:false});
}
/** Complete D45 dogleg -> original D43 candidate footprint, TWO fractional
 * Manhattan orders; all physical corners/segments checked with original cells,
 * authored WALK and D36 original convex hull. This never includes the missing
 * socket connector or an independently validated footing. */
export function inspectD46FractionalExitToOutboard(dog,site,source,{
 socket=null,otherOwners=[],maxCells=128
}={}){
 if(dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
    !dog.path||dog.path.length!==3||dog.constructionAllowed!==false||
    !Array.isArray(site)||site.length!==3||!site.every(Number.isSafeInteger)||site[1]!==6||
    !(site[0]!==dog.wall[0]||site[2]!==dog.wall[2])||![5,6].includes(dog.height))
    throw TypeError('D46 authentic fractional original exit and author-source prospective footing required');
 const start=dog.path[2],target=[site[0]+.5,dog.height+.5,site[2]+.5],trial=[];
 for(const order of [[0,2],[2,0]]){
  const points=[[...start]];let p=[...start];
  for(const ax of order){if(Math.abs(p[ax]-target[ax])>E){p=[...p];p[ax]=target[ax];points.push(p);}}
  const sweeps=[];let sourceHits=0,walk=0,socketHits=0,owners=0;
  for(let i=1;i<points.length;i++){
   const q=probeD46FractionalPhysicalSegment(points[i-1],points[i],source,{socket,otherOwners,maxCells});
   sweeps.push(q);sourceHits+=q.sourceSolids;walk+=q.authoredWALKIntersections;
   socketHits+=Number(q.socketExactPositiveVolumeIntersection);owners+=q.otherOwnerIntersections;
  }
  trial.push(Object.freeze({order:order[0]===0?'x-then-z':'z-then-x',
   points:Object.freeze(points.map(q=>Object.freeze([...q]))),testedFullPrisms:sweeps.length,
   firstAuthoredBlocker:sweeps.find(q=>q.sourceSolids)?.sourceSolidWitnesses[0]??null,
   sourceSolidIntersections:sourceHits,walkingBodyIntersections:walk,
   realD36SocketPositiveVolumeIntersections:socketHits,otherProposedOwnerIntersections:owners,
   fullExtensionSourceAndBodyClear:sourceHits===0&&walk===0,
   fullExtensionPhysicalClear:sourceHits===0&&walk===0&&!socketHits&&!owners,
   extensionDoesNotProveSocketCoupler:true,independentFootingRated:false,
   originalSourceCellsWritten:0,constructionAllowed:false}));
 }
 return Object.freeze({format:'mythwrought.d46.unbuilt-full-frac-exterior-to-footprint.v1',
  sourceDoglegPhysicallyClear:dog.allPhysicalVolumesClear,
  site:Object.freeze([...site]),height:dog.height,side:dog.side,
  approaches:Object.freeze(trial),anyCompletelyClearExtension:trial.some(t=>t.fullExtensionPhysicalClear),
  actualSocketToOutboardMechanicallyContinuous:false,
  generatedWorldTerrainAndCavesCertified:false,fastenerOwnerAuthorized:false,
  originalWorldAndSaveUnmodified:true,constructionAllowed:false});
}
function meshForBox(vol,color){
 const [x,y,z]=vol.min,[X,Y,Z]=vol.max,
 faces=[[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z]],[[x,y,Z],[x,Y,Z],[X,Y,Z],[X,y,Z]],
 [[x,y,z],[x,Y,z],[x,Y,Z],[x,y,Z]],[[X,y,z],[X,y,Z],[X,Y,Z],[X,Y,z]],
 [[x,y,z],[x,y,Z],[X,y,Z],[X,y,z]],[[x,Y,z],[X,Y,z],[X,Y,Z],[x,Y,Z]]];
 const positions=[],colors=[],indices=[];
 for(const quad of faces){let k=positions.length/3;for(const p of quad){positions.push(...p);colors.push(...color);}indices.push(k,k+1,k+2,k,k+2,k+3);}
 return {positions:Float32Array.from(positions),colors:Float32Array.from(colors),indices:Uint16Array.from(indices)};
}
/** Preview-only RGB / physical AABB vs actual triangles, no world renderer. */
export function inspectD46OriginalPaletteExtensionRay(a,b,palette){
 if(JSON.stringify(palette?.metal)!=='[0.29,0.32,0.33]'||
  JSON.stringify(palette?.base)!=='[0.4,0.24,0.17]'||!vec(a)||!vec(b)||
  a.filter((v,i)=>Math.abs(v-b[i])>E).length!==1)
  throw TypeError('D46 genuine original Pack2 61 palette source and full physical fractional segment required');
 const v=mkBox(a,b),mesh=meshForBox(v,palette.metal),
  origin=[(v.min[0]+v.max[0])/2,(v.min[1]+v.max[1])/2,v.min[2]-1],
  hit=d31RayPreviewTriangles(mesh,origin,[0,0,1],4),analytic=1;
 if(hit===null||Math.abs(hit-analytic)>1e-5)
  throw Error('D46 independent original-source-color triangles disagree with physical prism');
 return Object.freeze({sourceOriginalPack2ID:61,unregisteredSourcePaletteOnly:true,
  fullSegmentColoredMeshTriangles:mesh.indices.length/3,
  physicalAABBVsActualTriangleDelta:Math.abs(hit-analytic),
  originalID61CanonicalOwnersUnchanged:true,actualProductionPickingValidated:false,
  ratedFastenerOrConnectorOwner:false,constructionAllowed:false});
}

/** Independently list D43's EXACT nearest FOOTPRINT candidates only, without
 * repeating its already-verified Y6 Manhattan route suite. At Y0/Y1 NULL
 * means an empty authored blueprint, NOT existing ground or known terrain. */
export function listD46OriginalUnprovenOutboardFootprints(wall,plane,rootAtEnd,src,socket,{limit=12}={}){
 if(!Array.isArray(wall)||wall.length!==3||!wall.every(Number.isSafeInteger)||wall[1]!==6||
    !['x','z'].includes(plane)||typeof rootAtEnd!=='boolean'||!isRoot(src,wall)||
    socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||
    !Number.isSafeInteger(limit)||limit<1||limit>12)
  throw TypeError('D46 genuine original wall, original source and bounded D43 prospective footprint census');
 const [x,,z]=wall,sign=rootAtEnd?-1:1,
  front=plane==='x'?[x+sign,z]:[x,z+sign],points=[];let vetoSolid=0,vetoWalk=0,existing=0;
 const overlaps=(a,b)=>a.min.every((v,i)=>v<b.max[i]-1e-8&&b.min[i]<a.max[i]-1e-8);
 for(let a=x-4;a<=x+4;a++)for(let c=z-4;c<=z+4;c++){
  if(Math.abs(a-x)+Math.abs(c-z)<2)continue;
  const distance=Math.abs(front[0]-a)+Math.abs(front[1]-c);
  if(distance>10)continue;
  const rooted=src.get(a,0,c)?.role==='foundation'&&src.get(a,1,c)?.role==='floor'&&
   ['wall','partition','column'].includes(src.get(a,6,c)?.role)&&
   Array.from({length:7},(_,y)=>ROOT.has(src.get(a,y,c)?.role)).every(Boolean);
  if(rooted)existing++;
  const clearAuthorFloor=src.get(a,0,c)==null&&src.get(a,1,c)==null,
   heightBox={min:[a+.33,2,c+.33],max:[a+.67,6.95,c+.67]},
   solidity=Array.from({length:5},(_,j)=>src.get(a,j+2,c)).some(Boolean),
   walk=src.nav.has(`${a},2,${c}`),socketClash=overlaps(heightBox,socket.bounds);
  if(solidity)vetoSolid++;
  if(walk)vetoWalk++;
  if(clearAuthorFloor&&!solidity&&!walk&&!socketClash)points.push({at:[a,6,c],distance});
 }
 points.sort((a,b)=>a.distance-b.distance||a.at[0]-b.at[0]||a.at[2]-b.at[2]);
 return Object.freeze({format:'mythwrought.d46.original-source-D43-footprint-only.v1',
  originalAuthoredRoot:wall,unverifiedCandidateCount:Math.min(points.length,limit),
  existingRootedSourceObservations:existing,solidColumnVetoObservations:vetoSolid,
  authoredWalkColumnVetoObservations:vetoWalk,
  prospectiveSites:Object.freeze(points.slice(0,limit).map(p=>Object.freeze({at:Object.freeze(p.at),distance:p.distance}))),
  readOnlyOriginalY0Y1VacancyNotTerrainGround:true,geologicalSupportVerified:false,
  independentColumnActualMaterialOwner:false,constructionAllowed:false});
}
