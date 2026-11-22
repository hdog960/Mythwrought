// MYTHWROUGHT Builder D30 — source-authentic, READ-ONLY route and ideal
// triangulation audit. No source or world cell is placed, replaced, registered,
// mined or saved. No real angled Pack2 timber member or rated joint exists.
// The underslung plane is Y5.5–6.5: below untouched original Y7 live:wood
// and below authentic Y8/Y9 ridge tiers. This does NOT certify a member's
// physical thickness, picking, player clearance, or gravity support.
import {auditD29OriginalLongBayBearingAndTierClearance}
 from './d29-original-upper-chord-perimeter-audit.mjs';
import {indexD29OriginalRoof}
 from './d29-raised-route-geometry.mjs';
import {solveD30IdealizedUnderslungTruss}
 from './d30-idealized-pin-truss-statics.mjs';
import {inspectD30OriginalUnderslungCorridor}
 from './d30-underslung-corridor-geometry.mjs';
/** Reuses original D28/D29 validation, but runs ONLY new D30 tests. */
export function auditD30OriginalUnderslungTrussFeasibility(blueprint,p,s,d25){
 const d29=auditD29OriginalLongBayBearingAndTierClearance(blueprint,p,s,d25);
 if(d29.constructionAllowed!==false||d29.ratedStructuralEngineeringAccepted!==false||
    d29.sourceRoofCells<100||d29.allOriginalAuthorNavigationPreserved!==true)
  throw Error('D30 cannot inherit unverified D29 structural acceptance');
 const src=indexD29OriginalRoof(blueprint),seenCells=blueprint.cells.length,
  seenNav=blueprint.navigation.length;
 let centerlineClear=0,blocked=0,blockedCells=0,spanCellsClear=0,spans=0,
  peakCompression=0,peakTension=0,peakBucklingEI=0,maxMemberLength=0,
  totalIdealMembers=0,totalIdealJoints=0,walkCount=0;
 const samples=[];
 for(const r of d29.proposedOriginalLongBays){
  const check=inspectD30OriginalUnderslungCorridor(src,r),
   symbolic=solveD30IdealizedUnderslungTruss(r.spanCells);
  if(symbolic.roofSupportCertified!==false||symbolic.constructionAllowed!==false||
     check.noProposedWorldVoxelCells!==true)throw Error('D30 leaked unverified roof support');
  spans++;if(check.exactOriginalY5Y6CourseFree){centerlineClear++;spanCellsClear+=r.spanCells;}
  else{blocked++;blockedCells+=check.originalY5InteriorObstructedCells;}
  peakCompression=Math.max(peakCompression,symbolic.idealizedPeakCompressionPerUnitRoofLineLoad);
  peakTension=Math.max(peakTension,symbolic.idealizedPeakTensionPerUnitRoofLineLoad);
  peakBucklingEI=Math.max(peakBucklingEI,symbolic.idealizedMinCompressionEIForPinnedUnbracedAssumptionPerUnitLoad);
  maxMemberLength=Math.max(maxMemberLength,symbolic.maxTrussMemberLength);
  totalIdealMembers+=symbolic.numberOfMembers;totalIdealJoints+=symbolic.numberOfJointsRequiringValidatedAxialTransfer;
  walkCount+=check.authoredY2WalkColumnsPreserved;
  samples.push(Object.freeze({start:r.sourceOriginalStartBearing,end:r.sourceOriginalEndBearing,
   axis:check.axis,interiorCells:r.spanCells,underslungCenterlineCourseFree:check.exactOriginalY5Y6CourseFree,
   originalY5Obstacles:check.originalY5InteriorObstructedCells,
   sourceWalkNodeColumns:check.authoredY2WalkColumnsPreserved,
   pinWebPanelCount:symbolic.panelCount,abstractPinWebMembers:symbolic.numberOfMembers,
   idealPeakCompressionPerUnitLineLoad:symbolic.idealizedPeakCompressionPerUnitRoofLineLoad,
   idealPeakTensionPerUnitLineLoad:symbolic.idealizedPeakTensionPerUnitRoofLineLoad,
   realMemberMaterialAssigned:false,ratedJointsAndDiagonals:false,buildAllowed:false}));
 }
 if(spans!==d29.unapprovedLongCandidateSpans||seenCells!==blueprint.cells.length||
    seenNav!==blueprint.navigation.length||centerlineClear+blocked!==spans)
  throw Error('D30 original W16/W17 unchanged source census or candidate tally failed');
 return Object.freeze({format:'mythwrought.builder-d.d30.original-unrated-underslung-triangle.v1',
  blueprintId:blueprint.id,originalSourceRoofCells:d29.sourceRoofCells,
  originalDistantRoofCellsStillUncertified:d29.originalFarZoneCellsStillUncertified,
  originalUncertifiedDistantZones:d29.originalFarZones,
  originalLongBayCandidates:spans,geometricallyUnobstructedY5Y6CenterlineCandidates:centerlineClear,
  blockedUnderRoofY5ByOriginalSource:blocked,originalY5CellsCausingVeto:blockedCells,
  originalY5Y6ClearInteriorCellCourses:spanCellsClear,
  verifiedAuthoredY2WalkNodesUnderAllCandidates:walkCount,
  idealPinWebMembersAcrossCandidateScreens:totalIdealMembers,
  idealPinWebJointNodesAcrossCandidateScreens:totalIdealJoints,
  largestIdealCompressionForcePerUnitUncalibratedLineLoad:peakCompression,
  largestIdealTensionForcePerUnitUncalibratedLineLoad:peakTension,
  largestIdealMinCompressionEIForK1PinnedUnbracedAssumptionPerUnitLoad:peakBucklingEI,
  longestIdealWebMember:maxMemberLength,
  originalD29Y8Vacant:d29.continuousEmptyY8CourseCount,
  originalD29Y9Vacant:d29.continuousEmptyY9CourseCount,
  candidates:Object.freeze(samples),
  exactOriginalY7LiveWoodUnchanged:true,actualRoofLoadsUnknown:true,
  realPack2DiagonalShapeNotAuthorized:true,ratedPinsAndAxialConnectionsUnknown:true,
  unverifiedMemberBucklingAndLateralBracing:true,
  actualRoofAttachmentLoadTransferNotAccepted:true,
  originalWALKNeverEdited:true,originalCellsNeverEdited:true,
  collisionAndPickingUnaccepted:true,originalWorldModifiedCells:0,
  webgl2Untested:true,iphoneInstalledPwaUntested:true,
  sourceCenterlineNotCollisionCertified:true,roofSupportCertified:false,
  registrationOrConstructionAllowed:false});
}
