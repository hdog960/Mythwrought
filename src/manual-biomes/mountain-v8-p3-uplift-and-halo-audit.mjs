// Mountain V8 detached ORIGINAL-source acceptance audit against immutable
// Desert Phase 3 main. No world writes, runtime dispatch, ID registration,
// GPU buffer builds or save calls; this is not a V8 integration path.
// Cross-check actual original VoxelWorld legacy terrain with the separate
// original M7 P3 surface halo. Those two generators must NEVER be aliased.
import {BLOCK,CHUNK_SIZE,chunkCoord,terrainHeight,worldKey}
  from '../voxel.mjs';
import {WORLD_MAX_Y,sectionForY,verticalEditSections,depthMeshKey}
  from '../depth.mjs';
import {v6BiomeAt} from './v6-balanced-biomes.mjs';
import {surveyMountainV8Column} from './mountain-v8-source-adapter.mjs';
import {planMountainV8PhysicalColumn}
  from './mountain-v8-physical-column.mjs';
import {editAffectedChunks} from '../chunks.mjs';
import {M7_ENVIRONMENT_GENERATOR} from '../environment-ground.mjs';

const f=Object.freeze,valid=Number.isSafeInteger;
export const V8_P3_SOURCE_HEAD='db4bbcc32156e5df311f733bcaa53d559c17313b';
export const V8_P3_HALO_SOURCE_BLOB='5c40d34eadf683613f6746e456e885087d168627';
const refuse=(reason,onVeto)=>{onVeto?.(f({reason}));return null;};
const distinct=arr=>new Set(arr).size===arr.length;
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const key=c=>c.cx+','+c.cz;
const inspectCoordinates=(a,x,z)=>a.every(c=>
  valid(c.cx)&&valid(c.cz)&&
  Math.abs(c.cx-chunkCoord(x))<=1&&Math.abs(c.cz-chunkCoord(z))<=1);

/** Source-only V8 raised terrain write plan, NOT live M7 terrain.
 * originalWorld must be a fresh genuine main VoxelWorld, not an M7 subclass.
 * A future owner must prove its identity; the native test imports the exact
 * P3 original class in a separately pinned checkout.
 */
export function auditMountainV8P3Uplift(proposal,{originalWorld,sourceMainHead,
  originalVoxelReaderIdentityVerified=false,onVeto}={}){
  if(!proposal||proposal.safeToIntegrate!==false||
     proposal.generatorIdentityRequired!=='v8-new-opt-in'||
     proposal.sourceProvenance?.originalGroundIntact!==true||
     proposal.sourceProvenance?.protectedEnvelopeClear!==true||
     sourceMainHead!==V8_P3_SOURCE_HEAD||
     originalVoxelReaderIdentityVerified!==true||
     !valid(proposal.x)||!valid(proposal.z)||!valid(proposal.seed)||
     !originalWorld||originalWorld.seed!==proposal.seed||
     typeof originalWorld.get!=='function'||
     typeof originalWorld.naturalAndLandmarkBlock!=='function'||
     !(originalWorld.edits instanceof Map)||
     !(originalWorld.rotations instanceof Map)||
     (onVeto!==undefined&&typeof onVeto!=='function'))
    return refuse('source-or-original-world-unverifiable',onVeto);
  const {x,z,seed}=proposal;
  // Old actual source, cave reader, real terrainHeight and V6 biome;
  // NEVER invoke current M7 _columnPlan as though it were a fresh V8 world.
  const real=surveyMountainV8Column({x,z,seed,worldMaxY:WORLD_MAX_Y,
    biomeAt:v6BiomeAt,heightAt:terrainHeight,
    readBlock:(a,b,c)=>originalWorld.naturalAndLandmarkBlock(a,b,c),
    ids:BLOCK,protectedAt:(a,b,c)=>originalWorld.edits.has(worldKey(a,b,c))});
  if(!real||!same([real.x,real.z,real.seed,real.legacyTop,real.top,real.cap,
      real.generatorIdentityRequired],
      [x,z,seed,proposal.legacyTop,proposal.top,proposal.cap,
        'v8-new-opt-in'])||
     !same(real.sourceProvenance,proposal.sourceProvenance))
    return refuse('exact-original-legacy-proposal-mismatch',onVeto);
  const physical=planMountainV8PhysicalColumn(real,{worldMaxY:WORLD_MAX_Y,
    ids:BLOCK,readOriginalBlock:(a,b,c)=>originalWorld.get(a,b,c),
    protectedAt:(a,b,c)=>originalWorld.edits.has(worldKey(a,b,c))});
  if(!physical||physical.estimatedCells>18||
     physical.safeToIntegrate!==false||
     physical.requiresApprovedV8BlockMapping!==true)
    return refuse('cave-player-edit-or-physical-uplift-veto',onVeto);
  const horizontal=new Map(),sections=new Set(),keys=new Set();
  for(const cell of physical.writes){
    if(!valid(cell.y)||cell.y<real.legacyTop||cell.y>WORLD_MAX_Y||
       sectionForY(cell.y)!==0)
      return refuse('invalid-surface-section-uplift',onVeto);
    const edits=editAffectedChunks(cell.x,cell.z);
    if(!inspectCoordinates(edits,cell.x,cell.z)||
       !distinct(edits.map(key)))
      return refuse('invalid-original-geometry-refresh',onVeto);
    const vertical=verticalEditSections(cell.y);
    if(!same(vertical,[0]))
      return refuse('new-v8-uplift-escaped-original-surface',onVeto);
    for(const pos of edits){
      horizontal.set(key(pos),pos);
      for(const section of vertical){
        sections.add(section);keys.add(depthMeshKey(pos.cx,pos.cz,section));
      }
    }
  }
  if(horizontal.size<1||horizontal.size>3||sections.size!==1||
     !sections.has(0)||CHUNK_SIZE!==16)
    return refuse('unbounded-original-geometry-refresh',onVeto);
  return f({seed,x,z,sourceMainHead,
    originalLegacyTop:real.legacyTop,proposedV8Top:real.top,
    originalSourceUpliftChecked:true,sourcePhysicalCells:physical.estimatedCells,
    originalPhysicalDescriptorMaterials:f(physical.writes.map(c=>c.material)),
    geometryChunkCoordinates:f([...horizontal.values()].map(c=>f({...c}))),
    geometryMeshKeys:f([...keys]),sections:f([...sections]),
    oldM7ColorHaloClaimed:false,
    V8ColorAndGPUInvalidationOwnerApprovalRequired:true,
    exactP3CallbackOriginProvedByNativeCheckoutOnly:true,
    actualV8GpuBytes:null,newV8MaterialIdsRegistered:0,
    originalWorldWrites:0,originalWorldSaveRewrites:0,
    runtimeActivationAuthorized:false,safeToIntegrate:false});
}

/** Pure inspection of the REAL currently installed M7 P3 invalidation.
 * p3Halo is imported from the separate exact current-main checkout by
 * tests; the string blob alone is not callback-authentication.
 */
export function auditMountainV8ExistingP3EditHalo(originalM7World,x,y,z,{
  sourceMainHead,originalHaloBlob,currentMainP3Halo,onVeto}={}){
  if(![x,y,z].every(valid)||sourceMainHead!==V8_P3_SOURCE_HEAD||
     originalHaloBlob!==V8_P3_HALO_SOURCE_BLOB||
     !originalM7World||originalM7World.seed===undefined||
     originalM7World.generationProfile?.generator!==M7_ENVIRONMENT_GENERATOR&&
       originalM7World.base?.generationProfile?.generator!==M7_ENVIRONMENT_GENERATOR||
     typeof currentMainP3Halo!=='function'||
     (onVeto!==undefined&&typeof onVeto!=='function'))
    return refuse('not-current-original-m7-p3-halo',onVeto);
  let geometry,halo;
  try{
    geometry=editAffectedChunks(x,z);
    halo=currentMainP3Halo(originalM7World,x,z,y);
  }catch{return refuse('current-main-p3-halo-error',onVeto);}
  if(!Array.isArray(halo)||halo.length<geometry.length||halo.length>5||
     !distinct(halo.map(key))||!inspectCoordinates(halo,x,z)||
     geometry.some(c=>!halo.some(h=>h.cx===c.cx&&h.cz===c.cz)))
    return refuse('changed-original-m7-dirty-chunk-contract',onVeto);
  const sections=verticalEditSections(y),meshKeys=[];
  for(const pos of halo)for(const section of sections)
    meshKeys.push(depthMeshKey(pos.cx,pos.cz,section));
  if(!distinct(meshKeys))
    return refuse('repeated-original-section-mesh-key',onVeto);
  return f({seed:originalM7World.seed,sourceMainHead,x,y,z,
    geometryOnlyChunks:f(geometry.map(c=>f({...c}))),
    actualM7P3Chunks:f(halo.map(c=>f({...c}))),
    extraM7OnlyColorHaloChunks:f(halo.filter(c=>
      !geometry.some(g=>key(g)===key(c))).map(c=>f({...c}))),
    verticalSections:f([...sections]),
    originalSectionMeshKeys:f(meshKeys),
    originalM7Only:true,newV8GeneratorHaloTested:false,
    noChunkUploadPerformed:true,saveUnchangedByAudit:true,
    currentMainP3RenderActualGpuBytesMeasured:false,
    runtimeActivationAuthorized:false,safeToIntegrate:false});
}
