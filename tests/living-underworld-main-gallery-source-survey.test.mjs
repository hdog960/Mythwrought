import {test} from 'node:test';
import assert from 'node:assert/strict';
import {auditSourceProtectedMainGalleries}
 from '../src/living-underworld/main-gallery-source-survey.mjs';
const stone={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
test('original 16-gallery source footprint passes on synthetic solid stone only',()=>{
 const r=auditSourceProtectedMainGalleries(179,0,0,{source:stone});
 assert.equal(r.ok,true);assert.equal(r.galleriesInspected,16);
 assert.equal(r.sourceChecks,24768);assert.equal(r.mutuallyCollisionFree,true);
 assert.equal(r.actualPlayerWalkingVerified,false);
});
test('fixed original geology refuses injected ore',()=>{
 const r=auditSourceProtectedMainGalleries(179,0,0,{
  source:{...stone,naturalAt:()=>999}
 });
 assert.equal(r.ok,false);assert.equal(r.galleriesInspected,1);
 assert.equal(r.failures[0].reason,'UNSAFE_MATERIAL');
});
test('original natural cave air cannot be covered by proposed floor support',()=>{
 const r=auditSourceProtectedMainGalleries(179,0,0,{
  source:{...stone,naturalAt:()=>0}
 });
 assert.equal(r.ok,false);
 assert.equal(r.failures[0].reason,'EXISTING_AIR_SUPPORT');
});
test('existing authored air cannot be overwritten by support',()=>{
 const r=auditSourceProtectedMainGalleries(179,0,0,{
  source:{...stone,naturalAt:()=>0,authoredAt:()=>0}
 });
 assert.equal(r.ok,false);
 assert.equal(r.failures[0].reason,'AUTHORED_AIR_SUPPORT');
});
test('existing player edit is never overwritten',()=>{
 const r=auditSourceProtectedMainGalleries(179,0,0,{
  source:{...stone,editedAt:()=>true}
 });
 assert.equal(r.ok,false);assert.equal(r.failures[0].reason,'PLAYER_EDIT');
});
test('existing landmark is never overwritten',()=>{
 const r=auditSourceProtectedMainGalleries(179,0,0,{
  source:{...stone,protectedAt:()=>true}
 });
 assert.equal(r.ok,false);
 assert.equal(r.failures[0].reason,'PROTECTED_LANDMARK');
});
test('total original source-cell budget fails closed',()=>{
 const r=auditSourceProtectedMainGalleries(179,0,0,{
  source:stone,maxTotalSourceChecks:2000
 });
 assert.equal(r.ok,false);assert.equal(r.reason,'SOURCE_GALLERY_TOTAL_BUDGET');
});
test('missing source role and invalid seeds do not count as provenance',()=>{
 assert.throws(()=>auditSourceProtectedMainGalleries(179,0,0,{
  source:{naturalAt:()=>1}
 }));
 assert.throws(()=>auditSourceProtectedMainGalleries(86753090000,0,0,{
  source:stone
 }));
});
