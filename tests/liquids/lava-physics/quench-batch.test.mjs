import test from 'node:test';
import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {LAVA_DEFINITION,lavaQuantities,readLavaHeat} from '../../../src/liquids/lava/physics/definition.mjs';
import {WATER_LAVA_SETTLEMENT_RULE,describeQuenchReceipt,describeCoolingTransaction} from '../../../src/liquids/lava/physics/transactions.mjs';
import {createLavaThermalScheduler} from '../../../src/liquids/lava/physics/thermal-scheduler.mjs';
import {createLavaQuenchBatch} from '../../../src/liquids/lava/physics/quench-batch.mjs';
const {createLiquidEngine}=await import(pathToFileURL(resolve(process.env.LIQUID_ENGINE_MODULE??'src/liquids/core/engine.mjs')).href);
const p=x=>[x,0,0],pair=(a,b)=>[p(a),p(b)];
const clone=x=>JSON.parse(JSON.stringify(x));
function fixture({isLoaded=()=>true,isOpen=()=>true,canQuench=()=>true,thermalOptions={},...opts}={}){
  const createEngine=snapshot=>createLiquidEngine({snapshot,isLoaded,isOpen,
    definitions:[LAVA_DEFINITION,{id:'water',gravityLimit:8,lateralLimit:4},{id:'acid',gravityLimit:1,lateralLimit:1}],
    reactionRules:[WATER_LAVA_SETTLEMENT_RULE]});
  const live=createEngine(null);
  const scheduler=engine=>createLavaThermalScheduler({engine,isLoaded,isOpen,canCool:()=>true,...thermalOptions});
  const state=()=>({version:1,resident:live.save(),thermal:scheduler(live).save(),receipts:[]});
  const batch=createLavaQuenchBatch({createEngine,isLoaded,isOpen,canQuench,thermalOptions,allowQuench:true,...opts});
  return {live,state,batch,createEngine,scheduler,isLoaded,isOpen};
}
function fill(f,x,w=3,l=8){assert.equal(f.live.insert(...p(x),'water',w),true);assert.equal(f.live.insert(...p(x+1),'lava',l,lavaQuantities(l,77)),true);}
test('ordered partial quench preserves mass and heat, tracks remaining lava, never changes live engine',()=>{
  const f=fixture();fill(f,0);const state=f.state(),before=clone(state);
  const r=f.batch.stage({state,pairs:[pair(1,0),pair(0,1)]});
  assert.deepEqual(state,before);assert.deepEqual(f.live.save(),before.resident);
  assert.equal(r.visited,1);assert.equal(r.duplicates,1);assert.equal(r.newReceipts.length,1);
  const d=describeQuenchReceipt(r.newReceipts[0]),e=f.createEngine(r.state.resident),c=e.getCell(...p(1));
  assert.deepEqual([d.steamUnits,d.solidUnits,d.releasedHeat,c.units,readLavaHeat(c)],[3,3,231,5,385]);
  assert.deepEqual(r.state.thermal.pending,[p(1)]);assert.deepEqual(r.changed,[p(0),p(1)]);
  assert.ok(Object.isFrozen(r.state.receipts[0].productInputs[1].quantities));
  assert.ok(Object.isFrozen(r.state.resident.pending[0]));
});
test('restored thermal queue describes cooling on actual residual lava without mutation',()=>{
  const f=fixture();fill(f,0);const r=f.batch.stage({state:f.state(),pairs:[pair(0,1)]});
  const s=clone(r.state),engine=f.createEngine(s.resident);
  const t=createLavaThermalScheduler({engine,isLoaded:f.isLoaded,isOpen:f.isOpen,canCool:()=>true,snapshot:s.thermal});
  const proposal=t.step().proposals[0],d=describeCoolingTransaction({engine,isLoaded:f.isLoaded,isOpen:f.isOpen,canCool:()=>true},proposal);
  assert.equal(d.after.quantities['lava-heat'],365);assert.equal(d.ledger.releasedHeat,20);assert.deepEqual(engine.save(),s.resident);
  assert.deepEqual(f.batch.stage({state:s,pairs:[pair(0,1)]}).state,s);
});
test('default disabled does not consume and returns explicit remaining work',()=>{
  const f=fixture({allowQuench:false});fill(f,0);const s=f.state(),r=f.batch.stage({state:s,pairs:[pair(0,1)]});
  assert.deepEqual(r.state,s);assert.equal(r.visited,0);assert.deepEqual(r.remainingPairs,[pair(0,1)]);
});
test('receipt budget keeps prior receipts and returns unvisited suffix',()=>{
  const f=fixture({maxReceipts:1});fill(f,0);fill(f,4);const r=f.batch.stage({state:f.state(),pairs:[pair(0,1),pair(4,5)]});
  assert.equal(r.state.receipts.length,1);assert.deepEqual(r.remainingPairs,[pair(4,5)]);
  const again=f.batch.stage({state:clone(r.state),pairs:r.remainingPairs});
  assert.deepEqual(again.state,r.state);assert.equal(again.visited,0);assert.deepEqual(again.remainingPairs,r.remainingPairs);
});
test('thermal admission failure after an earlier staged reaction abandons all changes',()=>{
  const f=fixture({thermalOptions:{maxTracked:1}});fill(f,0);fill(f,4);const s=f.state(),before=clone(s);
  assert.equal(f.batch.stage({state:s,pairs:[pair(0,1),pair(4,5)]}),null);assert.deepEqual(s,before);assert.deepEqual(f.live.save(),before.resident);
});
test('permission denial, unload and unrelated liquid pairs do not consume',()=>{
  let loaded=true;const f=fixture({isLoaded:x=>loaded||x!==5,canQuench:plan=>plan.proposal.b.x!==1});
  fill(f,0);fill(f,4);f.live.insert(...p(8),'acid',2);f.live.insert(...p(9),'water',2);loaded=false;
  const s=f.state(),r=f.batch.stage({state:s,pairs:[pair(0,1),pair(4,5),pair(8,9)]});
  assert.equal(r.denied,1);assert.equal(r.unavailable,2);assert.deepEqual(r.state,s);
});
test('callback exception cannot publish a partially staged batch',()=>{
  const f=fixture({canQuench:plan=>{if(plan.proposal.b.x===5)throw Error('host failed');return true;}});
  fill(f,0);fill(f,4);const s=f.state(),before=clone(s);
  assert.throws(()=>f.batch.stage({state:s,pairs:[pair(0,1),pair(4,5)]}),/host failed/);assert.deepEqual(s,before);assert.deepEqual(f.live.save(),before.resident);
});
test('malformed state, receipt, adjacency and budgets fail closed',()=>{
  const f=fixture({maxPairs:1});fill(f,0);const s=f.state();
  assert.throws(()=>f.batch.stage({state:s,pairs:[pair(0,1),pair(1,0)]}),RangeError);
  assert.throws(()=>f.batch.stage({state:s,pairs:[pair(0,2)]}),TypeError);
  assert.throws(()=>f.batch.stage({state:{...s,receipts:[{}]},pairs:[]}),TypeError);
  assert.throws(()=>f.batch.stage({state:{...s,receipts:Array(1)},pairs:[]}),TypeError);
  assert.throws(()=>f.batch.stage({state:{...s,thermal:{...s.thermal,version:2}},pairs:[]}),TypeError);
});
test('full quench marks only full lava mass as voxel candidate and preserves independent cells',()=>{
  const f=fixture();fill(f,0,8,8);f.live.insert(...p(10),'acid',4,{solute:12});
  const r=f.batch.stage({state:f.state(),pairs:[pair(0,1)]});
  assert.equal(describeQuenchReceipt(r.newReceipts[0]).fullVoxelCandidate,true);
  assert.deepEqual(r.state.resident.cells,[f.live.getCell(...p(10))]);assert.deepEqual(r.state.thermal.pending,[]);
});
