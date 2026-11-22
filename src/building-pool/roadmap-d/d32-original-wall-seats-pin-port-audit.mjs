// MYTHWROUGHT Builder D32: exact original W16/W17, source-only seating.
// No authored walls are cut, no original ID61/62 owner/source altered, no
// new truss/fastener implemented, no true roof-load capacity claimed.
import {pack2Shape,pack2Asset} from '../../block-packs/pack-2/definitions.mjs';
import {pack2ShapeOf} from '../../pack2-integration.mjs';
import {BLOCK} from '../../voxel.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance} from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof} from './d29-raised-route-geometry.mjs';
import {inspectD30OriginalUnderslungCorridor} from './d30-underslung-corridor-geometry.mjs';
import {solveD30IdealizedUnderslungTruss} from './d30-idealized-pin-truss-statics.mjs';
import {deriveD31OriginalPack2Oblique,deriveD31OriginalPack2Vertical,d31PreviewHitsAABB}
 from './d31-pack2-owner-oblique-preview.mjs';
import {findD32NonintrusiveWallSeat,inspectD32UnratedPinPorts}
 from './d32-pack2-wall-seat-joint-ports.mjs';
const R=new Set(['foundation','floor','wall','column','partition','beam']);
const root=(s,p)=>{const [x,y,z]=p;return y===6&&
  s.get(x,0,z)?.role==='foundation'&&s.get(x,1,z)?.role==='floor'&&
  Array.from({length:7},(_,h)=>R.has(s.get(x,h,z)?.role)).every(Boolean);};
/** Produce only derived geometry, counters, and vetoes. The original building
 * and navigation have no mutations, placements, runtime sidecars or saves. */
export function auditD32OriginalPack2WallSeatsAndPinPorts(b,p,s,d25,{portCutback=.35}={}){
 const beam=pack2Shape(61,0),post=pack2Shape(62,0);
 if(BLOCK.WOOD!==4||pack2Asset(61)?.roster!==15||pack2Asset(62)?.roster!==22||
    JSON.stringify(beam.boxes)!==JSON.stringify(pack2ShapeOf(61,{rotation:0}).boxes)||
    JSON.stringify(post.boxes)!==JSON.stringify(pack2ShapeOf(62,{rotation:0}).boxes))
   throw Error('D32 exact original approved Pack2 physical owner changed');
 const d29=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,d25),src=indexD29OriginalRoof(b),
   n=b.cells.length,nn=b.navigation.length,first=b.cells[0],last=b.cells.at(-1),nav=b.navigation[0];
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    d29.allOriginalY7WoodPreserved!==true||d29.allOriginalAuthorNavigationPreserved!==true||
    d29.originalFarZoneCellsStillUncertified!==d25.afterD25HypotheticalBeyondRadius)
  throw Error('D32 original source roof/approval/WALK proof lost');
 let totalMembers=0,spans=0,totalNodes=0,totalDiagonal=0,
  existingWallPenetrationMembers=0,sourceProtectedWallSeats=0,unseatableRootMembers=0,
  incidentMemberPairs=0,originalPinOverlapPairs=0,residualAfterClearance=0,
  potentialFlatChordSeats=0,obliqueEndSeatWithoutFaceContact=0;
 const perSpan=[];
 for(const row of d29.proposedOriginalLongBays){
  const corridor=inspectD30OriginalUnderslungCorridor(src,row);
  if(!corridor.exactOriginalY5Y6CourseFree||corridor.originalY5InteriorObstructedCells!==0||
     corridor.originalY5Y6OverheadWalkConflicts!==0||
     !root(src,row.sourceOriginalStartBearing)||!root(src,row.sourceOriginalEndBearing))
   throw Error('D32 actual source wall foundation or Y5/Y6 route invalid');
  const statics=solveD30IdealizedUnderslungTruss(row.spanCells),
   [sx,,sz]=row.sourceOriginalStartBearing,axis=row.clearance.axis;
  const coords=new Map(statics.nodes.map(v=>[v.id,[sx+.5+(axis==='x'?v.x:0),v.y,
   sz+.5+(axis==='z'?v.x:0)]]));
  const members=[],endStart='T0',endFinish='T'+statics.panelCount;
  for(const m of statics.members){
   const a=coords.get(m.from),c=coords.get(m.to),shape=m.type==='vertical-web'?
    deriveD31OriginalPack2Vertical(a,c,post.boxes):
    deriveD31OriginalPack2Oblique(a,c,axis,beam.boxes);
   members.push({member:m,shape});
   if(m.type==='diagonal-web')totalDiagonal++;
  }
  const port=inspectD32UnratedPinPorts(members,statics.nodes,{cutback:portCutback});
  if(port.constructionAllowed!==false||port.proofOfNonoverlapAndRatedConnection!==false||
     port.originalOverlappingPairs<port.overlappingResidualPairs)
   throw Error('D32 end-clearance cannot turn source collision into a rated joint');
  incidentMemberPairs+=port.pairs;originalPinOverlapPairs+=port.originalOverlappingPairs;
  residualAfterClearance+=port.overlappingResidualPairs;
  let seats=0,diagonalAtWall=0,flatAtWall=0;
  for(const {member:m,shape} of members){
   const start=m.from===endStart,end=m.to===endFinish;
   if(!start&&!end)continue;
   if(start&&end)throw Error('D32 impossible two-wall member topology');
   const wall=start?row.sourceOriginalStartBearing:row.sourceOriginalEndBearing,
     [x,,z]=wall;
   if(src.get(x,5,z)===undefined||src.get(x,6,z)===undefined)
    throw Error('D32 true rooted original wall seat deleted');
   const w6=[x,6,z],w5=[x,5,z];
   const originallyHits=d31PreviewHitsAABB(shape,w6,[x+1,7,z+1])||
                       d31PreviewHitsAABB(shape,w5,[x+1,6,z+1]);
   if(!originallyHits)throw Error('D32 original D31 rooted wall end intersection disappeared');
   existingWallPenetrationMembers++;
   const seat=findD32NonintrusiveWallSeat(shape,w6,{atEnd:end});
   if(!seat.seatable){unseatableRootMembers++;continue;}
   if(d31PreviewHitsAABB(seat.trimmed,w6,[x+1,7,z+1])||
      d31PreviewHitsAABB(seat.trimmed,w5,[x+1,6,z+1]))
    throw Error('D32 source WALL positive-volume intrusion after an uninstalled study trim');
   if(seat.positiveAreaWallTransferCertified!==false||seat.constructionAllowed!==false||
      seat.originalWallUnaltered!==true||seat.trimmed.approvedCompositeCollider!==false)
    throw Error('D32 fake rated wall contact, collider, or original-source replacement');
   sourceProtectedWallSeats++;seats++;
   if(m.type==='diagonal-web'){diagonalAtWall++;obliqueEndSeatWithoutFaceContact++;}
   else if(m.type==='top-chord'){flatAtWall++;potentialFlatChordSeats++;}
   else throw Error('D32 unknown original wall-bearing truss edge role');
  }
  spans++;totalMembers+=members.length;totalNodes+=statics.nodes.length;
  perSpan.push(Object.freeze({axis,spanCells:row.spanCells,proposedMembers:members.length,
   originalWallPenetratingMembers:seats+unseatableRootMembers,
   sourceWallSeatsClearedWithoutVoxelCuts:seats,
   originalPinOverlappingPairs:port.originalOverlappingPairs,
   residualAfterUnratedPortCutback:port.overlappingResidualPairs,
   conceptualPinGaps:port.nodes,sourceOwnersUnmodified:true,
   physicalSocketNotInstalled:true,constructionAllowed:false}));
 }
 if(n!==b.cells.length||nn!==b.navigation.length||b.cells[0]!==first||
    b.cells.at(-1)!==last||b.navigation[0]!==nav||spans!==d29.unapprovedLongCandidateSpans||
    totalNodes!==perSpan.reduce((n,v)=>n+v.conceptualPinGaps,0))
  throw Error('D32 original blueprint/source navigation has been mutated');
 return Object.freeze({format:'mythwrought.builder-d.d32.source-protected-end-seat-joint-port-study.v1',
  blueprintId:b.id,spans,originalRoofCells:d29.sourceRoofCells,
  originalFarRoofCellsStillUncertified:d29.originalFarZoneCellsStillUncertified,
  originalUncertifiedFarZones:d29.originalFarZones,
  proposedMemberShapes:totalMembers,idealPinNodes:totalNodes,
  diagonalWebMembers:totalDiagonal,originalWallPenetratingMemberShapes:existingWallPenetrationMembers,
  sourceProtectedClearanceSeats:sourceProtectedWallSeats,unseatableRootMembers,
  potentialFlatChordSeats,obliqueEndSeatWithoutFaceContact,
  incidentMemberPairs,originalOverlappingPinPairs:originalPinOverlapPairs,
  residualAfterUnregisteredClearancePorts:residualAfterClearance,
  unbuiltJointGaps:totalNodes,perSpan:Object.freeze(perSpan),
  noAuthoredFoundationOrWallEdited:true,originalY7LiveWoodPreserved:true,
  originalY8Y9Preserved:true,allWALKUnchanged:true,
  realOwnerMeshCapUnimplemented:true,ownerColoredColliderAndEndFacePickingNotCertified:true,
  geometricWallTrimDoesNotProvideRatedBearing:true,
  horizontalWallFaceContactRequiresRealFastener:true,
  diagonalRootAxialCutCannotProveWallFaceLoadTransfer:true,
  jointGapCannotTransferOriginalTrussAxialLoads:true,
  originalRegisteredPack2ShapesUnchanged:true,
  structuralRatingAndLiveRoofLoadMissing:true,allCandidateJointStudiedButUnapproved:true,
  liveRoofSupportedByThisStudy:false,constructionAllowed:false,
  worldCellsModified:0,savesWritten:0,webgl2Approved:false,installedIphonePwaApproved:false});
}
