/** Roadmap A A5: deterministic *provisional* settlement handoff, no world registration.
 * All 128 accepted historical sources remain byte-identical; 19 newly proposed
 * commerce designs remain unapproved until strict geometry, render, producer and creator gates.
 */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {plannedSlots} from './catalog.mjs';
import {M1_GENERAL_STORES} from './m1-general-stores.mjs';
import {M1_SPECIALIST_EXEMPLARS} from './m1-specialist-exemplars.mjs';
import {M1_NEW_MERCHANTS} from './m1-additional-shops.mjs';
import {M1_REGIONAL_SHOPS} from './m1-regional-shops.mjs';
import {M1_BIOME_EXPANSION} from './m1-biome-expansion.mjs';
import {M1_CATEGORY_ARCADES} from './m1-category-arcades.mjs';
import {M1_MARKET_FRONTS} from './m1-market-fronts.mjs';
import {M1_COURTYARD_SHOPS} from './m1-courtyard-shops.mjs';
import {M1_U_COURT_SHOPS} from './m1-u-court-shops.mjs';
import {M1_LATERAL_MARKETS} from './m1-lateral-markets.mjs';
import {M1_PROFILED_ARCADE_SHOPS} from './m1-profiled-arcade-shops.mjs';
import {M1_ARCADED_FRONT_SHOPS} from './m1-arcaded-front-shops.mjs';
import {M1_TOWER_COURT_SHOPS} from './m1-tower-court-shops.mjs';
import {M1_SCULPTED_MARKETS} from './m1-sculpted-markets.mjs';
import {M1_SIGNATURE_SKYLINE_SHOPS} from './m1-signature-skyline.mjs';
import {M1_LANDMARK_SHOPS} from './m1-landmark-shops.mjs';
import {M1_DISTINCT_WING_SHOPS} from './m1-distinct-wing-shops.mjs';
import {M1_FIVE_COURT_SHOPS} from './m1-five-court-shops.mjs';
import {M1_TWIN_SIDE_TERRACE_SHOPS} from './m1-twin-side-terraces.mjs';
import {M1_STEPPED_COURT_SHOPS} from './m1-stepped-court-shops.mjs';
import {ROADMAP_A_WAVE01_SHOPS} from './roadmap-a-wave01.mjs';
import {ROADMAP_A_WAVE02_SHOPS} from './roadmap-a-wave02.mjs';
const INPUT_SOURCE_HEAD='0545db3342e2aadd6920030edc1584c885ab0ced';
const COHORTS=Object.freeze([
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-general-stores.mjs',filename:'m1-general-stores.mjs',items:M1_GENERAL_STORES},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-specialist-exemplars.mjs',filename:'m1-specialist-exemplars.mjs',items:M1_SPECIALIST_EXEMPLARS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-additional-shops.mjs',filename:'m1-additional-shops.mjs',items:M1_NEW_MERCHANTS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-regional-shops.mjs',filename:'m1-regional-shops.mjs',items:M1_REGIONAL_SHOPS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-biome-expansion.mjs',filename:'m1-biome-expansion.mjs',items:M1_BIOME_EXPANSION},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-category-arcades.mjs',filename:'m1-category-arcades.mjs',items:M1_CATEGORY_ARCADES},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-market-fronts.mjs',filename:'m1-market-fronts.mjs',items:M1_MARKET_FRONTS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-courtyard-shops.mjs',filename:'m1-courtyard-shops.mjs',items:M1_COURTYARD_SHOPS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-u-court-shops.mjs',filename:'m1-u-court-shops.mjs',items:M1_U_COURT_SHOPS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-lateral-markets.mjs',filename:'m1-lateral-markets.mjs',items:M1_LATERAL_MARKETS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-profiled-arcade-shops.mjs',filename:'m1-profiled-arcade-shops.mjs',items:M1_PROFILED_ARCADE_SHOPS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-arcaded-front-shops.mjs',filename:'m1-arcaded-front-shops.mjs',items:M1_ARCADED_FRONT_SHOPS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-tower-court-shops.mjs',filename:'m1-tower-court-shops.mjs',items:M1_TOWER_COURT_SHOPS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-sculpted-markets.mjs',filename:'m1-sculpted-markets.mjs',items:M1_SCULPTED_MARKETS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-signature-skyline.mjs',filename:'m1-signature-skyline.mjs',items:M1_SIGNATURE_SKYLINE_SHOPS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-landmark-shops.mjs',filename:'m1-landmark-shops.mjs',items:M1_LANDMARK_SHOPS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-distinct-wing-shops.mjs',filename:'m1-distinct-wing-shops.mjs',items:M1_DISTINCT_WING_SHOPS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-five-court-shops.mjs',filename:'m1-five-court-shops.mjs',items:M1_FIVE_COURT_SHOPS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-twin-side-terraces.mjs',filename:'m1-twin-side-terraces.mjs',items:M1_TWIN_SIDE_TERRACE_SHOPS},
 {label:'protected128',path:'src/building-pool/roadmap-2a/m1-stepped-court-shops.mjs',filename:'m1-stepped-court-shops.mjs',items:M1_STEPPED_COURT_SHOPS},
 {label:'wave01',path:'src/building-pool/roadmap-2a/roadmap-a-wave01.mjs',filename:'roadmap-a-wave01.mjs',items:ROADMAP_A_WAVE01_SHOPS},
 {label:'wave02',path:'src/building-pool/roadmap-2a/roadmap-a-wave02.mjs',filename:'roadmap-a-wave02.mjs',items:ROADMAP_A_WAVE02_SHOPS},
]);
const sha=value=>createHash('sha256').update(value).digest('hex');
const face=(p,b)=>{
 if(p.z===0)return 'local-negative-z';
 if(p.z===b.extents.z-1)return 'local-positive-z';
 if(p.x===0)return 'local-negative-x';
 if(p.x===b.extents.x-1)return 'local-positive-x';
 return 'requires-settlement-orientation-validation';
};
function digestGeometry(b){
 const canonical=b.voxels.map(v=>[v.x,v.y,v.z,v.kind,v.material,v.physicalVariant??null])
 .sort((a,c)=>a[1]-c[1]||a[2]-c[2]||a[0]-c[0]||String(a[3]).localeCompare(String(c[3])));
 return sha(JSON.stringify(canonical));
}
function record(b,source,sourceSha){
 let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity,minZ=Infinity,maxZ=-Infinity;
 const floors=new Set(),kinds={},assetRefs=new Set();
 for(const v of b.voxels){
  minX=Math.min(minX,v.x);maxX=Math.max(maxX,v.x);
  minY=Math.min(minY,v.y);maxY=Math.max(maxY,v.y);
  minZ=Math.min(minZ,v.z);maxZ=Math.max(maxZ,v.z);
  if(v.kind==='floor'&&v.y===1)floors.add(v.x+','+v.z);
  kinds[v.kind]=(kinds[v.kind]??0)+1;
  assetRefs.add(v.material);
 }
 const entrances=b.openings.filter(o=>o.type==='entrance').map(o=>({
  x:o.x,y:o.y,z:o.z,clearanceYCells:o.clearHeightCells??null,
  localFacing:face(o,b),doorSymbol:o.doorSymbol??null,
  actualPlayerDoorCollisionUnverified:true
 }));
 const sourcesOnly=source.label!=='protected128';
 return {
  id:b.id,category:b.category,biome:b.biome,size:b.size,variant:b.variation,
  proposedTitle:b.title,
  sourceProvenance:{sourceBranchInputHead:INPUT_SOURCE_HEAD,
   file:source.path,fileSHA256:sourceSha,geometrySHA256:digestGeometry(b),
   cohort:source.label,historical128Preserved:!sourcesOnly},
  plot:{
   localOccupiedBounds:{minX,maxX,minZ,maxZ},
   reservedEnvelopeCells:{width:b.extents.x,depth:b.extents.z,height:b.extents.y},
   groundedFloorCells:floors.size,
   minimumSetbacksPendingSettlementDesign:true,
   noAssumedTerrainSlopeTolerance:true,
   flatPreparedFoundationExpected:true,
   localRoadConnectionCandidate:entrances[0]?.localFacing??null
  },
  occupiedGeometry:{
   voxelCount:b.voxels.length,kindCounts:kinds,
   actualOccupiedHeight:{minY,maxY},
   physicalAssetSymbols:[...assetRefs].sort(),
   geometryIsSourceCellsNotInstalledPackMeshes:true
  },
  publicEntrances:entrances,
  interiorRooms:b.rooms.map(r=>({name:r.name,bounds:r.bounds,access:r.access??null,uses:r.uses??[]})),
  routeDescriptors:b.circulation,
  windows:b.openings.filter(o=>o.type==='window').map(o=>({x:o.x,y:o.y,z:o.z,material:o.material})),
  fixtureCells:b.voxels.filter(v=>v.kind==='fixture').map(v=>({x:v.x,y:v.y,z:v.z,material:v.material,role:v.role??null})),
  roof:{sourceRoofCells:kinds.roof??0,profile:b.roof??null,
   installedBearingLoadAndClimateUnverified:true},
  physicalDependencies:b.unresolvedDependencies,
  performanceBudgetEstimate:{
   sourceOccupiedVoxelCount:b.voxels.length,
   uniqueReferencedMaterials:assetRefs.size,
   actualRuntimeGpuCostMeasured:false,
   actualCollisionBudgetMeasured:false
  },
  screenshotEvidence:{
   historicalReferenceArtifactId:sourcesOnly?null:14664251545,
   expectedNewGalleryRun: sourcesOnly?'Roadmap A 114-image three-size Chromium test':null,
   actualSourceSpecificScreenshotAccepted:!sourcesOnly,
   finalInstalledPackMeshScreenshotsAccepted:false
  },
  acceptance:{
   sourceCandidateOnly:true,physicalIPhoneAccepted:false,
   creatorVisualAccepted:false,productionRegistered:false,saveSchema1Changed:false,
   liveWorldPlaced:false,settlementGeneratorReadyWithoutPhysicalReview:false
  }
 };
}
export function buildRoadmapAProvisionalSettlementManifest(){
 const records=[],seen=new Set();
 for(const source of COHORTS){
  const sourceBytes=readFileSync(new URL('./'+source.filename,import.meta.url));
  const sourceSha=sha(sourceBytes);
  for(const b of source.items){
   if(seen.has(b.id))throw Error('Overlapping accepted source ID: '+b.id);
   seen.add(b.id);
   records.push(record(b,source,sourceSha));
  }
 }
 records.sort((a,b)=>a.id.localeCompare(b.id));
 const planned=plannedSlots().map(s=>s.id);
 const missing=planned.filter(id=>!seen.has(id));
 return {schema:'mythwrought.roadmap-a.a5-settlement-handoff-provisional.v1',
  sourceInputHead:INPUT_SOURCE_HEAD,
  historicSourceCount:128,wave01Provisional:10,wave02Provisional:9,
  totalAuthoredSourceCandidates:records.length,canonicalTarget:420,
  missingCanonicalSourceIDs:missing,
  sourceProvenanceOnly:true,autoWorldRegistrationAllowed:false,
  villageTownCityGenerationImplemented:false,saveSchemaModified:false,
  note:'A5 is not a production certificate; roads, plots, slopes, runtime placement and physical art require later integration.',
  blueprints:records};
}
