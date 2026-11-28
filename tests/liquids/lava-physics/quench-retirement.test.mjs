import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {LAVA_DEFINITION,lavaQuantities,readLavaHeat} from '../../../src/liquids/lava/physics/definition.mjs';
import {WATER_LAVA_SETTLEMENT_RULE,describeQuenchReceipt} from '../../../src/liquids/lava/physics/transactions.mjs';
import {createLavaThermalScheduler} from '../../../src/liquids/lava/physics/thermal-scheduler.mjs';
import {createLavaQuenchBatch} from '../../../src/liquids/lava/physics/quench-batch.mjs';
const {createLiquidEngine}=await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE??'src/liquids/core/engine.mjs')).href);
const p=x=>[x,0,0],pair=(a,b)=>[p(a),p(b)];
const clone=s=>JSON.parse(JSON.stringify(s));
function fixture({maxTracked=1,isLoaded=()=>true,isOpen=()=>true,canQuench=()=>true}={}){
  const createEngine=snapshot=>createLiquidEngine({snapshot,isLoaded,isOpen,
    definitions:[LAVA_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4}],
    reactionRules:[WATER_LAVA_SETTLEMENT_RULE]});
  const live=createEngine(null),thermalOptions={maxTracked};
  const scheduler=createLavaThermalScheduler({engine:live,isLoaded,isOpen,canCool:()=>true,...thermalOptions});
  const batch=createLavaQuenchBatch({createEngine,isLoaded,isOpen,canQuench,thermalOptions,allowQuench:true});
  function fill(x,w,l){assert.equal(live.insert(...p(x),'water',w),true);assert.equal(live.insert(...p(x+1),'lava',l,lavaQuantities(l,77)),true);}
  const state=()=>({version:1,resident:live.save(),thermal:scheduler.save(),receipts:[]});
  return {live,scheduler,batch,fill,state,createEngine};
}
test('a fully quenched tracked cell releases its slot before a later partial quench',()=>{
  const f=fixture();f.fill(0,8,8);f.fill(4,3,8);assert.equal(f.scheduler.track(...p(1)),true);
  const s=f.state(),before=clone(s),r=f.batch.stage({state:s,pairs:[pair(0,1),pair(4,5)]});
  assert.ok(r);assert.equal(r.newReceipts.length,2);assert.deepEqual(r.state.thermal.pending,[p(5)]);
  const e=f.createEngine(r.state.resident),ledgers=r.newReceipts.map(describeQuenchReceipt);
  assert.equal(e.getCell(...p(1)),null);assert.equal(e.getCell(...p(5)).units,5);
  assert.equal(ledgers.reduce((n,d)=>n+d.steamUnits,0),11);
  assert.equal(ledgers.reduce((n,d)=>n+d.solidUnits,0)+5,16);
  assert.equal(ledgers.reduce((n,d)=>n+d.releasedHeat,0)+readLavaHeat(e.getCell(...p(5))),16*77);
  assert.deepEqual(s,before);assert.deepEqual(f.live.save(),before.resident);
});
test('retirement preserves unrelated FIFO entries, including unloaded lava',()=>{
  let loaded=true;const f=fixture({maxTracked:3,isLoaded:x=>x!==9||loaded});
  f.fill(0,8,8);f.fill(4,3,8);f.fill(8,3,8);
  for(const x of [9,1,5])assert.equal(f.scheduler.track(...p(x)),true);
  loaded=false;const s=f.state(),r=f.batch.stage({state:s,pairs:[pair(0,1)]});
  assert.deepEqual(r.state.thermal.pending,[p(9),p(5)]);
  assert.deepEqual(f.createEngine(r.state.resident).getCell(...p(9)),f.live.getCell(...p(9)));
  assert.deepEqual(f.batch.stage({state:clone(r.state),pairs:[]}).state,r.state);
});
test('retireIfAbsent requires loaded non-lava, permits closed cells, and does not reorder',()=>{
  let loaded=true,open=true;const f=fixture({maxTracked:3,isLoaded:()=>loaded,isOpen:()=>open});
  f.fill(0,3,8);for(const x of [9,1,5])f.scheduler.track(...p(x));
  const before=f.scheduler.save();loaded=false;assert.equal(f.scheduler.retireIfAbsent(...p(9)),false);
  loaded=true;assert.equal(f.scheduler.retireIfAbsent(...p(1)),false);assert.deepEqual(f.scheduler.save(),before);
  assert.equal(f.live.extract(...p(1),8).units,8);open=false;
  assert.equal(f.scheduler.retireIfAbsent(...p(1)),true);assert.deepEqual(f.scheduler.save().pending,[p(9),p(5)]);
  assert.equal(f.scheduler.retireIfAbsent(...p(1)),true);
  assert.throws(()=>f.scheduler.retireIfAbsent(0,257,0),RangeError);
});
test('retirement callback failure and reentrancy leave exact FIFO intact',()=>{
  let scheduler,mode='ok';const engine={getCell:()=>null};
  scheduler=createLavaThermalScheduler({engine,isLoaded:()=>{if(mode==='throw')throw Error('host failed');if(mode==='reenter')scheduler.track(...p(2));return true;},isOpen:()=>true,canCool:()=>false});
  scheduler.track(...p(1));const before=scheduler.save();
  mode='throw';assert.throws(()=>scheduler.retireIfAbsent(...p(1)),/host failed/);assert.deepEqual(scheduler.save(),before);
  mode='reenter';assert.throws(()=>scheduler.retireIfAbsent(...p(1)),/Reentrant/);assert.deepEqual(scheduler.save(),before);
  mode='ok';assert.equal(scheduler.retireIfAbsent(...p(1)),true);assert.deepEqual(scheduler.save().pending,[]);
});
