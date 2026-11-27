import test from 'node:test';
import assert from 'node:assert/strict';
import { describeGenerator } from '../src/resonance/generation24/index.mjs';
import { exportGeneratorOutput, validateGeneratorOutputs } from '../src/resonance/generation24/output-handoff.mjs';
const crystal = describeGenerator({id:'c1',model:'crystal',seed:12,anchor:[1,2,3]});
const wheel = describeGenerator({id:'w1',model:'waterwheel',seed:12,anchor:[2,2,3]});
const observation=(tick,values)=>({verified:true,observedTick:tick,values});
test('verified crystal output is deterministic and fuel-independent',()=>{
 const a=exportGeneratorOutput(crystal,observation(8,{crystalPresent:true}),8);
 assert.equal(a.availablePerTick,3); assert.equal(a.fuelCostPerTick,0);
 assert.deepEqual(a,exportGeneratorOutput(crystal,observation(8,{crystalPresent:true}),8));
});
test('missing, stale and forged observations fail closed',()=>{
 for(const bad of [{verified:false,observedTick:8,values:{crystalPresent:true}},
 {verified:true,observedTick:7,values:{crystalPresent:true}},{}])
 assert.throws(()=>exportGeneratorOutput(crystal,bad,8));
});
test('blocked environmental source contributes zero without fake flow',()=>{
 const blocked=exportGeneratorOutput(wheel,observation(8,{waterPresent:false,flow:0}),8);
 assert.equal(blocked.availablePerTick,0);
 assert.equal(validateGeneratorOutputs([blocked],8).availablePerTick,0);
});
test('mixed outputs add capacity but reject duplicates, stale ticks and tampering',()=>{
 const a=exportGeneratorOutput(crystal,observation(8,{crystalPresent:true}),8);
 const b=exportGeneratorOutput(wheel,observation(8,{waterPresent:true,flow:1}),8);
 assert.equal(validateGeneratorOutputs([a,b],8).availablePerTick,8);
 assert.throws(()=>validateGeneratorOutputs([a,a],8));
 assert.throws(()=>validateGeneratorOutputs([a],9));
 assert.throws(()=>validateGeneratorOutputs([{...a,availablePerTick:999}],8));
});
