import test from 'node:test';
import assert from 'node:assert/strict';
import {PACK4_BUILDER_CATALOG,pack4BuilderAsset}
 from '../../../../src/block-packs/pack-4/builder-handoff.mjs';
import {PACK4_STAGING_LIMITS,planPack4StagingBudget}
 from '../../../../src/block-packs/pack-4/gpu-residency-budget.mjs';

const realSource=(id,rotation)=>{
 const entry=PACK4_BUILDER_CATALOG.find(row=>row.id===id);
 if(!entry)throw new Error('Unknown original Pack4 candidate');
 return pack4BuilderAsset(entry.ref,{candidateId:id,rotation});
};

test('dense original Pack4 construction: deterministic bounded GPU candidate residency without lost world state',()=>{
 // 256 actual source-asset cells, alternating 23 unique IDs and rotations.
 // This deliberately exceeds single-screen candidate-detail budgets.
 const placements=Array.from({length:256},(_,i)=>({
  at:[i%32,2,Math.floor(i/32)],candidateId:159+(i%23),rotation:i%4
 }));
 const untouched=JSON.stringify(placements);
 const a=planPack4StagingBudget(placements,realSource,{viewerCell:[12,2,4]});
 const b=planPack4StagingBudget([...placements].reverse(),realSource,{viewerCell:[12,2,4]});
 assert.deepEqual(a,b,'source-order must not influence selected GPU pages');
 assert.equal(a.mode,'review-only-not-runtime');
 assert.equal(a.memoryBudgetIsActualIphoneMeasurement,false);
 assert.equal(a.allWorldItemsPreservedOutsideThisView,true);
 assert.equal(a.candidateCount,256);
 assert.equal(a.selectedCount+a.excludedCount,256);
 assert.equal(JSON.stringify(placements),untouched,'never edit original blueprints');
 assert.ok(a.selectedCount>0&&a.pages.length>0);
 assert.ok(a.residentBytes<=PACK4_STAGING_LIMITS.maxResidentBytes);
 assert.ok(a.pages.length<=PACK4_STAGING_LIMITS.maxPages);
 assert.equal(a.pages.reduce((sum,p)=>sum+p.bytes,0),a.residentBytes);
 for(const page of a.pages){
  assert.ok(page.bytes>0&&page.bytes<=PACK4_STAGING_LIMITS.maxPageBytes);
  assert.ok(page.items.every(item=>item.bytes>0&&item.bytes%40===0));
 }
 const selected=a.pages.flatMap(page=>page.items);
 assert.equal(new Set(selected.map(x=>x.at.join(','))).size,a.selectedCount);
 for(const item of selected){
  const model=realSource(item.candidateId,item.rotation);
  assert.equal(item.bytes,model.previewMesh.opaque.byteLength+
    model.previewMesh.translucent.byteLength);
  assert.ok(model.selection.length&&model.collision.length);
 }
});

test('dense GPU preview budget fails closed on malformed mounts, ID aliases and poisoned source streams',()=>{
 const entry={at:[3,1,2],candidateId:176,rotation:2};
 assert.throws(()=>planPack4StagingBudget([entry,entry],realSource),/Duplicate/);
 for(const bad of [{...entry,candidateId:158},{...entry,candidateId:255},
  {...entry,rotation:undefined},{...entry,rotation:4},
  {...entry,at:[3,1,2.5]}]){
  assert.throws(()=>planPack4StagingBudget([bad],realSource));
 }
 assert.throws(()=>planPack4StagingBudget([entry],()=>({
  id:176,rotation:2,previewMesh:{stride:10,opaque:[],translucent:[]}
 })),/original 10-float/);
 assert.throws(()=>planPack4StagingBudget([entry],()=>({
  ...realSource(176,2),id:160
 })),/mismatched physical ID/);
 assert.throws(()=>planPack4StagingBudget([entry],realSource,{
  limits:{maxResidentBytes:2*1024*1024+1}
 }));
 const cut=planPack4StagingBudget([entry],realSource,{
  limits:{maxPageBytes:1,maxResidentBytes:1}
 });
 assert.equal(cut.selectedCount,0);
 assert.equal(cut.excluded[0].reason,'oversize');
});