// NEW D41 only: original W16/W17 source-native diagnostic, not historical CI.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD41ActualSourceRootFailures}
 from '../../../src/building-pool/roadmap-d/d41-original-root-failure-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
const classes=['front-and-rear-source-entries-blocked','front-source-entry-blocked',
 'rear-source-entry-blocked','center-graph-disconnected','swept-segment-graph-disconnected',
 'winding-or-closure-unavailable','complete-bounded-route'];
test('D41 exact-original W16/W17: classify all 128 prior D40 zero-loop roots by authentic front, rear, center graph, full swept edges and winding closure',()=>{
 assert.equal(B.length,16);
 const totals={buildings:0,roofs:0,far:0,zones:0,bays:0,roots:0,
  fronts:0,rears:0,bothEndpoints:0,centerRear:0,sweptRear:0,
  originalCentersBlocked:0,walkingCentersBlocked:0,socketCentersBlocked:0,
  originalEdgesBlocked:0,walkingEdgesBlocked:0,socketEdgesBlocked:0,
  freeCenters:0,components:0,centerReachable:0,sweptReachable:0,
  edgeProbes:0,edgeClear:0,windingStates:0,D40Loops:0,D41Loops:0};
 const categories=Object.fromEntries(classes.map(k=>[k,0])),bins=[];
 for(const b of B){const [p,s,d25]=plan(b),before=[b.cells.length,b.navigation.length,
  b.cells[0],b.cells.at(-1),b.navigation[0]],r=auditD41ActualSourceRootFailures(b,p,s,d25);
  assert.equal(r.constructionAllowed,false);assert.equal(r.structuralRoofLoadCertified,false);
  assert.equal(r.originalWallNeverModified,true);assert.equal(r.sourceOwnerPack2NeverModified,true);
  assert.equal(r.originalWALKAndY7WoodUnchanged,true);
  assert.equal(r.limitedRadiusAndHeightDoNotRuleOutOtherAnchorDesigns,true);
  assert.equal(r.graphReachabilityCannotCertifyContinuousRatedFastener,true);
  assert.equal(r.noIndependentTestedWallOrFoundationTensileCapacity,true);
  assert.equal(r.sourceCellsWritten,0);assert.equal(r.savesWritten,0);
  assert.equal(r.originalD40Loops,0); // D40 exact native original-source checkpoint
  assert.equal(r.d41ClosedLoops,r.originalD40Loops);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],before);
  totals.buildings++;totals.roofs+=r.originalLiveWoodRoofCells;
  totals.far+=r.distantRoofStillStructurallyUncertified;totals.zones+=r.originalUncertifiedFarZones;
  totals.bays+=r.longBays;totals.roots+=r.rootedTensileSocketSites;
  totals.fronts+=r.frontAvailable;totals.rears+=r.rearAvailable;totals.bothEndpoints+=r.frontAndRearAvailable;
  totals.centerRear+=r.centerGraphRearReachable;totals.sweptRear+=r.sweptGraphRearReachable;
  totals.originalCentersBlocked+=r.sourceSolidCenterVetoes;
  totals.walkingCentersBlocked+=r.sourceWalkCenterVetoes;
  totals.socketCentersBlocked+=r.sourceSocketCenterVetoes;
  totals.originalEdgesBlocked+=r.sweptSourceEdgeVetoes;
  totals.walkingEdgesBlocked+=r.sweptWalkingEdgeVetoes;
  totals.socketEdgesBlocked+=r.sweptSocketEdgeVetoes;
  totals.freeCenters+=r.admissibleCenters;totals.components+=r.centerComponents;
  totals.centerReachable+=r.centerFrontReachableSites;
  totals.sweptReachable+=r.sweptFrontReachableSites;
  totals.edgeProbes+=r.sweptEdgesTested;totals.edgeClear+=r.sweptEdgesClear;
  totals.windingStates+=r.windingStatesSearched;
  totals.D40Loops+=r.originalD40Loops;totals.D41Loops+=r.d41ClosedLoops;
  for(const k of classes)categories[k]+=r.failureCategories[k];
  assert.equal(r.roots.length,r.rootedTensileSocketSites);
  bins.push({id:b.id,roots:r.rootedTensileSocketSites,fronts:r.frontAvailable,
   rears:r.rearAvailable,centerReachable:r.centerGraphRearReachable,
   sweptRear:r.sweptGraphRearReachable,failures:r.failureCategories,
   sweepEdgeTests:r.sweptEdgesTested});
 }
 assert.deepEqual({buildings:totals.buildings,roof:totals.roofs,far:totals.far,zones:totals.zones,
  bays:totals.bays,roots:totals.roots},{buildings:16,roof:115894,far:59412,zones:34,bays:64,roots:128});
 assert.equal(Object.values(categories).reduce((n,v)=>n+v,0),128);
 assert.equal(categories['complete-bounded-route'],0);
 assert.equal(totals.D40Loops,0);assert.equal(totals.D41Loops,0);
 assert.ok(totals.freeCenters>=0&&totals.edgeClear<=totals.edgeProbes);
 assert.ok(totals.sweptRear<=totals.centerRear);
 assert.ok(totals.bothEndpoints<=Math.min(totals.fronts,totals.rears));
 console.log('D41 GENUINE W16 W17 CENTER VS SWEPT VS WINDING ROOT-CAUSE TOTALS '+JSON.stringify({totals,categories}));
 console.log('D41 GENUINE ORIGINAL PER-BUILDING BINS '+JSON.stringify(bins));
});
test('D41 rejects counterfeit creator approval, tampered original Y7 roof, deleted original author WALK and altered native search bounds',()=>{
 const b=B[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD41ActualSourceRootFailures({...b,creatorApproved:true},p,s,d25),
  /original|unplaced|source|D25|D26|D27|D28|D29|D41/i);
 assert.throws(()=>auditD41ActualSourceRootFailures({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25),
  /original|source|wood|roof|D25|D26|D27|D28|D29|D41/i);
 assert.throws(()=>auditD41ActualSourceRootFailures({...b,navigation:b.navigation.slice(1)},p,s,d25),
  /original|source|WALK|navigation|D25|D26|D27|D28|D29|D41/i);
 assert.throws(()=>auditD41ActualSourceRootFailures(b,p,s,d25,{radius:5}),/native census/);
 assert.equal(roof.asset,'live:wood');
});
