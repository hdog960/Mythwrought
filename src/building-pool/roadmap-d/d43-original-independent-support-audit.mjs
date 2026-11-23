// MYTHWROUGHT D43: AUTHENTIC original W16/W17 source-only separate support
// envelope diagnosis. No new source material, footing, connector, settlement,
// original Y7 roof, WALK, world, save or registered Pack2 geometry is touched.
import {pack2Asset,pack2Shape} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance}
 from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique} from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination} from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket} from './d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath} from './d37-wall-pullout-fastener-contract.mjs';
import {inspectD42OriginalBarrierWitness} from './d42-root-barrier-witness.mjs';
import {inspectD43IndependentOutboardSupport,inspectD43TangentialWallFace,
 sampleD43SourcePaletteTieSegment} from './d43-source-backed-outboard-support.mjs';
/** Focused NEW D43 audit; imports exact original source authors and gate code,
 * not prior test suites or CI. Remains read-only and structurally UNAPPROVED. */
export function auditD43OriginalIndependentOutboardAnchorage(b,primary,secondary,d25,{
 maxTieCandidates=12,maxWitnessSamples=8,maxMeshSamples=1
}={}){
 if(!Number.isSafeInteger(maxTieCandidates)||maxTieCandidates<1||maxTieCandidates>24||
  !Number.isSafeInteger(maxWitnessSamples)||maxWitnessSamples<0||maxWitnessSamples>16||
  !Number.isSafeInteger(maxMeshSamples)||maxMeshSamples<0||maxMeshSamples>2)
  throw RangeError('D43 exact genuine original read-only source sampling budget');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
    pack2Asset(62)?.key!=='dovetailed-support-post'||pack2Asset(61)?.roster!==15||
    pack2Asset(62)?.roster!==22||
    JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
    JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
   throw Error('D43 protected original Pack2 material owner/ID registry changed');
 const old=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
  d29=auditD29OriginalLongBayBearingAndTierClearance(b,primary,secondary,d25),
  source=indexD29OriginalRoof(b);
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D43 original author roof and WALK or D29 no-construction check failed');
 const totals={longBays:0,tensileRootStudies:0,sourceClearOriginalSockets:0,
  originalD42Disconnected:0,originalD42RearBlocked:0,originalD42WindingUnavailable:0,
  originalD42OneBlockedCenter:0,originalD42ZeroBlockedCenters:0,
  actualFrontReachableTangentialWitnesses:0,actualTangentialNormalAxialContact:0,
  originalExistingRootedSupportSiteObservations:0,independentRatedExistingSupports:0,
  originalEmptyGroundLayerFootprintObservations:0,
  sourceClearVerticalPylonEnvelopeObservations:0,
  sourceSolidPylonVetoObservations:0,authoredWalkPylonVetoObservations:0,
  candidatePylonCorridorsStudied:0,finiteSweptTieEdgesExamined:0,
  sourceSolidTieEdgeVetoEvents:0,walkingBodyTieEdgeVetoEvents:0,
  socketTieEdgeVetoEvents:0,sourceClearOutboardTieCorridors:0,
  speculativeOutboardFootingsWithoutTerrainProof:0,
  realApprovedIndependentGroundFootings:0,realRatedWallToTieConnections:0,
  realRegisteredNewIDs:0,sourcePaletteMeshRaySamples:0,
  largestSourcePaletteMeshRayDisagreement:0,sourceCellWrites:0};
 const categories=[],samples=[];
 for(const row of d29.proposedOriginalLongBays){
  const model=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   coords=new Map(model.nodes.map(n=>[n.id,[sx+.5+(axis==='x'?n.x:0),n.y,
     sz+.5+(axis==='z'?n.x:0)]]));
  let bayRoots=0;
  for(const member of model.members){
   if(member.type!=='diagonal-web')continue;
   const atStart=member.from==='T0',atEnd=member.to===`T${model.panelCount}`;
   if(!atStart&&!atEnd)continue;
   const wall=atStart?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    geom=deriveD31OriginalPack2Oblique(coords.get(member.from),coords.get(member.to),axis,beam.boxes),
    terminated=inspectD35OriginalSplitWebWallTermination(geom,axis,source,
      {rootWall:wall,rootAtEnd:atEnd,maxCells:128}).selected;
   if(!terminated?.sourceClear||!(terminated.wallCutback>.2))
    throw Error('D43 original D35 wall termination no longer source-clear');
   const socket=deriveD36IndependentRootSocket(terminated.geometry,wall,{plane:axis,rootAtEnd:atEnd,palette}),
    fitted=probeD36OriginalSocket(socket,source,terminated.geometry),
    demand=screenD37OriginalRootTensilePath(socket,member,model,geom);
   if(!fitted.sourceClear||fitted.constructionAllowed!==false||
      !(demand.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||demand.constructionAllowed!==false)
    throw Error('D43 changed authentic source Y5/Y6 wall or falsely rated original tensile socket');
   const barrier=inspectD42OriginalBarrierWitness(wall,axis,atEnd,source,{socketBounds:socket.bounds});
   if(barrier.constructionAllowed!==false||barrier.minimumIsBlockedCENTERCountNotMinimalGraphCut!==true||
      barrier.frontierSourceSolidSites<0||barrier.hypotheticalMinimumBlockedCenters===null)
    throw Error('D43 D42 original source barrier provenance missing');
   const support=inspectD43IndependentOutboardSupport(wall,axis,atEnd,source,
    {socketBounds:socket.bounds,maxTieCandidates,maxSamples:2});
   if(support.constructionAllowed!==false||support.worldWrites!==0||
      support.authenticatedNewFootings!==0||support.authenticatedTensionConnections!==0||
      support.sourceClearExternalTieCorridors!==support.sourceClearYetNoActualFoundation)
    throw Error('D43 empty authored terrain or exterior prism is NOT independent rooted tensile support');
   bayRoots++;totals.tensileRootStudies++;totals.sourceClearOriginalSockets++;
   switch(barrier.rootFailureCategory){
    case 'center-graph-disconnected':totals.originalD42Disconnected++;break;
    case 'rear-source-entry-blocked':totals.originalD42RearBlocked++;break;
    case 'winding-or-closure-unavailable':totals.originalD42WindingUnavailable++;break;
    default:throw Error('D43 unexpected original root category or fake complete rated loop');
   }
   if(barrier.hypotheticalMinimumBlockedCenters===1)totals.originalD42OneBlockedCenter++;
   else if(barrier.hypotheticalMinimumBlockedCenters===0)totals.originalD42ZeroBlockedCenters++;
   else throw Error('D43 D42 source-authentic exact bounded barrier history changed');
   for(const face of barrier.sideFaceCandidates){
    const tangential=inspectD43TangentialWallFace(wall,axis,atEnd,face);
    if(tangential.normalTensionDot!==0||tangential.constructionAllowed!==false)
      throw Error('D43 actual tangential original wall face mistaken for axial mechanical capture');
    if(tangential.frontReachable)totals.actualFrontReachableTangentialWitnesses++;
    totals.actualTangentialNormalAxialContact+=Math.abs(tangential.normalTensionDot);
   }
   totals.originalExistingRootedSupportSiteObservations+=support.unrelatedExistingAuthoredRootedPositions;
   totals.independentRatedExistingSupports+=support.independentlyRatedExistingSupports;
   totals.originalEmptyGroundLayerFootprintObservations+=support.sourceVacantY0Y1FootprintPositions;
   totals.sourceClearVerticalPylonEnvelopeObservations+=support.candidateOpenVerticalPylonEnvelopes;
   totals.sourceSolidPylonVetoObservations+=support.authoredColumnSolidVetoPositions;
   totals.authoredWalkPylonVetoObservations+=support.authoredStandingWALKVetoPositions;
   totals.candidatePylonCorridorsStudied+=support.candidateFootprintsExaminedForTies;
   totals.finiteSweptTieEdgesExamined+=support.finitePrismEdgesTested;
   totals.sourceSolidTieEdgeVetoEvents+=support.testedPrismSourceCollisionEvents;
   totals.walkingBodyTieEdgeVetoEvents+=support.testedPrismWalkingBodyCollisionEvents;
   totals.socketTieEdgeVetoEvents+=support.testedPrismSocketCollisionEvents;
   totals.sourceClearOutboardTieCorridors+=support.sourceClearExternalTieCorridors;
   totals.speculativeOutboardFootingsWithoutTerrainProof+=support.sourceClearYetNoActualFoundation;
   if(samples.length<maxWitnessSamples)samples.push(Object.freeze({wall:[...wall],axis,
    originalFailure:barrier.rootFailureCategory,
    blockedCenterCost:barrier.hypotheticalMinimumBlockedCenters,
    barrierPosition:barrier.minimumBlockedPositionsSample[0]?.at??null,
    frontReachableTangential:barrier.frontReachableSideFaceCandidates,
    existingRootedAuthorSites:support.unrelatedExistingAuthoredRootedPositions,
    clearPylonSites:support.candidateOpenVerticalPylonEnvelopes,
    finiteSourceClearTieCorridors:support.sourceClearExternalTieCorridors,
    independentRatedSupport:false}));
   if(totals.sourcePaletteMeshRaySamples<maxMeshSamples){
    const s=atEnd?-1:1,seg=axis==='x'?
      [[wall[0]+s,6,wall[2]],[wall[0]+2*s,6,wall[2]]]:
      [[wall[0],6,wall[2]+s],[wall[0],6,wall[2]+2*s]],
     visual=sampleD43SourcePaletteTieSegment(seg[0],seg[1],palette);
    totals.sourcePaletteMeshRaySamples++;
    totals.largestSourcePaletteMeshRayDisagreement=Math.max(totals.largestSourcePaletteMeshRayDisagreement,
      visual.physicalMeshRayDelta);
   }
  }
  if(bayRoots!==2)throw Error('D43 original long bay must have two independently measured tensile roots');
  totals.longBays++;
 }
 if(totals.longBays!==d29.unapprovedLongCandidateSpans||
    totals.tensileRootStudies!==2*totals.longBays||
    totals.originalD42Disconnected+totals.originalD42RearBlocked+
     totals.originalD42WindingUnavailable!==totals.tensileRootStudies||
    totals.originalD42OneBlockedCenter+totals.originalD42ZeroBlockedCenters!==totals.tensileRootStudies||
    JSON.stringify([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]])!==JSON.stringify(old))
  throw Error('D43 authentic original Wave16/17 population or source immutability differs');
 return Object.freeze({format:'mythwrought.builder-d.d43.authentic-original-exterior-no-footing-v1',
  blueprintId:b.id,originalRoof:d29.sourceRoofCells,
  originalUncertifiedRoofCells:d29.originalFarZoneCellsStillUncertified,
  originalUncertifiedFarZones:d29.originalFarZones,...totals,
  originalBarrierCategoriesRetained:true,
  identicalOriginalRegisteredPack2Ids61And62:true,
  tangentialExteriorSideHasNoAxialNormalTensileRetention:true,
  virtualClearPylonSiteCannotProveTerrainOrSeparableFoundation:true,
  existingAuthorRootNotIndependentRatedAnchor:true,
  noVerifiedSocketToOutboardTieFastener:true,
  generatedWorldGroundAndCavePreservationNotAccepted:true,
  allOriginalY7WoodAndWalkPreserved:true,
  noActualOwnerApprovedStrapOrColumn:true,
  roofLoadsAndFoundationPulloutRatingsUnavailable:true,
  newRealConstructionApproved:false,constructionAllowed:false,
  installedIphonePwaAccepted:false,webgl2Accepted:false,
  worldWrites:0,savesWritten:0,
  samples:Object.freeze(samples)});
}
