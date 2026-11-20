import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {ROADMAP_A_VISUAL19_LEAN_BASES,ROADMAP_A_VISUAL19_HEAVY_ALTERNATIVES,ROADMAP_A_VISUAL19_LEAN_ALTERNATIVES} from '../../../src/building-pool/roadmap-2a/roadmap-a-silhouette-lean.mjs';
function sha(bp){
 const ordered=bp.voxels.map(v=>[v.x,v.y,v.z,v.kind,v.material])
  .sort((a,b)=>a[1]-b[1]||a[2]-b[2]||a[0]-b[0]);
 return createHash('sha256').update(JSON.stringify(ordered)).digest('hex');
}
test('Visual19 LEAN real native source-geometry budget, all 19 SHA proven, artifact and no GPU claims',{timeout:240000},()=>{
 const records=[],styles=new Set();
 for(let i=0;i<19;i++){
  const b=ROADMAP_A_VISUAL19_LEAN_BASES[i];
  const h=ROADMAP_A_VISUAL19_HEAVY_ALTERNATIVES[i];
  const l=ROADMAP_A_VISUAL19_LEAN_ALTERNATIVES[i];
  assert.equal(b.id,h.id);assert.equal(b.id,l.id);
  const heavyAdded=h.voxels.length-b.voxels.length;
  const leanAdded=l.voxels.length-b.voxels.length;
  const savings=heavyAdded-leanAdded;
  assert.equal(heavyAdded,h.sourceVisualRevision.additiveRoofCells);
  assert.equal(leanAdded,l.sourceVisualRevision.additiveRoofCells);
  assert.ok(leanAdded>0&&savings>0,b.id);
  assert.ok(savings/heavyAdded>=0.28,b.id);
  assert.ok(l.extents.y>=h.extents.y,b.id);
  assert.equal(l.sourceVisualRevision.actualGPUCostAccepted,false,b.id);
  styles.add(l.sourceVisualRevision.roofStyle);
  records.push({
   id:b.id,roofStyle:l.sourceVisualRevision.roofStyle,
   originalSourceVoxels:b.voxels.length,
   oldVisualStudyAddedRoofVoxels:heavyAdded,
   leanVisualStudyAddedRoofVoxels:leanAdded,
   eliminatedRoofSourceVoxels:savings,
   roofSourceReductionPct:+(100*savings/heavyAdded).toFixed(4),
   originalGeometrySHA256:sha(b),leanGeometrySHA256:sha(l),
   originalPeakExtent:b.extents.y,
   originalHeavyPeakExtent:h.extents.y,
   leanPeakExtent:l.extents.y,
   actualRootedRoofColumns:l.sourceVisualRevision.genuineRoofColumns,
   sourceCellsOnly:true,actualGPUUploadTimingMeasured:false,
   actualPackPhysicalSupportMeasured:false,creatorApproved:false
  });
 }
 assert.equal(styles.size,6);
 const oldTotal=records.reduce((n,r)=>n+r.oldVisualStudyAddedRoofVoxels,0);
 const newTotal=records.reduce((n,r)=>n+r.leanVisualStudyAddedRoofVoxels,0);
 assert.ok(oldTotal>=24000);
 assert.ok(newTotal<=11500);
 assert.ok(newTotal<=oldTotal*.5);
 const report={
  schema:'mythwrought.roadmap-a.visual19-lean-source-budget.v1',
  testCheckoutCommit:process.env.GITHUB_SHA??null,
  realCurrentHeadBrowserAndGPUAcceptancePending:true,
  records:records.sort((a,b)=>a.id.localeCompare(b.id)),
  originalAlternativeAddedRoofSourceCells:oldTotal,
  leanAlternativeAddedRoofSourceCells:newTotal,
  eliminatedRoofSourceCells:oldTotal-newTotal,
  sourceVoxelReductionPct:+(100*(oldTotal-newTotal)/oldTotal).toFixed(4),
  originalWave01And02SourceChanged:false,creatorApproved:false,
  actualRuntimeGPUUploadImprovementProven:false,
  realManualPackGeometryAndBearingCertified:false,
  mainWorldPlaced:false,pwaSchema1Changed:false
 };
 const dir=join(process.cwd(),'artifacts','roadmap-a-visual19-lean');
 mkdirSync(dir,{recursive:true});
 writeFileSync(join(dir,'VISUAL19_LEAN_19_SOURCE_BUDGET.json'),JSON.stringify(report,null,2)+'\n');
 console.log('ROADMAP_A_VISUAL19_LEAN_PROVENANCE '+JSON.stringify({records:19,old:oldTotal,lean:newTotal,saved:oldTotal-newTotal,sourcePct:report.sourceVoxelReductionPct,actualGPUConfirmed:false}));
});
