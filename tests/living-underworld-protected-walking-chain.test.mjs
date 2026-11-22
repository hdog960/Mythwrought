import test from 'node:test';
import assert from 'node:assert/strict';
import {searchWideProtectedEntrances}
 from '../src/living-underworld/entrance-candidate-search.mjs';
import {auditProtectedUnderworldWalkingChain}
 from '../src/living-underworld/protected-walking-chain.mjs';
const src={naturalAt:()=>3,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
const entrance=()=>searchWideProtectedEntrances(179,0,0,{
 surfaceHeightAt:()=>8,biomeAt:()=> 'plains',requiredBiome:'plains',
 naturalAt:src.naturalAt,authoredAt:src.authoredAt,
 editedAt:src.editedAt,existingLandmarkAt:src.protectedAt});
test('fully connected source-safe proposed route joins exact upper and three deep hubs',()=>{
 const e=entrance();assert.equal(e.ok,true);
 const q=auditProtectedUnderworldWalkingChain(179,0,0,{entrance:e,source:src});
 assert.equal(q.ok,true,JSON.stringify(q));
 assert.equal(q.routeCount,4);
 assert.equal(q.sourceProtectedRoutes,4);
 assert.ok(q.originalM7SourceChecks>1000);
 assert.equal(q.stairsActuallyPlaced,false);
 assert.equal(q.realPlayerWalkingVerified,false);
});
test('every deep link must remain independently source-safe; one protected ore band rejects the whole chain',()=>{
 const e=entrance();
 const r=auditProtectedUnderworldWalkingChain(179,0,0,{
  entrance:e,source:{...src,naturalAt:(x,y,z)=>y<-110?6:3}
 });
 assert.equal(r.ok,false);
 assert.ok(r.connectors.some(c=>c.rejectsOreOrUnsafe>0));
 assert.equal(r.noOriginalWorldEdits,true);
});
test('foreign, forged, incomplete, or unrelated exact-region entrance never enters provenance audit',()=>{
 const e=entrance();
 for(const fake of [null,{}, {...e,ok:false},
  {...e,accepted:{...e.accepted,proposal:{...e.accepted.proposal,seed:2026}}},
  {...e,accepted:{...e.accepted,envelope:{ok:false}}},
  {...e,accepted:{...e.accepted,stairs:{ok:false}}}]){
  const r=auditProtectedUnderworldWalkingChain(179,0,0,{entrance:fake,source:src});
  assert.equal(r.ok,false);
  assert.equal(r.routeCount,0);
 }
 assert.throws(()=>auditProtectedUnderworldWalkingChain(179,0,0,{
  entrance:e,source:{naturalAt:()=>3}}),/Invalid/);
});

test('extra caller materialAllowed cannot authorize ore in the protected deep chain',()=>{
 const e=entrance();
 const q=auditProtectedUnderworldWalkingChain(179,0,0,{
  entrance:e,source:{...src,naturalAt:()=>6,materialAllowed:()=>true}
 });
 assert.equal(q.ok,false);
 assert.ok(q.connectors.some(c=>c.rejectsOreOrUnsafe>0));
 assert.equal(q.worldChanged,false);
});
