import assert from 'node:assert/strict';
import test from 'node:test';
import { sampleWildsTerrainFog } from '../../src/manual-biomes/enchanted-wilds-atmosphere.mjs';
import { wildsRegionAt, WILDS_REGIONS } from '../../src/manual-biomes/enchanted-wilds-family-source.mjs';
import { v6BiomeAt } from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import { sampleSkyAtmosphere } from '../../src/sky-atmosphere.mjs';
import { sampleS6BiomeSky } from '../../src/sky-biome-adapter.mjs';
import { SKY_DAY_MS } from '../../src/world-clock.mjs';

test('Wilds fog distinguishes the five interior regions while preserving global day and night properties', () => {
  const seed = 179, interior = new Map(), snapshots = [];
  for (let z = -816; z <= -300; z += 16) for (let x = -256; x <= 288; x += 16) {
    const region = wildsRegionAt(x, z, seed);
    if (region !== null && v6BiomeAt(x, z, seed).weight === 1 && !interior.has(region)) interior.set(region, [x, z]);
  }
  assert.equal(interior.size, 5);
  for (const phase of [0, .25, .5, .75]) {
    const global = sampleSkyAtmosphere(SKY_DAY_MS * phase);
    assert.equal(sampleWildsTerrainFog(global, 0, 0, seed), global);
    const base = sampleS6BiomeSky(global, { name: 'enchanted', strength: 1 });
    const palettes = new Set();
    for (const [region, [x, z]] of interior) {
      const mood = sampleWildsTerrainFog(base, x, z, seed);
      assert.notDeepEqual(mood.fog, base.fog);
      assert.ok(mood.fog.every((channel, i) => channel >= 0 && channel <= 1 && Math.abs(channel - base.fog[i]) <= .088));
      assert.deepEqual({ ...mood, fog: base.fog }, base);
      palettes.add(mood.fog.join(','));
      if (phase === .5) snapshots.push({ name: WILDS_REGIONS[region], x, z, fog: mood.fog });
    }
    assert.equal(palettes.size, 5);
  }
  const global = sampleSkyAtmosphere(SKY_DAY_MS / 2);
  const base = sampleS6BiomeSky(global, { name: 'enchanted', strength: 1 });
  let maxLatticeJump = 0;
  for (let z = -784; z < -352; z += 16) for (let x = -256; x < 256; x += 16) {
    const fog = sampleWildsTerrainFog(base, x - .01, z, seed).fog;
    const next = sampleWildsTerrainFog(base, x + .01, z, seed).fog;
    maxLatticeJump = Math.max(maxLatticeJump, ...next.map((value, i) => Math.abs(value - fog[i])));
  }
  assert.ok(maxLatticeJump < .0003);
  console.log('WILDS TERRAIN FOG ' + JSON.stringify({ seed, snapshots, maxLatticeJump }));
});
