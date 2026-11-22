import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeSourceProtectedChunkRisk}
 from '../src/living-underworld/source-protected-chunk-aggregate.mjs';

const sample=(origin,side=16)=>({
 ok:true,reason:null,side,origin,sourceHaloCells:(side+2)**3,
 plannedCarves:1,unsafeCarves:0,approvedCarves:1,
 interiorRequestedCarves:1,interiorApprovedCarves:1,
 interiorRejectedCarves:0,haloRequestedCarves:0,
 haloApprovedCarves:0,haloRejectedCarves:0,
 interiorCutCountMatchesOriginalProjection:true,
 approvedOnlyFaceGrowth:6
});
const at=(x,y=-48,z=0)=>({x,y,z});
const cohort=(...chunks)=>summarizeSourceProtectedChunkRisk(chunks,{
 expectedChunks:chunks.length,requireInteriorEvidence:true
});

test('two distinct origins with eight-block intersecting x interiors fail closed',()=>{
 const r=cohort(sample(at(0)),sample(at(8)));
 assert.equal(r.ok,false);
 assert.equal(r.reason,'OVERLAPPING_CHUNK_INTERIORS');
 assert.equal(r.atIndex,1);
 assert.equal(r.overlapsIndex,0);
 assert.equal(r.worldChanged,false);
});
test('overlapping y and z interiors are refused independently',()=>{
 for(const shift of [at(0,-40,0),at(0,-48,8)]){
  const r=cohort(sample(at(0)),sample(shift));
  assert.equal(r.reason,'OVERLAPPING_CHUNK_INTERIORS');
 }
});
test('the same origin retains the historic specific duplicate refusal',()=>{
 const r=cohort(sample(at(0)),sample(at(0)));
 assert.equal(r.reason,'DUPLICATE_CHUNK_ORIGIN');
});
test('face-adjacent interiors with overlapping halos remain valid',()=>{
 const r=cohort(sample(at(0)),sample(at(16)));
 assert.equal(r.ok,true);
 assert.equal(r.approvedCarves,2);
 assert.equal(r.sourceQueries,11664);
 assert.equal(r.ownedChunkInteriorsDisjoint,true);
 assert.equal(r.haloOverlapPermittedAndNotCountedAsCore,true);
});
test('separated mixed-size 3D interiors cannot double-count ownership',()=>{
 const r=cohort(sample(at(0),8),sample(at(8),16));
 assert.equal(r.ok,true);
 assert.equal(r.ownedChunkInteriorsDisjoint,true);
});
test('unsafe near-integer-boundary coordinates fail before floating rounding',()=>{
 const near=Number.MAX_SAFE_INTEGER-7;
 const r=cohort(sample(at(near)));
 assert.equal(r.ok,false);
 assert.equal(r.reason,'INVALID_CHUNK_INTERIOR_BOUNDS');
});
test('five independent original 16 cubed chunks still preserve exact budget counts',()=>{
 const r=cohort(...[0,16,32,48,64].map(x=>sample(at(x))));
 assert.equal(r.ok,true);
 assert.equal(r.checkedChunks,5);
 assert.equal(r.approvedCarves,5);
 assert.equal(r.faceGrowth,30);
 assert.equal(r.sourceQueries,29160);
 assert.equal(r.ownedChunkInteriorsDisjoint,true);
});
