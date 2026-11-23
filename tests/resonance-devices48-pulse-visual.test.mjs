import test from 'node:test';
import assert from 'node:assert/strict';
import {buildPulseDescriptors,PULSE_VISUAL_CONTRACT} from '../src/resonance/devices48/pulse-visual-v1.mjs';
const device=(id,enabled=true)=>({id,seed:7,anchor:[2,3,4],enabled,demand:2});
const frame=(devices,allocation,tick=0)=>({seed:7,tick,devices,allocation});
test('bounded deterministic cadence, sorted immutable descriptors',()=>{
  const input=frame([device('b'),device('a')],[{id:'a',granted:2},{id:'b',granted:2}]);
  const first=Array.from({length:12},(_,tick)=>buildPulseDescriptors({...input,tick}));
  assert.equal(first.flat().length,2);
  assert.deepEqual(first,Array.from({length:12},(_,tick)=>buildPulseDescriptors({...input,tick})));
  assert.equal(PULSE_VISUAL_CONTRACT.productionBound,false);
  assert.ok(first.flat().every(e=>Object.isFrozen(e)&&e.passThrough&&e.ttlTicks===6));
});
test('disabled devices produce no pulses; deficit remains non-destructive',()=>{
  assert.deepEqual(buildPulseDescriptors(frame([device('off',false)],[])),[]);
  const outputs=Array.from({length:24},(_,tick)=>buildPulseDescriptors(frame([device('low')],[{id:'low',granted:0}],tick))).flat();
  assert.equal(outputs.length,1); assert.equal(outputs[0].state,'deficit');
  assert.equal(outputs[0].drawHint,'batched-rune-quad');
});
test('reject cross-world, duplicate, orphan, overgrant, and oversized frames',()=>{
  const valid=frame([device('a')],[{id:'a',granted:2}]);
  for(const bad of [
    {...valid,seed:8}, {...valid,devices:[device('a'),device('a')]},
    {...valid,allocation:[{id:'other',granted:1}]},
    {...valid,allocation:[{id:'a',granted:3}]},
    {...valid,allocation:[{id:'a',granted:1},{id:'a',granted:1}]},
    {...valid,devices:Array.from({length:65},(_,i)=>device('d'+i))},
    {...valid,devices:[{...device('a'),anchor:[NaN,0,0]}]},
  ]) assert.throws(()=>buildPulseDescriptors(bad));
});
