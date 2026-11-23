// Detached Mountain V8 physical-ownership crosscheck of live original
// biome130 mountain and original V7 environment terrain. No aliasing, IDs,
// live gameplay hooks, save writes or implied shape/visual compatibility.
import {biome130Block,isBiome130BlockId} from '../biome130-registry.mjs';
import {ENVIRONMENT_GROUND,environmentGround} from '../environment-ground.mjs';
import {validateShape,FULL_CUBE} from '../voxel-shape-interactions.mjs';
import {MOUNTAIN_V8_DESCRIPTOR_MATERIALS}
  from './mountain-v8-physical-descriptor-budget.mjs';
import {MOUNTAIN_V8_PLANT_PATTERNS}
  from './mountain-v8-vegetation-cells.mjs';
import {auditMountainV8KnownRegistryOwners}
  from './mountain-v8-registry-ownership-audit.mjs';

const f=Object.freeze,arr=(first,last)=>Array.from({length:last-first+1},(_,i)=>first+i);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const sourceMaterials=['stone','dirt','snow','alpine-grass',
  'slate','gneiss','scree','flower','flower-petal','heather','heather-tip',
  'conifer-trunk','conifer-needles'];
/** This reports existing owner shape metadata; it does NOT suggest mapping
 * a new V8 descriptor onto any pre-existing numbered family.
 */
export function auditMountainV8OriginalMountainShapeOwners(){
  const census=auditMountainV8KnownRegistryOwners();
  if(!same([...MOUNTAIN_V8_DESCRIPTOR_MATERIALS],sourceMaterials)||
     census.knownOccupiedReservedOrSentinelCount!==258||
     !validateShape(FULL_CUBE))throw Error('Original V8 descriptor/registry contract changed');
  const ids=arr(301,315);
  const existing=ids.map(id=>{
    if(!isBiome130BlockId(id))throw Error('Missing original mountain biome130 owner '+id);
    const shape=biome130Block(id);
    if(shape.blockId!==id||shape.source!=='auto:12-biome130'||
       shape.ordinal!==id-255||shape.solid!==true||
       !validateShape({boxes:shape.boxes}))
      throw Error('Original mountain biome130 source definition changed');
    return f({id,symbol:shape.symbol,name:shape.name,
      originalBoxes:shape.boxes.length,
      exactSingleFullCube:same(shape.boxes,FULL_CUBE.boxes),
      sourceOwned:true,allocatable:false});
  });
  const named=[['slate',400],['scree',401],['gneiss',402]].map(([name,id])=>{
    if(ENVIRONMENT_GROUND[name]!==id||!environmentGround(id))
      throw Error('Original V7 terrain mapping changed');
    return f({name,id,owner:'original-V7-environment',
      sourceOwned:true,allocatable:false,v8MaterialAliasApproved:false});
  });
  const flora=Object.entries(MOUNTAIN_V8_PLANT_PATTERNS).map(([name,cells])=>
    f({name,sourceCellCount:cells.length,
      sourceMaterials:f([...new Set(cells.map(c=>c[3]))].sort()),
      livePhysicsApproved:false,sourcePatternOnly:true}));
  if(!same(flora.map(x=>[x.name,x.sourceCellCount]),
    [['alpine-flower',2],['low-heather',2],['dwarf-conifer',13]])||
     existing.length!==15||named.length!==3||flora.length!==3)
    throw Error('Original mountain owners or plant patterns changed');
  return f({existingMountain130:f(existing),existingV7Ground:f(named),
    originalV8FloraPatterns:f(flora),
    existingMountainIdCount:15,existingV7NamedTerrainCount:3,
    sourceDescriptorCount:sourceMaterials.length,
    distinctKnownIdsIncludingThese:258,
    aliasesApproved:f([]),newNumericIdsProposed:null,
    completeRegistryAudit:false,noncubeFloraColliderApproved:false,
    safeToIntegrate:false});
}
