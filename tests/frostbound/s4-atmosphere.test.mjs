import assert from 'node:assert/strict';
import test from 'node:test';
import { sampleSkyAtmosphere } from '../../src/sky-atmosphere.mjs';
import { sampleS6BiomeSky } from '../../src/sky-biome-adapter.mjs';
import { SKY_DAY_MS } from '../../src/world-clock.mjs';
import { sampleFrostboundAtmosphere } from '../../src/frostbound/s4-atmosphere.mjs';

const seed = 42;
const coreViews = [
  [0, 512], [-84, 659], [-147, 449], [135, 379], [166, 557], [-184, 628]
];
const colors = ['horizon', 'zenith', 'fog', 'cloud', 'ridge'];
const snowSkyAt = phase => sampleS6BiomeSky(sampleSkyAtmosphere(phase),
  { name: 'snow', strength: 1 });

test('the six subregion cores have separate sky and fog while inheriting time and terrain light', () => {
  for (const phase of [0, SKY_DAY_MS / 4, SKY_DAY_MS / 2, SKY_DAY_MS * .75]) {
    const snow = snowSkyAt(phase);
    const moods = coreViews.map(([x, z]) => sampleFrostboundAtmosphere(snow, x, z, seed));
    for (const field of colors) {
      assert.equal(new Set(moods.map(mood => mood[field].join(','))).size, 6, field);
      for (const mood of moods) assert.ok(mood[field].every(value => value >= 0 && value <= 1));
    }
    for (const mood of moods) {
      for (const field of Object.keys(snow).filter(key => !colors.includes(key))) {
        assert.strictEqual(mood[field], snow[field], field);
      }
    }
  }
});

test('snow transitions are continuous and other biomes keep their exact atmosphere', () => {
  const sky = snowSkyAt(SKY_DAY_MS / 2);
  for (const [x, z] of [[0, 0], [512, 0], [-512, 0], [0, -512], [Infinity, 2]]) {
    assert.strictEqual(sampleFrostboundAtmosphere(sky, x, z, seed), sky);
  }
  const cache = new Map();
  const at = (x, z) => {
    const key = x + ',' + z;
    if (!cache.has(key)) cache.set(key, sampleFrostboundAtmosphere(sky, x, z, seed).fog);
    return cache.get(key);
  };
  // Cover the warped outer snow boundary and overlaps between all six masks.
  for (let z = 240; z <= 784; z += 4) {
    for (let x = -272; x <= 272; x += 4) {
      const original = at(x, z);
      for (const next of [at(x + 1, z), at(x, z + 1)]) {
        assert.ok(next.every((value, channel) => Math.abs(value - original[channel]) < .02),
          'fog discontinuity near ' + x + ',' + z);
      }
    }
  }
});
