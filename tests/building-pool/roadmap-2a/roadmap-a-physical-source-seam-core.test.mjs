import test from 'node:test';
import assert from 'node:assert/strict';
import {auditExactPack5SeamCandidates as check} from '../../../src/building-pool/roadmap-2a/roadmap-a-physical-source-seam-core.mjs';
const box=(bounds,material='mortar',color=[.4,.4,.4,1])=>({bounds,material,color});
const fixture=(at,parts=[box([0,0,0,1,1,1])],more={})=>({previewFixtureOnly:true,symbol:'pack5:080',variant:'hearth-running-bond',orientation:0,at,art:parts,...more});
test('two truly coincident opaque full cell box faces produce one conservative pair',()=>{
 const d=check([fixture([0,0,0]),fixture([1,0,0])]);
 assert.equal(d.sourceAuthoredPhysicalBoxes,2);assert.equal(d.originalSourceTriangles,24);
 assert.equal(d.exactOpaqueOppositeFacePairs,1);assert.equal(d.hypotheticalRemainingTriangles,20);
 assert.equal(d.appliedToActualRenderer,false);assert.equal(d.collisionOrSupportModified,false);
});
test('partial, distinct material, distinct variant, and unmatched planes never cull',()=>{
 const a=fixture([0,0,0]);
 for(const b of [fixture([1,0,0],[box([0,0,0,1,.7,1])]),
  fixture([1,0,0],[box([0,0,0,1,1,1],'terra')]),
  fixture([1,0,0],undefined,{variant:'kiln-soldier-course'}),fixture([2,0,0])]){
  assert.equal(check([a,b]).exactOpaqueOppositeFacePairs,0);
 }
});
test('fail closed for missing authored variant, source ID, transparent art, duplicate anchors, quota',()=>{
 for(const bad of [fixture([1,0,0],undefined,{variant:null}),
  fixture([1,0,0],undefined,{buildingId:'r2:bank:snow:medium:03'}),
  fixture([1,0,0],[box([0,0,0,1,1,1],'mortar',[1,1,1,.4])]),
  fixture([1,0,0],undefined,{orientation:6})]){
  assert.throws(()=>check([fixture([0,0,0]),bad]),/source-only seam guard/);
 }
 assert.throws(()=>check([fixture([0,0,0]),fixture([0,0,0])]),/overlapping/);
 assert.throws(()=>check([fixture([0,0,0]),fixture([1,0,0])],{maxFixtures:1}),/capacity/);
 assert.throws(()=>check([fixture([0,0,0]),fixture([1,0,0])],{maxBoxes:1}),/box limit/);
});
test('deterministic candidate count with test fixture order changed',()=>{
 const a=[fixture([0,0,0]),fixture([1,0,0]),fixture([2,0,0])];
 assert.equal(check(a).exactOpaqueOppositeFacePairs,2);
 assert.equal(check(a.toReversed()).exactOpaqueOppositeFacePairs,2);
});

test('rounded-key near-match is not true exact opaque full-face coincidence',()=>{
 const a=fixture([0,0,0]);
 for(const altered of [
  box([.0000003,0,0,1,1,1]),
  box([0,.0000003,0,1,1,1]),
  box([0,0,0,1,1,1],'mortar',[.4000003,.4,.4,1])
 ]){
   assert.equal(check([a,fixture([1,0,0],[altered])]).exactOpaqueOppositeFacePairs,0);
 }
 assert.equal(check([a,fixture([1,0,0])]).exactOpaqueOppositeFacePairs,1);
});

test('genuine original Pack5 ceramic grout source box yields exact preview seam only for matching unchosen variant',()=>{
 const art=[box([0,.015,0,1,.095,1],'grout',[.43,.46,.43,1])];
 const a=fixture([0,0,0],art,{symbol:'pack5:081',variant:'sunburst-encaustic'});
 const b=fixture([1,0,0],art,{symbol:'pack5:081',variant:'sunburst-encaustic'});
 const alt=fixture([1,0,0],art,{symbol:'pack5:081',variant:'moonwoven-glaze'});
 assert.equal(check([a,b]).exactOpaqueOppositeFacePairs,1);
 assert.equal(check([a,alt]).exactOpaqueOppositeFacePairs,0);
 assert.equal(check([a,b]).appliedToActualRenderer,false);
});
