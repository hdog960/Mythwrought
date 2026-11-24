// D47 genuine original W16/W17 built-source reader. Unregistered diagnostic
// ONLY: no socket/coupler approval, new Pack2 ID, wall mutation or terrain IO.
import {pack2Shape,pack2Asset} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical}
 from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination} from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket}
 from './d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath} from './d37-wall-pullout-fastener-contract.mjs';
import {inspectD45FractionalExteriorDogleg} from './d45-source-blocker-and-face-egress.mjs';
import {inspectD46FractionalExitToOutboard,listD46OriginalUnprovenOutboardFootprints}
 from './d46-socket-to-fractional-tie-contract.mjs';
import {deriveD47UnregisteredCongruentSaddle,auditD47SaddleSourceAndOwnerClearance,
 sampleD47SaddleTriangleParity,inspectD47FirstFractionalVoxelBarrier}
 from './d47-original-congruent-socket-saddle.mjs';
const R=new Set(['foundation','floor','wall','partition','column','beam']);
function rooted(src,p){return p[1]===6&&src.get(p[0],0,p[2])?.role==='foundation'&&
 src.get(p[0],1,p[2])?.role==='floor'&&src.get(p[0],7,p[2])?.asset==='live:wood'&&
 Array.from({length:7},(_,y)=>R.has(src.get(p[0],y,p[2])?.role)).every(Boolean);}
export function auditD47OriginalSlopedSocketsAndFractionalBarrier(b,p,s,d25,{
 maxCandidates=12,maxMeshSamples=1,maxWitnesses=5
}={}){
 if(!Number.isSafeInteger(maxCandidates)||maxCandidates<1||maxCandidates>12||
    !Number.isSafeInteger(maxMeshSamples)||maxMeshSamples<0||maxMeshSamples>3||
    !Number.isSafeInteger(maxWitnesses)||maxWitnesses<0||maxWitnesses>16)
  throw TypeError('D47 bounded original-source engineering proof budgets');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
  pack2Asset(61)?.roster!==15||pack2Asset(62)?.key!=='dovetailed-support-post'||
  pack2Asset(62)?.roster!==22||
  JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
  JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D47 authentic original Pack2 ID61/62 source-owner fingerprint drift');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,d25),src=indexD29OriginalRoof(b),
  old=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D47 changed real original roof, WALK or author-source structural approval');
 const counts={bays:0,roots:0,originalPositiveTensionRoots:0,originalD36SourceClear:0,
  sourceAuthenticSaddleProposals:0,sourceSaddlesWithRealPositiveArea:0,
  summedUnratedActualSocketFaceArea:0,minSocketFaceArea:Infinity,maxSocketFaceArea:0,
  saddleVsSocketPositiveVolumeOverlap:0,saddleAuthoredSolidClashes:0,
  saddleAuthoredWalkingBodyClashes:0,saddleOtherTheoreticalOwnerClashes:0,
  sourceAndTheoreticalOwnersClearSaddles:0,
  genuinePaletteMeshSamples:0,maxActualTriangleVsAnalyticRayDelta:0,
  checkedHypotheticalFootprints:0,fractionalOutboardRoutePairs:0,
  fractionalExtensionOrders:0,ordersWithAnyOriginalSolid:0,
  originalSourceFirstVoxelWitnesses:0,firstVoxelWallRoles:0,firstVoxelOtherRoles:0,
  firstBarriersOnFirstExtensionSegment:0,firstBarriersOnLastExtensionSegment:0,
  firstBarriersOnMiddleExtensionSegment:0,minNonzeroFirstEntryFraction:Infinity,
  maxFirstEntryFraction:0,sourceAndWalkingClearExtensionPairs:0,
  mechanicalTensileFastenersApproved:0,actualIndependentFootingsRated:0,
  registeredPack2FastenerIdsAdded:0,authoredSourceWrites:0};
 const witnesses=[];
 for(const row of d29.proposedOriginalLongBays){
  const sourceCorridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!sourceCorridor.exactOriginalY5Y6CourseFree||sourceCorridor.originalY5Y6OverheadWalkConflicts!==0||
     !rooted(src,row.sourceOriginalStartBearing)||!rooted(src,row.sourceOriginalEndBearing))
   throw Error('D47 original rooted Y0/1/5/6 and Y7 source roof corridor veto');
  const math=solveD30IdealizedUnderslungTruss(row.spanCells),plane=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   nodes=new Map(math.nodes.map(n=>[n.id,[sx+.5+(plane==='x'?n.x:0),n.y,sz+.5+(plane==='z'?n.x:0)]])),
   members=math.members.map(member=>({member,shape:member.type==='vertical-web'?
     deriveD31OriginalPack2Vertical(nodes.get(member.from),nodes.get(member.to),post.boxes):
     deriveD31OriginalPack2Oblique(nodes.get(member.from),nodes.get(member.to),plane,beam.boxes)}));
  let sourceRoots=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${math.panelCount}`;
   if(!start&&!end)continue;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    selected=inspectD35OriginalSplitWebWallTermination(shape,plane,src,
     {rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!selected?.sourceClear||selected.wallCutback<=.2)throw Error('D47 original source root diagonal was not D35 wall-cut source-clear');
   const socket=deriveD36IndependentRootSocket(selected.geometry,wall,{plane,rootAtEnd:end,palette}),
    fits=probeD36OriginalSocket(socket,src,selected.geometry),
    forces=screenD37OriginalRootTensilePath(socket,member,math,shape);
   if(!fits.sourceClear||fits.memberPositiveVolumeOverlap||
      !(forces.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||forces.constructionAllowed!==false)
    throw Error('D47 exact D36 convex socket source or original D37 positive tensile force regressed');
   sourceRoots++;counts.roots++;counts.originalPositiveTensionRoots++;counts.originalD36SourceClear++;
   const saddle=deriveD47UnregisteredCongruentSaddle(socket,selected.side,palette),
    nearby=members.filter(m=>m.member.memberId!==member.memberId&&
     m.shape.bounds.min.every((v,j)=>v<socket.bounds.max[j]+2&&
       m.shape.bounds.max[j]>socket.bounds.min[j]-2)).map(m=>m.shape),
    clear=auditD47SaddleSourceAndOwnerClearance(saddle,src,{otherOwners:nearby});
   counts.sourceAuthenticSaddleProposals++;
   counts.sourceSaddlesWithRealPositiveArea+=Number(saddle.actualSocketContactArea>0);
   counts.summedUnratedActualSocketFaceArea+=saddle.actualSocketContactArea;
   counts.minSocketFaceArea=Math.min(counts.minSocketFaceArea,saddle.actualSocketContactArea);
   counts.maxSocketFaceArea=Math.max(counts.maxSocketFaceArea,saddle.actualSocketContactArea);
   counts.saddleVsSocketPositiveVolumeOverlap+=Number(saddle.genuineSocketPositiveVolumeOverlap);
   counts.saddleAuthoredSolidClashes+=clear.authoredSolidClashes;
   counts.saddleAuthoredWalkingBodyClashes+=clear.authoredWalkClashes;
   counts.saddleOtherTheoreticalOwnerClashes+=clear.otherUninstalledMemberBoxClashes;
   counts.sourceAndTheoreticalOwnersClearSaddles+=Number(clear.geometricallyClearOfSourceAndOtherOwners);
   if(counts.genuinePaletteMeshSamples<maxMeshSamples){
    const sample=sampleD47SaddleTriangleParity(saddle);counts.genuinePaletteMeshSamples++;
    counts.maxActualTriangleVsAnalyticRayDelta=Math.max(counts.maxActualTriangleVsAnalyticRayDelta,sample.rayDelta);
   }
   const sites=listD46OriginalUnprovenOutboardFootprints(wall,plane,end,src,socket,{limit:maxCandidates});
   counts.checkedHypotheticalFootprints+=sites.prospectiveSites.length;
   for(const height of [5,6]){
    const dog=inspectD45FractionalExteriorDogleg(wall,plane,end,src,socket.bounds,{side:selected.side,height});
    if(!dog.allPhysicalVolumesClear)continue;
    for(const site of sites.prospectiveSites){
     const route=inspectD46FractionalExitToOutboard(dog,site.at,src,{socket,otherOwners:nearby});
     counts.fractionalOutboardRoutePairs++;
     counts.sourceAndWalkingClearExtensionPairs+=Number(route.approaches.some(a=>a.fullExtensionSourceAndBodyClear));
     for(const approach of route.approaches){
      if(approach.points.length<2)continue;
      const first=inspectD47FirstFractionalVoxelBarrier(approach,src);
      counts.fractionalExtensionOrders++;
      if(approach.sourceSolidIntersections>0)counts.ordersWithAnyOriginalSolid++;
      if(!first.firstOriginalVoxel)continue;
      const w=first.firstOriginalVoxel;
      counts.originalSourceFirstVoxelWitnesses++;
      if(w.role==='wall')counts.firstVoxelWallRoles++;else counts.firstVoxelOtherRoles++;
      if(w.segmentPosition==='first-extension-segment')counts.firstBarriersOnFirstExtensionSegment++;
      else if(w.segmentPosition==='last-extension-segment')counts.firstBarriersOnLastExtensionSegment++;
      else counts.firstBarriersOnMiddleExtensionSegment++;
      if(w.fraction>0)counts.minNonzeroFirstEntryFraction=Math.min(counts.minNonzeroFirstEntryFraction,w.fraction);
      counts.maxFirstEntryFraction=Math.max(counts.maxFirstEntryFraction,w.fraction);
      if(witnesses.length<maxWitnesses)witnesses.push(Object.freeze({wall:Object.freeze([...wall]),
       candidateFootprint:Object.freeze([...site.at]),height,routeOrder:approach.order,
       firstBlockingSourceCell:w.at,sourceRole:w.role,segmentIndex:w.segmentIndex,
       sweptSegmentEntryFraction:w.fraction,sourceCellNotAuthorizedForEdit:true}));
     }
    }
   }
  }
  if(sourceRoots!==2)throw Error('D47 original D30 long bay must include exactly two source tensile wall roots');
  counts.bays++;
 }
 if(counts.roots!==counts.bays*2||counts.bays!==d29.unapprovedLongCandidateSpans||
    counts.sourceAuthenticSaddleProposals!==counts.roots||
    counts.originalSourceFirstVoxelWitnesses>counts.fractionalExtensionOrders||
    counts.saddleVsSocketPositiveVolumeOverlap!==0||
    b.cells.length!==old[0]||b.navigation.length!==old[1]||
    b.cells[0]!==old[2]||b.cells.at(-1)!==old[3]||b.navigation[0]!==old[4])
  throw Error('D47 authentic original rooftop, read-only source or strict convex contact invariant failed');
 return Object.freeze({format:'mythwrought.d47.original-source-genuine-sloped-face-and-first-voxel.v1',
  blueprintId:b.id,originalWoodRoof:d29.sourceRoofCells,
  stillUncertifiedFarRoof:d29.originalFarZoneCellsStillUncertified,
  originalFarZones:d29.originalFarZones,...counts,
  originalPack2Id61AndId62RegistryUnchanged:true,
  authoredNavigationAndRoofUnmodified:true,independentFastenerMaterialUnapproved:true,
  positiveFaceAreaDoesNotEstablishMechanicalRetention:true,
  hypotheticalFootingsNotGeneratedTerrainOrCaveVerified:true,
  originalD36SocketMeshAndOwnerUnmodified:true,
  originalWorldWrites:0,originalSaveWrites:0,
  realPhysicalGameWebGL2AndInstalledPwaUntested:true,
  ratedStructuralAcceptance:false,constructionAllowed:false,
  firstVoxelWitnesses:Object.freeze(witnesses)});
}
