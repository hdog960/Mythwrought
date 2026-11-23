// NEW D33 original-only W16/17 source check, not repeated historical D25-D32 suites.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD33OriginalSourceOutboardCheeks}
 from '../../../src/building-pool/roadmap-d/d33-original-source-cheek-port-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const p=b=>{const primary=planD19SourceProvenRoofTrusses(b),secondary=planD22SecondaryOriginalRoofTrusses(b,{existing:primary});
 return [primary,secondary,planD25OriginalLiveWoodRoofZones(b,primary,secondary)];};
test('AUTHENTIC 16 W16/W17 sources: 1354 theoretical pins, all original materials, source ID62 cheek envelopes and D32 collision ledger',()=>{
 assert.equal(B.length,16);
 const totals={buildings:0,originalLiveWoodRoofCells:0,originalDistantRoofCellsUncertified:0,
  originalFarZones:0,longBays:0,idealMembers:0,sourcePinNodes:0,
  rootedWallPinNodes:0,interiorPinNodes:0,sourceOwnedOriginalPostCheeks:0,
  originalMemberOverlapPairs:0,remainingOverlapPairsAfterD33Cutback:0,
  postToMemberCollisions:0,postToAuthoredSourceCollisions:0,
  interiorPinsWithClearCheekAndMemberEnvelopes:0,rootedWallPinsRejected:0,
  geometricallyRejectedInteriorPins:0,sourceOwnerMeshesSampled:0,
  previewBytes:0,maxMeshColliderRayDisagreement:0,worldCellsModified:0};
 const bins=[];
 for(const b of B){
  const [first,second,d25]=p(b),before=b.cells.length,nav=b.navigation.length,
   a=b.cells[0],last=b.cells.at(-1),n=b.navigation[0];
  const x=auditD33OriginalSourceOutboardCheeks(b,first,second,d25);
  assert.equal(x.actualFastenerAndEndCapMeshMissing,true);
  assert.equal(x.zeroColliderOverlapCannotServeAsTestedPhysicalSocket,true);
  assert.equal(x.structuralReleaseAccepted,false);
  assert.equal(x.constructionAllowed,false);
  assert.equal(x.originalSourceWoodRoofUnchanged,true);
  assert.equal(x.originalUpperTierUnchanged,true);
  assert.equal(x.originalWalkingRouteUnchanged,true);
  assert.equal(x.allOriginal285SourceIdsPreserved,true);
  assert.equal(x.originalSourceOwnerPaletteUnmodified,true);
  assert.equal(x.actualMemberStressRatingsAndFoundationReactionsUnverified,true);
  assert.equal(x.savesWritten,0);
  assert.strictEqual(b.cells.length,before);
  assert.strictEqual(b.navigation.length,nav);
  assert.strictEqual(b.cells[0],a);assert.strictEqual(b.cells.at(-1),last);
  assert.strictEqual(b.navigation[0],n);
  for(const k of Object.keys(totals)){
   if(k==='maxMeshColliderRayDisagreement')totals[k]=Math.max(totals[k],x[k]);
   else totals[k]+=x[k];
  }
  bins.push({id:b.id,spans:x.longBays,members:x.idealMembers,
   pins:x.sourcePinNodes,interior:x.interiorPinNodes,wall:x.rootedWallPinNodes,
   clearCheekPorts:x.interiorPinsWithClearCheekAndMemberEnvelopes,
   memberClashes:x.remainingOverlapPairsAfterD33Cutback,
   postMemberClashes:x.postToMemberCollisions,
   sourceCellClashes:x.postToAuthoredSourceCollisions});
 }
 assert.deepEqual({buildings:totals.buildings,roofs:totals.originalLiveWoodRoofCells,
  uncertified:totals.originalDistantRoofCellsUncertified,zones:totals.originalFarZones,
  spans:totals.longBays,members:totals.idealMembers,pins:totals.sourcePinNodes,
  wall:totals.rootedWallPinNodes,interior:totals.interiorPinNodes},
  {buildings:16,roofs:115894,uncertified:59412,zones:34,spans:64,members:2516,
   pins:1354,wall:128,interior:1226});
 assert.equal(totals.originalMemberOverlapPairs,6002);
 assert.ok(totals.remainingOverlapPairsAfterD33Cutback<=1226);
 assert.equal(totals.rootedWallPinsRejected,128);
 assert.equal(totals.sourceOwnedOriginalPostCheeks,2708);
 assert.equal(totals.sourceOwnerMeshesSampled,16);
 assert.ok(totals.previewBytes>0);
 assert.ok(totals.maxMeshColliderRayDisagreement<.004);
 assert.equal(totals.worldCellsModified,0);
 console.log('D33 ACTUAL ORIGINAL SOURCE ID62 CHEEK TOTALS '+JSON.stringify(totals));
 console.log('D33 ACTUAL ORIGINAL SOURCE ID62 CHEEK BINS '+JSON.stringify(bins));
});
test('D33 source-authentic fail closed: false roof material, creator approval, missing original WALK',()=>{
 const b=B[0],[first,second,d25]=p(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.ok(roof?.asset==='live:wood');
 const altered={...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)};
 assert.throws(()=>auditD33OriginalSourceOutboardCheeks(altered,first,second,d25),
  /D25|D26|D27|D28|D29|D33|roof|material|original|source/i);
 assert.throws(()=>auditD33OriginalSourceOutboardCheeks({...b,creatorApproved:true},first,second,d25),
  /source|original|unregistered|unplaced|D28|D29/i);
 assert.throws(()=>auditD33OriginalSourceOutboardCheeks({...b,navigation:b.navigation.slice(1)},first,second,d25),
  /WALK|navigation|D25|D26|D27|D28|D29|original|source/i);
 assert.equal(roof.asset,'live:wood');
});
