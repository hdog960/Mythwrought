// ONLY D52 new tests against the real ORIGINAL W16/W17 builder sources.
// Reuse verified D25-D51 historic CI rather than replaying their test suites.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD52OriginalExteriorDogleg} from '../../../src/building-pool/roadmap-d/d52-original-exterior-terminal-audit.mjs';
const BUILDINGS=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D52 exact original 16 W16/W17 source: authenticated D51 108-case prefilter, true exterior dogleg entry and zero unearned structural acceptance',()=>{
 assert.equal(BUILDINGS.length,16);
 const tally={buildings:0,roof:0,far:0,zones:0};
 for(const b of BUILDINGS){
  const [p,s,d25]=plan(b),snapshot=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   report=auditD52OriginalExteriorDogleg(b,p,s,d25,{maxRaySamples:1});
  for(const key of ['buildings','bays','roots','sourceClearSockets','tensileRoots',
   'originalD48Patches','originalD48SourceClear','rootsWithSourceClearPatch',
   'originalD51Proposals','originalD51SupportingHulls','originalD51Rejected',
   'originalD51SourceSocketClear','originalD51FullyClear','D52Proposals',
   'D52ValidSupportingHulls','D52RejectedHull',
   'D52TrueExteriorDoglegEndCaps','D52TerminalDoglegClear',
   'D52ActualSocketFaceContacts','D52ActualDoglegFaceContacts','D52FullSharedCapCount',
   'D52SourceSolidHits','D52WalkingHits','D52SocketHits','D52MemberHits','D52DoglegHits',
   'D52SelfOverlapEvents','D52SourceSocketClear','D52FullyGeometricClear',
   'D52RootsWithAnyGeometryClear','D52SaddlesWithAllFourCourseCandidates',
   'D52RaySamples','realFasteners','registeredOwnerIDs','approvedFootings','buildingSourceWrites','gameplayWrites'])
   tally[key]=(tally[key]??0)+report[key];
  tally.roof+=report.originalRoofCells;tally.far+=report.originalFarRoofUncertified;
  tally.zones+=report.originalFarRegions;tally.D52MaxRayDelta=Math.max(tally.D52MaxRayDelta??0,report.D52MaxRayDelta);
  assert.equal(report.originalPack2AndRootedAuthoredSourceUnmodified,true);
  assert.equal(report.originalAuthorWalkingAndWeatherPlanePreserved,true);
  assert.equal(report.sourceOnlyExteriorFaceContactNotMechanicalRetention,true);
  assert.equal(report.noRealTerrainCaveFootingOrWallStrengthEvidence,true);
  assert.equal(report.productionRendererAndIphonePwaUntested,true);
  assert.equal(report.constructionAllowed,false);
  assert.equal(report.buildingSourceWrites,0);assert.equal(report.gameplayWrites,0);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],snapshot);
 }
 assert.deepEqual({buildings:tally.buildings,roof:tally.roof,far:tally.far,zones:tally.zones,bays:tally.bays,
  roots:tally.roots,sockets:tally.sourceClearSockets,tensile:tally.tensileRoots},
  {buildings:16,roof:115894,far:59412,zones:34,bays:64,roots:128,sockets:128,tensile:128});
 assert.equal(tally.originalD48Patches,512);
 assert.equal(tally.originalD48SourceClear,310);
 assert.equal(tally.rootsWithSourceClearPatch,128);
 assert.equal(tally.originalD51Proposals,2048);
 assert.equal(tally.originalD51SupportingHulls,1232);
 assert.equal(tally.originalD51Rejected,816);
 assert.equal(tally.originalD51SourceSocketClear,108);
 assert.equal(tally.originalD51FullyClear,0);
 assert.equal(tally.D52Proposals,108*6);
 assert.equal(tally.D52ValidSupportingHulls+tally.D52RejectedHull,tally.D52Proposals);
 assert.equal(tally.D52TrueExteriorDoglegEndCaps,tally.D52ValidSupportingHulls);
 assert.equal(tally.D52ActualSocketFaceContacts,tally.D52ValidSupportingHulls);
 assert.equal(tally.D52ActualDoglegFaceContacts,tally.D52ValidSupportingHulls);
 assert.equal(tally.D52FullSharedCapCount,tally.D52ValidSupportingHulls*3);
 assert.ok(tally.D52TerminalDoglegClear>=0&&tally.D52TerminalDoglegClear<=tally.D52ValidSupportingHulls);
 assert.ok(tally.D52FullyGeometricClear<=tally.D52SourceSocketClear);
 assert.ok(tally.D52MaxRayDelta<1e-5);
 assert.equal(tally.realFasteners,0);assert.equal(tally.registeredOwnerIDs,0);
 assert.equal(tally.approvedFootings,0);assert.equal(tally.buildingSourceWrites,0);
 assert.equal(tally.gameplayWrites,0);
 console.log('D52 EXACT ORIGINAL EXTERIOR END-FACE TOTALS '+JSON.stringify(tally));
});
test('D52 original roof tamper, authorization forgery and WALK deletion are rejected without edits',()=>{
 const b=BUILDINGS[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at?.[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD52OriginalExteriorDogleg({...b,creatorApproved:true},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|original|authored|source|roof|unplaced/i);
 assert.throws(()=>auditD52OriginalExteriorDogleg({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|original|authored|source|roof|wood/i);
 assert.throws(()=>auditD52OriginalExteriorDogleg({...b,navigation:b.navigation.slice(1)},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|original|authored|source|WALK|navigation/i);
 assert.equal(roof.asset,'live:wood');
});
