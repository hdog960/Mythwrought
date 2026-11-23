// NEW D43 tests only; all W16/W17 authors are imported from the GENUINE repo.
// D25–D42 historical tests are reused from verified exact commits, not rerun.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS}
 from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS}
 from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses}
 from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses}
 from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones}
 from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD43OriginalIndependentOutboardAnchorage}
 from '../../../src/building-pool/roadmap-d/d43-original-independent-support-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plans=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D43 genuine original source W16/W17: exact D42 categories plus independently sourced outboard footing/corridor and owner-palette negative capacity evidence',()=>{
 assert.equal(B.length,16);
 const totals={buildings:0,roofs:0,far:0,zones:0,bays:0,roots:0,
  d42Disconnected:0,d42RearBlocked:0,d42Winding:0,d42OneBarrier:0,d42ZeroBarrier:0,
  actualTangentialWitnesses:0,originalExistingRootedSiteObservations:0,
  emptyOriginalGroundSiteObservations:0,sourceClearVirtualPylonObservations:0,
  sourceSolidPylonVetoes:0,walkPylonVetoes:0,tieCandidates:0,sweptTieEdges:0,
  solidTieVetoEvents:0,walkTieVetoEvents:0,socketTieVetoEvents:0,
  geometricallyClearOutboardCorridors:0,unverifiedTerrainFootings:0,
  ownerPaletteRaySamples:0,maxRayDelta:0,sourceWrites:0};
 const bin=[];
 for(const b of B){
  const [p,s,d25]=plans(b),before=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
  const r=auditD43OriginalIndependentOutboardAnchorage(b,p,s,d25);
  assert.equal(r.originalBarrierCategoriesRetained,true);
  assert.equal(r.identicalOriginalRegisteredPack2Ids61And62,true);
  assert.equal(r.tangentialExteriorSideHasNoAxialNormalTensileRetention,true);
  assert.equal(r.virtualClearPylonSiteCannotProveTerrainOrSeparableFoundation,true);
  assert.equal(r.existingAuthorRootNotIndependentRatedAnchor,true);
  assert.equal(r.noVerifiedSocketToOutboardTieFastener,true);
  assert.equal(r.generatedWorldGroundAndCavePreservationNotAccepted,true);
  assert.equal(r.allOriginalY7WoodAndWalkPreserved,true);
  assert.equal(r.newRealConstructionApproved,false);assert.equal(r.constructionAllowed,false);
  assert.equal(r.realRatedWallToTieConnections,0);assert.equal(r.realApprovedIndependentGroundFootings,0);
  assert.equal(r.independentRatedExistingSupports,0);assert.equal(r.worldWrites,0);assert.equal(r.savesWritten,0);
  assert.equal(r.actualTangentialNormalAxialContact,0);
  assert.equal(r.sourceClearOutboardTieCorridors,r.speculativeOutboardFootingsWithoutTerrainProof);
  assert.ok(r.largestSourcePaletteMeshRayDisagreement<1e-5);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],before);
  totals.buildings++;totals.roofs+=r.originalRoof;totals.far+=r.originalUncertifiedRoofCells;
  totals.zones+=r.originalUncertifiedFarZones;
  totals.bays+=r.longBays;totals.roots+=r.tensileRootStudies;
  totals.d42Disconnected+=r.originalD42Disconnected;totals.d42RearBlocked+=r.originalD42RearBlocked;
  totals.d42Winding+=r.originalD42WindingUnavailable;
  totals.d42OneBarrier+=r.originalD42OneBlockedCenter;
  totals.d42ZeroBarrier+=r.originalD42ZeroBlockedCenters;
  totals.actualTangentialWitnesses+=r.actualFrontReachableTangentialWitnesses;
  totals.originalExistingRootedSiteObservations+=r.originalExistingRootedSupportSiteObservations;
  totals.emptyOriginalGroundSiteObservations+=r.originalEmptyGroundLayerFootprintObservations;
  totals.sourceClearVirtualPylonObservations+=r.sourceClearVerticalPylonEnvelopeObservations;
  totals.sourceSolidPylonVetoes+=r.sourceSolidPylonVetoObservations;
  totals.walkPylonVetoes+=r.authoredWalkPylonVetoObservations;
  totals.tieCandidates+=r.candidatePylonCorridorsStudied;
  totals.sweptTieEdges+=r.finiteSweptTieEdgesExamined;
  totals.solidTieVetoEvents+=r.sourceSolidTieEdgeVetoEvents;
  totals.walkTieVetoEvents+=r.walkingBodyTieEdgeVetoEvents;
  totals.socketTieVetoEvents+=r.socketTieEdgeVetoEvents;
  totals.geometricallyClearOutboardCorridors+=r.sourceClearOutboardTieCorridors;
  totals.unverifiedTerrainFootings+=r.speculativeOutboardFootingsWithoutTerrainProof;
  totals.ownerPaletteRaySamples+=r.sourcePaletteMeshRaySamples;
  totals.maxRayDelta=Math.max(totals.maxRayDelta,r.largestSourcePaletteMeshRayDisagreement);
  totals.sourceWrites+=r.worldWrites;
  bin.push({building:b.id,bays:r.longBays,roots:r.tensileRootStudies,
   alreadyRootedOriginalSourcePositions:r.originalExistingRootedSupportSiteObservations,
   unverifiedOpenExteriorFootprints:r.sourceClearVerticalPylonEnvelopeObservations,
   exteriorTieCorridorsSourceClear:r.sourceClearOutboardTieCorridors,
   notRated:true});
 }
 assert.deepEqual({buildings:totals.buildings,roof:totals.roofs,far:totals.far,zones:totals.zones,
  bays:totals.bays,roots:totals.roots,disconnected:totals.d42Disconnected,
  rearBlocked:totals.d42RearBlocked,winding:totals.d42Winding,
  oneCenter:totals.d42OneBarrier,zeroCenter:totals.d42ZeroBarrier},
  {buildings:16,roof:115894,far:59412,zones:34,bays:64,roots:128,
   disconnected:105,rearBlocked:21,winding:2,oneCenter:126,zeroCenter:2});
 assert.equal(totals.ownerPaletteRaySamples,16);
 assert.equal(totals.geometricallyClearOutboardCorridors,totals.unverifiedTerrainFootings);
 assert.equal(totals.sourceWrites,0);
 console.log('D43 AUTHENTIC ORIGINAL W16-W17 EXTERIOR FOOTING AND TIE OBSERVATIONS '+JSON.stringify(totals));
 console.log('D43 AUTHENTIC ORIGINAL SOURCE BY BUILDING '+JSON.stringify(bin));
});
test('D43 exact original wood weather plane, authored WALK and never-creator-approved source gate refuse tampering',()=>{
 const b=B[0],[p,s,d25]=plans(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD43OriginalIndependentOutboardAnchorage({...b,creatorApproved:true},p,s,d25),
  /original|unregistered|source|D28|D29/i);
 assert.throws(()=>auditD43OriginalIndependentOutboardAnchorage({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25),
  /wood|roof|source|original|D25|D26|D27|D28|D29/i);
 assert.throws(()=>auditD43OriginalIndependentOutboardAnchorage({...b,navigation:b.navigation.slice(1)},p,s,d25),
  /original|WALK|navigation|D25|D26|D27|D28|D29|source/i);
 assert.equal(roof.asset,'live:wood');
});
