// MYTHWROUGHT Builder D29 — actual original W16/W17 material/route audit.
// Source only. None of these corridors are structural solutions: the original
// timber has no rated moment or tension joint, and exterior terrain is unknown.
import {auditD28OriginalLongBayArchitecture}
 from './d28-original-long-bay-architect.mjs';
import {screenD29ExplicitRatedLongBay}
 from './d29-structural-demand-screen.mjs';
import {indexD29OriginalRoof,inspectD29OriginalRaisedRoute}
 from './d29-raised-route-geometry.mjs';
export {inspectD29OriginalRaisedRoute} from './d29-raised-route-geometry.mjs';
/** Strictly read-only original source verdict; no capacity or runtime acceptance. */
export function auditD29OriginalLongBayBearingAndTierClearance(blueprint,primary,secondary,d25){
 const d28=auditD28OriginalLongBayArchitecture(blueprint,primary,secondary,d25);
 const source=indexD29OriginalRoof(blueprint),originalLength=blueprint.cells.length,
  originalNav=blueprint.navigation.length,
  roof=blueprint.cells.filter(c=>c.at[1]===7&&c.feature==='weather-plane'),
  sourceRoofCount=roof.length;
 if(d28.blueprintId!==blueprint.id||sourceRoofCount!==d28.originalRoofCells||
    d28.noInteriorPierInsertion!==true||d28.canBuildLongBays!==false||
    d28.structuralRoofSupportAccepted!==false)
  throw Error('D29 original D28 source provenance or construction veto invalid');
 const spans=[];let y8=0,y9=0,both=0,upperWalk=0,originalY8=0,originalY9=0,
  anyExternalSites=0,realOriginalBearingContacts=0;
 for(const span of d28.selectedGeometricalLongBays){
  const route=inspectD29OriginalRaisedRoute(source,span);
  const demand=screenD29ExplicitRatedLongBay(span.Y6UnoccupiedOriginalColumns);
  if(demand.structuralReleaseAccepted!==false||demand.constructionAllowed!==false||
    demand.missingRatings.length!==10||demand.missingLoadData.length!==5)
   throw Error('D29 would silently fabricate missing source material ratings');
  if(route.continuousVacantOriginalY8Route)y8++;
  if(route.continuousVacantOriginalY9Route)y9++;
  if(route.bothRaisedCoursesVacant)both++;
  upperWalk+=route.authoredOverheadWalkConflicts;
  originalY8+=route.originalY8OccupiedInterior;
  originalY9+=route.originalY9OccupiedInterior;
  if(route.entirelySourceVacantOutsideFoundationSites.some(a=>a.length>0))anyExternalSites++;
  realOriginalBearingContacts+=route.realRootedOriginalEndpoints;
  spans.push(Object.freeze({sourceOriginalStartBearing:span.originalStartBearing,
   sourceOriginalEndBearing:span.originalEndBearing,spanCells:span.Y6UnoccupiedOriginalColumns,
   clearance:route,unratedScreen:demand,loadPathDraftOnly:true,
   roofAndNavUnchanged:true,sourceTimberCannotCarryCertifiedLongSpan:true,
   longBayPhysicalLoadAcceptance:false}));
 }
 if(originalLength!==blueprint.cells.length||originalNav!==blueprint.navigation.length||
  spans.length!==d28.selectedGeometricalLongBays.length)
  throw Error('D29 original building may have been mutated during audit');
 return Object.freeze({format:'mythwrought.builder-d.d29.original-roof-elevation-exterior-gate.v1',
  blueprintId:blueprint.id,sourceRoofCells:sourceRoofCount,
  originalFarZoneCellsStillUncertified:d28.genuineRoofFarBefore,
  originalFarZones:d28.originalUnresolvedZones,
  totalOriginalShortPhysicalCandidates:d28.priorCompositeBeamSites,
  unapprovedLongCandidateSpans:spans.length,
  unapprovedLongCandidateCells:d28.suggestedUninstalledLongBeamCells,
  originalRootedBearingEnds:realOriginalBearingContacts,
  continuousEmptyY8CourseCount:y8,continuousEmptyY9CourseCount:y9,
  emptyBothY8Y9CourseCount:both,
  originalY8UpperOccupancies:originalY8,originalY9UpperOccupancies:originalY9,
  authoredUpperNavigationConflicts:upperWalk,
  longBaysWithAtLeastOneExteriorVacantUnverifiedSite:anyExternalSites,
  proposedOriginalLongBays:Object.freeze(spans),
  allOriginalAuthorNavigationPreserved:true,allOriginalY7WoodPreserved:true,
  unbuiltExteriorSitesRequireIndependentWorldTerrainAndFootingAcceptance:true,
  Y8Y9EmptyDoesNotCertifyTriangulatedTruss:true,
  actualTimberAndJointStrengthUnknown:true,
  originallyAuthoredFullHeightPiersAdded:0,originalWorldCellsModified:0,
  ratedStructuralEngineeringAccepted:false,constructionAllowed:false,
  originalWebGLAndIphonePwaStillUnaccepted:true});
}
