// MYTHWROUGHT D39 — genuine W16/W17 source-only finite multi-course graph.
// Nothing here creates original gameplay voxels, a registered fastener, a
// structurally rated loop, a settlement, world edit, save, or release artifact.
import {pack2Asset,pack2Shape} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {validateShape,raycastShapes} from '../../voxel-shape-interactions.mjs';
import {inspectBodyFit} from '../../voxel-shape-fit.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical} from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination} from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket,d36SocketHitsOwner} from './d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath} from './d37-wall-pullout-fastener-contract.mjs';
import {inspectD38RootTensionCaptureRoutes} from './d38-wall-anchor-route-contract.mjs';
import {inspectD39BoundedOriginalWallLoop,deriveD39UnregisteredRearFaceWitness,
 inspectD39OriginalRearFaceWitness,inspectD39RearMeshRayParity,screenD39UnratedExternalCaptureEvidence} from './d39-actual-multicourse-wall-loop.mjs';
const rooted=new Set(['foundation','floor','wall','partition','column','beam']);
const isRoot=(s,p)=>p[1]===6&&s.get(p[0],0,p[2])?.role==='foundation'&&
 s.get(p[0],1,p[2])?.role==='floor'&&
 Array.from({length:7},(_,y)=>rooted.has(s.get(p[0],y,p[2])?.role)).every(Boolean);
function verifyNativeRearProbe(coupon,source){
 const {min,max}=coupon.bounds,cell=min.map((v,i)=>Math.floor(v+1e-8));
 const local=[...min.map((v,i)=>v-cell[i]),...max.map((v,i)=>v-cell[i])];
 const shape={boxes:[local]};
 if(!validateShape(shape))throw Error('D39 original native 32-box local collider cannot represent coupon');
 const only=(x,y,z)=>x===cell[0]&&y===cell[1]&&z===cell[2]?shape:null,
  [x,,z]=cell;
 // Genuine original player fit host (not a stand-in), at the original Y2 WALK
 // body, plus a deliberately overlapping Y5/6 body to prove this shape is hit.
 const high=inspectBodyFit([x+.2,2,z+.2,x+.8,4.5,z+.8],only,{maxCells:32});
 const touch=inspectBodyFit([...min.map(v=>v-.005),...max.map(v=>v+.005)],only,{maxCells:32});
 // This occupancy probe should represent a real 0.24 x 0.16 thin coupon.
 if(!high.fits||touch.fits)throw Error('D39 genuine body-fit source adapter contradicted physical coupon AABB');
 const axis=coupon.plane==='x'?0:2,front=coupon.rootAtEnd?-1:1,back=-front,
  from=min.map((v,i)=>(v+max[i])/2),dir=[0,0,0];
 from[axis]+=.5*back;dir[axis]=-back;
 const real=raycastShapes(from,dir,only,2);
 const expected=inspectD39RearMeshRayParity(coupon);
 if(!real||Math.abs(real.distance-expected.originalPaletteMeshRayDistance)>1e-5)
  throw Error('D39 original shape-aware native ray failed exact palette triangle source contract');
 return {nativeBodyFits:1,nativeIntentionalColliderVetoes:1,nativeRaySamples:1,
   maxRayDelta:Math.abs(real.distance-expected.originalPaletteMeshRayDistance),
   nativeShapeLocalCell:cell};
}
/** One authentic original building; uses original D29 source and all original
 * D30-D38 capability gates, without replaying their historical test suites.
 * The bounded graph is only geometry; even a closed winding loop is NOT
 * fastened, tested, rated, or proved to capture an original rooted wall. */
export function auditD39OriginalMultiCourseWallCapture(b,p,s,d25,{
 maxRadius=3,levels=[4,5,6],maxNativeSamples=2
}={}){
 if(!Number.isSafeInteger(maxNativeSamples)||maxNativeSamples<0||maxNativeSamples>3)
  throw RangeError('D39 bounded original runtime physics sample quota');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.roster!==15||pack2Asset(62)?.roster!==22||
  pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
  pack2Asset(62)?.key!=='dovetailed-support-post'||
  JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
  JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D39 authentic Pack2 source ownership/rotation/WOOD contract drift');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,d25),src=indexD29OriginalRoof(b),
  before={cells:b.cells.length,nav:b.navigation.length,first:b.cells[0],last:b.cells.at(-1),firstNav:b.navigation[0]};
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
  d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius||
  !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved)
  throw Error('D39 original W16/W17 nonapproved Y7 live wood and WALK proof is mandatory');
 const total={bays:0,roots:0,positiveTensileRoots:0,sourceClearD36Sockets:0,
  legacyFourFaceRingsAtY5:0,legacyFourFaceRingsAtY6:0,
  originalNeighborBlockedY5:0,originalNeighborBlockedY6:0,
  graphSourceOnlyWindingLoops:0,graphNoWindingLoopInBoundedSearch:0,
  sourceOnlyMultiCourseLoops:0,sourceOnlySingleCourseLoops:0,
  rootedBackFaceAccessibleSites:0,rootedBackFaceUnreachableSites:0,
  candidateSourceSolidCellVetoes:0,authoredY2BodyVetoes:0,socketEnvelopeVetoes:0,
  originalRearCouponStudies:0,sourceClearOriginalRearCoupons:0,sourceBlockedRearCoupons:0,
  actualOriginalBodyFitProbes:0,actualOriginalIntentionalBodyCollisions:0,
  nativeSourceShapeRayChecks:0,maxNativeRayDifference:0,
  fastenersPhysicallyInstalled:0,loadBearingWallLoopsCertified:0,sourceWrites:0};
 const perBay=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
    !isRoot(src,row.sourceOriginalStartBearing)||!isRoot(src,row.sourceOriginalEndBearing))
    throw Error('D39 original roof walk and foundation wall continuity required');
  const math=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   at=new Map(math.nodes.map(n=>[n.id,[sx+.5+(axis==='x'?n.x:0),n.y,
     sz+.5+(axis==='z'?n.x:0)]])),
   members=math.members.map(member=>({member,shape:member.type==='vertical-web'?
     deriveD31OriginalPack2Vertical(at.get(member.from),at.get(member.to),post.boxes):
     deriveD31OriginalPack2Oblique(at.get(member.from),at.get(member.to),axis,beam.boxes)}));
  let bayRoots=0,loops=0;
  for(const {member,shape} of members){if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${math.panelCount}`;
   if(!start&&!end)continue;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    selected=inspectD35OriginalSplitWebWallTermination(shape,axis,src,
     {rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!selected?.sourceClear||!(selected.wallCutback>0))
    throw Error('D39 selected original wall web must remain source clear and unbuilt');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,{plane:axis,rootAtEnd:end,palette}),
    fitting=probeD36OriginalSocket(socket,src,selected.geometry);
   if(!fitting.sourceClear||fitting.memberPositiveVolumeOverlap||
     members.some(x=>x.member.memberId!==member.memberId&&d36SocketHitsOwner(socket,x.shape)))
    throw Error('D39 cannot reinterpret D36 socket collision as approved capture');
   const proof=screenD37OriginalRootTensilePath(socket,member,math,shape),
    d38=inspectD38RootTensionCaptureRoutes(socket,proof,src),
    study=inspectD39BoundedOriginalWallLoop(wall,axis,end,src,
     {maxRadius,levels,socketBounds:socket.bounds});
   if(!(proof.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||
     study.constructionAllowed!==false||study.worldCellsWritten!==0||
     study.realRetainerOrMechanicalClosureInstalled!==false||
     study.originalRootTensileCapacity!==null||
     d38.genuineRatedExternalWrapOrMechanicalCapture!==false)
    throw Error('D39 untested positive root force claimed as mechanically anchored');
   total.roots++;total.positiveTensileRoots++;total.sourceClearD36Sockets++;
   const [r5,r6]=d38.sampledCourseRings;
   if(r5.fullFourFaceSourceRingVacant)total.legacyFourFaceRingsAtY5++;
   if(r6.fullFourFaceSourceRingVacant)total.legacyFourFaceRingsAtY6++;
   total.originalNeighborBlockedY5+=r5.originalSolidVetoes;
   total.originalNeighborBlockedY6+=r6.originalSolidVetoes;
   total.candidateSourceSolidCellVetoes+=study.occupiedSourceVetoes;
   total.authoredY2BodyVetoes+=study.originalWalkEnvelopeVetoes;
   total.socketEnvelopeVetoes+=study.socketEnvelopeVetoes;
   if(study.sourceClearBackFaceHeights.length)total.rootedBackFaceAccessibleSites++;
   else total.rootedBackFaceUnreachableSites++;
   if(study.sourceOnlyProjectedWindingLoopFound){
    total.graphSourceOnlyWindingLoops++;loops++;
    if(study.witness.courseCount>1)total.sourceOnlyMultiCourseLoops++;
    else total.sourceOnlySingleCourseLoops++;
    if(!study.witness.trueRootBackFaceCellVisited||Math.abs(study.witness.projectedWinding)!==1)
     throw Error('D39 source loop is open or misses actual rear face');
   }else total.graphNoWindingLoopInBoundedSearch++;
   const coupon=deriveD39UnregisteredRearFaceWitness(wall,axis,end,palette),
    rear=inspectD39OriginalRearFaceWitness(coupon,src);
   const evidence=screenD39UnratedExternalCaptureEvidence(study,rear,{measuredFastenerPullout:'claim'});
   if(evidence.constructionAllowed!==false||evidence.missingAuthenticatedEvidence.length!==13||
      evidence.originalRootTensionCapacity!==null)throw Error('D39 forged source strength or evidence was admitted');
   total.originalRearCouponStudies++;
   if(rear.geometricallySourceClear)total.sourceClearOriginalRearCoupons++;
   else total.sourceBlockedRearCoupons++;
   if(rear.constructionAllowed!==false||rear.mechanicalWrapOrFastenerExists!==false)
    throw Error('D39 unregistered source-colored rear coupon falsely counted as tensile fastener');
   if(rear.geometricallySourceClear&&total.nativeSourceShapeRayChecks<maxNativeSamples){
    const native=verifyNativeRearProbe(coupon,src);
    total.actualOriginalBodyFitProbes+=native.nativeBodyFits;
    total.actualOriginalIntentionalBodyCollisions+=native.nativeIntentionalColliderVetoes;
    total.nativeSourceShapeRayChecks+=native.nativeRaySamples;
    total.maxNativeRayDifference=Math.max(total.maxNativeRayDifference,native.maxRayDelta);
   }
   bayRoots++;
  }
  if(bayRoots!==2)throw Error('D39 missing two genuine original wall roots per bay');
  total.bays++;
  perBay.push(Object.freeze({axis,spanCells:row.spanCells,roots:bayRoots,
    originalWindingLoops:loops,realFastenersInstalled:0,constructionAllowed:false}));
 }
 if(total.bays!==d29.unapprovedLongCandidateSpans||total.roots!==total.bays*2||
    total.graphSourceOnlyWindingLoops+total.graphNoWindingLoopInBoundedSearch!==total.roots||
    total.rootedBackFaceAccessibleSites+total.rootedBackFaceUnreachableSites!==total.roots||
    total.sourceClearOriginalRearCoupons+total.sourceBlockedRearCoupons!==total.roots||
    total.sourceOnlyMultiCourseLoops+total.sourceOnlySingleCourseLoops!==total.graphSourceOnlyWindingLoops||
    b.cells.length!==before.cells||b.navigation.length!==before.nav||
    b.cells[0]!==before.first||b.cells.at(-1)!==before.last||b.navigation[0]!==before.firstNav)
  throw Error('D39 original source mutation or strict root route accounting drift');
 return Object.freeze({format:'mythwrought.builder-d.d39.original-root-multi-course-unrated-loop.v1',
  blueprintId:b.id,originalLiveWoodRoofCells:d29.sourceRoofCells,
  originalDistantRoofCellsStillUncertified:d29.originalFarZoneCellsStillUncertified,
  originalUncertifiedFarZones:d29.originalFarZones,...total,perBay:Object.freeze(perBay),
  vacantNeighborCellIsNotClosedOriginalMechanicalLoop:true,
  closedProjectedWindingNotFastenedPhysicalCapture:true,
  sourceRearFaceContactNotRatedTension:true,
  multiCourseSearchBoundCannotProveGlobalImpossibility:true,
  originalOwnerMaterialShapesUnmodified:true,originalY7WoodAndUpperRoofUntouched:true,
  allAuthoredWalkingNodesPreserved:true,fullOriginalFoundationStrengthUnknown:true,
  originalRatedTensionAndShearCapacityUnknown:true,
  connectorAuthorAndFastenerTestsUnavailable:true,
  actualPlayerStepAndRenderAcceptanceUnrun:true,
  webgl2Unrun:true,installedIphonePwaUnrun:true,
  structuralReleaseApproved:false,constructionAllowed:false,
  worldCellsModified:0,saveWrites:0});
}
