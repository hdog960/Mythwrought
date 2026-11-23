// D35 ONLY NEW original W16/W17 native tests. D25–D34 historical exact CI reused.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD35OriginalTwoSideRoofDiagonalTerminations}
 from '../../../src/building-pool/roadmap-d/d35-original-double-lane-connector-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D35 exact ORIGINAL sixteen W16/W17 author sources: dual-side original ID61 axial wall escape, independent ID62 two-face connector veto',()=>{
 assert.equal(B.length,16);
 const sums={buildings:0,originalRoof:0,far:0,zones:0,longBays:0,members:0,diagonals:0,pins:0,
  baselinePlusCellHits:0,baselinePlusColliding:0,rootSourceHitEvents:0,
  clear:0,blocked:0,plus:0,minus:0,rootWebs:0,rootCleared:0,rootBlocked:0,
  clearedAfterTrim:0,clearedWithoutTrim:0,missingTwoFaces:0,withTwoFaces:0,
  touchingFacePairs:0,rawUnratedFaceArea:0,roofClashes:0,walkClashes:0,
  postBridgeSamples:0,dualFacePostCandidateSuccess:0,meshSamples:0,
  meshColliderMaxDelta:0,missingMeshCaps:0};
 const bins=[];
 for(const b of B){
  const [p,s,d25]=plan(b),before={n:b.cells.length,nav:b.navigation.length,
   first:b.cells[0],last:b.cells.at(-1),firstNav:b.navigation[0]};
  const r=auditD35OriginalTwoSideRoofDiagonalTerminations(b,p,s,d25);
  assert.equal(r.structuralRoofCertificationAccepted,false);
  assert.equal(r.constructionAllowed,false);
  assert.equal(r.originalSaveWrites,0);assert.equal(r.originalWorldCellsWritten,0);
  assert.equal(r.sourceClearIsNotIndependentRatedConnector,true);
  assert.equal(r.twoTouchingFacesWithoutFastenersCannotCarryRatedLoad,true);
  assert.equal(r.sourceColoredDerivedMemberEndCapsUnauthored,true);
  assert.equal(r.originalSourcePack2OwnerShapesUnchanged,true);
  assert.equal(r.originalRootFoundationsAndWallsUnmodified,true);
  assert.equal(r.originalY7WoodAndY8Y9TiersUnchanged,true);
  assert.equal(r.allAuthoredWALKUnmodified,true);
  assert.equal(r.upperRoofSourceClashesAfterSelection,0);
  assert.equal(r.authoredWalkBodyClashesAfterSelection,0);
  assert.equal(b.cells.length,before.n);assert.equal(b.navigation.length,before.nav);
  assert.strictEqual(b.cells[0],before.first);assert.strictEqual(b.cells.at(-1),before.last);
  assert.strictEqual(b.navigation[0],before.firstNav);
  sums.buildings++;sums.originalRoof+=r.originalLiveWoodRoofCells;
  sums.far+=r.originalDistantRoofCellsStillUncertified;sums.zones+=r.originalUncertifiedFarZones;
  sums.longBays+=r.longBays;sums.members+=r.members;sums.diagonals+=r.diagonalWebs;
  sums.pins+=r.pins;sums.baselinePlusCellHits+=r.originalUnmodifiedPlusCellEvents;
  sums.baselinePlusColliding+=r.originalPlusCollisionWebs;sums.rootSourceHitEvents+=r.originalPlusRootWebSourceEvents;
  sums.clear+=r.geometricallySourceClearDiagonalWebs;sums.blocked+=r.sourceBlockedBothSides;
  sums.plus+=r.selectedPlusSide;sums.minus+=r.selectedMinusSide;
  sums.rootWebs+=r.rootIncidentWebs;sums.rootCleared+=r.rootTerminationSourceClear;
  sums.rootBlocked+=r.rootTerminationStillBlocked;
  sums.clearedAfterTrim+=r.sourceClearAfterWallCutback;
  sums.clearedWithoutTrim+=r.sourceClearWithoutWallCutback;
  sums.missingTwoFaces+=r.sourceClearYetMissingTwoContactPatches;
  sums.withTwoFaces+=r.sourceClearWithTwoContactPatches;
  sums.touchingFacePairs+=r.geometricallyObservedFacePairs;
  sums.rawUnratedFaceArea+=r.summedUnratedLateralArea;
  sums.roofClashes+=r.upperRoofSourceClashesAfterSelection;
  sums.walkClashes+=r.authoredWalkBodyClashesAfterSelection;
  sums.postBridgeSamples+=r.independentPostBridgeStudies;
  sums.dualFacePostCandidateSuccess+=r.independentPostBridgeGeometryPass;
  sums.meshSamples+=r.originalOwnerColoredMeshSamples;
  sums.meshColliderMaxDelta=Math.max(sums.meshColliderMaxDelta,r.maxOriginalOwnerRayVsMeshDelta);
  sums.missingMeshCaps+=r.endCapMeshUnimplementedSamples;
  bins.push({id:b.id,longBays:r.longBays,diagonals:r.diagonalWebs,
   originalPlusHits:r.originalUnmodifiedPlusCellEvents,
   selectedClear:r.geometricallySourceClearDiagonalWebs,
   rejected:r.sourceBlockedBothSides,rootClear:r.rootTerminationSourceClear,
   rootBlocked:r.rootTerminationStillBlocked,sideMinus:r.selectedMinusSide,
   unfastenedTwoFaceWitnesses:r.sourceClearWithTwoContactPatches});
 }
 assert.deepEqual({buildings:sums.buildings,roof:sums.originalRoof,far:sums.far,zones:sums.zones,
  longBays:sums.longBays,members:sums.members,diagonals:sums.diagonals,pins:sums.pins},
  {buildings:16,roof:115894,far:59412,zones:34,longBays:64,members:2516,diagonals:677,pins:1354});
 assert.equal(sums.baselinePlusCellHits,257); // D34 exact original +0.60 source collision events
 assert.equal(sums.baselinePlusColliding,128); // D34 exact shifted-web collision count
 assert.equal(sums.rootWebs,128); // 2 wall-rooted diagonal members per original long bay
 assert.equal(sums.clear+sums.blocked,677);
 assert.equal(sums.plus+sums.minus,sums.clear);
 assert.equal(sums.rootCleared+sums.rootBlocked,128);
 assert.equal(sums.withTwoFaces+sums.missingTwoFaces,sums.clear);
 assert.equal(sums.clearedAfterTrim+sums.clearedWithoutTrim,sums.clear);
 assert.equal(sums.roofClashes,0);assert.equal(sums.walkClashes,0);
 assert.equal(sums.meshSamples,16);assert.ok(sums.meshColliderMaxDelta<.004);
 assert.ok(sums.postBridgeSamples>0&&sums.postBridgeSamples<=64); // four bounded independently-authored probes per source building
 console.log('D35 GENUINE ORIGINAL SIXTEEN-BUILDING ROOTS AND TWO-FACE CONNECTOR TOTALS '+JSON.stringify(sums));
 console.log('D35 GENUINE ORIGINAL SIXTEEN-BUILDING ROOTS BINS '+JSON.stringify(bins));
});
test('D35 fails closed on original unregistered author approval, missing source Y7 wood roof, and deleted original WALK nodes',()=>{
 const b=B[0],[p,s,d25]=plan(b),original=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(original?.asset,'live:wood');
 assert.throws(()=>auditD35OriginalTwoSideRoofDiagonalTerminations({...b,creatorApproved:true},p,s,d25),
  /unplaced|source|original|D28|D29/i);
 assert.throws(()=>auditD35OriginalTwoSideRoofDiagonalTerminations({...b,cells:b.cells.map(c=>c===original?{...c,asset:'live:stone'}:c)},p,s,d25),
  /source|roof|wood|D25|D26|D27|D28|D29/i);
 assert.throws(()=>auditD35OriginalTwoSideRoofDiagonalTerminations({...b,navigation:b.navigation.slice(1)},p,s,d25),
  /original|WALK|source|D25|D26|D27|D28|D29/i);
 assert.equal(original.asset,'live:wood');
});
