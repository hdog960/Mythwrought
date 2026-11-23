// Mountain V8 original-source cross-owner registry census (read-only).
// This is a conservative inventory, not allocation, reservation, runtime
// registration, or permission to reuse source IDs. Unseen owner lanes remain.
import {BLOCK} from '../voxel.mjs';
import {PACK2_LIVE_IDS} from '../pack2-integration.mjs';
import {BIOME130_REGISTERED_IDS} from '../biome130-registry.mjs';
import {ENVIRONMENT_GROUND} from '../environment-ground.mjs';
import {PACK1_BUILDER_CATALOG} from '../block-packs/pack-1/builder-handoff.mjs';
import {PACK3_BUILDER_IDS} from '../builder-assets/pack3.mjs';
import {PACK4_BUILDER_CATALOG} from '../block-packs/pack-4/builder-handoff.mjs';
import {PACK5_BUILDER_CATALOG} from '../pack5-integration/catalog.mjs';
import {MANUAL_FIVE_PACK_CATALOG} from '../builder-assets/manual-five-pack.mjs';

const frozen=Object.freeze;
const sequence=(start,count)=>Array.from({length:count},(_,i)=>start+i);
const equal=(a,b)=>a.length===b.length&&a.every((n,i)=>n===b[i]);
const order=xs=>[...xs].sort((a,b)=>a-b);
const requireIds=(xs,want,label)=>{
  if(!Array.isArray(xs)||!xs.every(Number.isSafeInteger)||
     !equal(order(xs),want))throw Error('Original '+label+' owner namespace changed');
};
export const MOUNTAIN_V8_REGISTRY_CENSUS_SOURCE_HEAD=
  '182cf99ed4c0231dd629c56d856ffc99fec935b0';
/** Genuine original import source, no reads/writes to a live game world.
 * Every reported ID is OCCUPIED, RESERVED, or an original SENTINEL.
 * NEVER infer allocatability from a numeric gap.
 */
export function auditMountainV8KnownRegistryOwners(){
  const groups=[
    {name:'original-legacy',role:'live-voxel',ids:Object.values(BLOCK),
      expected:sequence(0,9)},
    {name:'manual-pack1',role:'construction-sidecar',ids:PACK1_BUILDER_CATALOG.map(x=>x.id),
      expected:sequence(9,30)},
    {name:'pack2',role:'physical-overlay',ids:[...PACK2_LIVE_IDS],
      expected:sequence(59,18)},
    {name:'manual-pack3',role:'construction-sidecar',ids:[...PACK3_BUILDER_IDS],
      expected:sequence(109,17)},
    {name:'manual-pack4',role:'construction-sidecar',ids:PACK4_BUILDER_CATALOG.map(x=>x.id),
      expected:sequence(159,23)},
    {name:'manual-pack5',role:'builder-numeric-bridge-only',
      ids:PACK5_BUILDER_CATALOG.map((_,i)=>209+i),
      expected:sequence(209,18)},
    {name:'biome130',role:'registered-shape',ids:[...BIOME130_REGISTERED_IDS],
      expected:sequence(256,130)},
    {name:'original-environment-v7',role:'existing-terrain',ids:Object.values(ENVIRONMENT_GROUND),
      expected:sequence(400,11)},
    {name:'original-sentinels',role:'reserved-sentinel',ids:[255,65535],
      expected:[255,65535]}
  ];
  const seen=new Map(),packOwnerSets=new Map();
  for(const row of groups){
    requireIds(row.ids,row.expected,row.name);
    for(const id of row.ids){
      if(seen.has(id))throw Error('Conflicting original owner claims '+id);
      seen.set(id,row.name);
    }
    packOwnerSets.set(row.name,new Set(row.ids));
  }
  // The five-pack combined bridge is the union of manual packs 1..5,
  // including Pack2. Do NOT double-count its 106 records as new IDs.
  if(MANUAL_FIVE_PACK_CATALOG.length!==106)throw Error('Original five-pack count changed');
  const knownManual=new Set([...packOwnerSets.get('manual-pack1'),
    ...packOwnerSets.get('pack2'),...packOwnerSets.get('manual-pack3'),
    ...packOwnerSets.get('manual-pack4'),...packOwnerSets.get('manual-pack5')]);
  const catalogIds=MANUAL_FIVE_PACK_CATALOG.map(row=>row.numericId);
  if(new Set(catalogIds).size!==106||knownManual.size!==106||
     !equal(order(catalogIds),order([...knownManual])))
    throw Error('Original five-pack numeric bridge differs from owner source');
  if(seen.size!==258)throw Error('Known original owner/sentinel inventory changed');
  return frozen({
    referenceSourceHead:MOUNTAIN_V8_REGISTRY_CENSUS_SOURCE_HEAD,
    groups:frozen(groups.map(({name,role,ids})=>frozen({name,role,
      count:ids.length,ids:frozen(order(ids))}))),
    knownOccupiedReservedOrSentinelCount:seen.size,
    originalFivePackNumericBridgeCount:106,
    fullMultiOwnerNamespaceAuditComplete:false,
    otherOwnerSignOffsObtained:false,
    allocatableIds:null,proposedV8Ids:null,registeredV8Ids:0,
    safeToIntegrate:false,
    measuredV8GpuBytes:null
  });
}
