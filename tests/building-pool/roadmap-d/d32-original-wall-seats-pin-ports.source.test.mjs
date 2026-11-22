// D32 only NEW genuine original W16/W17 checks. Reuse exact D25–D31 CI evidence.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD32OriginalPack2WallSeatsAndPinPorts}
 from '../../../src/building-pool/roadmap-d/d32-original-wall-seats-pin-port-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('16 ORIGINAL W16/W17 buildings: rooted Pack2 owner wall seat collision caps and exact existing 6002 pin overlap ledger, all source immutable',()=>{
 assert.equal(B.length,16);
 const all={buildings:0,originalRoof:0,far:0,zones:0,spans:0,members:0,nodes:0,
  diagonal:0,wallHitsBefore:0,wallSeatsCleared:0,unseatable:0,
  horizontalEnds:0,diagonalEnds:0,originalJointOverlapPairs:0,
  remainingJointOverlapPairs:0,unratedGapNodes:0};const bin=[];
 for(const b of B){
  const [p,s,d25]=plan(b),n=b.cells.length,nn=b.navigation.length,
   a=b.cells[0],z=b.cells.at(-1),nav=b.navigation[0];
  const x=auditD32OriginalPack2WallSeatsAndPinPorts(b,p,s,d25);
  assert.equal(x.constructionAllowed,false);
  assert.equal(x.liveRoofSupportedByThisStudy,false);
  assert.equal(x.worldCellsModified,0);assert.equal(x.savesWritten,0);
  assert.equal(x.originalY7LiveWoodPreserved,true);assert.equal(x.originalY8Y9Preserved,true);
  assert.equal(x.allWALKUnchanged,true);assert.equal(x.noAuthoredFoundationOrWallEdited,true);
  assert.equal(x.originalRegisteredPack2ShapesUnchanged,true);
  assert.equal(x.horizontalWallFaceContactRequiresRealFastener,true);
  assert.equal(x.diagonalRootAxialCutCannotProveWallFaceLoadTransfer,true);
  assert.equal(x.jointGapCannotTransferOriginalTrussAxialLoads,true);
  assert.equal(x.realOwnerMeshCapUnimplemented,true);
  assert.equal(x.originalWallPenetratingMemberShapes,x.sourceProtectedClearanceSeats+x.unseatableRootMembers);
  assert.ok(x.originalOverlappingPinPairs>=x.residualAfterUnregisteredClearancePorts);
  assert.equal(b.cells.length,n);assert.equal(b.navigation.length,nn);
  assert.strictEqual(b.cells[0],a);assert.strictEqual(b.cells.at(-1),z);assert.strictEqual(b.navigation[0],nav);
  all.buildings++;all.originalRoof+=x.originalRoofCells;all.far+=x.originalFarRoofCellsStillUncertified;
  all.zones+=x.originalUncertifiedFarZones;all.spans+=x.spans;
  all.members+=x.proposedMemberShapes;all.nodes+=x.idealPinNodes;
  all.diagonal+=x.diagonalWebMembers;all.wallHitsBefore+=x.originalWallPenetratingMemberShapes;
  all.wallSeatsCleared+=x.sourceProtectedClearanceSeats;all.unseatable+=x.unseatableRootMembers;
  all.horizontalEnds+=x.potentialFlatChordSeats;
  all.diagonalEnds+=x.obliqueEndSeatWithoutFaceContact;
  all.originalJointOverlapPairs+=x.originalOverlappingPinPairs;
  all.remainingJointOverlapPairs+=x.residualAfterUnregisteredClearancePorts;
  all.unratedGapNodes+=x.unbuiltJointGaps;
  bin.push({id:b.id,spans:x.spans,members:x.proposedMemberShapes,
   sourceWallHits:x.originalWallPenetratingMemberShapes,sourceProtectedSeats:x.sourceProtectedClearanceSeats,
   originalPinOverlaps:x.originalOverlappingPinPairs,
   remainingAfterClearance:x.residualAfterUnregisteredClearancePorts,unseatable:x.unseatableRootMembers});
 }
 assert.deepEqual({buildings:all.buildings,roofs:all.originalRoof,far:all.far,zones:all.zones,
  spans:all.spans,members:all.members,pins:all.nodes},
  {buildings:16,roofs:115894,far:59412,zones:34,spans:64,members:2516,pins:1354});
 assert.equal(all.diagonal,677);
 assert.equal(all.wallHitsBefore,256); // D31 exact-owner source collision provenance.
 assert.equal(all.originalJointOverlapPairs,6002); // D31 genuine source-owner pin overlap provenance.
 assert.ok(all.wallSeatsCleared>0);
 assert.ok(all.remainingJointOverlapPairs<=all.originalJointOverlapPairs);
 console.log('D32 AUTHENTIC ORIGINAL SOURCE SEAT AND PIN TOTALS '+JSON.stringify(all));
 console.log('D32 AUTHENTIC ORIGINAL SOURCE BIN '+JSON.stringify(bin));
});
test('original rooted wood, creator nonapproval and exact WALK remain mandatory and fail closed',()=>{
 const b=B[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 const fake={...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)};
 assert.throws(()=>auditD32OriginalPack2WallSeatsAndPinPorts(fake,p,s,d25),
  /source|roof|wood|material|D26|D27|D28|D29|original/i);
 assert.throws(()=>auditD32OriginalPack2WallSeatsAndPinPorts({...b,creatorApproved:true},p,s,d25),
  /source|original|unregistered|unplaced|D28/i);
 assert.throws(()=>auditD32OriginalPack2WallSeatsAndPinPorts({...b,navigation:b.navigation.slice(1)},p,s,d25),
  /WALK|navigation|D26|D27|D28|D29|original|source/i);
 assert.equal(roof.asset,'live:wood');
});
