// D39 ONLY NEW targeted genuine original Wave16/17 Node tests. Earlier D25-D38
// tests are not replayed; direct original source graph is mandatory here.
import test from 'node:test';
import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD39OriginalMultiCourseWallCapture}
 from '../../../src/building-pool/roadmap-d/d39-original-uncertified-wall-loop-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D39 exact genuine sixteen W16/W17 source buildings: 128 tensile roots, original source ring provenance and bounded multi-course topological loops',()=>{
 assert.equal(B.length,16);
 const total={buildings:0,roofs:0,far:0,zones:0,bays:0,roots:0,tension:0,
  sockets:0,legacyY5:0,legacyY6:0,neighborY5:0,neighborY6:0,
  loops:0,noLoops:0,multicourse:0,singleCourse:0,backAvailable:0,backUnavailable:0,
  sourceVetoes:0,bodyVetoes:0,socketVetoes:0,coupons:0,couponsClear:0,couponsBlocked:0,
  nativeBody:0,nativeBodyOverlapControls:0,nativeShapeRays:0,maxNativeRayDelta:0};
 const bins=[];
 for(const b of B){
  const [p,s,d25]=plan(b),before=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
   r=auditD39OriginalMultiCourseWallCapture(b,p,s,d25,{maxRadius:3,levels:[4,5,6],maxNativeSamples:2});
  assert.equal(r.constructionAllowed,false);
  assert.equal(r.structuralReleaseApproved,false);
  assert.equal(r.multiCourseSearchBoundCannotProveGlobalImpossibility,true);
  assert.equal(r.closedProjectedWindingNotFastenedPhysicalCapture,true);
  assert.equal(r.vacantNeighborCellIsNotClosedOriginalMechanicalLoop,true);
  assert.equal(r.sourceRearFaceContactNotRatedTension,true);
  assert.equal(r.originalY7WoodAndUpperRoofUntouched,true);
  assert.equal(r.allAuthoredWalkingNodesPreserved,true);
  assert.equal(r.originalOwnerMaterialShapesUnmodified,true);
  assert.equal(r.originalRatedTensionAndShearCapacityUnknown,true);
  assert.equal(r.loadBearingWallLoopsCertified,0);
  assert.equal(r.fastenersPhysicallyInstalled,0);
  assert.equal(r.worldCellsModified,0);
  assert.equal(r.saveWrites,0);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],before);
  total.buildings++;total.roofs+=r.originalLiveWoodRoofCells;
  total.far+=r.originalDistantRoofCellsStillUncertified;
  total.zones+=r.originalUncertifiedFarZones;total.bays+=r.bays;total.roots+=r.roots;
  total.tension+=r.positiveTensileRoots;total.sockets+=r.sourceClearD36Sockets;
  total.legacyY5+=r.legacyFourFaceRingsAtY5;total.legacyY6+=r.legacyFourFaceRingsAtY6;
  total.neighborY5+=r.originalNeighborBlockedY5;total.neighborY6+=r.originalNeighborBlockedY6;
  total.loops+=r.graphSourceOnlyWindingLoops;total.noLoops+=r.graphNoWindingLoopInBoundedSearch;
  total.multicourse+=r.sourceOnlyMultiCourseLoops;total.singleCourse+=r.sourceOnlySingleCourseLoops;
  total.backAvailable+=r.rootedBackFaceAccessibleSites;
  total.backUnavailable+=r.rootedBackFaceUnreachableSites;
  total.sourceVetoes+=r.candidateSourceSolidCellVetoes;
  total.bodyVetoes+=r.authoredY2BodyVetoes;total.socketVetoes+=r.socketEnvelopeVetoes;
  total.coupons+=r.originalRearCouponStudies;
  total.couponsClear+=r.sourceClearOriginalRearCoupons;
  total.couponsBlocked+=r.sourceBlockedRearCoupons;
  total.nativeBody+=r.actualOriginalBodyFitProbes;
  total.nativeBodyOverlapControls+=r.actualOriginalIntentionalBodyCollisions;
  total.nativeShapeRays+=r.nativeSourceShapeRayChecks;
  total.maxNativeRayDelta=Math.max(total.maxNativeRayDelta,r.maxNativeRayDifference);
  bins.push({id:b.id,roots:r.roots,bays:r.bays,
    loops:r.graphSourceOnlyWindingLoops,multicourse:r.sourceOnlyMultiCourseLoops,
    rearAccessible:r.rootedBackFaceAccessibleSites,
    rearCouponsClear:r.sourceClearOriginalRearCoupons,
    nativeSourceRayChecks:r.nativeSourceShapeRayChecks});
 }
 assert.deepEqual({buildings:total.buildings,roofs:total.roofs,far:total.far,zones:total.zones,
  bays:total.bays,roots:total.roots,tension:total.tension,sockets:total.sockets},
  {buildings:16,roofs:115894,far:59412,zones:34,bays:64,roots:128,tension:128,sockets:128});
 // Recompute D38's genuine authored source vacancy counts as an identity gate.
 assert.equal(total.legacyY5,4);assert.equal(total.legacyY6,4);
 assert.equal(total.neighborY5,213);assert.equal(total.neighborY6,213);
 assert.equal(total.loops+total.noLoops,128);
 assert.equal(total.multicourse+total.singleCourse,total.loops);
 assert.equal(total.backAvailable+total.backUnavailable,128);
 assert.equal(total.coupons,128);
 assert.equal(total.couponsClear+total.couponsBlocked,128);
 assert.ok(total.nativeShapeRays>0&&total.nativeShapeRays<=32);
 assert.equal(total.nativeBody,total.nativeShapeRays);
 assert.equal(total.nativeBodyOverlapControls,total.nativeShapeRays);
 assert.ok(total.maxNativeRayDelta<1e-5);
 console.log('D39 GENUINE ORIGINAL BOUNDED MULTI-COURSE LOOP AND REAR CONTACT TOTALS '+JSON.stringify(total));
 console.log('D39 GENUINE ORIGINAL PER-BUILDING LOOP BINS '+JSON.stringify(bins));
});
test('D39 original authored roof and WALK are immutable and creator-approved counterfeit source fails closed',()=>{
 const b=B[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD39OriginalMultiCourseWallCapture({...b,creatorApproved:true},p,s,d25,{maxNativeSamples:0}),
  /D25|D26|D27|D28|D29|original|unplaced|source/i);
 assert.throws(()=>auditD39OriginalMultiCourseWallCapture({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25,{maxNativeSamples:0}),
  /D25|D26|D27|D28|D29|original|source|roof|wood/i);
 assert.throws(()=>auditD39OriginalMultiCourseWallCapture({...b,navigation:b.navigation.slice(1)},p,s,d25,{maxNativeSamples:0}),
  /D25|D26|D27|D28|D29|original|source|navigation|WALK/i);
 assert.equal(roof.asset,'live:wood');
});
