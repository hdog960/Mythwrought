import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {plannedSlots} from '../../../src/building-pool/roadmap-2a/catalog.mjs';
import {validateBlueprint} from '../../../src/building-pool/roadmap-2a/schema.mjs';
import {buildRoadmapA303ProvisionalSettlementManifest}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-a5-303-provisional.mjs';
import {buildRoadmapA315ProvisionalSettlementManifest}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-a5-315-provisional.mjs';
import {ROADMAP_A_WAVE16_SHOPS}
 from '../../../src/building-pool/roadmap-2a/roadmap-a-wave16.mjs';
const sha=v=>createHash('sha256').update(v).digest('hex');
function sourceVoxelGeometryFingerprint(b){
 const points=b.voxels.map(v=>[v.x,v.y,v.z,v.kind,v.material,v.physicalVariant??null])
  .sort((a,b)=>a[1]-b[1]||a[2]-b[2]||a[0]-b[0]||String(a[3]).localeCompare(String(b[3])));
 return sha(JSON.stringify(points));
}
test('A5 315 provisional retains all 303 prior source records unchanged and reserves precisely 12 valid new canonical slots',{timeout:240000},()=>{
 const old=buildRoadmapA303ProvisionalSettlementManifest(),
  current=buildRoadmapA315ProvisionalSettlementManifest();
 assert.equal(old.blueprints.length,303);
 assert.equal(old.remainingCanonicalIDs.length,117);
 assert.equal(current.blueprints.length,315);
 assert.equal(current.sourceCandidates,315);
 assert.equal(current.remainingCanonicalIDs.length,105);
 assert.equal(current.target,420);
 assert.deepEqual(current.remainingCanonicalIDs.filter(id=>id.startsWith('r2:bank:')),[]);
 assert.equal(current.protected128,128);
 assert.equal(current.blueprints.filter(b=>b.category==='bank').length,45);
 assert.equal(current.blueprints.filter(b=>b.sourceProvenance.cohort==='wave16'&&b.category==='bank').length,0);
 for(const [key,count] of Object.entries({wave01:10,wave02:9,wave03:12,wave04:12,wave05:12,wave06:12,wave07:12,wave08:12,wave09:12,wave10:12,wave11:12,wave12:12,wave13:12,wave14:12,wave15:12,wave16:12}))
  assert.equal(current[key],count,key);
 assert.equal(current.retainedPriorA5Schema,old.schema);
 assert.equal(current.schema,'mythwrought.roadmap-a.a5-settlement-handoff-provisional-expanded.v12');
 const original=new Map(old.blueprints.map(x=>[x.id,x]));
 for(const [id,record] of original)
  assert.deepEqual(current.blueprints.find(x=>x.id===id),record,
   'Protected original prior 303 metadata changed: '+id);
 assert.equal(new Set(current.blueprints.map(x=>x.id)).size,315);
 const canonical=plannedSlots().map(x=>x.id);
 assert.equal(canonical.length,420);
 assert.deepEqual(current.remainingCanonicalIDs,canonical.filter(id=>!current.blueprints.some(b=>b.id===id)));
 assert.equal(current.noExistingRecordAltered,true);
 assert.equal(current.producerPhysicalMeshAcceptance,false);
 assert.equal(current.screenshotEvidenceAcceptanceForNew187,false);
 assert.equal(current.productionGameRegistration,false);
 assert.equal(current.schema1SaveMutation,false);
 assert.equal(current.villageTownCityGenerationImplemented,false);
 assert.equal(current.requiresCreatorArtAndIPhoneReview,true);
});
test('A5 Wave16 each of 12 source provenance records reflects genuinely authored geometry, source file SHA and true openings, never final physical acceptance',{timeout:240000},()=>{
 const previous=buildRoadmapA303ProvisionalSettlementManifest(),
 current=buildRoadmapA315ProvisionalSettlementManifest(),
 oldIds=new Set(previous.blueprints.map(b=>b.id));
 const sourcePath=new URL('../../../src/building-pool/roadmap-2a/roadmap-a-wave16.mjs',import.meta.url),
  sourceHash=sha(readFileSync(sourcePath));
 const added=current.blueprints.filter(r=>r.sourceProvenance.cohort==='wave16');
 assert.equal(added.length,12);
 assert.ok(added.every(r=>r.sourceProvenance.cohort==='wave16'));
 assert.equal(new Set(added.map(r=>r.id)).size,12);
 for(const bp of ROADMAP_A_WAVE16_SHOPS){
  assert.equal(validateBlueprint(bp).valid,true,bp.id);
  assert.ok(!oldIds.has(bp.id),bp.id+' source-owned 303 historical collision');
  const r=added.find(x=>x.id===bp.id);assert.ok(r,'Missing source record '+bp.id);
  assert.equal(r.sourceProvenance.file,'src/building-pool/roadmap-2a/roadmap-a-wave16.mjs',bp.id);
  assert.equal(r.sourceProvenance.fileSHA256,sourceHash,bp.id);
  assert.equal(r.sourceProvenance.geometrySHA256,sourceVoxelGeometryFingerprint(bp),bp.id);
  assert.equal(r.sourceProvenance.independentCurrentHeadAcceptancePending,true,bp.id);
  assert.equal(r.occupiedGeometry.voxelCount,bp.voxels.length,bp.id);
  assert.equal(r.occupiedGeometry.kindCounts.roof,bp.voxels.filter(v=>v.kind==='roof').length,bp.id);
  assert.equal(r.roof.sourceRoofCells,r.occupiedGeometry.kindCounts.roof,bp.id);
  assert.deepEqual(r.plot.reservedEnvelopeCells,{width:bp.extents.x,depth:bp.extents.z,height:bp.extents.y},bp.id);
  assert.equal(r.interiorRooms.length,4,bp.id);
  assert.equal(r.publicEntrances.length,2,bp.id);
  assert.ok(r.windows.length>=6,bp.id);
  assert.equal(r.occupiedGeometry.geometryIsSourceCellsNotInstalledPackMeshes,true,bp.id);
  assert.ok(r.physicalDependencies.length>=3,bp.id);
  assert.equal(r.performanceBudgetEstimate.actualRuntimeGpuCostMeasured,false,bp.id);
  assert.equal(r.performanceBudgetEstimate.actualCollisionBudgetMeasured,false,bp.id);
  assert.equal(r.roof.installedBearingLoadAndClimateUnverified,true,bp.id);
  assert.equal(r.screenshotEvidence.actualSourceSpecificScreenshotAccepted,false,bp.id);
  assert.equal(r.screenshotEvidence.finalInstalledPackMeshScreenshotsAccepted,false,bp.id);
  assert.equal(r.acceptance.sourceCandidateOnly,true,bp.id);
  assert.equal(r.acceptance.physicalIPhoneAccepted,false,bp.id);
  assert.equal(r.acceptance.creatorVisualAccepted,false,bp.id);
  assert.equal(r.acceptance.productionRegistered,false,bp.id);
  assert.equal(r.acceptance.saveSchema1Changed,false,bp.id);
  assert.equal(r.acceptance.liveWorldPlaced,false,bp.id);
 }
});
test('A5 315 writes only detached source-provenance JSON artifact, NO real world or production file',{timeout:240000},()=>{
 const current=buildRoadmapA315ProvisionalSettlementManifest();
 const folder=join(process.cwd(),'artifacts','roadmap-a-a5');
 mkdirSync(folder,{recursive:true});
 const file=join(folder,'A5_SETTLEMENT_HANDOFF_315_PROVISIONAL.json');
 const data=JSON.stringify(current,null,2)+'\n';
 writeFileSync(file,data);
 console.log('ROADMAP_A5_315_EXACT_SOURCE_PROVENANCE '+JSON.stringify({
  sourceOnly:true,provisional:315,retainedPreviousWithoutChange:303,
  wave16New:12,remaining:105,physicalManualPackAccepted:false,
  creatorArtApproved:false,sourceSpecificBrowserGalleryValidated:false,
  realIphoneOrPwaTested:false,productionGameRegistered:false,
  schema1UserSavesTouched:false,sha256:sha(data),
  sourceWave16FileSHA256:sha(readFileSync(new URL('../../../src/building-pool/roadmap-2a/roadmap-a-wave16.mjs',import.meta.url)))
 }));
});
