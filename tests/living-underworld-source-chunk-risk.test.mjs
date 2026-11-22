import test from 'node:test';
import assert from 'node:assert/strict';
import {auditSourceProtectedChunkRisk}
 from '../src/living-underworld/source-protected-chunk-risk.mjs';
const origin={x:0,y:-48,z:0};
const source={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
const point=(x,y,z)=>x===6&&y===-42&&z===6;
test('source-owned original cave cut has bounded face growth and no writes',()=>{
 const r=auditSourceProtectedChunkRisk({origin,source,candidateAirAt:point});
 assert.equal(r.ok,true);assert.equal(r.approvedCarves,1);
 assert.equal(r.unsafeCarves,0);assert.equal(r.sourceHaloCells,5832);
 assert.equal(r.approvedOnlyFaceGrowth,6);
 assert.equal(r.originalWorldUntouched,true);
});
test('unowned ore cannot be projected as safely carved AIR',()=>{
 const r=auditSourceProtectedChunkRisk({origin,
  source:{...source,naturalAt:()=>999},candidateAirAt:point});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'ORIGINAL_M7_CARVE_SOURCE_UNSAFE');
 assert.equal(r.approvedCarves,0);assert.equal(r.unsafeCarves,1);
 assert.equal(r.approvedOnlyFaceGrowth,0);assert.equal(r.counts.oreOrUnsafe,1);
});
test('original edits and landmarks refuse source carve',()=>{
 for(const [role,reason] of [['editedAt','originalEdit'],
  ['protectedAt','landmark']]){
  const r=auditSourceProtectedChunkRisk({origin,
   source:{...source,[role]:()=>true},candidateAirAt:point});
  assert.equal(r.ok,false);assert.equal(r.counts[reason],1);
 }
});
test('original authored cave solid and authored AIR contradiction refuse',()=>{
 for(const [owner,reason] of [[2,'authoredSolid'],[0,'authoredAirMismatch']]){
  const r=auditSourceProtectedChunkRisk({origin,
   source:{...source,authoredAt:()=>owner},candidateAirAt:point});
  assert.equal(r.ok,false);assert.equal(r.counts[reason],1);
 }
});
test('empty carve candidate is a safe read-only baseline',()=>{
 const r=auditSourceProtectedChunkRisk({origin,source,candidateAirAt:()=>false});
 assert.equal(r.ok,true);assert.equal(r.plannedCarves,0);
 assert.equal(r.approvedOnlyFaceGrowth,0);
});
test('face budget fails even when original material is cuttable',()=>{
 const r=auditSourceProtectedChunkRisk({origin,source,
  candidateAirAt:point,maxFaceGrowth:0});
 assert.equal(r.ok,false);assert.equal(r.reason,'FACE_GROWTH_BUDGET');
});
