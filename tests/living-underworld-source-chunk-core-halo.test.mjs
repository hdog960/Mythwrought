import test from 'node:test';
import assert from 'node:assert/strict';
import {auditSourceProtectedChunkRisk}
 from '../src/living-underworld/source-protected-chunk-risk.mjs';
import {summarizeSourceProtectedChunkRisk}
 from '../src/living-underworld/source-protected-chunk-aggregate.mjs';

const origin={x:0,y:-48,z:0};
const source={naturalAt:()=>1,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
const core=(x,y,z)=>x===6&&y===-42&&z===6;
const halo=(x,y,z)=>x===-1&&y===-42&&z===6;
const combined=(x,y,z)=>core(x,y,z)||halo(x,y,z);

test('one original chunk interior request is exactly one actual new carved voxel',()=>{
 const r=auditSourceProtectedChunkRisk({origin,source,candidateAirAt:core});
 assert.equal(r.ok,true);
 assert.equal(r.interiorRequestedCarves,1);
 assert.equal(r.interiorApprovedCarves,1);
 assert.equal(r.interiorRejectedCarves,0);
 assert.equal(r.haloRequestedCarves,0);
 assert.equal(r.interiorCutCountMatchesOriginalProjection,true);
 assert.equal(r.sourceHaloCells,5832);
});
test('one neighboring halo cut is never charged as this chunk actual excavation',()=>{
 const r=auditSourceProtectedChunkRisk({origin,source,candidateAirAt:halo});
 assert.equal(r.ok,true);
 assert.equal(r.plannedCarves,1); // legacy conservative halo-inclusive
 assert.equal(r.approvedCarves,1);
 assert.equal(r.interiorRequestedCarves,0);
 assert.equal(r.interiorApprovedCarves,0);
 assert.equal(r.haloRequestedCarves,1);
 assert.equal(r.haloApprovedCarves,1);
 assert.equal(r.interiorCutCountMatchesOriginalProjection,true);
 assert.equal(r.originalWorldUntouched,true);
});
test('adjacent inside-and-halo proposal conserves total without double-counting core',()=>{
 const r=auditSourceProtectedChunkRisk({origin,source,candidateAirAt:combined});
 assert.equal(r.ok,true);
 assert.equal(r.plannedCarves,2);
 assert.equal(r.approvedCarves,2);
 assert.equal(r.interiorRequestedCarves,1);
 assert.equal(r.interiorApprovedCarves,1);
 assert.equal(r.haloRequestedCarves,1);
 assert.equal(r.haloApprovedCarves,1);
 assert.equal(r.interiorCutCountMatchesOriginalProjection,true);
});
test('unsafe original ore in halo still refuses full source safety',()=>{
 const r=auditSourceProtectedChunkRisk({origin,
  source:{...source,naturalAt:()=>999},candidateAirAt:halo});
 assert.equal(r.ok,false);
 assert.equal(r.reason,'ORIGINAL_M7_CARVE_SOURCE_UNSAFE');
 assert.equal(r.interiorRejectedCarves,0);
 assert.equal(r.haloRejectedCarves,1);
 assert.equal(r.counts.oreOrUnsafe,1);
});
test('five real measured halo cohorts charge only core carving against cap',()=>{
 const rows=Array.from({length:5},(_,i)=>{
  const base=auditSourceProtectedChunkRisk({
   origin:{x:i*32,y:-48,z:0},
   source,candidateAirAt:(x,y,z)=>
    (x===i*32+6||x===i*32-1)&&y===-42&&z===6
  });
  assert.equal(base.ok,true);
  return base;
 });
 const r=summarizeSourceProtectedChunkRisk(rows,{
  requireInteriorEvidence:true,maxTotalApprovedCarves:5
 });
 assert.equal(r.ok,true);
 assert.equal(r.approvedCarves,5);
 assert.equal(r.approvedHaloProposals,5);
 assert.equal(r.completeCoreHaloEvidence,true);
 assert.equal(r.actualInteriorOnlyCarveBudget,true);
 assert.equal(r.sourceQueries,29160);
 const tooTight=summarizeSourceProtectedChunkRisk(rows,{
  requireInteriorEvidence:true,maxTotalApprovedCarves:4
 });
 assert.equal(tooTight.ok,false);
 assert.equal(tooTight.reason,'AGGREGATE_APPROVED_CARVE_BUDGET');
});
test('authentic M7 aggregation refuses missing or forged core/halo breakdowns',()=>{
 const old={ok:true,reason:null,side:16,origin,
  sourceHaloCells:5832,plannedCarves:2,approvedCarves:2,unsafeCarves:0,
  approvedOnlyFaceGrowth:6};
 const missing=summarizeSourceProtectedChunkRisk([old],{
  expectedChunks:1,requireInteriorEvidence:true
 });
 assert.equal(missing.ok,false);
 assert.equal(missing.reason,'MISSING_INTERIOR_CARVE_EVIDENCE');
 const valid=auditSourceProtectedChunkRisk({origin,source,candidateAirAt:combined});
 const forged=summarizeSourceProtectedChunkRisk([{
  ...valid,interiorApprovedCarves:2
 }],{expectedChunks:1,requireInteriorEvidence:true});
 assert.equal(forged.ok,false);
 assert.equal(forged.reason,'INVALID_CORE_HALO_EVIDENCE');
});
