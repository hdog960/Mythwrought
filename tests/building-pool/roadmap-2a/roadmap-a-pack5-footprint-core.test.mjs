import test from 'node:test';
import assert from 'node:assert/strict';
import {originalPack5ProjectedUnionArea,originalPack5FaceFootprint}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-pack5-footprint-core.mjs';
const cube=[0,0,0,1,1,1];
const near=(a,b)=>assert.ok(Number.isFinite(a)&&Math.abs(a-b)<1e-7,`expected ${b}, got ${a}`);

test('source projected union counts overlapping original full-face rectangles only once',()=>{
 near(originalPack5ProjectedUnionArea([[0,0,.75,1],[.25,0,1,1]]),1);
 near(originalPack5ProjectedUnionArea([[0,0,.4,.4],[.4,.4,1,1]]),.52);
 assert.equal(originalPack5ProjectedUnionArea([]),0);
});
test('0.025 original plaster inset yields 0.9025 source projected collider footprint, not bearing',()=>{
 const dep=[[.025,.025,.025,.975,.975,.141]];
 const r=originalPack5FaceFootprint(dep,[cube],[0,0,0],[0,0,-1]);
 near(r.nearestOriginalFaceGapBlockUnits,.025);
 near(r.projectedDependentFaceArea,.9025);
 near(r.nearestGapPairProjectedUnionArea,.9025);
 assert.equal(r.backingFootprintLacksFullDependentFaceContact,false);
 assert.equal(r.fullFaceAreaAtClosestGapOnly,false);
 assert.equal(r.geometricContactIsNotPhysicalLoadCertification,true);
});
test('0.015 source thin tile projected footprint covers one block of area, despite positive gap',()=>{
 const r=originalPack5FaceFootprint([[0,.015,0,1,.15,1]],[cube],[0,1,0],[0,0,0]);
 near(r.nearestOriginalFaceGapBlockUnits,.015);
 near(r.nearestGapPairProjectedUnionArea,1);
 assert.equal(r.fullFaceAreaAtClosestGapOnly,true);
 assert.equal(r.actualWorldCollisionWasNotRun,true);
});
test('closest decorative sliver cannot promote wider distant material to support',()=>{
 const r=originalPack5FaceFootprint([
  [0,0,.01,.2,.2,.5],[0,0,.2,1,1,1]
 ],[cube],[0,0,0],[0,0,-1]);
 near(r.nearestOriginalFaceGapBlockUnits,.01);
 near(r.possibleTangentialProjectionOverlapArea,1);
 near(r.nearestGapPairProjectedUnionArea,.04);
 near(r.nearestGapProjectedCoverageOfDependent,.04);
 assert.equal(r.backingFootprintLacksFullDependentFaceContact,true);
});
test('split adjacent rectangles cover full original face without duplicate overlap area',()=>{
 const r=originalPack5FaceFootprint([
  [0,0,.025,.5,1,.5],[.5,0,.025,1,1,.5]
 ],[cube],[0,0,0],[0,0,-1]);
 near(r.nearestGapPairProjectedUnionArea,1);
 assert.equal(r.closestPairProjectionCount,2);
 assert.equal(r.fullFaceAreaAtClosestGapOnly,true);
});
test('all six original source cell directions use exact candidate face and bounded projection',()=>{
 for(let axis=0;axis<3;axis++)for(const s of [-1,1]){
  const at=[0,0,0];at[axis]=s;
  const r=originalPack5FaceFootprint([cube],[cube],at,[0,0,0]);
  near(r.nearestGapPairProjectedUnionArea,1);
  assert.equal(r.axis,axis);
  assert.equal(r.dependentOnPositiveSide,s===1);
  assert.equal(r.nearestOriginalFaceGapBlockUnits,0);
 }
});
test('tangential edge or corner touch never constitutes face-area projection',()=>{
 const r=originalPack5FaceFootprint([[0,0,.025,.5,.5,.7]],
  [[.5,.5,0,1,1,1]],[0,0,0],[0,0,-1]);
 assert.equal(r.nearestOriginalFaceGapBlockUnits,null);
 assert.equal(r.nearestGapPairProjectedUnionArea,0);
 assert.equal(r.possibleTangentialProjectionOverlapArea,0);
 assert.equal(r.closestPairProjectionCount,0);
});
test('near-coincident geometry is not rounded into exact zero-gap contact',()=>{
 const r=originalPack5FaceFootprint([[0,0,.00000001,1,1,1]],[cube],[0,0,0],[0,0,-1]);
 assert.ok(r.nearestOriginalFaceGapBlockUnits>0);
 assert.equal(r.nearestOriginalFaceGapBlockUnits,.00000001);
 assert.equal(r.nearestGapPairProjectedUnionArea,1);
 assert.equal(r.geometricContactIsNotPhysicalLoadCertification,true);
});
test('bad original boxes, face adjacency, or source-only rectangle budgets fail closed',()=>{
 assert.throws(()=>originalPack5ProjectedUnionArea([[0,0,0,1]],{maxRectangles:0}),/cap/);
 assert.throws(()=>originalPack5ProjectedUnionArea([[0,0,2,1]]),/invalid projected/);
 assert.throws(()=>originalPack5FaceFootprint([[-.01,0,0,1,1,1]],[cube],[0,0,0],[0,0,-1]),/original single-cell/);
 assert.throws(()=>originalPack5FaceFootprint([cube],[cube],[1,1,0],[0,0,0]),/face-adjacent/);
});
