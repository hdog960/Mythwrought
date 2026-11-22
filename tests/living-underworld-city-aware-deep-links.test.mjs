import test from 'node:test';
import assert from 'node:assert/strict';
import {selectCityCompatibleDeepLinks}
 from '../src/living-underworld/source-aware-city-deep-selection.mjs';
import {auditSelectedInterlevelTopology}
 from '../src/living-underworld/source-network-topology.mjs';

const stone={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
test('seed179 rare-city two sites join all four hubs with terrace geometry',()=>{
 for(const [rx,rz,radius,checks] of [[2,0,8,8815],[2,1,12,12711]]){
  const r=selectCityCompatibleDeepLinks(179,rx,rz,{source:stone});
  assert.equal(r.ok,true,JSON.stringify(r));
  assert.equal(r.terraceRadius,radius);
  assert.equal(r.sourceChecks,checks);
  assert.equal(r.inspectedCombinations,1);
  assert.deepEqual(r.chosen.map(q=>q.index),[16,25,34]);
  const topo=auditSelectedInterlevelTopology(179,rx,rz,r.deepProposals);
  assert.equal(topo.ok,true);
  assert.equal(topo.completeFourHubTopology,true);
  assert.equal(r.joined.completeFourHubCandidateTopologyVerified,true);
  assert.equal(r.joined.completeDeepLinkSourceOwnershipVerified,true);
  assert.equal(r.joined.sourceAuditedTerraceAlreadyCountedOnce,true);
  assert.equal(r.worldChanged,false);
  assert.equal(r.playerWalkingUnverified,true);
 }
});
test('city-dependent index25 and index34 rotate to preserve rare-city floor',()=>{
 const r=selectCityCompatibleDeepLinks(179,2,0,{source:stone});
 assert.deepEqual(r.chosen.map(q=>[q.index,q.radius,q.cornerFlat,q.quarterTurns]),[
  [16,14,6,0],[25,14,4,1],[34,14,4,2]
 ]);
 assert.equal(r.joined.detourTestedCandidates,6);
});
test('uncuttable source ore never becomes accepted from a safe detached layout',()=>{
 const r=selectCityCompatibleDeepLinks(179,2,0,{
  source:{...stone,naturalAt:()=>999},maxCombinations:1
 });
 assert.equal(r.ok,false);
 assert.ok(r.reason);
 assert.equal(r.worldChanged,false);
 assert.equal(r.originalM7PlayerWalkingUnverified,true);
});
test('original source audit budget is honored before approving old geology',()=>{
 const r=selectCityCompatibleDeepLinks(179,2,0,{
  source:stone,maxTotalSourceChecks:1000,maxCombinations:1
 });
 assert.equal(r.ok,false);
 assert.equal(r.worldChanged,false);
});
test('no-city region never receives fabricated four-hub city approval',()=>{
 const r=selectCityCompatibleDeepLinks(179,0,0,{source:stone});
 assert.equal(r.sitePresent,false);
 assert.equal(r.worldChanged,false);
});
test('invalid prior source readers and impossible work bounds are rejected',()=>{
 assert.throws(()=>selectCityCompatibleDeepLinks(2**40,2,0,{source:stone}));
 assert.throws(()=>selectCityCompatibleDeepLinks(179,2,0,{
  source:{naturalAt:()=>1}}));
 assert.throws(()=>selectCityCompatibleDeepLinks(179,2,0,{
  source:stone,maxCandidatesPerLink:0}));
 assert.throws(()=>selectCityCompatibleDeepLinks(179,2,0,{
  source:stone,minTerraceRadius:30}));
});
test('original authored AIR, natural cave AIR, edits and landmarks all refuse city deep release',()=>{
 const variants=[
  {...stone,naturalAt:()=>0,authoredAt:()=>0},
  {...stone,naturalAt:()=>0},
  {...stone,editedAt:()=>true},
  {...stone,protectedAt:()=>true}
 ];
 for(const source of variants){
  const r=selectCityCompatibleDeepLinks(179,2,0,{
   source,maxCombinations:1
  });
  assert.equal(r.ok,false);
  assert.equal(r.worldChanged,false);
 }
});
test('combined original-source callbacks are not counted twice on successful join',()=>{
 let calls=0;
 const source={...stone,naturalAt:()=>{calls++;return 1;}};
 const r=selectCityCompatibleDeepLinks(179,2,0,{source});
 assert.equal(r.ok,true);
 assert.equal(r.sourceChecks,calls);
 assert.equal(r.joined.sourceAuditedTerraceAlreadyCountedOnce,true);
});
