/** Roadmap A Wave18 additive ORIGINAL SOURCE-ONLY planning manifest.
 * All 327 inherited records remain deep-equal; twelve source-owned voxel
 * designs are provisional, not installed or approved physical Pack assets.
 * No live settlement, structural design review or production registration.
 */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {plannedSlots} from './catalog.mjs';
import {buildRoadmapA327ProvisionalSettlementManifest} from './roadmap-a-a5-327-provisional.mjs';
import {ROADMAP_A_WAVE18_SHOPS} from './roadmap-a-wave18.mjs';
const sha=data=>createHash('sha256').update(data).digest('hex');
const newCohorts=Object.freeze([
 {key:'wave18',filename:'roadmap-a-wave18.mjs',items:ROADMAP_A_WAVE18_SHOPS,evidenceExpected:72}
]);
function newRecord(b,cohort,fileSHA256){
 const cells=b.voxels,points=cells.map(v=>[v.x,v.y,v.z,v.kind,v.material,v.physicalVariant??null])
  .sort((a,c)=>a[1]-c[1]||a[2]-c[2]||a[0]-c[0]||String(a[3]).localeCompare(String(c[3])));
 const kinds={},materials=new Set(),ground=new Set();
 let minX=Infinity,maxX=-Infinity,minZ=Infinity,maxZ=-Infinity,minY=Infinity,maxY=-Infinity;
 for(const v of cells){
  minX=Math.min(minX,v.x);maxX=Math.max(maxX,v.x);minY=Math.min(minY,v.y);maxY=Math.max(maxY,v.y);
  minZ=Math.min(minZ,v.z);maxZ=Math.max(maxZ,v.z);
  if(v.kind==='floor'&&v.y===1)ground.add(v.x+','+v.z);
  kinds[v.kind]=(kinds[v.kind]??0)+1;
  materials.add(v.material);
 }
 const entrances=b.openings.filter(o=>o.type==='entrance').map(o=>({
  x:o.x,y:o.y,z:o.z,clearanceYCells:o.clearHeightCells??null,
  localFacing:o.z===0?'local-negative-z':o.z===b.extents.z-1?'local-positive-z':
   o.x===0?'local-negative-x':o.x===b.extents.x-1?'local-positive-x':'requires-settlement-orientation-validation',
  doorSymbol:o.doorSymbol??null,actualPlayerDoorCollisionUnverified:true
 }));
 return {
  id:b.id,category:b.category,biome:b.biome,size:b.size,variant:b.variation,proposedTitle:b.title,
  sourceProvenance:{
   sourceBranchInputHead:null,
   file:'src/building-pool/roadmap-2a/'+cohort.filename,
   fileSHA256,geometrySHA256:sha(JSON.stringify(points)),
   cohort:cohort.key,historical128Preserved:false,
   independentCurrentHeadAcceptancePending:true
  },
  plot:{
   localOccupiedBounds:{minX,maxX,minZ,maxZ},
   reservedEnvelopeCells:{width:b.extents.x,depth:b.extents.z,height:b.extents.y},
   groundedFloorCells:ground.size,
   minimumSetbacksPendingSettlementDesign:true,
   noAssumedTerrainSlopeTolerance:true,
   flatPreparedFoundationExpected:true,
   localRoadConnectionCandidate:entrances[0]?.localFacing??null
  },
  occupiedGeometry:{
   voxelCount:cells.length,kindCounts:kinds,actualOccupiedHeight:{minY,maxY},
   physicalAssetSymbols:[...materials].sort(),geometryIsSourceCellsNotInstalledPackMeshes:true
  },
  publicEntrances:entrances,
  interiorRooms:b.rooms.map(r=>({name:r.name,bounds:r.bounds,access:r.access??null,uses:r.uses??[]})),
  routeDescriptors:b.circulation,
  windows:b.openings.filter(o=>o.type==='window').map(o=>({x:o.x,y:o.y,z:o.z,material:o.material})),
  fixtureCells:cells.filter(v=>v.kind==='fixture').map(v=>({x:v.x,y:v.y,z:v.z,material:v.material,role:v.role??null})),
  roof:{sourceRoofCells:kinds.roof??0,profile:b.roof??null,
   installedBearingLoadAndClimateUnverified:true},
  physicalDependencies:b.unresolvedDependencies,
  performanceBudgetEstimate:{
   sourceOccupiedVoxelCount:cells.length,uniqueReferencedMaterials:materials.size,
   actualRuntimeGpuCostMeasured:false,actualCollisionBudgetMeasured:false
  },
  screenshotEvidence:{
   historicalReferenceArtifactId:null,
   expectedNewGalleryRun:'Wave18 not yet run: proposed '+cohort.evidenceExpected+'-PNG original cube-proxy gate',
   actualSourceSpecificScreenshotAccepted:false,
   finalInstalledPackMeshScreenshotsAccepted:false
  },
  acceptance:{
   sourceCandidateOnly:true,physicalIPhoneAccepted:false,creatorVisualAccepted:false,
   productionRegistered:false,saveSchema1Changed:false,liveWorldPlaced:false,
   settlementGeneratorReadyWithoutPhysicalReview:false
  }
 };
}
export function buildRoadmapA339ProvisionalSettlementManifest(){
 const prior=buildRoadmapA327ProvisionalSettlementManifest();
 if(prior.blueprints.length!==327||prior.remainingCanonicalIDs.length!==93)throw Error('Protected 327 metadata parent changed');
 const seen=new Set(prior.blueprints.map(b=>b.id));
 const additions=[];
 for(const source of newCohorts){
  const sourceSHA=sha(readFileSync(new URL('./'+source.filename,import.meta.url)));
  for(const bp of source.items){
   if(seen.has(bp.id))throw Error('Duplicate newly authored source '+bp.id);
   seen.add(bp.id);
   additions.push(newRecord(bp,source,sourceSHA));
  }
 }
 const targets=plannedSlots().map(x=>x.id);
 const remaining=targets.filter(id=>!seen.has(id));
 const blueprints=[...prior.blueprints,...additions].sort((a,b)=>a.id.localeCompare(b.id));
 return Object.freeze({
  schema:'mythwrought.roadmap-a.a5-settlement-handoff-provisional-expanded.v14',
  retainedPriorA5Schema:prior.schema,protected128:128,wave01:10,wave02:9,wave03:12,wave04:12,wave05:12,wave06:12,wave07:12,wave08:12,wave09:12,wave10:12,wave11:12,wave12:12,wave13:12,wave14:12,wave15:12,wave16:12,wave17:12,wave18:12,
  target:420,sourceCandidates:blueprints.length,remainingCanonicalIDs:remaining,
  noExistingRecordAltered:true,producerPhysicalMeshAcceptance:false,
  screenshotEvidenceAcceptanceForNew211:false,productionGameRegistration:false,
  schema1SaveMutation:false,villageTownCityGenerationImplemented:false,
  roadAlignmentIsLocalFacingOnly:true,terrainSlopeAndPlotSetbacksUncertified:true,
  requiresCreatorArtAndIPhoneReview:true,
  blueprints
 });
}
