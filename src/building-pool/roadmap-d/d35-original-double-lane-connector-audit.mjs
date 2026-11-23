// D35 genuine W16/W17 original-source evaluation; all derivative geometry
// stays unregistered/unplaced. No world, source ID, settlement, save, or UI IO.
import {pack2Shape,pack2Asset,pack2PreviewMesh} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical,
 d31TransformOriginalPack2Mesh,d31RayOwnerPreview,d31RayPreviewTriangles}
 from './d31-pack2-owner-oblique-preview.mjs';
import {inspectD35OriginalSplitWebWallTermination,inspectD35UnratedLateralMemberPatch,
 probeD35IndependentOriginalPostBridge}
 from './d35-owner-wall-termination-and-bridge.mjs';
const ROOT=new Set(['foundation','floor','wall','column','partition','beam']);
const rooted=(get,p)=>p[1]===6&&get(p[0],0,p[2])?.role==='foundation'&&
 get(p[0],1,p[2])?.role==='floor'&&
 Array.from({length:7},(_,y)=>ROOT.has(get(p[0],y,p[2])?.role)).every(Boolean);
const K=(x,y,z)=>`${x},${y},${z}`;
/** One original author building; genuine source ledger and independently sourced
 * Pack2 owners. This cannot rate or register a connector. */
export function auditD35OriginalTwoSideRoofDiagonalTerminations(b,p,s,d25,{
 maxMeshSamples=1,maxBridgeSamples=4,maxSourceCells=128
}={}){
 if(!Number.isSafeInteger(maxMeshSamples)||maxMeshSamples<0||maxMeshSamples>2||
    !Number.isSafeInteger(maxBridgeSamples)||maxBridgeSamples<0||maxBridgeSamples>8||
    !Number.isSafeInteger(maxSourceCells)||maxSourceCells<32||maxSourceCells>256)
  throw RangeError('D35 original-source physical review budgets');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),visual=maxMeshSamples?pack2PreviewMesh(61,0):null;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.roster!==15||pack2Asset(62)?.roster!==22||
    pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
    pack2Asset(62)?.key!=='dovetailed-support-post'||
    JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
    JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes)||
    (visual&&(visual.triangles!==156||visual.candidateOnly!==true)))
  throw Error('D35 original Pack2 source-owned timber/post or colored 156-triangle mesh drift');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,d25),src=indexD29OriginalRoof(b),
  before={cells:b.cells.length,nav:b.navigation.length,first:b.cells[0],last:b.cells.at(-1),firstNav:b.navigation[0]};
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    !d29.allOriginalY7WoodPreserved||!d29.allOriginalAuthorNavigationPreserved||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D35 genuine unchanged roof, WALK and original non-approval provenance');
 const totals={longBays:0,members:0,diagonalWebs:0,pins:0,originalUnmodifiedPlusCellEvents:0,
  originalPlusCollisionWebs:0,originalPlusRootWebSourceEvents:0,
  geometricallySourceClearDiagonalWebs:0,sourceBlockedBothSides:0,
  selectedPlusSide:0,selectedMinusSide:0,
  rootIncidentWebs:0,rootTerminationSourceClear:0,rootTerminationStillBlocked:0,
  sourceClearAfterWallCutback:0,sourceClearWithoutWallCutback:0,
  sourceClearYetMissingTwoContactPatches:0,sourceClearWithTwoContactPatches:0,
  geometricallyObservedFacePairs:0,summedUnratedLateralArea:0,
  upperRoofSourceClashesAfterSelection:0,authoredWalkBodyClashesAfterSelection:0,
  independentPostBridgeStudies:0,independentPostBridgeGeometryPass:0,
  originalOwnerColoredMeshSamples:0,maxOriginalOwnerRayVsMeshDelta:0,
  endCapMeshUnimplementedSamples:0,originalCellsModified:0};
 const perSpan=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
     !rooted(src.get,row.sourceOriginalStartBearing)||!rooted(src.get,row.sourceOriginalEndBearing))
   throw Error('D35 original source Y5 Y6 WALK or rooted-wall provenance lost');
  const solver=solveD30IdealizedUnderslungTruss(row.spanCells),axis=row.clearance.axis,
    [sx,,sz]=row.sourceOriginalStartBearing,
    nodes=new Map(solver.nodes.map(n=>[n.id,[sx+.5+(axis==='x'?n.x:0),n.y,
      sz+.5+(axis==='z'?n.x:0)]])),
    members=solver.members.map(m=>({member:m,shape:m.type==='vertical-web'?
      deriveD31OriginalPack2Vertical(nodes.get(m.from),nodes.get(m.to),post.boxes):
      deriveD31OriginalPack2Oblique(nodes.get(m.from),nodes.get(m.to),axis,beam.boxes)}));
  let clear=0,blocked=0,rootClear=0,rootBlocked=0,contactBoth=0;
  for(const {member,shape} of members){
   if(member.type!=='diagonal-web')continue;
   const start=member.from==='T0',end=member.to===`T${solver.panelCount}`;
   if(start&&end)throw Error('D35 source diagonal cannot have two original wall roots');
   const wall=start?row.sourceOriginalStartBearing:end?row.sourceOriginalEndBearing:null,
    r=inspectD35OriginalSplitWebWallTermination(shape,axis,src,{
      rootWall:wall,rootAtEnd:end,maxCells:maxSourceCells});
   if(r.constructionAllowed!==false||r.physicalRatedWallTransfer!==false||
      r.noOriginalCellsTouched!==true||r.trials.length!==2)
    throw Error('D35 clearance cannot certify real original wall transfer or Pack2 world edit');
   const originalPlus=r.trials.find(t=>t.side===1);
   totals.originalUnmodifiedPlusCellEvents+=originalPlus.pretrimSourceHits.total;
   if(originalPlus.pretrimSourceHits.total){
    totals.originalPlusCollisionWebs++;
    // Exact D34 original-root classification, not an inferred posttrim success.
    if(wall)totals.originalPlusRootWebSourceEvents+=originalPlus.pretrimSourceHits.total;
   }
   totals.diagonalWebs++;
   if(wall)totals.rootIncidentWebs++;
   if(!r.selected){totals.sourceBlockedBothSides++;blocked++;
    if(wall){totals.rootTerminationStillBlocked++;rootBlocked++;}
    continue;
   }
   const selected=r.selected;
   totals.geometricallySourceClearDiagonalWebs++;clear++;
   if(selected.side===1)totals.selectedPlusSide++;else totals.selectedMinusSide++;
   if(wall){totals.rootTerminationSourceClear++;rootClear++;}
   if(selected.wallCutback>0){totals.sourceClearAfterWallCutback++;totals.endCapMeshUnimplementedSamples++;}
   else totals.sourceClearWithoutWallCutback++;
   if(selected.posttrimSourceHits.total!==0||!selected.sourceClear||selected.originalWalkProbeClashes!==0)
    throw Error('D35 selected owner still intrudes actual original authored cell or WALK');
   totals.upperRoofSourceClashesAfterSelection+=selected.posttrimSourceHits.roofAndUpper;
   totals.authoredWalkBodyClashesAfterSelection+=selected.originalWalkProbeClashes;
   let contactingEnds=0;
   for(const nodeId of [member.from,member.to]){
    const touching=members.filter(x=>
       ['top-chord','bottom-chord'].includes(x.member.type)&&
       (x.member.from===nodeId||x.member.to===nodeId));
    const matching=touching.map(x=>inspectD35UnratedLateralMemberPatch(selected.geometry,x.shape,axis));
    for(const c of matching){if(c.memberPositiveVolumeOverlap||c.constructionAllowed!==false)
      throw Error('D35 lateral face contact falsely treated as certified bolted connection');
     totals.geometricallyObservedFacePairs+=c.facePairs;
     totals.summedUnratedLateralArea+=c.summedUnratedSourceFaceArea;}
    if(matching.some(x=>x.hasGeometricTouchingFace))contactingEnds++;
   }
   if(contactingEnds===2){totals.sourceClearWithTwoContactPatches++;contactBoth++;}
   else totals.sourceClearYetMissingTwoContactPatches++;
   // Explicitly test independent genuine ID62 post against both REQUIRED faces
   // for a bounded subset. D33 one-face clearance does not suffice.
   if(totals.independentPostBridgeStudies<maxBridgeSamples){
    const first=[member.from,member.to].find(id=>members.some(x=>x.member.type==='top-chord'&&
       (x.member.from===id||x.member.to===id)));
    const chord=members.find(x=>x.member.type==='top-chord'&&
      (x.member.from===first||x.member.to===first));
    if(chord){
     const witness=probeD35IndependentOriginalPostBridge(nodes.get(first),axis,selected.side,
       post.boxes,chord.shape,selected.geometry,src,{maxCells:maxSourceCells});
     totals.independentPostBridgeStudies++;
     if(witness.geometricallyPossibleSourcePostBridge)totals.independentPostBridgeGeometryPass++;
     if(witness.constructionAllowed!==false||witness.anyRatedJoint!==false)
      throw Error('D35 unowned original wood post falsely certified as a fastener');
    }
   }
   if(totals.originalOwnerColoredMeshSamples<maxMeshSamples){
    const original=selected.ownerPretrim,
     converted=d31TransformOriginalPack2Mesh(original,visual),
     mid=original.start.map((v,i)=>(v+original.end[i])/2),
     norm=original.ownerOBBs[0].axes[2],ray=mid.map((v,i)=>v+norm[i]*2),dir=norm.map(v=>-v),
     physical=d31RayOwnerPreview(original,ray,dir,4),
     triangles=d31RayPreviewTriangles(converted,ray,dir,4);
    if(physical===null||triangles===null||Math.abs(physical-triangles)>.004)
     throw Error('D35 uncut original owner RGB mesh versus collider selection drift');
    totals.originalOwnerColoredMeshSamples++;
    totals.maxOriginalOwnerRayVsMeshDelta=Math.max(totals.maxOriginalOwnerRayVsMeshDelta,
      Math.abs(physical-triangles));
   }
  }
  totals.longBays++;totals.members+=members.length;totals.pins+=solver.nodes.length;
  perSpan.push(Object.freeze({axis,spanCells:row.spanCells,diagonalSourceClear:clear,
   diagonalSourceBlocked:blocked,rootSourceClear:rootClear,rootBlocked,
   bothPositiveContactEndsUnrated:contactBoth,constructionApproved:false}));
 }
 if(b.cells.length!==before.cells||b.navigation.length!==before.nav||
    b.cells[0]!==before.first||b.cells.at(-1)!==before.last||b.navigation[0]!==before.firstNav||
    totals.longBays!==d29.unapprovedLongCandidateSpans||
    totals.geometricallySourceClearDiagonalWebs+totals.sourceBlockedBothSides!==totals.diagonalWebs||
    totals.selectedPlusSide+totals.selectedMinusSide!==totals.geometricallySourceClearDiagonalWebs||
    totals.rootTerminationSourceClear+totals.rootTerminationStillBlocked!==totals.rootIncidentWebs)
  throw Error('D35 original source changed or side selection accounting became inconsistent');
 return Object.freeze({format:'mythwrought.builder-d.d35.original-source-dual-offset-load-veto.v1',
  blueprintId:b.id,originalLiveWoodRoofCells:d29.sourceRoofCells,
  originalDistantRoofCellsStillUncertified:d29.originalFarZoneCellsStillUncertified,
  originalUncertifiedFarZones:d29.originalFarZones,...totals,perSpan:Object.freeze(perSpan),
  originalSourcePack2OwnerShapesUnchanged:true,allAuthoredWALKUnmodified:true,
  originalY7WoodAndY8Y9TiersUnchanged:true,
  originalRootFoundationsAndWallsUnmodified:true,
  sourceClearIsNotIndependentRatedConnector:true,
  twoTouchingFacesWithoutFastenersCannotCarryRatedLoad:true,
  independentSourceId62PostDidNotGainFastenerRatings:true,
  sourceColoredDerivedMemberEndCapsUnauthored:true,
  noActualPhysicalPlayerNPCOrProductionRayAcceptance:true,
  noNumericMaterialTensionCompressionOrBucklingRatings:true,
  noTestedWallSeatRoofTributaryUpliftOrLateralBracing:true,
  structuralRoofCertificationAccepted:false,constructionAllowed:false,
  originalWorldCellsWritten:0,originalSaveWrites:0,
  webgl2NotRun:true,installedIphonePwaNotRun:true});
}
