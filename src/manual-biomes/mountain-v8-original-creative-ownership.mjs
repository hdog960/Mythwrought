// Mountain V8 read-only Creative G1/physical-material compatibility census.
// It does not register V8 materials or add Creative tools/eggs/UI/placements.
import {BUILD_MATERIALS,BLOCK_NAMES} from '../blocks.mjs';
import {readRegisteredSnapshot} from '../creative-integration/registry-snapshot.mjs';
import {BIOME130_REGISTERED_IDS,biome130Block} from '../biome130-registry.mjs';
import {PACK2_LIVE_IDS} from '../pack2-integration.mjs';
import {ENVIRONMENT_GROUND,environmentGround} from '../environment-ground.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../builder-assets/manual-five-pack.mjs';
import {MOUNTAIN_V8_DESCRIPTOR_MATERIALS}
  from './mountain-v8-physical-descriptor-budget.mjs';

const f=Object.freeze;
const range=(lo,hi)=>Array.from({length:hi-lo+1},(_,i)=>lo+i);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
/** Source-derived metadata snapshot only; no mutation and no V8 aliasing.
 * G1 Creative is a detached read-only facade, not a deployed V8 pathway.
 */
export function auditMountainV8OriginalCreativeOwners(){
  const snap=readRegisteredSnapshot();
  const installed=new Set(BUILD_MATERIALS);
  const rec=new Map(snap.records.map(x=>[x.id,x]));
  if(snap.abi!=='mythwrought.creative.registry-snapshot.v1'||
     snap.readOnly!==true||
     installed.size!==153||snap.records.length!==152||
     snap.excluded.length!==1||snap.excluded[0].id!==76||
     rec.size!==snap.records.length||!BIOME130_REGISTERED_IDS.every(x=>installed.has(x))||
     !PACK2_LIVE_IDS.every(x=>installed.has(x)))
    throw Error('Original G1 material membership or fluid-selection contract changed');

  // Existing 15 installed mountain shapes are G1 placeables, but with their
  // ORIGINAL non-cube selection/collision AABBs, not fabricated V8 cubes.
  const existingMountain=range(301,315).map(id=>{
    const item=rec.get(id),source=biome130Block(id);
    if(!item||item.source.producer!=='biome130'||
       !same(item.placementRules.selectionBoxes,source.boxes)||
       !same(item.placementRules.collisionBoxes,source.boxes)||
       item.placementRules.rotations.length!==4||
       !item.registered||!item.placeable)
      throw Error('Original G1 mountain physical identity changed '+id);
    return f({id,sourceSymbol:source.symbol,placeable:true,
      sourceOwner:'biome130',originalPhysicalBoxes:source.boxes.length,
      originalNonCube:true,approvedV8Alias:false});
  });

  // Naming a material in the source BLOCK_NAMES lookup is NOT proof that
  // it is present in the installed interaction/Creative BUILD_MATERIALS.
  const excludedV7Ground=['slate','scree','gneiss'].map(name=>{
    const id=ENVIRONMENT_GROUND[name];
    if(!environmentGround(id)||BLOCK_NAMES[id]!==environmentGround(id).name||
       installed.has(id)||rec.has(id))
      throw Error('Original M7 ground incorrectly imported into G1 '+name);
    return f({id,name,reason:'V7-terrain-not-installed-G1-placeable',
      approvedV8Alias:false});
  });
  // Pack5's numeric builder bridge is owned by a separate sidecar; do not
  // reinterpret its numericIds as installed VoxelWorld/Creative blocks.
  const builderOnly=MANUAL_FIVE_PACK_CATALOG.filter(r=>r.pack===5)
    .map(r=>r.numericId);
  if(builderOnly.length!==18||builderOnly.some(id=>installed.has(id)||rec.has(id)))
    throw Error('Original Pack5 sidecar ids mistaken for G1 blocks');
  if(MOUNTAIN_V8_DESCRIPTOR_MATERIALS.length!==13)
    throw Error('Original V8 material descriptor demand changed');
  return f({
    sourceCatalogRevision:snap.revision,
    installedSourceMaterialCount:installed.size,
    existingCreativeRecords:snap.records.length,
    excludedExistingFluidId:76,
    installedExistingMountain130:f(existingMountain),
    namedV7TerrainExcluded:f(excludedV7Ground),
    pack5BuilderOnlyBridgeCount:builderOnly.length,
    v8SourceDescriptorNames:f([...MOUNTAIN_V8_DESCRIPTOR_MATERIALS]),
    v8CreativePlaceablesRegistered:0,
    approvedV8Aliases:f([]),
    creativeOwnerApprovalReceived:false,
    numericV8IdRegistrationAuthorized:false,
    safeToIntegrate:false
  });
}
