import test from 'node:test';
import assert from 'node:assert/strict';
import {screenD29ExplicitRatedLongBay} from '../../../src/building-pool/roadmap-d/d29-structural-demand-screen.mjs';
const loads={tributaryWidth:2,gravityAreaLoad:3,netUpliftAreaLoad:1,lateralAreaLoad:.5,maximumDeflectionRatio:240};
const ratings={beamMoment:10000,beamShear:10000,beamEI:1e10,jointMoment:10000,jointShear:10000,
 roofGravityTransferPerLength:10000,roofUpliftTransferPerLength:10000,
 endBearingGravity:10000,endBearingUplift:10000,endBearingLateral:10000};
test('D29 absent load cases and every capacity are fail-closed, never a long roof certification',()=>{
 const r=screenD29ExplicitRatedLongBay(48);
 assert.equal(r.spanCenterlineCells,49);
 assert.equal(r.demands,null);assert.equal(r.capacitiesPass,null);
 assert.equal(r.missingLoadData.length,5);assert.equal(r.missingRatings.length,10);
 assert.equal(r.structuralReleaseAccepted,false);assert.equal(r.constructionAllowed,false);
 assert.equal(r.numericScreenPass,false);
});
test('D29 explicit simply-supported demand scales correctly; even forged generous ratings cannot grant construction',()=>{
 const a=screenD29ExplicitRatedLongBay(13,{loads,ratings,loadEvidenceId:'test-load-only',ratingEvidenceId:'test-rating-only'}),
  b=screenD29ExplicitRatedLongBay(27,{loads,ratings});
 assert.equal(a.demands.gravityLineLoad,6);
 assert.equal(a.demands.maximumSimpleSpanMoment,147);
 assert.equal(a.demands.verticalReactionAtEachOriginalBearing,42);
 assert.equal(b.demands.maximumSimpleSpanMoment,4*a.demands.maximumSimpleSpanMoment);
 assert.equal(b.demands.requiredContinuousEIAtSpecifiedDeflectionLimit,
  8*a.demands.requiredContinuousEIAtSpecifiedDeflectionLimit);
 assert.equal(a.numericScreenPass,true);
 assert.equal(a.structuralReleaseAccepted,false);
 assert.equal(a.constructionAllowed,false);
 assert.ok(a.missingProvenance.includes('physicalAssemblyTested'));
 const low=screenD29ExplicitRatedLongBay(27,{loads,ratings:{...ratings,jointMoment:1}});
 assert.equal(low.capacitiesPass.jointMoment,false);
 assert.equal(low.numericScreenPass,false);
 assert.equal(low.constructionAllowed,false);
});
test('D29 invalid or omitted engineering loads, unsupported spans and strength figures cannot pass',()=>{
 for(const n of [12,49,NaN,13.2,Infinity])assert.throws(()=>screenD29ExplicitRatedLongBay(n),/authentic long-bay/);
 for(const bad of [{...loads,gravityAreaLoad:0},{...loads,maximumDeflectionRatio:0},
  {...loads,netUpliftAreaLoad:-1},{...loads,lateralAreaLoad:Infinity}])
   assert.throws(()=>screenD29ExplicitRatedLongBay(20,{loads:bad,ratings}),/load input|deflection ratio/);
 assert.throws(()=>screenD29ExplicitRatedLongBay(20,{loads,ratings:{...ratings,beamEI:Infinity}}),/rating/);
 const missing=screenD29ExplicitRatedLongBay(20,{loads,ratings:{beamMoment:200}});
 assert.equal(missing.capacitiesPass,null);assert.equal(missing.missingRatings.length,9);
});
