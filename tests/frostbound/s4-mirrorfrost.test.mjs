import test from 'node:test';
import assert from 'node:assert/strict';
import { FrostboundMirrorfrostCandidate, mirrorfrostWeight } from '../../src/frostbound/s4-mirrorfrost-basin.mjs';
import { FrostboundGlacierlandsCandidate, glacierlandsWeight } from '../../src/frostbound/s4-glacierlands.mjs';
import { frostwoodWeight } from '../../src/frostbound/s4-frostwood.mjs';
import { whiteExpanseWeight } from '../../src/frostbound/s4-white-expanse.mjs';
import { collides, meshChunk, raycast } from '../../src/voxel.mjs';

const sides = [[-1, 0], [1, 0], [0, -1], [0, 1]];

test('Mirrorfrost Basin creates clear ice on existing level shelves and protects the neighboring cores', () => {
  const report = [];
  for (const seed of [42, 10301, -28480]) {
    const world = new FrostboundMirrorfrostCandidate(seed), original = new FrostboundGlacierlandsCandidate(seed);
    let checked = 0, ice = 0, protectedCenters = 0, lake;
    for (let cx = -3; cx <= 16; cx++) for (let cz = 13; cz <= 35; cz++) {
      const x = cx * 16 + 8, z = cz * 16 + 8;
      const weight = mirrorfrostWeight(x, z, seed);
      const protectedWeight = Math.max(frostwoodWeight(x, z, seed), whiteExpanseWeight(x, z, seed), glacierlandsWeight(x, z, seed));
      if (protectedWeight >= .75) {
        protectedCenters++;
        assert.equal(weight, 0);
        assert.deepEqual(world.forestChunk(cx, cz).site, original.forestChunk(cx, cz).site);
      }
      if (!weight) continue;
      for (const dx of [-6, -2, 2, 6]) for (const dz of [-6, -2, 2, 6]) {
        checked++;
        const a = x + dx, b = z + dz, column = original._columnPlan(a, b);
        if (!column.size) continue;
        const y = Math.max(...column.keys()), prior = original.get(a, y, b);
        if (world.get(a, y, b) === prior) continue;
        ice++;
        assert.equal(world.get(a, y, b), 275);
        assert.ok([272, 276, 279].includes(prior));
        assert.equal(world.get(a, y - 1, b), original.get(a, y - 1, b));
        assert.equal(world.get(a, y + 1, b), original.get(a, y + 1, b));
        for (const [sx, sz] of sides) {
          assert.ok([272, 276, 279].includes(original.get(a + sx, y, b + sz)));
          for (const dy of [-1, 0, 1]) assert.equal(world.environmentCaves.get(a + sx, y + dy, b + sz), undefined);
        }
        if (!collides(world, a + .5, y + 1, b + .5) &&
          sides.every(([sx, sz]) => world.get(a + sx, y, b + sz) === 275)) lake ??= [a, y, b];
      }
    }
    assert.ok(checked > 0 && ice > 0 && protectedCenters > 0 && lake);
    const [x, y, z] = lake;
    assert.ok(collides(world, x + .5, y + .95, z + .5));
    assert.deepEqual(raycast(world, [x + .5, y + 1.5, z + .5], [0, -1, 0], 2)?.hit, lake);
    assert.deepEqual(meshChunk(world, 0, 0), meshChunk(original, 0, 0));
    assert.deepEqual(meshChunk(world, 32, 0), meshChunk(original, 32, 0));
    assert.throws(() => world.save(), /not a registered/);
    report.push({ seed, checked, ice, protectedCenters, lake });
  }
  console.log('MIRRORFROST ' + JSON.stringify(report));
});
