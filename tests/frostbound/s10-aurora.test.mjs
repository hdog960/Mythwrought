import assert from 'node:assert/strict';
import test from 'node:test';
import { sampleFrostboundAurora } from '../../src/frostbound/s10-aurora.mjs';
import { sampleSkyAtmosphere } from '../../src/sky-atmosphere.mjs';
import { sampleThreeMoons } from '../../src/sky-moons.mjs';
import { sampleS5Events, S5_EVENT_TYPES } from '../../src/sky-events.mjs';
import { SKY_DAY_MS } from '../../src/world-clock.mjs';

test('the Frostbound arc shares the released rare window, moon positions and day length', () => {
  const seed = 42, site = [-160, 9, 352], rendered = [];
  const phase = .125 * SKY_DAY_MS;
  for (let day = 0; day < 106; day++) {
    const sky = sampleSkyAtmosphere(phase), lunar = sampleThreeMoons(phase, day * SKY_DAY_MS, sky.daylight);
    assert.equal(lunar.moons.length, 3);
    const event = sampleS5Events(phase, lunar, sky.daylight);
    const candidate = sampleFrostboundAurora(event, ...site, seed);
    if (event.kind !== S5_EVENT_TYPES.aurora) {
      assert.equal(candidate, event);
      continue;
    }
    assert.notDeepEqual(candidate.color, event.color);
    assert.equal(candidate.kind, event.kind);
    assert.equal(candidate.id, event.id);
    assert.equal(candidate.direction, event.direction);
    assert.equal(candidate.vector, event.vector);
    assert.equal(candidate.progress, event.progress);
    assert.ok(candidate.strength > event.strength && candidate.strength <= .90);
    assert.equal(sampleFrostboundAurora(event, 0, 10, 0, seed), event);
    assert.equal(sampleFrostboundAurora(event, site[0], -15, site[2], seed), event);
    const noon = sampleSkyAtmosphere(SKY_DAY_MS / 2);
    const daytime = sampleS5Events(noon.phaseMs, sampleThreeMoons(noon.phaseMs, day * SKY_DAY_MS, noon.daylight), noon.daylight);
    assert.equal(sampleFrostboundAurora(daytime, ...site, seed), daytime);
    rendered.push({ day, phase, color: candidate.color, strength: candidate.strength, plainStrength: event.strength });
  }
  assert.deepEqual(rendered.map(row => row.day), [18, 71]);
  console.log('FROSTBOUND LUMINOUS ARC ' + JSON.stringify(rendered));
});
