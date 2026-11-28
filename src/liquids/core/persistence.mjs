// Versioned, source-only liquid sidecar. No game save or storage writes.
import {createLiquidEngine,LIQUID_CONTRACT_VERSION,CELL_CAPACITY} from './engine.mjs';
import {createLiquidOwnerHandoff,LIQUID_OWNER_HANDOFF_VERSION} from './owner-handoff.mjs';
import {createWaterSources} from '../water/physics/sources.mjs';

export const LIQUID_PERSISTENCE_VERSION=1;
const int=(n,min,max)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const token=s=>typeof s==='string'&&/^[a-z0-9][a-z0-9-]{0,127}$/.test(s);
const point=c=>[c.x,c.y,c.z];
const key=c=>point(c).join(',');
function shape(o,keys){
  if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).length!==keys.length||keys.some(k=>!Object.hasOwn(o,k)))
    throw new TypeError('Unexpected liquid persistence fields');
}
function list(a,max){if(!Array.isArray(a)||a.length>max)throw new RangeError('Liquid persistence record budget');return a;}
function cellShape(c){
  shape(c,['x','y','z','id','units','quantities']);
  if(!c.quantities||typeof c.quantities!=='object'||Array.isArray(c.quantities)||Object.keys(c.quantities).length>8)
    throw new TypeError('Invalid persisted quantities');
}
function snapshotShape(s,max){
  const hasBlocked=s&&Object.hasOwn(s,'capacityBlocked'),hasPhases=s&&Object.hasOwn(s,'lateralPhases');
  shape(s,['version','cells','pending',...(hasBlocked?['capacityBlocked']:[]),...(hasPhases?['lateralPhases']:[])]);
  list(s.cells,max).forEach(cellShape);list(s.pending,s.cells.length);
  if(hasBlocked)list(s.capacityBlocked,s.cells.length-s.pending.length);
  if(hasPhases)list(s.lateralPhases,s.cells.length);
}

// Policy identity is supplied by the integration owner and must change when
// definitions/rules/source or host persistence semantics change. No callbacks
// are executed during validation, and no historical game save is parsed.
export function createLiquidPersistence({worldId,policyId,definitions=[],reactionRules=[],
  waterSourceOptions={},maxCells=8192,maxVisits=256,maxParkedCells=8192,maxParkedOwners=64,
  maxFrozenCells=8192,maxProducts=4096,maxRecords=32768,maxChars=8*1024*1024}={}){
  if(!token(worldId)||!token(policyId)||!int(maxFrozenCells,0,65536)||!int(maxProducts,0,65536)||
     !int(maxRecords,0,262144)||!int(maxChars,1,64*1024*1024))throw new RangeError('Invalid persistence identity or budget');
  const offline=()=>false;
  const config={definitions:definitions.map(d=>({...d})),reactionRules:reactionRules.map(r=>({...r})),
    isLoaded:offline,isOpen:offline,maxCells,maxVisits};
  const owners=createLiquidOwnerHandoff({...config,isOwnerLoaded:offline,maxParkedCells,maxParkedOwners});
  const emptyEngine=createLiquidEngine(config);
  // Copy the source descriptors to prevent later caller mutation of the policy.
  const sourceConfig={...waterSourceOptions,sources:(waterSourceOptions.sources??[]).map(s=>({...s}))};
  if(sourceConfig.sources.length&&!config.definitions.some(d=>d.id==='water'))
    throw new TypeError('Configured water sources require water definition');
  const sourceInitial=createWaterSources({...sourceConfig,engine:emptyEngine,snapshot:null}).save();
  function canonicalCells(cells,max){
    return Object.freeze(createLiquidEngine({...config,maxCells:Math.max(1,max),
      snapshot:{version:LIQUID_CONTRACT_VERSION,cells,pending:[]}}).save().cells);
  }
  function validate(state){
    shape(state,['version','worldId','policyId','revision','resident','parked','frozen','waterSources','products']);
    if(state.version!==LIQUID_PERSISTENCE_VERSION||state.worldId!==worldId||state.policyId!==policyId||!int(state.revision,0,Number.MAX_SAFE_INTEGER))
      throw new TypeError('Incompatible liquid persistence identity or version');
    // Count before reconstructing any engines or copying rows.
    list(state.parked,maxParkedOwners);list(state.frozen,maxFrozenCells);list(state.products,maxProducts);
    snapshotShape(state.resident,maxCells);
    let parkedCount=0,productCount=0;
    for(const shard of state.parked){
      shape(shard,['owner','snapshot']);shape(shard.owner,['cx','cz','kind','section','key']);
      snapshotShape(shard.snapshot,maxParkedCells-parkedCount);parkedCount+=shard.snapshot.cells.length;
    }
    for(const row of state.products){
      shape(row,['id','product','productInputs']);list(row.productInputs,2);
      if(!token(row.id)||typeof row.product!=='string'||!/^[a-z][a-z0-9-]{0,63}$/.test(row.product)||!row.productInputs.length)
        throw new TypeError('Invalid reaction product receipt');
      productCount+=row.productInputs.length;
    }
    if(state.resident.cells.length+parkedCount+state.frozen.length+productCount>maxRecords)
      throw new RangeError('Aggregate liquid persistence budget exceeded');
    const {resident,parked}=owners.validate({version:LIQUID_OWNER_HANDOFF_VERSION,resident:state.resident,parked:state.parked});
    const occupied=new Set(resident.cells.map(key));
    for(const shard of parked)for(const c of shard.snapshot.cells)occupied.add(key(c));
    state.frozen.forEach(cellShape);
    const frozen=canonicalCells(state.frozen,maxFrozenCells);
    for(const c of frozen)if(c.id!=='water'||c.units!==CELL_CAPACITY||occupied.has(key(c)))
      throw new TypeError('Invalid or overlapping frozen water');
    const ids=new Set(),products=[];
    for(const row of state.products){
      if(ids.has(row.id))throw new TypeError('Duplicate reaction receipt identity');
      ids.add(row.id);row.productInputs.forEach(cellShape);
      const inputs=canonicalCells(row.productInputs,2);
      if(inputs.length===2){const [a,b]=inputs;
        if(a.id===b.id||Math.abs(a.x-b.x)+Math.abs(a.y-b.y)+Math.abs(a.z-b.z)!==1)
          throw new TypeError('Invalid reaction input pair');
      }
      // Coordinates of historical consumed inputs may legitimately recur.
      products.push(Object.freeze({id:row.id,product:row.product,productInputs:inputs}));
    }
    shape(state.waterSources,['version','signature','cursor','remaining']);
    const waterSources=createWaterSources({...sourceConfig,engine:emptyEngine,snapshot:state.waterSources}).save();
    Object.freeze(waterSources.remaining);Object.freeze(waterSources);
    return Object.freeze({version:LIQUID_PERSISTENCE_VERSION,worldId,policyId,revision:state.revision,
      resident,parked,frozen,waterSources,products:Object.freeze(products)});
  }
  function encode(state){const text=JSON.stringify(validate(state));if(text.length>maxChars)throw new RangeError('Liquid sidecar size budget');return text;}
  function decode(text){if(typeof text!=='string'||text.length>maxChars)throw new RangeError('Liquid sidecar size budget');return validate(JSON.parse(text));}
  // Explicit migration ONLY from the isolated engine's v1 sparse snapshot,
  // never a game-save document. No guessing or defaulting missing ledgers.
  function migrateEngineSnapshot(resident){
    if(sourceConfig.sources.length)throw new TypeError('Migration requires explicit source ledger when configured');
    return validate({version:LIQUID_PERSISTENCE_VERSION,worldId,policyId,revision:0,resident,
      parked:[],frozen:[],waterSources:sourceInitial,products:[]});
  }
  return Object.freeze({validate,encode,decode,migrateEngineSnapshot});
}
