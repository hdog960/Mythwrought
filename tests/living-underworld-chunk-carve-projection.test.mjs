import test from 'node:test';
import assert from 'node:assert/strict';
import {auditProposedChunkCarveDelta,auditDetachedRampChunkProjection}
 from '../src/living-underworld/chunk-carve-projection.mjs';
const origin={x:0,y:-80,z:0};
test('one cavity in solid rock creates exactly six faces without mutating original cells',()=>{
 const params={origin,side:8,isSolidAt:()=>true,
  candidateAirAt:(x,y,z)=>x===3&&y===-77&&z===3};
 const q=auditProposedChunkCarveDelta({...params,maxFaceGrowth:6});
 assert.equal(q.ok,true);
 assert.equal(q.newlyCarvedSolidCells,1);
 assert.equal(q.baselineFaces,0);
 assert.equal(q.projectedFaces,6);
 assert.equal(q.illustrativeBytesDelta,840);
 assert.equal(q.originalSourceQueries,1000);
 assert.equal(q.originalWorldUntouched,true);
 const denied=auditProposedChunkCarveDelta({...params,maxFaceGrowth:5});
 assert.equal(denied.ok,false);
 assert.equal(denied.reason,'FACE_GROWTH_BUDGET');
});
test('old cavity AIR cannot be counted as newly carved solid',()=>{
 const p={origin,side:8,
  isSolidAt:(x,y,z)=>!(x===3&&y===-77&&z===3),
  candidateAirAt:(x,y,z)=>x===3&&y===-77&&z===3};
 const r=auditProposedChunkCarveDelta(p);
 assert.equal(r.newlyCarvedSolidCells,0);
 assert.equal(r.exposedFaceDelta,0);
});
test('all-air source and candidate never fabricate faces',()=>{
 const r=auditProposedChunkCarveDelta({origin,side:8,
  isSolidAt:()=>false,candidateAirAt:()=>true});
 assert.equal(r.projectedFaces,0);
 assert.equal(r.baselineFaces,0);
 assert.equal(r.candidateSolidQueries,0);
});
test('detached-world wrapper is deterministic but not a GPU benchmark',()=>{
 const p={x:112,y:-80,z:112};
 const cfg={side:8,futureRampAirAt:(x,y,z)=>x===112&&z===112&&y===-80};
 const a=auditDetachedRampChunkProjection(179,p,cfg);
 const b=auditDetachedRampChunkProjection(179,p,cfg);
 assert.deepEqual(a,b);
 assert.equal(a.realGPUBufferBytesUnverified,true);
});
test('nonboolean source and candidate readers, bad seed and halo budget all refuse',()=>{
 assert.throws(()=>auditProposedChunkCarveDelta({origin,side:8,
  isSolidAt:()=>3,candidateAirAt:()=>false}),/Nonboolean/);
 assert.throws(()=>auditProposedChunkCarveDelta({origin,side:8,
  isSolidAt:()=>true,candidateAirAt:()=>1}),/Nonboolean/);
 assert.throws(()=>auditDetachedRampChunkProjection(2147483648,origin,
  {futureRampAirAt:()=>false}),/Invalid/);
 assert.equal(auditProposedChunkCarveDelta({origin,side:16,
  isSolidAt:()=>true,candidateAirAt:()=>false,maxCells:500}).reason,
  'HALO_BUDGET_EXCEEDED');
});
