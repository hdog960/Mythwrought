// Detached V8 ORIGINAL-SOURCE handoff only. No numeric material IDs are
// assigned or reserved here, and nothing may be dispatched into V7 gameplay.
// This is a fail-closed proof of proposed material demand and unresolved ABI
// work, NOT a registration plan or a gameplay collision/raycast implementation.
import {BLOCK} from '../voxel.mjs';
import {PACK2_LIVE_IDS} from '../pack2-integration.mjs';
import {BIOME130_REGISTERED_IDS} from '../biome130-registry.mjs';
import {ENVIRONMENT_GROUND} from '../environment-ground.mjs';
import {FULL_CUBE,validateShape} from '../voxel-shape-interactions.mjs';
import {MOUNTAIN_V8_PLANT_PATTERNS}
  from './mountain-v8-vegetation-cells.mjs';
import {MOUNTAIN_V8_DESCRIPTOR_MATERIALS,MOUNTAIN_V8_PROXY_FACE_BYTES}
  from './mountain-v8-physical-descriptor-budget.mjs';

const valid=n=>Number.isSafeInteger(n);
const terrain=Object.freeze(['stone','dirt','snow','alpine-grass',
  'slate','gneiss','scree']);
const flora=Object.freeze(['flower','flower-petal','heather','heather-tip',
  'conifer-trunk','conifer-needles']);
const sum=map=>Object.values(map).reduce((a,b)=>a+b,0);
const sameKeys=(map,names)=>!!map&&
  Object.keys(map).sort().join('|')===[...names].sort().join('|')&&
  names.every(name=>valid(map[name])&&map[name]>=0);
const freeze=(value)=>Object.freeze(value);
export const MOUNTAIN_V8_HANDOFF_REQUIREMENTS=freeze([
  'creator-approved distinct V8 generator identity and opt-in routing',
  'separately authorized V8 material/block identity registry',
  'genuine source-preserving original V7 save/edit precedence',
  'exact solid terrain mesh, collision, selection, raycast and mining parity',
  'approved original authored geometry and collision policy for all flora',
  'WebGL2 GPU upload/vertex/runtime budgets on real iPhone landscape',
  'installed Home Screen PWA visual, collision and save acceptance'
]);
const kindOf=material=>terrain.includes(material)?'solid-cube-terrain':
  flora.includes(material)?'unapproved-physical-flora':null;
export function auditMountainV8IntegrationHandoff(reports){
  if(!Array.isArray(reports)||reports.length<1||reports.length>4||
    !validateShape(FULL_CUBE)||MOUNTAIN_V8_PROXY_FACE_BYTES!==216||
    MOUNTAIN_V8_DESCRIPTOR_MATERIALS.length!==13||
    !sameKeys(Object.fromEntries(MOUNTAIN_V8_DESCRIPTOR_MATERIALS.map(k=>[k,0])),
      [...terrain,...flora]))return null;

  // Authored plant descriptor patterns are the single exact source of cell
  // material names; matching a material set alone is not enough for geometry.
  const authoredFlora=new Set(Object.values(MOUNTAIN_V8_PLANT_PATTERNS)
    .flat().map(cell=>cell[3]));
  if([...authoredFlora].sort().join('|')!==[...flora].sort().join('|'))return null;

  const used=new Set(),totals=Object.fromEntries(
    MOUNTAIN_V8_DESCRIPTOR_MATERIALS.map(name=>[name,0]));
  const counters={tiles:0,accepted:0,rejected:0,seamRejected:0,
    terrainRejected:0,terrainCells:0,plantCells:0,plantSites:0,
    originalV8SeamFaces:0,fullCubeProxyFaces:0,
    fullCubeProxyBytes:0,fullCubeNaiveBytes:0,internalPairs:0};
  for(const row of reports){
    if(!row||![row.seed,row.tileX,row.tileZ].every(valid)||
      row.seed!==(row.seed|0)||!row.stats)return null;
    const id=row.seed+':'+row.tileX+':'+row.tileZ;
    if(used.has(id))return null;
    used.add(id);
    const s=row.stats;
    if(![s.tiles,s.eligible,s.rejected,s.seamRejected,
      s.terrainRejected,s.terrainCells,s.plantCells,s.plants,
      s.seamExposedFaces,s.physicalDescriptorSites,
      s.sourceCertifiedDescriptorFaces,s.fullCubeProxyFaces,
      s.fullCubeProxyBytes,s.fullCubeNaiveBytes,s.fullCubeInternalPairs,
      s.sourceBudgetExhausted].every(valid)||
      s.tiles<1||s.tiles>64||s.eligible<0||s.rejected<0||
      s.terrainRejected<0||s.seamRejected<0||
      s.eligible+s.rejected+s.terrainRejected+s.seamRejected!==s.tiles||
      s.terrainCells>s.eligible*18||s.terrainCells<s.eligible||
      s.plants<0||s.plants>s.eligible||s.plantCells>s.plants*18||
      s.plantCells<s.plants||s.sourceBudgetExhausted!==0||
      s.physicalDescriptorSites!==s.eligible||
      s.sourceCertifiedDescriptorFaces!==s.seamExposedFaces||
      s.seamExposedFaces>8*s.eligible||
      !sameKeys(s.physicalMaterialCells,MOUNTAIN_V8_DESCRIPTOR_MATERIALS)||
      !sameKeys(s.physicalMaterialCubeFaces,MOUNTAIN_V8_DESCRIPTOR_MATERIALS)||
      sum(s.physicalMaterialCells)!==s.terrainCells+s.plantCells||
      sum(s.physicalMaterialCubeFaces)!==s.fullCubeProxyFaces||
      s.fullCubeProxyBytes!==s.fullCubeProxyFaces*216||
      s.fullCubeNaiveBytes!==(s.terrainCells+s.plantCells)*1296||
      s.fullCubeNaiveBytes<s.fullCubeProxyBytes||
      s.fullCubeNaiveBytes-s.fullCubeProxyBytes!==
        s.fullCubeInternalPairs*2*216)return null;
    for(const name of MOUNTAIN_V8_DESCRIPTOR_MATERIALS)
      totals[name]+=s.physicalMaterialCells[name];
    for(const [k,v] of Object.entries({
      tiles:s.tiles,accepted:s.eligible,rejected:s.rejected,
      seamRejected:s.seamRejected,terrainRejected:s.terrainRejected,
      terrainCells:s.terrainCells,plantCells:s.plantCells,
      plantSites:s.plants,originalV8SeamFaces:s.seamExposedFaces,
      fullCubeProxyFaces:s.fullCubeProxyFaces,
      fullCubeProxyBytes:s.fullCubeProxyBytes,
      fullCubeNaiveBytes:s.fullCubeNaiveBytes,
      internalPairs:s.fullCubeInternalPairs
    }))counters[k]+=v;
  }
  if(counters.fullCubeNaiveBytes>4*64*36*1296)return null;

  const originalIdSet=new Set([
    ...Object.values(BLOCK),...PACK2_LIVE_IDS,...BIOME130_REGISTERED_IDS,
    ...Object.values(ENVIRONMENT_GROUND),255,65535
  ]);
  if([...originalIdSet].some(id=>!valid(id)||id<0||id>65535)||
    PACK2_LIVE_IDS.length!==18||BIOME130_REGISTERED_IDS.length!==130||
    Object.values(ENVIRONMENT_GROUND).length!==11)return null;

  const materials=freeze(MOUNTAIN_V8_DESCRIPTOR_MATERIALS.map(material=>
    freeze({
      material,originalSourceCells:totals[material],
      kind:kindOf(material),
      shapeContract:terrain.includes(material)?'FULL_CUBE':
        'UNRESOLVED_AUTHORED_NONCUBE',
      sourcePatternProof:flora.includes(material),
      approvedNumericBlockId:null,
      collisionVerifiedInGame:false,raycastVerifiedInGame:false,
      miningVerifiedInGame:false,WebGL2VerifiedInGame:false
    })
  ));
  if(materials.some(m=>!m.kind))return null;
  return freeze({
    source:'genuine-original-VoxelWorld-readonly',
    sitesAudited:counters.tiles,sourceAcceptedSites:counters.accepted,
    sourceRejectedSites:counters.rejected,
    counters:freeze(counters),
    materials,terrainDescriptorKinds:terrain.length,
    floraDescriptorKinds:flora.length,
    baselineIdSources:freeze({
      legacyIds:freeze([...Object.values(BLOCK)].sort((a,b)=>a-b)),
      pack2RegisteredCount:PACK2_LIVE_IDS.length,
      biome130RegisteredCount:BIOME130_REGISTERED_IDS.length,
      existingM7GroundIds:freeze([...Object.values(ENVIRONMENT_GROUND)]
        .sort((a,b)=>a-b)),
      knownOccupiedOrSentinelCount:originalIdSet.size,
      incompleteOtherOwnerNamespaceAudit:true
    }),
    requiredGates:MOUNTAIN_V8_HANDOFF_REQUIREMENTS,
    numericalV8IdsAssigned:0,proposedV8BlockMapping:null,
    fullCubeProxyOnly:true,measuredGPUBytes:null,
    inGameCollisionVerified:false,inGameRaycastVerified:false,
    inGameMiningVerified:false,iphonePwaAccepted:false,
    integrationReady:false,safeToIntegrate:false,
    generatorIdentityRequired:'v8-new-opt-in'
  });
}
