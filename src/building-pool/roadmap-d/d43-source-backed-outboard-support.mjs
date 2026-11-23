// MYTHWROUGHT Builder D43: authentic original-W16/W17, source-only alternate
// tension reaction TOPOLOGY. No support member, footing, fastener, material ID,
// original author cell, WALK, terrain or save is placed or changed.
import {probeD40ActualStrapSweep,deriveD40UnregisteredStrapSegment,
 inspectD40StrapMeshRay} from './d40-swept-exterior-capture.mjs';
const EPS=1e-8,KEY=(x,y,z)=>`${x},${y},${z}`;
const STABLE=new Set(['foundation','floor','wall','partition','column','beam']);
const SUPPORT=new Set(['wall','partition','column']);
const is3=a=>Array.isArray(a)&&a.length===3&&a.every(Number.isSafeInteger);
const validBounds=b=>b&&Array.isArray(b.min)&&Array.isArray(b.max)&&
 b.min.length===3&&b.max.length===3&&b.min.every(Number.isFinite)&&b.max.every(Number.isFinite)&&
 b.min.every((v,i)=>v<b.max[i]);
const overlap=(a,b)=>[0,1,2].every(i=>a.min[i]<b.max[i]-EPS&&b.min[i]<a.max[i]-EPS);
const box=(x,z)=>({min:[x+.33,2,z+.33],max:[x+.67,6.95,z+.67]});
function checkRoot(wall,source){
 const [x,y,z]=wall;
 if(!is3(wall)||y!==6||typeof source?.get!=='function'||!(source.nav instanceof Set)||
  source.get(x,0,z)?.role!=='foundation'||source.get(x,1,z)?.role!=='floor'||
  !SUPPORT.has(source.get(x,6,z)?.role)||source.get(x,7,z)?.asset!=='live:wood'||
  !Array.from({length:7},(_,n)=>STABLE.has(source.get(x,n,z)?.role)).every(Boolean))
  throw Error('D43 exact original authored Y0–Y7 rooted wall, WALK and wood required');
}
function pylonVolumeClear(x,z,source,socket){
 const vol=box(x,z);let solid=0,walk=0;
 for(let y=2;y<=6;y++){
  if(source.get(x,y,z)&&overlap(vol,{min:[x,y,z],max:[x+1,y+1,z+1]}))solid++;
 }
 if(source.nav.has(KEY(x,2,z))&&overlap(vol,{min:[x+.2,2,z+.2],max:[x+.8,4.5,z+.8]}))walk++;
 return {solid,walk,socket:Number(socket!==null&&overlap(vol,socket)),volume:vol,
  clear:solid===0&&walk===0&&!(socket&&overlap(vol,socket))};
}
function existingRootedColumn(x,z,source){
 if(source.get(x,0,z)?.role!=='foundation'||source.get(x,1,z)?.role!=='floor'||
    !SUPPORT.has(source.get(x,6,z)?.role))return false;
 return Array.from({length:7},(_,y)=>STABLE.has(source.get(x,y,z)?.role)).every(Boolean);
}
/** The exposed lateral side normal is orthogonal to the original truss axial
 * tension direction. Even a source-clear, front-reachable side face does NOT
 * mechanically resist axial pullout by normal bearing. */
export function inspectD43TangentialWallFace(wall,plane,rootAtEnd,face){
 if(!is3(wall)||wall[1]!==6||!['x','z'].includes(plane)||typeof rootAtEnd!=='boolean'||
  !face||!is3(face.at)||face.at[1]<5||face.at[1]>6||
  typeof face.sourceClear!=='boolean'||typeof face.reachableFromFront!=='boolean')
  throw TypeError('D43 authentic typed original side-face witness required');
 const [x,,z]=wall,[px,,pz]=face.at,dx=px-x,dz=pz-z;
 if(Math.abs(dx)+Math.abs(dz)!==1||(plane==='x'&&dx!==0)||(plane==='z'&&dz!==0))
  throw Error('D43 side-face cannot be misrepresented as original axial rear face');
 const faceNormal=[dx,0,dz],tensileUnit=plane==='x'?[rootAtEnd?-1:1,0,0]:[0,0,rootAtEnd?-1:1];
 const dot=faceNormal.reduce((n,v,i)=>n+v*tensileUnit[i],0);
 if(dot!==0)throw Error('D43 original lateral face is not tangent to roof tensile load');
 return Object.freeze({at:Object.freeze([...face.at]),sourceClear:face.sourceClear,
  frontReachable:face.reachableFromFront,normal:Object.freeze(faceNormal),
  normalizedTensionDirection:Object.freeze(tensileUnit),normalTensionDot:dot,
  rearFaceMechanicalRetentionProven:false,tangentialShearStrengthKnown:false,
  nonintrusiveFastenerExists:false,constructionAllowed:false});
}
function tiePoints(wall,plane,rootAtEnd,target,order){
 const [x,,z]=wall,sgn=rootAtEnd?-1:1;
 const start=plane==='x'?[x+sgn,6,z]:[x,6,z+sgn],out=[start];
 let q=[...start];const axes=order==='x-first'?[0,2]:[2,0];
 for(const i of axes){const end=target[i];while(q[i]!==end){q=[...q];q[i]+=Math.sign(end-q[i]);out.push(q);}}
 if(out.length>12)throw RangeError('D43 bounded outboard source-only tie footprint');
 return out;
}
function route(wall,plane,rootAtEnd,target,source,socket,halfWidth){
 const routes=[];
 for(const order of ['x-first','z-first']){
  const path=tiePoints(wall,plane,rootAtEnd,target,order),steps=[];
  let sourceHits=0,walkHits=0,socketHits=0,clear=true;
  for(let i=1;i<path.length;i++){
   const e=probeD40ActualStrapSweep(path[i-1],path[i],source,{halfWidth,socketBounds:socket});
   sourceHits+=e.originalSourceCollisionEvents;walkHits+=e.authoredWalkBodyCollisionEvents;
   socketHits+=e.socketCollisionEvents;steps.push(e);
   if(!e.clearedEntireStraightPhysicalEnvelope){clear=false;break;}
  }
  // It never connects to the socket: an ACTUAL physical coupler must still
  // be independently source-owned, tested, registered and rated.
  routes.push({order,clear,path:clear?path:[],sourceHits,walkHits,socketHits,
   testedEdges:steps.length,connectsToOriginalSocket:false,
   loadRated:false});
 }
 return routes;
}
/** Source-authentic prospective independent support census. An EMPTY
 * exterior footprint at Y0/Y1 is *NOT* a verified foundation in terrain.
 * An EXISTING authored rooted wall/column is not independent of its building
 * merely because it has foundation voxels. Neither is a rated tensile path. */
export function inspectD43IndependentOutboardSupport(wall,plane,rootAtEnd,source,{
 radius=4,maxTieCandidates=12,halfWidth=.08,socketBounds=null,
 maxSamples=8
}={}){
 checkRoot(wall,source);
 if(!['x','z'].includes(plane)||typeof rootAtEnd!=='boolean'||radius!==4||
  !Number.isSafeInteger(maxTieCandidates)||maxTieCandidates<1||maxTieCandidates>24||
  halfWidth!==.08||socketBounds!==null&&!validBounds(socketBounds)||
  !Number.isSafeInteger(maxSamples)||maxSamples<0||maxSamples>20)
  throw TypeError('D43 original bounded source and independent-support study budget');
 const [x,,z]=wall,frontSign=rootAtEnd?-1:1;
 const front=plane==='x'?[x+frontSign,z]:[x,z+frontSign],
  all=[];let existingRooted=0,originalGroundLayersOpen=0,exteriorVolumeClear=0,
  authoredWalkColumnVeto=0,authoredOccupiedColumnVeto=0;
 for(let a=x-radius;a<=x+radius;a++)for(let c=z-radius;c<=z+radius;c++){
  if(Math.abs(a-x)+Math.abs(c-z)<2)continue;
  const distance=Math.abs(front[0]-a)+Math.abs(front[1]-c);
  if(distance>10)continue;
  const existing=existingRootedColumn(a,c,source);
  if(existing)existingRooted++;
  const clearFoot=source.get(a,0,c)==null&&source.get(a,1,c)==null;
  if(clearFoot)originalGroundLayersOpen++;
  const site=pylonVolumeClear(a,c,source,socketBounds);
  if(site.solid)authoredOccupiedColumnVeto++;
  if(site.walk)authoredWalkColumnVeto++;
  if(clearFoot&&site.clear)exteriorVolumeClear++;
  if(clearFoot&&site.clear)all.push({x:a,z:c,distance});
 }
 all.sort((a,b)=>a.distance-b.distance||a.x-b.x||a.z-b.z);
 let corridorsSourceClear=0,anchorValidated=0,unverifiedFootings=0,
  sourceHitEdges=0,walkHitEdges=0,socketHitEdges=0,tiesTested=0;
 const candidates=[];let rayParityMax=0,raySamples=0;
 for(const p of all.slice(0,maxTieCandidates)){
  const approaches=route(wall,plane,rootAtEnd,[p.x,6,p.z],source,socketBounds,halfWidth);
  tiesTested+=approaches.reduce((s,a)=>s+a.testedEdges,0);
  sourceHitEdges+=approaches.reduce((s,a)=>s+a.sourceHits,0);
  walkHitEdges+=approaches.reduce((s,a)=>s+a.walkHits,0);
  socketHitEdges+=approaches.reduce((s,a)=>s+a.socketHits,0);
  const chosen=approaches.find(a=>a.clear&&a.path.length>=2);
  if(chosen){corridorsSourceClear++;unverifiedFootings++;}
  if(candidates.length<maxSamples)candidates.push(Object.freeze({
   at:Object.freeze([p.x,6,p.z]),originalSourceY0Y1Empty:true,
   geometricVerticalColumnSpaceClear:true,
   tieCorridorSourceClear:Boolean(chosen),tieSegments:chosen?.testedEdges??null,
   samplePath:Object.freeze(chosen?.path.slice(0,12).map(q=>Object.freeze([...q]))??[]),
   terrainFoundationVerified:false,originalWallToPylonTieFastenerVerified:false,
   authorizedNewSupportFooting:false,constructionAllowed:false}));
 }
 return Object.freeze({format:'mythwrought.builder-d.d43.original-outboard-ground-support-feasibility.v1',
  wall:Object.freeze([...wall]),plane,rootAtEnd,originalSourceRootedAtY0Y1:true,
  unrelatedExistingAuthoredRootedPositions:existingRooted,
  independentlyRatedExistingSupports:0,
  sourceVacantY0Y1FootprintPositions:originalGroundLayersOpen,
  candidateOpenVerticalPylonEnvelopes:exteriorVolumeClear,
  authoredColumnSolidVetoPositions:authoredOccupiedColumnVeto,
  authoredStandingWALKVetoPositions:authoredWalkColumnVeto,
  candidateFootprintsExaminedForTies:Math.min(maxTieCandidates,all.length),
  finitePrismEdgesTested:tiesTested,
  testedPrismSourceCollisionEvents:sourceHitEdges,
  testedPrismWalkingBodyCollisionEvents:walkHitEdges,
  testedPrismSocketCollisionEvents:socketHitEdges,
  sourceClearExternalTieCorridors:corridorsSourceClear,
  sourceClearYetNoActualFoundation:unverifiedFootings,
  authenticatedNewFootings:0,authenticatedTensionConnections:anchorValidated,
  originalD36SocketIsNeverSilentlyConnected:true,
  clearAuthorFootprintDoesNotProveGeneratedTerrainFooting:true,
  existingRootedWallSharesUnratedOriginalBuildingLoadPath:true,
  independentTerrainBearingAndFoundationTensionUnknown:true,
  noRegisteredOwnerOfNewPylonOrTie:true,sourcePaletteOnlyNotRealMeshOrFastener:true,
  sourceIsReadOnly:true,constructionAllowed:false,worldWrites:0,
  candidates:Object.freeze(candidates)});
}
/** Unregistered, original-ID61-palette-only source mesh validation for a
 * geometrically source-clear potential TIE segment; never rates capacity. */
export function sampleD43SourcePaletteTieSegment(a,b,sourcePalette){
 const segment=deriveD40UnregisteredStrapSegment(a,b,sourcePalette),ray=inspectD40StrapMeshRay(segment);
 if(!ray.originalPack2SourceColorPreserved||ray.rayDelta>1e-5)
  throw Error('D43 source palette mesh and analytic physical ray disagree');
 return Object.freeze({previewMeshTriangles:segment.mesh.indices.length/3,
  previewBytes:segment.mesh.positions.byteLength+segment.mesh.colors.byteLength+segment.mesh.indices.byteLength,
  physicalMeshRayDelta:ray.rayDelta,
  originalPack2ID61OwnerUnchanged:true,sourceDerivedPaletteOnly:true,
  actualRegisteredFastenerAndCollider:false,constructionAllowed:false});
}
