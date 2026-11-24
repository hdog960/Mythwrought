// ONLY NEW D46 genuine original W16/W17 source tests; do not replay D25–D45 CI.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD46OriginalSocketToProspectiveOutboard}
 from '../../../src/building-pool/roadmap-d/d46-original-socket-exterior-continuity-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plans=b=>{const p=planD19SourceProvenRoofTrusses(b),
 s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('AUTHENTIC 16 original W16/W17 D46 joint continuity: exact D45 dogleg provenance, source clearance vs missing positive-area socket connection, full fractional prospective support screening',()=>{
 assert.equal(B.length,16);
 const totals={buildings:0,roof:0,far:0,zones:0,bays:0,roots:0,footprints:0,
  tension:0,originalDogY5:0,originalDogY6:0,oldClearY5:0,oldClearY6:0,
  selectedDogY5:0,selectedDogY6:0,selectedClearY5:0,selectedClearY6:0,
  originalSockets:0,gapY5:0,gapY6:0,neckClear:0,neckBlocked:0,
  zeroFaceArea:0,realCouplers:0,routePairs:0,sourceBodyClearPairs:0,
  allPhysicalClearPairs:0,otherMemberClashes:0,solidEvents:0,walkEvents:0,
  socketEvents:0,clearExtensionY5:0,clearExtensionY6:0,
  connected:0,ground:0,fasteners:0,worldEdits:0,meshSamples:0,maxRayDelta:0};
 const bins=[];
 for(const b of B){
  const [p,s,d25]=plans(b),prev=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   x=auditD46OriginalSocketToProspectiveOutboard(b,p,s,d25,{maxCandidates:12,maxWitnesses:4,maxPaletteSamples:1});
  assert.equal(x.constructionAllowed,false);
  assert.equal(x.originalPack2OwnerGeometryAndRGBUnchanged,true);
  assert.equal(x.originalNavigationAndY7WoodUnchanged,true);
  assert.equal(x.noActualSocketToRailRatedCoupler,true);
  assert.equal(x.noActualOriginalWorldTerrainGroundOrCaveProven,true);
  assert.equal(x.noOriginalTrussMembersOrFootingsInstalled,true);
  assert.equal(x.originalSavesUnwritten,true);
  assert.equal(x.realPositiveAreaSocketCouplers,0);
  assert.equal(x.physicallyConnectedFullAssembly,0);
  assert.equal(x.verifiedGroundFoundation,0);
  assert.equal(x.ratedTensionConnections,0);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],prev);
  totals.buildings++;totals.roof+=x.originalRoof;
  totals.far+=x.originalFarRoofUncertified;totals.zones+=x.originalFarRoofUncertifiedZones;
  const names={bays:'bays',roots:'roots',unverifiedSourceFootprints:'footprints',rootNormalizedTension:'tension',
   originalD45DoglegAttemptsY5:'originalDogY5',originalD45DoglegAttemptsY6:'originalDogY6',
   originalD45DoglegClearY5:'oldClearY5',originalD45DoglegClearY6:'oldClearY6',
   selectedSourceSideDoglegsY5:'selectedDogY5',selectedSourceSideDoglegsY6:'selectedDogY6',
   selectedSideSourceClearY5:'selectedClearY5',selectedSideSourceClearY6:'selectedClearY6',
   authenticatedD36ConvexSocketSamples:'originalSockets',
   selectedSideGapPositiveY5:'gapY5',selectedSideGapPositiveY6:'gapY6',
   sourceClearNeckCandidates:'neckClear',sourceClashingNeckCandidates:'neckBlocked',
   socketExteriorLateralZeroAreaWitnesses:'zeroFaceArea',realPositiveAreaSocketCouplers:'realCouplers',
   prospectiveRoutePairs:'routePairs',fractionalOutboardSourceBodyClearRoutes:'sourceBodyClearPairs',
   completeFractionalOutboardPhysicalRoutes:'allPhysicalClearPairs',
   allOriginalProposedOwnerCollisionEvents:'otherMemberClashes',originalSolidRouteCollisionEvents:'solidEvents',
   authoredWalkRouteCollisionEvents:'walkEvents',originalSocketRouteCollisionEvents:'socketEvents',
   geometricallyClearExtensionY5:'clearExtensionY5',geometricallyClearExtensionY6:'clearExtensionY6',
   physicallyConnectedFullAssembly:'connected',verifiedGroundFoundation:'ground',
   ratedTensionConnections:'fasteners',originalSourceWorldEdits:'worldEdits',
   sourcePaletteRaySamples:'meshSamples'};
  for(const [src,dst] of Object.entries(names))totals[dst]+=x[src];
  totals.maxRayDelta=Math.max(totals.maxRayDelta,x.maxMeshVsRayDelta);
  assert.equal(x.originalD45DoglegAttemptsY5,x.roots*2);
  assert.equal(x.originalD45DoglegAttemptsY6,x.roots*2);
  assert.equal(x.selectedSourceSideDoglegsY5,x.roots);
  assert.equal(x.selectedSourceSideDoglegsY6,x.roots);
  assert.equal(x.socketExteriorLateralZeroAreaWitnesses,x.roots*2);
  assert.equal(x.originalSourceWorldEdits,0);
  bins.push({id:b.id,roots:x.roots,prospectiveSites:x.unverifiedSourceFootprints,
   originalY6ClearDoglegs:x.originalD45DoglegClearY6,
   matchingSideY6Clear:x.selectedSideSourceClearY6,
   physicallyClearOutboardSegments:x.completeFractionalOutboardPhysicalRoutes,
   unprovenSocketCouplers:x.realPositiveAreaSocketCouplers});
 }
 assert.deepEqual({buildings:totals.buildings,roof:totals.roof,far:totals.far,zones:totals.zones,
  bays:totals.bays,roots:totals.roots,originalY5:totals.originalDogY5,originalY6:totals.originalDogY6,
  oldClearY5:totals.oldClearY5,oldClearY6:totals.oldClearY6,footprints:totals.footprints},
  {buildings:16,roof:115894,far:59412,zones:34,bays:64,roots:128,
   originalY5:256,originalY6:256,oldClearY5:233,oldClearY6:233,footprints:1455});
 assert.equal(totals.tension,128);assert.equal(totals.originalSockets,128);
 assert.equal(totals.selectedDogY5,128);assert.equal(totals.selectedDogY6,128);
 assert.equal(totals.gapY5,128);assert.equal(totals.gapY6,128);
 assert.equal(totals.zeroFaceArea,256);assert.equal(totals.realCouplers,0);
 assert.equal(totals.connected,0);assert.equal(totals.ground,0);assert.equal(totals.fasteners,0);
 assert.equal(totals.worldEdits,0);assert.equal(totals.meshSamples,16);
 assert.ok(totals.maxRayDelta<1e-5);
 console.log('D46 GENUINE ORIGINAL W16/W17 SOCKET-EGRESS-OUTBOARD CONTINUITY TOTALS '+JSON.stringify(totals));
 console.log('D46 GENUINE ORIGINAL W16/W17 PER-BUILDING BINS '+JSON.stringify(bins));
});
test('D46 original source protection refuses counterfeit author approval, altered original Y7 wood and lost WALK nodes',()=>{
 const b=B[0],[p,s,d25]=plans(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD46OriginalSocketToProspectiveOutboard({...b,creatorApproved:true},p,s,d25,{maxCandidates:1,maxPaletteSamples:0}),
  /D25|D26|D27|D28|D29|source|original|approval|unplaced/i);
 assert.throws(()=>auditD46OriginalSocketToProspectiveOutboard({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25,{maxCandidates:1,maxPaletteSamples:0}),
  /D25|D26|D27|D28|D29|roof|wood|source|original/i);
 assert.throws(()=>auditD46OriginalSocketToProspectiveOutboard({...b,navigation:b.navigation.slice(1)},p,s,d25,{maxCandidates:1,maxPaletteSamples:0}),
  /D25|D26|D27|D28|D29|WALK|navigation|source|original/i);
 assert.equal(roof.asset,'live:wood');
});
