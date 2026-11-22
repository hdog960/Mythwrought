import test from 'node:test';
import assert from 'node:assert/strict';
import {auditSourceProtectedMainGalleries}
 from '../src/living-underworld/main-gallery-source-survey.mjs';

const seed=179,rx=2,rz=0;
const ore={naturalAt:()=>999,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};

test('historical default still refuses on first original-source unsafe gallery',()=>{
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{source:ore});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'GALLERY_SOURCE_PROVENANCE_UNSAFE');
 assert.equal(r.galleriesInspected,1);
 assert.equal(r.sourceChecks,1);
 assert.equal(r.nativePlayerWalkingVerified,false);
});
test('diagnostic mode counts 16 refused ore galleries without approvals',()=>{
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{
  source:ore,diagnoseAllGalleries:true,maxTotalSourceChecks:120000,
  maxFailureExamples:16
 });
 assert.equal(r.ok,false);
 assert.equal(r.galleriesInspected,16);
 assert.equal(r.sourceRejectedGalleries,16);
 assert.equal(r.sourceSafeGalleries,0);
 assert.equal(r.firstRefusalCounts.UNSAFE_MATERIAL,16);
 assert.equal(r.sourceRejectionCounts.unsafeMaterial,16);
 assert.equal(r.sourceChecks,16);
 assert.equal(r.diagnosticAll16GalleriesAttempted,true);
 assert.equal(r.rows.length,16);
 assert.equal(r.failures.length,16);
 assert.equal(r.worldChanged,false);
});
test('all 16 player-edited gallery paths refuse without unsafe geology reads',()=>{
 let naturalReads=0;
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{
  source:{...ore,naturalAt:()=>{naturalReads++;return 1;},
   editedAt:()=>true},
  diagnoseAllGalleries:true,maxTotalSourceChecks:120000
 });
 assert.equal(r.ok,false);
 assert.equal(r.galleriesInspected,16);
 assert.equal(r.sourceRejectedGalleries,16);
 assert.equal(r.firstRefusalCounts.PLAYER_EDIT,16);
 assert.equal(r.sourceRejectionCounts.edited,16);
 assert.equal(naturalReads,0);
});
test('diagnostic cannot bypass aggregate source budget',()=>{
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{
  source:{...ore,naturalAt:()=>1},
  diagnoseAllGalleries:true,maxTotalSourceChecks:100
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'SOURCE_GALLERY_TOTAL_BUDGET');
 assert.ok(r.galleriesInspected<16);
 assert.ok(r.sourceChecks>100);
 assert.equal(r.worldChanged,false);
});
test('diagnostic mode must be explicitly boolean',()=>{
 assert.throws(()=>auditSourceProtectedMainGalleries(seed,rx,rz,{
  source:ore,diagnoseAllGalleries:'yes'
 }),/Invalid source-protected gallery survey/);
});
