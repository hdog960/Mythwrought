import test from 'node:test';
import assert from 'node:assert/strict';
import {searchSourceProtectedCityDetours}
 from '../src/living-underworld/source-protected-city-detours.mjs';
import {selectCityCompatibleDeepLinks}
 from '../src/living-underworld/source-aware-city-deep-selection.mjs';
import {auditSourceProtectedCityTerraceAccess}
 from '../src/living-underworld/source-protected-city-terrace-access.mjs';

const source=()=>({
 naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false
});

test('detour 100-cell original-source budget halts without entire extra 20k stair scan',()=>{
 let naturalReads=0,editedReads=0;
 const r=searchSourceProtectedCityDetours(179,2,0,{
  source:{...source(),naturalAt:()=>{naturalReads++;return 1;},
   editedAt:()=>{editedReads++;return false;}},
  requireTerraceJoin:true,maxSourceChecks:100
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'DETOUR_SOURCE_QUERY_BUDGET');
 assert.equal(r.refusals.budget,1);
 assert.equal(r.tested,1);
 assert.equal(r.sourceChecks,101); // extra guard voxel is NOT a terrain read
 assert.equal(naturalReads,100);
 assert.equal(editedReads,100);
 assert.equal(r.worldChanged,false);
});

test('detour 1000-cell cap never silently promotes partial terrace proof',()=>{
 let naturalReads=0;
 const r=searchSourceProtectedCityDetours(179,2,0,{
  source:{...source(),naturalAt:()=>{naturalReads++;return 1;}},
  requireTerraceJoin:true,maxSourceChecks:1000
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'DETOUR_SOURCE_QUERY_BUDGET');
 assert.ok(r.sourceChecks<=1001);
 assert.ok(naturalReads<=1000);
 assert.equal(r.refusals.budget>=1,true);
});

test('legitimate original detached city detour remains source-safe under full cap',()=>{
 const r=searchSourceProtectedCityDetours(179,2,0,{
  source:source(),requireTerraceJoin:true,maxSourceChecks:30000
 });
 assert.equal(r.ok,true);
 assert.equal(r.sourceChecks,3423);
 assert.equal(r.tested,1);
 assert.equal(r.terraceProof.ok,true);
 assert.equal(r.stepsActuallyPlaced,false);
 assert.equal(r.worldChanged,false);
});

test('combined city source selector remains bounded at 1000 source visits',()=>{
 const r=selectCityCompatibleDeepLinks(179,2,0,{
  source:source(),maxTotalSourceChecks:1000,maxCombinations:16
 });
 assert.equal(r.ok,false);
 assert.equal(r.reason,'CITY_SOURCE_QUERY_BUDGET');
 assert.equal(r.sourceBudgetHit,true);
 assert.ok(r.sourceChecks<=1001);
 assert.equal(r.worldChanged,false);
});

test('joined 4-hub source verification bounds remaining budget on chosen deep stairs',()=>{
 const full=selectCityCompatibleDeepLinks(179,2,0,{
  source:source(),maxTotalSourceChecks:60000
 });
 assert.equal(full.ok,true);
 assert.equal(full.deepProposals.length,3);
 let reads=0;
 const r=auditSourceProtectedCityTerraceAccess(179,2,0,{
  source:{...source(),naturalAt:()=>{reads++;return 1;}},
  additionalStairProposals:full.deepProposals,
  requireCompleteDeepLinks:true,useSourceAwareDetour:true,
  maxTotalSourceChecks:5000
 });
 assert.equal(r.ok,false);
 assert.ok(r.sourceChecks<=5001);
 assert.ok(reads<=5000);
 assert.equal(r.worldChanged,false);
});

test('joined 4-hub source verification retains original valid 60k outcome',()=>{
 const full=selectCityCompatibleDeepLinks(179,2,0,{
  source:source(),maxTotalSourceChecks:60000
 });
 assert.equal(full.ok,true);
 assert.equal(full.sourceChecks,8815);
 assert.equal(full.joined.completeFourHubCandidateTopologyVerified,true);
 assert.equal(full.joined.completeDeepLinkSourceOwnershipVerified,true);
 assert.equal(full.joined.actualVoxelEditsOrTerracePlacement,false);
});
