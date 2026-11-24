// ONLY NEW D48 original-Node native evidence; never rerun D25-D47 suites.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD48AuthenticOriginalContactPatches}
 from '../../../src/building-pool/roadmap-d/d48-original-saddle-contact-and-bridge-audit.mjs';
const ALL=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const a=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:a});
 return [a,s,planD25OriginalLiveWoodRoofZones(b,a,s)];};
test('D48 authentic W16/W17: exact 101 source collision anatomy, 27 old clear saddles, positive-area new subfaces, full swept saddle/dogleg bridge veto and no placement',()=>{
 assert.equal(ALL.length,16);
 const total={buildings:0,bays:0,roots:0,roof:0,far:0,zones:0,baseClear:0,baseHits:0,
  baseRootHits:0,baseRoles:{},baseOffsets:{},patchAttempts:0,patchAreas:0,patchClear:0,patchRescued:0,
  rootAnyPatch:0,patchHits:0,patchWalk:0,patchOwners:0,patchSocketIntrusions:0,
  minArea:Infinity,maxArea:0,bridges:0,bridgeSource:0,bridgeWALK:0,bridgeOwners:0,
  bridgeSocket:0,bridgeDogs:0,bridgeOutward:0,fullyGeometryClear:0,fasteners:0,footings:0,
  sourceWrites:0,meshSamples:0,maxRayDelta:0};
 const bins=[],witness=[];
 for(const b of ALL){
  const [p,s,d25]=plan(b),old=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   r=auditD48AuthenticOriginalContactPatches(b,p,s,d25,{maxMeshSamples:1,maxWitnesses:5});
  assert.equal(r.roofSupportApproved,false);assert.equal(r.constructionAllowed,false);
  assert.equal(r.noStructuralCapacitiesOrFasteners,true);
  assert.equal(r.originalPack2AndAllOtherOwnersUnchanged,true);
  assert.equal(r.originalAuthorNavigationAndRoofUnchanged,true);
  assert.equal(r.originalTerrainAndFoundationUnvalidated,true);
  assert.equal(r.genuineGamePickingAndInstalledIphonePwaUntested,true);
  assert.equal(r.originalWorldWrites,0);
  assert.equal(r.patchSocketPenetrations,0);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],old);
  total.buildings++;total.bays+=r.bays;total.roots+=r.roots;total.roof+=r.originalRoof;
  total.far+=r.stillUncertifiedFarRoof;total.zones+=r.originalFarZones;
  total.baseClear+=r.d47BaselineSourceClear;total.baseHits+=r.d47BaselineSourceClashes;
  total.baseRootHits+=r.baselineRootVoxelHits;
  for(const [k,v] of Object.entries(r.baselineOriginalSolidRoles))total.baseRoles[k]=(total.baseRoles[k]??0)+v;
  for(const [k,v] of Object.entries(r.baselineRelativeSourceHitOffsets))total.baseOffsets[k]=(total.baseOffsets[k]??0)+v;
  total.patchAttempts+=r.patchAttempts;total.patchAreas+=r.realPositiveAreaPatches;
  total.patchClear+=r.patchSourceClear;total.patchRescued+=r.previouslyBlockedRootsWithNewClearPatch;
  total.rootAnyPatch+=r.rootsWithAnySourceClearPatch;total.patchHits+=r.patchAuthoredSolidHits;
  total.patchWalk+=r.patchWalkHits;total.patchOwners+=r.patchOtherOwnerHits;
  total.patchSocketIntrusions+=r.patchSocketPenetrations;
  total.minArea=Math.min(total.minArea,r.minActualContactArea);
  total.maxArea=Math.max(total.maxArea,r.maxActualContactArea);
  total.bridges+=r.bridgeAttempts;total.bridgeSource+=r.bridgeAuthoredSolidHits;
  total.bridgeWALK+=r.bridgeWalkHits;total.bridgeOwners+=r.bridgeOtherOwnerHits;
  total.bridgeSocket+=r.bridgeSocketIntrusions;total.bridgeDogs+=r.bridgeDoglegPositiveVolumeOverlap;
  total.bridgeOutward+=r.bridgePositiveOutwardProjection;
  total.fullyGeometryClear+=r.fullyGeometricallyClearSaddleToDoglegProposals;
  total.fasteners+=r.trueIndependentTensileConnectors;total.footings+=r.authorizedFootings;
  total.sourceWrites+=r.originalWorldWrites;total.meshSamples+=r.meshSamples;
  total.maxRayDelta=Math.max(total.maxRayDelta,r.maxMeshTriangleRayDelta);
  witness.push(...r.exactOriginalBlockerWitnesses.slice(0,1));
  bins.push({id:b.id,roots:r.roots,originalClashingSaddles:r.d47BaselineSourceClashes,
   baselineClear:r.d47BaselineSourceClear,patchClear:r.patchSourceClear,
   rescuedRoots:r.previouslyBlockedRootsWithNewClearPatch,bridgeAttempts:r.bridgeAttempts,
   geometricBothEnds:r.fullyGeometricallyClearSaddleToDoglegProposals});
 }
 assert.deepEqual({b:total.buildings,bays:total.bays,roots:total.roots,roof:total.roof,
  far:total.far,zones:total.zones,baseClear:total.baseClear,baseClashes:total.baseHits},
  {b:16,bays:64,roots:128,roof:115894,far:59412,zones:34,baseClear:27,baseClashes:101});
 assert.equal(total.patchAttempts,512);assert.equal(total.patchAreas,512);
 assert.ok(total.rootAnyPatch>=total.baseClear&&total.rootAnyPatch<=128);
 assert.ok(total.minArea>.008&&total.maxArea<.03);
 assert.equal(total.patchSocketIntrusions,0);assert.equal(total.sourceWrites,0);
 assert.equal(total.fasteners,0);assert.equal(total.footings,0);
 assert.equal(total.meshSamples,16);assert.ok(total.maxRayDelta<1e-5);
 assert.equal(Object.values(total.baseRoles).reduce((a,b)=>a+b,0),101);
 assert.equal(Object.values(total.baseOffsets).reduce((a,b)=>a+b,0),101);
 console.log('D48 AUTHENTIC ORIGINAL 16 BUILDINGS SLOPED VARIANTS + FULL PRISM CONNECTION TOTALS '+JSON.stringify(total));
 console.log('D48 ORIGINAL SOURCE PER-BUILDING GEOMETRY BINS '+JSON.stringify(bins));
 console.log('D48 FIRST PROTECTED SOURCE VOXEL COORDINATES AND ROLES '+JSON.stringify(witness));
});
test('D48 original author roof/WALK permissions reject forged approval and tampered authored source without weakening safety',()=>{
 const b=ALL[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD48AuthenticOriginalContactPatches({...b,creatorApproved:true},p,s,d25,{maxMeshSamples:0}),
  /D25|D26|D27|D28|D29|source|original|approved/i);
 assert.throws(()=>auditD48AuthenticOriginalContactPatches({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25,{maxMeshSamples:0}),
  /D25|D26|D27|D28|D29|source|original|roof/i);
 assert.throws(()=>auditD48AuthenticOriginalContactPatches({...b,navigation:b.navigation.slice(1)},p,s,d25,{maxMeshSamples:0}),
  /D25|D26|D27|D28|D29|source|original|WALK|navigation/i);
 assert.equal(roof.asset,'live:wood');
});
