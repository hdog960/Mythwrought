import test from 'node:test';
import assert from 'node:assert/strict';
import {auditSourceProtectedCityTerraceAccess}
 from '../src/living-underworld/source-protected-city-terrace-access.mjs';
import {planUnderworldRegion}
 from '../src/living-underworld/worldwide-network.mjs';
const stone={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
test('no rare cavern must not fabricate a joined terrace or read old M7 cells',()=>{
 let reads=0;assert.equal(planUnderworldRegion(179,0,0).cityCandidate,null);
 const r=auditSourceProtectedCityTerraceAccess(179,0,0,{source:{
  ...stone,naturalAt:()=>{reads++;return 1;}
 }});
 assert.equal(r.sitePresent,false);assert.equal(r.worldChanged,false);
 assert.equal(reads,0);
});
test('invalid original source roles, seeds, and route counts are rejected',()=>{
 assert.throws(()=>auditSourceProtectedCityTerraceAccess(2**40,2,0,{source:stone}));
 assert.throws(()=>auditSourceProtectedCityTerraceAccess(179,2,0,{
  source:{naturalAt:()=>1}}));
 assert.throws(()=>auditSourceProtectedCityTerraceAccess(179,2,0,{
  source:stone,additionalStairProposals:Array(8).fill(null)}));
 assert.throws(()=>auditSourceProtectedCityTerraceAccess(179,2,0,{
  source:stone,maxTotalSourceChecks:999}));
});
test('no original-world path may be approved when all geology is ore',()=>{
 const r=auditSourceProtectedCityTerraceAccess(179,2,0,{
  source:{...stone,naturalAt:()=>999}});
 assert.equal(r.ok,false);assert.equal(r.worldChanged,false);
 assert.ok(r.reason);
});
test('authored and natural cave AIR cannot be replaced by floor supports',()=>{
 for(const source of [
  {...stone,naturalAt:()=>0},
  {...stone,naturalAt:()=>0,authoredAt:()=>0}
 ]){
  const r=auditSourceProtectedCityTerraceAccess(179,2,0,{source});
  assert.equal(r.ok,false);assert.equal(r.worldChanged,false);
 }
});
test('no synthetic source success may claim actual original player walking',()=>{
 const r=auditSourceProtectedCityTerraceAccess(179,2,0,{source:stone});
 assert.equal(r.worldChanged,false);
 if(r.ok){
  assert.equal(r.actualVoxelEditsOrTerracePlacement,false);
  assert.equal(r.originalM7ReaderIdentityVerifiedByCallerOnly,true);
  assert.equal(r.playerWalkabilityAndMovementUnverified,true);
  assert.equal(r.allWorldRegionsConnected,false);
  assert.equal(r.combinedStairAndTerraceMutualClearanceChecked,true);
 }
});
