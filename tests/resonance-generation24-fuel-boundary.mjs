import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateChainedBudget, CHAINED_BUDGET } from '../src/resonance/generation24/chained-budget.mjs';
import { describeGenerator, CONTRACT } from '../src/resonance/generation24/index.mjs';

const heat = describeGenerator({id:'heat',model:'heat',seed:1,anchor:[0,0,0]});
const keys = [heat.instanceKey];
const checkpoint = (nextTick, fuelRequiredCandidate) => ({
  signature: CHAINED_BUDGET, sourceContract: CONTRACT.id, nextTick, keys,
  generatedCandidate: 0, fuelRequiredCandidate,
  remainingReservations: [{instanceKey:heat.instanceKey,units:0}]
});
test('reject unsafe product of elapsed ticks and heat count before calling provider', () => {
  const unsafeTick = Number.MAX_SAFE_INTEGER;
  assert.throws(() => evaluateChainedBudget([heat], () => { throw Error('provider reached'); },
    unsafeTick, 1, checkpoint(unsafeTick, 0)), /unsafe|checkpoint/);
});
test('reject checkpoint with impossible fuel even for one heat generator', () => {
  assert.throws(() => evaluateChainedBudget([heat], () => { throw Error('provider reached'); },
    2, 1, checkpoint(2, 3)), /checkpoint/);
});
