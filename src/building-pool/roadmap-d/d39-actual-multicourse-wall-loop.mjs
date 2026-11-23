// MYTHWROUGHT D39 — original, immutable source-cell, finite-budget exterior
// route study. A projected winding-number loop is NOT a fastened physical loop,
// an accessible load-bearing wall backface, or verified tensile anchorage.
import {d31RayPreviewTriangles} from './d31-pack2-owner-oblique-preview.mjs';
const E=1e-8,dirs=[[1,0,0],[-1,0,0],[0,0,1],[0,0,-1],[0,1,0],[0,-1,0]];
const rootRoles=new Set(['foundation','floor','wall','column','partition','beam']);
const valid3=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isSafeInteger);
const finite=n=>typeof n==='number'&&Number.isFinite(n);
const key=(x,y,z,w,back)=>`${x},${y},${z},${w},${Number(back)}`;
const clash=(a,b)=>[0,1,2].every(i=>a.min[i]<b.max[i]-E&&b.min[i]<a.max[i]-E);
const bnds=(min,max)=>({min,max});
const fill=(x,y,z)=>bnds([x+.44,y+.44,z+.44],[x+.56,y+.56,z+.56]);
function authentic(wall,source){
 if(!valid3(wall)||wall[1]!==6||typeof source?.get!=='function'||!(source.nav instanceof Set)||
    source.get(wall[0],0,wall[2])?.role!=='foundation'||source.get(wall[0],1,wall[2])?.role!=='floor'||
    source.get(wall[0],7,wall[2])?.role!=='roof'||
    source.get(wall[0],7,wall[2])?.asset!=='live:wood'||
    !['wall','partition','column'].includes(source.get(...wall)?.role)||
    !Array.from({length:7},(_,y)=>rootRoles.has(source.get(wall[0],y,wall[2])?.role)).every(Boolean))
  throw Error('D39 requires exact intact original Y0–Y7 rooted wood-bearing source and WALK');
}
/** Deterministic bounded graph over empty cells. Horizontal projected angular
 * cover tracks nonzero winding; vertical steps permit multi-course detours.
 * It is deliberately stricter than D38 four-neighbor vacancy: a closed
 * 6-connected cell-center path must also reach the exposed opposite face.
 * Every hypothetical narrow strap passes a real-cell and conservative WALK
 * probe. No route is placed, and no rated loads/fasteners can be inferred. */
export function inspectD39BoundedOriginalWallLoop(wall,plane,rootAtEnd,source,{
 levels=[4,5,6],maxRadius=3,maxStates=4096,maxSteps=160,socketBounds=null
}={}){
 authentic(wall,source);
 if(!['x','z'].includes(plane)||typeof rootAtEnd!=='boolean'||
    !Array.isArray(levels)||levels.length<2||levels.length>4||
    levels.some((v,i)=>!Number.isSafeInteger(v)||v<3||v>6||(i&&v<=levels[i-1]))||
    !Number.isSafeInteger(maxRadius)||maxRadius<1||maxRadius>4||
    !Number.isSafeInteger(maxStates)||maxStates<64||maxStates>10000||
    !Number.isSafeInteger(maxSteps)||maxSteps<8||maxSteps>300||
    (socketBounds!==null&&(!Array.isArray(socketBounds.min)||!Array.isArray(socketBounds.max)||
     socketBounds.min.length!==3||socketBounds.max.length!==3||
     socketBounds.min.some((v,i)=>!finite(v)||!finite(socketBounds.max[i])||v>=socketBounds.max[i]))))
  throw TypeError('D39 bounded genuine planar source path and actual socket geometry required');
 const [wx,,wz]=wall,sign=rootAtEnd?-1:1,
  dx=plane==='x'?sign:0,dz=plane==='z'?sign:0;
 const front=[wx+dx,wz+dz],back=[wx-dx,wz-dz];
 const eligible=new Map();let occupied=0,walkBlocked=0,socketBlocked=0,candidates=0;
 for(let x=wx-maxRadius;x<=wx+maxRadius;x++)for(let z=wz-maxRadius;z<=wz+maxRadius;z++){
  if(x===wx&&z===wz)continue; // never route through original wall at any height
  for(const y of levels){candidates++;
   if(source.get(x,y,z)){occupied++;continue;}
   const env=fill(x,y,z);
   if(socketBounds&&clash(env,socketBounds)){socketBlocked++;continue;}
   if(source.nav.has(`${x},2,${z}`)&&clash(env,bnds([x+.2,2,z+.2],[x+.8,4.5,z+.8]))){walkBlocked++;continue;}
   eligible.set(`${x},${y},${z}`,true);
  }
 }
 const first=[],rear=[];
 for(const y of levels){
  if(eligible.has(`${front[0]},${y},${front[1]}`)&&y>=5)first.push([front[0],y,front[1]]);
  if(eligible.has(`${back[0]},${y},${back[1]}`)&&y>=5)rear.push([back[0],y,back[1]]);
 }
 // Winding angle branch-cut on the negative-x ray, with exact coordinates
 // offset from the unmodified original rooted wall's source cell center.
 const theta=(x,z)=>Math.atan2(z-wz,x-wx);
 const wind=(a,b)=>{const d=theta(b[0],b[2])-theta(a[0],a[2]);return d>Math.PI?-1:d< -Math.PI?1:0;};
 let witness=null,statesVisited=0;
 for(const start of first){
  const queue=[{p:start,w:0,back:false,prev:-1,depth:0}],seen=new Set([key(...start,0,false)]);
  let success=-1;
  for(let i=0;i<queue.length;i++){
   const node=queue[i];statesVisited++;
   if(statesVisited>maxStates)throw RangeError('D39 exact original multi-course route state budget exceeded');
   if(node.depth>=maxSteps)continue;
   for(const [ax,ay,az] of dirs){
    const p=[node.p[0]+ax,node.p[1]+ay,node.p[2]+az];
    if(!eligible.has(p.join(',')))continue;
    const w=node.w+wind(node.p,p);if(Math.abs(w)>1)continue;
    const hitBack=node.back||(p[0]===back[0]&&p[2]===back[1]&&p[1]>=5);
    if(p[0]===start[0]&&p[1]===start[1]&&p[2]===start[2]&&Math.abs(w)===1&&hitBack){
     queue.push({p,w,back:hitBack,prev:i,depth:node.depth+1});success=queue.length-1;break;
    }
    const id=key(...p,w,hitBack);if(seen.has(id))continue;
    seen.add(id);queue.push({p,w,back:hitBack,prev:i,depth:node.depth+1});
   }
   if(success>=0)break;
  }
  if(success>=0){
   const loop=[];for(let at=success;at>=0;at=queue[at].prev)loop.push(queue[at].p);
   loop.reverse();
   const elevationChanges=loop.slice(1).filter((p,i)=>p[1]!==loop[i][1]).length;
   witness=Object.freeze({path:Object.freeze(loop.map(p=>Object.freeze([...p]))),
    projectedWinding:queue[success].w,courseChanges:elevationChanges,
    courseCount:new Set(loop.map(p=>p[1])).size,
    trueRootBackFaceCellVisited:loop.some(p=>p[0]===back[0]&&p[2]===back[1]&&p[1]>=5),
    fullLoopCellCenterSteps:loop.length-1});break;
  }
 }
 return Object.freeze({format:'mythwrought.builder-d.d39.unregistered-bounded-exterior-winding-study.v1',
  wall:Object.freeze([...wall]),plane,rootAtEnd,originalSourceFullyPreserved:true,
  originalRootTensileCapacity:null,originalFoundationUpliftCapacity:null,
  candidateCellCenters:candidates,occupiedSourceVetoes:occupied,
  originalWalkEnvelopeVetoes:walkBlocked,socketEnvelopeVetoes:socketBlocked,
  vacantAdmissibleCellCenters:eligible.size,boundedSearchStatesVisited:statesVisited,
  sourceClearFrontStartHeights:Object.freeze(first.map(p=>p[1])),
  sourceClearBackFaceHeights:Object.freeze(rear.map(p=>p[1])),
  sourceOnlyProjectedWindingLoopFound:Boolean(witness),
  witness,spatiallyClosedLoopIsNotPhysicalCapture:true,
  realRetainerOrMechanicalClosureInstalled:false,wallToFoundationRatedTensionTransfer:false,
  routeOwnerId:null,worldCellsWritten:0,constructionAllowed:false});
}
function boxMesh(lo,hi,color){
 const [x,y,z]=lo,[X,Y,Z]=hi,
  faces=[[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z]],[[X,y,Z],[x,y,Z],[x,Y,Z],[X,Y,Z]],
   [[x,y,Z],[x,y,z],[x,Y,z],[x,Y,Z]],[[X,y,z],[X,y,Z],[X,Y,Z],[X,Y,z]],
   [[x,y,z],[x,y,Z],[X,y,Z],[X,y,z]],[[x,Y,Z],[x,Y,z],[X,Y,z],[X,Y,Z]]];
 const p=[],colors=[],indices=[];
 for(const f of faces){const base=p.length/3;for(const v of f){p.push(...v);colors.push(...color);}indices.push(base,base+1,base+2,base,base+2,base+3);}
 return Object.freeze({positions:Float32Array.from(p),colors:Float32Array.from(colors),indices:Uint16Array.from(indices)});
}
/** Original ID61 metal palette, not its physical block mesh or a new owner ID.
 * The plate touches the exposed opposite wall face with area .24*.16;
 * absent a continuous rated strap/fastener that area cannot transfer tension. */
export function deriveD39UnregisteredRearFaceWitness(wall,plane,rootAtEnd,palette,{course=6}={}){
 if(!valid3(wall)||wall[1]!==6||!['x','z'].includes(plane)||typeof rootAtEnd!=='boolean'||
    ![5,6].includes(course)||JSON.stringify(palette?.metal)!=='[0.29,0.32,0.33]'||
    JSON.stringify(palette?.base)!=='[0.4,0.24,0.17]')
  throw TypeError('D39 authentic Pack2 source-colored rear wall contact coupon required');
 const axis=plane==='x'?0:2,lateral=plane==='x'?2:0,
  front=rootAtEnd?-1:1,back=-front,face=wall[axis]+(back<0?0:1),
  lo=[0,course+.42,0],hi=[0,course+.58,0];
 lo[axis]=Math.min(face,face+back*.06);hi[axis]=Math.max(face,face+back*.06);
 lo[lateral]=wall[lateral]+.38;hi[lateral]=wall[lateral]+.62;
 const bounds=Object.freeze({min:Object.freeze(lo),max:Object.freeze(hi)});
 return Object.freeze({format:'mythwrought.builder-d.d39.unregistered-original-palette-rear-retainer-probe.v1',
  wall:Object.freeze([...wall]),plane,rootAtEnd,course,bounds,
  wallBackFaceGeometricArea:.24*.16,sourcePaletteId:61,
  mesh:boxMesh(lo,hi,palette.metal),sourceOriginalPalettePreserved:true,
  originalPack2ShapeUnchanged:true,authoredGridOwner:null,
  mechanicalClampClosureInstalled:false,tensileCapacityKnown:false,constructionAllowed:false});
}
/** A clean rear coupon is not enough: no positive-volume wall intrusion,
 * no other original cell intrusion, and exact derived mesh/analytic ray parity. */
export function inspectD39OriginalRearFaceWitness(coupon,source,{maxCells=12}={}){
 if(coupon?.format!=='mythwrought.builder-d.d39.unregistered-original-palette-rear-retainer-probe.v1'||
    typeof source?.get!=='function'||!(source.nav instanceof Set)||
    !Number.isSafeInteger(maxCells)||maxCells<1||maxCells>64)
  throw TypeError('D39 source-only actual original rear-face coupon reader required');
 authentic(coupon.wall,source);
 const {min,max}=coupon.bounds,lo=min.map(v=>Math.floor(v+E)),hi=max.map(v=>Math.ceil(v-E)-1),
  cells=(hi[0]-lo[0]+1)*(hi[1]-lo[1]+1)*(hi[2]-lo[2]+1);
 if(!Number.isSafeInteger(cells)||cells<1||cells>maxCells)throw RangeError('D39 rear-face sweep budget exceeded');
 let collisions=0,walk=0;
 for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
  if(source.get(x,y,z)&&clash(coupon.bounds,bnds([x,y,z],[x+1,y+1,z+1])))collisions++;
  if(source.nav.has(`${x},2,${z}`)&&clash(coupon.bounds,bnds([x+.2,2,z+.2],[x+.8,4.5,z+.8])))walk++;
 }
 const axis=coupon.plane==='x'?0:2,face=coupon.bounds.min[axis]===coupon.wall[axis]+1||
  coupon.bounds.max[axis]===coupon.wall[axis];
 return Object.freeze({authenticOriginalBackFacePlaneTouched:face,
  originalSourceCellClashes:collisions,authoredWalkBodyClashes:walk,
  geometricallySourceClear:collisions===0&&walk===0&&face,
  originalWallAndRootFullyUnmodified:true,mechanicalWrapOrFastenerExists:false,
  ratingAuthenticated:false,constructionAllowed:false});
}
export function inspectD39RearMeshRayParity(coupon){
 if(coupon?.format!=='mythwrought.builder-d.d39.unregistered-original-palette-rear-retainer-probe.v1')
  throw TypeError('D39 original palette rear coupon mesh required');
 const {min,max}=coupon.bounds,axis=coupon.plane==='x'?0:2,
  front=coupon.rootAtEnd?-1:1,back=-front,
  from=min.map((v,i)=>(v+max[i])/2),dir=[0,0,0];
 from[axis]+=.5*back;dir[axis]=-back;
 const analytic=.5-(max[axis]-min[axis])/2,
  mesh=d31RayPreviewTriangles(coupon.mesh,from,dir,2);
 if(mesh===null||Math.abs(mesh-analytic)>1e-5)throw Error('D39 independent palette-derived rear-face mesh and physical AABB ray disagree');
 return Object.freeze({analyticBoxRayDistance:analytic,originalPaletteMeshRayDistance:mesh,
  rayDelta:Math.abs(mesh-analytic),originalSourceColorsUntouched:true,
  originalRegisteredMaterialOwnerUntouched:true,productionRaycastNotAccepted:true,
  originalShapeMeshNotClaimed:true,constructionAllowed:false});
}
/** Fail-closed external engineering/evidence ledger. Text IDs and numeric
 * capacities supplied by a caller have NO provenance authority. Preserve the
 * unknown wall-to-foundation chain even when a projected route exists. */
export function screenD39UnratedExternalCaptureEvidence(loop,rear,evidence={}){
 if(loop?.format!=='mythwrought.builder-d.d39.unregistered-bounded-exterior-winding-study.v1'||
    loop.constructionAllowed!==false||loop.worldCellsWritten!==0||
    rear?.constructionAllowed!==false||
    typeof evidence!=='object'||evidence===null||Array.isArray(evidence))
  throw Error('D39 authentic unapproved original wall and physical rear coupon required');
 const requirements=Object.freeze([
  'approvedOwnerForFullClosedStrap','measuredContinuousNonIntrusiveCollider',
  'verifiedSocketToStrapMechanicalFastener','verifiedRearRetainerBearing',
  'authenticOriginalWallMaterialTension','authenticatedOriginalWallToFoundationUplift',
  'measuredFastenerPullout','measuredFastenerShearFatigue',
  'authenticatedRoofGravityAndUplift','lateralStabilityAndBucklingTest',
  'registeredPhysicalMeshAndPicking','realPlayerAndNPCStepPhysics',
  'installedIphoneHomeScreenPwaAcceptance']);
 return Object.freeze({format:'mythwrought.builder-d.d39.unrated-multi-course-load-chain-gate.v1',
  originalWallSourceUnaltered:true,requiredIndependentEvidence:requirements,
  missingAuthenticatedEvidence:requirements,
  suppliedLabelsDoNotAuthenticateMeasurements:true,
  topologicalLoopSourceClear:Boolean(loop.sourceOnlyProjectedWindingLoopFound),
  rearWitnessSourceClear:Boolean(rear.geometricallySourceClear),
  originalRootTensionCapacity:null,realPulloutCapacity:null,
  mechanicalCapturePhysicallyBuilt:false,structuralReleaseAccepted:false,
  constructionAllowed:false});
}
