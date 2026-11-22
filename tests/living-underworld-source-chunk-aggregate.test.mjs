import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeSourceProtectedChunkRisk}
 from '../src/living-underworld/source-protected-chunk-aggregate.mjs';
const r=(i,extras={})=>({ok:true,reason:null,side:16,
 origin:{x:i*16,y:-48,z:0},sourceHaloCells:5832,
 plannedCarves:1,approvedCarves:1,unsafeCarves:0,
 approvedOnlyFaceGrowth:6,...extras});
test('five already measured chunks approved within aggregate limits with zero new reads',()=>{
 const rows=Array.from({length:5},(_,i)=>r(i));
 const a=summarizeSourceProtectedChunkRisk(rows);
 assert.equal(a.ok,true);assert.equal(a.sourceQueries,29160);
 assert.equal(a.faceGrowth,30);
 assert.equal(a.queriesReusedFromExistingResults,true);
 assert.equal(a.noM7WorldRequery,true);
});
test('partial site coverage is never presented as five-biome approval',()=>{
 assert.equal(summarizeSourceProtectedChunkRisk([r(0)]).reason,
  'INCOMPLETE_CHUNK_COHORT');
});
test('duplicate chunk origins refuse before falsely counting independent samples',()=>{
 const out=summarizeSourceProtectedChunkRisk([r(0),r(0)]);
 assert.equal(out.ok,false);assert.equal(out.reason,'DUPLICATE_CHUNK_ORIGIN');
});
test('original source rejection anywhere in cohort refuses whole candidate',()=>{
 const rows=Array.from({length:5},(_,i)=>r(i));
 rows[2]=r(2,{ok:false,reason:'ORIGINAL_M7_CARVE_SOURCE_UNSAFE',unsafeCarves:1,
  approvedCarves:0});
 const result=summarizeSourceProtectedChunkRisk(rows);
 assert.equal(result.ok,false);assert.equal(result.reason,'CHUNK_REFUSAL_IN_COHORT');
 assert.equal(result.unsafeCarves,1);
});
test('five individually bounded chunks can still exceed total face budget',()=>{
 const rows=Array.from({length:5},(_,i)=>r(i));
 const result=summarizeSourceProtectedChunkRisk(rows,{maxTotalFaceGrowth:25});
 assert.equal(result.ok,false);
 assert.equal(result.reason,'AGGREGATE_EXPOSED_FACE_BUDGET');
});
test('source query budget is enforced across the whole five biome cohort',()=>{
 const rows=Array.from({length:5},(_,i)=>r(i));
 const result=summarizeSourceProtectedChunkRisk(rows,{
  maxTotalSourceQueries:28000});
 assert.equal(result.ok,false);
 assert.equal(result.reason,'AGGREGATE_SOURCE_QUERY_BUDGET');
});
test('missing original M7 halo is never accepted as genuine complete source census',()=>{
 const rows=Array.from({length:5},(_,i)=>r(i));
 rows[4]=r(4,{sourceHaloCells:10});
 assert.equal(summarizeSourceProtectedChunkRisk(rows).reason,
  'INCOMPLETE_CHUNK_SOURCE_HALO');
});
test('unbounded or malformed evidence refuses without accepting an allocation',()=>{
 assert.throws(()=>summarizeSourceProtectedChunkRisk([]));
 assert.equal(summarizeSourceProtectedChunkRisk([r(0,{approvedCarves:-1})]).reason,
  'INVALID_CHUNK_RISK_EVIDENCE');
});
