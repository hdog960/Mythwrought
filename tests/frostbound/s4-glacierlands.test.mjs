import test from 'node:test';
import assert from 'node:assert/strict';
import { FrostboundGlacierlandsCandidate, glacierlandsWeight } from '../../src/frostbound/s4-glacierlands.mjs';
import { FrostboundSubregionsCandidate, whiteExpanseWeight } from '../../src/frostbound/s4-white-expanse.mjs';
import { frostwoodWeight } from '../../src/frostbound/s4-frostwood.mjs';
import { GROUND_FAMILIES } from '../../src/frostbound/s3-ground.mjs';
import { collides, meshChunk, raycast } from '../../src/voxel.mjs';

test('Glacierlands exposes grounded glacial ice and ice-spike beds between protected snow subregions', () => {
  const report = [];
  for (const seed of [42, 10301, -28480]) {
    const world = new FrostboundGlacierlandsCandidate(seed), original = new FrostboundSubregionsCandidate(seed);
    const counts = { core: 0, iceCaps: 0, iceSpikes: 0, adjacentProtected: 0 };
    let capWitness, spikeWitness;
    for (let cx = -16; cx <= 3; cx++) for (let cz = 19; cz <= 46; cz++) {
      const x = cx * 16 + 8, z = cz * 16 + 8;
      const weight = glacierlandsWeight(x, z, seed);
      if (Math.max(frostwoodWeight(x, z, seed), whiteExpanseWeight(x, z, seed)) >= .75) {
        counts.adjacentProtected++;
        assert.equal(weight, 0);
        assert.deepEqual(world.forestChunk(cx, cz).site, original.forestChunk(cx, cz).site);
      }
      if (weight >= .75) counts.core++;
      if (!weight) continue;
      for (const [key, id] of world.groundDetails(cx, cz)) {
        if (id !== GROUND_FAMILIES.iceSpikes) continue;
        const [a, y, b] = key.split(',').map(Number);
        if (glacierlandsWeight(a, b, seed) < .58) continue;
        counts.iceSpikes++;
        assert.ok([272, 276, 279].includes(world.get(a, y - 1, b)));
        assert.equal(world.environmentCaves.get(a, y, b), undefined);
        if (world.get(a, y + 1, b) === 0) spikeWitness ??= [a, y, b];
      }
      for (const dx of [-5, 0, 5]) for (const dz of [-5, 0, 5]) {
        const a = x + dx, b = z + dz, column = original._columnPlan(a, b);
        if (!column.size) continue;
        const y = Math.max(...column.keys()), before = original.get(a, y, b);
        if (world.get(a, y, b) !== 276 || before === 276) continue;
        counts.iceCaps++;
        assert.ok(before === 272 || before === 279);
        assert.equal(world.get(a, y - 1, b), original.get(a, y - 1, b));
        for (const dy of [-1, 0, 1]) assert.equal(world.environmentCaves.get(a, y + dy, b), undefined);
        if (world.get(a, y + 1, b) === 0 && !collides(world, a + .5, y + 1, b + .5)) capWitness ??= [a, y, b];
      }
    }
    assert.ok(counts.core > 0 && counts.adjacentProtected > 0 && capWitness && spikeWitness);
    for (const [x, y, z] of [capWitness, spikeWitness]) {
      assert.deepEqual(raycast(world, [x + .5, y + 1.5, z + .5], [0, -1, 0], 2)?.hit, [x, y, z]);
    }
    assert.deepEqual(meshChunk(world, 0, 0), meshChunk(original, 0, 0));
    assert.deepEqual(meshChunk(world, 32, 0), meshChunk(original, 32, 0));
    assert.throws(() => world.save(), /not a registered/);
    report.push({ seed, ...counts, capWitness, spikeWitness });
  }
  console.log('GLACIERLANDS ' + JSON.stringify(report));
});
