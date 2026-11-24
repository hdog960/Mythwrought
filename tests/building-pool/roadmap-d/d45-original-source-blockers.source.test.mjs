// Only two NEW D45 genuine native Node22 original W16/W17 tests.
// Reuse verified exact D25–D44 Actions, never rerun historical broad suites.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD45OriginalFirstVoxelAndFractionalEgress}
 from '../../../src/building-pool/roadmap-d/d45-original-first-voxel-egress-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plans=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('AUTHENTIC D45 sixteen original Wave16/Wave17 sources: first physical blocker coordinate, role, route classification, fractional two-bend original-owner color-ray census',()=>{
 assert.equal(B.length,16);
 const sums={buildings:0,roof:0,far:0,zones:0,roots:0,bays:0,candidates:0,attempts:0,
  adjacent:0,mid:0,near:0,sourceFirstY6:0,sourceFirstY5:0,sourceFirstY4:0,
  wallRole:0,partitionRole:0,columnRole:0,beamRole:0,otherRole:0,
  firstAtStart:0,firstLater:0,multipleVoxels:0,
  y5Doglegs:0,y6Doglegs:0,y5SourceClear:0,y6SourceClear:0,
  y5FullyClear:0,y6FullyClear:0,railOriginalSolid:0,railWalkBody:0,railSocket:0,
  raySamples:0,maxRayDelta:0,realWorldWrites:0,approvedFootings:0};
 const bins=[];
 for(const b of B){
  const [p,s,d25]=plans(b),pre=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   r=auditD45OriginalFirstVoxelAndFractionalEgress(b,p,s,d25,{maxWitnesses:2});
  assert.equal(r.constructionAllowed,false);assert.equal(r.structuralReleaseAllowed,false);
  assert.equal(r.originalSourceCellWrites,0);assert.equal(r.originalSourceCellWrites,0);
  assert.equal(r.sourceAuthorizedFootings,0);assert.equal(r.mechanicallyInstalledTies,0);
  assert.equal(r.sourceValidatedGroundAndCaves,0);
  assert.equal(r.noOriginalPack2IDOrOwnerChanged,true);
  assert.equal(r.originalY7WoodUnmodified,true);
  assert.equal(r.protectedOriginalWALKUnmodified,true);
  assert.equal(r.fractionalRailNotAFullSocketToFootingTie,true);
  assert.equal(r.sourceVacantFootprintIsNotGeneratedWorldGround,true);
  assert.equal(r.firstPhysicalVoxelMeasuredNotFabricated,true);
  assert.equal(r.webgl2AndIphonePwaNotTested,true);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],pre);
  assert.equal(r.originalSourceColoredRaySamples,1);
  assert.ok(r.maximumSourcePaletteMeshRayDelta<1e-5);
  sums.buildings++;sums.roof+=r.originalRoof;sums.far+=r.structurallyUncertifiedDistantWoodRoof;
  sums.zones+=r.structurallyUncertifiedRoofZones;sums.roots+=r.roots;sums.bays+=r.bays;
  sums.candidates+=r.candidateOriginalFootprints;sums.attempts+=r.y6PhysicalLAttempts;
  sums.adjacent+=r.socketAdjacentFirstFailedSegments;sums.mid+=r.midRouteFirstFailedSegments;
  sums.near+=r.nearSupportFirstFailedSegments;
  sums.sourceFirstY6+=r.sourceFirstSolidAtY6;sums.sourceFirstY5+=r.sourceFirstSolidAtY5;
  sums.sourceFirstY4+=r.sourceFirstSolidAtY4;
  sums.wallRole+=r.sourceWallRole;sums.partitionRole+=r.sourcePartitionRole;
  sums.columnRole+=r.sourceColumnRole;sums.beamRole+=r.sourceBeamRole;
  sums.otherRole+=r.sourceOtherAuthoredRole;
  sums.firstAtStart+=r.firstContactAtSegmentStart;sums.firstLater+=r.firstContactBeyondSegmentStart;
  sums.multipleVoxels+=r.duplicateFirstContactWitnessPairs;
  sums.y5Doglegs+=r.fractionalExteriorY5Samples;sums.y6Doglegs+=r.fractionalExteriorY6Samples;
  sums.y5SourceClear+=r.fractionalY5SourceClear;sums.y6SourceClear+=r.fractionalY6SourceClear;
  sums.y5FullyClear+=r.fractionalY5FullyClear;sums.y6FullyClear+=r.fractionalY6FullyClear;
  sums.railOriginalSolid+=r.fractionalOriginalSolidEvents;
  sums.railWalkBody+=r.fractionalWalkingBodyEvents;sums.railSocket+=r.fractionalSocketEvents;
  sums.raySamples+=r.originalSourceColoredRaySamples;
  sums.maxRayDelta=Math.max(sums.maxRayDelta,r.maximumSourcePaletteMeshRayDelta);
  bins.push({id:b.id,roots:r.roots,candidates:r.candidateOriginalFootprints,
   firstAdjacent:r.socketAdjacentFirstFailedSegments,firstMid:r.midRouteFirstFailedSegments,
   firstNear:r.nearSupportFirstFailedSegments,originalWall:r.sourceWallRole,
   originalPartition:r.sourcePartitionRole,originalBeam:r.sourceBeamRole,
   sourceClearFractionalY5:r.fractionalY5SourceClear,
   sourceClearFractionalY6:r.fractionalY6SourceClear});
 }
 assert.deepEqual({buildings:sums.buildings,roof:sums.roof,far:sums.far,zones:sums.zones,
  bays:sums.bays,roots:sums.roots,candidates:sums.candidates,attempts:sums.attempts},
  {buildings:16,roof:115894,far:59412,zones:34,bays:64,roots:128,candidates:1455,attempts:2910});
 assert.equal(sums.adjacent+sums.mid+sums.near,2910);
 assert.equal(sums.sourceFirstY6+sums.sourceFirstY5+sums.sourceFirstY4,2910);
 assert.equal(sums.wallRole+sums.partitionRole+sums.columnRole+sums.beamRole+sums.otherRole,2910);
 assert.equal(sums.firstAtStart+sums.firstLater,2910);
 assert.equal(sums.y5Doglegs,256);assert.equal(sums.y6Doglegs,256);
 assert.equal(sums.raySamples,16);assert.equal(sums.realWorldWrites,0);assert.equal(sums.approvedFootings,0);
 console.log('D45 AUTHENTIC ORIGINAL SIXTEEN-BUILDING FIRST PRISM BLOCKERS AND SOURCE FRACTIONAL EXIT '+JSON.stringify(sums));
 console.log('D45 ORIGINAL SOURCE BINS '+JSON.stringify(bins));
});
test('D45 authentic original source refuses fake creator approval, replaced Y7 wood, or missing original WALK',()=>{
 const b=B[0],[p,s,d25]=plans(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD45OriginalFirstVoxelAndFractionalEgress({...b,creatorApproved:true},p,s,d25),
  /original|source|D25|D26|D27|D28|D29|unplaced|authored/i);
 assert.throws(()=>auditD45OriginalFirstVoxelAndFractionalEgress({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25),
  /original|source|roof|wood|D25|D26|D27|D28|D29/i);
 assert.throws(()=>auditD45OriginalFirstVoxelAndFractionalEgress({...b,navigation:b.navigation.slice(1)},p,s,d25),
  /original|source|WALK|navigation|D25|D26|D27|D28|D29/i);
 assert.equal(roof.asset,'live:wood');
});
