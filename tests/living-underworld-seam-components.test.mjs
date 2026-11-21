import test from 'node:test';
import assert from 'node:assert/strict';
import {auditPhysicalRegionSeams} from '../src/living-underworld/region-seam-components.mjs';

test('floodfill proves adjacent regions share real 3D air components at multiple depths',()=>{
 for(const seed of [179,2026])for(const [rx,rz] of [[0,0],[-37,52]]){
  const proof=auditPhysicalRegionSeams(seed,rx,rz,{levelIndices:[0,2],radius:7});
  assert.equal(proof.checkedSeams,4);
  assert.equal(proof.pass,true,JSON.stringify(proof.checks.filter(c=>!c.passed)));
  assert.ok(proof.checks.every(c=>c.anchors.every(a=>a.air&&a.inBounds)));
  assert.equal(proof.completeInfiniteConnectivityUnverified,true);
 }
});
test('physical seam census has strict bounds and coordinate validation',()=>{
 assert.throws(()=>auditPhysicalRegionSeams(179,0,0,{radius:13}),/Invalid/);
 assert.throws(()=>auditPhysicalRegionSeams(179,0.5,0),/Invalid/);
 assert.throws(()=>auditPhysicalRegionSeams(179,0,0,{directions:['east','east']}),/Invalid/);
 assert.throws(()=>auditPhysicalRegionSeams(179,0,0,{levelIndices:[0,0]}),/Invalid/);
});
