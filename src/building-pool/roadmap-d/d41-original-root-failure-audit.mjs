// D41 original Wave16/17 source-authentic forensic root cause of the D40
// ZERO swept enclosure loops. Never registers connector or changes source.
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
import {inspectD40SweptOriginalWallRoute}
 from './d40-swept-exterior-capture.mjs';
import {inspectD41RootFailureCertificate}
 from './d41-finite-route-failure-certificate.mjs';
const stable=new Set(['foundation','floor','wall','partition','column','beam']);
const rooted=(s,p)=>p[1]===6&&s.get(p[0],0,p[2])?.role==='foundation'&&
 s.get(p[0],1,p[2])?.role==='floor'&&
 Array.from({length:7},(_,y)=>stable.has(s.get(p[0],y,p[2])?.role)).every(Boolean);
const categories=Object.freeze(['front-and-rear-source-entries-blocked','front-source-entry-blocked',
 'rear-source-entry-blocked','center-graph-disconnected','swept-segment-graph-disconnected',
 'winding-or-closure-unavailable','complete-bounded-route']);
/** One ORIGINAL authored building. Previous native CI is reused; this is new
 * inspection logic, not a rerun of D40's original tests or world mutation. */
export function auditD41ActualSourceRootFailures(b,p,s,d25,{
 radius=4,levels=[3,4,5,6],halfWidth=.08
}={}){
 if(radius!==4||!Array.isArray(levels)||JSON.stringify(levels)!=='[3,4,5,6]'||
  halfWidth!==.08)throw TypeError('D41 original native census must preserve exact D40 bounds');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.roster!==15||pack2Asset(62)?.roster!==22||
  pack2Asset(61)?.key!=='ironbound-heartwood-beam'||pack2Asset(62)?.key!=='dovetailed-support-post'||
  JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
  JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D41 original Pack2 material/shape owner changed');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,d25),src=indexD29OriginalRoof(b),
  before=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
  d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius||
  !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved)
  throw Error('D41 original protected W16/W17 Y7 roof, navigation or authority changed');
 const totals={longBays:0,rootedTensileSocketSites:0,
  frontAvailable:0,rearAvailable:0,frontAndRearAvailable:0,
  centerGraphRearReachable:0,sweptGraphRearReachable:0,
  sourceSolidCenterVetoes:0,sourceWalkCenterVetoes:0,sourceSocketCenterVetoes:0,
  sweptSourceEdgeVetoes:0,sweptWalkingEdgeVetoes:0,sweptSocketEdgeVetoes:0,
  admissibleCenters:0,centerComponents:0,centerFrontReachableSites:0,
  sweptFrontReachableSites:0,sweptEdgesTested:0,sweptEdgesClear:0,
  windingStatesSearched:0,originalD40Loops:0,d41ClosedLoops:0,
  worldWrites:0,authenticatedMechanicalCapture:0};
 const failures=Object.fromEntries(categories.map(v=>[v,0]));
 const roots=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
   !rooted(src,row.sourceOriginalStartBearing)||!rooted(src,row.sourceOriginalEndBearing))
   throw Error('D41 real authored wall or WALK/roof geometry changed');
  const model=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   points=new Map(model.nodes.map(v=>[v.id,[sx+.5+(axis==='x'?v.x:0),v.y,
    sz+.5+(axis==='z'?v.x:0)]])),
   members=model.members.map(member=>({member,shape:member.type==='vertical-web'?
    deriveD31OriginalPack2Vertical(points.get(member.from),points.get(member.to),post.boxes):
    deriveD31OriginalPack2Oblique(points.get(member.from),points.get(member.to),axis,beam.boxes)}));
  let twoRoots=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${model.panelCount}`;
   if(!start&&!end)continue;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    selected=inspectD35OriginalSplitWebWallTermination(shape,axis,src,
      {rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!selected?.sourceClear||!(selected.wallCutback>.2))
    throw Error('D41 original source-clean trimmed ID61 tensile root missing');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,
      {plane:axis,rootAtEnd:end,palette}),
    fit=probeD36OriginalSocket(socket,src,selected.geometry);
   if(!fit.sourceClear||fit.memberPositiveVolumeOverlap||
    members.some(m=>m.member.memberId!==member.memberId&&d36SocketHitsOwner(socket,m.shape)))
    throw Error('D41 exact original D36 source socket is obstructed');
   const math=screenD37OriginalRootTensilePath(socket,member,model,shape);
   if(!(math.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||
      math.authenticatedRatedConnectionEdges!==0||math.constructionAllowed!==false)
    throw Error('D41 fictional source-rated tensile mechanical connector');
   const opts={radius,levels,halfWidth,socketBounds:socket.bounds},
    baseline=inspectD40SweptOriginalWallRoute(wall,axis,end,src,opts),
    diag=inspectD41RootFailureCertificate(wall,axis,end,src,opts);
   if(diag.completeSweptLoop!==baseline.finiteThicknessClosedWindingFound||
      diag.admissibleCenters!==baseline.sourceClearVacantCenters||
      diag.centerSolidVetoes!==baseline.centerOriginalCellVetoes||
      diag.centerWalkingVetoes!==baseline.centerStandingBodyVetoes||
      diag.centerSocketVetoes!==baseline.centerSocketVetoes||
      JSON.stringify(diag.availableFrontHeights)!==JSON.stringify(baseline.frontHeights)||
      JSON.stringify(diag.availableRearHeights)!==JSON.stringify(baseline.rearHeights)||
      diag.constructionAllowed!==false||diag.worldWrites!==0)
     throw Error('D41 original finite thickness source-topology diagnosis conflicts with D40');
   if(!(diag.rootFailureCategory in failures)||diag.originalOriginalRoofAndWalkProtected!==true||
      diag.noNewAnchorOrIndependentRearFastener!==true)
    throw Error('D41 source-only geometry cannot approve original wall-retention hardware');
   twoRoots++;totals.rootedTensileSocketSites++;failures[diag.rootFailureCategory]++;
   const hasFront=diag.availableFrontHeights.length>0,hasRear=diag.availableRearHeights.length>0;
   totals.frontAvailable+=Number(hasFront);totals.rearAvailable+=Number(hasRear);
   totals.frontAndRearAvailable+=Number(hasFront&&hasRear);
   totals.centerGraphRearReachable+=Number(diag.centerGraphFrontToRearConnected);
   totals.sweptGraphRearReachable+=Number(diag.sweptGraphFrontToRearConnected);
   totals.sourceSolidCenterVetoes+=diag.centerSolidVetoes;
   totals.sourceWalkCenterVetoes+=diag.centerWalkingVetoes;
   totals.sourceSocketCenterVetoes+=diag.centerSocketVetoes;
   totals.sweptSourceEdgeVetoes+=diag.edgeOriginalVetoes;
   totals.sweptWalkingEdgeVetoes+=diag.edgeWalkingVetoes;
   totals.sweptSocketEdgeVetoes+=diag.edgeSocketVetoes;
   totals.admissibleCenters+=diag.admissibleCenters;
   totals.centerComponents+=diag.centerConnectedComponents;
   totals.centerFrontReachableSites+=diag.centerGraphFrontReachable;
   totals.sweptFrontReachableSites+=diag.sweptGraphFrontReachable;
   totals.sweptEdgesTested+=diag.finiteSweptEdgesTested;
   totals.sweptEdgesClear+=diag.finiteSweptEdgesClear;
   totals.windingStatesSearched+=diag.windingStates;
   totals.originalD40Loops+=Number(baseline.finiteThicknessClosedWindingFound);
   totals.d41ClosedLoops+=Number(diag.completeSweptLoop);
   roots.push(Object.freeze({rootAt:[...wall],axis,end,classification:diag.rootFailureCategory,
      front:diag.availableFrontHeights,rear:diag.availableRearHeights,
      centerRear:diag.centerGraphFrontToRearConnected,sweptRear:diag.sweptGraphFrontToRearConnected,
      centerReachable:diag.centerGraphFrontReachable,sweptReachable:diag.sweptGraphFrontReachable,
      originalVetoes:diag.centerSolidVetoes,walkingVetoes:diag.centerWalkingVetoes,
      socketVetoes:diag.centerSocketVetoes,sweptEdges:diag.finiteSweptEdgesTested}));
  }
  if(twoRoots!==2)throw Error('D41 original source truss must contain exactly two tensile wall roots');
  totals.longBays++;
 }
 if(totals.longBays!==d29.unapprovedLongCandidateSpans||
  totals.rootedTensileSocketSites!==totals.longBays*2||
  Object.values(failures).reduce((n,v)=>n+v,0)!==totals.rootedTensileSocketSites||
  b.cells.length!==before[0]||b.navigation.length!==before[1]||
  b.cells[0]!==before[2]||b.cells.at(-1)!==before[3]||b.navigation[0]!==before[4])
  throw Error('D41 original-source cells, protected WALK or source root census changed');
 return Object.freeze({format:'mythwrought.builder-d.d41.authentic-original-boundary-failure-ledger.v1',
  blueprintId:b.id,originalLiveWoodRoofCells:d29.sourceRoofCells,
  distantRoofStillStructurallyUncertified:d29.originalFarZoneCellsStillUncertified,
  originalUncertifiedFarZones:d29.originalFarZones,...totals,
  failureCategories:Object.freeze(failures),roots:Object.freeze(roots),
  originalWallNeverModified:true,sourceOwnerPack2NeverModified:true,
  originalWALKAndY7WoodUnchanged:true,
  limitedRadiusAndHeightDoNotRuleOutOtherAnchorDesigns:true,
  graphReachabilityCannotCertifyContinuousRatedFastener:true,
  noIndependentTestedWallOrFoundationTensileCapacity:true,
  additionalEndCapMeshAndRuntimeCollisionUnapproved:true,
  constructionAllowed:false,structuralRoofLoadCertified:false,
  webgl2Acceptance:false,installedIphoneHomeScreenPwaAcceptance:false,
  savesWritten:0,sourceCellsWritten:0});
}
