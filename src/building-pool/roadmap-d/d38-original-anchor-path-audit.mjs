// D38 — exact original Wave16/17 source wall capture and independently
// unregistered coupon geometry. No real fastener or approved tensile path.
import {pack2Asset,pack2Shape} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance}
 from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical}
 from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination}
 from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket,d36SocketHitsOwner}
 from './d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath}
 from './d37-wall-pullout-fastener-contract.mjs';
import {deriveD38UnregisteredFaceCoupon,inspectD38FaceCouponClearance,
 inspectD38RootTensionCaptureRoutes,inspectD38CouponRayParity,screenD38ActualAnchorProvenance}
 from './d38-wall-anchor-route-contract.mjs';
const ROOT=new Set(['foundation','floor','wall','partition','column','beam']);
const rooted=(src,p)=>p[1]===6&&src.get(p[0],0,p[2])?.role==='foundation'&&
 src.get(p[0],1,p[2])?.role==='floor'&&
 Array.from({length:7},(_,y)=>ROOT.has(src.get(p[0],y,p[2])?.role)).every(Boolean);
/** Authentically regenerate all 128 root paths; do not import previous D37
 * test suite or make any original world, Pack owner or save mutations. */
export function auditD38OriginalTensileWallCapture(b,primary,secondary,d25,{maxRaySamples=2}={}){
 if(!Number.isSafeInteger(maxRaySamples)||maxRaySamples<0||maxRaySamples>4)
  throw RangeError('D38 original source ray sample budget');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
    pack2Asset(61)?.roster!==15||pack2Asset(62)?.key!=='dovetailed-support-post'||
    pack2Asset(62)?.roster!==22||
    JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
    JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D38 genuine original material/source ownership must be immutable');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,primary,secondary,d25),
  src=indexD29OriginalRoof(b),pre={cells:b.cells.length,nav:b.navigation.length,
    first:b.cells[0],last:b.cells.at(-1),firstNav:b.navigation[0]};
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D38 only original W16/W17 unapproved author source');
 const total={bays:0,roots:0,rootTension:0,authenticTwoFaceSockets:0,
  sourceClearSockets:0,sourceRootedWallRingsY5Vacant:0,sourceRootedWallRingsY6Vacant:0,
  blockedWallRingsY5:0,blockedWallRingsY6:0,
  originalNeighborSourceVetoSitesY5:0,originalNeighborSourceVetoSitesY6:0,
  originalSourceCouponTrials:0,sourceClearCoupons:0,sourceCollidingCoupons:0,
  socketOverlappingCouponTrials:0,authenticSourcePaletteRaySamples:0,
  maximumCouponRayDelta:0,independentRatedAnchors:0,
  originalBuildingCellsModified:0,worldWrites:0};
 const bins=[];
 for(const row of d29.proposedOriginalLongBays){
  const geom=inspectD30OriginalUnderslungCorridor(src,row);
  if(!geom.exactOriginalY5Y6CourseFree||geom.originalY5Y6OverheadWalkConflicts!==0||
     !rooted(src,row.sourceOriginalStartBearing)||!rooted(src,row.sourceOriginalEndBearing))
    throw Error('D38 authentic rooted original bearing or protected WALK lost');
  const math=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
    [sx,,sz]=row.sourceOriginalStartBearing,
    points=new Map(math.nodes.map(n=>[n.id,[sx+.5+(axis==='x'?n.x:0),n.y,
     sz+.5+(axis==='z'?n.x:0)]])),
    members=math.members.map(m=>({member:m,shape:m.type==='vertical-web'?
      deriveD31OriginalPack2Vertical(points.get(m.from),points.get(m.to),post.boxes):
      deriveD31OriginalPack2Oblique(points.get(m.from),points.get(m.to),axis,beam.boxes)}));
  let bayRoots=0,ringY5=0,ringY6=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${math.panelCount}`;
   if(!start&&!end)continue;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing;
   const choose=inspectD35OriginalSplitWebWallTermination(shape,axis,src,
    {rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!choose?.sourceClear||!(choose.wallCutback>.2))
    throw Error('D38 missing genuine source-protected trimmed root candidate');
   const socket=deriveD36IndependentRootSocket(choose.geometry,wall,
     {plane:axis,rootAtEnd:end,palette});
   const fitting=probeD36OriginalSocket(socket,src,choose.geometry);
   if(!fitting.sourceClear||fitting.memberPositiveVolumeOverlap||
     members.some(x=>x.member.memberId!==member.memberId&&d36SocketHitsOwner(socket,x.shape)))
    throw Error('D38 original D36 socket collides with authored source or other member');
   const force=screenD37OriginalRootTensilePath(socket,member,math,shape),
    capture=inspectD38RootTensionCaptureRoutes(socket,force,src),
    evidence=screenD38ActualAnchorProvenance(capture);
   if(evidence.structuralSupportAccepted!==false||evidence.constructionAllowed!==false||
      evidence.missingEvidence.length!==10||capture.genuineRatedExternalWrapOrMechanicalCapture!==false)
    throw Error('D38 theoretical original wall-side ring misinterpreted as rated capture');
   bayRoots++;total.roots++;total.rootTension++;total.authenticTwoFaceSockets++;
   total.sourceClearSockets++;
   const [r5,r6]=capture.sampledCourseRings;
   if(r5.fullFourFaceSourceRingVacant){total.sourceRootedWallRingsY5Vacant++;ringY5++;}
   else total.blockedWallRingsY5++;
   if(r6.fullFourFaceSourceRingVacant){total.sourceRootedWallRingsY6Vacant++;ringY6++;}
   else total.blockedWallRingsY6++;
   total.originalNeighborSourceVetoSitesY5+=r5.originalSolidVetoes;
   total.originalNeighborSourceVetoSitesY6+=r6.originalSolidVetoes;
   for(const side of [-1,1]){
    const coupon=deriveD38UnregisteredFaceCoupon(socket,palette,{side}),
       clearance=inspectD38FaceCouponClearance(coupon,src,socket);
    total.originalSourceCouponTrials++;
    if(clearance.conservativeCouponSourceClear)total.sourceClearCoupons++;
    else total.sourceCollidingCoupons++;
    if(clearance.socketAABBOverlap)total.socketOverlappingCouponTrials++;
    if(total.authenticSourcePaletteRaySamples<maxRaySamples){
     const parity=inspectD38CouponRayParity(coupon);
     total.authenticSourcePaletteRaySamples++;
     total.maximumCouponRayDelta=Math.max(total.maximumCouponRayDelta,parity.rayDelta);
    }
   }
  }
  if(bayRoots!==2)throw Error('D38 exact D30 original two root diagonals missing');
  total.bays++;
  bins.push(Object.freeze({axis,spanInterior:row.spanCells,roots:bayRoots,
   fullVacantWallRingAtY5:ringY5,fullVacantWallRingAtY6:ringY6,
   sourceRatedFasteners:0,constructionAllowed:false}));
 }
 if(total.bays!==d29.unapprovedLongCandidateSpans||total.roots!==total.bays*2||
    total.roots!==total.rootTension||total.originalSourceCouponTrials!==total.roots*2||
    total.blockedWallRingsY5+total.sourceRootedWallRingsY5Vacant!==total.roots||
    total.blockedWallRingsY6+total.sourceRootedWallRingsY6Vacant!==total.roots||
    b.cells.length!==pre.cells||b.navigation.length!==pre.nav||
    b.cells[0]!==pre.first||b.cells.at(-1)!==pre.last||b.navigation[0]!==pre.firstNav)
  throw Error('D38 original wall source or exact cumulative ledger changed');
 return Object.freeze({format:'mythwrought.d38.original-uncertified-tensile-wall-loop-study.v1',
  blueprintId:b.id,originalRoof:d29.sourceRoofCells,
  originalDistantRoofStillUncertified:d29.originalFarZoneCellsStillUncertified,
  originalUncertifiedFarZones:d29.originalFarZones,...total,perSpan:Object.freeze(bins),
  noSourceWallPenetrationAllowed:true,faceOnlyNoProvenWallPullout:true,
  fourFaceRingSourceVacancyNotStructuralApproval:true,
  noMechanicalCaptureOrApprovedIndependentFastener:true,
  originalPack2MaterialShapesAndColorsUntouched:true,
  allOriginalWalkAndWeatherPlaneCellsUntouched:true,
  conservativeCouponPickingNotRealWebGL2OrGameSelection:true,
  actualCyclicShearBucklingMaterialAndWallFoundationCapacitiesMissing:true,
  acceptedStructuralLoads:0,constructionAllowed:false,saveWrites:0,
  runtimeCellsModified:0,installedIphonePwaUntested:true});
}
