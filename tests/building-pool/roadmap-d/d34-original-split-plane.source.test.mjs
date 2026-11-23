// NEW D34 original-source W16/W17 test only; exact previous CI outcomes reused.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD34OriginalParallelPlaneWebs}
 from '../../../src/building-pool/roadmap-d/d34-original-split-plane-roof-audit.mjs';
const buildings=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const primary=planD19SourceProvenRoofTrusses(b),secondary=planD22SecondaryOriginalRoofTrusses(b,{existing:primary});
 return [primary,secondary,planD25OriginalLiveWoodRoofZones(b,primary,secondary)];};
test('all 16 actual W16/W17 original source buildings: exact 1226 D33 residual-pair provenance and independent D34 lateral section/roof collision ledger',()=>{
 assert.equal(buildings.length,16);
 const totals={buildings:0,roof:0,far:0,zones:0,longBays:0,members:0,diagonals:0,pins:0,
  oldSamePlane:0,newSplitPlane:0,oldDiagonalTop:0,oldDiagonalBottom:0,
  contactFacePairs:0,contactArea:0,sourceClashes:0,roofClashes:0,wallClashes:0,
  walkingProbeClashes:0,collisionFreeDiagonalWebs:0,sourceClashingDiagonalWebs:0,
  sampledMesh:0,maxMeshRayDelta:0};const bins=[];
 for(const b of buildings){
  const [p,s,d25]=plan(b),before={n:b.cells.length,nav:b.navigation.length,
    first:b.cells[0],last:b.cells.at(-1),firstNav:b.navigation[0]};
  const r=auditD34OriginalParallelPlaneWebs(b,p,s,d25);
  assert.equal(r.structuralReleaseAccepted,false);
  assert.equal(r.availableForConstruction,false);
  assert.equal(r.originalRegisteredOwnersUntouched,true);
  assert.equal(r.originalY7LiveWoodPreserved,true);
  assert.equal(r.originalY8Y9TiersUnchanged,true);
  assert.equal(r.authoredWalkingRoutesUnchanged,true);
  assert.equal(r.originalWorldAndSaveUntouched,true);
  assert.equal(r.worldCellChanges,0);
  assert.equal(r.positiveAreaContactCannotSubstituteRatedFastener,true);
  assert.equal(r.noAuthenticatedRealGravityOrUpliftTransfer,true);
  assert.equal(r.sourceMeshNeedsRealJointEndcaps,true);
  assert.equal(r.shiftedWebRoofOrUpperTierCollisions,0);
  assert.equal(r.shiftedWebWalkEnvelopeCollisions,0);
  assert.equal(b.cells.length,before.n);assert.equal(b.navigation.length,before.nav);
  assert.strictEqual(b.cells[0],before.first);assert.strictEqual(b.cells.at(-1),before.last);
  assert.strictEqual(b.navigation[0],before.firstNav);
  totals.buildings++;totals.roof+=r.originalLiveWoodRoofCells;
  totals.far+=r.originalDistantRoofCellsStillUncertified;totals.zones+=r.originalUncertifiedFarZones;
  totals.longBays+=r.longBays;totals.members+=r.originalSourceMembers;
  totals.diagonals+=r.originalDiagonalWebs;totals.pins+=r.sourcePinNodes;
  totals.oldSamePlane+=r.originalD33SamePlanePairs;totals.newSplitPlane+=r.originalD34SplitPlanePairs;
  totals.oldDiagonalTop+=r.samePlaneDiagonalTopChordPairs;
  totals.oldDiagonalBottom+=r.samePlaneDiagonalBottomChordPairs;
  totals.contactFacePairs+=r.crossPlaneUnratedSurfaceFacePairs;
  totals.contactArea+=r.crossPlaneGeometricFaceArea;
  totals.sourceClashes+=r.newlyShiftedWebOriginalCellCollisions;
  totals.roofClashes+=r.shiftedWebRoofOrUpperTierCollisions;
  totals.wallClashes+=r.shiftedWebOriginalRootedWallClashes;
  totals.walkingProbeClashes+=r.shiftedWebWalkEnvelopeCollisions;
  totals.collisionFreeDiagonalWebs+=r.zeroSourceCellClashDiagonalWebs;
  totals.sourceClashingDiagonalWebs+=r.shiftedWebsWithCellClashes;
  totals.sampledMesh+=r.originalColoredMeshSamples;
  totals.maxMeshRayDelta=Math.max(totals.maxMeshRayDelta,r.maxSourceMeshRayVsColliderDelta);
  bins.push({id:b.id,spans:r.longBays,diagonals:r.originalDiagonalWebs,
   oldSamePlane:r.originalD33SamePlanePairs,newSplitPlane:r.originalD34SplitPlanePairs,
   originalSourceCellClashes:r.newlyShiftedWebOriginalCellCollisions,
   actualNonratedFaceArea:r.crossPlaneGeometricFaceArea});
 }
 assert.deepEqual({buildings:totals.buildings,roof:totals.roof,far:totals.far,zones:totals.zones,
  spans:totals.longBays,members:totals.members,pins:totals.pins,diagonals:totals.diagonals},
  {buildings:16,roof:115894,far:59412,zones:34,spans:64,members:2516,pins:1354,diagonals:677});
 assert.equal(totals.oldSamePlane,1226); // exact D32/D33 current colliding source parts
 assert.equal(totals.oldDiagonalTop+totals.oldDiagonalBottom,1226);
 assert.equal(totals.newSplitPlane,0); // original-owner OBB geometry, NOT installed joints
 assert.equal(totals.roofClashes,0);
 assert.equal(totals.walkingProbeClashes,0);
 assert.equal(totals.sampledMesh,16);
 assert.ok(totals.maxMeshRayDelta<.004);
 assert.equal(totals.collisionFreeDiagonalWebs+totals.sourceClashingDiagonalWebs,677);
 console.log('D34 ORIGINAL SOURCE 16-BUILDING LATERAL WEB TOTALS '+JSON.stringify(totals));
 console.log('D34 ORIGINAL SOURCE BINS '+JSON.stringify(bins));
});
test('D34 unchanged original material, walking node and non-approval remain mandatory',()=>{
 const b=buildings[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 const altered={...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)};
 assert.throws(()=>auditD34OriginalParallelPlaneWebs(altered,p,s,d25),
  /D25|D26|D27|D28|D29|D34|roof|material|original|source|wood/i);
 assert.throws(()=>auditD34OriginalParallelPlaneWebs({...b,creatorApproved:true},p,s,d25),
  /original|unregistered|unplaced|source|D28|D29/i);
 assert.throws(()=>auditD34OriginalParallelPlaneWebs({...b,navigation:b.navigation.slice(1)},p,s,d25),
  /WALK|navigation|original|D25|D26|D27|D28|D29|source/i);
 assert.equal(roof.asset,'live:wood');
});
