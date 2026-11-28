import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateChainedBudget, CHAINED_BUDGET } from '../src/resonance/generation24/chained-budget.mjs';
import { CONTRACT } from '../src/resonance/generation24/index.mjs';
// Malformed checkpoint must fail before invoking any external observation provider.
const base = {signature:CHAINED_BUDGET,sourceContract:CONTRACT.id,nextTick:3,keys:[],generatedCandidate:0,fuelRequiredCandidate:0,remainingReservations:[]};
const fail = patch => assert.throws(() => evaluateChainedBudget([],()=>{throw Error('provider invoked')},3,1,{...base,...patch}),/checkpoint|accounting/);
test('rejects NaN, infinity and negative cumulative energy',()=>{for(const v of [NaN,Infinity,-Infinity,-1])fail({generatedCandidate:v});});
test('rejects sub-micro-unit overflow in cumulative energy',()=>fail({generatedCandidate:Number.MAX_VALUE}));
test('rejects fuel count greater than elapsed ticks',()=>fail({fuelRequiredCandidate:4}));
test('accepts bounded empty checkpoint without observations',()=>{const result=evaluateChainedBudget([],()=>{throw Error('provider invoked')},3,1,base);assert.equal(result.checkpoint.nextTick,4);});
