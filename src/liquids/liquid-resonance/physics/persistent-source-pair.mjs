// Lane-local companion to Water A's strict v1 sidecar; not a new save format.
import {createResonanceSources} from './finite-sources.mjs';
import {readResonanceCell,RESONANCE_ID,ENERGY_KEY} from './definition.mjs';
import {stageResonanceSourceStep} from './source-staging.mjs';
const freeze=Object.freeze;
const offline=freeze({getCell:()=>null,insert:()=>false});
const point=c=>[c.x,c.y,c.z];
const shape=(o,keys)=>{
  if(!o||typeof o!=='object'||Array.isArray(o)||Object.keys(o).length!==keys.length||keys.some(k=>!Object.hasOwn(o,k)))
    throw new TypeError('Unexpected Resonance companion fields');
};
const rev=n=>Number.isSafeInteger(n)&&n>=0;

// All supplied functions are trusted, synchronous and pure under the host
// lease. Codec and engine options must describe the same shared policy.
// The returned pair is transient; the host must adopt/persist both ledgers
// under one authenticated world/policy/revision, never as separate saves.
export function createResonanceSourcePersistence({liquidPersistence,sourceOptions,
  engineOptions,createLiquidEngine,physicalRegionAt}={}){
  if(typeof liquidPersistence?.validate!=='function'||typeof sourceOptions?.authorize!=='function'||
     !engineOptions||typeof createLiquidEngine!=='function'||typeof physicalRegionAt!=='function')
    throw new TypeError('Explicit shared codec, engine and source policy required');
  // Pin config by reconstructing only admitted descriptors, not caller objects.
  const initial=createResonanceSources({...sourceOptions,engine:offline,snapshot:null}).save();
  const config=JSON.parse(initial.signature);
  const policy=freeze({...config,sources:freeze(config.config.map(d=>freeze({...d,point:freeze(d.point),store:freeze(d.store)}))),authorize:sourceOptions.authorize});
  function validatePair(pair){
    shape(pair,['liquidState','sourceSnapshot']);
    const liquidState=liquidPersistence.validate(pair.liquidState);
    const raw=pair.sourceSnapshot;
    shape(raw,['version','signature','cursor','stores']);
    if(!Array.isArray(raw.stores)||raw.stores.length!==policy.sources.length)throw new TypeError('Missing reservoir ledger');
    for(const store of raw.stores)shape(store,['version','id','storeId','anchor','capacity','units','energy','revision']);
    const stock=createResonanceSources({...policy,engine:offline,snapshot:raw}).save();
    let units=0,energy=0;
    function count(c){if(c.id===RESONANCE_ID){const r=readResonanceCell(c);units+=r.units;energy+=r.quantities[ENERGY_KEY]??0;}}
    for(const c of liquidState.resident.cells)count(c);
    for(const shard of liquidState.parked)for(const c of shard.snapshot.cells)count(c);
    // Unconverted reaction receipts retain their original material input.
    for(const receipt of liquidState.products)for(const c of receipt.productInputs)count(c);
    for(const store of stock.stores){units+=store.units;energy+=store.energy;}
    if(!Number.isSafeInteger(units)||!Number.isSafeInteger(energy))throw new RangeError('Resonance accounting overflow');
    return freeze({pair:freeze({liquidState,sourceSnapshot:freeze({...stock,stores:freeze(stock.stores)})}),totals:freeze({units,energy})});
  }
  function stageStep(pair,expectedRevision){
    if(!rev(expectedRevision))throw new TypeError('Invalid expected revision');
    const before=validatePair(pair),s=before.pair.liquidState;
    if(s.revision!==expectedRevision)return null;
    const parked=new Set(s.parked.map(shard=>shard.owner.key));
    const frozen=new Set(s.frozen.map(c=>point(c).join(',')));
    const authorize=(d,store)=>{
      // Even a permissive host callback may not discharge into dormant owners
      // (including empty shards) or occupied frozen-phase coordinates.
      const owner=physicalRegionAt(...d.point);
      if(!owner||typeof owner.key!=='string'||!owner.key||parked.has(owner.key)||frozen.has(d.point.join(',')))return false;
      return policy.authorize(d,store)===true;
    };
    const staged=stageResonanceSourceStep({createLiquidEngine,engineOptions,
      sourceOptions:{...policy,authorize},resident:s.resident,sourceSnapshot:before.pair.sourceSnapshot,
      stateRevision:s.revision,expectedRevision});
    const after=validatePair({liquidState:{...s,revision:staged.stateRevision,resident:staged.resident},sourceSnapshot:staged.sourceSnapshot});
    if(after.totals.units!==before.totals.units||after.totals.energy!==before.totals.energy)
      throw new Error('Resonance source conservation mismatch');
    return freeze({expectedRevision,stateRevision:staged.stateRevision,pair:after.pair,receipt:staged.receipt,totals:after.totals});
  }
  return freeze({validatePair,stageStep});
}
