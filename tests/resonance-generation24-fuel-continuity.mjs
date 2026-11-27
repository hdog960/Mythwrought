import test from 'node:test';
import assert from 'node:assert/strict';
import { describeGenerator } from '../src/resonance/generation24/index.mjs';
import { createFuelCheckpoint, advanceFuelCheckpoint } from '../src/resonance/generation24/fuel-continuity.mjs';
const heat=describeGenerator({id:'heat-a',model:'heat',seed:42,anchor:[1,2,3]});
const crystal=describeGenerator({id:'crystal-a',model:'crystal',seed:42,anchor:[4,2,3]});
const observation=(tick,inputs)=>({verified:true,observedTick:tick,inputs});
test('split windows cannot spend same fuel twice',()=>{
  const start=createFuelCheckpoint(heat,100,2);
  const first=advanceFuelCheckpoint(heat,start,[observation(100,{heatPresent:true,fuelUnits:10})]);
  const second=advanceFuelCheckpoint(heat,first.checkpoint,[observation(101,{heatPresent:true,fuelUnits:10}),observation(102,{heatPresent:true,fuelUnits:10})]);
  assert.equal(first.window.fuelConsumed+second.window.fuelConsumed,2);
  assert.equal(second.checkpoint.fuelRemaining,0);
  assert.equal(second.window.states[1].generated,0);
});
test('replayed and skipped ticks fail closed',()=>{
  const checkpoint=createFuelCheckpoint(heat,7,3);
  for(const tick of [6,8]) assert.throws(()=>advanceFuelCheckpoint(heat,checkpoint,[observation(tick,{heatPresent:true,fuelUnits:3})]));
});
test('cross-generator checkpoint is rejected',()=>{
  const checkpoint=createFuelCheckpoint(heat,0,1);
  assert.throws(()=>advanceFuelCheckpoint(crystal,checkpoint,[observation(0,{crystalPresent:true})]));
});
test('continuous crystal consumes no reserved fuel',()=>{
  const checkpoint=createFuelCheckpoint(crystal,0,0);
  const result=advanceFuelCheckpoint(crystal,checkpoint,[observation(0,{crystalPresent:true}),observation(1,{crystalPresent:true})]);
  assert.equal(result.window.generated,6);
  assert.equal(result.checkpoint.fuelRemaining,0);
  assert.equal(result.checkpoint.nextTick,2);
});
test('unverified samples and empty windows are rejected',()=>{
  const checkpoint=createFuelCheckpoint(heat,0,1);
  assert.throws(()=>advanceFuelCheckpoint(heat,checkpoint,[]));
  assert.throws(()=>advanceFuelCheckpoint(heat,checkpoint,[{observedTick:0,inputs:{heatPresent:true,fuelUnits:1}}]));
});
