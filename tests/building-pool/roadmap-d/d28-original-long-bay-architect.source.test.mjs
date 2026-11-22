// D28 native source tests — run once on an exact original full checkout.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD28OriginalLongBayArchitecture} from '../../../src/building-pool/roadmap-d/d28-original-long-bay-architect.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
function p(b){const a=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:a});
 return {a,s,z:planD25OriginalLiveWoodRoofZones(b,a,s)};}
const K=p=>p.join(',');
test('D28 exact 16 W16/W17 sources: original walk, live-wood, 34 far zones, 224/1698 previous beams; never claim rated long bays',()=>{
 assert.equal(B.length,16);
 const totals={buildings:0,roof:0,walkClear:0,anchors:0,priorSpans:0,priorBeams:0,
  originalFar:0,originalZones:0,longBayCandidates:0,selectedLongSpans:0,
  proposedLongCells:0,unratedJoints:0,hypotheticalFar:0,hypotheticalReduction:0};
 const bins=[];
 for(const b of B){
  const cells=b.cells.length,nav=b.navigation.length,first=b.cells[0],firstNav=b.navigation[0];
  const {a,s,z}=p(b),v=auditD28OriginalLongBayArchitecture(b,a,s,z);
  assert.equal(v.sourceRoofAsset,'live:wood');
  assert.equal(v.priorShortSpanCount,a.proposedTrussSpans.length+s.proposedTrussSpans.length+z.thirdLaneProposedSpans.length);
  assert.equal(v.priorCompositeBeamSites,a.proposedBeamCells.length+s.proposedBeamCells.length+z.thirdLaneProposedCells.length);
  assert.equal(v.originalUnresolvedZones,z.unresolvedRoofZoneCount);
  assert.equal(v.genuineRoofFarBefore,z.afterD25HypotheticalBeyondRadius);
  assert.equal(v.noApprovedMomentRatedJoint,true);
  assert.equal(v.noApprovedLongSpanTimberStrength,true);
  assert.equal(v.noCalibratedRoofTributaryWeight,true);
  assert.equal(v.structuralRoofSupportAccepted,false);
  assert.equal(v.canBuildLongBays,false);
  assert.equal(v.noWorldOrOriginalBlueprintEdits,true);
  assert.equal(v.noInteriorPierInsertion,true);
  assert.equal(v.hypotheticalFarAfterAddingUnratedMidpointSeeds+v.purelyHypotheticalFarCellReduction,v.genuineRoofFarBefore);
  assert.ok(v.selectedGeometricalLongBays.length<=4);
  for(const span of v.selectedGeometricalLongBays){
   assert.ok(span.Y6UnoccupiedOriginalColumns>=13);
   assert.equal(span.constructionApproved,false);
   assert.equal(span.ratedLongSpan,false);
   assert.equal(span.jointMomentRatingUnproven,true);
   assert.equal(span.demand.timberBendingStiffnessEI,null);
   assert.ok(Math.abs(span.originalPack2FaceJointArea-.36)<1e-8);
   const map=new Map(b.cells.map(c=>[K(c.at),c]));
   const [x,,z]=span.sourceMidpoint;
   assert.equal(map.has(K([x,6,z])),false);
   assert.equal(map.get(K([x,7,z]))?.asset,'live:wood');
  }
  assert.equal(b.cells.length,cells);assert.equal(b.navigation.length,nav);
  assert.strictEqual(b.cells[0],first);assert.strictEqual(b.navigation[0],firstNav);
  totals.buildings++;totals.roof+=v.originalRoofCells;totals.walkClear+=v.allClearY2toY6ColumnsCoveredByAuthoredWalk;
  totals.anchors+=v.verifiedFoundationWallColumns;totals.priorSpans+=v.priorShortSpanCount;
  totals.priorBeams+=v.priorCompositeBeamSites;totals.originalFar+=v.genuineRoofFarBefore;
  totals.originalZones+=v.originalUnresolvedZones;totals.longBayCandidates+=v.geometricallyPossibleUnratedLongBays;
  totals.selectedLongSpans+=v.selectedGeometricalLongBays.length;totals.proposedLongCells+=v.suggestedUninstalledLongBeamCells;
  totals.unratedJoints+=v.suggestedUnratedAxialJoints;totals.hypotheticalFar+=v.hypotheticalFarAfterAddingUnratedMidpointSeeds;
  totals.hypotheticalReduction+=v.purelyHypotheticalFarCellReduction;
  bins.push({id:b.id,far:v.genuineRoofFarBefore,zones:v.originalUnresolvedZones,
   possibleLongBays:v.geometricallyPossibleUnratedLongBays,
   boundedLongBays:v.selectedGeometricalLongBays.length,
   longCells:v.suggestedUninstalledLongBeamCells,
   projectedFar:v.hypotheticalFarAfterAddingUnratedMidpointSeeds,
   noRoofTopTier:v.selectedGeometricalLongBays.filter(q=>q.originalRoofY8OrY9OccupiedColumns===0).length});
 }
 assert.deepEqual({buildings:totals.buildings,roof:totals.roof,walkClear:totals.walkClear,
  anchors:totals.anchors,priorSpans:totals.priorSpans,priorBeams:totals.priorBeams,
  originalFar:totals.originalFar,originalZones:totals.originalZones},
  {buildings:16,roof:115894,walkClear:107819,anchors:6273,
   priorSpans:224,priorBeams:1698,originalFar:59412,originalZones:34});
 console.log('D28 SOURCE-ONLY LONG-BAY TOTALS '+JSON.stringify(totals));
 console.log('D28 SOURCE-ONLY LONG-BAY BINS '+JSON.stringify(bins));
});
test('D28 original source refuses forged roof, missing actual navigation, false approved status and disallowed planning budgets',()=>{
 const b=B[0],{a,s,z}=p(b);
 const one=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.throws(()=>auditD28OriginalLongBayArchitecture({...b,cells:b.cells.map(c=>c===one?{...c,asset:'pack3:023'}:c)},a,s,z),/roof material|original roof/);
 const roofs=new Set(b.cells.filter(c=>c.at[1]===7&&c.feature==='weather-plane').map(c=>c.at[0]+','+c.at[2]));
 const oneWalk=b.navigation.find(n=>n.at[1]===2&&roofs.has(n.at[0]+','+n.at[2]));
 assert.ok(oneWalk);
 assert.throws(()=>auditD28OriginalLongBayArchitecture({...b,navigation:b.navigation.filter(n=>n!==oneWalk)},a,s,z),/navigation|WALK/);
 assert.throws(()=>auditD28OriginalLongBayArchitecture({...b,creatorApproved:true},a,s,z),/D26 requires unplaced authentic D25 unapproved live:wood roof source/);
 for(const options of [{maxInteriorCells:49},{minInteriorCells:12},{maxReportedSpans:9},
  {maxProposedBeamCells:385},{distanceLimit:0},{maximumCandidates:99}])
  assert.throws(()=>auditD28OriginalLongBayArchitecture(b,a,s,z,options),/budget/);
});
