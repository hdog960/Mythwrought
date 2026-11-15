// Coordinated MANUAL Block Packs 1-5: fail-closed, source-authentic builder interface.
// Integrator-owned. This never modifies automation-owned biome130 or commits world saves.
// The live renderer/placement hookup is a separately tested release gate.
import {BIOME130_REGISTERED_IDS} from '../biome130-registry.mjs';
import {PACK1_BUILDER_CATALOG,pack1BuilderShape} from '../block-packs/pack-1/builder-handoff.mjs';
import {PACK2_BUILDER_SYMBOLS,PACK2_BUILDER_IDS,resolvePack2BuilderAsset} from './pack2.mjs';
import {pack2ShapeOf} from '../pack2-integration.mjs';
import {PACK3_BUILDER_SYMBOLS,PACK3_BUILDER_IDS,resolvePack3BuilderAsset} from './pack3.mjs';
import {PACK4_BUILDER_CATALOG,pack4BuilderAsset} from '../block-packs/pack-4/builder-handoff.mjs';
import {PACK5_BUILDER_CATALOG} from '../pack5-integration/catalog.mjs';
import {resolvePack5BlueprintPhysical} from '../pack5-integration/blueprint-handoff.mjs';

const rows=[];
for(const x of PACK1_BUILDER_CATALOG)rows.push({symbol:x.symbolicRef,numericId:x.id,pack:1,name:x.name});
for(let i=0;i<PACK2_BUILDER_SYMBOLS.length;i++)
  rows.push({symbol:PACK2_BUILDER_SYMBOLS[i],numericId:PACK2_BUILDER_IDS[i],pack:2});
for(let i=0;i<PACK3_BUILDER_SYMBOLS.length;i++)
  rows.push({symbol:PACK3_BUILDER_SYMBOLS[i],numericId:PACK3_BUILDER_IDS[i],pack:3});
for(const x of PACK4_BUILDER_CATALOG)
  rows.push({symbol:x.ref,numericId:x.id,pack:4,name:x.name});
for(let i=0;i<PACK5_BUILDER_CATALOG.length;i++)
  rows.push({symbol:PACK5_BUILDER_CATALOG[i].symbolicId,numericId:209+i,pack:5,
    name:PACK5_BUILDER_CATALOG[i].name});

// This numeric bridge is a reservation for the combined builder only.
// It does NOT assert that all numeric IDs are registered in VoxelWorld.
const index=new Map(),usedIds=new Set(BIOME130_REGISTERED_IDS);
for(const row of rows){
  if(!/^pack[1-5]:\d{3}$/.test(row.symbol)||!Number.isInteger(row.numericId)||
     row.numericId<=8||row.numericId===255||usedIds.has(row.numericId))
    throw Error('Manual five-pack registry collided with legacy or biome130 ID');
  usedIds.add(row.numericId);
  if(!index.has(row.symbol))index.set(row.symbol,[]);
  index.get(row.symbol).push(Object.freeze(row));
}
if(index.size!==96||rows.length!==106||usedIds.size!==BIOME130_REGISTERED_IDS.length+106||
   new Set(rows.filter(x=>x.pack===1).map(x=>x.numericId)).size!==30||
   rows.filter(x=>x.pack===2).length!==18||
   rows.filter(x=>x.pack===3).length!==17||
   rows.filter(x=>x.pack===4).length!==23||
   rows.filter(x=>x.pack===5).length!==18)
  throw Error('Missing/duplicate manual Block Pack families or numeric IDs');
export const MANUAL_FIVE_PACK_CATALOG=Object.freeze(rows.map(x=>Object.freeze({...x})));
export const MANUAL_FIVE_PACK_FAMILY_SYMBOLS=Object.freeze([...index.keys()].sort());
export const MANUAL_FIVE_PACK_NUMERIC_IDS=Object.freeze(rows.map(x=>x.numericId).sort((a,b)=>a-b));
export const MANUAL_FIVE_PACK_COUNTS=Object.freeze({packs:5,families:96,numericVariants:106,
  productionRegistered:false,worldPlaced:false,requiresCombinedRuntimeAcceptance:true});

const directions=Object.freeze({north:0,east:1,south:2,west:3});
const coordinate=x=>Array.isArray(x)&&x.length===3&&x.every(Number.isSafeInteger);
const plus=(a,b)=>a.map((v,i)=>v+b[i]);
function turn(value){
  if(Number.isInteger(value)&&value>=0&&value<4)return value;
  if(typeof value==='string'&&Object.hasOwn(directions,value))return directions[value];
  throw RangeError('Builder orientation must be north/east/south/west or 0..3');
}
function rowsFor(symbol){
  if(typeof symbol!=='string'||!index.has(symbol))throw RangeError('Unknown manual Block Pack symbol');
  return index.get(symbol);
}
export function manualFivePackVariants(symbol){
  return Object.freeze([...rowsFor(symbol)]);
}
const boxOk=b=>Array.isArray(b)&&b.length===6&&b.every(Number.isFinite)&&
  [0,1,2].every(i=>b[i]<b[i+3]);
function boxes(value,label){
  if(!Array.isArray(value)||value.some(b=>!boxOk(b)))
    throw Error('Invalid source-authentic '+label+' geometry');
  return Object.freeze(value.map(b=>Object.freeze([...b])));
}
function freezeOffsets(values,label){
  if(!Array.isArray(values)||values.some(x=>!coordinate(x)))
    throw Error('Invalid '+label+' cells');
  return Object.freeze(values.map(x=>Object.freeze([...x])));
}
export function resolveManualFivePackAsset(symbol,{
  numericId=null,orientation='north',variant=null,state={}
}={}){
  const choices=rowsFor(symbol);
  if(numericId===null&&choices.length!==1)
    throw Error('Ambiguous manual family; choose numericId: '+symbol);
  const meta=numericId===null?choices[0]:choices.find(x=>x.numericId===numericId);
  if(!meta)throw RangeError('ID does not belong to manual family '+symbol);
  const yaw=turn(orientation);
  if(!state||typeof state!=='object'||Array.isArray(state))
    throw TypeError('Invalid manual construction state');
  let visible=[],selection=[],collision=[],occupied=[[0,0,0]],supports=[],supportPolicy='none',chosen=variant;
  if(meta.pack===1){
    if(Object.keys(state).length)throw Error('Pack 1 does not accept arbitrary state');
    const a=pack1BuilderShape(meta.numericId,{rotation:yaw,variant:variant??'lower'});
    visible=a.shape.boxes;selection=a.selection.boxes;collision=a.collision.boxes;
    supportPolicy=a.support;chosen=variant??'lower';
  }else if(meta.pack===2){
    if(variant!==null)throw Error('Pack 2 variants use explicit state');
    const a=resolvePack2BuilderAsset(symbol,yaw,state);
    const physical=pack2ShapeOf(meta.numericId,a.state);
    visible=a.shape.boxes.length?a.shape.boxes:(a.fluid?[physical.broadPhaseBox]:[]);
    selection=visible;collision=a.fluid?[]:a.shape.boxes;
    if(a.fluid)supportPolicy='fluid-static-no-simulation';
  }else if(meta.pack===3){
    if(variant!==null||Object.keys(state).length)
      throw Error('Pack 3 has no variant/state override');
    const a=resolvePack3BuilderAsset(symbol,yaw);
    visible=a.shape.boxes;selection=a.shape.boxes;collision=a.shape.boxes;
  }else if(meta.pack===4){
    if(variant!==null||Object.keys(state).length)
      throw Error('Pack 4 numeric variant must use numericId, not state');
    const a=pack4BuilderAsset(symbol,{candidateId:meta.numericId,rotation:yaw});
    visible=a.visible.map(x=>x.bounds);selection=a.selection;collision=a.collision;
    if(a.mountOffset){supports=[a.mountOffset];supportPolicy=a.mount;}
  }else{
    if(Object.keys(state).length)throw Error('Pack 5 uses authored variants, not state overrides');
    if(typeof variant!=='string'||!variant)
      throw Error('Pack 5 requires an explicit authored variant');
    const a=resolvePack5BlueprintPhysical({asset:symbol,at:[0,0,0],orientation:yaw,variant});
    visible=a.physical.visible;selection=a.physical.selection;
    collision=a.physical.collision;occupied=a.physical.occupiedCells;
    supports=a.physical.requiredSupports;supportPolicy=a.attachment;
  }
  const result=Object.freeze({
    symbol,sourcePack:meta.pack,numericId:meta.numericId,orientation:yaw,variant:chosen,
    visibleBoxes:boxes(visible,'visible'),selectionBoxes:boxes(selection,'selection'),
    collisionBoxes:boxes(collision,'collision'),
    occupiedOffsets:freezeOffsets(occupied,'occupied'),
    supportOffsets:freezeOffsets(supports,'support'),
    supportPolicy,physical:true,builderResolvable:true,
    livePlaceable:false,saveWritten:false
  });
  if(!result.visibleBoxes.length||!result.selectionBoxes.length)
    throw Error('Missing rendered/targetable physical asset '+symbol);
  return result;
}

// Dry-run only. No terrain mutators, sidecar writes, settlements, or Game API calls.
// Missing support is reported rather than fabricated; external terrain support is
// never trusted until an authoritative world-specific preflight certifies it.
export function planManualFivePackBlueprint(placements,{origin=[0,0,0],maxInstances=4096}={}){
  if(!coordinate(origin)||!Array.isArray(placements)||placements.length<1||
     !Number.isSafeInteger(maxInstances)||maxInstances<1||placements.length>maxInstances)
    throw Error('Invalid mixed manual-pack blueprint request');
  const occupied=new Map(),assets=[],supports=[];
  for(const placement of placements){
    if(!placement||typeof placement!=='object'||!coordinate(placement.at))
      throw Error('Invalid construction placement');
    const anchor=plus(origin,placement.at);
    if(!coordinate(anchor))throw Error('Construction coordinate overflow');
    const a=resolveManualFivePackAsset(placement.asset,{
      numericId:placement.numericId??null,orientation:placement.orientation??'north',
      variant:placement.variant??null,state:placement.state??{}
    });
    const cells=a.occupiedOffsets.map(x=>plus(anchor,x));
    for(const cell of cells){
      if(!coordinate(cell))throw Error('Multi-cell physical object coordinate overflow');
      const key=cell.join(',');
      if(occupied.has(key))throw Error('Overlapping manual-pack physical construction at '+key);
      occupied.set(key,{asset:a.symbol,structural:a.collisionBoxes.length>0});
    }
    const offsets=a.supportOffsets.map(x=>plus(anchor,x));
    if(offsets.some(x=>!coordinate(x)))throw Error('Support coordinate overflow');
    const physical=Object.freeze({asset:a.symbol,numericId:a.numericId,sourcePack:a.sourcePack,
      at:Object.freeze(anchor),rotation:a.orientation,variant:a.variant,
      occupied:Object.freeze(cells.map(x=>Object.freeze(x))),
      collision:Object.freeze(a.collisionBoxes.map(b=>Object.freeze(b.map((v,i)=>v+anchor[i%3])))),
      selection:Object.freeze(a.selectionBoxes.map(b=>Object.freeze(b.map((v,i)=>v+anchor[i%3]))))
    });
    assets.push(physical);
    for(const at of offsets)supports.push({asset:a.symbol,at});
    if(a.supportPolicy==='vertical-face'&&!offsets.length)
      supports.push({asset:a.symbol,at:null,reason:'missing-explicit-wall-mount'});
  }
  const pending=supports.filter(s=>s.at===null||!occupied.get(s.at.join(','))?.structural)
    .map(s=>Object.freeze({asset:s.asset,at:s.at===null?null:Object.freeze(s.at),
      reason:s.reason??'requires-certified-world-support'}));
  return Object.freeze({kind:'manual-five-pack-physical-blueprint-v1',
    sourcePacks:Object.freeze([1,2,3,4,5]),instances:assets.length,
    occupiedCellCount:occupied.size,physicalAssets:Object.freeze(assets),
    unresolvedSupports:Object.freeze(pending),
    dryRun:true,readyForWorldPlacement:false,saveWritten:false,
    worldPlaced:false,requiresCombinedRuntimeAcceptance:true});
}
