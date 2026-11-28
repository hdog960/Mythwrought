import test from 'node:test';
import assert from 'node:assert/strict';
import {describeGenerator,evaluateGenerator,MODELS} from '../src/resonance/generation24/index.mjs';
const descriptor=describeGenerator({id:'unit_a',model:'crystal',seed:42,anchor:[1,2,3]});
const inputs={crystalPresent:true};
test('valid descriptors produce bounded power and fail closed for all models',()=>{
 const conditions={hand:{operator:true},crystal:{crystalPresent:true},waterwheel:{waterPresent:true,flow:1},windmill:{exposed:true,wind:1},heat:{heatPresent:true,fuelUnits:5}};
 for(const model of Object.keys(MODELS)){
  const d=describeGenerator({id:'unit_a',model,seed:42,anchor:[1,2,3]});
  const ready=evaluateGenerator(d,conditions[model]);
  assert.equal(ready.status,'available');
  assert.equal(ready.capacityPerTick,d.capacity);
  assert.ok(ready.availablePerTick>0 && ready.availablePerTick<=d.capacity);
  assert.equal(evaluateGenerator(d,{}).status,'blocked');
 }
});
for(const [name,change] of Object.entries({
 key:{instanceKey:'resonance:g24:42:1,2,3:other'},
 seed:{seed:43},anchor:{anchor:[1,2,4]},id:{id:'other'},
 kind:{sourceKind:'continuous-fake'},acquisition:{acquisition:'starter'},
 missingKey:{instanceKey:undefined},badAnchor:{anchor:[1,2,3.5]},
 badSeed:{seed:1.25},badId:{id:'../unsafe'}
}))test(`rejects ${name} descriptor mutation`,()=>assert.throws(()=>evaluateGenerator({...descriptor,...change},inputs),/incompatible generator/));
