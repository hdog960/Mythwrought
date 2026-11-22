import test from 'node:test';
import assert from 'node:assert/strict';
import {selectCityCompatibleDeepLinks}
 from '../src/living-underworld/source-aware-city-deep-selection.mjs';

const stone={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
const ore={...stone,naturalAt:()=>999};

test('one genuine detached city candidate still passes full selected geometry',()=>{
 const r=selectCityCompatibleDeepLinks(179,2,0,{source:stone});
 assert.equal(r.ok,true);
 assert.equal(r.terraceRadius,8);
 assert.equal(r.inspectedCombinations,1);
 assert.equal(r.sourceChecks,8815);
 assert.equal(r.worldChanged,false);
 assert.equal(r.playerWalkingUnverified,true);
});
test('one allowed failed combination cannot masquerade as exhausted geography',()=>{
 const r=selectCityCompatibleDeepLinks(179,2,0,{
  source:ore,maxCombinations:1
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_COMBINATION_SEARCH_BUDGET');
 assert.equal(r.inspectedCombinations,1);
 assert.equal(r.combinationBudgetHit,true);
 assert.equal(r.sourceBudgetHit,false);
 assert.equal(r.searchFullyExhausted,false);
 assert.equal(r.worldChanged,false);
});
test('three permitted combinations stop exactly at search limit',()=>{
 const r=selectCityCompatibleDeepLinks(179,2,0,{
  source:ore,maxCombinations:3
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_COMBINATION_SEARCH_BUDGET');
 assert.equal(r.inspectedCombinations,3);
 assert.equal(r.searchFullyExhausted,false);
});
test('real strict source budget remains distinct from combination cap',()=>{
 const r=selectCityCompatibleDeepLinks(179,2,0,{
  source:stone,maxCombinations:16,maxTotalSourceChecks:1000
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_SOURCE_QUERY_BUDGET');
 assert.equal(r.sourceBudgetHit,true);
 assert.equal(r.combinationBudgetHit,false);
 assert.equal(r.sourceChecks,1000);
 assert.equal(r.searchFullyExhausted,false);
 assert.equal(r.worldChanged,false);
});
test('a successful exact detached route remains allowed with a one-choice limit',()=>{
 const r=selectCityCompatibleDeepLinks(179,2,0,{
  source:stone,maxCombinations:1
 });
 assert.equal(r.ok,true);
 assert.equal(r.inspectedCombinations,1);
 assert.equal(r.joined.completeFourHubCandidateTopologyVerified,true);
 assert.equal(r.joined.completeDeepLinkSourceOwnershipVerified,true);
});
