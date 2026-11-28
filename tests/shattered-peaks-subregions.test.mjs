import assert from 'node:assert/strict';
import test from 'node:test';
import { ShatteredPeaksColossalWorld } from '../src/manual-biomes/shattered-peaks-colossal.mjs';
import { planMountainSubregionAt, ShatteredPeaksSubregionWorld } from '../src/manual-biomes/shattered-peaks-subregions.mjs';
import { mountainV8Material } from '../src/manual-biomes/mountain-v8-materials.mjs';
import { v6BiomeAt } from '../src/manual-biomes/v6-balanced-biomes.mjs';
import { BLOCK, meshChunk, raycast } from '../src/voxel.mjs';
import { runtimeSectionForY } from '../src/world-height.mjs';
import { validateUpperSectionGeometry } from '../src/world-height-budget.mjs';

const targets = {
  'crown-peaks': .20, 'emerald-highlands': .25, 'broken-ridges': .20,
  'ironpine-highlands': .20, 'crystal-escarpments': .08, 'skywater-basins': .07
};

test('warped subregions approach their area targets inside the original mountain tiles', () => {
  const counts = Object.fromEntries(Object.keys(targets).map(name => [name, 0]));
  let total = 0;
  for (const seed of [42, 179, 19777, 33571, -28480]) {
    for (let z = -328; z <= 328; z += 8) for (let x = -840; x <= -184; x += 8) {
      const biome = v6BiomeAt(x, z, seed), region = planMountainSubregionAt(x, z, seed);
      if (biome?.name !== 'mountain') {
        assert.equal(region, null);
      } else if (biome.center[0] === -512 && biome.center[1] === 0) {
        assert.ok(Object.hasOwn(counts, region));
        counts[region]++;
        total++;
      }
    }
  }
  const shares = Object.fromEntries(Object.entries(counts).map(([name, count]) => [name, count / total]));
  for (const [name, target] of Object.entries(targets)) {
    assert.ok(Math.abs(shares[name] - target) < .045, name + ' sampled share ' + shares[name]);
  }
  console.log('SHATTERED PEAKS SUBREGION SHARES ' + JSON.stringify({ total, shares }));
});

test('each subregion has a native selectable cap with unchanged height and owner mesh bytes', () => {
  const seed = 42, baseline = new ShatteredPeaksColossalWorld(seed), candidate = new ShatteredPeaksSubregionWorld(seed);
  const witnesses = [
    ['broken-ridges', -512, 39, -154, 504], ['crown-peaks', -572, 71, -130, 500],
    ['crystal-escarpments', -392, 82, -34, 505], ['emerald-highlands', -584, 87, -10, 503],
    ['skywater-basins', -392, 83, 74, 500], ['ironpine-highlands', -428, 67, 122, 501]
  ];
  assert.notEqual(candidate.generationProfile.sourceVersion, baseline.generationProfile.sourceVersion);
  const results = [];
  for (const [region, x, y, z, material] of witnesses) {
    assert.equal(planMountainSubregionAt(x, z, seed), region);
    assert.equal(candidate.terraceColumn(x, z).topY, y);
    assert.equal(candidate.get(x, y, z), material);
    assert.ok(mountainV8Material(material).solid);
    assert.notEqual(baseline.get(x, y, z), material);
    assert.equal(candidate.get(x, y + 1, z), BLOCK.AIR);
    assert.deepEqual(raycast(candidate, [x + .5, y + 3, z + .5], [0, -1, 0], 5)?.hit, [x, y, z]);
    for (let wz = z - 4; wz <= z + 4; wz++) for (let wx = x - 4; wx <= x + 4; wx++) {
      const column = baseline.terraceColumn(wx, wz);
      assert.deepEqual(candidate.terraceColumn(wx, wz), column);
      for (const wy of [-8, 0, 10, 19, y - 4]) {
        if (wy !== column?.topY) assert.equal(candidate.get(wx, wy, wz), baseline.get(wx, wy, wz));
      }
    }
    const owner = [Math.floor(x / 16), Math.floor(z / 16), runtimeSectionForY(y)];
    const oldMesh = meshChunk(baseline, ...owner), newMesh = meshChunk(candidate, ...owner);
    const bytes = validateUpperSectionGeometry(newMesh, new Float32Array());
    assert.ok(bytes > 0);
    assert.equal(bytes, oldMesh.byteLength);
    assert.notDeepEqual(newMesh, oldMesh);
    results.push({ region, x, y, z, material, bytes });
  }
  assert.throws(() => candidate.save(), /research requires/);
  console.log('SHATTERED PEAKS SUBREGION CAPS ' + JSON.stringify(results));
});
