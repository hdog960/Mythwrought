import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {buildRoadmapAExpandedProvisionalSettlementManifest} from '../../../src/building-pool/roadmap-2a/roadmap-a-a5-expanded-handoff.mjs';
import {buildRoadmapA207ProvisionalSettlementManifest} from '../../../src/building-pool/roadmap-2a/roadmap-a-a5-207-provisional.mjs';
import {ROADMAP_A_WAVE05_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave05.mjs';
import {ROADMAP_A_WAVE06_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave06.mjs';
import {ROADMAP_A_WAVE07_SHOPS} from '../../../src/building-pool/roadmap-2a/roadmap-a-wave07.mjs';
const hash=data=>createHash('sha256').update(data).digest('hex');
const waves=[['wave05','roadmap-a-wave05.mjs',ROADMAP_A_WAVE05_SHOPS],['wave06','roadmap-a-wave06.mjs',ROADMAP_A_WAVE06_SHOPS],['wave07','roadmap-a-wave07.mjs',ROADMAP_A_WAVE07_SHOPS]];
function sourceGeometryHash(b){
 const cells=b.voxels.map(v=>[v.x,v.y,v.z,v.kind,v.material,v.physicalVariant??null])
  .sort((a,c)=>a[1]-c[1]||a[2]-c[2]||a[0]-c[0]||String(a[3]).localeCompare(String(c[3])));
 return hash(JSON.stringify(cells));
}
test('A5 207: all 171 prior source metadata records strictly unchanged, only 36 added provisional',{timeout:240000},()=>{
 const prior=buildRoadmapAExpandedProvisionalSettlementManifest();
 const all=buildRoadmapA207ProvisionalSettlementManifest();
 assert.equal(prior.blueprints.length,171);
 assert.equal(all.blueprints.length,207);
 assert.equal(all.sourceCandidates,207);
 assert.equal(all.remainingCanonicalIDs.length,213);
 assert.equal(all.target,420);
 assert.equal(all.protected128,128);
 for(const [key,n] of Object.entries({wave01:10,wave02:9,wave03:12,wave04:12,wave05:12,wave06:12,wave07:12}))
  assert.equal(all[key],n,key);
 const priorById=new Map(prior.blueprints.map(b=>[b.id,b]));
 for(const [id,record] of priorById)assert.deepEqual(all.blueprints.find(b=>b.id===id),record,'Protected A5 171 metadata drift '+id);
 assert.equal(new Set(all.blueprints.map(b=>b.id)).size,207);
 const canonical=plannedSlots().map(s=>s.id);
 assert.equal(new Set(canonical).size,420);
 assert.equal(new Set(canonical.filter(id=>!all.blueprints.some(b=>b.id===id))).size,213);
 assert.deepEqual(all.remainingCanonicalIDs,canonical.filter(id=>!all.blueprints.some(b=>b.id===id)));
 assert.equal(all.noExistingRecordAltered,true);
 assert.equal(all.producerPhysicalMeshAcceptance,false);
 assert.equal(all.screenshotEvidenceAcceptanceForNew79,false);
 assert.equal(all.productionGameRegistration,false);
 assert.equal(all.schema1SaveMutation,false);
 assert.equal(all.villageTownCityGenerationImplemented,false);
 assert.equal(all.requiresCreatorArtAndIPhoneReview,true);
});
test('A5 207: Wave05–07 metadata is exact real 36 source models with SHA256, floor, room, entrance, roof and no fake Pack/iPhone claim',{timeout:240000},()=>{
 const all=buildRoadmapA207ProvisionalSettlementManifest();
 const added=all.blueprints.filter(b=>['wave05','wave06','wave07'].includes(b.sourceProvenance.cohort));
 assert.equal(added.length,36);
 const ids=new Set();
 for(const [cohort,file,items] of waves){
  assert.equal(items.length,12);
  const sourceFile=new URL('../../../src/building-pool/roadmap-2a/'+file,import.meta.url);
  const sourceHash=hash(readFileSync(sourceFile));
  const entries=added.filter(x=>x.sourceProvenance.cohort===cohort);
  assert.equal(entries.length,12);
  for(const b of items){
   const r=entries.find(x=>x.id===b.id);assert.ok(r,'Missing exact source '+b.id);
   ids.add(b.id);
   assert.equal(r.sourceProvenance.file,'src/building-pool/roadmap-2a/'+file,b.id);
   assert.equal(r.sourceProvenance.fileSHA256,sourceHash,b.id);
   assert.equal(r.sourceProvenance.geometrySHA256,sourceGeometryHash(b),b.id);
   assert.equal(r.sourceProvenance.independentCurrentHeadAcceptancePending,true,b.id);
   assert.equal(r.occupiedGeometry.voxelCount,b.voxels.length,b.id);
   assert.equal(r.occupiedGeometry.kindCounts.roof,b.voxels.filter(v=>v.kind==='roof').length,b.id);
   assert.equal(r.roof.sourceRoofCells,r.occupiedGeometry.kindCounts.roof,b.id);
   assert.deepEqual(r.plot.reservedEnvelopeCells,{width:b.extents.x,depth:b.extents.z,height:b.extents.y},b.id);
   assert.equal(r.interiorRooms.length,4,b.id);
   assert.equal(r.publicEntrances.length,2,b.id);
   assert.ok(r.windows.length>=6,b.id);
   assert.ok(r.physicalDependencies.length>=3,b.id);
   assert.equal(r.occupiedGeometry.geometryIsSourceCellsNotInstalledPackMeshes,true,b.id);
   assert.equal(r.performanceBudgetEstimate.actualRuntimeGpuCostMeasured,false,b.id);
   assert.equal(r.performanceBudgetEstimate.actualCollisionBudgetMeasured,false,b.id);
   assert.equal(r.roof.installedBearingLoadAndClimateUnverified,true,b.id);
   assert.equal(r.acceptance.sourceCandidateOnly,true,b.id);
   assert.equal(r.acceptance.creatorVisualAccepted,false,b.id);
   assert.equal(r.acceptance.physicalIPhoneAccepted,false,b.id);
   assert.equal(r.acceptance.productionRegistered,false,b.id);
   assert.equal(r.acceptance.saveSchema1Changed,false,b.id);
   assert.equal(r.acceptance.liveWorldPlaced,false,b.id);
   assert.equal(r.screenshotEvidence.finalInstalledPackMeshScreenshotsAccepted,false,b.id);
  }
 }
 assert.equal(ids.size,36);
});
test('A5 207: export source-only geometry metadata, never affect world or registry',{timeout:240000},()=>{
 const current=buildRoadmapA207ProvisionalSettlementManifest();
 const root=join(process.cwd(),'artifacts','roadmap-a-a5');
 mkdirSync(root,{recursive:true});
 const path=join(root,'A5_SETTLEMENT_HANDOFF_207_PROVISIONAL.json');
 const data=JSON.stringify(current,null,2)+'\n';
 writeFileSync(path,data);
 console.log('ROADMAP_A5_207_SOURCE_PROVENANCE '+JSON.stringify({records:207,oldRecordsPreserved:171,wave05:12,wave06:12,wave07:12,remaining:213,sha256:hash(data),physicalPackAccepted:false,creatorArtAccepted:false,gameRegistered:false}));
});
