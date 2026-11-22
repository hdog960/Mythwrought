/**
 * Three representative commerce buildings: exact source cells versus real Manual Pack5
 * mounting/physics. Read-only. No authored variant choice, building placement or world API.
 */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {ROADMAP_A_WAVE05_SHOPS} from './roadmap-a-wave05.mjs';
import {ROADMAP_A_WAVE07_SHOPS} from './roadmap-a-wave07.mjs';
import {buildRoadmapA207ProvisionalSettlementManifest} from './roadmap-a-a5-207-provisional.mjs';
import {auditRoadmapAProducerFidelity} from './roadmap-a-physical-producer-fidelity.mjs';
import {resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {getPack5Surface} from '../../block-packs/pack-5/architectural-surfaces.mjs';
const rawSource=Object.freeze([...ROADMAP_A_WAVE05_SHOPS,...ROADMAP_A_WAVE07_SHOPS]);
const LOOKUPS=Object.freeze([
 ['r2:general-store:desert:large:05','wave07','desert-high-material-risk'],
 ['r2:bakery:enchanted-forest:large:05','wave05','plaster-with-authored-pack3-roof'],
 ['r2:bank:snow:medium:03','wave07','pack1-wall-and-pack3-roof-control']
]);
const hash=x=>createHash('sha256').update(x).digest('hex');
const key=(x,y,z)=>x+','+y+','+z;
function geometrySHA(bp){
 const cells=bp.voxels.map(v=>[v.x,v.y,v.z,v.kind,v.material,v.physicalVariant??null])
  .sort((a,b)=>a[1]-b[1]||a[2]-b[2]||a[0]-b[0]||String(a[3]).localeCompare(String(b[3])));
 return hash(JSON.stringify(cells));
}
const assets=Object.freeze(['pack5:079','pack5:080','pack5:081']);
const surfaceVariants={
 'pack5:079':['chalk-lime','hand-troweled'],
 'pack5:080':['hearth-running-bond','kiln-soldier-course'],
 'pack5:081':['sunburst-encaustic','moonwoven-glaze']
};
const producerOptions=Object.freeze(Object.fromEntries(assets.map(symbol=>[
 symbol,Object.freeze(surfaceVariants[symbol].map(variant=>{
  const surface=getPack5Surface(symbol,variant);
  const resolved=resolveManualFivePackAsset(symbol,{variant});
  return Object.freeze({
   symbol,variant,
   sourceSelectedThisVariant:false,
   intendedForOneAssetDemonstrationOnly:true,
   supportPolicy:resolved.supportPolicy,
   requiredSupports:resolved.supportOffsets,
   visibleBoxCount:resolved.visibleBoxes.length,
   colliderBoxCount:resolved.collisionBoxes.length,
   colorKeys:Object.freeze([...new Set(surface.art.map(part=>part.material))].sort())
  });
 }))
])));
function classifyBacking(v,offset,byCoord){
 const lower=byCoord.get(key(v.x+offset[0],v.y+offset[1],v.z+offset[2]));
 if(!lower)return 'no-source-voxel';
 if(lower.kind==='wall'&&lower.material==='pack5:079')return 'plaster-wall-not-certified-structural';
 if(lower.kind==='wall')return 'other-wall-not-certified-structural';
 return 'nonwall-voxel-not-certified-structural';
}
export function auditRoadmapARepresentativePackCompatibility(){
 const originalLedger=buildRoadmapA207ProvisionalSettlementManifest();
 const ledger=new Map(originalLedger.blueprints.map(x=>[x.id,x]));
 const risk=new Map(auditRoadmapAProducerFidelity().sourceDesigns.map(x=>[x.id,x]));
 if(ledger.size!==207||risk.size!==79)throw Error('Protected A5 or original 79 source candidate registry drift');
 const rows=[];
 for(const [id,wave,role] of LOOKUPS){
  const b=rawSource.find(x=>x.id===id),a5=ledger.get(id),base=risk.get(id);
  if(!b||!a5||!base||a5.sourceProvenance.cohort!==wave)
   throw Error('Selected original commerce building/technical A5 provenance drift '+id);
  const geomHash=geometrySHA(b);
  if(a5.sourceProvenance.geometrySHA256!==geomHash||a5.occupiedGeometry.voxelCount!==b.voxels.length)
   throw Error('Source-authentic A5 geometry fingerprint drift '+id);
  const filename=a5.sourceProvenance.file.split('/').at(-1);
  const originalFile=readFileSync(new URL('./'+filename,import.meta.url));
  if(hash(originalFile)!==a5.sourceProvenance.fileSHA256)
   throw Error('Source producer SHA256 drift '+id);
  const byCoord=new Map(b.voxels.map(v=>[key(v.x,v.y,v.z),v]));
  if(byCoord.size!==b.voxels.length)throw Error('Selected source voxel overlap '+id);
  const materials={},plasterWalls=[],brickRoofs=[],ceramicFloors=[],variantOmissions=[],roofBases=[];
  for(const v of b.voxels){
   materials[v.material]=(materials[v.material]??0)+1;
   if(v.kind==='wall'&&v.material==='pack5:079')plasterWalls.push(v);
   if(v.kind==='roof'&&v.material==='pack5:080')brickRoofs.push(v);
   if(v.kind==='floor'&&v.material==='pack5:081')ceramicFloors.push(v);
   if(v.material.startsWith('pack5:')&&!v.physicalVariant)variantOmissions.push(v);
   if(v.kind==='roof'){
    const below=byCoord.get(key(v.x,v.y-1,v.z));
    if(!below||below.kind!=='roof')roofBases.push({x:v.x,y:v.y,z:v.z,below:below?.kind??'source-air',belowMaterial:below?.material??null});
   }
  }
  const facingByYaw=[];
  for(const yaw of [0,1,2,3]){
   const first=resolveManualFivePackAsset('pack5:079',{orientation:yaw,variant:'chalk-lime'});
   const second=resolveManualFivePackAsset('pack5:079',{orientation:yaw,variant:'hand-troweled'});
   if(first.supportPolicy!=='wall'||first.supportOffsets.length!==1||
      JSON.stringify(first.supportOffsets)!==JSON.stringify(second.supportOffsets))
    throw Error('Physical plaster backing differs between genuine producer variants');
   const offset=first.supportOffsets[0],classifications={};
   for(const v of plasterWalls){
    const label=classifyBacking(v,offset,byCoord);
    classifications[label]=(classifications[label]??0)+1;
   }
   facingByYaw.push({yaw,actualProducerSupportOffset:offset,
    possibleSourceBackingsByType:classifications,
    potentialPhysicalSupportCertified:false,
    variantSelected:false});
  }
  const roofBaseKinds={};
  for(const r of roofBases){
   const label=r.below==='source-air'?'source-air':
     r.below==='wall'&&r.belowMaterial==='pack5:079'?'uncertified-plaster-wall':
     r.below==='wall'?'other-source-wall-not-engineered':r.below+'-not-bearing-certified';
   roofBaseKinds[label]=(roofBaseKinds[label]??0)+1;
  }
  const ceramicBelow={};
  for(const v of ceramicFloors){
   const lower=byCoord.get(key(v.x,v.y-1,v.z));
   const label=lower?lower.kind+':'+lower.material:'no-source-voxel';
   ceramicBelow[label]=(ceramicBelow[label]??0)+1;
  }
  if(plasterWalls.length!==base.pack5WallMountedPlasterUsedAsWall||
     brickRoofs.length!==base.pack5FiredBrickMasonryUsedAsRoof||
     variantOmissions.length!==base.pack5CellsMissingMandatoryPhysicalVariant||
     roofBases.length!==base.roofBaseColumns||
     roofBases.filter(v=>v.below!=='wall').length!==base.roofBaseWithoutWallImmediatelyBelow)
    throw Error('Crosswalk did not match strict independently accepted 79-source producer counts: '+id);
  rows.push({
   id,role,wave,title:b.title,category:b.category,biome:b.biome,size:b.size,
   sourceFile:a5.sourceProvenance.file,
   sourceFileSHA256:a5.sourceProvenance.fileSHA256,
   exactGeometrySHA256:geomHash,sourceVoxelCount:b.voxels.length,
   sourceMaterialCounts:Object.fromEntries(Object.entries(materials).sort((a,b)=>a[0].localeCompare(b[0]))),
   originalA5RecordPreserved:true,
   sourceWallMountedPlasterCells:plasterWalls.length,
   sourceMasonryLabeledRoofCells:brickRoofs.length,
   sourceThinCeramicLabeledFloorCells:ceramicFloors.length,
   sourcePack5CellsWithNoAuthoredVariant:variantOmissions.length,
   plasterProducerBackingsForEachPossibleYaw:facingByYaw,
   sourceRoofBaseCount:roofBases.length,
   sourceRoofBaseUnderlyingKindCounts:roofBaseKinds,
   sourceRoofBasesWithNoImmediateWall:base.roofBaseWithoutWallImmediatelyBelow,
   sourceCeramicTilesUnderlyingSourceCells:ceramicBelow,
   sourceSymbolicDoorReferences:b.openings.filter(o=>o.doorSymbol).map(o=>({kind:o.type,ref:o.doorSymbol,actualDoorInstancePlaced:false})),
   sourceNonEmptyCellCountExceedsDefault4096Instances:b.voxels.length>4096,
   physicalOrientationSelected:false,pack5PhysicalVariantsChosen:false,
   physicalWallSupportCertified:false,roofBearingCertified:false,
   realInstalledManualPackGeometryBuilt:false,gameWorldRegistered:false,
   realIphoneAndGpuMeasured:false,creatorArtApproved:false
  });
 }
 return {
  schema:'mythwrought.roadmap-a.2a-three-case-physical-producer-source-crosswalk.v1',
  sourceOnly:true,sourceBuildingsChanged:false,sourceA5207RecordsChanged:false,
  original128CommerceChanged:false,otherBuildersChanged:false,automationsChanged:false,
  gameRegistered:false,saveSchema1Changed:false,pwaChanged:false,
  threeRepresentativeDesigns:rows.length,materialProducerOptions:producerOptions,
  exampleProducerVariantsAreNeverAssignedToBlueprint:true,
  fullThreeBuildingPhysicalGeometryInstantiated:false,
  allCategoryMaterialOrStructuralGatesAccepted:false,
  roofLoadBearingProven:false,actualIphonePerformanceProven:false,creatorArtApproved:false,
  buildings:rows
 };
}
