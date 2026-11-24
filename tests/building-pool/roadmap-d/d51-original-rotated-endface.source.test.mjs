// ONLY two new D51 original W16/W17 cases. No history-suite replay.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD51AuthenticRotatedCapBuilding} from '../../../src/building-pool/roadmap-d/d51-original-rotated-endface-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D51 genuine 16 original W16/W17 blueprints: true rotated-cap convex hulls, exact dogleg exterior endcap, SAT and fail-closed ownership',()=>{
 assert.equal(B.length,16);
 const total={buildings:0,bays:0,roots:0,tensile:0,sourceClearSockets:0,roof:0,far:0,zones:0,
  D48Trial:0,D48Clear:0,rootsWithPatch:0,dogY5:0,dogY6:0,dogEndcaps:0,
  proposals:0,Y5:0,Y6:0,firstAxial:0,secondLateral:0,convexValid:0,convexRejected:0,
  trueSourceCaps:0,trueDogCaps:0,sharedArticulatedCaps:0,
  solids:0,walk:0,socket:0,members:0,doglegPenetrations:0,
  overlap12:0,overlap23:0,overlap13:0,
  hullsSourceSocketClear:0,fullGeometry:0,rootsFull:0,
  meshSamples:0,maxRayDelta:0,sourceWrites:0,fasteners:0,footingRatings:0};
 const perBuilding=[],failures=[];
 for(const b of B){
  const [p,s,d25]=plan(b),snap=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   r=auditD51AuthenticRotatedCapBuilding(b,p,s,d25,{maxRaySamples:1});
  assert.equal(r.constructionAllowed,false);assert.equal(r.originalPack2OwnerShapesUntouched,true);
  assert.equal(r.weatherPlaneAndOriginalWALKPreserved,true);
  assert.equal(r.noActualMechanicalOrRatedFoundationConnection,true);
  assert.equal(r.installedIphoneAndWebGL2Untested,true);assert.equal(r.sourceWrites,0);assert.equal(r.saveWrites,0);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],snap);
  total.buildings++;total.bays+=r.bays;total.roots+=r.roots;total.tensile+=r.tensileRoots;
  total.sourceClearSockets+=r.sourceClearSockets;total.roof+=r.originalRoof;
  total.far+=r.originalUncertifiedFarRoof;total.zones+=r.originalFarZones;
  total.D48Trial+=r.D48PatchTrials;total.D48Clear+=r.D48PatchesSourceClear;
  total.rootsWithPatch+=r.rootsWithSourceClearPatch;
  total.dogY5+=r.doglegsY5;total.dogY6+=r.doglegsY6;total.dogEndcaps+=r.actualDoglegEndcaps;
  total.proposals+=r.proposals;total.Y5+=r.Y5;total.Y6+=r.Y6;
  total.firstAxial+=r.firstAxial;total.secondLateral+=r.secondLateral;
  total.convexValid+=r.validConvexRotatedHulls;
  total.convexRejected+=r.nonconvexOrNonSupportingCapRejected;
  total.trueSourceCaps+=r.authenticFaceContacts;total.trueDogCaps+=r.authenticEndcapContacts;
  total.sharedArticulatedCaps+=r.articulatedSharedCaps;
  total.solids+=r.originalSourceHits;total.walk+=r.originalWalkHits;
  total.socket+=r.originalSocketIntrusions;total.members+=r.sourceMemberHits;
  total.doglegPenetrations+=r.doglegVolumeIntrusions;
  total.overlap12+=r.overlapStage12;total.overlap23+=r.overlapStage23;total.overlap13+=r.overlapStage13;
  total.hullsSourceSocketClear+=r.sourceSocketClearRotatedHulls;
  total.fullGeometry+=r.fullPhysicalCandidates;total.rootsFull+=r.rootsWithPhysicalCandidate;
  total.meshSamples+=r.raySamples;total.maxRayDelta=Math.max(total.maxRayDelta,r.maxRayDelta);
  total.sourceWrites+=r.originalSourceWrites;total.fasteners+=r.realFasteners;
  total.footingRatings+=r.footingRatings;
  perBuilding.push({id:b.id,bays:r.bays,roots:r.roots,valid:r.validConvexRotatedHulls,
   invalid:r.nonconvexOrNonSupportingCapRejected,sourceSolid:r.originalSourceHits,
   socket:r.originalSocketIntrusions,dogleg:r.doglegVolumeIntrusions,
   stage12:r.overlapStage12,stage23:r.overlapStage23,sourceSocketClear:r.sourceSocketClearRotatedHulls,
   fullGeometry:r.fullPhysicalCandidates});
  failures.push(...r.exampleFailures.slice(0,2));
 }
 assert.deepEqual({buildings:total.buildings,bays:total.bays,roots:total.roots,roof:total.roof,far:total.far,zones:total.zones},
  {buildings:16,bays:64,roots:128,roof:115894,far:59412,zones:34});
 assert.equal(total.tensile,128);assert.equal(total.sourceClearSockets,128);
 assert.equal(total.D48Trial,512);assert.equal(total.rootsWithPatch,128);
 assert.equal(total.dogY5,128);assert.equal(total.dogY6,128);assert.equal(total.dogEndcaps,512);
 assert.equal(total.proposals,2048);assert.equal(total.Y5,1024);assert.equal(total.Y6,1024);
 assert.equal(total.firstAxial,1024);assert.equal(total.secondLateral,1024);
 assert.equal(total.convexValid+total.convexRejected,2048);assert.ok(total.convexValid>0);
 assert.equal(total.trueSourceCaps,total.convexValid);assert.equal(total.trueDogCaps,total.convexValid);
 assert.equal(total.sharedArticulatedCaps,total.convexValid*2);
 assert.equal(total.meshSamples,16);assert.ok(total.maxRayDelta<1e-5);
 assert.equal(total.sourceWrites,0);assert.equal(total.fasteners,0);assert.equal(total.footingRatings,0);
 console.log('D51 ORIGINAL AUTHENTIC 16-BUILDING ARTICULATED-CAP CENSUS '+JSON.stringify(total));
 console.log('D51 ORIGINAL BLUEPRINT BINS '+JSON.stringify(perBuilding));
 console.log('D51 ORIGINAL ROTATED-CAP FAILURE WITNESSES '+JSON.stringify(failures));
});
test('D51 rejects altered original Y7 weather roof, original authored WALK, forged creator approval without any source writes',()=>{
 const b=B[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD51AuthenticRotatedCapBuilding({...b,creatorApproved:true},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|approved/i);
 assert.throws(()=>auditD51AuthenticRotatedCapBuilding({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|roof|wood/i);
 assert.throws(()=>auditD51AuthenticRotatedCapBuilding({...b,navigation:b.navigation.slice(1)},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|WALK|navigation/i);
 assert.equal(roof.asset,'live:wood');
});
