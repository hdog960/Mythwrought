import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {auditRoadmapAAll79PackBacking} from '../../../src/building-pool/roadmap-2a/roadmap-a-all79-original-pack5-backing-census.mjs';
import {buildRoadmapA207ProvisionalSettlementManifest} from '../../../src/building-pool/roadmap-2a/roadmap-a-a5-207-provisional.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
test('All 79 original Roadmap A source blueprints: exact A5 geometry/file hashes, prior producer material totals and no new game registration',{timeout:240000},()=>{
 const x=auditRoadmapAAll79PackBacking();
 const a5=buildRoadmapA207ProvisionalSettlementManifest();
 assert.equal(x.buildings.length,79);
 assert.equal(new Set(x.buildings.map(r=>r.id)).size,79);
 assert.equal(a5.blueprints.length,207);
 assert.equal(a5.remainingCanonicalIDs.length,213);
 assert.equal(x.expectedMissingCanonicalSlots,213);
 assert.equal(x.totals.sourceCells,1115590);
 assert.equal(x.totals.plasterAsWholeWall,105584);
 assert.equal(x.totals.brickMasonryAsSourceRoof,117048);
 assert.equal(x.totals.ceramicThinTileAsSourceFloor,34751);
 assert.equal(x.totals.allPack5CellsMissingAuthoredVariant,257449);
 assert.equal(x.totals.roofBaseWithoutImmediateWall,138698);
 assert.equal(Object.keys(x.exactOriginalSourceFileSHA256).length,7);
 assert.equal(Object.keys(x.byCohort).length,7);
 assert.equal(Object.keys(x.byBiome).length,5);
 assert.deepEqual(Object.fromEntries(Object.entries(x.byCohort).map(([wave,d])=>[wave,d.designs])),{
  wave01:10,wave02:9,wave03:12,wave04:12,wave05:12,wave06:12,wave07:12
 });
 assert.equal(Object.values(x.byCohort).reduce((s,d)=>s+d.sourceCells,0),1115590);
 assert.equal(Object.values(x.byBiome).reduce((s,d)=>s+d.designs,0),79);
 assert.equal(Object.values(x.byBiome).reduce((s,d)=>s+d.plaster,0),105584);
 assert.equal(x.originalA5207Intact,true);
 assert.equal(x.original79SourcesIntact,true);
 assert.equal(x.sourceOnly,true);
 assert.equal(x.fullBuildingPhysicalPackGeometryInstantiated,false);
 assert.equal(x.physicalMaterialVariantsAssigned,false);
 assert.equal(x.roofEngineeringAccepted,false);
 assert.equal(x.actualCollisionAcceptance,false);
 assert.equal(x.actualIphoneAndGpuMeasured,false);
 assert.equal(x.settlementPlaced,false);
 assert.equal(x.productionRegistered,false);
 assert.equal(x.saveSchema1Changed,false);
 assert.equal(x.playerPWAChanged,false);
 assert.equal(x.otherBuildersChanged,false);
 assert.equal(x.automationsChanged,false);
 assert.equal(x.creatorArtApproved,false);
 for(const row of x.buildings){
  const p=a5.blueprints.find(e=>e.id===row.id);
  assert.ok(p,'Original A5 source missing '+row.id);
  assert.equal(p.sourceProvenance.fileSHA256,row.sourceFileSHA256,row.id);
  assert.equal(p.sourceProvenance.geometrySHA256,row.sourceGeometrySHA256,row.id);
  assert.equal(p.occupiedGeometry.voxelCount,row.sourceVoxels,row.id);
  assert.equal(row.sourceFileSHA256,x.exactOriginalSourceFileSHA256[row.sourceFile],row.id);
  assert.equal(row.anyChosenVariant,false);
  assert.equal(row.anyChosenOrientation,false);
  assert.equal(row.physicalPackBackingCertified,false);
  assert.equal(row.physicalFullBuildingMeshInstantiated,false);
  assert.equal(row.creatorArtApproved,false);
 }
});
test('All 79 source-plaster cells: classify four *actual* Pack5 producer wall-support rotations, never choose a physical variant',{timeout:240000},()=>{
 const x=auditRoadmapAAll79PackBacking();
 assert.deepEqual(x.actualRealProducerSupportOffsets.map(v=>v.offset),[
  [0,0,-1],[1,0,0],[0,0,1],[-1,0,0]
 ]);
 assert.ok(x.actualRealProducerSupportOffsets.every(o=>o.variantAssigned===false));
 assert.equal(x.physicalProducerOptionsAreDemonstrationsNotChoices,true);
 assert.equal(x.sourceBackingNotEqualCertifiedPhysicalSupport,true);
 const totalsByYaw=[0,0,0,0],missingByYaw=[0,0,0,0];
 for(const row of x.buildings){
  assert.equal(row.physicalProducerPlasterFourPossibleYawBackings.length,4);
  assert.equal(row.sourceRoofBaseCells>=row.sourceRoofBaseCellsWithoutImmediateWall,true);
  assert.equal(Object.values(row.sourceRoofBaseUnderlyingKindCounts).reduce((a,b)=>a+b,0),row.sourceRoofBaseCells);
  assert.equal(Object.values(row.sourceThinTileBelowKinds).reduce((a,b)=>a+b,0),row.sourceThinTileAsFloor);
  for(const [i,yaw] of row.physicalProducerPlasterFourPossibleYawBackings.entries()){
   assert.equal(yaw.yaw,i);
   assert.deepEqual(yaw.realOriginalPack5SupportOffset,x.actualRealProducerSupportOffsets[i].offset);
   assert.equal(Object.values(yaw.classifications).reduce((s,n)=>s+n,0),row.sourcePlasterAsWholeWalls);
   assert.equal(yaw.sourceWholeWallPlasterCells,row.sourcePlasterAsWholeWalls);
   assert.equal(yaw.chosenOrientation,false);
   assert.equal(yaw.hypotheticalOrientationOnly,true);
   assert.equal(yaw.plasterSourceStructuralMountCertified,false);
   assert.equal(yaw.underlyingRealWorldSupportUnverified,true);
   totalsByYaw[i]+=yaw.sourceWholeWallPlasterCells;
   missingByYaw[i]+=yaw.sourceNoBackingCount;
  }
  assert.equal(row.lowestSourceNoBackingCountAcrossFourPossibleYaws,
    Math.min(...row.physicalProducerPlasterFourPossibleYawBackings.map(y=>y.sourceNoBackingCount)));
 }
 assert.deepEqual(totalsByYaw,[105584,105584,105584,105584]);
 assert.ok(missingByYaw.every(x=>x>0));
 assert.ok(x.buildings.some(b=>b.sourcePlasterAsWholeWalls>0&&b.lowestSourceNoBackingCountAcrossFourPossibleYaws>0));
});
test('All79 real-Manual-Pack backing and missing-variant source census exports independently hashable JSON, with creator/engineering holds',{timeout:240000},()=>{
 const x=auditRoadmapAAll79PackBacking();
 const dir=join(process.cwd(),'artifacts','roadmap-a-physical-all79');
 mkdirSync(dir,{recursive:true});
 const raw=JSON.stringify(x,null,2)+'\n';
 writeFileSync(join(dir,'ROADMAP_A_ALL79_FOUR_YAW_REAL_PACK5_SOURCE_BACKING_CENSUS.json'),raw);
 console.log('ROADMAP_A_ALL79_REAL_PACK_BACKING_CENSUS '+JSON.stringify({
  sourceDesigns:x.buildings.length,
  totalOriginalSourceCells:x.totals.sourceCells,
  plasterUsedAsWholeWalls:x.totals.plasterAsWholeWall,
  sourcePack5VariantsMissing:x.totals.allPack5CellsMissingAuthoredVariant,
  perYawWithoutAnySourceVoxel:x.actualRealProducerSupportOffsets.map((p,i)=>({
   yaw:p.yaw,backingOffset:p.offset,
   cellsWithoutOriginalBacking:x.buildings.reduce((sum,b)=>sum+b.physicalProducerPlasterFourPossibleYawBackings[i].sourceNoBackingCount,0)
  })),
  SHA256:sha(raw),productionRegistered:false,creatorArtAccepted:false,physicalIPhoneAccepted:false
 }));
});
