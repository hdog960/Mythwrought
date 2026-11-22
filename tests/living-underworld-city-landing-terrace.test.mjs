import test from 'node:test';
import assert from 'node:assert/strict';
import {proposeProtectedCityLandingTerrace}
 from '../src/living-underworld/city-landing-terrace-proposal.mjs';
const stone={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
test('seed179 first cavern chooses largest gallery-safe radius eight',()=>{
 const r=proposeProtectedCityLandingTerrace(179,2,0,{source:stone});
 assert.equal(r.ok,true);assert.equal(r.radius,8);
 assert.equal(r.columns,197);assert.equal(r.sourceChecks,2955);
 assert.equal(r.attempts[0].reason,'TERRACE_BLOCKS_HORIZONTAL_GALLERY');
 assert.equal(r.attempts[1].reason,'TERRACE_BLOCKS_HORIZONTAL_GALLERY');
 assert.equal(r.oldWholeCityPadNotApproved,true);
 assert.equal(r.entranceRampSourceNotYetApproved,true);
 assert.equal(r.worldChanged,false);
});
test('neighboring rare cavern can host radius twelve under synthetic stone',()=>{
 const r=proposeProtectedCityLandingTerrace(179,2,1,{source:stone});
 assert.equal(r.ok,true);assert.equal(r.radius,12);
 assert.equal(r.columns,441);assert.equal(r.sourceChecks,6615);
 assert.equal(r.corridorMutualClearanceWith16MainGalleries,true);
});
test('ordinary ore never passes the immutable geology allowlist',()=>{
 const r=proposeProtectedCityLandingTerrace(179,2,0,{
  source:{...stone,naturalAt:()=>999}});
 assert.equal(r.ok,false);assert.equal(r.reason,'UNSAFE_MATERIAL');
 assert.equal(r.sourceChecks,3);
});
test('original natural and authored cave AIR may not be filled',()=>{
 for(const source of [
  {...stone,naturalAt:()=>0},
  {...stone,naturalAt:()=>0,authoredAt:()=>0}
 ]){
  const r=proposeProtectedCityLandingTerrace(179,2,0,{source});
  assert.equal(r.ok,false);
  assert.match(r.reason,/AIR_SUPPORT/);
 }
});
test('original player edits and landmarks refuse before natural reads',()=>{
 for(const [role,expected] of [['editedAt','PLAYER_EDIT'],
  ['protectedAt','PROTECTED_LANDMARK']]){
  const r=proposeProtectedCityLandingTerrace(179,2,0,{
   source:{...stone,[role]:()=>true}});
  assert.equal(r.ok,false);assert.equal(r.reason,expected);
 }
});
test('tight source query budget refuses instead of accepting a sampled terrace',()=>{
 const r=proposeProtectedCityLandingTerrace(179,2,0,{
  source:stone,maxSourceChecks:100});
 assert.equal(r.ok,false);assert.equal(r.reason,'TERRACE_ORIGINAL_SOURCE_BUDGET');
 assert.equal(r.sourceChecks,100);
});
test('no-city candidate is never a pretend terrace',()=>{
 const r=proposeProtectedCityLandingTerrace(179,0,0,{source:stone});
 assert.equal(r.sitePresent,false);assert.equal(r.worldChanged,false);
});
