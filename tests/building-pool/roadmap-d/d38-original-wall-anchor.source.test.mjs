// ONLY NEW D38 source-native tests; do not replay D25-D37 historical suites.
import test from 'node:test';import assert from 'node:assert/strict';
import {ROADMAP_D_WAVE16_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave16.mjs';
import {ROADMAP_D_WAVE17_BUILDINGS} from '../../../src/building-pool/roadmap-d/d1-original-institutions-wave17.mjs';
import {planD19SourceProvenRoofTrusses} from '../../../src/building-pool/roadmap-d/d19-original-supported-roof-truss-plan.mjs';
import {planD22SecondaryOriginalRoofTrusses} from '../../../src/building-pool/roadmap-d/d22-original-secondary-roof-trusses.mjs';
import {planD25OriginalLiveWoodRoofZones} from '../../../src/building-pool/roadmap-d/d25-original-livewood-roof-zones.mjs';
import {auditD38OriginalTensileWallCapture}
 from '../../../src/building-pool/roadmap-d/d38-original-anchor-path-audit.mjs';
const B=[...ROADMAP_D_WAVE16_BUILDINGS,...ROADMAP_D_WAVE17_BUILDINGS];
const plan=b=>{const p=planD19SourceProvenRoofTrusses(b),s=planD22SecondaryOriginalRoofTrusses(b,{existing:p});
 return [p,s,planD25OriginalLiveWoodRoofZones(b,p,s)];};
test('D38 genuine original 16 W16/W17 buildings: all 128 tensile roots, source-neighbor ring topology, owner palette/ray and NO accepted fasteners',()=>{
 assert.equal(B.length,16);
 const totals={buildings:0,roof:0,far:0,zones:0,bays:0,roots:0,tensile:0,twoCaps:0,clearSockets:0,
  vacantRingY5:0,vacantRingY6:0,blockedRingY5:0,blockedRingY6:0,
  solidNeighborY5:0,solidNeighborY6:0,couponTrials:0,couponsClear:0,couponsRejected:0,
  socketAABBOverlaps:0,meshSamples:0,maximumRayDelta:0,originalWrites:0,fasteners:0};
 const bin=[];
 for(const b of B){
  const [p,s,d25]=plan(b),snapshot=[b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],
    r=auditD38OriginalTensileWallCapture(b,p,s,d25,{maxRaySamples:1});
  assert.equal(r.constructionAllowed,false);assert.equal(r.acceptedStructuralLoads,0);
  assert.equal(r.noSourceWallPenetrationAllowed,true);
  assert.equal(r.noMechanicalCaptureOrApprovedIndependentFastener,true);
  assert.equal(r.faceOnlyNoProvenWallPullout,true);
  assert.equal(r.fourFaceRingSourceVacancyNotStructuralApproval,true);
  assert.equal(r.originalPack2MaterialShapesAndColorsUntouched,true);
  assert.equal(r.allOriginalWalkAndWeatherPlaneCellsUntouched,true);
  assert.equal(r.saveWrites,0);assert.equal(r.runtimeCellsModified,0);
  assert.equal(r.originalBuildingCellsModified,0);
  assert.deepEqual([b.cells.length,b.navigation.length,b.cells[0],b.cells.at(-1),b.navigation[0]],snapshot);
  totals.buildings++;totals.roof+=r.originalRoof;totals.far+=r.originalDistantRoofStillUncertified;
  totals.zones+=r.originalUncertifiedFarZones;totals.bays+=r.bays;totals.roots+=r.roots;
  totals.tensile+=r.rootTension;totals.twoCaps+=r.authenticTwoFaceSockets;
  totals.clearSockets+=r.sourceClearSockets;totals.vacantRingY5+=r.sourceRootedWallRingsY5Vacant;
  totals.vacantRingY6+=r.sourceRootedWallRingsY6Vacant;
  totals.blockedRingY5+=r.blockedWallRingsY5;totals.blockedRingY6+=r.blockedWallRingsY6;
  totals.solidNeighborY5+=r.originalNeighborSourceVetoSitesY5;
  totals.solidNeighborY6+=r.originalNeighborSourceVetoSitesY6;
  totals.couponTrials+=r.originalSourceCouponTrials;totals.couponsClear+=r.sourceClearCoupons;
  totals.couponsRejected+=r.sourceCollidingCoupons;
  totals.socketAABBOverlaps+=r.socketOverlappingCouponTrials;
  totals.meshSamples+=r.authenticSourcePaletteRaySamples;
  totals.maximumRayDelta=Math.max(totals.maximumRayDelta,r.maximumCouponRayDelta);
  totals.originalWrites+=r.worldWrites;totals.fasteners+=r.independentRatedAnchors;
  bin.push({id:b.id,bays:r.bays,roots:r.roots,blockedRingY5:r.blockedWallRingsY5,
   blockedRingY6:r.blockedWallRingsY6,neighborBlocksY5:r.originalNeighborSourceVetoSitesY5,
   neighborBlocksY6:r.originalNeighborSourceVetoSitesY6,clearCoupons:r.sourceClearCoupons,
   sourceClashingCoupons:r.sourceCollidingCoupons});
 }
 assert.deepEqual({b:totals.buildings,roof:totals.roof,far:totals.far,zones:totals.zones,
  bays:totals.bays,roots:totals.roots,tensile:totals.tensile,caps:totals.twoCaps,sockets:totals.clearSockets},
  {b:16,roof:115894,far:59412,zones:34,bays:64,roots:128,tensile:128,caps:128,sockets:128});
 assert.equal(totals.vacantRingY5+totals.blockedRingY5,128);
 assert.equal(totals.vacantRingY6+totals.blockedRingY6,128);
 assert.equal(totals.couponTrials,256);
 assert.equal(totals.couponsClear+totals.couponsRejected,256);
 assert.equal(totals.meshSamples,16);assert.ok(totals.maximumRayDelta<1e-5);
 assert.equal(totals.fasteners,0);assert.equal(totals.originalWrites,0);
 console.log('D38 ORIGINAL SOURCE ROOT TENSILE CAPTURE TOTALS '+JSON.stringify(totals));
 console.log('D38 ORIGINAL SOURCE WALL RING BINS '+JSON.stringify(bin));
});
test('D38 rejects tampered original roof, deleted author WALK and fictitious creator approval',()=>{
 const b=B[0],[p,s,d25]=plan(b),roof=b.cells.find(c=>c.at[1]===7&&c.feature==='weather-plane');
 assert.equal(roof?.asset,'live:wood');
 assert.throws(()=>auditD38OriginalTensileWallCapture({...b,creatorApproved:true},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|unplaced|authored/i);
 assert.throws(()=>auditD38OriginalTensileWallCapture({...b,cells:b.cells.map(c=>c===roof?{...c,asset:'live:stone'}:c)},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|roof|wood/i);
 assert.throws(()=>auditD38OriginalTensileWallCapture({...b,navigation:b.navigation.slice(1)},p,s,d25,{maxRaySamples:0}),
  /D25|D26|D27|D28|D29|source|original|WALK|navigation/i);
 assert.equal(roof.asset,'live:wood');
});
