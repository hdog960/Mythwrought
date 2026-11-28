import test from 'node:test';
import assert from 'node:assert/strict';
import { FrostwoodCandidate, frostwoodWeight } from '../../src/frostbound/s4-frostwood.mjs';
import { FrostboundSceneryCandidate } from '../../src/frostbound/s3-scenery.mjs';
import { v6BiomeAt } from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import { chunkWindow, collides, meshChunk, raycast } from '../../src/voxel.mjs';
import { planHeightStream } from '../../src/world-height-stream.mjs';
import { runtimeMeshKey } from '../../src/world-height.mjs';
import { UPPER_GPU_OWNERS, UPPER_RESIDENT_BYTES, validateUpperSectionGeometry } from '../../src/world-height-budget.mjs';

const conifers = new Set(['snowpine', 'frostspire', 'glacierFir']);

test('Frostwood develops a continuous core with protected snow caps and a conifer bias', () => {
  const evidence = [];
  for (const seed of [42, 10301, -28480]) {
    const original = new FrostboundSceneryCandidate(seed), world = new FrostwoodCandidate(seed);
    const counts = { core: 0, feather: 0, outside: 0, originalConifers: 0, frostwoodConifers: 0, capSwaps: 0 };
    let witness;
    assert.notEqual(world.forestSourceVersion, original.forestSourceVersion);
    for (let cx = -13; cx <= 13; cx++) for (let cz = 19; cz <= 45; cz++) {
      const x = cx * 16 + 8, z = cz * 16 + 8, weight = frostwoodWeight(x, z, seed);
      assert.ok(weight >= 0 && weight <= 1);
      if (!weight) {
        counts.outside++;
        assert.deepEqual(world.forestChunk(cx, cz).site, original.forestChunk(cx, cz).site);
        continue;
      }
      assert.equal(v6BiomeAt(x, z, seed)?.name, 'snow');
      counts[weight === 1 ? 'core' : 'feather']++;
      if (weight === 1) {
        counts.originalConifers += Number(conifers.has(original.forestChunk(cx, cz).site?.family));
        counts.frostwoodConifers += Number(conifers.has(world.forestChunk(cx, cz).site?.family));
      }
      for (let dz = -6; dz <= 6; dz += 3) for (let dx = -6; dx <= 6; dx += 3) {
        const a = x + dx, b = z + dz, column = original._columnPlan(a, b);
        if (!column.size) continue;
        const y = Math.max(...column.keys());
        if (original.get(a, y, b) === world.get(a, y, b)) continue;
        counts.capSwaps++;
        assert.equal(original.get(a, y, b), 272);
        assert.equal(world.get(a, y, b), 279);
        assert.equal(world.get(a, y - 1, b), original.get(a, y - 1, b));
        assert.ok(frostwoodWeight(a, b, seed) > 0);
        for (const dy of [-1, 0, 1]) assert.equal(world.environmentCaves.get(a, y + dy, b), undefined);
        if (world.get(a, y + 1, b) === 0 && !collides(world, a + .5, y + 1, b + .5)) witness ??= [a, y, b];
      }
    }
    assert.ok(counts.core > 0 && counts.feather > 0 && counts.outside > 0);
    assert.ok(counts.frostwoodConifers > counts.originalConifers);
    assert.ok(counts.capSwaps > 0 && witness);
    const [x, y, z] = witness;
    assert.deepEqual(raycast(world, [x + .5, y + 1.5, z + .5], [0, -1, 0], 2)?.hit, witness);
    assert.ok(collides(world, x + .5, y + .94, z + .5));
    assert.ok(collides(original, x + .5, y + .94, z + .5));
    assert.deepEqual(meshChunk(world, 0, 0), meshChunk(original, 0, 0));
    assert.deepEqual(meshChunk(world, 32, 0), meshChunk(original, 32, 0));
    const player = { x: x + .5, feet: y + 1, z: z + .5 };
    const plan = planHeightStream(world, player, chunkWindow(player.x, player.z, 2).map(row => ({ ...row, section: 0 })));
    assert.ok(plan.length <= 25);
    const emptyWater = new Float32Array();
    let upperOwners = 0, upperBytes = 0;
    for (const row of plan.filter(row => row.section > 0)) {
      const bytes = validateUpperSectionGeometry(meshChunk(world, row.cx, row.cz, row.section), emptyWater);
      if (bytes) {
        upperOwners++;
        assert.ok(world.upperNaturalOccupied(runtimeMeshKey(row.cx, row.cz, row.section)));
      }
      upperBytes += bytes;
    }
    assert.ok(upperOwners <= UPPER_GPU_OWNERS && upperBytes <= UPPER_RESIDENT_BYTES);
    assert.throws(() => world.save(), /not a registered/);
    evidence.push({ seed, ...counts, witness, owners: plan.length, upperOwners, upperBytes });
  }
  console.log('FROSTWOOD ' + JSON.stringify(evidence));
});
