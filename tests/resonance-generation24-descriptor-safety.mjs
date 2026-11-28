import test from 'node:test';
import assert from 'node:assert/strict';
import { describeGenerator, evaluateGenerator, simulateTicks, CONTRACT } from '../src/resonance/generation24/index.mjs';
const base=()=>describeGenerator({id:'safe_01',model:'crystal',seed:179,anchor:[2,3,4]});
test('descriptor rejects all altered version and identity fields',()=>{
  const d=base();
  for(const changes of [{contract:'resonance-power-v2'},{instanceKey:'forged'}, {seed:180},{id:'safe_02'}, {anchor:[2,3,5]}, {sourceKind:'fuelled'}])
    assert.throws(()=>evaluateGenerator({...d,...changes},{crystalPresent:true}),/incompatible generator/);
});
test('descriptor rejects forged capacity, rated output, acquisition, and upgrade',()=>{
  const d=base();
  for(const changes of [{capacity:999},{ratedOutput:999},{acquisition:'starter'},{level:4},{level:0.5}])
    assert.throws(()=>simulateTicks({...d,...changes},{crystalPresent:true},1),/incompatible generator/);
});
test('constructor rejects unsafe coordinates and unsafe seeds',()=>{
  for(const changes of [{seed:2**53},{anchor:[Infinity,0,0]},{anchor:[1.5,0,0]},{id:'UPPER'},{model:'unknown'}])
    assert.throws(()=>describeGenerator({id:'safe_01',model:'crystal',seed:179,anchor:[2,3,4],...changes}));
});
test('read-only evaluation never mutates caller descriptor, anchor or environment',()=>{
  const d=base(), env=Object.freeze({crystalPresent:true});
  assert.ok(Object.isFrozen(d)); assert.ok(Object.isFrozen(d.anchor));
  const before=JSON.stringify(d);
  const a=evaluateGenerator(d,env), b=simulateTicks(d,env,CONTRACT.maxCatchupTicks);
  assert.equal(JSON.stringify(d),before);
  assert.ok(Object.isFrozen(a)); assert.ok(Object.isFrozen(b));
  assert.equal(b.fuelConsumed,0);
});
test('bounded many-generator generation is additive and independent of ordering',()=>{
  const ds=Array.from({length:CONTRACT.maxGenerators},(_,i)=>describeGenerator({id:`g_${i}`,model:i%2?'crystal':'hand',seed:179,anchor:[i,0,0]}));
  const env=d=>d.model==='crystal'?{crystalPresent:true}:{operator:true};
  const total=arr=>arr.reduce((s,d)=>s+simulateTicks(d,env(d),3).generated,0);
  assert.equal(total(ds),total([...ds].reverse()));
  assert.equal(new Set(ds.map(d=>d.instanceKey)).size,CONTRACT.maxGenerators);
});
