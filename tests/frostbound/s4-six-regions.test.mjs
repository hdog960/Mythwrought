import test from 'node:test';
import assert from 'node:assert/strict';
import { FrostboundSixRegionsCandidate, silverwoodWeight, blackfrostWeight } from '../../src/frostbound/s4-silverwood-barrens.mjs';
import { FrostboundMirrorfrostCandidate, mirrorfrostWeight } from '../../src/frostbound/s4-mirrorfrost-basin.mjs';
import { glacierlandsWeight } from '../../src/frostbound/s4-glacierlands.mjs';
import { whiteExpanseWeight } from '../../src/frostbound/s4-white-expanse.mjs';
import { frostwoodWeight } from '../../src/frostbound/s4-frostwood.mjs';
import { meshChunk, raycast } from '../../src/voxel.mjs';

test('Silverwood and Blackfrost Barrens add distinct physical woodland without changing earlier subregion cores', () => {
  const report = [];
  for (const seed of [42, 10301, -28480]) {
    const world = new FrostboundSixRegionsCandidate(seed), base = new FrostboundMirrorfrostCandidate(seed);
    const silver = { core: 0, total: 0, signature: 0, caps: 0 }, barrens = { core: 0, total: 0, signature: 0, caps: 0 };
    let olderCores = 0, baselineBarrensTrees = 0, protectedAncient = 0;
    const treeWitnesses = new Map();
    for (let cx = -16; cx <= 16; cx++) for (let cz = 19; cz <= 48; cz++) {
      const x = cx * 16 + 8, z = cz * 16 + 8;
      const a = silverwoodWeight(x, z, seed), b = blackfrostWeight(x, z, seed);
      assert.ok(a * b === 0);
      const before = base.forestChunk(cx, cz).site, after = world.forestChunk(cx, cz).site;
      const priority = Math.max(...[frostwoodWeight, whiteExpanseWeight, glacierlandsWeight, mirrorfrostWeight]
        .map(weight => weight(x, z, seed)));
      if (priority >= .75) {
        olderCores++;
        assert.equal(a + b, 0);
        assert.deepEqual(after, before);
      }
      if (before?.reservation === 'ancient') {
        protectedAncient++;
        assert.deepEqual(after, before);
      }
      if (a < .75 && b < .75) continue;
      const counts = a >= .75 ? silver : barrens;
      const family = a >= .75 ? 'silverbirch' : 'blackfrost';
      const ownWeight = a >= .75 ? silverwoodWeight : blackfrostWeight;
      counts.core++;
      counts.total += Number(Boolean(after));
      counts.signature += Number(after?.family === family);
      if (counts === barrens) baselineBarrensTrees += Number(Boolean(before));
      if (after?.family === family && !treeWitnesses.has(family)) {
        const site = world.forestChunk(cx, cz);
        const root = [after.x, after.floor + 1, after.z];
        assert.ok(site.cells.get(root.join(',')));
        assert.ok(world.get(after.x, after.floor, after.z));
        assert.ok(world.get(...root));
        treeWitnesses.set(family, root);
      }

      for (const [dx, dz] of [[-5, -5], [5, -5], [0, 0], [-5, 5], [5, 5]]) {
        const px = x + dx, pz = z + dz, column = base._columnPlan(px, pz);
        if (!column.size || ownWeight(px, pz, seed) < .65) continue;
        const y = Math.max(...column.keys()), original = base.get(px, y, pz), block = world.get(px, y, pz);
        if (original === block) continue;
        assert.deepEqual([original, block], counts === silver ? [279, 272] : [272, 279]);
        assert.equal(world.get(px, y - 1, pz), base.get(px, y - 1, pz));
        for (const dy of [-1, 0, 1]) assert.equal(world.environmentCaves.get(px, y + dy, pz), undefined);
        if (world.get(px, y + 1, pz) === 0) {
          assert.deepEqual(raycast(world, [px + .5, y + 1.2, pz + .5], [0, -1, 0], 2)?.hit, [px, y, pz]);
        }
        counts.caps++;
      }
    }
    assert.ok(silver.core && barrens.core && olderCores && protectedAncient);
    assert.ok(silver.signature > silver.total / 2 && barrens.signature > barrens.total / 2);
    assert.ok(barrens.total < baselineBarrensTrees * .65);
    assert.equal(treeWitnesses.size, 2);
    assert.deepEqual(meshChunk(world, 0, 0), meshChunk(base, 0, 0));
    assert.deepEqual(meshChunk(world, 32, 0), meshChunk(base, 32, 0));
    report.push({ seed, silver, barrens, baselineBarrensTrees, olderCores, protectedAncient,
      treeWitnesses: Object.fromEntries(treeWitnesses) });
  }
  assert.ok(report.some(row => row.silver.caps > 0));
  assert.ok(report.every(row => row.barrens.caps > 0));
  console.log('FROSTBOUND SIX REGIONS ' + JSON.stringify(report));
});
