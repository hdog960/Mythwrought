// Read-only dense mobile GPU plan for REAL source-pinned building roadmaps.
// This is not an active renderer, a measured iPhone benchmark or a world edit.
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
import * as pack4 from '../../../../src/block-packs/pack-4/builder-handoff.mjs';
import {planPack4StagingBudget,PACK4_STAGING_LIMITS}
 from '../../../../src/block-packs/pack-4/gpu-residency-budget.mjs';
const source=(id,rotation)=>{
 const row=pack4.PACK4_BUILDER_CATALOG.find(x=>x.id===id);
 if(!row)throw Error('Unknown source Pack4 physical candidate');
 return pack4.pack4BuilderAsset(row.ref,{candidateId:id,rotation});
};
const names=['r1','r2','r3','r4'],reports=[],combined=[];
let all=0,totalPlan=0,globalIndex=0;
for(let n=1;n<=4;n++){
 const path=resolve(process.cwd(),'../consumers/r'+n+
  '/src/building-pool/roadmap-'+n+'/m1-pack4-physical.mjs');
 const mod=await import(pathToFileURL(path).href);
 const designs=mod.getM1Pack4Construction(pack4);
 const stats={roadmap:n,designCount:designs.length,physicalCells:0,
  maxResidentBytes:0,maxSelected:0,totalExcluded:0};
 for(const design of designs){
  const rows=design.physicalPlan.placements.map(p=>({
   at:[...p.at],candidateId:p.candidateId,rotation:p.rotation
  }));
  const untouched=JSON.stringify(rows);
  const staged=planPack4StagingBudget(rows,source,{
   viewerCell:rows[0]?.at??[0,0,0]
  });
  assert.equal(staged.candidateCount,rows.length);
  assert.equal(staged.selectedCount+staged.excludedCount,rows.length);
  assert.equal(JSON.stringify(rows),untouched);
  assert.equal(staged.memoryBudgetIsActualIphoneMeasurement,false);
  assert.ok(staged.residentBytes<=PACK4_STAGING_LIMITS.maxResidentBytes);
  assert.ok(staged.pages.length<=PACK4_STAGING_LIMITS.maxPages);
  assert.ok(staged.pages.every(p=>p.bytes<=PACK4_STAGING_LIMITS.maxPageBytes));
  stats.physicalCells+=rows.length;
  stats.totalExcluded+=staged.excludedCount;
  stats.maxResidentBytes=Math.max(stats.maxResidentBytes,staged.residentBytes);
  stats.maxSelected=Math.max(stats.maxSelected,staged.selectedCount);
  for(const p of rows){
   // Each blueprint occupies a disjoint authored review region, only in
   // the planner input. No building-blueprint or game data is changed.
   combined.push({at:[p.at[0]+globalIndex*2048,p.at[1],p.at[2]+globalIndex*2048],
    candidateId:p.candidateId,rotation:p.rotation});
  }
  globalIndex++;
  all+=rows.length;totalPlan++;
 }
 reports.push(stats);
}
assert.equal(totalPlan,135,'pinned M1 building sample count has changed');
assert.equal(all,1249,'pinned source-authored Pack4 placements changed');
assert.ok(combined.length>=256);
const large=combined.slice(0,256);
const original=JSON.stringify(large);
const dense=planPack4StagingBudget(large,source,{viewerCell:large[0].at});
const reversed=planPack4StagingBudget([...large].reverse(),source,{
 viewerCell:large[0].at
});
assert.deepEqual(dense,reversed,'read-only page allocation must be deterministic');
assert.equal(dense.candidateCount,256);
assert.equal(dense.selectedCount+dense.excludedCount,256);
assert.equal(JSON.stringify(large),original);
assert.ok(dense.residentBytes<=PACK4_STAGING_LIMITS.maxResidentBytes);
const report={status:'PASS',mode:'SOURCE_LEVEL_ONLY_NOT_ACTUAL_IPHONE',
 originalPhysicalPlacements:all,realBuilderPlans:totalPlan,reports,
 crossBlueprintDenseCells:large.length,
 denseResidentBytes:dense.residentBytes,denseSelected:dense.selectedCount,
 denseExcluded:dense.excludedCount,densePageCount:dense.pages.length,
 budgets:PACK4_STAGING_LIMITS,
 originalBuilderSourcesUnmodified:true,liveRegistered:false,
 measuredIphoneFps:false};
await mkdir('artifacts/pack-4',{recursive:true});
await writeFile('artifacts/pack-4/dense-real-builders-audit.json',
 JSON.stringify(report,null,2)+'\n');
console.log('PACK4_DENSE_REAL_BUILDERS '+JSON.stringify(report));
