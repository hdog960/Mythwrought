// MYTHWROUGHT D38 — NO-PLACEMENT source-only root tension anchor topology.
// Source-preserving face coupons, exposed-wall route checks and a negative
// mechanical-capture proof. No wall drilling, through-fastener, adhesive,
// registered owner, numeric capacity, material ID or construction approval.
import {inspectD37ExactWallAndWebCaps} from './d37-wall-pullout-fastener-contract.mjs';
import {d31RayPreviewTriangles} from './d31-pack2-owner-oblique-preview.mjs';
const E=1e-8,finite=n=>typeof n==='number'&&Number.isFinite(n);
const vec=p=>Array.isArray(p)&&p.length===3&&p.every(finite);
const dot=(a,b)=>a.reduce((t,x,i)=>t+x*b[i],0);
const minus=(a,b)=>a.map((x,i)=>x-b[i]);
const mag=a=>Math.hypot(...a);
const normal=a=>{const d=mag(a);if(d<E)throw Error('D38 degenerate coupon or picking direction');return a.map(x=>x/d);};
const rootRoles=new Set(['foundation','floor','wall','column','partition','beam']);
function rooted(source,wall){
 const [x,y,z]=wall;
 if(y!==6||source.get(x,0,z)?.role!=='foundation'||source.get(x,1,z)?.role!=='floor')return false;
 for(let h=0;h<=6;h++)if(!rootRoles.has(source.get(x,h,z)?.role))return false;
 return ['wall','column','partition'].includes(source.get(x,6,z)?.role);
}
function ownerPalette(p){return p&&JSON.stringify(p.metal)==='[0.29,0.32,0.33]'&&
 JSON.stringify(p.base)==='[0.4,0.24,0.17]'&&JSON.stringify(p.grain)==='[0.22,0.13,0.11]';}
function makeBoxTriangles(lo,hi,color){
 const [x,y,z]=lo,[X,Y,Z]=hi;
 const faces=[[[x,y,z],[X,y,z],[X,Y,z],[x,Y,z]],[[X,y,Z],[x,y,Z],[x,Y,Z],[X,Y,Z]],
 [[x,y,Z],[x,y,z],[x,Y,z],[x,Y,Z]],[[X,y,z],[X,y,Z],[X,Y,Z],[X,Y,z]],
 [[x,y,z],[x,y,Z],[X,y,Z],[X,y,z]],[[x,Y,Z],[x,Y,z],[X,Y,z],[X,Y,Z]]];
 const positions=[],colors=[],indices=[];
 for(const f of faces){const i=positions.length/3;for(const p of f){positions.push(...p);colors.push(...color);}indices.push(i,i+1,i+2,i,i+2,i+3);}
 return Object.freeze({positions:Float32Array.from(positions),colors:Float32Array.from(colors),indices:Uint16Array.from(indices)});
}
/** Independently proposed, unregistered 1-face plate of authentic ID61 palette;
 * no claim it is original Pack2 connector geometry. Deliberately nonintrusive.
 * A face-only coupon is not a wall capture or a socket-to-wall tensile path. */
export function deriveD38UnregisteredFaceCoupon(socket,palette,{side=1,offset=.16}={}){
 const cap=inspectD37ExactWallAndWebCaps(socket);
 if(!ownerPalette(palette)||![1,-1].includes(side)||!finite(offset)||offset<.12||offset>.3)
  throw TypeError('D38 original owner palette and bounded face coupon required');
 const axis=socket.plane==='x'?0:2,lateral=axis===0?2:0,
  wall=socket.wall,face=wall[axis]+(socket.rootAtEnd?0:1),
  outward=socket.rootAtEnd?-1:1,
  center=socket.wallCap.reduce((acc,p)=>acc.map((v,i)=>v+p[i]/4),[0,0,0]);
 const low=[0,0,0],high=[0,0,0];
 low[axis]=Math.min(face+.015*outward,face+.075*outward);
 high[axis]=Math.max(face+.015*outward,face+.075*outward);
 low[1]=center[1]-.075;high[1]=center[1]+.075;
 low[lateral]=center[lateral]+side*offset-.035;
 high[lateral]=center[lateral]+side*offset+.035;
 const box=Object.freeze({min:Object.freeze(low),max:Object.freeze(high)}),
  mesh=makeBoxTriangles(low,high,palette.metal);
 if(cap.actualMeasuredWallFaceArea<=0||low.some((v,i)=>v>=high[i])||
    low[lateral]<wall[lateral]-.5||high[lateral]>wall[lateral]+1.5)
  throw Error('D38 coupon violates authentic source wall face bounds');
 return Object.freeze({format:'mythwrought.d38.unregistered-original-palette-face-coupon.v1',
  box,mesh,side,sourcePaletteId:61,sourceOriginalShapesUnchanged:true,
  originalWallPenetrationRequired:false,visibleExteriorOnly:true,
  socketMechanicalCapture:false,wallMechanicalCapture:false,approvedBlockId:null,
  independentlyRatedAdhesion:false,independentlyRatedFastener:false,
  constructionAllowed:false});
}
const intersects=(a,b)=>[0,1,2].every(i=>a.min[i]<b.max[i]-E&&b.min[i]<a.max[i]-E);
export function inspectD38FaceCouponClearance(coupon,source,socket){
 if(coupon?.format!=='mythwrought.d38.unregistered-original-palette-face-coupon.v1'||
    typeof source?.get!=='function'||!(source.nav instanceof Set)||
    socket?.format!=='mythwrought.d36.unregistered-wall-transition.v1')
  throw TypeError('D38 original source read-only wall/coupon required');
 const a=coupon.box,lo=a.min.map(Math.floor),hi=a.max.map(v=>Math.ceil(v-E)-1),
  count=hi.reduce((v,x,i)=>v*(x-lo[i]+1),1);
 if(!Number.isSafeInteger(count)||count<1||count>24)throw RangeError('D38 bounded coupon occupancy budget');
 let originalClashes=0,walkBodyClashes=0;
 for(let x=lo[0];x<=hi[0];x++)for(let y=lo[1];y<=hi[1];y++)for(let z=lo[2];z<=hi[2];z++){
  if(source.get(x,y,z)&&intersects(a,{min:[x,y,z],max:[x+1,y+1,z+1]}))originalClashes++;
 }
 for(let x=lo[0];x<=hi[0];x++)for(let z=lo[2];z<=hi[2];z++){
  if(source.nav.has(`${x},2,${z}`)&&intersects(a,{min:[x+.2,2,z+.2],max:[x+.8,4.5,z+.8]}))walkBodyClashes++;
 }
 const socketOverlap=intersects(a,socket.bounds),
  sourceClear=originalClashes===0&&walkBodyClashes===0&&!socketOverlap;
 return Object.freeze({originalClashes,walkBodyClashes,socketAABBOverlap:socketOverlap,
  conservativeCouponSourceClear:sourceClear,
  directWallTensileAnchorage:false,webEndCapture:false,
  originalCellsChanged:0,constructionAllowed:false});
}
/** An intact, full authored original wall has no accepted through-hole;
 * front-only surface contact has no authenticated tensile attachment. All 4
 * side-adjacent cells must be vacant for a single-course perimeter WRAP probe.
 * This is a necessary spatial test only: it is NOT proof of a working wrap. */
export function inspectD38RootTensionCaptureRoutes(socket,proof,source,{levels=[5,6]}={}){
 const caps=inspectD37ExactWallAndWebCaps(socket);
 if(!proof||proof.format!=='mythwrought.d37.unrated-root-tensile-force-proof.v1'||
    !(proof.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||
    proof.authenticatedRatedConnectionEdges!==0||proof.constructionAllowed!==false||
    typeof source?.get!=='function'||!(source.nav instanceof Set)||
    !Array.isArray(levels)||levels.length!==2||levels[0]!==5||levels[1]!==6||
    !rooted(source,socket.wall)||source.get(socket.wall[0],7,socket.wall[2])?.asset!=='live:wood')
   throw Error('D38 only genuine intact original rooted wall and nonrated positive pullout permitted');
 const [x,,z]=socket.wall;
 const paths=levels.map(y=>{
  const neighbors=[[x+1,y,z],[x-1,y,z],[x,y,z+1],[x,y,z-1]];
  const blocked=neighbors.filter(p=>source.get(...p)!=null),
   free=neighbors.filter(p=>source.get(...p)==null);
  return Object.freeze({course:y,neighborSites:4,originalSolidVetoes:blocked.length,
   originalOccupiedSites:Object.freeze(blocked.map(p=>Object.freeze([...p]))),
   vacantSites:free.length,fullFourFaceSourceRingVacant:blocked.length===0,
   actualWrapGeometryOrCapacityAuthenticated:false});
 });
 const wallAtom=source.get(...socket.wall);
 return Object.freeze({format:'mythwrought.d38.original-root-anchor-route-diagnostic.v1',
  wall:Object.freeze([...socket.wall]),wallRole:wallAtom.role,
  tensileForceNormalizedOnly:proof.tensileAxialForcePerUnknownUnitRoofLineLoad,
  actualWallCapArea:caps.actualMeasuredWallFaceArea,
  wallIsUncutOriginalSource:true,throughWallAnchorsWouldRequireProtectedAuthorChange:true,
  wallFaceOnlyPlateNoProvenTension:true,
  sampledCourseRings:Object.freeze(paths),
  anySingleCourseFourFaceRingSpatiallyVacant:paths.some(p=>p.fullFourFaceSourceRingVacant),
  genuineRatedExternalWrapOrMechanicalCapture:false,
  originalWallToFoundationPulloutStrengthKnown:false,
  sourceCellsWritten:0,loadPathAccepted:false,constructionAllowed:false});
}
/** Box-ray and native source-palette triangle ray independently agree. */
export function inspectD38CouponRayParity(coupon,{maxDistance=4}={}){
 if(coupon?.format!=='mythwrought.d38.unregistered-original-palette-face-coupon.v1'||
    !finite(maxDistance)||maxDistance<=0||maxDistance>12)throw TypeError('D38 source coupon/ray parity input');
 const {min,max}=coupon.box,from=[(min[0]+max[0])/2,(min[1]+max[1])/2,min[2]-1],direction=[0,0,1];
 const meshT=d31RayPreviewTriangles(coupon.mesh,from,direction,maxDistance),
  expected=min[2]-from[2];
 if(meshT===null||Math.abs(meshT-expected)>1e-5)
  throw Error('D38 exact derived colored plate mesh/collider ray mismatch');
 return Object.freeze({analyticAABBHit:expected,meshHit:meshT,rayDelta:Math.abs(expected-meshT),
  originalPack2PaletteSourceId:61,originalMeshNotRecolored:false,
  actualOriginalPack2MeshUsed:false,sourceDerivedPaletteOnly:true,
  originalRuntimePickingTested:false,constructionAllowed:false});
}
/** Evidence-only chain: no user-supplied labels or capacities substitute for
 * physical connection/owner and independently authenticated actual strength. */
export function screenD38ActualAnchorProvenance(capture,requirements={}){
 if(capture?.format!=='mythwrought.d38.original-root-anchor-route-diagnostic.v1'||
    capture.constructionAllowed!==false||capture.loadPathAccepted!==false||
    !Array.isArray(capture.sampledCourseRings)||capture.sampledCourseRings.length!==2)
   throw Error('D38 source-only intact wall capture proof required');
 const mandatory=['approvedFastenerOwner','approvedWallAnchorAssembly','approvedSocketEndClamp',
  'testReportPullout','testReportShear','testReportCyclicFatigue','roofGravityUpliftCase',
  'foundationTensionAndShear','liveRuntimeCollisionAndPicking','installedIphonePwaAcceptance'];
 const missing=mandatory.filter(k=>typeof requirements[k]!=='string'||!requirements[k].trim());
 return Object.freeze({missingEvidence:Object.freeze(missing),
  unverifiedEvidenceLabelsDoNotAuthenticateStrength:true,
  sourceOwnerOriginalUnchanged:true,
  necessaryButNotSufficientSpatialWrapProbe:capture.anySingleCourseFourFaceRingSpatiallyVacant,
  normalizedActualRatedTensionCapacity:null,normalizedActualRatedPulloutStrength:null,
  realMechanicalCaptureAuthenticated:false,structuralSupportAccepted:false,
  constructionAllowed:false});
}
