import test from 'node:test';
import assert from 'node:assert/strict';
import {CONTRACT,describeGenerator,evaluateGenerator,simulateTicks} from '../src/resonance/generation24/index.mjs';
const d=(model,level=0)=>describeGenerator({id:'a',model,seed:179,anchor:[1,2,3],level});
test('deterministic immutable identity and bounded upgrades',()=>{
 assert.deepEqual(d('crystal'),d('crystal')); assert.equal(Object.isFrozen(d('crystal')),true);
 assert.equal(d('crystal',3).capacity,10); assert.throws(()=>d('crystal',4));
 assert.throws(()=>describeGenerator({id:'../',model:'crystal',seed:1,anchor:[0,0,0]}));
});
test('crystal steady indefinitely without fuel; hand needs operator',()=>{
 const c=d('crystal'); assert.equal(simulateTicks(c,{crystalPresent:true},60).generated,180);
 assert.equal(evaluateGenerator(c,{crystalPresent:true}).fuelCostPerTick,0);
 assert.equal(evaluateGenerator(d('hand'),{}).availablePerTick,0);
 assert.equal(evaluateGenerator(d('hand'),{operator:true}).availablePerTick,1);
});
test('natural generators fail closed on missing environmental evidence',()=>{
 assert.equal(evaluateGenerator(d('waterwheel'),{waterPresent:true}).status,'blocked');
 assert.equal(evaluateGenerator(d('windmill'),{exposed:true,wind:0.2}).status,'blocked');
 assert.equal(evaluateGenerator(d('waterwheel'),{waterPresent:true,flow:0.8}).availablePerTick,4);
 assert.equal(evaluateGenerator(d('windmill'),{exposed:true,wind:0.8}).availablePerTick,4);
});
test('heat fuel bounded and explicit, no inventory mutation',()=>{
 const fuel={heatPresent:true,fuelUnits:2};
 assert.equal(simulateTicks(d('heat'),fuel,10).generated,14);
 assert.equal(simulateTicks(d('heat'),fuel,10).fuelConsumed,2);
 assert.equal(fuel.fuelUnits,2);
 assert.equal(evaluateGenerator(d('heat'),{heatPresent:true,fuelUnits:0}).status,'blocked');
});
test('contract guards and catch-up limits',()=>{
 assert.equal(CONTRACT.tickMs,1000); assert.throws(()=>simulateTicks(d('crystal'),{},61));
 assert.throws(()=>evaluateGenerator({...d('crystal'),capacity:999},{crystalPresent:true}));
});
