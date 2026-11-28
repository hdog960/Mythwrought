import test from 'node:test';
import assert from 'node:assert/strict';
import { describeGenerator, simulateTicks } from '../src/resonance/generation24/index.mjs';

const generator = model => describeGenerator({ id: 'g4_accounting', model, seed: 179, anchor: [1, 2, 3] });

for (const [model, inputs] of [
  ['hand', { active: false }],
  ['crystal', { crystalPresent: false }],
  ['waterwheel', { waterPresent: false, flow: 1 }],
  ['windmill', { exposed: false, wind: 1 }],
  ['heat', { heatPresent: false, fuelUnits: 10 }]
]) {
  test(model + ' blocked source accounts for zero executed ticks', () => {
    const result = simulateTicks(generator(model), inputs, 10);
    assert.equal(result.status, 'blocked');
    assert.equal(result.ticks, 0);
    assert.equal(result.generated, 0);
    assert.equal(result.fuelConsumed, 0);
  });
}

test('heat fuel exhaustion cannot over-report ticks', () => {
  const result = simulateTicks(generator('heat'), { heatPresent: true, fuelUnits: 2 }, 10);
  assert.equal(result.ticks, 2);
  assert.equal(result.fuelConsumed, 2);
  assert.equal(result.generated, 2 * result.availablePerTick);
});
