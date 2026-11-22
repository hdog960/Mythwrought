import test from 'node:test';
import assert from 'node:assert/strict';
import {auditSourceProtectedMainGalleries}
 from '../src/living-underworld/main-gallery-source-survey.mjs';

const seed=179,rx=2,rz=0;
const stone={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
const ore={...stone,naturalAt:()=>999};
const options={source:stone,diagnoseAllGalleries:true,
 countEverySourceVeto:true,maxTotalSourceChecks:120000,
 maxFailureExamples:16};

test('16 exact original detached galleries have a complete full-source census',()=>{
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,options);
 assert.equal(r.ok,true);
 assert.equal(r.galleriesInspected,16);
 assert.equal(r.sourceSafeGalleries,16);
 assert.equal(r.sourceChecks,24768);
 assert.equal(r.completeSourceVetoCensus,true);
 assert.equal(r.countsRepresentAllEligibleCells,true);
 assert.equal(r.sourceCountMethod,'FULL_COMPLETED_GALLERY_SOURCE_VOXELS');
 assert.equal(r.sourceRejectionCounts.geologyExcavation,18576);
 assert.equal(r.sourceRejectionCounts.preexistingSolidSupport,6192);
 assert.equal(r.worldChanged,false);
});
test('entire synthetic ore rock requires 24768 vetoes, never one per gallery',()=>{
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{
  ...options,source:ore
 });
 assert.equal(r.ok,false);
 assert.equal(r.galleriesInspected,16);
 assert.equal(r.sourceRejectedGalleries,16);
 assert.equal(r.sourceRejectionCounts.unsafeMaterial,24768);
 assert.equal(r.firstRefusalCounts.UNSAFE_MATERIAL,16);
 assert.equal(r.completeSourceVetoCensus,true);
 assert.equal(r.rows.length,16);
 assert.equal(r.failures.length,16);
});
test('original material roles are separately counted across every gallery cell',()=>{
 const source={
  naturalAt:(x,y,z)=>Math.abs(x+z)%7===0?999:1,
  authoredAt:(x,y,z)=>(x+y+z)%23===0?0:undefined,
  editedAt:(x,y,z)=>(x+y+z)%31===0,
  protectedAt:(x,y,z)=>(x+y+z)%29===0
 };
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{
  ...options,source
 });
 assert.equal(r.ok,false);
 assert.equal(r.completeSourceVetoCensus,true);
 assert.equal(r.sourceChecks,24768);
 for(const key of ['unsafeMaterial','edited','protected',
  'authoredAirSupport','sourceInconsistency']){
  assert.ok(r.sourceRejectionCounts[key]>0,key);
 }
 const c=r.sourceRejectionCounts;
 assert.equal(c.unsafeMaterial,3254);
 assert.equal(c.edited,778);
 assert.equal(c.protected,807);
 assert.equal(c.authoredAirSupport,247);
});
test('full-cell option remains opt-in and cannot run outside diagnostics',()=>{
 assert.throws(()=>auditSourceProtectedMainGalleries(seed,rx,rz,{
  source:stone,countEverySourceVeto:true
 }),/Invalid source-protected gallery survey/);
 const fast=auditSourceProtectedMainGalleries(seed,rx,rz,{source:ore});
 assert.equal(fast.ok,false);
 assert.equal(fast.sourceChecks,1);
 assert.equal(fast.galleriesInspected,1);
});
test('a truncated source census is incomplete and never promotes safe partials',()=>{
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{
  ...options,maxTotalSourceChecks:1700
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'SOURCE_GALLERY_TOTAL_BUDGET');
 assert.ok(r.rows.length>0&&r.rows.length<16);
 assert.equal(r.diagnosticAll16GalleriesAttempted,false);
 assert.ok(r.sourceChecks<=1701);
 assert.equal(r.worldChanged,false);
});
