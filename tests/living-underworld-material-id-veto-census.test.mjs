import test from 'node:test';
import assert from 'node:assert/strict';
import {auditProtectedSubsurfaceStairs}
 from '../src/living-underworld/protected-subsurface-stairs.mjs';
import {auditSourceProtectedMainGalleries}
 from '../src/living-underworld/main-gallery-source-survey.mjs';

const seed=179,rx=2,rz=0;
const fake={naturalAt:()=>6,authoredAt:()=>undefined,
 editedAt:()=>false,protectedAt:()=>false};
const proposal={ok:true,segments:[{
 a:{x:2,y:-30,z:2},b:{x:6,y:-30,z:2}
}]};
test('individual original stair reports specifically vetoed ore ID 6',()=>{
 const r=auditProtectedSubsurfaceStairs(proposal,{
  ...fake,stopOnFirstUnsafe:false
 });
 assert.equal(r.ok,false);
 assert.equal(r.counts.unsafeMaterial,r.sourceChecks);
 assert.equal(r.unsafeMaterialByBlockId['6'],r.sourceChecks);
 assert.equal(r.otherUnsafeMaterialCells,0);
 assert.equal(r.allUnsafeMaterialIdsEnumerated,true);
});
test('full 16-gallery census preserves the ID 6 ore histogram',()=>{
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{
  source:fake,diagnoseAllGalleries:true,countEverySourceVeto:true,
  maxTotalSourceChecks:120000,maxFailureExamples:16
 });
 assert.equal(r.ok,false);
 assert.equal(r.completeSourceVetoCensus,true);
 assert.equal(r.unsafeMaterialByBlockId['6'],24768);
 assert.equal(r.sourceRejectionCounts.unsafeMaterial,24768);
 assert.equal(r.otherUnsafeMaterialCells,0);
 assert.equal(r.completeUnsafeMaterialIdCoverage,true);
 assert.equal(r.rows.length,16);
});
test('separate unsafe original voxel IDs never merge into a generic ore category',()=>{
 const source={...fake,naturalAt:(x)=>x%2===0?6:7};
 const r=auditSourceProtectedMainGalleries(seed,rx,rz,{
  source,diagnoseAllGalleries:true,countEverySourceVeto:true,
  maxTotalSourceChecks:120000
 });
 const ids=r.unsafeMaterialByBlockId;
 assert.ok(ids['6']>0);
 assert.ok(ids['7']>0);
 assert.equal(ids['6']+ids['7'],24768);
 assert.equal(r.completeUnsafeMaterialIdCoverage,true);
});
test('adversarial unique material IDs preserve overflow without growing indefinitely',()=>{
 const source={...fake,naturalAt:(x,y,z)=>800+
  ((x*13+y*47+z*71)%101+101)%101};
 const r=auditProtectedSubsurfaceStairs(proposal,{
  ...source,stopOnFirstUnsafe:false
 });
 assert.equal(r.ok,false);
 assert.ok(Object.keys(r.unsafeMaterialByBlockId).length<=32);
 const classified=Object.values(r.unsafeMaterialByBlockId)
  .reduce((sum,count)=>sum+count,0);
 assert.equal(classified+r.otherUnsafeMaterialCells,r.counts.unsafeMaterial);
 if(r.otherUnsafeMaterialCells>0)
  assert.equal(r.allUnsafeMaterialIdsEnumerated,false);
});
test('invalid original source material IDs cause a visible native contract refusal',()=>{
 for(const id of [null,-1,1.3,Infinity,NaN,'6']){
  assert.throws(()=>auditProtectedSubsurfaceStairs(proposal,{
   ...fake,naturalAt:()=>id
  }),/Invalid original M7 stair material source/);
 }
});
