/** Source-only delta census: Wave08–25, 213 candidates not covered by the original all79 physical census. No variant/yaw choices or runtime writes. */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {buildRoadmapA420ProvisionalSettlementManifest} from './roadmap-a-a5-420-provisional.mjs';
import {MANUAL_FIVE_PACK_CATALOG,manualFivePackVariants,resolveManualFivePackAsset} from '../../builder-assets/manual-five-pack.mjs';
import {PACK5_BUILDER_CATALOG} from '../../pack5-integration/catalog.mjs';
import {ROADMAP_A_WAVE08_SHOPS} from './roadmap-a-wave08.mjs';
import {ROADMAP_A_WAVE09_SHOPS} from './roadmap-a-wave09.mjs';
import {ROADMAP_A_WAVE10_SHOPS} from './roadmap-a-wave10.mjs';
import {ROADMAP_A_WAVE11_SHOPS} from './roadmap-a-wave11.mjs';
import {ROADMAP_A_WAVE12_SHOPS} from './roadmap-a-wave12.mjs';
import {ROADMAP_A_WAVE13_SHOPS} from './roadmap-a-wave13.mjs';
import {ROADMAP_A_WAVE14_SHOPS} from './roadmap-a-wave14.mjs';
import {ROADMAP_A_WAVE15_SHOPS} from './roadmap-a-wave15.mjs';
import {ROADMAP_A_WAVE16_SHOPS} from './roadmap-a-wave16.mjs';
import {ROADMAP_A_WAVE17_SHOPS} from './roadmap-a-wave17.mjs';
import {ROADMAP_A_WAVE18_SHOPS} from './roadmap-a-wave18.mjs';
import {ROADMAP_A_WAVE19_SHOPS} from './roadmap-a-wave19.mjs';
import {ROADMAP_A_WAVE20_SHOPS} from './roadmap-a-wave20.mjs';
import {ROADMAP_A_WAVE21_SHOPS} from './roadmap-a-wave21.mjs';
import {ROADMAP_A_WAVE22_SHOPS} from './roadmap-a-wave22.mjs';
import {ROADMAP_A_WAVE23_SHOPS} from './roadmap-a-wave23.mjs';
import {ROADMAP_A_WAVE24_SHOPS} from './roadmap-a-wave24.mjs';
import {ROADMAP_A_WAVE25_SHOPS} from './roadmap-a-wave25.mjs';
const cohorts=[
 ['wave08',ROADMAP_A_WAVE08_SHOPS],
 ['wave09',ROADMAP_A_WAVE09_SHOPS],
 ['wave10',ROADMAP_A_WAVE10_SHOPS],
 ['wave11',ROADMAP_A_WAVE11_SHOPS],
 ['wave12',ROADMAP_A_WAVE12_SHOPS],
 ['wave13',ROADMAP_A_WAVE13_SHOPS],
 ['wave14',ROADMAP_A_WAVE14_SHOPS],
 ['wave15',ROADMAP_A_WAVE15_SHOPS],
 ['wave16',ROADMAP_A_WAVE16_SHOPS],
 ['wave17',ROADMAP_A_WAVE17_SHOPS],
 ['wave18',ROADMAP_A_WAVE18_SHOPS],
 ['wave19',ROADMAP_A_WAVE19_SHOPS],
 ['wave20',ROADMAP_A_WAVE20_SHOPS],
 ['wave21',ROADMAP_A_WAVE21_SHOPS],
 ['wave22',ROADMAP_A_WAVE22_SHOPS],
 ['wave23',ROADMAP_A_WAVE23_SHOPS],
 ['wave24',ROADMAP_A_WAVE24_SHOPS],
 ['wave25',ROADMAP_A_WAVE25_SHOPS]
];
const sha=x=>createHash('sha256').update(x).digest('hex');
const pos=(x,y,z)=>x+','+y+','+z;
const requireThat=(ok,msg)=>{if(!ok)throw Error('Roadmap A physical delta HOLD: '+msg);};
const bump=(o,k,n=1)=>o[k]=(o[k]??0)+n;
const roster=new Set(MANUAL_FIVE_PACK_CATALOG.map(x=>x.symbol));
const pack5=new Map(PACK5_BUILDER_CATALOG.map(x=>[x.symbolicId,x]));
const cache=new Map();
function options(symbol,variant){
 const key=symbol+':'+variant;
 if(!cache.has(key))cache.set(key,[0,1,2,3].map(yaw=>resolveManualFivePackAsset(symbol,{variant,orientation:yaw})));
 return cache.get(key);
}
function geometrySHA(bp){
 const points=bp.voxels.map(v=>[v.x,v.y,v.z,v.kind,v.material,v.physicalVariant??null])
  .sort((a,b)=>a[1]-b[1]||a[2]-b[2]||a[0]-b[0]||String(a[3]).localeCompare(String(b[3])));
 return sha(JSON.stringify(points));
}
export function verifyFinalSourceLedger(manifest){
 requireThat(manifest?.blueprints?.length===420&&manifest.remainingCanonicalIDs?.length===0&&manifest.sourceCandidates===420,'420 source quota required');
 requireThat(new Set(manifest.blueprints.map(x=>x.id)).size===420,'duplicate canonical IDs');
 requireThat(manifest.producerPhysicalMeshAcceptance===false&&manifest.productionGameRegistration===false&&manifest.schema1SaveMutation===false&&manifest.villageTownCityGenerationImplemented===false,'source-only boundary');
 for(const c of ['general-store','pet-shop','magic-shop','potion-shop','bakery','bank'])
  requireThat(manifest.blueprints.filter(b=>b.category===c).length===(c==='bank'?45:75),'category quota '+c);
 const digest=sha(JSON.stringify(manifest,null,2)+'\n');
 requireThat(digest==='4a1d2896ef712149790ce88edb0ea49fc89d7fcc50f7b060d275893d0d3d5344','final authenticated source ledger digest drift');
 return digest;
}
function supportKind(v){return !v?'source-air':v.kind==='wall'&&v.material==='pack5:079'?'uncertified-plaster-wall':v.kind+':'+v.material;}
const plaster=pack5.get('pack5:079');
requireThat(plaster?.variants.length===2,'real plaster variants required');
const plasterOptions=plaster.variants.map(v=>options(plaster.symbolicId,v));
const plasterOffsets=plasterOptions[0].map((a,yaw)=>{
 const b=plasterOptions[1][yaw];
 requireThat(a.supportPolicy==='wall'&&b.supportPolicy==='wall'&&a.supportOffsets.length===1&&JSON.stringify(a.supportOffsets)===JSON.stringify(b.supportOffsets),'plaster support producer drift');
 return a.supportOffsets[0];
});
export function auditDeltaBuilding(bp,record,fileHash,cohort){
 requireThat(bp.id===record?.id&&record.sourceProvenance?.cohort===cohort&&record.sourceProvenance.file==='src/building-pool/roadmap-2a/roadmap-a-'+cohort+'.mjs'&&record.sourceProvenance.fileSHA256===fileHash&&record.sourceProvenance.geometrySHA256===geometrySHA(bp)&&record.occupiedGeometry.voxelCount===bp.voxels.length,'source provenance mismatch '+bp.id);
 requireThat(record.acceptance.sourceCandidateOnly===true&&record.acceptance.productionRegistered===false&&record.acceptance.physicalIPhoneAccepted===false,'record not provisional '+bp.id);
 const cells=new Map(bp.voxels.map(v=>[pos(v.x,v.y,v.z),v]));
 requireThat(cells.size===bp.voxels.length,'duplicate source cell '+bp.id);
 const risks={sourceCells:bp.voxels.length,pack5MissingVariant:0,plasterWholeWall:0,plasterInternalPier:0,brickRoof:0,thinTileFloor:0,roofBase:0,roofBaseWithoutImmediateWall:0,explicitPack5Cells:0,symbolicDoors:bp.openings.filter(o=>o.doorSymbol).length};
 const materials={},missingVariants={},ambiguousFamilies={},roofBelow={},tileBelow={},fixtureOptions=[],wallSupport=[{},{},{},{}],familyCounts=new Map();
 for(const v of bp.voxels){
  requireThat(roster.has(v.material),'unknown source family '+bp.id+' '+v.material);
  bump(materials,v.material);
  if(!familyCounts.has(v.material))familyCounts.set(v.material,manualFivePackVariants(v.material).length);
  if(familyCounts.get(v.material)>1)bump(ambiguousFamilies,v.material);
  const below=cells.get(pos(v.x,v.y-1,v.z));
  if(v.kind==='roof'&&below?.kind!=='roof'){
   risks.roofBase++;if(below?.kind!=='wall')risks.roofBaseWithoutImmediateWall++;
   bump(roofBelow,supportKind(below));
  }
  if(v.kind==='wall'&&v.material==='pack5:079'){
   risks.plasterWholeWall++;if(v.architecturalRole==='floor-founded-internal-roof-pier')risks.plasterInternalPier++;
   for(let yaw=0;yaw<4;yaw++){const [dx,dy,dz]=plasterOffsets[yaw];bump(wallSupport[yaw],supportKind(cells.get(pos(v.x+dx,v.y+dy,v.z+dz))));}
  }
  if(v.kind==='roof'&&v.material==='pack5:080')risks.brickRoof++;
  if(v.kind==='floor'&&v.material==='pack5:081'){risks.thinTileFloor++;bump(tileBelow,supportKind(below));}
  if(!v.material.startsWith('pack5:'))continue;
  const family=pack5.get(v.material);requireThat(family,'missing real Pack5 producer '+v.material);
  if(!v.physicalVariant){risks.pack5MissingVariant++;bump(missingVariants,v.material);continue;}
  requireThat(family.variants.includes(v.physicalVariant),'invalid authored variant '+bp.id+' '+v.material+' '+v.physicalVariant);
  risks.explicitPack5Cells++;
  // Every yaw is a hypothetical producer option, not a chosen placement. An occupied source neighbor is a conflict candidate, not a certified collision.
  fixtureOptions.push({at:[v.x,v.y,v.z],kind:v.kind,symbol:v.material,authoredVariant:v.physicalVariant,orientationAssigned:false,
   yaws:options(v.material,v.physicalVariant).map((a,yaw)=>({yaw,visibleBoxes:a.visibleBoxes.length,collisionBoxes:a.collisionBoxes.length,selectionBoxes:a.selectionBoxes.length,supportPolicy:a.supportPolicy,
    occupiedOffsets:a.occupiedOffsets,supportOffsets:a.supportOffsets,
    occupiedNeighborSourceCells:a.occupiedOffsets.filter(o=>o.some(x=>x!==0)).map(([dx,dy,dz])=>({offset:[dx,dy,dz],neighbor:supportKind(cells.get(pos(v.x+dx,v.y+dy,v.z+dz)))})),
    supportSourceCells:a.supportOffsets.map(([dx,dy,dz])=>({offset:[dx,dy,dz],neighbor:supportKind(cells.get(pos(v.x+dx,v.y+dy,v.z+dz)))}))
   }))});
 }
 for(const yaw of wallSupport)requireThat(Object.values(yaw).reduce((s,n)=>s+n,0)===risks.plasterWholeWall,'plaster census coverage '+bp.id);
 requireThat(Object.values(roofBelow).reduce((s,n)=>s+n,0)===risks.roofBase,'roof census coverage '+bp.id);
 requireThat(Object.values(tileBelow).reduce((s,n)=>s+n,0)===risks.thinTileFloor,'tile census coverage '+bp.id);
 requireThat(Object.values(missingVariants).reduce((s,n)=>s+n,0)===risks.pack5MissingVariant,'variant census coverage '+bp.id);
 return {id:bp.id,cohort,category:bp.category,biome:bp.biome,sourceGeometrySHA256:record.sourceProvenance.geometrySHA256,sourceFileSHA256:fileHash,risks,materials,missingVariants,ambiguousFamilies,roofBelow,tileBelow,
  plasterHypotheticalYawSupport:wallSupport.map((categories,yaw)=>({yaw,offset:plasterOffsets[yaw],categories})),fixtureOptions,
  exceeds4096IfOneCellOneInstance:risks.sourceCells>4096,sourceCubeProxyGalleryNotYetAuthenticated:true,
  variantOrYawAutoSelected:false,structuralBearingCertified:false,installedCollisionCertified:false,installedMeshCertified:false,worldPlacementAuthorized:false};
}
export function auditRoadmapA213PhysicalDelta(){
 const manifest=buildRoadmapA420ProvisionalSettlementManifest(),ledgerSHA256=verifyFinalSourceLedger(manifest),byId=new Map(manifest.blueprints.map(b=>[b.id,b]));
 const rows=[],totals={},byCohort={},usedPack5=new Set();
 for(const [cohort,blueprints] of cohorts){
  requireThat(blueprints.length===(cohort==='wave25'?9:12),'cohort count '+cohort);
  const fileHash=sha(readFileSync(new URL('./roadmap-a-'+cohort+'.mjs',import.meta.url)));
  for(const bp of blueprints){
   const row=auditDeltaBuilding(bp,byId.get(bp.id),fileHash,cohort);rows.push(row);
   for(const [k,n] of Object.entries(row.risks))bump(totals,k,n);
   bump(byCohort,cohort);for(const symbol of Object.keys(row.materials))if(symbol.startsWith('pack5:'))usedPack5.add(symbol);
  }
 }
 requireThat(rows.length===213&&new Set(rows.map(x=>x.id)).size===213,'delta coverage');
 const expected=manifest.blueprints.filter(x=>/^wave(?:0[89]|1[0-9]|2[0-5])$/.test(x.sourceProvenance.cohort)).map(x=>x.id).sort();
 requireThat(JSON.stringify(expected)===JSON.stringify(rows.map(x=>x.id).sort()),'delta canonical mismatch');
 const producerOptions=[...usedPack5].sort().map(symbol=>({symbol,selectedForBuilding:false,variants:pack5.get(symbol).variants.map(variant=>({variant,yaws:options(symbol,variant).map(a=>({yaw:a.orientation,visibleBoxes:a.visibleBoxes.length,collisionBoxes:a.collisionBoxes.length,selectionBoxes:a.selectionBoxes.length,occupiedOffsets:a.occupiedOffsets,supportOffsets:a.supportOffsets,supportPolicy:a.supportPolicy}))}))}));
 return {schema:'mythwrought.roadmap-a.213-physical-delta-hold.v1',ledgerSHA256,sourceCandidates:420,deltaCandidates:213,priorHistorical:128,priorAuditedWaveCandidates:79,byCohort,totals,producerOptions,
  rows:rows.sort((a,b)=>b.risks.pack5MissingVariant-a.risks.pack5MissingVariant||b.risks.plasterInternalPier-a.risks.plasterInternalPier||a.id.localeCompare(b.id)),
  sourceOnly:true,variantsAutomaticallyAssigned:false,physicalPackAccepted:false,structuralBearingCertified:false,realGameCollisionCertified:false,realGpuMeasured:false,creatorAccepted:false,iphoneAccepted:false,productionRegistered:false,worldPlacementAuthorized:false};
}
