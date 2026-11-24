// MYTHWROUGHT Builder D44: independently regenerated genuine Wave16/17 source
// only. Compare authentic D43 nearest-column Y6 rejection against bounded 3D
// full-thickness alternate ties; NEVER infer a material rating, actual footing,
// generated terrain, wall penetration or source-owner construction permission.
import {pack2Asset,pack2Shape} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance}
 from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique} from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination} from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket}
 from './d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath} from './d37-wall-pullout-fastener-contract.mjs';
import {inspectD42OriginalBarrierWitness} from './d42-root-barrier-witness.mjs';
import {inspectD44AlternateOriginalOutboardTie} from './d44-source-full-volume-tie-router.mjs';
const PROTECTED_ROLES=new Set(['foundation','floor','wall','partition','column','beam']);
function isRoot(src,p){
 const [x,y,z]=p;
 return y===6&&src.get(x,0,z)?.role==='foundation'&&src.get(x,1,z)?.role==='floor'&&
  src.get(x,7,z)?.asset==='live:wood'&&
  Array.from({length:7},(_,y)=>PROTECTED_ROLES.has(src.get(x,y,z)?.role)).every(Boolean);
}
export function auditD44OriginalSourceAlternateFootingTies(b,primary,secondary,d25,{
 maxTieCandidates=12,maxRootSamples=4
}={}){
 if(!Number.isSafeInteger(maxTieCandidates)||maxTieCandidates<1||maxTieCandidates>12||
  !Number.isSafeInteger(maxRootSamples)||maxRootSamples<0||maxRootSamples>8)
  throw RangeError('D44 original source scoped candidate and ledger sampling budget');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
    pack2Asset(61)?.roster!==15||pack2Asset(62)?.key!=='dovetailed-support-post'||
    pack2Asset(62)?.roster!==22||
    JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
    JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D44 immutable original Pack2 ID61 and ID62 physical materials unavailable');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,primary,secondary,d25),src=indexD29OriginalRoof(b),
  snapshot=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
   d29.allOriginalY7WoodPreserved!==true||d29.allOriginalAuthorNavigationPreserved!==true||
   d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D44 source W16/W17 original roof, WALK and unrated authorship veto drifted');
 const total={bays:0,roots:0,originalD42Disconnected:0,originalD42RearBlocked:0,
   originalD42WindingUnavailable:0,originalD42OneBlockedCenter:0,
   candidateNearestFootprintStudies:0,originalD43Y6LSourceClear:0,
   originalY6LPlansExamined:0,originalY6LFirstSolidBlocked:0,
   originalY6LFirstWalkBlocked:0,originalY6LFirstSocketBlocked:0,
   originalFirstSolidBlockedAtY4:0,originalFirstSolidBlockedAtY5:0,originalFirstSolidBlockedAtY6:0,
   alternateY6BFSGeometricCorridors:0,alternateY5BFSGeometricCorridors:0,
   alternateY4BFSGeometricCorridors:0,additionalY5GeometricCorridors:0,
   additionalY4GeometricCorridors:0,uniqueFullThicknessEdges:0,
   authenticOriginalVoxelEdgeVetoEvents:0,protectedWALKBodyEdgeVetoEvents:0,
   sourceSocketEnvelopeEdgeVetoEvents:0,independentTerrainFootingsCertified:0,
   actualMechanicalTieFastenersAccepted:0,newBlockIDsRegistered:0,originalCellsWritten:0};
 const samples=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
    !isRoot(src,row.sourceOriginalStartBearing)||!isRoot(src,row.sourceOriginalEndBearing))
   throw Error('D44 original rooted source Y0–Y7, source WALK or cave-safe course missing');
  const model=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   nodes=new Map(model.nodes.map(n=>[n.id,[sx+.5+(axis==='x'?n.x:0),n.y,
    sz+.5+(axis==='z'?n.x:0)]]));
  let roots=0;
  for(const member of model.members){
   if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${model.panelCount}`;
   if(!start&&!end)continue;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    shape=deriveD31OriginalPack2Oblique(nodes.get(member.from),nodes.get(member.to),axis,beam.boxes),
    chosen=inspectD35OriginalSplitWebWallTermination(shape,axis,src,
     {rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!chosen?.sourceClear||!(chosen.wallCutback>.2))
    throw Error('D44 original wall-rooted D35 trimmed diagonal not source-clear');
   const socket=deriveD36IndependentRootSocket(chosen.geometry,wall,{plane:axis,rootAtEnd:end,palette}),
    fit=probeD36OriginalSocket(socket,src,chosen.geometry),
    force=screenD37OriginalRootTensilePath(socket,member,model,shape);
   if(!fit.sourceClear||fit.constructionAllowed!==false||
     !(force.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||force.constructionAllowed!==false)
    throw Error('D44 genuine D36 wall socket or original D37 tension verification failed');
   const prev=inspectD42OriginalBarrierWitness(wall,axis,end,src,{socketBounds:socket.bounds}),
    trial=inspectD44AlternateOriginalOutboardTie(wall,axis,end,src,
     {socketBounds:socket.bounds,maxTieCandidates,maxSamples:1});
   if(prev.constructionAllowed!==false||trial.constructionAllowed!==false||
     trial.sourceApprovedFootings!==0||trial.verifiedGeneratedTerrainGround!==0||
     trial.actualRatedFastenerConnections!==0||trial.worldCellWrites!==0||
     trial.originalSourceGroundIsNotGeneratedTerrain!==true)
    throw Error('D44 hypothetical alternate tie misclassified as approved anchor or generated ground');
   roots++;total.roots++;
   switch(prev.rootFailureCategory){
    case 'center-graph-disconnected':total.originalD42Disconnected++;break;
    case 'rear-source-entry-blocked':total.originalD42RearBlocked++;break;
    case 'winding-or-closure-unavailable':total.originalD42WindingUnavailable++;break;
    default:throw Error('D44 D42 original physical loop not genuine or category drifted');
   }
   if(prev.hypotheticalMinimumBlockedCenters===1)total.originalD42OneBlockedCenter++;
   else if(prev.hypotheticalMinimumBlockedCenters!==0)throw Error('D44 genuine D42 minimum hypothetical blocked centers changed');
   total.candidateNearestFootprintStudies+=trial.originalD43NearestCandidatePositions;
   total.originalD43Y6LSourceClear+=trial.originalD43Y6LSourceClear;
   total.originalY6LPlansExamined+=trial.baselineY6LPlansChecked;
   total.originalY6LFirstSolidBlocked+=trial.baselineFirstSolidBlockedPlans;
   total.originalY6LFirstWalkBlocked+=trial.baselineFirstWalkBlockedPlans;
   total.originalY6LFirstSocketBlocked+=trial.baselineFirstSocketBlockedPlans;
   total.originalFirstSolidBlockedAtY4+=trial.baselineFirstBlockingSourceVoxelAtY4;
   total.originalFirstSolidBlockedAtY5+=trial.baselineFirstBlockingSourceVoxelAtY5;
   total.originalFirstSolidBlockedAtY6+=trial.baselineFirstBlockingSourceVoxelAtY6;
   total.alternateY6BFSGeometricCorridors+=trial.originalY6BFSReachableCandidatePositions;
   total.alternateY5BFSGeometricCorridors+=trial.y5PermittedBFSReachableCandidatePositions;
   total.alternateY4BFSGeometricCorridors+=trial.y4PermittedBFSReachableCandidatePositions;
   total.additionalY5GeometricCorridors+=trial.newlyReachableWithY5;
   total.additionalY4GeometricCorridors+=trial.newlyReachableWithY4;
   total.uniqueFullThicknessEdges+=trial.uniqueFullThicknessEdges;
   total.authenticOriginalVoxelEdgeVetoEvents+=trial.sourceEdgeVetoEvents;
   total.protectedWALKBodyEdgeVetoEvents+=trial.walkEdgeVetoEvents;
   total.sourceSocketEnvelopeEdgeVetoEvents+=trial.socketEdgeVetoEvents;
   if(samples.length<maxRootSamples)samples.push(Object.freeze({
    wall:Object.freeze([...wall]),axis,rootAtEnd:end,
    originalD42Category:prev.rootFailureCategory,
    originalD42BlockedCenterCount:prev.hypotheticalMinimumBlockedCenters,
    examinedFootingSites:trial.originalD43NearestCandidatePositions,
    originalY6Blocker:trial.samples[0]?.firstY6XThenZBlocker??null,
    sourceClearY6Candidates:trial.originalY6BFSReachableCandidatePositions,
    sourceClearY5Candidates:trial.y5PermittedBFSReachableCandidatePositions,
    sourceClearY4Candidates:trial.y4PermittedBFSReachableCandidatePositions,
    generatedGroundVerified:false,actualSocketTieFastened:false}));
  }
  if(roots!==2)throw Error('D44 genuine original D30 span must contain two tensile root members');
  total.bays++;
 }
 if(total.bays!==d29.unapprovedLongCandidateSpans||total.roots!==2*total.bays||
    total.originalD42Disconnected+total.originalD42RearBlocked+
     total.originalD42WindingUnavailable!==total.roots||
    total.alternateY4BFSGeometricCorridors<total.alternateY5BFSGeometricCorridors||
    total.alternateY5BFSGeometricCorridors<total.alternateY6BFSGeometricCorridors||
    b.cells.length!==snapshot[0]||b.navigation.length!==snapshot[1]||
    b.cells[0]!==snapshot[2]||b.cells.at(-1)!==snapshot[3]||b.navigation[0]!==snapshot[4])
  throw Error('D44 original rooted source/WALK immutability or alternative-route ledger failure');
 return Object.freeze({format:'mythwrought.builder-d.d44.authentic-original-three-course-tie-audit.v1',
  blueprintId:b.id,originalRoof:d29.sourceRoofCells,
  distantRoofCellsStillStructurallyUncertified:d29.originalFarZoneCellsStillUncertified,
  originalDistantRoofZoneCount:d29.originalFarZones,...total,
  completePrismBendsCheckedWithoutSourceWALLPenetration:true,
  routeFromHypotheticalFrontCellDoesNotProveSocketPhysicalConnection:true,
  originalBlueprintFootingVacancyNotRealGroundEvidence:true,
  originalY7WoodAndAllAuthoredWALKUnmodified:true,
  noRealRatedMaterialOrInstalledConnector:true,
  noWebGL2OrIphoneHomeScreenAcceptance:true,
  approvedNewFootings:0,approvedSourceOwnerFasteners:0,worldWrites:0,savesWritten:0,
  structuralReleaseAccepted:false,constructionAllowed:false,
  samples:Object.freeze(samples)});
}
