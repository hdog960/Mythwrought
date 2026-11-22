/**
 * ROADMAP A — all79 actual Manual Pack5 attachment source census.
 * A FAIL-CLOSED read-only diagnostic, not a physical support solver or a variant assignment.
 * Reads original Wave01–07 cells and immutable A5 v3 records.
 */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {buildRoadmapA207ProvisionalSettlementManifest} from './roadmap-a-a5-207-provisional.mjs';
import {auditRoadmapAProducerFidelity} from './roadmap-a-physical-producer-fidelity.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {ROADMAP_A_WAVE01_SHOPS} from './roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SHOPS} from './roadmap-a-wave02.mjs';
import {ROADMAP_A_WAVE03_SHOPS} from './roadmap-a-wave03.mjs';
import {ROADMAP_A_WAVE04_SHOPS} from './roadmap-a-wave04.mjs';
import {ROADMAP_A_WAVE05_SHOPS} from './roadmap-a-wave05.mjs';
import {ROADMAP_A_WAVE06_SHOPS} from './roadmap-a-wave06.mjs';
import {ROADMAP_A_WAVE07_SHOPS} from './roadmap-a-wave07.mjs';
const cohorts=Object.freeze([
 ['wave01',ROADMAP_A_WAVE01_SHOPS],['wave02',ROADMAP_A_WAVE02_SHOPS],
 ['wave03',ROADMAP_A_WAVE03_SHOPS],['wave04',ROADMAP_A_WAVE04_SHOPS],
 ['wave05',ROADMAP_A_WAVE05_SHOPS],['wave06',ROADMAP_A_WAVE06_SHOPS],
 ['wave07',ROADMAP_A_WAVE07_SHOPS]
]);
const sha=x=>createHash('sha256').update(x).digest('hex');
const pos=(x,y,z)=>x+','+y+','+z;
function geometrySHA(bp){
 const cells=bp.voxels.map(v=>[v.x,v.y,v.z,v.kind,v.material,v.physicalVariant??null])
  .sort((a,b)=>a[1]-b[1]||a[2]-b[2]||a[0]-b[0]||String(a[3]).localeCompare(String(b[3])));
 return sha(JSON.stringify(cells));
}
const variants=Object.freeze(['chalk-lime','hand-troweled']);
const physical=Object.freeze([0,1,2,3].map(yaw=>{
 const a=resolveManualFivePackAsset('pack5:079',{variant:variants[0],orientation:yaw});
 const b=resolveManualFivePackAsset('pack5:079',{variant:variants[1],orientation:yaw});
 if(a.supportPolicy!=='wall'||b.supportPolicy!=='wall'||a.supportOffsets.length!==1||
  JSON.stringify(a.supportOffsets)!==JSON.stringify(b.supportOffsets))
  throw Error('Real Pack5 plaster wall support semantics drift at yaw '+yaw);
 return Object.freeze({yaw,offset:Object.freeze([...a.supportOffsets[0]]),variantAssigned:false});
}));
const classifyBacking=(cell,lookup,offset)=>{
 const v=lookup.get(pos(cell.x+offset[0],cell.y+offset[1],cell.z+offset[2]));
 if(!v)return 'no-source-voxel';
 if(v.kind==='wall'&&v.material==='pack5:079')return 'source-plaster-wall-not-certified-bearing';
 if(v.kind==='wall')return 'other-source-wall-not-certified-bearing';
 return 'other-source-voxel-not-certified-bearing';
};
const classifyRoof=(v,lookup)=>{
 const below=lookup.get(pos(v.x,v.y-1,v.z));
 if(!below)return 'source-air';
 if(below.kind==='wall'&&below.material==='pack5:079')return 'uncertified-plaster-wall';
 if(below.kind==='wall')return 'other-wall-not-bearing-certified';
 return below.kind+'-not-bearing-certified';
};
export function auditRoadmapAAll79PackBacking(){
 const a5=buildRoadmapA207ProvisionalSettlementManifest();
 const prior=auditRoadmapAProducerFidelity();
 const a5ById=new Map(a5.blueprints.map(b=>[b.id,b]));
 const originalRisk=new Map(prior.sourceDesigns.map(b=>[b.id,b]));
 if(a5.blueprints.length!==207||a5.remainingCanonicalIDs.length!==213||
    originalRisk.size!==79||a5ById.size!==207)
  throw Error('Protected A5/79 material-geometry baseline drift');
 const fileHashes=new Map(),rows=[],byBiome={},byCohort={},totals={
  sourceCells:0,plasterAsWholeWall:0,plasterWithoutExplicitVariant:0,
  brickMasonryAsSourceRoof:0,ceramicThinTileAsSourceFloor:0,
  allPack5CellsMissingAuthoredVariant:0,baseRoofCells:0,roofBaseWithoutImmediateWall:0,
  sourceTileWithSourceFoundationUnderneath:0,
  sourceDoorSymbolsNotPhysicalPlacements:0
 };
 for(const [cohort,blueprints] of cohorts){
  const filename='roadmap-a-'+cohort+'.mjs';
  const filePath='src/building-pool/roadmap-2a/'+filename;
  const fileSHA=sha(readFileSync(new URL('./'+filename,import.meta.url)));
  if(blueprints.length!==(cohort==='wave01'?10:cohort==='wave02'?9:12))
   throw Error('Wave cohort original source count drift '+cohort);
  fileHashes.set(filePath,fileSHA);
  byCohort[cohort]={designs:0,plaster:0,sourceMissingPhysicalVariants:0,sourceCells:0};
  for(const bp of blueprints){
   const a=a5ById.get(bp.id),r=originalRisk.get(bp.id);
   if(!a||!r||a.sourceProvenance.cohort!==cohort||
     a.sourceProvenance.file!==filePath||
     a.sourceProvenance.fileSHA256!==fileSHA||
     a.sourceProvenance.geometrySHA256!==geometrySHA(bp)||
     a.occupiedGeometry.voxelCount!==bp.voxels.length)
     throw Error('Original A5 and physical source provenance mismatch '+bp.id);
   const cells=new Map(bp.voxels.map(v=>[pos(v.x,v.y,v.z),v]));
   if(cells.size!==bp.voxels.length)throw Error('Original source cell collision '+bp.id);
   const plaster=bp.voxels.filter(v=>v.kind==='wall'&&v.material==='pack5:079');
   const brick=bp.voxels.filter(v=>v.kind==='roof'&&v.material==='pack5:080');
   const thinTile=bp.voxels.filter(v=>v.kind==='floor'&&v.material==='pack5:081');
   const unassigned=bp.voxels.filter(v=>v.material.startsWith('pack5:')&&!v.physicalVariant);
   const roofBase=bp.voxels.filter(v=>v.kind==='roof'&&cells.get(pos(v.x,v.y-1,v.z))?.kind!=='roof');
   const noDirectWall=roofBase.filter(v=>cells.get(pos(v.x,v.y-1,v.z))?.kind!=='wall');
   if(plaster.length!==r.pack5WallMountedPlasterUsedAsWall||
      brick.length!==r.pack5FiredBrickMasonryUsedAsRoof||
      thinTile.length!==(r.sourceFloorTilesFromRealProducer??thinTile.length)||
      unassigned.length!==r.pack5CellsMissingMandatoryPhysicalVariant||
      roofBase.length!==r.roofBaseColumns||noDirectWall.length!==r.roofBaseWithoutWallImmediatelyBelow)
     throw Error('All79 previous source producer risk changed '+bp.id);
   const possibleBackingsByYaw=physical.map(({yaw,offset})=>{
    const categories={};
    for(const cell of plaster){
     const label=classifyBacking(cell,cells,offset);
     categories[label]=(categories[label]??0)+1;
    }
    return {yaw,realOriginalPack5SupportOffset:offset,
     classifications:categories,
     sourceWholeWallPlasterCells:plaster.length,
     sourceNoBackingCount:categories['no-source-voxel']??0,
     hypotheticalOrientationOnly:true,chosenOrientation:false,
     plasterSourceStructuralMountCertified:false,underlyingRealWorldSupportUnverified:true};
   });
   for(const yaw of possibleBackingsByYaw)
    if(Object.values(yaw.classifications).reduce((s,n)=>s+n,0)!==plaster.length)
     throw Error('Incomplete original source plaster backing classification '+bp.id+' yaw '+yaw.yaw);
   const tileUnder={};
   for(const v of thinTile){
    const below=cells.get(pos(v.x,v.y-1,v.z));
    const label=below?below.kind+':'+below.material:'source-air';
    tileUnder[label]=(tileUnder[label]??0)+1;
   }
   const roofUnder={};
   for(const v of roofBase){
    const label=classifyRoof(v,cells);
    roofUnder[label]=(roofUnder[label]??0)+1;
   }
   if(Object.values(roofUnder).reduce((s,n)=>s+n,0)!==roofBase.length||
      Object.values(tileUnder).reduce((s,n)=>s+n,0)!==thinTile.length)
    throw Error('Source roof or tile classification lost original cells '+bp.id);
   const doors=bp.openings.filter(x=>x.doorSymbol).length;
   for(const [k,val] of Object.entries({
    sourceCells:bp.voxels.length,plasterAsWholeWall:plaster.length,
    plasterWithoutExplicitVariant:plaster.filter(x=>!x.physicalVariant).length,
    brickMasonryAsSourceRoof:brick.length,ceramicThinTileAsSourceFloor:thinTile.length,
    allPack5CellsMissingAuthoredVariant:unassigned.length,
    baseRoofCells:roofBase.length,roofBaseWithoutImmediateWall:noDirectWall.length,
    sourceTileWithSourceFoundationUnderneath:thinTile.filter(x=>cells.get(pos(x.x,x.y-1,x.z))?.kind==='foundation').length,
    sourceDoorSymbolsNotPhysicalPlacements:doors
   }))totals[k]+=val;
   byBiome[bp.biome]??={designs:0,plaster:0,withoutBackingsAcross4Yaws:0};
   byBiome[bp.biome].designs++;byBiome[bp.biome].plaster+=plaster.length;
   byBiome[bp.biome].withoutBackingsAcross4Yaws+=possibleBackingsByYaw.reduce((sum,x)=>sum+x.sourceNoBackingCount,0);
   byCohort[cohort].designs++;byCohort[cohort].sourceCells+=bp.voxels.length;
   byCohort[cohort].plaster+=plaster.length;
   byCohort[cohort].sourceMissingPhysicalVariants+=unassigned.length;
   rows.push({id:bp.id,category:bp.category,biome:bp.biome,wave:cohort,
    sourceFile:filePath,sourceFileSHA256:fileSHA,
    sourceGeometrySHA256:a.sourceProvenance.geometrySHA256,
    sourceVoxels:bp.voxels.length,sourcePlasterAsWholeWalls:plaster.length,
    sourceBrickAsRoof:brick.length,sourceThinTileAsFloor:thinTile.length,
    sourcePack5MissingVariant:unassigned.length,sourceRoofBaseCells:roofBase.length,
    sourceRoofBaseCellsWithoutImmediateWall:noDirectWall.length,
    sourceRoofBaseUnderlyingKindCounts:roofUnder,
    sourceThinTileBelowKinds:tileUnder,
    sourceSymbolicDoorsNotPlaced:doors,
    physicalProducerPlasterFourPossibleYawBackings:possibleBackingsByYaw,
    lowestSourceNoBackingCountAcrossFourPossibleYaws:Math.min(...possibleBackingsByYaw.map(y=>y.sourceNoBackingCount)),
    anyChosenVariant:false,anyChosenOrientation:false,
    physicalPackBackingCertified:false,roofBearingCertified:false,
    physicalFullBuildingMeshInstantiated:false,actualGPUMeasured:false,
    gameRegistered:false,creatorArtApproved:false});
  }
 }
 if(rows.length!==79||new Set(rows.map(x=>x.id)).size!==79||
   totals.sourceCells!==1115590||
   totals.plasterAsWholeWall!==105584||
   totals.brickMasonryAsSourceRoof!==117048||
   totals.ceramicThinTileAsSourceFloor!==34751||
   totals.allPack5CellsMissingAuthoredVariant!==257449||
   totals.roofBaseWithoutImmediateWall!==138698)
   throw Error('Exact previously accepted 79 source-material physical audit totals drift');
 return {
  schema:'mythwrought.roadmap-a.2a-all79-four-yaw-real-pack5-source-support-census.v1',
  originalA5207Intact:true,original79SourcesIntact:true,sourceOnly:true,
  expectedMissingCanonicalSlots:213,physicalProducerOptionsAreDemonstrationsNotChoices:true,
  actualRealProducerSupportOffsets:physical,
  exactOriginalSourceFileSHA256:Object.fromEntries(fileHashes),
  buildings:rows,byBiome,byCohort,totals,
  sourceBackingNotEqualCertifiedPhysicalSupport:true,
  fullBuildingPhysicalPackGeometryInstantiated:false,
  physicalMaterialVariantsAssigned:false,roofEngineeringAccepted:false,
  actualCollisionAcceptance:false,actualIphoneAndGpuMeasured:false,
  settlementPlaced:false,productionRegistered:false,saveSchema1Changed:false,
  playerPWAChanged:false,otherBuildersChanged:false,automationsChanged:false,
  creatorArtApproved:false,requiresExplicitCreatorAndProducerResolution:true
 };
}
