// NEW ONLY D40 original W16/W17 Node22 native tests, no historical rerun.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD40OriginalSweptExteriorRoutes}
 from '../../../src/building-pool/roadmap-d/d40-original-swept-route-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D40 genuinely original sixteen W16/W17: bounded radius4 with and without lower Y3 course, finite-thickness swept collision and native registered-shape math',()=>{
 assert.equal(B.length,16);
 const total={buildings:0,roofs:0,uncertified:0,zones:0,bays:0,roots:0,sockets:0,tension:0,
  r5:0,r6:0,solidY5:0,solidY6:0,
  radius4_4to6:0,radius4_3to6:0,gainedLower:0,rejectedExtended:0,
  backClear:0,backBlocked:0,centerSolidsWithoutY3:0,centerSolidsWithY3:0,
  centerWalkWithoutY3:0,centerWalkWithY3:0,edgeSolidsWithoutY3:0,edgeSolidsWithY3:0,
  edgeBodyWithoutY3:0,edgeBodyWithY3:0,edgeSocketWithoutY3:0,edgeSocketWithY3:0,
  selectedPrismSegments:0,courseBends:0,nativeRaySamples:0,nativeClearBodies:0,
  nativeOverlapControls:0,nativeRegisteredLocalShapePieces:0,maxNativeRayDifference:0,originalWrites:0};
 const bins=[];
 for(const b of B){
  const [p,s,d25]=plan(b),before=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   r=auditD40OriginalSweptExteriorRoutes(b,p,s,d25,{halfWidth:.08,maxNativeSamples:1});
  assert.equal(r.constructionAllowed,false);assert.equal(r.structuralReleaseApproved,false);
  assert.equal(r.noAuthoredOwnerApprovedMetalStrap,true);
  assert.equal(r.noBackFacePositiveRatedRetention,true);
  assert.equal(r.originalWallAndFootingNeverAltered,true);
  assert.equal(r.originalY7LiveWoodUnchanged,true);
  assert.equal(r.originalUpperTiersAndAuthoredWALKUnchanged,true);
  assert.equal(r.globallyImpossibleAnchorNotProven,true);
  assert.equal(r.actualRatedFasteners,0);
  assert.equal(r.worldWrites,0);assert.equal(r.saveWrites,0);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],before);
  total.buildings++;total.roofs+=r.originalLiveWoodRoofCells;
  total.uncertified+=r.originalDistantRoofCellsStillUncertified;
  total.zones+=r.originalFarZones;total.bays+=r.bays;total.roots+=r.roots;
  total.sockets+=r.sourceClearSockets;total.tension+=r.positiveNormalizedTensionRoots;
  total.r5+=r.inheritedVacantY5;total.r6+=r.inheritedVacantY6;
  total.solidY5+=r.inheritedSolidNeighborsY5;total.solidY6+=r.inheritedSolidNeighborsY6;
  total.radius4_4to6+=r.radius4Y4Y6FullPrismLoops;
  total.radius4_3to6+=r.radius4Y3Y6FullPrismLoops;
  total.gainedLower+=r.radius4LowerCourseNewLoops;
  total.rejectedExtended+=r.stillNoFiniteThicknessRoute;
  total.backClear+=r.originalBackFaceClearSites;
  total.backBlocked+=r.originalBackFaceBlockedSites;
  total.centerSolidsWithoutY3+=r.firstSearchOriginalVetoCenters;
  total.centerSolidsWithY3+=r.secondSearchOriginalVetoCenters;
  total.centerWalkWithoutY3+=r.firstSearchBodyVetoCenters;
  total.centerWalkWithY3+=r.secondSearchBodyVetoCenters;
  total.edgeSolidsWithoutY3+=r.firstSearchSweptEdgeSolidVetoes;
  total.edgeSolidsWithY3+=r.secondSearchSweptEdgeSolidVetoes;
  total.edgeBodyWithoutY3+=r.firstSearchSweptEdgeBodyVetoes;
  total.edgeBodyWithY3+=r.secondSearchSweptEdgeBodyVetoes;
  total.edgeSocketWithoutY3+=r.firstSearchSweptEdgeSocketVetoes;
  total.edgeSocketWithY3+=r.secondSearchSweptEdgeSocketVetoes;
  total.selectedPrismSegments+=r.totalSelectedSweptSegments;
  total.courseBends+=r.selectedBendElevationChanges;
  total.nativeRaySamples+=r.nativeRayChecks;
  total.nativeClearBodies+=r.nativeBodyClearProbes;
  total.nativeOverlapControls+=r.nativeBodyOverlapControls;
  total.nativeRegisteredLocalShapePieces+=r.nativeVoxelSplitParts;
  total.maxNativeRayDifference=Math.max(total.maxNativeRayDifference,r.maxNativeRayDifference);
  total.originalWrites+=r.sourceCellsWritten;
  bins.push({id:b.id,bays:r.bays,roots:r.roots,loopsWithoutY3:r.radius4Y4Y6FullPrismLoops,
   loopsWithY3:r.radius4Y3Y6FullPrismLoops,sourceBodyVetoes:r.secondSearchBodyVetoCenters,
   originalAuthoredVoxelVetoes:r.secondSearchOriginalVetoCenters});
 }
 assert.deepEqual({b:total.buildings,roof:total.roofs,far:total.uncertified,zones:total.zones,
  bays:total.bays,roots:total.roots,sockets:total.sockets,tension:total.tension},
  {b:16,roof:115894,far:59412,zones:34,bays:64,roots:128,sockets:128,tension:128});
 assert.equal(total.r5,4);assert.equal(total.r6,4);
 assert.equal(total.solidY5,213);assert.equal(total.solidY6,213);
 assert.ok(total.radius4_4to6<=total.radius4_3to6);
 assert.equal(total.radius4_3to6+total.rejectedExtended,128);
 assert.equal(total.backClear+total.backBlocked,128);
 assert.equal(total.nativeRaySamples,16);
 assert.equal(total.nativeClearBodies,16);assert.equal(total.nativeOverlapControls,16);
 assert.equal(total.nativeRegisteredLocalShapePieces,32);
 assert.ok(total.maxNativeRayDifference<1e-5);
 assert.equal(total.originalWrites,0);
 console.log('D40 AUTHENTIC ORIGINAL SWEPT RADIUS FOUR Y3/Y4 COMPARISON '+JSON.stringify(total));
 console.log('D40 AUTHENTIC ORIGINAL SWEPT SOURCE BUILDING BINS '+JSON.stringify(bins));
});
test('D40 original source authority fails closed for altered Y7 live:wood, removed WALK and counterfeit creator release',()=>{
 const b=B[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD40OriginalSweptExteriorRoutes({...b,creatorApproved:true},p,s,d25,{maxNativeSamples:0}),
  /D25|D26|D27|D28|D29|source|original|unplaced|authored/i);
 assert.throws(()=>auditD40OriginalSweptExteriorRoutes({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25,{maxNativeSamples:0}),
  /D25|D26|D27|D28|D29|source|original|roof|wood/i);
 assert.throws(()=>auditD40OriginalSweptExteriorRoutes({...b,navigation:b.navigation.slice(1)},p,s,d25,{maxNativeSamples:0}),
  /D25|D26|D27|D28|D29|source|original|WALK|navigation/i);
 assert.equal(roof.asset,'live:wood');
});
