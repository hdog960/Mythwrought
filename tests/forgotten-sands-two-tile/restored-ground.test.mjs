import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { createRestoredDesertResearchWorld, restoreDesertGround } from '../../src/manual-biomes/forgotten-sands-restored-ground.mjs';
import { P0_TILE_BASE } from '../../src/manual-biomes/forgotten-sands-tile-world.mjs';
import { M3_DESERT_IDS as material } from '../../src/manual-biomes/desert-m3.mjs';

const root = process.env.P0_CURRENT_SOURCE;
assert.ok(root, 'P0_CURRENT_SOURCE must point to the pinned game source checkout');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), P0_TILE_BASE);
const load = path => import(pathToFileURL(resolve(root, path)).href);
const [P, V, { v6BiomeAt }] = await Promise.all([
  'src/manual-biomes/profile-world.mjs', 'src/voxel.mjs', 'src/manual-biomes/v6-balanced-biomes.mjs'
].map(load));
const Restored = createRestoredDesertResearchWorld(P.FourRegionWorld, V.terrainHeight);

test('flat salt pockets occupy at most five cells and stay separated across signed tiles', () => {
  const original = new Map([[7, material.hardpan], [8, material.salt]]);
  const pockets = new Map(), seed = 10301;
  for (let z = -64; z < 64; z++) for (let x = -64; x < 64; x++) {
    const next = restoreDesertGround(original, { x, z, seed, legacyHeight: 8,
      biome: { name: 'desert', weight: 1 }, readNeighbor: () => original });
    assert.equal(next.get(7), material.hardpan);
    if (next.get(8) !== material.salt) continue;
    const key = Math.floor(x / 64) + ',' + Math.floor(z / 64);
    const cells = pockets.get(key) ?? [];
    cells.push([x, z]);
    pockets.set(key, cells);
  }
  assert.equal(pockets.size, 4);
  for (const cells of pockets.values()) {
    assert.equal(cells.length, 5);
    assert.ok(cells.some(([x, z]) => cells.every(([nx, nz]) => Math.abs(x - nx) + Math.abs(z - nz) <= 1)));
  }
  assert.equal(original.get(8), material.salt);
});

test('the pinned original source replaces widespread pale caps without changing the surrounding world', () => {
  const results = [];
  for (const seed of [42, 10301]) {
    const profile = P.fourRegionProfile(seed, P.M8_MOUNTAIN_GENERATOR);
    const original = new P.FourRegionWorld(seed, profile), restored = new Restored(seed, profile);
    const save = JSON.stringify(original.save()), counts = new Map();
    let paleRemoved = 0, saltRemoved = 0, oases = 0, protectedColumns = 0;
    let witness;
    for (let z = -243; z <= 245; z += 4) for (let x = 268; x <= 764; x += 4) {
      const biome = v6BiomeAt(x, z, seed);
      if (biome?.name !== 'desert' || biome.center[0] !== 512 || biome.center[1] !== 0) continue;
      const before = original._columnPlan(x, z), after = restored._columnPlan(x, z);
      if (!before.size) {
        assert.equal(after.size, 0);
        protectedColumns++;
        continue;
      }
      const oasis = original._oasisNear(x, z, 0, biome)?.columns.has(x + ',' + z);
      if (oasis) {
        assert.deepEqual(after, before);
        oases++;
        continue;
      }
      const y = Math.max(...before.keys()), cap = before.get(y), next = after.get(y);
      assert.deepEqual([...after.keys()], [...before.keys()]);
      for (const [vy, id] of before) if (vy !== y) assert.equal(after.get(vy), id);
      assert.notEqual(next, material.pale);
      if (cap === material.pale) paleRemoved++;
      if (cap === material.salt && next !== cap) saltRemoved++;
      counts.set(next, (counts.get(next) ?? 0) + 1);
      if (!witness && cap === material.pale && next === material.sandstone &&
          !V.collides(restored, x + .5, y + 1.01, z + .5)) witness = [x, y, z];
    }
    assert.ok(paleRemoved > 1000 && saltRemoved > 100);
    assert.ok(protectedColumns > 0);
    if (seed === 10301) {
      const oasis = original._oasisNear(566, 34);
      assert.deepEqual(oasis.center, [566, 4, 34]);
      for (const [key, column] of oasis.columns) {
        assert.deepEqual(restored._columnPlan(...key.split(',').map(Number)), column);
      }
      for (const [ox, oy, oz] of oasis.water) {
        assert.deepEqual(restored.environmentWaterState(ox, oy, oz),
          original.environmentWaterState(ox, oy, oz));
      }
      assert.ok(oases > 0);
    }
    for (const id of [material.red, material.hardpan, material.mud, material.sandstone, material.banded]) {
      assert.ok(counts.get(id) > 0, 'missing existing desert material ' + id);
    }
    assert.ok((counts.get(material.salt) ?? 0) < 20);
    assert.ok(witness);
    const [x, y, z] = witness;
    assert.equal(restored.get(x, y, z), material.sandstone);
    assert.equal(original.get(x, y, z), material.pale);
    assert.deepEqual(V.raycast(restored, [x + .5, y + 3, z + .5], [0, -1, 0], 5)?.hit, witness);
    const chunk = [Math.floor(x / 16), Math.floor(z / 16), 0];
    const newMesh = V.meshChunk(restored, ...chunk), oldMesh = V.meshChunk(original, ...chunk);
    assert.notDeepEqual(newMesh, oldMesh);
    assert.equal(newMesh.byteLength, oldMesh.byteLength);
    assert.deepEqual(V.meshChunk(restored, 0, 0, 0), V.meshChunk(original, 0, 0, 0));
    assert.equal(JSON.stringify(original.save()), save);
    assert.throws(() => restored.save(), /separately approved save profile/);
    results.push({ seed, paleRemoved, saltRemoved, oases, protectedColumns, witness,
      bytes: newMesh.byteLength, counts: Object.fromEntries(counts) });
  }
  console.log('RESTORED DESERT GROUND ' + JSON.stringify(results));
});
