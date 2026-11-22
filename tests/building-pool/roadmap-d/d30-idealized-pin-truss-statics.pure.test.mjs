import test from 'node:test';
import assert from 'node:assert/strict';
import {solveD30IdealizedUnderslungTruss} from '../../../src/building-pool/roadmap-d/d30-idealized-pin-truss-statics.mjs';
test('D30 genuine algebraic equilibrium of bounded 14-49 cell pin-web topological model',()=>{
 for(const interior of [13,14,17,22,33,48]){
  const m=solveD30IdealizedUnderslungTruss(interior),L=interior+1;
  assert.equal(m.nodes.length,2*m.panelCount);
  assert.equal(m.members.length,2*m.nodes.length-3);
  assert.ok(Math.abs(m.bearingReactionPerUnitRoofLineLoad[0]-L/2)<1e-7);
  assert.ok(Math.abs(m.bearingReactionPerUnitRoofLineLoad[1]-L/2)<1e-7);
  assert.ok(m.maximumFreeDegreeEquilibriumResidual<1e-7);
  assert.ok(m.idealizedPeakCompressionPerUnitRoofLineLoad>0);
  assert.ok(m.idealizedPeakTensionPerUnitRoofLineLoad>0);
  assert.ok(m.idealizedMinCompressionEIForPinnedUnbracedAssumptionPerUnitLoad>0);
  assert.equal(m.roofSupportCertified,false);
  assert.equal(m.constructionAllowed,false);
  assert.equal(m.unitLineLoadIsNotRealSourceRoofLoad,true);
 }
});
test('D30 uncalibrated material capacity cannot be smuggled into normalizations and degenerate span is refused',()=>{
 for(const interior of [12,49,NaN,Infinity,13.2])assert.throws(()=>solveD30IdealizedUnderslungTruss(interior),/budget/);
 for(const maxPanelLength of [0,1,5,2.5,Infinity])assert.throws(()=>solveD30IdealizedUnderslungTruss(20,{maxPanelLength}),/budget/);
 const sample=solveD30IdealizedUnderslungTruss(48,{maxPanelLength:2});
 assert.ok(sample.panelCount>13&&sample.numberOfMembers>0);
 assert.equal(sample.realDiagonalOwnerAndCrossSectionMissing,true);
 assert.equal(sample.ratedAxialPinAndChordJointStrengthMissing,true);
});
test('D30 ideal member forces balance point loads but distributed top chord still requires separate bending resistance',()=>{
 const m=solveD30IdealizedUnderslungTruss(33);
 assert.equal(m.idealizedSimplySupportedPanelLocalTopChordMomentPerUnitLoad,m.panelLength**2/8);
 assert.equal(m.idealizedSimplySupportedPanelLocalTopChordShearPerUnitLoad,m.panelLength/2);
 assert.ok(m.maxTrussMemberLength>m.panelLength);
 assert.ok(m.members.every(e=>Number.isFinite(e.normalizedAxialForce)&&!e.approvedMaterial));
 assert.ok(m.nodes.every(n=>n.y===5.5||n.y===6.5));
});
