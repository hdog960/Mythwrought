// Builder D34: source-only 16-building geometry discriminator, never placement.
// D33 1226 residual same-plane overlaps require true load-bearing connectors;
// a lateral-separated source owner is not an approved Pack2 timber variant.
import {pack2Asset,pack2Shape,pack2PreviewMesh} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical,
 d31RayOwnerPreview,d31TransformOriginalPack2Mesh,d31RayPreviewTriangles,d31PreviewHitsAABB}
 from './d31-pack2-owner-oblique-preview.mjs';
import {deriveD34LateralOriginalWeb,auditD34PinSplitPlane,d34ProbeSourceCellIntersections}
 from './d34-owner-lateral-pin-interface.mjs';
const K=(x,y,z)=>`${x},${y},${z}`;
const ROOT=new Set(['foundation','floor','wall','column','partition','beam']);
const grounded=(src,p)=>p[1]===6&&src.get(p[0],0,p[2])?.role==='foundation'&&
 src.get(p[0],1,p[2])?.role==='floor'&&
 Array.from({length:7},(_,y)=>ROOT.has(src.get(p[0],y,p[2])?.role)).every(Boolean);
const bounds=(a)=>a.bounds;
/** Unplaced original W16/W17 data only, no runtime sidecar or new registry ID. */
export function auditD34OriginalParallelPlaneWebs(b,p,s,d25,{offset=.6,cutback=.45,maxMeshSamples=1}={}){
 if(!Number.isFinite(offset)||offset<.6||offset>.9||
    !Number.isFinite(cutback)||cutback<0||cutback>.45||
    !Number.isSafeInteger(maxMeshSamples)||maxMeshSamples<0||maxMeshSamples>4)
  throw TypeError('D34 explicit unregistered offset, clip or mesh budget');
 const beam=pack2Shape(61,0),post=pack2Shape(62,0),mesh=maxMeshSamples?pack2PreviewMesh(61,0):null;
 if(BLOCK.WOOD!==4||pack2Asset(61)?.key!=='ironbound-heartwood-beam'||
    pack2Asset(62)?.key!=='dovetailed-support-post'||
    JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
    JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes)||
    (mesh&&(mesh.triangles!==156||mesh.candidateOnly!==true)))
  throw Error('D34 original Pack2 physical and color geometry owner drift');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,d25),src=indexD29OriginalRoof(b),
  before={cells:b.cells.length,first:b.cells[0],last:b.cells.at(-1),nav:b.navigation.length,firstNav:b.navigation[0]};
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    d29.allOriginalY7WoodPreserved!==true||d29.allOriginalAuthorNavigationPreserved!==true||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D34 original W16/W17 source authority or load veto changed');
 const counts={longBays:0,originalSourceMembers:0,originalDiagonalWebs:0,sourcePinNodes:0,
  originalD33SamePlanePairs:0,originalD34SplitPlanePairs:0,
  samePlaneDiagonalTopChordPairs:0,samePlaneDiagonalBottomChordPairs:0,
  crossPlaneUnratedSurfaceFacePairs:0,crossPlaneGeometricFaceArea:0,
  newlyShiftedWebOriginalCellCollisions:0,shiftedWebRoofOrUpperTierCollisions:0,
  shiftedWebOriginalRootedWallClashes:0,shiftedWebWalkEnvelopeCollisions:0,
  zeroSourceCellClashDiagonalWebs:0,shiftedWebsWithCellClashes:0,
  originalColoredMeshSamples:0,maxSourceMeshRayVsColliderDelta:0,
  realMaterialPinOrBracingRated:0,worldCellChanges:0};
 const perSpan=[];let sampled=0;
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5Y6OverheadWalkConflicts!==0||
     !grounded(src,row.sourceOriginalStartBearing)||!grounded(src,row.sourceOriginalEndBearing))
   throw Error('D34 actual unmodified source Y5/Y6/rooted bearing corridor lost');
  const statics=solveD30IdealizedUnderslungTruss(row.spanCells),
   [sx,,sz]=row.sourceOriginalStartBearing,axis=row.clearance.axis,
   coords=new Map(statics.nodes.map(n=>[n.id,[sx+.5+(axis==='x'?n.x:0),n.y,
       sz+.5+(axis==='z'?n.x:0)]])),
   members=statics.members.map(m=>({member:m,shape:m.type==='vertical-web'?
       deriveD31OriginalPack2Vertical(coords.get(m.from),coords.get(m.to),post.boxes):
       deriveD31OriginalPack2Oblique(coords.get(m.from),coords.get(m.to),axis,beam.boxes)}));
  let spanOld=0,spanNew=0,spanSource=0,spanFace=0,spanDiags=0;
  for(const n of statics.nodes){
   const incident=members.filter(x=>x.member.from===n.id||x.member.to===n.id),
    r=auditD34PinSplitPlane({id:n.id,worldAt:coords.get(n.id)},incident,axis,{offset,cutback});
   if(r.constructionAllowed!==false||r.realAxialTransferAuthenticated!==false)
    throw Error('D34 unloaded separated tangent was falsely accepted as a structural joint');
   spanOld+=r.originalSamePlaneCollisionPairs;spanNew+=r.remainingSplitPlanePositiveVolumePairs;
   spanFace+=r.unratedLateralFaceArea;
   counts.samePlaneDiagonalTopChordPairs+=r.oldOverlapTypes['diagonal-web+top-chord']??0;
   counts.samePlaneDiagonalBottomChordPairs+=r.oldOverlapTypes['bottom-chord+diagonal-web']??0;
   counts.crossPlaneUnratedSurfaceFacePairs+=r.unratedLateralSurfaceFacePairs;
   counts.sourcePinNodes++;
  }
  for(const m of members){if(m.member.type!=='diagonal-web')continue;
   spanDiags++;
   const moved=deriveD34LateralOriginalWeb(m.shape,axis,1,{offset}),
    hits=d34ProbeSourceCellIntersections(moved,src.get),
    min=bounds(moved).min,max=bounds(moved).max;
   spanSource+=hits.length;
   if(hits.length)counts.shiftedWebsWithCellClashes++;else counts.zeroSourceCellClashDiagonalWebs++;
   for(const c of hits){
    counts.newlyShiftedWebOriginalCellCollisions++;
    if(c.at[1]>=7)counts.shiftedWebRoofOrUpperTierCollisions++;
    if(c.at[1]===5||c.at[1]===6){
     const x=c.at[0],z=c.at[2];
     if((x===row.sourceOriginalStartBearing[0]&&z===row.sourceOriginalStartBearing[2])||
        (x===row.sourceOriginalEndBearing[0]&&z===row.sourceOriginalEndBearing[2]))
      counts.shiftedWebOriginalRootedWallClashes++;
    }
   }
   for(let x=Math.floor(min[0]+1e-8);x<=Math.ceil(max[0]-1e-8)-1;x++)
    for(let z=Math.floor(min[2]+1e-8);z<=Math.ceil(max[2]-1e-8)-1;z++)
     if(src.nav.has(K(x,2,z))&&d31PreviewHitsAABB(moved,[x+.2,2,z+.2],[x+.8,4.5,z+.8]))
      counts.shiftedWebWalkEnvelopeCollisions++;
   if(sampled<maxMeshSamples){
    const visual=d31TransformOriginalPack2Mesh(moved,mesh),
     mid=moved.start.map((v,i)=>(v+moved.end[i])/2),normal=moved.ownerOBBs[0].axes[2],
     ray=mid.map((v,i)=>v+normal[i]*2),dir=normal.map(v=>-v),
     physical=d31RayOwnerPreview(moved,ray,dir,4),visible=d31RayPreviewTriangles(visual,ray,dir,4);
    if(physical===null||visible===null||Math.abs(physical-visible)>.004)
     throw Error('D34 original ID61 shifted preview selection and mesh disagreement');
    counts.maxSourceMeshRayVsColliderDelta=Math.max(counts.maxSourceMeshRayVsColliderDelta,Math.abs(physical-visible));
    counts.originalColoredMeshSamples++;sampled++;
   }
  }
  counts.longBays++;counts.originalSourceMembers+=members.length;
  counts.originalDiagonalWebs+=spanDiags;counts.originalD33SamePlanePairs+=spanOld;
  counts.originalD34SplitPlanePairs+=spanNew;counts.crossPlaneGeometricFaceArea+=spanFace;
  perSpan.push(Object.freeze({originalSpanCells:row.spanCells,axis,
   oldSamePlaneMemberOverlaps:spanOld,newSplitPlaneMemberOverlaps:spanNew,
   offsetDiagonalWebs:spanDiags,newlyExposedOriginalCellCollisions:spanSource,
   contactAreaMathematicalOnly:spanFace,actualFastenerInstalled:false,constructionAllowed:false}));
 }
 if(before.cells!==b.cells.length||before.first!==b.cells[0]||before.last!==b.cells.at(-1)||
    before.nav!==b.navigation.length||before.firstNav!==b.navigation[0]||
    counts.longBays!==d29.unapprovedLongCandidateSpans||
    counts.originalD33SamePlanePairs<counts.originalD34SplitPlanePairs||
    counts.shiftedWebRoofOrUpperTierCollisions!==0||counts.shiftedWebWalkEnvelopeCollisions!==0)
  throw Error('D34 actual source changed or roof/WALK/owner member veto');
 return Object.freeze({format:'mythwrought.builder-d.d34.actual-source-separated-plane-diagnostic.v1',
  blueprintId:b.id,originalLiveWoodRoofCells:d29.sourceRoofCells,
  originalDistantRoofCellsStillUncertified:d29.originalFarZoneCellsStillUncertified,
  originalUncertifiedFarZones:d29.originalFarZones,...counts,perSpan:Object.freeze(perSpan),
  originalRegisteredOwnersUntouched:true,originalY7LiveWoodPreserved:true,
  originalY8Y9TiersUnchanged:true,authoredWalkingRoutesUnchanged:true,
  originalWorldAndSaveUntouched:true,shiftedMemberMayConflictWithNeighborBuilding:true,
  positiveAreaContactCannotSubstituteRatedFastener:true,
  noAuthenticatedRealGravityOrUpliftTransfer:true,
  materialAxialBucklingAndConnectionRatingsUnproven:true,
  noRuntimeSourceOwnedAngledVariantRegistered:true,sourceMeshNeedsRealJointEndcaps:true,
  availableForConstruction:false,structuralReleaseAccepted:false,
  webgl2NotAccepted:true,installedIphonePwaNotAccepted:true});
}
