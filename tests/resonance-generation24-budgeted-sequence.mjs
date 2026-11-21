import test from 'node:test';
import assert from 'node:assert/strict';
import {describeGenerator} from '../src/resonance/generation24/index.mjs';
import {ENVIRONMENT_BRIDGE} from '../src/resonance/generation24/environment-bridge.mjs';
import {evaluateBudgetedSequence} from '../src/resonance/generation24/budgeted-sequence.mjs';
const heat=describeGenerator({id:'heater',model:'heat',seed:17,anchor:[1,2,3]});
const crystal=describeGenerator({id:'crystal',model:'crystal',seed:17,anchor:[2,2,3]});
const evidence=(g,t)=>({authority:ENVIRONMENT_BRIDGE,verified:true,observedTick:t,
 instanceKey:g.instanceKey,values:g.model==='heat'?{heatPresent:true,fuelUnits:1}:{crystalPresent:true}});
test('one reservation cannot fund three observed heat ticks',()=>{
 const x=evaluateBudgetedSequence([heat,crystal],evidence,4,3,{[heat.instanceKey]:1});
 assert.equal(x.generatedCandidate,16);
 assert.equal(x.fuelRequiredCandidate,1);
 assert.deepEqual(x.frames.map(f=>f.outputs[0].status),['available','blocked','blocked']);
 assert.equal(x.remainingReservations.find(r=>r.instanceKey===heat.instanceKey).units,0);
 assert.equal(x.delivered,false); assert.equal(x.fuelWithdrawn,false);
});
test('unreserved heat stays blocked even with repeated observed fuel claims',()=>{
 const x=evaluateBudgetedSequence([heat],evidence,0,2);
 assert.equal(x.generatedCandidate,0); assert.equal(x.fuelRequiredCandidate,0);
});
test('reject forged or stale environmental evidence',()=>{
 assert.throws(()=>evaluateBudgetedSequence([heat],(g,t)=>({...evidence(g,t),observedTick:t-1}),1,1,{[heat.instanceKey]:1}),/observation/);
});
test('reject unknown, negative and nonfuel reservations',()=>{
 assert.throws(()=>evaluateBudgetedSequence([heat],evidence,0,1,{unknown:1}),/unknown/);
 assert.throws(()=>evaluateBudgetedSequence([heat],evidence,0,1,{[heat.instanceKey]:-1}),/reservation/);
 assert.throws(()=>evaluateBudgetedSequence([crystal],evidence,0,1,{[crystal.instanceKey]:1}),/nonfuel/);
});
test('reject duplicate identities and excessive tick windows',()=>{
 assert.throws(()=>evaluateBudgetedSequence([heat,heat],evidence,0,1),/duplicate/);
 assert.throws(()=>evaluateBudgetedSequence([heat],evidence,0,61),/sequence/);
});
