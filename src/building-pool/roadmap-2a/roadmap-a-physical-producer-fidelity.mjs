/**
 * Roadmap A: read-only actual MANUAL five-pack producer fidelity diagnostic.
 * Imported source blueprints and pack producers are never mutated or installed.
 * Producer example variants are explicitly ILLUSTRATIVE, not invented blueprint choices.
 */
import {ROADMAP_A_WAVE01_SHOPS} from './roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SHOPS} from './roadmap-a-wave02.mjs';
import {ROADMAP_A_WAVE03_SHOPS} from './roadmap-a-wave03.mjs';
import {ROADMAP_A_WAVE04_SHOPS} from './roadmap-a-wave04.mjs';
import {ROADMAP_A_WAVE05_SHOPS} from './roadmap-a-wave05.mjs';
import {ROADMAP_A_WAVE06_SHOPS} from './roadmap-a-wave06.mjs';
import {ROADMAP_A_WAVE07_SHOPS} from './roadmap-a-wave07.mjs';
import {MANUAL_FIVE_PACK_CATALOG,manualFivePackVariants,resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../../pack5-integration/catalog.mjs';
import {getPack5Surface,PACK5_SURFACE_MATERIALS} from '../../block-packs/pack-5/architectural-surfaces.mjs';
const waves=Object.freeze([
 ['wave01',ROADMAP_A_WAVE01_SHOPS],['wave02',ROADMAP_A_WAVE02_SHOPS],
 ['wave03',ROADMAP_A_WAVE03_SHOPS],['wave04',ROADMAP_A_WAVE04_SHOPS],
 ['wave05',ROADMAP_A_WAVE05_SHOPS],['wave06',ROADMAP_A_WAVE06_SHOPS],
 ['wave07',ROADMAP_A_WAVE07_SHOPS]
]);
const pos=(v,y=v.y)=>v.x+','+y+','+v.z;
const sortedEntries=o=>Object.fromEntries(Object.entries(o).sort((a,b)=>a[0].localeCompare(b[0])));
const bump=(obj,key,count=1)=>obj[key]=(obj[key]??0)+count;
const roster=new Map(MANUAL_FIVE_PACK_CATALOG.map(r=>[r.symbol,1]));
const pack5=new Map(PACK5_BUILDER_CATALOG.map(r=>[r.symbolicId,r]));
function demonstratedProducer(symbol,variant){
 const a=resolveManualFivePackAsset(symbol,{orientation:'north',variant});
 const source=getPack5Surface(symbol,variant);
 return {
  symbol,variant,authoredOnlyInPackProducer:true,selectedByRoadmapASource:false,
  producerName:pack5.get(symbol)?.name??null,
  visiblePhysicalBoxesPerInstance:a.visibleBoxes.length,
  selectionPhysicalBoxesPerInstance:a.selectionBoxes.length,
  collisionPhysicalBoxesPerInstance:a.collisionBoxes.length,
  occupiedCellsPerInstance:a.occupiedOffsets.length,
  supportOffsets:a.supportOffsets,
  supportPolicy:a.supportPolicy,
  collisionBoxes:a.collisionBoxes,
  exampleSurfacePalette:Object.fromEntries(
   [...new Set(source.art.map(x=>x.material))].sort().map(k=>[k,PACK5_SURFACE_MATERIALS[k]])
  ),
  rendererIsSourceCubeProxy:false,
  physicalPackApprovedForSettlementUse:false
 };
}
export function auditRoadmapAProducerFidelity(){
 const sources=waves.flatMap(([wave,designs])=>designs.map(blueprint=>({wave,blueprint})));
 if(sources.length!==79||new Set(sources.map(x=>x.blueprint.id)).size!==79)
  throw Error('Protected source cohort drift in producer diagnostic');
 const byKind={},byMaterial={},sourceVariantless={},byKindMaterial={},byBiome={},
  familyAliases={},problems=[],structure=[];
 let totalVoxels=0,baseRoofOverNonWall=0,baseRoofColumns=0,unresolvedVariantCount=0,doorSymbols=0;
 for(const {wave,blueprint:b} of sources){
  const cellMap=new Map(b.voxels.map(v=>[pos(v),v]));
  if(cellMap.size!==b.voxels.length)throw Error('Source cell collision '+b.id);
  const local={kindCount:{},materials:{},roofBaseColumns:0,roofBaseWithNoWallBelow:0,
   variantlessPack5Cells:0,roofFiredBrickCells:0,plasterWallCells:0,
   largeSingleCellInstances:b.voxels.length>4096,
   creatorPhysicalMaterialAccepted:false,physicalIphoneAccepted:false,realGpuMeasured:false};
  for(const v of b.voxels){
   if(!roster.has(v.material))problems.push({id:b.id,kind:v.kind,ref:v.material,reason:'not-in-actual-manual-five-pack-family-catalog'});
   bump(byKind,v.kind);bump(byMaterial,v.material);bump(byKindMaterial,v.kind+'|'+v.material);
   bump(local.kindCount,v.kind);bump(local.materials,v.material);
   const family=manualFivePackVariants(v.material);
   if(family.length!==1)familyAliases[v.material]=family.map(x=>x.numericId);
   if(v.material.startsWith('pack5:')&&!v.physicalVariant){
    bump(sourceVariantless,v.material);unresolvedVariantCount++;local.variantlessPack5Cells++;
   }
   if(v.kind==='wall'&&v.material==='pack5:079')local.plasterWallCells++;
   if(v.kind==='roof'&&v.material==='pack5:080')local.roofFiredBrickCells++;
   if(v.kind==='roof'){
    const lower=cellMap.get(pos(v,v.y-1));
    if(!lower||lower.kind!=='roof'){
     local.roofBaseColumns++;baseRoofColumns++;
     if(!lower||lower.kind!=='wall'){local.roofBaseWithNoWallBelow++;baseRoofOverNonWall++;}
    }
   }
  }
  doorSymbols+=b.openings.filter(o=>o.doorSymbol).length;
  totalVoxels+=b.voxels.length;bump(byBiome,b.biome);
  structure.push({id:b.id,wave,category:b.category,biome:b.biome,size:b.size,
   sourceVoxels:b.voxels.length,sourceRoofCells:local.kindCount.roof??0,
   sourceWallCells:local.kindCount.wall??0,
   sourceWindowCells:local.kindCount.window??0,
   roofBaseColumns:local.roofBaseColumns,roofBaseWithoutWallImmediatelyBelow:local.roofBaseWithNoWallBelow,
   pack5WallMountedPlasterUsedAsWall:local.plasterWallCells,
   pack5FiredBrickMasonryUsedAsRoof:local.roofFiredBrickCells,
   pack5CellsMissingMandatoryPhysicalVariant:local.variantlessPack5Cells,
   exceedsManualBlueprint4096IfOneCellMeansOneInstance:local.largeSingleCellInstances,
   usedSymbols:sortedEntries(local.materials),
   sourceOnly:true,producerSupportCertified:false,producerCollisionCertified:false,
   physicalBuildingAccepted:false});
 }
 const variants={};
 for(const ref of ['pack5:079','pack5:080','pack5:081']){
  const family=pack5.get(ref);
  if(!family||family.variants.length!==2)throw Error('Physical Pack5 family provenance missing: '+ref);
  variants[ref]=family.variants.map(variant=>demonstratedProducer(ref,variant));
 }
 return {
  schema:'mythwrought.roadmap-a.2a-manual-pack-producer-fidelity-diagnostic.v1',
  purpose:'REAL producer semantics against immutable SOURCE candidates, never real-world gameplay acceptance',
  fullCurrentProducerABI:true,
  original128CommerceChanged:false,
  industrial345Changed:false,government315Changed:false,
  staged207A5RecordsChanged:false,
  sourceCandidateCount:79,sourceWaves:7,physicalProducerFamilies:MANUAL_FIVE_PACK_CATALOG.length,
  totalSourceVoxels:totalVoxels,
  perCategoryBiomeCoverage:sortedEntries(byBiome),
  sourceKinds:sortedEntries(byKind),sourceMaterials:sortedEntries(byMaterial),
  sourceKindMaterialPairs:sortedEntries(byKindMaterial),
  mandatoryPack5VariantUnspecified:sortedEntries(sourceVariantless),
  mandatoryVariantUnspecifiedSourceCellCount:unresolvedVariantCount,
  wallMountedPack5PlasterUsedAsFullSourceWallCells:byKindMaterial['wall|pack5:079']??0,
  actualProducerFiredBrickUsedAsSourceRoofCells:byKindMaterial['roof|pack5:080']??0,
  actualProducerThinCeramicTileUsedAsSourceFloorCells:byKindMaterial['floor|pack5:081']??0,
  sourceBaseRoofColumns:baseRoofColumns,
  roofBaseColumnsWithoutImmediateFullWallBelow:baseRoofOverNonWall,
  symbolicDoorOpeningsNotActualPlacedDoors:doorSymbols,
  sourceDesignsExceed4096IndividualCells:structure.filter(x=>x.exceedsManualBlueprint4096IfOneCellMeansOneInstance).length,
  ambiguousNumericVariantFamilies:sortedEntries(familyAliases),
  unknownManualAssetSymbols:problems,
  actualPack5ProducerVariantExamples:variants,
  examplesAreNotAuthoredSourceVariantAssignments:true,
  physicalWallBackingProven:false,
  longRoofSpansBearingProven:false,physicalBlockCollisionsProven:false,
  sourceCatalogToMixedOwnerWorldPlacementProven:false,
  runtimeTriangleAndGpuCostMeasured:false,
  sourceCubeVisualArtAccepted:false,physicalIPhoneAccepted:false,
  creatorAccepted:false,allNewSourcesProvisional:true,
  implementationBlockedUntilPhysicalProducerReview:true,
  sourceDesigns:structure.sort((a,b)=>a.id.localeCompare(b.id))
 };
}
