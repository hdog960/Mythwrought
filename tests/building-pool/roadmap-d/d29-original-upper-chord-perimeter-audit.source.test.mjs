// New D29 exact original 16-building source-native test. Do not duplicate D28 CI.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD29OriginalLongBayBearingAndTierClearance}
 from '../../../src/building-pool/roadmap-d/d29-original-upper-chord-perimeter-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
function plans(b){const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];}
test('D29 original W16/W17 all 16 source-only long roof corridors: Y8/Y9, bearing footings and walkway preservation, no structural approval',()=>{
 assert.equal(B.length,16);
 const totals={buildings:0,roof:0,oldFar:0,zones:0,oldCompositeSites:0,
  longBays:0,longCells:0,realBearingEnds:0,
  y8Clear:0,y9Clear:0,bothClear:0,originalY8:0,originalY9:0,
  upperWalkConflicts:0,exteriorPotentialUnrated:0};
 const bins=[];
 for(const b of B){
  const n=b.cells.length,nav=b.navigation.length,first=b.cells[0],firstNav=b.navigation[0];
  const [p,s,z]=plans(b),r=auditD29OriginalLongBayBearingAndTierClearance(b,p,s,z);
  assert.equal(r.allOriginalY7WoodPreserved,true);
  assert.equal(r.allOriginalAuthorNavigationPreserved,true);
  assert.equal(r.unbuiltExteriorSitesRequireIndependentWorldTerrainAndFootingAcceptance,true);
  assert.equal(r.Y8Y9EmptyDoesNotCertifyTriangulatedTruss,true);
  assert.equal(r.actualTimberAndJointStrengthUnknown,true);
  assert.equal(r.originallyAuthoredFullHeightPiersAdded,0);
  assert.equal(r.originalWorldCellsModified,0);
  assert.equal(r.ratedStructuralEngineeringAccepted,false);
  assert.equal(r.constructionAllowed,false);
  assert.equal(r.originalRootedBearingEnds,2*r.unapprovedLongCandidateSpans);
  assert.equal(r.unapprovedLongCandidateSpans,r.proposedOriginalLongBays.length);
  for(const row of r.proposedOriginalLongBays){
   assert.equal(row.clearance.realRootedOriginalEndpoints,2);
   assert.equal(row.unratedScreen.missingRatings.length,10);
   assert.equal(row.unratedScreen.missingLoadData.length,5);
   assert.equal(row.unratedScreen.structuralReleaseAccepted,false);
   assert.equal(row.unratedScreen.constructionAllowed,false);
   assert.equal(row.clearance.constructionAllowed,false);
   assert.equal(row.sourceTimberCannotCarryCertifiedLongSpan,true);
  }
  assert.equal(b.cells.length,n);assert.equal(b.navigation.length,nav);
  assert.strictEqual(b.cells[0],first);assert.strictEqual(b.navigation[0],firstNav);
  totals.buildings++;totals.roof+=r.sourceRoofCells;totals.oldFar+=r.originalFarZoneCellsStillUncertified;
  totals.zones+=r.originalFarZones;totals.oldCompositeSites+=r.totalOriginalShortPhysicalCandidates;
  totals.longBays+=r.unapprovedLongCandidateSpans;totals.longCells+=r.unapprovedLongCandidateCells;
  totals.realBearingEnds+=r.originalRootedBearingEnds;
  totals.y8Clear+=r.continuousEmptyY8CourseCount;
  totals.y9Clear+=r.continuousEmptyY9CourseCount;
  totals.bothClear+=r.emptyBothY8Y9CourseCount;
  totals.originalY8+=r.originalY8UpperOccupancies;
  totals.originalY9+=r.originalY9UpperOccupancies;
  totals.upperWalkConflicts+=r.authoredUpperNavigationConflicts;
  totals.exteriorPotentialUnrated+=r.longBaysWithAtLeastOneExteriorVacantUnverifiedSite;
  bins.push({id:b.id,spans:r.unapprovedLongCandidateSpans,
   y8Clear:r.continuousEmptyY8CourseCount,y9Clear:r.continuousEmptyY9CourseCount,
   bothClear:r.emptyBothY8Y9CourseCount,
   exteriorUnverified:r.longBaysWithAtLeastOneExteriorVacantUnverifiedSite});
 }
 assert.deepEqual([totals.buildings,totals.roof,totals.oldFar,totals.zones,
  totals.oldCompositeSites,totals.longBays,totals.longCells,totals.realBearingEnds],
  [16,115894,59412,34,1698,64,2533,128]);
 assert.ok(totals.bothClear<=totals.y8Clear&&totals.bothClear<=totals.y9Clear);
 assert.ok(totals.y8Clear<=64&&totals.y9Clear<=64);
 console.log('D29 ORIGINAL Y8 Y9 AND FOOTING TOTALS '+JSON.stringify(totals));
 console.log('D29 ORIGINAL BUILDING BINS '+JSON.stringify(bins));
});
test('D29 rejects forged original roofing or unauthorized building registration before roof-load approval',()=>{
 const b=B[0],[p,s,z]=plans(b);
 const first=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.ok(first);
 const changed={...b,cells:b.cells.map(c=>c===first?{...c,asset:'pack3:023'}:c)};
 assert.throws(()=>auditD29OriginalLongBayBearingAndTierClearance(changed,p,s,z),/roof|wood|source/i);
 assert.throws(()=>auditD29OriginalLongBayBearingAndTierClearance({...b,creatorApproved:true},p,s,z),/original|unplaced|approved|D26/i);
});
