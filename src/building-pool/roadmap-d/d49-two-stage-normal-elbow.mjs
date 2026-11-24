// MYTHWROUGHT D49 — uninstalled, bounded two-stage slope-normal elbow study.
// No original material ID, fastener, authored cell, foundation, or runtime edit.
import {d47ConvexPositiveVolumeCollision} from './d47-original-congruent-socket-saddle.mjs';
import {d31RayPreviewTriangles} from './d31-pack2-owner-oblique-preview.mjs';
const EPS=1e-8, fin=n=>typeof n==='number'&&Number.isFinite(n);
const is3=p=>Array.isArray(p)&&p.length===3&&p.every(fin);
const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]);
const mul=(a,k)=>a.map(x=>x*k),dot=(a,b)=>a.reduce((s,x,i)=>s+x*b[i],0);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const len=a=>Math.hypot(...a),unit=a=>{const m=len(a);if(m<EPS)throw Error('D49 degenerate physical segment');return mul(a,1/m)};
const area=t=>len(cross(sub(t[1],t[0]),sub(t[2],t[0])))/2;
const center=t=>mul(t.reduce((s,p)=>add(s,p),[0,0,0]),1/t.length);
const bounds=p=>({min:[0,1,2].map(i=>Math.min(...p.map(x=>x[i]))),max:[0,1,2].map(i=>Math.max(...p.map(x=>x[i])))});
const edges=[[0,1],[1,2],[2,0],[3,4],[4,5],[5,3],[0,3],[1,4],[2,5]];
function prism(low,high,color,stage){
 const delta=sub(center(high),center(low)),n=unit(cross(sub(low[1],low[0]),sub(low[2],low[0])));
 if(Math.abs(dot(delta,n))<1e-6)throw Error('D49 zero-volume or tangential-only convex prism');
 const points=[...low,...high],positions=[],colors=[],indices=[];
 for(const f of [[0,2,1],[3,4,5],[0,1,4],[0,4,3],[1,2,5],[1,5,4],[2,0,3],[2,3,5]]){
  const at=positions.length/3;for(const i of f){positions.push(...points[i]);colors.push(...color)}indices.push(at,at+1,at+2);
 }
 const normals=[n,mul(n,-1),...[[0,1],[1,2],[2,0]].map(([i,j])=>unit(cross(sub(low[j],low[i]),delta)))];
 return Object.freeze({format:'mythwrought.d49.unregistered-source-slope-elbow-stage.v1',stage,
  vertices:points,faces:normals.map(normal=>({normal})),edges,bounds:bounds(points),
  mesh:{positions:Float32Array.from(positions),colors:Float32Array.from(colors),indices:Uint16Array.from(indices)},
  capArea:area(low),translation:delta,originalId61PaletteOnly:true,registeredOwner:false,
  strengthAndFastenerAuthenticated:false,constructionAllowed:false});
}
const paletteOK=p=>JSON.stringify(p?.metal)==='[0.29,0.32,0.33]'&&
 JSON.stringify(p?.base)==='[0.4,0.24,0.17]'&&JSON.stringify(p?.grain)==='[0.22,0.13,0.11]';
function cube(lo,hi){const p=[];for(const x of [lo[0],hi[0]])for(const y of [lo[1],hi[1]])for(const z of [lo[2],hi[2]])p.push([x,y,z]);
 const e=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if([1,2,4].includes(i^j))e.push([i,j]);
 return {vertices:p,edges:e,faces:[{normal:[1,0,0]},{normal:[0,1,0]},{normal:[0,0,1]}]};}
function obb(src){const p=[];for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1]){
  let v=[...src.center];for(const [j,k] of [x,y,z].entries())v=add(v,mul(src.axes[j],src.half[j]*k));p.push(v);
 }const e=[];for(let i=0;i<8;i++)for(let j=i+1;j<8;j++)if([1,2,4].includes(i^j))e.push([i,j]);
 return {vertices:p,edges:e,faces:src.axes.map(normal=>({normal}))};}
/** Real triangular endcap of one D48 patch shared exactly with the first stage,
 * and shared whole-area stage1/stage2 elbow cap. Stage2 terminates at D45
 * physical dogleg START centroid; it does not imply fastening to that dogleg.
 * Must independently check source/socket/self collisions using inspector below.
 */
export function deriveD49NormalDepartureAndElbow(patch,dog,palette,{normalLength=.16}={}){
 if(patch?.format!=='mythwrought.d48.unregistered-slope-subface-patch.v1'||
  patch.constructionAllowed!==false||patch.vertices?.length!==6||!is3(patch.faceNormal)||
  dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
  dog.constructionAllowed!==false||dog.path?.length!==3||!is3(dog.path[0])||
  !paletteOK(palette)||![.08,.16,.32,.48].includes(normalLength))
  throw TypeError('D49 exact immutable D48 slope cap, D45 full dogleg and fixed bounded owner palette required');
 const low=patch.vertices.slice(3,6),n=unit(patch.faceNormal),
  elbowLow=low.map(p=>add(p,mul(n,normalLength))),
  target=dog.path[0],turn=sub(target,center(elbowLow)),
  elbowHigh=elbowLow.map(p=>add(p,turn)),
  departure=prism(low,elbowLow,palette.metal,'normal-departure'),
  elbow=prism(elbowLow,elbowHigh,palette.metal,'dogleg-elbow');
 if(Math.abs(departure.capArea-patch.actualSourceContactArea)>1e-7||
  Math.abs(elbow.capArea-patch.actualSourceContactArea)>1e-7||
  !elbowLow.every((p,i)=>p.every((v,j)=>Math.abs(v-elbow.vertices[i][j])<1e-12)))
  throw Error('D49 positive-area original socket cap or elbow endcap disjoint');
 const outwardNormal=dot(departure.translation,n),turnNormal=dot(turn,n),
  stageSelfOverlap=d47ConvexPositiveVolumeCollision(departure,elbow);
 return Object.freeze({format:'mythwrought.d49.unregistered-two-stage-convex-slope-connector.v1',
  departure,elbow,originalD48ContactArea:patch.actualSourceContactArea,
  elbowCapContactArea:elbow.capArea,normalLength,outwardNormal,turnNormal,
  doglegStartTarget:target,actualElbowEndCentroid:center(elbowHigh),
  positiveVolumeSelfOverlap:stageSelfOverlap,
  authenticSlopedFaceNormal:Object.freeze([...n]),trueMechanicalFastening:false,
  originalSourceUnmodified:true,unregisteredOwnerId:null,
  structuralCapacity:null,constructionAllowed:false});
}
/** SAT real source cubes (including Y7 roof), conservative Y2 standing body,
 * current original D36 socket, and all supplied D31 member OBBs. Checks both
 * thick prisms, without treating normal face touching as volume penetration.
 */
export function inspectD49FullVolumeConnection(two,patch,dog,socket,source,wall,{otherOwners=[],maxCells=192}={}){
 if(two?.format!=='mythwrought.d49.unregistered-two-stage-convex-slope-connector.v1'||
  patch?.format!=='mythwrought.d48.unregistered-slope-subface-patch.v1'||
  socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1'||
  dog?.format!=='mythwrought.builder-d.d45.unregistered-actual-thickness-fractional-egress.v1'||
  typeof source?.get!=='function'||!(source.nav instanceof Set)||!is3(wall)||
  !Array.isArray(otherOwners)||otherOwners.length>90||!Number.isSafeInteger(maxCells)||maxCells<16||maxCells>512)
  throw TypeError('D49 original physical source, socket, full dogleg, convex evidence and bounded owners required');
 const stats={solid:0,walk:0,otherMember:0,socket:0,solidCoordinates:[],stages:[]};
 for(const shape of [two.departure,two.elbow]){
  const lo=shape.bounds.min.map(x=>Math.floor(x+EPS)),hi=shape.bounds.max.map(x=>Math.ceil(x-EPS)-1);
  const count=lo.reduce((v,x,i)=>v*(hi[i]-x+1),1);
  if(count<1||count>maxCells)throw RangeError('D49 finite full-volume source sweep budget');
  const current={stage:shape.stage,solid:0,walk:0,otherMember:0,socket:0};
  for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
   if(source.get(x,y,z)&&d47ConvexPositiveVolumeCollision(shape,cube([x,y,z],[x+1,y+1,z+1]))){
    current.solid++;if(stats.solidCoordinates.length<12)stats.solidCoordinates.push({at:[x,y,z],relative:[x-wall[0],y-wall[1],z-wall[2]],role:source.get(x,y,z)?.role});
   }
   if(source.nav.has(`${x},2,${z}`)&&d47ConvexPositiveVolumeCollision(shape,cube([x+.2,2,z+.2],[x+.8,4.5,z+.8])))current.walk++;
  }
  if(d47ConvexPositiveVolumeCollision(shape,socket))current.socket++;
  for(const member of otherOwners)for(const box of member?.ownerOBBs??[])if(d47ConvexPositiveVolumeCollision(shape,obb(box)))current.otherMember++;
  for(const k of ['solid','walk','socket','otherMember'])stats[k]+=current[k];
  stats.stages.push(current);
 }
 const first=dog.fullPrismBounds?.[0];if(!first?.min||!first?.max)throw Error('D49 physical D45 first prism is missing');
 const firstDog=cube(first.min,first.max),dogOverlap=d47ConvexPositiveVolumeCollision(two.elbow,firstDog);
 const departureValid=two.outwardNormal>0&&two.originalD48ContactArea>.008&&
  !d47ConvexPositiveVolumeCollision(two.departure,patch);
 // A complete positive-area elbow joint and contact patch do not establish
 // mechanical tensile attachment, rated anchor or actual independent footing.
 const geometric=departureValid&&two.turnNormal>1e-8&&!two.positiveVolumeSelfOverlap&&
  stats.solid===0&&stats.walk===0&&stats.socket===0&&stats.otherMember===0&&dogOverlap;
 return Object.freeze({format:'mythwrought.d49.original-unrated-two-stage-physical-screen.v1',
  ...stats,fullPhysicalDoglegPositiveVolumeOverlap:dogOverlap,
  positiveAreaOriginalSocketSlopedContact:two.originalD48ContactArea,
  positiveAreaStageToStageEndcap:two.elbowCapContactArea,
  nonpenetratingOriginalSocket:stats.socket===0,
  outwardNormalDepartureValid:departureValid,secondElbowContinuesOutward:two.turnNormal>1e-8,
  noStageSelfOverlap:!two.positiveVolumeSelfOverlap,
  physicalGeometryCandidateClear:geometric,
  loadBearingMechanicalFastenerPresent:false,foundationAndRoofRatingPresent:false,
  sourceOriginalWrites:0,constructionAllowed:false});
}
/** Exact original source-colored triangle mesh versus independent expected cap
 * plane distance; neither source-derived RGB nor ray implies runtime picking. */
export function sampleD49StageTriangleRay(two){
 if(two?.format!=='mythwrought.d49.unregistered-two-stage-convex-slope-connector.v1')throw TypeError('D49 two-stage original sloped physical source required');
 let maxDelta=0;
 for(const stage of [two.departure,two.elbow]){
  const target=center(stage.vertices.slice(3,6)),axis=unit(stage.translation),from=add(target,mul(axis,.6)),dir=mul(axis,-1);
  const projected=d31RayPreviewTriangles(stage.mesh,from,dir,3);
  if(projected===null||Math.abs(projected-.6)>1e-5)throw Error('D49 exact source-palette 3D triangle/analytic outward endcap ray mismatch');
  maxDelta=Math.max(maxDelta,Math.abs(projected-.6));
 }
 return Object.freeze({stageSamples:2,trianglesPerStage:8,maxRayDelta:maxDelta,
  originalPaletteID:61,originalShapeOwnerUnchanged:true,realRuntimePickingTested:false,
  constructionAllowed:false});
}
