import test from 'node:test';
import assert from 'node:assert/strict';
import {searchSourceProtectedCityDetours}
 from '../src/living-underworld/source-protected-city-detours.mjs';
import {auditSourceProtectedCityTerraceAccess}
 from '../src/living-underworld/source-protected-city-terrace-access.mjs';

const stone={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
test('source-real detached city approach joins terrace without old gallery conflict',()=>{
 for(const [rx,rz,radius,checks] of [[2,0,8,3423],[2,1,12,7083]]){
  let naturalReads=0;
  const source={...stone,naturalAt:()=>{naturalReads++;return 1;}};
  const old=auditSourceProtectedCityTerraceAccess(179,rx,rz,{source});
  assert.equal(old.ok,false);
  assert.equal(old.reason,'CITY_LINK_OR_SELECTED_STAIRS_BLOCK_GALLERY');
  const safe=auditSourceProtectedCityTerraceAccess(179,rx,rz,{
   source,useSourceAwareDetour:true
  });
  assert.equal(safe.ok,true,JSON.stringify(safe));
  assert.equal(safe.terraceRadius,radius);
  assert.equal(safe.sourceChecks,checks);
  assert.equal(naturalReads,checks);
  assert.equal(safe.detourDepartureBlocks,4);
  assert.equal(safe.sourceAuditedDetourAlreadyCountedOnce,true);
  assert.equal(safe.sourceAuditedTerraceAlreadyCountedOnce,true);
  assert.equal(safe.completeFourHubCandidateTopologyVerified,false);
  assert.equal(safe.playerWalkabilityAndMovementUnverified,true);
  assert.equal(safe.worldChanged,false);
 }
});
test('the detour has three physically graded steps and a flat terrace entry',()=>{
 const r=searchSourceProtectedCityDetours(179,2,0,{
  source:stone,requireTerraceJoin:true
 });
 assert.equal(r.ok,true);
 assert.equal(r.proposal.segments.length,3);
 const parts=r.proposal.segments;
 assert.equal(parts[0].a.y,parts[0].b.y);
 assert.equal(parts[2].a.y,parts[2].b.y);
 assert.equal(parts.at(-1).b.y,r.landingApproach.y);
 assert.equal(r.sourceSafeTerraceJoined,true);
 assert.equal(r.terraceProof.radius,8);
 assert.equal(r.all16GalleryMutualClearanceVerified,true);
});
test('ore and original cave AIR never pass the new joined access gate',()=>{
 for(const source of [
  {...stone,naturalAt:()=>999},
  {...stone,naturalAt:()=>0},
  {...stone,naturalAt:()=>0,authoredAt:()=>0}
 ]){
  const r=auditSourceProtectedCityTerraceAccess(179,2,0,{
   source,useSourceAwareDetour:true
  });
  assert.equal(r.ok,false);
  assert.equal(r.reason,'CITY_SOURCE_PROTECTED_DETOUR_UNSAFE');
  assert.equal(r.worldChanged,false);
 }
});
test('a selected full-network claim without three links is rejected first',()=>{
 let reads=0;
 const r=auditSourceProtectedCityTerraceAccess(179,2,0,{
  source:{...stone,naturalAt:()=>{reads++;return 1;}},
  useSourceAwareDetour:true,requireCompleteDeepLinks:true
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'DEEP_INTERLEVEL_TOPOLOGY_UNSAFE');
 assert.equal(r.topologyRefusal,'THREE_DEEP_LINKS_REQUIRED');
 assert.equal(reads,0);
});
test('budget exhaustions and partial cohorts are explicit refusals',()=>{
 const r=searchSourceProtectedCityDetours(179,2,0,{
  source:stone,requireTerraceJoin:true,maxSourceChecks:100,maxCandidates:2
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'DETOUR_SOURCE_QUERY_BUDGET');
 assert.equal(r.worldChanged,false);
 assert.throws(()=>searchSourceProtectedCityDetours(179,2,0,{
  source:stone,requireTerraceJoin:'yes'
 }));
});
test('regions without a genuine detached city do not invent one',()=>{
 const r=searchSourceProtectedCityDetours(179,0,0,{
  source:stone,requireTerraceJoin:true
 });
 assert.equal(r.sitePresent,false);
 assert.equal(r.sourceChecks,0);
});
