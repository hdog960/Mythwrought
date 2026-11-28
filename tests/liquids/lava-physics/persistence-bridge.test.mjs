import test from 'node:test';
import assert from 'node:assert/strict';
import {createLavaPersistenceBridge} from '../../../src/liquids/lava/physics/persistence-bridge.mjs';
import {createLavaVents} from '../../../src/liquids/lava/physics/vents.mjs';
import {createLavaThermalScheduler} from '../../../src/liquids/lava/physics/thermal-scheduler.mjs';
import {describeQuenchReceipt} from '../../../src/liquids/lava/physics/transactions.mjs';
const engine={getCell:()=>null,insert:()=>false}, off=()=>false;
const ventOptions={vents:[{id:'vent',x:0,y:0,z:0,remaining:8}]};
const copy=x=>JSON.parse(JSON.stringify(x));
// Explicit fixture codec: verifies invocation and shared rejection propagation,
// not qualification of the Water A codec or full host persistence transaction.
const codec={validate(s){if(s.products.length>4)throw RangeError('Shared cap');return copy(s);}};
const cell=(x,id,units=2,heat=0)=>({x,y:0,z:0,id,units,quantities:heat?{'lava-heat':heat}:{}});
const quench=(x=0)=>({product:'lava-quench',productInputs:[cell(x,'water'),cell(x+1,'lava',2,91)],changed:[[x,0,0],[x+1,0,0]]});
const stored=(id,r=quench())=>({id,product:r.product,productInputs:r.productInputs});
function fixture(opts={}){
  const bridge=createLavaPersistenceBridge({codec,ventOptions,...opts});
  const thermal=createLavaThermalScheduler({engine,isLoaded:off,isOpen:off,canCool:off});thermal.track(4,0,0);
  const vents=createLavaVents({engine,...ventOptions}).save();vents.emitted[0]=3;
  const shared={version:1,worldId:'world',policyId:'policy',revision:9,resident:{version:1,cells:[cell(4,'lava',3,100)],pending:[[4,0,0]]},parked:[],frozen:[],waterSources:{},products:[{id:'foreign',product:'other',productInputs:[cell(6,'acid')]},stored('q0')]};
  const lava={version:1,worldId:'world',policyId:'policy',revision:9,vents,thermal:thermal.save()};
  const batch={state:{version:1,resident:copy(shared.resident),thermal:copy(lava.thermal),receipts:[quench(),quench(2)]},newReceipts:[quench(2)]};
  return {bridge,shared,lava,batch,receiptIds:['q1']};
}
test('restore projects only lava quench records and retains exact heat and vent stock',()=>{
  const f=fixture(),r=f.bridge.restore(f);
  assert.deepEqual(r.quenchState.receipts,[quench()]);assert.equal(describeQuenchReceipt(r.quenchState.receipts[0]).releasedHeat,91);
  assert.deepEqual(r.lava.vents.emitted,[3]);assert.deepEqual(r.lava.thermal.pending,[[4,0,0]]);
  assert.equal(r.shared.products.length,2);assert.ok(Object.isFrozen(r.lava.thermal.pending[0]));
});
test('staging appends one shared receipt, binds revision and preserves other owners',()=>{
  const f=fixture(),before=copy({shared:f.shared,lava:f.lava,batch:f.batch});
  f.batch.state.thermal.pending.push([3,0,0]);before.batch.state.thermal.pending.push([3,0,0]);
  const r=f.bridge.stageQuench(f);
  assert.equal(r.shared.revision,10);assert.equal(r.lava.revision,10);
  assert.deepEqual(r.shared.products,[...f.shared.products,stored('q1',quench(2))]);
  assert.deepEqual(r.lava.vents,f.lava.vents);assert.deepEqual(r.lava.thermal.pending,[[4,0,0],[3,0,0]]);
  assert.deepEqual({shared:f.shared,lava:f.lava,batch:f.batch},before);
  assert.deepEqual(f.bridge.restore(copy(r)),r);
});
test('same consumed coordinates may recur but receipt IDs must be unique',()=>{
  const f=fixture();f.batch.state.receipts[1]=quench();f.batch.newReceipts[0]=quench();
  assert.equal(f.bridge.stageQuench(f).shared.products.length,3);
  f.receiptIds=['q0'];assert.throws(()=>f.bridge.stageQuench(f),/receipt ID/);
  f.receiptIds=['foreign'];assert.throws(()=>f.bridge.stageQuench(f),/receipt ID/);
});
test('old batch cannot be appended after its receipts are adopted or with altered prefix',()=>{
  const f=fixture(),r=f.bridge.stageQuench(f);
  assert.throws(()=>f.bridge.stageQuench({...f,shared:r.shared,lava:r.lava}),/batch/);
  f.batch.state.receipts[0]=quench(8);assert.throws(()=>f.bridge.stageQuench(f),/prefix/);
});
test('mismatched new receipt suffix and missing IDs reject',()=>{
  const f=fixture();f.batch.newReceipts[0]=quench(7);assert.throws(()=>f.bridge.stageQuench(f),/suffix/);
  f.batch.newReceipts[0]=quench(2);f.receiptIds=[];assert.throws(()=>f.bridge.stageQuench(f),/allocation/);
});
test('missing or incompatible owner state never silently resets vents or thermal FIFO',()=>{
  const f=fixture();assert.throws(()=>f.bridge.restore({...f,lava:undefined}),/fields/);
  assert.throws(()=>f.bridge.restore({...f,lava:{...f.lava,revision:8}}),/mismatch/);
  assert.throws(()=>f.bridge.restore({...f,lava:{...f.lava,worldId:'different'}}),/mismatch/);
  f.lava.vents.emitted[0]=9;assert.throws(()=>f.bridge.restore(f),/emission/);
  f.lava.vents.emitted[0]=3;f.lava.thermal.pending.push([4,0,0]);assert.throws(()=>f.bridge.restore(f),/queue/);
});
test('reject invalid heat on resident and parked lava',()=>{
  const f=fixture();f.shared.resident.cells[0].quantities['lava-heat']=301;
  assert.throws(()=>f.bridge.restore(f),/heat/);f.shared.resident.cells[0].quantities['lava-heat']=100;
  f.shared.parked.push({snapshot:{cells:[cell(6,'lava',2,201)]}});assert.throws(()=>f.bridge.restore(f),/heat/);
});
test('malformed quench receipts and cap fail closed',()=>{
  const f=fixture({maxReceipts:1});assert.throws(()=>f.bridge.stageQuench(f),/batch/);
  f.shared.products.push(stored('q2'));assert.throws(()=>f.bridge.restore(f),/budget/);
  const g=fixture();g.shared.products[1].productInputs[1].units=1;
  assert.throws(()=>g.bridge.restore(g),/receipt/);
});
test('shared codec refusal propagates without changing caller state',()=>{
  const f=fixture();f.shared.products.push({id:'f2',product:'other',productInputs:[cell(10,'acid')]},{id:'f3',product:'other',productInputs:[cell(11,'acid')]});
  const before=copy(f.shared);assert.throws(()=>f.bridge.stageQuench(f),/Shared cap/);assert.deepEqual(f.shared,before);
});
test('batch receipt must carry the exact changed coordinates',()=>{
  const f=fixture();f.batch.newReceipts[0].changed=undefined;assert.throws(()=>f.bridge.stageQuench(f),/receipt/);
  f.batch.newReceipts[0].changed=[[2,0,0],[9,0,0]];assert.throws(()=>f.bridge.stageQuench(f),/receipt/);
});
