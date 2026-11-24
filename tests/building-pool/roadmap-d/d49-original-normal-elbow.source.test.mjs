// D49 NEW authentic W16/W17 Node-only native evidence (NOT D25-D48 suites).
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD49OriginalNormalElbowBuilding}
 from '../../../src/building-pool/roadmap-d/d49-original-two-stage-elbow-audit.mjs';
const ALL=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)]};
test('D49 sixteen genuine original W16/W17 source buildings: outward physical first stage, shared positive-area endcap, full elbow SAT source and member veto, structural HOLD',()=>{
 assert.equal(ALL.length,16);
 const total={buildings:0,bays:0,roots:0,roof:0,far:0,zones:0,tension:0,
  d36Clear:0,patches:0,patchesClear:0,rootsWithPatch:0,dogsY5:0,dogsY6:0,
  proposals:0,Y5:0,Y6:0,endcaps:0,sourceHits:0,walkHits:0,memberHits:0,
  socketIntrusions:0,stageSelfOverlaps:0,outwardStage1:0,outwardStage2:0,
  fullDoglegOverlap:0,fullyGeometric:0,rootsWithAnyGeometric:0,raySamples:0,rayMax:0,
  fasteners:0,footings:0,writes:0};
 const summaries=[],witnesses=[];
 for(const b of ALL){
  const [p,s,d25]=plan(b),before=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   r=auditD49OriginalNormalElbowBuilding(b,p,s,d25,{maxRaySamples:1});
  assert.equal(r.constructionAllowed,false);assert.equal(r.sourceOwnersAndPack2ShapesUnchanged,true);
  assert.equal(r.originalY7WoodRoofPreserved,true);assert.equal(r.noOriginalWALKOrWorldSaveWrites,true);
  assert.equal(r.noInstalledFittingsOrRatedLoadPath,true);assert.equal(r.actualGameRendererRayAndIphonePwaUntested,true);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],before);
  total.buildings++;total.bays+=r.bays;total.roots+=r.roots;total.roof+=r.originalRoof;
  total.far+=r.stillUncertifiedRoof;total.zones+=r.farZones;total.tension+=r.positiveTension;
  total.d36Clear+=r.originalD36SourceClear;total.patches+=r.slopedSubpatchesTested;
  total.patchesClear+=r.sourceClearSubpatches;total.rootsWithPatch+=r.rootsWithClearSubpatch;
  total.dogsY5+=r.sourceClearDogsY5;total.dogsY6+=r.sourceClearDogsY6;
  total.proposals+=r.candidates;total.Y5+=r.candidatesY5;total.Y6+=r.candidatesY6;
  total.endcaps+=r.positiveAreaEndcaps;total.sourceHits+=r.sourceSolidHitEvents;
  total.walkHits+=r.authoredWalkHitEvents;total.memberHits+=r.nearbyMemberHitEvents;
  total.socketIntrusions+=r.socketPositiveVolumeIntrusions;
  total.stageSelfOverlaps+=r.stageSelfOverlapEvents;
  total.outwardStage1+=r.trulyOutwardFirstStages;total.outwardStage2+=r.elbowContinuesOutward;
  total.fullDoglegOverlap+=r.actualDoglegPositiveVolumeOverlap;
  total.fullyGeometric+=r.fullyPhysicalGeometricCandidates;
  total.rootsWithAnyGeometric+=r.rootsWithAnyFullyGeometricCandidate;
  total.raySamples+=r.rayStageSamples;total.rayMax=Math.max(total.rayMax,r.maximumMeshRayDelta);
  total.fasteners+=r.approvedTensileFasteners;total.footings+=r.authenticatedFoundations;
  total.writes+=r.sourceWorldWrites;
  summaries.push({id:b.id,roots:r.roots,positivePatch:r.rootsWithClearSubpatch,
   elbows:r.candidates,originalSolids:r.sourceSolidHitEvents,socketIntrusions:r.socketPositiveVolumeIntrusions,
   outwardSecond:r.elbowContinuesOutward,fullyGeometric:r.fullyPhysicalGeometricCandidates});
  witnesses.push(...r.firstFailureWitnesses.slice(0,2));
 }
 assert.deepEqual({b:total.buildings,bays:total.bays,roots:total.roots,roof:total.roof,far:total.far,zones:total.zones},
  {b:16,bays:64,roots:128,roof:115894,far:59412,zones:34});
 assert.equal(total.d36Clear,128);assert.equal(total.tension,128);
 assert.equal(total.rootsWithPatch,128);assert.equal(total.patches,512);
 assert.equal(total.proposals,1024);assert.equal(total.Y5,512);assert.equal(total.Y6,512);
 assert.equal(total.endcaps,1024);assert.equal(total.dogsY5,128);assert.equal(total.dogsY6,128);
 assert.equal(total.outwardStage1,1024);assert.equal(total.fasteners,0);
 assert.equal(total.footings,0);assert.equal(total.writes,0);
 assert.equal(total.raySamples,16);assert.ok(total.rayMax<1e-5);
 console.log('D49 AUTHENTIC ORIGINAL W16/W17 TWO STAGE FULL SAT CENSUS '+JSON.stringify(total));
 console.log('D49 PER ORIGINAL BUILDING SOURCE BINS '+JSON.stringify(summaries));
 console.log('D49 FIRST ORIGINAL GEOMETRIC FAILURE WITNESSES '+JSON.stringify(witnesses));
});
test('D49 original-author Y7 roof and navigation tamper plus forged creator approval fail closed',()=>{
 const b=ALL[0], [p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD49OriginalNormalElbowBuilding({...b,creatorApproved:true},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|approved/i);
 assert.throws(()=>auditD49OriginalNormalElbowBuilding({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|roof|wood/i);
 assert.throws(()=>auditD49OriginalNormalElbowBuilding({...b,navigation:b.navigation.slice(1)},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|navigation|WALK/i);
 assert.equal(roof.asset,'live:wood');
});
