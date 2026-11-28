import test from 'node:test';
import assert from 'node:assert/strict';
import {describeGenerator} from '../src/resonance/generation24/index.mjs';
import {ENVIRONMENT_BRIDGE} from '../src/resonance/generation24/environment-bridge.mjs';
import {evaluateChainedBudget} from '../src/resonance/generation24/chained-budget.mjs';
const heat=describeGenerator({id:'heat',model:'heat',seed:42,anchor:[0,0,0]});
const crystal=describeGenerator({id:'crystal',model:'crystal',seed:42,anchor:[1,0,0]});
const observe=(g,t)=>({authority:ENVIRONMENT_BRIDGE,verified:true,observedTick:t,instanceKey:g.instanceKey,
 values:g.model==='heat'?{heatPresent:true,fuelUnits:1}:{crystalPresent:true}});
test('two windows cannot reuse the same heat reservation',()=>{
 const first=evaluateChainedBudget([heat,crystal],observe,0,2,null,{[heat.instanceKey]:1});
 const second=evaluateChainedBudget([heat,crystal],observe,2,2,first.checkpoint);
 assert.equal(first.window.fuelRequiredCandidate,1);
 assert.equal(second.window.fuelRequiredCandidate,0);
 assert.equal(second.checkpoint.fuelRequiredCandidate,1);
 assert.equal(second.window.generatedCandidate,6);
 assert.equal(second.delivered,false);
});
test('reject replay and gaps',()=>{
 const a=evaluateChainedBudget([heat],observe,3,1,null,{[heat.instanceKey]:1});
 assert.throws(()=>evaluateChainedBudget([heat],observe,3,1,a.checkpoint),/checkpoint/);
 assert.throws(()=>evaluateChainedBudget([heat],observe,5,1,a.checkpoint),/checkpoint/);
});
test('reject generator substitutions and reservation topups',()=>{
 const a=evaluateChainedBudget([heat],observe,0,1,null,{[heat.instanceKey]:1});
 assert.throws(()=>evaluateChainedBudget([crystal],observe,1,1,a.checkpoint),/checkpoint/);
 assert.throws(()=>evaluateChainedBudget([heat],observe,1,1,a.checkpoint,{[heat.instanceKey]:1}),/checkpoint/);
});
test('reject malformed checkpoint reservations',()=>{
 const a=evaluateChainedBudget([heat],observe,0,1,null,{[heat.instanceKey]:1});
 assert.throws(()=>evaluateChainedBudget([heat],observe,1,1,{...a.checkpoint,remainingReservations:[{instanceKey:heat.instanceKey,units:-1}]}),/reservation/);
});
