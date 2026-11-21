import test from 'node:test';
import assert from 'node:assert/strict';
import {describeGenerator} from '../src/resonance/generation24/index.mjs';
import {ENVIRONMENT_BRIDGE,evaluateObservedGenerators} from '../src/resonance/generation24/environment-bridge.mjs';
const c=describeGenerator({id:'c',model:'crystal',seed:8,anchor:[0,0,0]});
const w=describeGenerator({id:'w',model:'waterwheel',seed:8,anchor:[1,0,0]});
const values={c:{crystalPresent:true},w:{waterPresent:true,flow:1}};
const provider=(g,t)=>({authority:ENVIRONMENT_BRIDGE,verified:true,observedTick:t,instanceKey:g.instanceKey,values:values[g.id]});
test('authoritative opt-in mixed sources produce bounded network-facing output',()=>{
 const r=evaluateObservedGenerators([c,w],provider,11);
 assert.equal(r.totals.availablePerTick,8);assert.equal(r.outputs.length,2);
 assert.equal(r.fuelCommit,'external-required');assert.equal(Object.isFrozen(r.outputs),true);
});
test('unverified, stale, wrong-owner and missing evidence fail closed',()=>{
 for(const mutation of [()=>null,(g,t)=>({...provider(g,t),verified:false}),
 (g,t)=>({...provider(g,t),observedTick:t-1}),
 (g,t)=>({...provider(g,t),instanceKey:'other'}),
 (g,t)=>({...provider(g,t),authority:'untrusted'})])
 assert.throws(()=>evaluateObservedGenerators([c],mutation,11));
});
test('duplicate anchored generators and invalid batches rejected',()=>{
 assert.throws(()=>evaluateObservedGenerators([c,c],provider,11));
 assert.throws(()=>evaluateObservedGenerators([c],provider,-1));
 assert.throws(()=>evaluateObservedGenerators(Array(129).fill(c),provider,11));
});
test('blocked natural source never invents output',()=>{
 const blocked=(g,t)=>({...provider(g,t),values:{waterPresent:false,flow:0}});
 const r=evaluateObservedGenerators([w],blocked,4);
 assert.equal(r.totals.availablePerTick,0);assert.equal(r.outputs[0].status,'blocked');
});
