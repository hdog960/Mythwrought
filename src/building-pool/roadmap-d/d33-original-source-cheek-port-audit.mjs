// MYTHWROUGHT D33: isolated source-authentic W16/W17 *nonconstruction* audit.
// A one-cell ID62 post is only a source-owned candidate cheek, NEVER a rated
// structural pin. Explicitly measure all collisions and missing connection
// strength. No original cells, Pack2 owners, IDs, game/renderer, saves edited.
import {pack2Shape,pack2Asset,pack2PreviewMesh} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance}
 from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical}
 from './d31-pack2-owner-oblique-preview.mjs';
import {auditD33ClearanceOnlyPinPort,sampleD33OriginalOwnerMeshAndRay}
 from './d33-owner-cheek-pin-geometry.mjs';
const K=p=>p.join(',');
const ROOT_ROLES=new Set(['foundation','floor','wall','column','partition','beam']);
const root=(get,p)=>p[1]===6&&get(p[0],0,p[2])?.role==='foundation'&&
 get(p[0],1,p[2])?.role==='floor'&&
 Array.from({length:7},(_,y)=>ROOT_ROLES.has(get(p[0],y,p[2])?.role)).every(Boolean);
export function auditD33OriginalSourceOutboardCheeks(b,primary,secondary,d25,{
 offset=.7,cutback=.45,maxMeshSamples=1
}={}){
 if(!Number.isSafeInteger(maxMeshSamples)||maxMeshSamples<0||maxMeshSamples>4)
  throw RangeError('D33 source mesh sampling budget');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),visual=maxMeshSamples?pack2PreviewMesh(62,0):null;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
    pack2Asset(62)?.key!=='dovetailed-support-post'||
    pack2Asset(62)?.roster!==22||post.boxes.length!==3||
    JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
    JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
  throw Error('D33 original registered Pack2 source owner not authentic');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,primary,secondary,d25),
  src=indexD29OriginalRoof(b),pre={cells:b.cells.length,nav:b.navigation.length,
    first:b.cells[0],last:b.cells.at(-1),firstNav:b.navigation[0]};
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    d29.allOriginalY7WoodPreserved!==true||d29.allOriginalAuthorNavigationPreserved!==true||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius||
    d29.originalFarZones!==d25.unresolvedRoofZoneCount)
  throw Error('D33 original source load-path or unchanged navigation certification drift');
 const counts={buildings:1,originalLiveWoodRoofCells:d29.sourceRoofCells,
  originalDistantRoofCellsUncertified:d29.originalFarZoneCellsStillUncertified,
  originalFarZones:d29.originalFarZones,longBays:0,idealMembers:0,sourcePinNodes:0,
  rootedWallPinNodes:0,interiorPinNodes:0,sourceOwnedOriginalPostCheeks:0,
  originalMemberOverlapPairs:0,remainingOverlapPairsAfterD33Cutback:0,
  postToMemberCollisions:0,postToAuthoredSourceCollisions:0,
  interiorPinsWithClearCheekAndMemberEnvelopes:0,rootedWallPinsRejected:0,
  geometricallyRejectedInteriorPins:0,sourceOwnerMeshesSampled:0,
  previewBytes:0,maxMeshColliderRayDisagreement:0,worldCellsModified:0};
 const perSpan=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5InteriorObstructedCells!==0||
     corridor.originalY5Y6OverheadWalkConflicts!==0||row.clearance.realRootedOriginalEndpoints!==2||
     !root(src.get,row.sourceOriginalStartBearing)||!root(src.get,row.sourceOriginalEndBearing))
   throw Error('D33 original wall, roof Y7, WALK or Y5–Y6 source route veto');
  const solve=solveD30IdealizedUnderslungTruss(row.spanCells),
   [sx,,sz]=row.sourceOriginalStartBearing,axis=row.clearance.axis,
   points=new Map(solve.nodes.map(v=>[v.id,[sx+.5+(axis==='x'?v.x:0),v.y,sz+.5+(axis==='z'?v.x:0)]])),
   members=solve.members.map(m=>({member:m,shape:m.type==='vertical-web'?
      deriveD31OriginalPack2Vertical(points.get(m.from),points.get(m.to),post.boxes):
      deriveD31OriginalPack2Oblique(points.get(m.from),points.get(m.to),axis,beam.boxes)}));
  let clear=0,rooted=0,postHits=0,residual=0,sourceHits=0;
  for(const node of solve.nodes){
   const at=points.get(node.id),isRoot=node.id==='T0'||node.id===`T${solve.panelCount}`;
   const incident=members.filter(m=>m.member.from===node.id||m.member.to===node.id);
   const check=auditD33ClearanceOnlyPinPort({id:node.id,worldAt:at},incident,post.boxes,
      {plane:axis,offset,cutback,sourceCell:src.get});
   if(check.actualJoinedConstructionApproved!==false||check.noPositiveAreaRatedJointTransfer!==true||
      check.authenticPostShapeDerivedWithoutRecolor!==true)
    throw Error('D33 original source ID62 cheek mistaken for installed or rated pin');
   counts.sourcePinNodes++;counts.sourceOwnedOriginalPostCheeks+=2;
   counts.originalMemberOverlapPairs+=check.originalSourceOwnerOverlappingPairs;
   counts.remainingOverlapPairsAfterD33Cutback+=check.remainingMemberIntersections;
   counts.postToMemberCollisions+=check.ownerPostToMemberIntersections;
   counts.postToAuthoredSourceCollisions+=check.originalAuthoredCellIntersections;
   postHits+=check.ownerPostToMemberIntersections;residual+=check.remainingMemberIntersections;
   sourceHits+=check.originalAuthoredCellIntersections;
   if(isRoot){counts.rootedWallPinNodes++;counts.rootedWallPinsRejected++;rooted++;}
   else {counts.interiorPinNodes++;
    if(check.freeOutboardCheekEnvelope){counts.interiorPinsWithClearCheekAndMemberEnvelopes++;clear++;}
    else counts.geometricallyRejectedInteriorPins++;
   }
   if(!isRoot&&counts.sourceOwnerMeshesSampled<maxMeshSamples){
    const sample=sampleD33OriginalOwnerMeshAndRay(check.bothCandidateCheeks[0],visual);
    counts.sourceOwnerMeshesSampled++;counts.previewBytes+=sample.previewBytes;
    counts.maxMeshColliderRayDisagreement=Math.max(counts.maxMeshColliderRayDisagreement,sample.rayDelta);
   }
  }
  counts.longBays++;counts.idealMembers+=members.length;
  perSpan.push(Object.freeze({axis,spanCells:row.spanCells,sourceMembers:members.length,
    sourcePinNodes:solve.nodes.length,sourceRootPinNodes:rooted,
    interiorClearSourceOnlyCheekEnvelopes:clear,
    originalPostToMemberClashes:postHits,
    originalPostToAuthoredCellClashes:sourceHits,
    remainingMemberOverlapPairs:residual,realPinInstalled:false}));
 }
 if(counts.longBays!==d29.unapprovedLongCandidateSpans||
  counts.sourcePinNodes!==counts.interiorPinNodes+counts.rootedWallPinNodes||
  counts.originalMemberOverlapPairs<counts.remainingOverlapPairsAfterD33Cutback||
  counts.interiorPinNodes!==counts.interiorPinsWithClearCheekAndMemberEnvelopes+
   counts.geometricallyRejectedInteriorPins||
  b.cells.length!==pre.cells||b.navigation.length!==pre.nav||b.cells[0]!==pre.first||
  b.cells.at(-1)!==pre.last||b.navigation[0]!==pre.firstNav)
  throw Error('D33 original W16/W17 owner/collision budget or cell immutability failed');
 return Object.freeze({format:'mythwrought.builder-d.d33.original-unregistered-id62-cheek-geometry.v1',
  blueprintId:b.id,...counts,perSpan:Object.freeze(perSpan),
  originalSourceWoodRoofUnchanged:true,originalUpperTierUnchanged:true,originalWalkingRouteUnchanged:true,
  exactOriginalPack2Id61And62OwnersUnchanged:true,originalSourceOwnerPaletteUnmodified:true,
  experimentalEndTrimmingNotRegistered:true,allWallRootConnectionsStillUnrated:true,
  outboardSourcePostNoProvenPositiveAreaAxialTransfer:true,
  zeroColliderOverlapCannotServeAsTestedPhysicalSocket:true,
  actualFastenerAndEndCapMeshMissing:true,sourcePostActualWorldGridPlacementUnverified:true,
  actualPlayerAABBAndProductionRaycastNotAccepted:true,
  actualMemberStressRatingsAndFoundationReactionsUnverified:true,
  allOriginalD4ComparisonsProtected:true,allOriginal285SourceIdsPreserved:true,
  structuralReleaseAccepted:false,constructionAllowed:false,
  webgl2Approved:false,installedIphonePwaApproved:false,savesWritten:0});
}
