import test from 'node:test';
import assert from 'node:assert/strict';
import {auditSourceProtectedMainGalleries}
 from '../src/living-underworld/main-gallery-source-survey.mjs';

const seed=179,rx=2,rz=0;
const stone={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
const opts={source:stone,diagnoseAllGalleries:true,
 countEverySourceVeto:true,maxTotalSourceChecks:120000};

test('full 16 galleries independently count inspected voxels and actual reader methods',()=>{
 const calls={naturalAt:0,authoredAt:0,editedAt:0,protectedAt:0};
 const source=Object.fromEntries(Object.keys(calls).map(role=>
  [role,(...args)=>{
   calls[role]++;
   return stone[role](...args);
  }]));
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{...opts,source});
 assert.equal(r.ok,true);
 assert.equal(r.sourceChecks,24768);
 assert.equal(r.totalSourceRoleCalls,99072);
 for(const role of Object.keys(calls)){
  assert.equal(r.sourceRoleCalls[role],24768);
  assert.equal(calls[role],24768);
  assert.equal(r.rows.reduce((n,row)=>
   n+row.originalSourceRoleCalls[role],0),24768);
 }
 assert.equal(r.completeSourceVetoCensus,true);
});
test('early original edits short-circuit costly landmark and geology calls',()=>{
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{
  ...opts,source:{...stone,editedAt:()=>true}
 });
 assert.equal(r.ok,false);
 assert.equal(r.sourceRejectedGalleries,16);
 assert.equal(r.sourceRoleCalls.editedAt,24768);
 assert.equal(r.sourceRoleCalls.authoredAt,0);
 assert.equal(r.sourceRoleCalls.protectedAt,0);
 assert.equal(r.sourceRoleCalls.naturalAt,0);
 assert.equal(r.totalSourceRoleCalls,24768);
});
test('hard unique-voxel budget retains exact actual source-call costs',()=>{
 let callbacks=0;
 const reader={...stone,naturalAt:()=>{callbacks++;return 1;}};
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{
  ...opts,source:reader,maxTotalSourceChecks:100
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'SOURCE_GALLERY_TOTAL_BUDGET');
 assert.equal(r.sourceChecks,101);
 assert.equal(r.totalSourceRoleCalls,400);
 assert.equal(callbacks,100);
 assert.equal(r.diagnosticAll16GalleriesAttempted,false);
});
test('first-refusal mode remains short-circuit while source reader cost is reported',()=>{
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{
  source:{...stone,naturalAt:()=>6}
 });
 assert.equal(r.ok,false);
 assert.equal(r.galleriesInspected,1);
 assert.equal(r.sourceChecks,1);
 assert.equal(r.totalSourceRoleCalls,4);
 assert.equal(r.rows.length,1);
 assert.equal(r.worldChanged,false);
});
