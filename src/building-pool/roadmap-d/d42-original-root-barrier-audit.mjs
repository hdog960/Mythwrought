// Builder D42: ORIGINAL W16/W17 detached source forensic barrier witnesses.
// Never edits an authored cell, material owner, saved world or production file.
import {pack2Asset,pack2Shape} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical} from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination} from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket} from './d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath} from './d37-wall-pullout-fastener-contract.mjs';
import {auditD41ActualSourceRootFailures} from './d41-original-root-failure-audit.mjs';
import {inspectD42OriginalBarrierWitness} from './d42-root-barrier-witness.mjs';
/** Authentically source-owned real 16-building census of exact D41 failure roots. */
export function auditD42OriginalW16W17BarrierAndAlternateRearFaces(b,p,s,d25,{maxWitnessSamples=8}={}){
 if(!Number.isSafeInteger(maxWitnessSamples)||maxWitnessSamples<0||maxWitnessSamples>16)
  throw RangeError('D42 bounded authentic source diagnostic samples');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
   pack2Asset(62)?.key!=='dovetailed-support-post'||pack2Asset(61)?.roster!==15||
   pack2Asset(62)?.roster!==22||JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
   JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D42 original physical owner/registry authentic source changed');
 const start=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
  previous=auditD41ActualSourceRootFailures(b,p,s,d25),
  d29=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,d25),src=indexD29OriginalRoof(b);
 if(previous.constructionAllowed!==false||previous.sourceCellsWritten!==0||previous.savesWritten!==0||
    previous.originalWALKAndY7WoodUnchanged!==true||d29.constructionAllowed!==false||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D42 authentic unchanged author/roof/navigation and original D41 fail-closed authority needed');
 let previousIndex=0;
 const totals={longBays:0,roots:0,centerDisconnected:0,rearBlocked:0,windingUnavailable:0,
  minimumBlockedCentersSum:0,minimumBlockedCentersMax:0,allBarriersHaveWitness:0,
  actualFrontierCenters:0,frontierSolidVetoSites:0,frontierWALKVetoSites:0,frontierSocketVetoSites:0,
  hypotheticalBlockedOriginalCells:0,hypotheticalBlockedWalkingCells:0,hypotheticalBlockedSocketCells:0,
  rearBlockedRootsWithClearSideFace:0,rearBlockedRootsWithReachableSideFace:0,
  windingRootsWithPotentialNonzeroFundamentalCycle:0,windingRootsWithZeroFundamentalCycle:0,
  originalSourceCellsWritten:0,originalSaveWrites:0};
 const minBarrierCostHistogram={},sample=[];
 for(const row of d29.proposedOriginalLongBays){
  const model=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   points=new Map(model.nodes.map(v=>[v.id,[sx+.5+(axis==='x'?v.x:0),v.y,
    sz+.5+(axis==='z'?v.x:0)]])),
   members=model.members.map(member=>({member,shape:member.type==='vertical-web'?
    deriveD31OriginalPack2Vertical(points.get(member.from),points.get(member.to),post.boxes):
    deriveD31OriginalPack2Oblique(points.get(member.from),points.get(member.to),axis,beam.boxes)}));
  let inSpan=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const atStart=member.from==='T0',atEnd=member.to===`T${model.panelCount}`;
   if(!atStart&&!atEnd)continue;
   const wall=atStart?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    matching=previous.roots[previousIndex++];
   if(!matching||matching.axis!==axis||matching.end!==atEnd||
     JSON.stringify(matching.rootAt)!==JSON.stringify(wall)||
     matching.classification==='complete-bounded-route')
    throw Error('D42 original exact root provenance or negative D41 certification missing');
   const selected=inspectD35OriginalSplitWebWallTermination(shape,axis,src,
    {rootWall:wall,rootAtEnd:atEnd,maxCells:128}).selected;
   if(!selected?.sourceClear||!(selected.wallCutback>.2))
    throw Error('D42 original unchanged source-protected ID61 wall termination lost');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,{plane:axis,rootAtEnd:atEnd,palette}),
    force=screenD37OriginalRootTensilePath(socket,member,model,shape);
   if(!(force.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||force.constructionAllowed!==false)
    throw Error('D42 real original tension provenance lost or false approved fastener');
   const witness=inspectD42OriginalBarrierWitness(wall,axis,atEnd,src,{socketBounds:socket.bounds});
   if(witness.rootFailureCategory!==matching.classification||
     witness.centerGraphFrontRearConnected!==matching.centerRear||
     witness.constructionAllowed!==false||witness.worldWrites!==0||
     witness.noOriginalAuthorWallRoofNavigationOrWorldModified!==true)
    throw Error('D42 actual original graph certificate disagrees with D41');
   inSpan++;totals.roots++;
   const cost=witness.hypotheticalMinimumBlockedCenters;
   if(cost!==null){
    if(!Number.isSafeInteger(cost)||cost<0||cost>witness.hypotheticalMinimumBarrierPathLength)
     throw Error('D42 exact hypothetical barrier path cost invalid');
    totals.minimumBlockedCentersSum+=cost;
    totals.minimumBlockedCentersMax=Math.max(totals.minimumBlockedCentersMax,cost);
    minBarrierCostHistogram[cost]=(minBarrierCostHistogram[cost]??0)+1;
    totals.allBarriersHaveWitness++;
   }
   totals.actualFrontierCenters+=witness.exactFrontBlockingFrontierSites;
   totals.frontierSolidVetoSites+=witness.frontierSourceSolidSites;
   totals.frontierWALKVetoSites+=witness.frontierAuthoredWalkSites;
   totals.frontierSocketVetoSites+=witness.frontierSocketSites;
   totals.hypotheticalBlockedOriginalCells+=witness.hypotheticalBlockedCenterOriginalSolidCount;
   totals.hypotheticalBlockedWalkingCells+=witness.hypotheticalBlockedCenterWALKCount;
   totals.hypotheticalBlockedSocketCells+=witness.hypotheticalBlockedCenterSocketCount;
   switch(witness.rootFailureCategory){
    case 'center-graph-disconnected':totals.centerDisconnected++;break;
    case 'rear-source-entry-blocked':
     totals.rearBlocked++;
     totals.rearBlockedRootsWithClearSideFace+=Number(witness.clearSideFaceCandidates>0);
     totals.rearBlockedRootsWithReachableSideFace+=Number(witness.frontReachableSideFaceCandidates>0);break;
    case 'winding-or-closure-unavailable':
     totals.windingUnavailable++;
     if(witness.sweptFundamentalCycleWitness?.possibleNonzeroWinding)totals.windingRootsWithPotentialNonzeroFundamentalCycle++;
     else totals.windingRootsWithZeroFundamentalCycle++;break;
    default:throw Error('D42 new unexpected original protected source failure classification');
   }
   if(sample.length<maxWitnessSamples)sample.push(Object.freeze({at:[...wall],axis,category:witness.rootFailureCategory,
    barrierCost:cost,barrierPositions:witness.minimumBlockedPositionsSample.slice(0,6),
    frontier:witness.exactFrontBlockingFrontierSites,
    reachableTangentialFaces:witness.frontReachableSideFaceCandidates,
    fundamentalCycles:witness.sweptFundamentalCycleWitness?.fundamentalCycles??null,
    nonzeroWindingCycles:witness.sweptFundamentalCycleWitness?.nonzeroWindingCycles??null}));
  }
  if(inSpan!==2)throw Error('D42 must preserve exactly two original tensile roots per long bay');
  totals.longBays++;
 }
 if(previousIndex!==previous.roots.length||totals.longBays!==d29.unapprovedLongCandidateSpans||
    totals.roots!==previous.rootedTensileSocketSites||
    totals.centerDisconnected!==previous.failureCategories['center-graph-disconnected']||
    totals.rearBlocked!==previous.failureCategories['rear-source-entry-blocked']||
    totals.windingUnavailable!==previous.failureCategories['winding-or-closure-unavailable']||
    b.cells.length!==start[0]||b.navigation.length!==start[1]||b.cells[0]!==start[2]||
    b.cells.at(-1)!==start[3]||b.navigation[0]!==start[4])
  throw Error('D42 original W16/W17 author or D41 source provenance changed');
 return Object.freeze({format:'mythwrought.builder-d.d42.original-root-barrier-without-alteration.v1',
  blueprintId:b.id,originalLiveWoodRoof:d29.sourceRoofCells,
  originalDistantRoofStillUncertified:d29.originalFarZoneCellsStillUncertified,
  originalUncertifiedFarZones:d29.originalFarZones,...totals,
  minimumBarrierCostHistogram:Object.freeze(minBarrierCostHistogram),
  sampledSourceBarriers:Object.freeze(sample),
  minimumHypotheticalBlockedCENTERPathIsNotAuthorizedCarvingOrGraphMinimumCut:true,
  tangentialSideFaceIsNotTensileBackfaceRetention:true,
  windingFundamentalCycleStudyCannotCreatePhysicalFastener:true,
  allOriginalSourceRoofWALKAndPack2OwnersPreserved:true,
  zeroMaterialFastenerOrFoundationPulloutRatings:true,
  structuralRoofCertified:false,constructionAllowed:false,
  installedIphonePwaAccepted:false,webgl2Accepted:false,worldWrites:0,savesWritten:0});
}
