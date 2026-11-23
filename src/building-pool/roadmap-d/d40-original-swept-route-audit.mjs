// MYTHWROUGHT D40: genuine W16/W17 original-source, strictly no world edits.
// Independent finite-thickness radius4 and lower-course comparisons. Original
// full checkout is required for authentic material, roof, WALK and bearing.
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
import {deriveD39UnregisteredRearFaceWitness,inspectD39OriginalRearFaceWitness} from './d39-actual-multicourse-wall-loop.mjs';
import {inspectD40SweptOriginalWallRoute,deriveD40UnregisteredStrapSegment,
  d40SegmentCellShapes,inspectD40StrapMeshRay,screenD40RealTensionCaptureEvidence,
  probeD40ActualStrapSweep} from './d40-swept-exterior-capture.mjs';
const stable=new Set(['foundation','floor','wall','partition','column','beam']);
const rooted=(src,wall)=>wall[1]===6&&src.get(wall[0],0,wall[2])?.role==='foundation'&&
  src.get(wall[0],1,wall[2])?.role==='floor'&&
  Array.from({length:7},(_,y)=>stable.has(src.get(wall[0],y,wall[2])?.role)).every(Boolean);
/** Native original collision/selection probe on a derived, UNREGISTERED
 * source-colored strap segment. This probe DOES NOT claim an actual installed
 * world-wide strap; it only checks shape-contract math. */
function narrowNativeSegment(a,b,palette){
 const seg=deriveD40UnregisteredStrapSegment(a,b,palette),pieces=d40SegmentCellShapes(seg),
  reader=pieces.get;
 for(const {boxes} of [reader(...a),reader(...b)])if(!validateShape({boxes}))
   throw Error('D40 original voxel-shape contract rejected a clipped finite-thickness strap segment');
 const low=seg.bounds.min,high=seg.bounds.max,
  along=a.findIndex((v,i)=>v!==b[i]),perpendicular=along===2?0:2,
  from=low.map((v,i)=>(v+high[i])/2),direction=[0,0,0];
 from[perpendicular]=low[perpendicular]-1;direction[perpendicular]=1;
 const hit=raycastShapes(from,direction,reader,4),expected=1;
 if(!hit||Math.abs(hit.distance-expected)>1e-5)
   throw Error('D40 original native raycastShapes disagrees with unregistered physical strap segment');
 const outside=inspectBodyFit([low[0],2,low[2],high[0],4.5,high[2]],reader,{maxCells:48}),
  contact=inspectBodyFit([...low.map(v=>v-.01),...high.map(v=>v+.01)],reader,{maxCells:48});
 if(!outside.fits||contact.fits)throw Error('D40 original inspectBodyFit failed clear-body/intentional-contact controls');
 const paletteProbe=inspectD40StrapMeshRay(seg);
 if(paletteProbe.rayDelta>1e-5)throw Error('D40 true source-palette rendered triangle ray disagrees');
 return {nativeRayChecks:1,nativeBodyClearProbes:1,nativeBodyOverlapControls:1,
  splitOriginalVoxelShapeParts:pieces.parts,maxNativeRayDifference:Math.max(paletteProbe.rayDelta,Math.abs(hit.distance-expected))};
}
/** One original author building, no previous D39 native suite replay.
 * New paired radius4 searches answer whether a lower, source-approved
 * course changes the actual finite-thickness route decision. */
export function auditD40OriginalSweptExteriorRoutes(building,first,second,d25,{
  halfWidth=.08,maxNativeSamples=1
}={}){
 if(!Number.isFinite(halfWidth)||halfWidth<.055||halfWidth>.18||
    !Number.isSafeInteger(maxNativeSamples)||maxNativeSamples<0||maxNativeSamples>2)
  throw TypeError('D40 physical original source radius and native probe budget');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.roster!==15||pack2Asset(62)?.roster!==22||
    pack2Asset(61)?.key!=='ironbound-heartwood-beam'||pack2Asset(62)?.key!=='dovetailed-support-post'||
    JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
    JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D40 original Pack2 ID61/62 collision and source material owner changed');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(building,first,second,d25),
  src=indexD29OriginalRoof(building),pre=[building.cells.length,building.navigation.length,
   building.cells[0],building.cells.at(-1),building.navigation[0]];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius||
    !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved)
  throw Error('D40 original Y7 live:wood and untouched WALK, source nonapproval required');
 const tally={bays:0,roots:0,sourceClearSockets:0,positiveNormalizedTensionRoots:0,
  inheritedVacantY5:0,inheritedVacantY6:0,inheritedSolidNeighborsY5:0,inheritedSolidNeighborsY6:0,
  radius4Y4Y6FullPrismLoops:0,radius4Y3Y6FullPrismLoops:0,
  radius4LowerCourseNewLoops:0,stillNoFiniteThicknessRoute:0,
  originalBackFaceClearSites:0,originalBackFaceBlockedSites:0,
  firstSearchBodyVetoCenters:0,secondSearchBodyVetoCenters:0,
  firstSearchOriginalVetoCenters:0,secondSearchOriginalVetoCenters:0,
  firstSearchSweptEdgeSolidVetoes:0,secondSearchSweptEdgeSolidVetoes:0,
  firstSearchSweptEdgeBodyVetoes:0,secondSearchSweptEdgeBodyVetoes:0,
  firstSearchSweptEdgeSocketVetoes:0,secondSearchSweptEdgeSocketVetoes:0,
  totalSelectedSweptSegments:0,selectedBendElevationChanges:0,
  nativeRayChecks:0,nativeBodyClearProbes:0,nativeBodyOverlapControls:0,
  nativeVoxelSplitParts:0,maxNativeRayDifference:0,
  actualRatedFasteners:0,sourceCellsWritten:0};
 const bins=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
     !rooted(src,row.sourceOriginalStartBearing)||!rooted(src,row.sourceOriginalEndBearing))
   throw Error('D40 unmodified original rooted Y5 Y6 corridor and WALK proof missing');
  const model=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
    [sx,,sz]=row.sourceOriginalStartBearing,
    at=new Map(model.nodes.map(n=>[n.id,[sx+.5+(axis==='x'?n.x:0),n.y,
      sz+.5+(axis==='z'?n.x:0)]])),
    members=model.members.map(member=>({member,shape:member.type==='vertical-web'?
      deriveD31OriginalPack2Vertical(at.get(member.from),at.get(member.to),post.boxes):
      deriveD31OriginalPack2Oblique(at.get(member.from),at.get(member.to),axis,beam.boxes)}));
  let roots=0,lower=0,prisms=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const begin=member.from==='T0',end=member.to===`T${model.panelCount}`;
   if(!begin&&!end)continue;
   const wall=begin?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    selected=inspectD35OriginalSplitWebWallTermination(shape,axis,src,
      {rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!selected?.sourceClear||!(selected.wallCutback>0))
    throw Error('D40 cannot reinterpret uncleared original wall diagonal as source-owned strap');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,{plane:axis,rootAtEnd:end,palette}),
    fitting=probeD36OriginalSocket(socket,src,selected.geometry);
   if(!fitting.sourceClear||fitting.memberPositiveVolumeOverlap||
      members.some(m=>m.member.memberId!==member.memberId&&d36SocketHitsOwner(socket,m.shape)))
    throw Error('D40 original D36 two-interface socket source/member collision');
   const normalized=screenD37OriginalRootTensilePath(socket,member,model,shape),
    rings=inspectD38RootTensionCaptureRoutes(socket,normalized,src),
    base=inspectD40SweptOriginalWallRoute(wall,axis,end,src,
      {radius:4,levels:[4,5,6],halfWidth,socketBounds:socket.bounds}),
    extended=inspectD40SweptOriginalWallRoute(wall,axis,end,src,
      {radius:4,levels:[3,4,5,6],halfWidth,socketBounds:socket.bounds});
   if(!(normalized.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||
      base.constructionAllowed!==false||extended.constructionAllowed!==false||
      base.worldWrites!==0||extended.worldWrites!==0||
      !base.exactSourceWallNeverDrilled||!extended.sourceNavigationAndRoofUnmodified)
    throw Error('D40 source-only complete finite-thickness loop misrepresented as tested anchor');
   const coupon=deriveD39UnregisteredRearFaceWitness(wall,axis,end,palette),
    rear=inspectD39OriginalRearFaceWitness(coupon,src),
    evidence=screenD40RealTensionCaptureEvidence(extended,rear,{actualCapacity:999999});
   if(evidence.constructionAllowed!==false||evidence.actualMechanicalClosingFastenerVerified!==false||
      evidence.ratedOriginalTensionCapacity!==null||evidence.requiredAuthenticatedEvidence.length!==12)
    throw Error('D40 fake capacity, retainer or owner authority accepted');
   roots++;tally.roots++;tally.positiveNormalizedTensionRoots++;tally.sourceClearSockets++;
   const [r5,r6]=rings.sampledCourseRings;
   if(r5.fullFourFaceSourceRingVacant)tally.inheritedVacantY5++;
   if(r6.fullFourFaceSourceRingVacant)tally.inheritedVacantY6++;
   tally.inheritedSolidNeighborsY5+=r5.originalSolidVetoes;
   tally.inheritedSolidNeighborsY6+=r6.originalSolidVetoes;
   if(rear.geometricallySourceClear)tally.originalBackFaceClearSites++;
   else tally.originalBackFaceBlockedSites++;
   if(base.finiteThicknessClosedWindingFound){tally.radius4Y4Y6FullPrismLoops++;prisms++;}
   if(extended.finiteThicknessClosedWindingFound){tally.radius4Y3Y6FullPrismLoops++;lower++;}
   if(!base.finiteThicknessClosedWindingFound&&extended.finiteThicknessClosedWindingFound)
     tally.radius4LowerCourseNewLoops++;
   if(!extended.finiteThicknessClosedWindingFound)tally.stillNoFiniteThicknessRoute++;
   if(base.finiteThicknessClosedWindingFound&&!extended.finiteThicknessClosedWindingFound)
     throw Error('D40 adding the lower course invalidated a previously clear complete physical route');
   tally.firstSearchBodyVetoCenters+=base.centerStandingBodyVetoes;
   tally.secondSearchBodyVetoCenters+=extended.centerStandingBodyVetoes;
   tally.firstSearchOriginalVetoCenters+=base.centerOriginalCellVetoes;
   tally.secondSearchOriginalVetoCenters+=extended.centerOriginalCellVetoes;
   tally.firstSearchSweptEdgeSolidVetoes+=base.edgeOriginalCellVetoes;
   tally.secondSearchSweptEdgeSolidVetoes+=extended.edgeOriginalCellVetoes;
   tally.firstSearchSweptEdgeBodyVetoes+=base.edgeStandingBodyVetoes;
   tally.secondSearchSweptEdgeBodyVetoes+=extended.edgeStandingBodyVetoes;
   tally.firstSearchSweptEdgeSocketVetoes+=base.edgeSocketVetoes;
   tally.secondSearchSweptEdgeSocketVetoes+=extended.edgeSocketVetoes;
   if(extended.witness){
    tally.totalSelectedSweptSegments+=extended.witness.fullPrismSegments;
    tally.selectedBendElevationChanges+=extended.witness.elevationChanges;
    if(extended.witness.projectedWinding===0||!extended.witness.rearCellActuallyVisited)
     throw Error('D40 source-clear 3D prism not a closed wrapping route');
    // Check every physical segment a second time against original-authored voxels.
    for(let i=1;i<extended.witness.path.length;i++){
     const clearance=probeD40ActualStrapSweep(extended.witness.path[i-1],
       extended.witness.path[i],src,{halfWidth,socketBounds:socket.bounds});
     if(!clearance.clearedEntireStraightPhysicalEnvelope)
      throw Error('D40 physically exposed finite-thickness authored original intersection');
    }
   }
   // A genuine source-native selection/body adapter check is sampled narrowly.
   // No object is written or registered. Its section shape spans two cells.
   if(tally.nativeRayChecks<maxNativeSamples){
    const front=end?-1:1,side=axis==='x'?[front,0,0]:[0,0,front],
     a=[wall[0]+4*side[0],6,wall[2]+4*side[2]],b=[a[0]+1,6,a[2]];
    const test=narrowNativeSegment(a,b,palette);
    tally.nativeRayChecks+=test.nativeRayChecks;
    tally.nativeBodyClearProbes+=test.nativeBodyClearProbes;
    tally.nativeBodyOverlapControls+=test.nativeBodyOverlapControls;
    tally.nativeVoxelSplitParts+=test.splitOriginalVoxelShapeParts;
    tally.maxNativeRayDifference=Math.max(tally.maxNativeRayDifference,test.maxNativeRayDifference);
   }
  }
  if(roots!==2)throw Error('D40 exact two original W16/W17 tensile wall endpoints missing');
  tally.bays++;
  bins.push(Object.freeze({axis,originalSpanCells:row.spanCells,rootSites:roots,
   radius4Y4Y6PrismLoops:prisms,radius4ExtendedY3Y6PrismLoops:lower,
   originalWorldWrites:0,constructionAllowed:false}));
 }
 if(tally.bays!==d29.unapprovedLongCandidateSpans||tally.roots!==2*tally.bays||
   tally.sourceClearSockets!==tally.roots||tally.positiveNormalizedTensionRoots!==tally.roots||
   tally.radius4Y3Y6FullPrismLoops+tally.stillNoFiniteThicknessRoute!==tally.roots||
   tally.originalBackFaceClearSites+tally.originalBackFaceBlockedSites!==tally.roots||
   tally.radius4Y4Y6FullPrismLoops>tally.radius4Y3Y6FullPrismLoops||
   pre[0]!==building.cells.length||pre[1]!==building.navigation.length||
   pre[2]!==building.cells[0]||pre[3]!==building.cells.at(-1)||pre[4]!==building.navigation[0])
  throw Error('D40 original source identity, roof, WALK or radius4 bounded-route ledger changed');
 return Object.freeze({format:'mythwrought.builder-d.d40.original-swept-radius-four-nonplacement.v1',
  blueprintId:building.id,originalLiveWoodRoofCells:d29.sourceRoofCells,
  originalDistantRoofCellsStillUncertified:d29.originalFarZoneCellsStillUncertified,
  originalFarZones:d29.originalFarZones,...tally,perBay:Object.freeze(bins),
  originalWallAndFootingNeverAltered:true,originalY7LiveWoodUnchanged:true,
  originalUpperTiersAndAuthoredWALKUnchanged:true,
  sweptPathIsNotOriginalRegisteredConnector:true,
  noAuthoredOwnerApprovedMetalStrap:true,noBackFacePositiveRatedRetention:true,
  actualRoofGravityUpliftAndFatigueUnknown:true,sourceOwnerPhysicalRendererAndUVUnaccepted:true,
  originalPlayerAndNPCLongWalkUnrun:true,realWebGL2AndInstalledIphonePwaUnrun:true,
  globallyImpossibleAnchorNotProven:true,structuralReleaseApproved:false,
  constructionAllowed:false,worldWrites:0,saveWrites:0});
}
