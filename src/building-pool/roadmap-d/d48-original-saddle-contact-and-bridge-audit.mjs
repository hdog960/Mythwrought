// D48 — exact original Wave16/Wave17 authored-source geometry only.
// Count 101 original D47 saddle obstruction witnesses and compare four
// genuinely inset sloped-face alternatives without editing any original roof.
import {pack2Shape,pack2Asset} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical} from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination} from './d35-owner-wall-termination-and-bridge.mjs';
import {deriveD36IndependentRootSocket,probeD36OriginalSocket} from './d36-wall-socket-convex-preview.mjs';
import {screenD37OriginalRootTensilePath} from './d37-wall-pullout-fastener-contract.mjs';
import {inspectD45FractionalExteriorDogleg} from './d45-source-blocker-and-face-egress.mjs';
import {deriveD47UnregisteredCongruentSaddle,auditD47SaddleSourceAndOwnerClearance,d47ConvexPositiveVolumeCollision}
 from './d47-original-congruent-socket-saddle.mjs';
import {deriveD48UnregisteredSlopedContactPatch,inspectD48ExactConvexSourceAndOwnerHits,
 deriveD48UnregisteredSaddleDoglegBridge,inspectD48BridgeContactAndCollisions,
 sampleD48OriginalPaletteTriangleRay} from './d48-original-saddle-patches-and-bridge.mjs';
const R=new Set(['foundation','floor','wall','partition','column','beam']);
const rooted=(src,p)=>p[1]===6&&src.get(p[0],0,p[2])?.role==='foundation'&&
 src.get(p[0],1,p[2])?.role==='floor'&&src.get(p[0],7,p[2])?.asset==='live:wood'&&
 Array.from({length:7},(_,y)=>R.has(src.get(p[0],y,p[2])?.role)).every(Boolean);
export function auditD48AuthenticOriginalContactPatches(b,primary,secondary,d25,{maxMeshSamples=1,maxWitnesses=12}={}){
 if(!Number.isSafeInteger(maxMeshSamples)||maxMeshSamples<0||maxMeshSamples>3||
  !Number.isSafeInteger(maxWitnesses)||maxWitnesses<0||maxWitnesses>32)
  throw TypeError('D48 bounded original source contact evidence budgets');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),palette=pack2Asset(61)?.palette;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
  pack2Asset(61)?.roster!==15||pack2Asset(62)?.key!=='dovetailed-support-post'||
  pack2Asset(62)?.roster!==22||
  JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
  JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D48 immutable genuine original Pack2 ID61/62 shape owner contract');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,primary,secondary,d25),src=indexD29OriginalRoof(b),
  old=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D48 original roof or authored WALK permission drift');
 const totals={bays:0,roots:0,originalD36SourceClear:0,originalTensionRoots:0,
  d47BaselineSourceClear:0,d47BaselineSourceClashes:0,d47BaselineOtherOwnerClashes:0,
  baselineOriginalSolidRoles:{},baselineRelativeSourceHitOffsets:{},
  baselineRootVoxelHits:0,patchAttempts:0,realPositiveAreaPatches:0,
  patchSourceClear:0,rootsWithAnySourceClearPatch:0,previouslyBlockedRootsWithNewClearPatch:0,
  patchAuthoredSolidHits:0,patchWalkHits:0,patchOtherOwnerHits:0,patchSocketPenetrations:0,
  minActualContactArea:Infinity,maxActualContactArea:0,
  bridgeAttempts:0,bridgeAuthoredSolidHits:0,bridgeWalkHits:0,bridgeOtherOwnerHits:0,
  bridgeSocketIntrusions:0,bridgeDoglegPositiveVolumeOverlap:0,
  bridgePositiveOutwardProjection:0,fullyGeometricallyClearSaddleToDoglegProposals:0,
  trueIndependentTensileConnectors:0,authorizedFootings:0,originalWorldWrites:0,
  meshSamples:0,maxMeshTriangleRayDelta:0};
 const witnesses=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
     !rooted(src,row.sourceOriginalStartBearing)||!rooted(src,row.sourceOriginalEndBearing))
   throw Error('D48 original root/Y7 roof/Y2 WALK evidence destroyed');
  const math=solveD30IdealizedUnderslungTruss(row.spanCells),plane=row.clearance.axis,
   [sx,,sz]=row.sourceOriginalStartBearing,
   nodes=new Map(math.nodes.map(n=>[n.id,[sx+.5+(plane==='x'?n.x:0),n.y,
    sz+.5+(plane==='z'?n.x:0)]])),
   members=math.members.map(member=>({member,shape:member.type==='vertical-web'?
    deriveD31OriginalPack2Vertical(nodes.get(member.from),nodes.get(member.to),post.boxes):
    deriveD31OriginalPack2Oblique(nodes.get(member.from),nodes.get(member.to),plane,beam.boxes)}));
  let n=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${math.panelCount}`;
   if(!start&&!end)continue;
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
    chosen=inspectD35OriginalSplitWebWallTermination(shape,plane,src,{rootWall:wall,rootAtEnd:end,maxCells:128}).selected;
   if(!chosen?.sourceClear||chosen.wallCutback<=.2)
    throw Error('D48 genuine D35 cut original-root web missing');
   const socket=deriveD36IndependentRootSocket(chosen.geometry,wall,{plane,rootAtEnd:end,palette}),
    fit=probeD36OriginalSocket(socket,src,chosen.geometry),
    tensile=screenD37OriginalRootTensilePath(socket,member,math,shape);
   if(!fit.sourceClear||fit.memberPositiveVolumeOverlap||
      !(tensile.tensileAxialForcePerUnknownUnitRoofLineLoad>0)||tensile.constructionAllowed!==false)
    throw Error('D48 original positive tensile root or convex D36 physical source veto');
   n++;totals.roots++;totals.originalD36SourceClear++;totals.originalTensionRoots++;
   const nearby=members.filter(m=>m.member.memberId!==member.memberId&&
    m.shape.bounds.min.every((v,j)=>v<socket.bounds.max[j]+2&&
    m.shape.bounds.max[j]>socket.bounds.min[j]-2)).map(m=>m.shape),
    saddle=deriveD47UnregisteredCongruentSaddle(socket,chosen.side,palette),
    baseline=auditD47SaddleSourceAndOwnerClearance(saddle,src,{otherOwners:nearby}),
    exact=inspectD48ExactConvexSourceAndOwnerHits(saddle,src,wall,{otherOwners:nearby});
   if(baseline.authoredSolidClashes!==exact.sourceSolidCount||
      baseline.authoredWalkClashes!==exact.walkCount||
      baseline.otherUninstalledMemberBoxClashes!==exact.otherMemberOBBCount)
    throw Error('D48 independent exact SAT original D47 collision census disagreement');
   totals.d47BaselineSourceClashes+=exact.sourceSolidCount;
   totals.d47BaselineOtherOwnerClashes+=exact.otherMemberOBBCount;
   totals.d47BaselineSourceClear+=Number(exact.sourceAndOwnerClear);
   totals.baselineRootVoxelHits+=Number(exact.rootCellHit);
   for(const hit of exact.blockerCoordinates){
    totals.baselineOriginalSolidRoles[hit.role]=(totals.baselineOriginalSolidRoles[hit.role]??0)+1;
    const delta=hit.relativeToRoot.join(',');
    totals.baselineRelativeSourceHitOffsets[delta]=(totals.baselineRelativeSourceHitOffsets[delta]??0)+1;
    if(witnesses.length<maxWitnesses)witnesses.push({root:[...wall],sourceVoxel:hit.at,role:hit.role,
      originalAsset:hit.asset,relativeToRoot:hit.relativeToRoot,authoredSourceNotModifiable:true});
   }
   let anyClear=false,chosenPatch=null;
   for(const variant of ['center','corner0','corner1','corner2']){
    const patch=deriveD48UnregisteredSlopedContactPatch(saddle,variant,palette),
     hits=inspectD48ExactConvexSourceAndOwnerHits(patch,src,wall,{otherOwners:nearby});
    totals.patchAttempts++;totals.realPositiveAreaPatches+=Number(patch.actualSourceContactArea>.008);
    totals.minActualContactArea=Math.min(totals.minActualContactArea,patch.actualSourceContactArea);
    totals.maxActualContactArea=Math.max(totals.maxActualContactArea,patch.actualSourceContactArea);
    totals.patchAuthoredSolidHits+=hits.sourceSolidCount;totals.patchWalkHits+=hits.walkCount;
    totals.patchOtherOwnerHits+=hits.otherMemberOBBCount;
    totals.patchSourceClear+=Number(hits.sourceAndOwnerClear);
    const penetration=d47ConvexPositiveVolumeCollision(patch,socket);
    if(penetration)throw Error('D48 source-authentic sloped subpatch penetrates original D36 socket');
    totals.patchSocketPenetrations+=Number(penetration);
    if(hits.sourceAndOwnerClear&&!anyClear){anyClear=true;chosenPatch=patch;}
    if(totals.meshSamples<maxMeshSamples){
     const ray=sampleD48OriginalPaletteTriangleRay(patch);totals.meshSamples++;
     totals.maxMeshTriangleRayDelta=Math.max(totals.maxMeshTriangleRayDelta,ray.rayDelta);
    }
   }
   totals.rootsWithAnySourceClearPatch+=Number(anyClear);
   if(anyClear&&!exact.sourceAndOwnerClear)totals.previouslyBlockedRootsWithNewClearPatch++;
   if(!chosenPatch)continue;
   // Only root cases with independently screened positive source-clear area.
   for(const height of [5,6]){
    const dog=inspectD45FractionalExteriorDogleg(wall,plane,end,src,socket.bounds,{side:chosen.side,height});
    if(!dog.allPhysicalVolumesClear)continue;
    const wedge=deriveD48UnregisteredSaddleDoglegBridge(chosenPatch,dog,palette),
     connection=inspectD48BridgeContactAndCollisions(wedge,chosenPatch,dog,socket,src,wall,{otherOwners:nearby});
    totals.bridgeAttempts++;totals.bridgeAuthoredSolidHits+=connection.sourceSolidCount;
    totals.bridgeWalkHits+=connection.walkCount;
    totals.bridgeOtherOwnerHits+=connection.otherMemberOBBCount;
    totals.bridgeSocketIntrusions+=Number(connection.actualD36PositiveVolumeIntrusion);
    totals.bridgeDoglegPositiveVolumeOverlap+=Number(connection.physicalFirstDoglegPositiveVolumeOverlap);
    totals.bridgePositiveOutwardProjection+=Number(wedge.outwardNormalDisplacement>0);
    totals.fullyGeometricallyClearSaddleToDoglegProposals+=Number(connection.geometricBothEndsReachable);
   }
  }
  if(n!==2)throw Error('D48 exact two authentic root diagonals per long bay required');
  totals.bays++;
 }
 if(totals.roots!==2*totals.bays||totals.bays!==d29.unapprovedLongCandidateSpans||
    totals.patchAttempts!==4*totals.roots||totals.originalD36SourceClear!==totals.roots||
    b.cells.length!==old[0]||b.navigation.length!==old[1]||
    b.cells[0]!==old[2]||b.cells.at(-1)!==old[3]||b.navigation[0]!==old[4])
  throw Error('D48 authentic original owner/cell boundary changed');
 return Object.freeze({format:'mythwrought.d48.authentic-original-slope-contact-and-unrated-bridge.v1',
  blueprintId:b.id,originalRoof:d29.sourceRoofCells,stillUncertifiedFarRoof:d29.originalFarZoneCellsStillUncertified,
  originalFarZones:d29.originalFarZones,...totals,exactOriginalBlockerWitnesses:witnesses,
  noOriginalSourceWrites:true,noStructuralCapacitiesOrFasteners:true,
  originalPack2AndAllOtherOwnersUnchanged:true,
  originalAuthorNavigationAndRoofUnchanged:true,
  originalTerrainAndFoundationUnvalidated:true,
  proposedTrussOwnersStillUninstalled:true,
  genuineGamePickingAndInstalledIphonePwaUntested:true,
  roofSupportApproved:false,constructionAllowed:false});
}
