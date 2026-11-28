import assert from 'node:assert/strict';
import test from 'node:test';
import { sampleUnderworldAtmosphere } from '../src/living-underworld/depth-atmosphere.mjs';
import { UNDERWORLD_LEVELS } from '../src/living-underworld/worldwide-network.mjs';

test('four depth palettes remain distinct and within the original cave fade envelope', () => {
  const surface = sampleUnderworldAtmosphere(0);
  assert.deepEqual(surface, { fog: [.053, .068, .088], light: [.76, .81, .91] });
  assert.equal(sampleUnderworldAtmosphere(-10), surface);
  assert.deepEqual(sampleUnderworldAtmosphere(-210), sampleUnderworldAtmosphere(UNDERWORLD_LEVELS.at(-1).y));
  assert.throws(() => sampleUnderworldAtmosphere(NaN), /Invalid cave atmosphere depth/);
  const rows = UNDERWORLD_LEVELS.map(({ name, y }) => ({ name, y, ...sampleUnderworldAtmosphere(y) }));
  assert.equal(new Set(rows.map(row => row.fog.join(','))).size, 4);
  assert.equal(new Set(rows.map(row => row.light.join(','))).size, 4);
  let largestChange = 0;
  for (let feet = -210; feet < -10; feet++) {
    const now = sampleUnderworldAtmosphere(feet), next = sampleUnderworldAtmosphere(feet + 1);
    assert.ok(now.fog.every(v => v >= .035 && v < .09));
    assert.ok(now.light.every(v => v >= .55 && v <= .91));
    for (const field of ['fog', 'light']) {
      largestChange = Math.max(largestChange, ...now[field].map((value, i) => Math.abs(next[field][i] - value)));
    }
  }
  assert.ok(largestChange < .009);
  console.log('LIVING UNDERWORLD DEPTH ATMOSPHERE ' + JSON.stringify({ rows, largestChange }));
});
