// Builder D25 focused, literal original-W16/W17 native source validation.
// The complete repository and original compiler must be present; no mock 4B source.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {auditD23OriginalRoofNavigationInvariants} from '../../../src/building-pool/roadmap-d/d23-original-roof-navigation-invariants.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
const buildings=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const xy=p=>`${p[0]},${p[1]},${p[2]}`;
test('authentic 16 original buildings preserve D23 exact source and read-only D25 geometric plans',()=>{
 assert.equal(buildings.length,16);
 const totals={roof:0,open:0,navigation:0,anchors:0,spans:0,beams:0,
  oldNear:0,oldFar:0,newNear:0,newFar:0,thirdSpans:0,thirdBeams:0,
  zones:0,originalSourceCount:0,impossiblePiers:0};
 const perBuilding=[];
 for(const b of buildings){
  const beforeLength=b.cells.length,beforeNav=b.navigation.length,first=b.cells[0];
  const primary=planD19SourceProvenRoofTrusses(b);
  const secondary=planD22SecondaryOriginalRoofTrusses(b,{existing:primary});
  const d23=auditD23OriginalRoofNavigationInvariants(b,primary,secondary);
  const r=planD25OriginalLiveWoodRoofZones(b,primary,secondary);
  assert.equal(r.actualRoofMaterial,'live:wood');
  assert.equal(r.originalRoofCells,d23.originalRoofPlaneCells);
  assert.equal(r.verifiedOriginalFoundationWallRoofAnchors,d23.realOriginalFoundationWallRoofCells);
  assert.equal(r.originalEmptyY2ToY6RoofColumns,d23.originalEmptyFullHeightY2ToY6Columns);
  assert.equal(r.originalEmptyColumnsWithNavigation,d23.overlappingAuthoredNavigationColumns);
  assert.equal(r.sourceFullHeightPierCandidates,d23.currentlyWalkwayFreePotentialFullHeightPiers);
  assert.equal(r.originalPrimaryAndSecondarySpanCount,d23.originalPrimarySpans+d23.originalSecondarySpans);
  assert.equal(r.originalPrimaryAndSecondaryBeamCells,d23.verifiedExistingPhysicalBeamProposals);
  assert.equal(r.originalPlusD19D22HypotheticalWithinRadius,d23.sourceRoofNearPrimaryAndSecondary);
  assert.equal(r.originalPlusD19D22HypotheticalBeyondRadius,d23.originalRoofBeyondRadius);
  assert.equal(r.originalHypotheticalMaxSourceSteps,d23.sourceRoofMaxHorizontalDistance);
  assert.ok(r.strictOriginalWallOnlyWithinRadius<=r.originalPlusD19D22HypotheticalWithinRadius);
  assert.ok(r.afterD25HypotheticalWithinRadius>=r.originalPlusD19D22HypotheticalWithinRadius);
  assert.ok(r.afterD25HypotheticalBeyondRadius<=r.originalPlusD19D22HypotheticalBeyondRadius);
  assert.equal(r.allProposalsAtY6,true);
  assert.equal(r.realPack2ToActualLiveWoodPhysicalContactCertified,false);
  assert.equal(r.actualLiveWoodGravityLoadAccepted,false);
  assert.equal(r.actualPlayerCollisionAndPickingAccepted,false);
  assert.equal(r.mutations,0);assert.equal(r.worldPlaced,false);
  assert.equal(b.cells.length,beforeLength);assert.equal(b.navigation.length,beforeNav);
  assert.equal(b.cells[0],first);
  const original=new Map(b.cells.map(c=>[xy(c.at),c]));
  const already=new Set([...primary.proposedBeamCells,...secondary.proposedBeamCells].map(c=>xy(c.at)));
  for(const beam of r.thirdLaneProposedCells){
   assert.equal(beam.at[1],6);assert.equal(beam.asset,'pack2:015');
   assert.ok(!original.has(xy(beam.at)),'third lane overwrote source');
   assert.ok(!already.has(xy(beam.at)),'third lane duplicated D19/D22 proposal');
   assert.equal(original.get(xy([beam.at[0],7,beam.at[2]]))?.asset,'live:wood');
  }
  for(const s of r.thirdLaneProposedSpans){
   assert.equal(s.bothBearingsReachUnbrokenOriginalFoundation,true);
   assert.equal(s.physicalPack2ToLiveWoodJointAccepted,false);
   assert.equal(s.gravityLoadCertified,false);
   assert.ok(s.spanCells<=12);
  }
  totals.roof+=r.originalRoofCells;totals.open+=r.originalEmptyY2ToY6RoofColumns;
  totals.navigation+=r.originalEmptyColumnsWithNavigation;
  totals.anchors+=r.verifiedOriginalFoundationWallRoofAnchors;
  totals.spans+=r.originalPrimaryAndSecondarySpanCount;totals.beams+=r.originalPrimaryAndSecondaryBeamCells;
  totals.oldNear+=r.originalPlusD19D22HypotheticalWithinRadius;
  totals.oldFar+=r.originalPlusD19D22HypotheticalBeyondRadius;
  totals.newNear+=r.afterD25HypotheticalWithinRadius;
  totals.newFar+=r.afterD25HypotheticalBeyondRadius;
  totals.thirdSpans+=r.thirdLaneProposedSpans.length;
  totals.thirdBeams+=r.thirdLaneProposedCells.length;
  totals.zones+=r.unresolvedRoofZoneCount;
  totals.originalSourceCount+=b.cells.length;
  totals.impossiblePiers+=r.sourceFullHeightPierCandidates;
  perBuilding.push({id:b.id,roof:r.originalRoofCells,oldFar:r.originalPlusD19D22HypotheticalBeyondRadius,
   newFar:r.afterD25HypotheticalBeyondRadius,thirdSpans:r.thirdLaneProposedSpans.length,
   proposedCells:r.thirdLaneProposedCells.length,openZones:r.unresolvedRoofZoneCount});
 }
 assert.deepEqual({roof:totals.roof,open:totals.open,navigation:totals.navigation,
  anchors:totals.anchors,spans:totals.spans,beams:totals.beams,
  oldNear:totals.oldNear,oldFar:totals.oldFar,impossiblePiers:totals.impossiblePiers},
  {roof:115894,open:107819,navigation:107819,anchors:6273,spans:181,beams:1270,
   oldNear:56449,oldFar:59445,impossiblePiers:0});
 console.log('D25 source-only counts '+JSON.stringify(totals));
 console.log('D25 source-only building bins '+JSON.stringify(perBuilding));
});
test('genuine original W16 source live:wood tamper is detected without mutating original',()=>{
 const b=buildings[0],p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 const original=b.cells.find(c=>c.at[1]===7&&c.role==='roof'&&c.feature==='weather-plane');
 assert.ok(original);
 const changed={...b,cells:b.cells.map(c=>c===original?{...c,asset:'pack3:109'}:c)};
 assert.throws(()=>planD25OriginalLiveWoodRoofZones(changed,p,s),/live:wood/);
 assert.equal(original.asset,'live:wood');
});
