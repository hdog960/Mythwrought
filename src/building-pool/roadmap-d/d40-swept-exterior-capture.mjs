// MYTHWROUGHT D40: read-only, finite-thickness exterior path feasibility.
// Original Wave16/17, Pack2 owners, cells, navigation, saves remain unchanged.
// No actual connector, fastener, approved block, rated tensile capture or playtest.
import {d31RayPreviewTriangles} from './d31-pack2-owner-oblique-preview.mjs';
const EPS=1e-8, MOVES=[[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0],[0,-1,0]];
const ROOT=new Set(['foundation','floor','wall','partition','column','beam']);
const int3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const finite3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const key=p=>p.join(',');
const box=(min,max)=>({min,max});
const intersect=(a,b)=>[0,1,2].every(i=>a.min[i]<b.max[i]-EPS&&b.min[i]<a.max[i]-EPS);
const toAABB=(at,r)=>box(at.map(v=>v+.5-r),at.map(v=>v+.5+r));
const swept=(a,b,r)=>box(a.map((v,i)=>Math.min(v,b[i])+.5-r),a.map((v,i)=>Math.max(v,b[i])+.5+r));
function authenticate(wall,source){
 if(!int3(wall)||wall[1]!==6||typeof source?.get!=='function'||!(source.nav instanceof Set)||
    source.get(wall[0],0,wall[2])?.role!=='foundation'||source.get(wall[0],1,wall[2])?.role!=='floor'||
    source.get(wall[0],7,wall[2])?.asset!=='live:wood'||
    !['wall','column','partition'].includes(source.get(...wall)?.role)||
    !Array.from({length:7},(_,i)=>ROOT.has(source.get(wall[0],i,wall[2])?.role)).every(Boolean))
  throw Error('D40 intact original Y0–Y7 source-root, weather-plane and WALK mandatory');
}
function scanVolume(volume,source,socket,maxCells){
 const lo=volume.min.map(v=>Math.floor(v+EPS)),hi=volume.max.map(v=>Math.ceil(v-EPS)-1);
 const total=lo.reduce((n,l,i)=>n*(hi[i]-l+1),1);
 if(!Number.isSafeInteger(total)||total<1||total>maxCells)throw RangeError('D40 bounded swept-volume original-cell budget');
 let solid=0,body=0;
 for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
  const c=source.get(x,y,z);
  if(c&&intersect(volume,box([x,y,z],[x+1,y+1,z+1])))solid++;
  if(source.nav.has(`${x},2,${z}`)&&intersect(volume,box([x+.2,2,z+.2],[x+.8,4.5,z+.8])))body++;
 }
 return {solid,body,socket:socket&&intersect(volume,socket)?1:0};
}
/** Diagnostic for a full physical segment rather than sampled center points. */
export function probeD40ActualStrapSweep(a,b,source,{halfWidth=.08,socketBounds=null,maxCells=32}={}){
 if(!int3(a)||!int3(b)||a.reduce((n,v,i)=>n+Math.abs(v-b[i]),0)!==1||
    typeof source?.get!=='function'||!(source.nav instanceof Set)||
    !Number.isFinite(halfWidth)||halfWidth<.055||halfWidth>.18||
    !Number.isSafeInteger(maxCells)||maxCells<4||maxCells>64||
    (socketBounds!==null&&(!finite3(socketBounds.min)||!finite3(socketBounds.max)||
      socketBounds.min.some((v,i)=>v>=socketBounds.max[i]))))
   throw TypeError('D40 only genuine finite-thickness straight swept segment and source reader');
 const boxVolume=swept(a,b,halfWidth),result=scanVolume(boxVolume,source,socketBounds,maxCells);
 return Object.freeze({bounds:boxVolume,originalSourceCollisionEvents:result.solid,
  authoredWalkBodyCollisionEvents:result.body,socketCollisionEvents:result.socket,
  clearedEntireStraightPhysicalEnvelope:!result.solid&&!result.body&&!result.socket,
  noRealConnectorOrRatedJoint:true,constructionAllowed:false});
}
const angle=(p,wall)=>Math.atan2(p[2]-wall[2],p[0]-wall[0]);
const crossing=(a,b,wall)=>{const d=angle(b,wall)-angle(a,wall);return d>Math.PI?-1:d< -Math.PI?1:0;};
/** Finite-thickness independent D40 route. A sweep is a union of squared
 * axial prisms, one for each six-connected segment, including each bend.
 * All original solid cells, source WALK standing-body envelopes and the actual
 * D36 socket AABB veto contact. A route is NOT a closed mechanical fastener. */
export function inspectD40SweptOriginalWallRoute(wall,plane,rootAtEnd,source,{
 radius=4,levels=[3,4,5,6],halfWidth=.08,socketBounds=null,
 maxStates=16000,maxSteps=240,maxSweepCells=32,maxEdges=2400
}={}){
 authenticate(wall,source);
 if(!['x','z'].includes(plane)||typeof rootAtEnd!=='boolean'||
    !Number.isSafeInteger(radius)||radius<2||radius>4||
    !Array.isArray(levels)||levels.length<2||levels.length>4||
    levels.some((v,i)=>!Number.isSafeInteger(v)||v<3||v>6||(i&&v<=levels[i-1]))||
    !Number.isFinite(halfWidth)||halfWidth<.055||halfWidth>.18||
    !Number.isSafeInteger(maxStates)||maxStates<64||maxStates>25000||
    !Number.isSafeInteger(maxSteps)||maxSteps<8||maxSteps>300||
    !Number.isSafeInteger(maxSweepCells)||maxSweepCells<8||maxSweepCells>64||
    !Number.isSafeInteger(maxEdges)||maxEdges<16||maxEdges>3000||
    (socketBounds!==null&&(!finite3(socketBounds.min)||!finite3(socketBounds.max)||
      socketBounds.min.some((v,i)=>v>=socketBounds.max[i]))))
  throw TypeError('D40 actual original source, finite-thickness, budget or course input invalid');
 const [x,,z]=wall,sign=rootAtEnd?-1:1,front=plane==='x'?[x+sign,z]:[x,z+sign],
  rear=plane==='x'?[x-sign,z]:[x,z-sign],allowed=new Map();
 const totals={centers:0,centerOriginalCellVetoes:0,centerStandingBodyVetoes:0,
  centerSocketVetoes:0,edgeSweepsTested:0,edgeOriginalCellVetoes:0,
  edgeStandingBodyVetoes:0,edgeSocketVetoes:0,graphStates:0};
 for(let i=x-radius;i<=x+radius;i++)for(let k=z-radius;k<=z+radius;k++){
  if(i===x&&k===z)continue; // no path may penetrate the protected root column
  for(const y of levels){totals.centers++;const p=[i,y,k],q=scanVolume(toAABB(p,halfWidth),source,socketBounds,maxSweepCells);
   if(q.solid)totals.centerOriginalCellVetoes++;
   if(q.body)totals.centerStandingBodyVetoes++;
   if(q.socket)totals.centerSocketVetoes++;
   if(!q.solid&&!q.body&&!q.socket)allowed.set(key(p),p);
  }
 }
 const frontSites=levels.filter(y=>y>=5&&allowed.has(key([front[0],y,front[1]]))).map(y=>[front[0],y,front[1]]),
  backSites=levels.filter(y=>y>=5&&allowed.has(key([rear[0],y,rear[1]]))).map(y=>[rear[0],y,rear[1]]);
 const edges=new Map();
 const admissible=(a,b)=>{
  const ak=key(a),bk=key(b),ek=ak<bk?`${ak}|${bk}`:`${bk}|${ak}`;
  if(edges.has(ek))return edges.get(ek);
  if(++totals.edgeSweepsTested>maxEdges)throw RangeError('D40 bounded full-segment sweep budget');
  const dx=Math.abs(a[0]-b[0])+Math.abs(a[1]-b[1])+Math.abs(a[2]-b[2]);
  if(dx!==1)throw Error('D40 non-six-connected original strap path rejected');
  const q=scanVolume(swept(a,b,halfWidth),source,socketBounds,maxSweepCells);
  if(q.solid)totals.edgeOriginalCellVetoes++;
  if(q.body)totals.edgeStandingBodyVetoes++;
  if(q.socket)totals.edgeSocketVetoes++;
  const result=!q.solid&&!q.body&&!q.socket;edges.set(ek,result);return result;
 };
 let witness=null;
 for(const start of frontSites){
  const queue=[{p:start,w:0,back:false,prev:-1,depth:0}],seen=new Set([`${key(start)}|0|0`]);
  let success=-1;
  for(let i=0;i<queue.length;i++){
   if(++totals.graphStates>maxStates)throw RangeError('D40 original swept-route graph-state budget');
   const n=queue[i];if(n.depth>=maxSteps)continue;
   for(const [dx,dy,dz] of MOVES){const p=[n.p[0]+dx,n.p[1]+dy,n.p[2]+dz];
    if(!allowed.has(key(p))||!admissible(n.p,p))continue;
    const w=n.w+crossing(n.p,p,wall);if(Math.abs(w)>1)continue;
    const back=n.back||(p[0]===rear[0]&&p[2]===rear[1]&&p[1]>=5);
    if(key(p)===key(start)&&Math.abs(w)===1&&back){
     queue.push({p,w,back,prev:i,depth:n.depth+1});success=queue.length-1;break;
    }
    const id=`${key(p)}|${w}|${Number(back)}`;if(seen.has(id))continue;
    seen.add(id);queue.push({p,w,back,prev:i,depth:n.depth+1});
   }
   if(success>=0)break;
  }
  if(success>=0){
   const path=[];for(let i=success;i>=0;i=queue[i].prev)path.push(queue[i].p);
   path.reverse();const changes=path.slice(1).filter((p,i)=>p[1]!==path[i][1]).length;
   // Recheck every physical prism without caching before returning any proof.
   for(let i=1;i<path.length;i++){
    const q=scanVolume(swept(path[i-1],path[i],halfWidth),source,socketBounds,maxSweepCells);
    if(q.solid||q.body||q.socket)throw Error('D40 found route contradicts complete swept physical clearance');
   }
   witness=Object.freeze({path:Object.freeze(path.map(p=>Object.freeze(p))),
    fullPrismSegments:path.length-1,projectedWinding:queue[success].w,
    elevationChanges:changes,numberOfCourses:new Set(path.map(p=>p[1])).size,
    rearCellActuallyVisited:path.some(p=>p[0]===rear[0]&&p[2]===rear[1]&&p[1]>=5),
    allStraightAndCornerVolumesSourceClear:true,
    geometricPrismCrossSection:4*halfWidth**2,
    noRatedMechanicalClosure:true});
   break;
  }
 }
 return Object.freeze({format:'mythwrought.builder-d.d40.source-owned-unregistered-swept-strap.v1',
  wall:Object.freeze([...wall]),plane,rootAtEnd,radius,levels:Object.freeze([...levels]),halfWidth,
  ...totals,sourceClearVacantCenters:allowed.size,frontHeights:Object.freeze(frontSites.map(p=>p[1])),
  rearHeights:Object.freeze(backSites.map(p=>p[1])),
  finiteThicknessClosedWindingFound:Boolean(witness),witness,
  exactSourceWallNeverDrilled:true,sourceNavigationAndRoofUnmodified:true,
  squaredPrismBendUnionHasContinuousVolume:Boolean(witness),
  noIndependentRearFastenerOrSocketAttachment:true,realWallToFoundationRetentionProven:false,
  palettePaintNotOriginalPack2Geometry:true,ownerOfContinuousStrap:null,
  ratedTensileOrUpliftCapacity:null,worldWrites:0,constructionAllowed:false});
}
// Author-independent preview of a single box-like straight strap segment. A
// source-colored mesh is not an original Pack2 block or factory-approved part.
function boxMesh(b,color){const [x,y,z]=b.min,[X,Y,Z]=b.max,
  faces=[[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z]],[[x,y,Z],[X,y,Z],[X,Y,Z],[X,Y,z]],
   [[x,y,z],[x,y,Z],[x,Y,Z],[x,Y,z]],[[X,y,Z],[X,y,z],[X,Y,z],[X,Y,Z]],
   [[x,y,z],[X,y,z],[X,y,Z],[x,y,Z]],[[x,Y,Z],[X,Y,Z],[X,Y,z],[x,Y,z]]];
 const p=[],colors=[],indices=[];
 for(const f of faces){const j=p.length/3;for(const v of f){p.push(...v);colors.push(...color);}indices.push(j,j+1,j+2,j,j+2,j+3);}
 return Object.freeze({positions:Float32Array.from(p),colors:Float32Array.from(colors),indices:Uint16Array.from(indices)});
}
export function deriveD40UnregisteredStrapSegment(a,b,palette,{halfWidth=.08}={}){
 if(!int3(a)||!int3(b)||a.reduce((sum,x,i)=>sum+Math.abs(x-b[i]),0)!==1||
    !Number.isFinite(halfWidth)||halfWidth<.055||halfWidth>.18||
    JSON.stringify(palette?.metal)!=='[0.29,0.32,0.33]'||
    JSON.stringify(palette?.base)!=='[0.4,0.24,0.17]')
  throw TypeError('D40 requires exact adjacent integer original-source course and ID61 palette');
 const bounds=swept(a,b,halfWidth);
 return Object.freeze({format:'mythwrought.builder-d.d40.unregistered-original-palette-strap-segment.v1',
  from:Object.freeze([...a]),to:Object.freeze([...b]),bounds,
  mesh:boxMesh(bounds,palette.metal),halfWidth,sourcePaletteId:61,
  notRegisteredPack2Geometry:true,fastenerStrengthUnknown:true,
  continuousStrapOwnerMissing:true,constructionAllowed:false});
}
/** A two-cell world AABB split exactly along the actual voxel boundary.
 * This adapter is for original registered-shape semantics in narrow native
 * tests only. It does not register any new blocks or write a world cell. */
export function d40SegmentCellShapes(segment){
 if(segment?.format!=='mythwrought.builder-d.d40.unregistered-original-palette-strap-segment.v1')
  throw TypeError('D40 original-source unregistered segment mandatory');
 const {min,max}=segment.bounds,lo=min.map(Math.floor),hi=max.map(v=>Math.ceil(v-EPS)-1);
 const map=new Map();
 for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
  const cell=[x,y,z],a=min.map((v,i)=>Math.max(v,cell[i])),b=max.map((v,i)=>Math.min(v,cell[i]+1));
  if(a.some((v,i)=>b[i]-v<=EPS))continue;
  map.set(key(cell),{boxes:[[...a.map((v,i)=>v-cell[i]),...b.map((v,i)=>v-cell[i])]]});
 }
 if(map.size!==2)throw Error('D40 one-axis source-shaped segment did not occupy exactly two voxel cells');
 return Object.freeze({get:(x,y,z)=>map.get(`${x},${y},${z}`)??null,parts:map.size});
}
export function inspectD40StrapMeshRay(segment){
 if(segment?.format!=='mythwrought.builder-d.d40.unregistered-original-palette-strap-segment.v1')
  throw TypeError('D40 derived original palette segment required');
 const {min,max}=segment.bounds,from=[(min[0]+max[0])/2,(min[1]+max[1])/2,min[2]-1],dir=[0,0,1];
 const measured=d31RayPreviewTriangles(segment.mesh,from,dir,4),expected=1;
 if(measured===null||Math.abs(measured-expected)>1e-5)throw Error('D40 independent physical prism and palette mesh ray disagree');
 return Object.freeze({rayDelta:Math.abs(measured-expected),originalPack2SourceColorPreserved:true,
  sourceMeshNotClaimedAsOriginalId61:true,productionWebGL2RayAcceptance:false,
  actualCompleteCornerAndCapUVsApproved:false,constructionAllowed:false});
}
export function screenD40RealTensionCaptureEvidence(route,rear,evidence={}){
 if(route?.format!=='mythwrought.builder-d.d40.source-owned-unregistered-swept-strap.v1'||
    route.constructionAllowed!==false||route.worldWrites!==0||
    rear?.constructionAllowed!==false||!evidence||typeof evidence!=='object'||Array.isArray(evidence))
  throw Error('D40 only source-authentic unrated wall route and rear-face evidence');
 const missing=Object.freeze(['explicitPack2OwnerStrapAuthorization','approvedContinuousTurnedStrap','authenticatedRearFastener',
  'ratedWallRearBearing','testedSocketToStrapAxialConnection','measuredRoofGravityUplift',
  'approvedSocketMetalPullout','testedWallFoundationTensileTransfer','ratedLongTermFatigue',
  'registeredShapeAndSelection','originalPlayerAndNPCPhysics','actualWebGL2AndIphonePwa']);
 return Object.freeze({requiredAuthenticatedEvidence:missing,
  userSuppliedTextIsNeverIndependentTestProvenance:true,
  finiteThicknessRouteOnly:route.finiteThicknessClosedWindingFound,
  rearGeometryOnly:rear.geometricallySourceClear===true,
  actualMechanicalClosingFastenerVerified:false,ratedOriginalTensionCapacity:null,
  wallFoundationPulloutStillUnknown:true,originalWorldAndSaveWrites:0,
  structuralReleaseAccepted:false,constructionAllowed:false});
}
