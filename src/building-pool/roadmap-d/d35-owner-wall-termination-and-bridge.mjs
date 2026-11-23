// MYTHWROUGHT D35: nonmutating original Pack2-source D34 split-plane termination.
// No new Pack2 block, wall socket, collision registration, renderer, or rated joint.
import {deriveD34LateralOriginalWeb,d34ProbeSourceCellIntersections,measureD34OriginalLateralFaceArea}
 from './d34-owner-lateral-pin-interface.mjs';
import {findD32NonintrusiveWallSeat,clipD32OriginalOwnerAxially}
 from './d32-pack2-wall-seat-joint-ports.mjs';
import {d31PreviewHitsAABB,d31OBBsOverlap}
 from './d31-pack2-owner-oblique-preview.mjs';
import {deriveD33UnregisteredSourcePostCheek}
 from './d33-owner-cheek-pin-geometry.mjs';
const E=1e-8,finite=p=>Array.isArray(p)&&p.length===3&&p.every(Number.isFinite);
const K=(x,y,z)=>`${x},${y},${z}`;
const overlap=(a,b)=>a.ownerOBBs.some(x=>b.ownerOBBs.some(y=>d31OBBsOverlap(x,y)));
function safeSource(source){
 if(typeof source?.get!=='function'||!(source.nav instanceof Set))
  throw TypeError('D35 authentic original read-only voxel and WALK source required');
}
const same=(a,b)=>a.every((v,i)=>Math.abs(v-b[i])<E);
const originalHitSummary=hits=>Object.freeze({total:hits.length,
 roofAndUpper:hits.filter(x=>x.at[1]>=7).length,
 wall:hits.filter(x=>x.at[1]===5||x.at[1]===6).length});
function walkProbe(g,source,maxCells){
 const lo=g.bounds.min.map(v=>Math.floor(v+E)),hi=g.bounds.max.map(v=>Math.ceil(v-E)-1);
 const count=(hi[0]-lo[0]+1)*(hi[2]-lo[2]+1);
 if(!Number.isSafeInteger(count)||count<1||count>maxCells)throw RangeError('D35 original WALK probe budget');
 let hits=0;
 for(let x=lo[0];x<=hi[0];x++)for(let z=lo[2];z<=hi[2];z++){
  if(source.nav.has(K(x,2,z))&&d31PreviewHitsAABB(g,[x+.2,2,z+.2],[x+.8,4.5,z+.8]))hits++;
 }
 return hits;
}
/** Probe BOTH original-owner lateral directions before changing the source.
 * A bounded axial trim is allowed only on a diagonal incident at the genuine
 * Y5/Y6 rooted source wall. For every candidate the ENTIRE original source
 * is rechecked; hiding neighboring walls is forbidden.
 */
export function inspectD35OriginalSplitWebWallTermination(g,plane,source,{
 rootWall=null,rootAtEnd=false,offset=.6,maxCut=1.5,maxCells=128,sideOrder=[1,-1]
}={}){
 safeSource(source);
 if(g?.sourceOwnerId!==61||g?.sourceOriginalBoxes!==3||
    g.registeredPack2DiagonalVariant!==false||g.plane!==plane||
    !['x','z'].includes(plane)||!finite(g.start)||!finite(g.end)||
    !Number.isFinite(offset)||offset!==.6||
    !Number.isFinite(maxCut)||maxCut<=0||maxCut>1.5||
    !Number.isSafeInteger(maxCells)||maxCells<16||maxCells>256||
    !Array.isArray(sideOrder)||sideOrder.length!==2||sideOrder[0]===sideOrder[1]||
    !sideOrder.every(x=>x===1||x===-1)||typeof rootAtEnd!=='boolean')
  throw TypeError('D35 actual Pack2 D34 source owner, two sides, wall and sweep budget required');
 if(rootWall!==null){
  if(!Array.isArray(rootWall)||rootWall.length!==3||!rootWall.every(Number.isSafeInteger)||rootWall[1]!==6)
   throw TypeError('D35 original rooted source Y6 wall coordinates');
  const end=rootAtEnd?g.end:g.start;
  if(!same([end[0],end[2]],[rootWall[0]+.5,rootWall[2]+.5])||
     !['wall','partition','column'].includes(source.get(...rootWall)?.role)||
     !source.get(rootWall[0],5,rootWall[2]))
   throw Error('D35 unbacked or counterfeit original Y5/Y6 wall termination');
 }
 const trials=[];
 for(const side of sideOrder){
  const moved=deriveD34LateralOriginalWeb(g,plane,side,{offset});
  const prior=d34ProbeSourceCellIntersections(moved,source.get,{maxCells}),
   was=originalHitSummary(prior);
  let actual=moved,cut=0,seat=null;
  if(was.total&&rootWall!==null){
   seat=findD32NonintrusiveWallSeat(moved,rootWall,{atEnd:rootAtEnd,maxCut});
   if(seat.seatable){actual=seat.trimmed;cut=seat.cut;}
  }
  const now=d34ProbeSourceCellIntersections(actual,source.get,{maxCells}),
   summary=originalHitSummary(now),walk=walkProbe(actual,source,maxCells),
   sourceClear=summary.total===0&&walk===0;
  trials.push(Object.freeze({side,geometry:actual,ownerPretrim:moved,
   pretrimSourceHits:was,posttrimSourceHits:summary,
   wallCutback:cut,wallSeatResearched:seat!==null,
   sourceClear,originalWalkProbeClashes:walk,
   actualSourceClashCoordinates:Object.freeze(now.slice(0,8).map(h=>Object.freeze(h.at))),
   wallFacePositiveAreaCertified:false,authoredEndCapMesh:false,
   independentFastenerAuthenticated:false,constructionAllowed:false}));
 }
 // A fully source-vacant original-source branch wins. Prefer avoiding a trim,
 // then the original +0.6 side for deterministic history when both clear.
 const ordered=[...trials].sort((a,b)=>Number(b.sourceClear)-Number(a.sourceClear)||
   Number(a.wallCutback>0)-Number(b.wallCutback>0)||
   a.posttrimSourceHits.total-b.posttrimSourceHits.total||b.side-a.side);
 const selected=ordered[0].sourceClear?ordered[0]:null;
 return Object.freeze({format:'mythwrought.builder-d.d35.original-source-dual-lane-root-seat.v1',
  examinedBothOwnerLanes:true,originalRootWall:rootWall?Object.freeze([...rootWall]):null,
  rootIncident:rootWall!==null,originalOwnerId:61,trials:Object.freeze(trials),selected,
  geometricallySourceClear:Boolean(selected),sourceOwnerColorsUnchanged:true,
  noOriginalCellsTouched:true,noWalkingRouteChanged:true,
  originalRoofCannotBeReplaced:true,physicalRatedWallTransfer:false,
  endCapsAndOriginalRuntimeColliderUnimplemented:true,constructionAllowed:false});
}
/** Genuine ID61 side-face patch, on clipped original owner subshapes.
 * Area is only a geometric sum (potentially duplicated), never unique rated
 * effective area, and zero external fastener rating is presumed. */
export function inspectD35UnratedLateralMemberPatch(lateral,original,plane,{cutback=.45}={}){
 if(!Number.isFinite(cutback)||cutback<0||cutback>.45||
    lateral?.sourceOwnerId!==61||!['x','z'].includes(plane)||
    ![61,62].includes(original?.sourceOwnerId))throw TypeError('D35 genuine source-owned contact patch input');
 const a=lateral.format==='mythwrought.builder-d.d32.unregistered-source-clip.v1'&&
    lateral.physicalSourceBoxClippingExact===true?lateral:
    clipD32OriginalOwnerAxially(lateral,cutback,cutback),
  b=original.format==='mythwrought.builder-d.d32.unregistered-source-clip.v1'&&
    original.physicalSourceBoxClippingExact===true?original:
    clipD32OriginalOwnerAxially(original,cutback,cutback),
  area=measureD34OriginalLateralFaceArea(a,b,plane);
 return Object.freeze({facePairs:area.sourceSectionFacePairs,
  summedUnratedSourceFaceArea:area.unratedPositiveAreaContact,
  memberPositiveVolumeOverlap:overlap(a,b),
  hasGeometricTouchingFace:area.unratedPositiveAreaContact>1e-8,
  geometricOnlyNoFastener:true,notAValidatedJoint:true,
  positiveRatedTensionOrCompressionTransfer:false,constructionAllowed:false});
}
/** Candidate independently source-owned ID62 post, tested as a two-surface
 * bridge to ID61 chord and offset diagonal. No added metal fastener or new ID.
 * Both face patches, no physical overlap, and no source collision REQUIRED;
 * even those cannot provide an authenticated load rating. */
export function probeD35IndependentOriginalPostBridge(pin,plane,side,postBoxes,chord,lateral,source,{
 offsets=[.6,.7,.8,.9,1,1.1,1.2],maxCells=128
}={}){
 safeSource(source);
 if(!finite(pin)||!['x','z'].includes(plane)||![1,-1].includes(side)||
    !Array.isArray(offsets)||offsets.length<1||offsets.length>8||
    !offsets.every(x=>Number.isFinite(x)&&x>=.6&&x<=1.2)||
    chord?.sourceOwnerId!==61||lateral?.sourceOwnerId!==61||
    !Number.isSafeInteger(maxCells)||maxCells<16||maxCells>256)
  throw TypeError('D35 original post and both independent load faces required');
 const trials=[];
 for(const offset of offsets){
  const post=deriveD33UnregisteredSourcePostCheek(pin,plane,side,postBoxes,{offset}),
   collisions=d34ProbeSourceCellIntersections(post,source.get,{maxCells}),
   chordCollision=overlap(post,chord),webCollision=overlap(post,lateral),
   first=measureD34OriginalLateralFaceArea(post,chord,plane),
   second=measureD34OriginalLateralFaceArea(post,lateral,plane),
   walk=walkProbe(post,source,maxCells),
   faceBridgeNoOverlap=first.unratedPositiveAreaContact>1e-8&&
     second.unratedPositiveAreaContact>1e-8&&!chordCollision&&!webCollision&&
     collisions.length===0&&walk===0;
  trials.push(Object.freeze({offset,sourceOwnerId:62,post,
   sourceCellClashes:collisions.length,walkBodyProbeClashes:walk,
   chordPositiveOverlap:chordCollision,diagonalPositiveOverlap:webCollision,
   faceContactWithChord:first.unratedPositiveAreaContact,
   faceContactWithDiagonal:second.unratedPositiveAreaContact,
   geometricallyPossibleTwoFaceBridge:faceBridgeNoOverlap,
   originalPostUnregistered:true,ratedFastenerPresent:false,constructionAllowed:false}));
 }
 return Object.freeze({format:'mythwrought.builder-d.d35.unbuilt-original-id62-dual-face-bridge-screen.v1',
  sourceOwnerId:62,trials:Object.freeze(trials),
  geometricallyPossibleSourcePostBridge:trials.some(t=>t.geometricallyPossibleTwoFaceBridge),
  anyRatedJoint:false,anyWorldCellPlaced:false,sourceMeshEndCapsUnauthored:true,
  sourceOwnerPalettesUnchanged:true,originalWorldAndSaveUntouched:true,
  independentlyRatedAxialAndShearTransfer:false,constructionAllowed:false});
}
