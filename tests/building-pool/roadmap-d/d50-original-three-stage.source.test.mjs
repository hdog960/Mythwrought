// Only NEW D50 original Node tests: 16 original buildings, no historical suite replay.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD50AuthenticOriginalThreeStageBuilding} from '../../../src/building-pool/roadmap-d/d50-original-lateral-bypass-audit.mjs';
const ALL=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D50 original 16 W16/W17 source buildings: 128 positive-tension roots, genuine three-stage SAT, alternate dogleg volume and no fictional rated fastener',()=>{
 assert.equal(ALL.length,16);
 const total={buildings:0,bays:0,roots:0,tension:0,roof:0,far:0,zones:0,sourceClearSockets:0,
  patchTrials:0,sourceClearPatches:0,rootsWithPatch:0,dogsY5:0,dogsY6:0,
  firstDogBehind:0,secondDogBehind:0,
  candidates:0,Y5:0,Y6:0,positiveCaps:0,outwardFirst:0,outwardBypass:0,outwardEntry:0,
  overlappingStages12:0,overlappingStages23:0,overlappingStages13:0,
  socketIntrusions:0,solidHitEvents:0,walkHitEvents:0,memberHitEvents:0,
  firstDogOverlap:0,secondDogOverlap:0,physicallyClear:0,rootsWithClear:0,
  samples:0,maxRayDelta:0,fasteners:0,footingRatings:0,writes:0};
 const bins=[],witness=[];
 for(const b of ALL){
  const [p,s,d25]=plan(b),prior=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   r=auditD50AuthenticOriginalThreeStageBuilding(b,p,s,d25,{maxRaySamples:1});
  assert.equal(r.constructionAllowed,false);assert.equal(r.noOriginalWorldOrSaveMutation,true);
  assert.equal(r.uninstalledOwnerAndOriginalPack2Unchanged,true);
  assert.equal(r.weatherAndNavigationSourcePreserved,true);
  assert.equal(r.noApprovedTensileConnectionOrGroundFooting,true);
  assert.equal(r.actualWebGL2PlayerAndInstalledPwaUntested,true);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],prior);
  total.buildings++;total.bays+=r.bays;total.roots+=r.roots;total.tension+=r.tensileRoots;
  total.roof+=r.originalRoof;total.far+=r.uncertifiedFarRoof;total.zones+=r.uncertifiedZones;
  total.sourceClearSockets+=r.socketsSourceClear;total.patchTrials+=r.patchProposals;
  total.sourceClearPatches+=r.sourceClearPatches;total.rootsWithPatch+=r.rootsWithSourceClearPatch;
  total.dogsY5+=r.originalDoglegsY5Clear;total.dogsY6+=r.originalDoglegsY6Clear;
  total.firstDogBehind+=r.firstDoglegEntirelyBehindFace;total.secondDogBehind+=r.secondDoglegEntirelyBehindFace;
  total.candidates+=r.candidates;total.Y5+=r.candidatesY5;total.Y6+=r.candidatesY6;
  total.positiveCaps+=r.positiveCapContacts;
  total.outwardFirst+=r.firstStagesOutward;total.outwardBypass+=r.secondStagesOutward;
  total.outwardEntry+=r.thirdStagesOutward;total.overlappingStages12+=r.firstSecondStageSelfOverlap;
  total.overlappingStages23+=r.secondThirdStageSelfOverlap;total.overlappingStages13+=r.firstThirdStageSelfOverlap;
  total.socketIntrusions+=r.actualSocketIntrusions;total.solidHitEvents+=r.authoredSolidHits;
  total.walkHitEvents+=r.authoredWALKHits;total.memberHitEvents+=r.otherMemberHits;
  total.firstDogOverlap+=r.firstDoglegOverlaps;total.secondDogOverlap+=r.secondDoglegOverlaps;
  total.physicallyClear+=r.fullyPhysicalGeometryCandidates;total.rootsWithClear+=r.rootsWithOnePhysicalCandidate;
  total.samples+=r.raySamples;total.maxRayDelta=Math.max(total.maxRayDelta,r.maxRayDelta);
  total.fasteners+=r.registeredFasteners;total.footingRatings+=r.foundationRatings;total.writes+=r.sourceWrites;
  bins.push({id:b.id,roots:r.roots,firstDogBehind:r.firstDoglegEntirelyBehindFace,
   secondDogBehind:r.secondDoglegEntirelyBehindFace,threeStage:r.candidates,
   sourceHits:r.authoredSolidHits,socket:r.actualSocketIntrusions,
   stageOverlap23:r.secondThirdStageSelfOverlap,physicallyClear:r.fullyPhysicalGeometryCandidates});
  witness.push(...r.firstFailures.slice(0,2));
 }
 assert.deepEqual({b:total.buildings,bays:total.bays,roots:total.roots,roof:total.roof,far:total.far,zones:total.zones},
  {b:16,bays:64,roots:128,roof:115894,far:59412,zones:34});
 assert.equal(total.sourceClearSockets,128);assert.equal(total.tension,128);
 assert.equal(total.rootsWithPatch,128);assert.equal(total.patchTrials,512);
 assert.equal(total.candidates,1024);assert.equal(total.Y5,512);assert.equal(total.Y6,512);
 assert.equal(total.positiveCaps,1024);assert.equal(total.outwardFirst,1024);assert.equal(total.outwardBypass,1024);
 assert.equal(total.dogsY5,128);assert.equal(total.dogsY6,128);
 assert.equal(total.fasteners,0);assert.equal(total.footingRatings,0);assert.equal(total.writes,0);
 assert.equal(total.samples,16);assert.ok(total.maxRayDelta<1e-5);
 console.log('D50 ORIGINAL 16-BUILDING THREE-STAGE LATERAL BYPASS '+JSON.stringify(total));
 console.log('D50 PER BUILDING AUTHENTIC SOURCE BINS '+JSON.stringify(bins));
 console.log('D50 FIRST FULL-VOLUME SOURCE/SOCKET SELF-OVERLAP WITNESSES '+JSON.stringify(witness));
});
test('D50 protected original Y7 roof, authored WALK and forged creator-approval changes fail closed',()=>{
 const b=ALL[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD50AuthenticOriginalThreeStageBuilding({...b,creatorApproved:true},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|approved/i);
 assert.throws(()=>auditD50AuthenticOriginalThreeStageBuilding({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|roof|wood/i);
 assert.throws(()=>auditD50AuthenticOriginalThreeStageBuilding({...b,navigation:b.navigation.slice(1)},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|WALK|navigation/i);
 assert.equal(roof.asset,'live:wood');
});
