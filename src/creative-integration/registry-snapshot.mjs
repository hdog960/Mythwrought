// MYTHWROUGHT Creative integration G1 — read-only registry extraction.
// Imports only currently merged production material/shape READERS.
// Not wired to src/main.mjs. No placement, input, save, PR candidate import,
// hidden global registry, asset registration or sidecar write.
import {BUILD_MATERIALS,BLOCK_NAMES} from '../blocks.mjs';
import {BLOCK} from '../voxel.mjs';
import {BIOME130_REGISTERED_IDS,biome130Block} from '../biome130-registry.mjs';
import {PACK2_LIVE_IDS,pack2ShapeOf,pack2Spec,pack2IsFluid} from '../pack2-integration.mjs';
import {sealReadOnlySnapshot} from './registry-validation.mjs';

const ROOT='src/blocks.mjs:BUILD_MATERIALS';
const CELL=Object.freeze([{dx:0,dy:0,dz:0}]);
const CUBE=Object.freeze([[0,0,0,1,1,1]]);
const CORE_IDS=()=>new Set([BLOCK.STONE,BLOCK.WOOD,BLOCK.CRYSTAL,BLOCK.LEAVES,BLOCK.DEEPSTONE]);
const CORE_NAMES=Object.freeze({
  [BLOCK.STONE]:'Stone',[BLOCK.WOOD]:'Wood',[BLOCK.CRYSTAL]:'Crystal',
  [BLOCK.LEAVES]:'Leaves',[BLOCK.DEEPSTONE]:'Deepstone'
});
function source(producer){return {producer,installedRegistry:ROOT};}
function entry({id,name,category,kind='block',producer,boxes,collisionBoxes=boxes,
  supportPolicy='none',requiresSupport=false,rotations=[0]}){
  return {id,name,category,kind,registered:true,placeable:true,scenicOnly:false,
    source:source(producer),placementRules:{requiresSupport,supportPolicy,
      footprint:CELL,selectionBoxes:boxes,collisionBoxes,rotations}};
}
const validShape=boxes=>Array.isArray(boxes)&&boxes.length>0;
function fromBiome(id){
  const a=biome130Block(id);
  if(a.blockId!==id||a.source!=='auto:12-biome130'||!validShape(a.boxes)||
     !Number.isInteger(a.rotationCount)||a.rotationCount<1||a.rotationCount>4)
    throw Error('Invalid installed biome130 physical definition '+id);
  const supportPolicy=String(a.attachment??'any');
  const requiresSupport=!['none','any'].includes(supportPolicy);
  return entry({id,name:a.name,category:'Biome materials',producer:'biome130',
    boxes:a.boxes,collisionBoxes:a.solid===true?a.boxes:[],
    supportPolicy,requiresSupport,
    rotations:Array.from({length:a.rotationCount},(_,i)=>i)});
}
function fromPack2(id){
  const meta=pack2Spec(id),shape=pack2ShapeOf(id,{});
  if(!meta||meta.id!==id||!validShape(shape?.boxes))
    throw Error('Incomplete installed Pack2 physical definition '+id);
  const fluid=pack2IsFluid(id);
  // Rotation/stateful variants require their owning overlay; expose only the
  // reliably available neutral orientation until separately audited.
  return entry({id,name:meta.name,category:fluid?'Fluids':'Pack 2 physical',
    producer:'pack2',boxes:shape.boxes,collisionBoxes:fluid?[]:shape.boxes,
    supportPolicy:'owner-validated-on-placement',requiresSupport:true,rotations:[0]});
}
// One source of inclusion authority: current merged production BUILD_MATERIALS.
// Builder catalogs and candidate ID reservations do not enter this list.
// Fail closed on unknown registered IDs instead of inventing physical geometry.
export function readRegisteredSnapshot(){
  if(!Array.isArray(BUILD_MATERIALS))throw Error('Installed material source unavailable');
  const core=CORE_IDS(),biome=new Set(BIOME130_REGISTERED_IDS),pack2=new Set(PACK2_LIVE_IDS);
  const owners=[...core,...biome,...pack2];
  if(new Set(owners).size!==owners.length)throw Error('Producer registry numeric ID collision');
  const seen=new Set();
  const records=[];
  const excluded=[];
  for(const id of BUILD_MATERIALS){
    if(!Number.isSafeInteger(id)||id<=0)throw Error('Unsafe registered material ID');
    if(seen.has(id))throw Error('Duplicate installed material ID '+id);
    seen.add(id);
    if(core.has(id)){records.push(entry({id,name:BLOCK_NAMES[id]??CORE_NAMES[id],
      category:'Core blocks',producer:'core',boxes:CUBE}));continue;}
    if(biome.has(id)){records.push(fromBiome(id));continue;}
    if(pack2.has(id)){
      if(pack2IsFluid(id)){
        // Fluid requires triangle-level selection, not box-only physical rules.
        excluded.push(Object.freeze({id,reason:'fluid-selection-adapter-not-certified'}));
        continue;
      }
      records.push(fromPack2(id));continue;
    }
    throw Error('Registered asset missing certified G1 physical reader: '+id);
  }
  // Duplicate IDs and malformed metadata reject the entire snapshot.
  const verified=sealReadOnlySnapshot(records);
  return Object.freeze({...verified,excluded:Object.freeze(excluded)});
}
export function getCatalogRevision(){return readRegisteredSnapshot().revision;}
// Detached G1 facade only; NOT mounted as an M0 live-game adapter.
export function readOnlyRegistryPort(){
  return Object.freeze({readRegisteredSnapshot,getCatalogRevision,
    listPlaceables:async()=>readRegisteredSnapshot().records});
}
