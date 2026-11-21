import test from 'node:test';
import assert from 'node:assert/strict';
import { describeGenerator } from '../src/resonance/generation24/index.mjs';
import { evaluateObservationSequence } from '../src/resonance/generation24/observation-sequence.mjs';
import { ENVIRONMENT_BRIDGE } from '../src/resonance/generation24/environment-bridge.mjs';
const crystal = describeGenerator({id:'c',model:'crystal',seed:7,anchor:[0,0,0]});
const heat = describeGenerator({id:'h',model:'heat',seed:7,anchor:[1,0,0]});
const evidence = (g,t) => ({authority:ENVIRONMENT_BRIDGE,verified:true,observedTick:t,
  instanceKey:g.instanceKey,values:g.model==='crystal'?{crystalPresent:true}:{heatPresent:true,fuelUnits:1}});
test('three observed ticks are additive but never delivered',()=>{
  const x=evaluateObservationSequence([crystal,heat],evidence,10,3);
  assert.equal(x.generatedCandidate,30);
  assert.equal(x.fuelRequiredCandidate,3);
  assert.equal(x.fuelBySource[0].units,3);
  assert.equal(x.frames.length,3);
  assert.equal(x.delivered,false);
  assert.equal(x.fuelWithdrawn,false);
});
test('reject duplicate identities before reading evidence',()=>{
  assert.throws(()=>evaluateObservationSequence([crystal,crystal],()=>{throw Error('called')},0,1),/duplicate/);
});
test('missing or stale observation fails whole sequence',()=>{
  assert.throws(()=>evaluateObservationSequence([crystal],(g,t)=>t===2?null:evidence(g,t),1,3),/observation/);
});
test('bounds and tick overflow reject',()=>{
  assert.throws(()=>evaluateObservationSequence([crystal],evidence,0,61),/bounds/);
  assert.throws(()=>evaluateObservationSequence([crystal],evidence,Number.MAX_SAFE_INTEGER,2),/bounds/);
});
test('environment loss yields zero without fabricated recovery',()=>{
  const water=describeGenerator({id:'w',model:'waterwheel',seed:7,anchor:[2,0,0]});
  const x=evaluateObservationSequence([water],(g,t)=>({...evidence(g,t),
    values:{waterPresent:t!==2,flow:t===2?0:1}}),1,3);
  assert.equal(x.generatedCandidate,10);
  assert.deepEqual(x.frames.map(f=>f.outputs[0].status),['available','blocked','available']);
});
