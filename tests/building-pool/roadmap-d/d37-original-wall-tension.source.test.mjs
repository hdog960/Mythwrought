// D37 genuine original Wave16/Wave17 checkout only. No D25–D36 suite replay.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD37AuthenticOriginalWallPulloutAndBodyFit}
 from '../../../src/building-pool/roadmap-d/d37-original-wall-tension-proof-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plans=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D37 original sixteen buildings: source-derived 128 root diagonals physically demand TENSILE anchors; real engine AABB body-fit and all roof/source/ID vetoes',()=>{
 assert.equal(B.length,16);
 const totals={buildings:0,roof:0,far:0,zones:0,spans:0,roots:0,tensile:0,
  facePaired:0,sourceClear:0,bodyProbes:0,bodyVetoes:0,
  wallFaceArea:0,webFaceArea:0,minTension:Infinity,maxTension:0,maxPulloutStress:0,maxWebStress:0,
  ratedAnchors:0,constructionApproved:0,originalWorldChanges:0};
 const bins=[];
 for(const b of B){
  const [p,s,d25]=plans(b),snapshot=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]];
  const a=auditD37AuthenticOriginalWallPulloutAndBodyFit(b,p,s,d25);
  assert.equal(a.constructionAllowed,false);assert.equal(a.physicalLoadCertification,false);
  assert.equal(a.actualSocketFastenersMissing,true);
  assert.equal(a.wallFaceContactDoesNotAnchorTension,true);
  assert.equal(a.realStructuralTensionConnectionsUnapproved,true);
  assert.equal(a.noRegisteredConvexShapeIn32BoxOriginalRuntime,true);
  assert.equal(a.hypotheticalConservativeBodyDoesNotAcceptActualPlayerPhysics,true);
  assert.equal(a.originalSourcePack2ColorsAndShapesUntouched,true);
  assert.equal(a.worldSavesWritten,0);assert.equal(a.originalWorldCellsChanged,0);
  assert.equal(a.rootTensionWantsAnchors,a.rootDiagonals);
  assert.equal(a.verifiedSourceClearSockets,a.rootDiagonals);
  assert.equal(a.socketCandidatesWithGenuineTwoFaceGeometry,a.rootDiagonals);
  assert.equal(a.compressionOnlyAdmittedRoots,0);assert.equal(a.validatedStructuralAnchors,0);
  assert.ok(a.minimumRootNormalizedTension>0&&a.maximumRootNormalizedTension>=a.minimumRootNormalizedTension);
  assert.ok(a.maximumOriginalWallPulloutStressCoefficient>0);
  assert.ok(a.originalEngineBodyFitProbes>=a.rootDiagonals);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],snapshot);
  totals.buildings++;totals.roof+=a.originalRoofCells;totals.far+=a.originalDistantRoofCellsStillUncertified;
  totals.zones+=a.originalUncertifiedFarZones;totals.spans+=a.longBays;totals.roots+=a.rootDiagonals;
  totals.tensile+=a.rootTensionWantsAnchors;totals.facePaired+=a.socketCandidatesWithGenuineTwoFaceGeometry;
  totals.sourceClear+=a.verifiedSourceClearSockets;totals.bodyProbes+=a.originalEngineBodyFitProbes;
  totals.bodyVetoes+=a.originalEngineBodyFitVetoes;totals.wallFaceArea+=a.wallGeometricFaceAreaSum;
  totals.webFaceArea+=a.webGeometricFaceAreaSum;
  totals.minTension=Math.min(totals.minTension,a.minimumRootNormalizedTension);
  totals.maxTension=Math.max(totals.maxTension,a.maximumRootNormalizedTension);
  totals.maxPulloutStress=Math.max(totals.maxPulloutStress,a.maximumOriginalWallPulloutStressCoefficient);
  totals.maxWebStress=Math.max(totals.maxWebStress,a.maximumWebTensionStressCoefficient);
  bins.push({id:b.id,bays:a.longBays,rootTension:a.rootDiagonals,sourceBodyProbes:a.originalEngineBodyFitProbes,
   maxTension:a.maximumRootNormalizedTension,unratedFasteners:a.rootTensionWantsAnchors});
 }
 assert.deepEqual({buildings:totals.buildings,roof:totals.roof,far:totals.far,zones:totals.zones,
  longBays:totals.spans,roots:totals.roots,tensile:totals.tensile,
  pairedContacts:totals.facePaired,sourceClear:totals.sourceClear},
  {buildings:16,roof:115894,far:59412,zones:34,longBays:64,roots:128,
   tensile:128,pairedContacts:128,sourceClear:128});
 assert.ok(Math.abs(totals.wallFaceArea-2.304)<1e-6);
 assert.ok(Math.abs(totals.webFaceArea-29.4912)<1e-6);
 assert.equal(totals.ratedAnchors,0);
 assert.equal(totals.constructionApproved,0);
 assert.equal(totals.originalWorldChanges,0);
 assert.equal(totals.bodyVetoes,0,'new conservative original AABB adapter must leave actual W16/W17 Y2 walking route clear');
 console.log('D37 AUTHENTIC ORIGINAL PULLOUT ANCHOR/BODY TOTALS '+JSON.stringify(totals));
 console.log('D37 ORIGINAL W16 W17 PULLOUT BINS '+JSON.stringify(bins));
});
test('D37 exact original author must refuse altered Y7 wood, creator approval and deleted original WALK',()=>{
 const b=B[0],[p,s,d25]=plans(b),original=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(original?.asset,'live:wood');
 assert.throws(()=>auditD37AuthenticOriginalWallPulloutAndBodyFit({...b,creatorApproved:true},p,s,d25),
  /unplaced|source|original|D28|D29|D37/);
 assert.throws(()=>auditD37AuthenticOriginalWallPulloutAndBodyFit({...b,cells:b.cells.map(c=>c===original?{...c,asset:'live:stone'}:c)},p,s,d25),
  /source|wood|roof|D25|D26|D27|D28|D29|D37|original/);
 assert.throws(()=>auditD37AuthenticOriginalWallPulloutAndBodyFit({...b,navigation:b.navigation.slice(1)},p,s,d25),
  /source|WALK|navigation|original|D25|D26|D27|D28|D29|D37/);
 assert.equal(original.asset,'live:wood');
});
