import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateD28UnratedBayDemand,d28CellEndFaceArea,d28SameAxisJoinGeometry}
 from '../../../src/building-pool/roadmap-d/d28-long-bay-load-equations.mjs';
test('D28 normalized demand scales quadratically for bending and quartically for deflection, never fabricates capacity',()=>{
 const a=calculateD28UnratedBayDemand(13),b=calculateD28UnratedBayDemand(27);
 assert.equal(a.clearCenterlineSpanCells,14);assert.equal(b.clearCenterlineSpanCells,28);
 assert.equal(b.idealPeakBendingMomentDemand,4*a.idealPeakBendingMomentDemand);
 assert.equal(b.idealDeflectionNumeratorBeforeUnknownEI,16*a.idealDeflectionNumeratorBeforeUnknownEI);
 assert.equal(b.idealSimpleSupportReactionAtEachEnd,2*a.idealSimpleSupportReactionAtEachEnd);
 assert.equal(a.timberAllowableMoment,null);assert.equal(a.jointMomentRating,null);
 assert.equal(a.canBuildOrCertify,false);assert.equal(b.canBuildOrCertify,false);
});
test('D28 exact face union counts collar overlap once, rejects full-cube forgery and missing face',()=>{
 const b=[[0,.26,.26,1,.74,.74],[0,.2,.2,.14,.8,.8],[.86,.2,.2,1,.8,.8]];
 assert.ok(Math.abs(d28CellEndFaceArea(b,'x',0)-.36)<1e-10);
 assert.ok(Math.abs(d28CellEndFaceArea(b,'x',1)-.36)<1e-10);
 assert.ok(Math.abs(d28SameAxisJoinGeometry(b,'x').adjacentFaceArea-.36)<1e-10);
 assert.equal(d28SameAxisJoinGeometry(b,'x').buildingAllowed,false);
 assert.throws(()=>d28SameAxisJoinGeometry([[0,0,0,.5,1,1]],'x'),/one-sided/);
 assert.throws(()=>d28CellEndFaceArea([[0,0,0,2,1,1]],'x',1),/original finite/);
});
test('D28 forbids missing, overlong and forged loads even when geometry exists',()=>{
 for(const n of [0,1,12,49,1.4,Infinity])assert.throws(()=>calculateD28UnratedBayDemand(n),/long-bay/);
 for(const q of [0,-1,NaN,Infinity])assert.throws(()=>calculateD28UnratedBayDemand(15,{unitLineLoad:q}),/long-bay/);
 assert.equal(calculateD28UnratedBayDemand(48).canBuildOrCertify,false);
});
