import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {auditRoadmapARepresentativePackCompatibility} from '../../../src/building-pool/roadmap-2a/roadmap-a-three-case-physical-producer-crosswalk.mjs';
import {buildRoadmapA207ProvisionalSettlementManifest} from '../../../src/building-pool/roadmap-2a/roadmap-a-a5-207-provisional.mjs';
test('three exact high/medium/low-risk Roadmap A source buildings have true unchanged source/A5 identity and independently verified risk counts',{timeout:240000},()=>{
 const x=auditRoadmapARepresentativePackCompatibility();
 const sources=buildRoadmapA207ProvisionalSettlementManifest();
 assert.equal(x.schema,'mythwrought.roadmap-a.2a-three-case-physical-producer-source-crosswalk.v1');
 assert.equal(sources.blueprints.length,207);
 assert.equal(sources.remainingCanonicalIDs.length,213);
 assert.equal(x.threeRepresentativeDesigns,3);
 assert.equal(x.buildings.length,3);
 const expected=[
 ['r2:general-store:desert:large:05','wave07',23221,4838,11736,3313,19888,3313,2908],
 ['r2:bakery:enchanted-forest:large:05','wave05',14707,3465,0,0,3466,2229,1912],
 ['r2:bank:snow:medium:03','wave07',23009,0,0,0,0,2822,2447]
 ];
 for(let i=0;i<expected.length;i++){
  const [id,wave,voxels,plaster,brick,ceramic,variantMissing,roofBases,notUnderWall]=expected[i];
  const b=x.buildings[i],a5=sources.blueprints.find(x=>x.id===id);
  assert.equal(b.id,id);assert.equal(b.wave,wave);assert.equal(b.sourceVoxelCount,voxels);
  assert.equal(b.sourceWallMountedPlasterCells,plaster);assert.equal(b.sourceMasonryLabeledRoofCells,brick);
  assert.equal(b.sourceThinCeramicLabeledFloorCells,ceramic);
  assert.equal(b.sourcePack5CellsWithNoAuthoredVariant,variantMissing);
  assert.equal(b.sourceRoofBaseCount,roofBases);
  assert.equal(b.sourceRoofBasesWithNoImmediateWall,notUnderWall);
  assert.ok(a5,'A5 still contains original source '+id);
  assert.equal(b.exactGeometrySHA256,a5.sourceProvenance.geometrySHA256);
  assert.equal(b.sourceFileSHA256,a5.sourceProvenance.fileSHA256);
  assert.deepEqual(b.sourceMaterialCounts,
   Object.fromEntries(Object.entries(b.sourceMaterialCounts).sort((a,b)=>a[0].localeCompare(b[0]))));
  assert.equal(Object.values(b.sourceMaterialCounts).reduce((s,n)=>s+n,0),voxels);
  assert.equal(b.sourceNonEmptyCellCountExceedsDefault4096Instances,true);
  assert.equal(b.originalA5RecordPreserved,true);
  assert.equal(b.physicalOrientationSelected,false);
  assert.equal(b.pack5PhysicalVariantsChosen,false);
  assert.equal(b.physicalWallSupportCertified,false);
  assert.equal(b.roofBearingCertified,false);
  assert.equal(b.realInstalledManualPackGeometryBuilt,false);
  assert.equal(b.gameWorldRegistered,false);
  assert.equal(b.realIphoneAndGpuMeasured,false);
  assert.equal(b.creatorArtApproved,false);
  assert.ok(b.sourceSymbolicDoorReferences.length>=2,'No pretend physically placed door');
  for(const door of b.sourceSymbolicDoorReferences){
   assert.match(door.ref,/^pack[1-5]:\d{3}$/);
   assert.equal(door.actualDoorInstancePlaced,false);
  }
 }
 assert.equal(x.gameRegistered,false);
 assert.equal(x.saveSchema1Changed,false);
 assert.equal(x.pwaChanged,false);
 assert.equal(x.sourceBuildingsChanged,false);
 assert.equal(x.sourceA5207RecordsChanged,false);
 assert.equal(x.original128CommerceChanged,false);
 assert.equal(x.otherBuildersChanged,false);
 assert.equal(x.automationsChanged,false);
 assert.equal(x.allCategoryMaterialOrStructuralGatesAccepted,false);
 assert.equal(x.roofLoadBearingProven,false);
 assert.equal(x.actualIphonePerformanceProven,false);
 assert.equal(x.creatorArtApproved,false);
});
test('real Pack5 plaster producer wall-backing is tested across ALL four rotations without selecting a source variant; roof and floor material requirements remain unresolved',{timeout:240000},()=>{
 const x=auditRoadmapARepresentativePackCompatibility();
 for(const [symbol,count,policy] of [['pack5:079',2,'wall'],['pack5:080',2,'none'],['pack5:081',2,'floor']]){
  const variants=x.materialProducerOptions[symbol];
  assert.equal(variants.length,count);
  for(const v of variants){
   assert.equal(v.supportPolicy,policy);
   assert.equal(v.sourceSelectedThisVariant,false);
   assert.equal(v.intendedForOneAssetDemonstrationOnly,true);
   assert.ok(v.visibleBoxCount>0&&v.colliderBoxCount>0);
   assert.ok(v.colorKeys.length>0);
  }
 }
 for(const b of x.buildings){
  assert.equal(b.plasterProducerBackingsForEachPossibleYaw.length,4);
  const seen=new Set();
  for(const yaw of b.plasterProducerBackingsForEachPossibleYaw){
   assert.ok([0,1,2,3].includes(yaw.yaw));
   seen.add(yaw.yaw);
   assert.equal(yaw.variantSelected,false);
   assert.equal(yaw.potentialPhysicalSupportCertified,false);
   assert.equal(yaw.actualProducerSupportOffset.length,3);
   assert.ok(yaw.actualProducerSupportOffset.every(Number.isInteger));
   assert.equal(Object.values(yaw.possibleSourceBackingsByType).reduce((s,n)=>s+n,0),b.sourceWallMountedPlasterCells,
    'Every source plaster cell must get precisely one backing classification per rotation');
   for(const key of Object.keys(yaw.possibleSourceBackingsByType))
    assert.ok(['no-source-voxel','plaster-wall-not-certified-structural','other-wall-not-certified-structural','nonwall-voxel-not-certified-structural'].includes(key));
  }
  assert.equal(seen.size,4);
  assert.equal(Object.values(b.sourceRoofBaseUnderlyingKindCounts).reduce((s,n)=>s+n,0),b.sourceRoofBaseCount);
  assert.equal(Object.values(b.sourceCeramicTilesUnderlyingSourceCells).reduce((s,n)=>s+n,0),b.sourceThinCeramicLabeledFloorCells);
 }
 assert.equal(x.exampleProducerVariantsAreNeverAssignedToBlueprint,true);
 assert.equal(x.fullThreeBuildingPhysicalGeometryInstantiated,false);
});
test('source-only three-building real producer risk handoff artifact; no world edit, placement or engineered claim',{timeout:240000},()=>{
 const x=auditRoadmapARepresentativePackCompatibility();
 const dir=join(process.cwd(),'artifacts','roadmap-a-physical-pilot');
 mkdirSync(dir,{recursive:true});
 const raw=JSON.stringify(x,null,2)+'\n',out=join(dir,'ROADMAP_A_THREE_REAL_PACK_PRODUCER_SOURCE_COMPATIBILITY.json');
 writeFileSync(out,raw);
 console.log('ROADMAP_A_THREE_BUILDING_PHYSICAL_COMPATIBILITY '+JSON.stringify({
  selectedIds:x.buildings.map(b=>b.id),
  affectedPlasterCells:x.buildings.reduce((s,b)=>s+b.sourceWallMountedPlasterCells,0),
  affectedBrickRoofCells:x.buildings.reduce((s,b)=>s+b.sourceMasonryLabeledRoofCells,0),
  affectedThinFloorCells:x.buildings.reduce((s,b)=>s+b.sourceThinCeramicLabeledFloorCells,0),
  sourceVariantsUnspecified:x.buildings.reduce((s,b)=>s+b.sourcePack5CellsWithNoAuthoredVariant,0),
  SHA256:createHash('sha256').update(raw).digest('hex'),
  actualFullBuildingPackPlacement:false,realIPhone:false,creatorAccepted:false
 }));
});
