import test from 'node:test';
import assert from 'node:assert/strict';
import { describeGenerator } from '../src/resonance/generation24/index.mjs';
import { aggregateGenerators } from '../src/resonance/generation24/aggregate.mjs';
const source = (id, model, anchor, inputs) => ({descriptor: describeGenerator({id, model, seed:123, anchor}), inputs});
test('independent crystal and water sources add truthful capacity', () => {
  const a = aggregateGenerators([source('a','crystal',[0,0,0],{crystalPresent:true}),
    source('b','waterwheel',[2,0,0],{waterPresent:true,flow:1})], 3);
  assert.equal(a.sourceCount,2); assert.equal(a.availablePerTick,8);
  assert.equal(a.ratedCapacityPerTick,10); assert.equal(a.generated,24);
});
test('environment blocked source contributes capacity but no output', () => {
  const a=aggregateGenerators([source('w','windmill',[1,2,3],{exposed:false,wind:1})],2);
  assert.equal(a.generated,0); assert.equal(a.availablePerTick,0); assert.equal(a.ratedCapacityPerTick,6);
});
test('fuel budget limits generated ticks without consuming real inventory', () => {
  const a=aggregateGenerators([source('h','heat',[1,2,3],{heatPresent:true,fuelUnits:2})],5);
  assert.equal(a.generated,14); assert.equal(a.sources[0].fuelConsumed,2);
  assert.equal(a.sources[0].ticks,2);
});
test('duplicate identities and unsafe batch sizes fail closed', () => {
  const x=source('x','hand',[0,0,0],{operator:true});
  assert.throws(()=>aggregateGenerators([x,x]),/duplicate/);
  assert.throws(()=>aggregateGenerators([x],61),/invalid/);
  assert.throws(()=>aggregateGenerators(Array(129).fill(x)),/invalid/);
});
