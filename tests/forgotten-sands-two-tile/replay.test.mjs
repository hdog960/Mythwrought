import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openP0TileWorld, P0_TILE_BASE } from '../../src/manual-biomes/forgotten-sands-tile-world.mjs';

const root = process.env.P0_CURRENT_SOURCE;
assert.ok(root, 'P0_CURRENT_SOURCE must point to the pinned game source checkout');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), P0_TILE_BASE);
const load = path => import(pathToFileURL(resolve(root, path)).href);
const [P, V, F, H, N, stream, budget, pack2, pack2Mesh] = await Promise.all([
  'src/manual-biomes/profile-world.mjs', 'src/voxel.mjs', 'src/physics.mjs', 'src/world-height.mjs',
  'src/world-height-natural-contract.mjs', 'src/world-height-stream.mjs', 'src/world-height-budget.mjs',
  'src/pack2-world.mjs', 'src/pack2-integration.mjs',
].map(load));

test('two admitted desert sites preserve their native meshes, local budgets and shared save replay', async () => {
  const seed = 10301, tiles = [[1, -1], [1, 0]];
  let epoch = 'two-tile-replay-v1';
  const options = { P, V, F, H, N, reserved: () => false, revision: () => epoch };
  const baseline = new P.FourRegionWorld(seed, P.fourRegionProfile(seed, P.M8_MOUNTAIN_GENERATOR));
  const baselineSave = JSON.stringify(baseline.save());
  const combined = await openP0TileWorld(seed, tiles, options);
  const world = new pack2.Pack2LiveWorld(combined.world);
  assert.deepEqual(combined.identity.outcomes.map(row => row.reason), ['admitted', 'admitted']);
  assert.equal(combined.placementAuthority, false);

  const isolated = await Promise.all(tiles.map(tile => openP0TileWorld(seed, [tile], options)));
  assert.deepEqual(combined.identity.sites, isolated.flatMap(site => site.identity.sites));
  for (const key of ['lower', 'upper', 'upperOwners']) {
    assert.equal(combined.counts[key], isolated.reduce((sum, site) => sum + site.counts[key], 0));
  }

  const sites = [], edits = [];
  for (const [index, witness] of combined.witnesses.entries()) {
    const single = new pack2.Pack2LiveWorld(isolated[index].world), { site } = witness;
    const cache = new Map();
    function nativeGeometry({ cx, cz, section }) {
      const key = H.runtimeMeshKey(cx, cz, section);
      if (cache.has(key)) return cache.get(key);
      const mesh = V.meshChunk(world, cx, cz, section);
      const water = pack2Mesh.pack2WaterSectionVertices(world, cx, cz, section);
      assert.deepEqual(mesh, V.meshChunk(single, cx, cz, section));
      assert.deepEqual(water, pack2Mesh.pack2WaterSectionVertices(single, cx, cz, section));
      const bytes = section > 0 ? budget.validateUpperSectionGeometry(mesh, water) : mesh.byteLength + water.byteLength;
      cache.set(key, bytes);
      return bytes;
    }
    for (const row of [witness.lower, witness.upper]) {
      const [x, y, z, id] = row;
      assert.equal(baseline.get(x, y, z), 0);
      assert.equal(world.get(x, y, z), id);
      assert.ok(nativeGeometry({ cx: Math.floor(x / 16), cz: Math.floor(z / 16), section: H.runtimeSectionForY(y) }) > 0);
      edits.push(row);
    }

    const windows = [15, 19, 30].map(feet => {
      const player = { x: site.x - 16.5, z: site.z + .5, feet };
      const legacy = V.chunkWindow(player.x, player.z, 2).map(owner => ({ ...owner, section: 0 }));
      const wanted = stream.planHeightStream(world, player, legacy);
      assert.deepEqual(wanted, stream.planHeightStream(single, player, legacy));
      assert.ok(wanted.length <= 25);
      const keys = new Set(wanted.map(({ cx, cz, section }) => H.runtimeMeshKey(cx, cz, section)));
      assert.ok(H.physicalBodyRegions(player).every(owner => keys.has(owner.key)));
      let upperOwners = 0, upperBytes = 0;
      for (const owner of wanted) {
        const bytes = nativeGeometry(owner);
        if (owner.section > 0 && bytes > 0) {
          upperOwners++;
          upperBytes += bytes;
        }
      }
      assert.ok(upperOwners <= budget.UPPER_GPU_OWNERS && upperBytes <= budget.UPPER_RESIDENT_BYTES);
      return { feet, owners: wanted.length, upperOwners, upperBytes };
    });
    let top = 17 + site.height;
    while (top >= 20 && !world.get(site.x, top, site.z)) top--;
    assert.ok(top >= 20);
    assert.deepEqual(V.raycast(world, [site.x + .5, top + 2.5, site.z + .5], [0, -1, 0])?.hit, [site.x, top, site.z]);
    assert.ok(V.collides(world, site.x + .5, top + .1, site.z + .5));
    sites.push({ center: [site.x, site.z], top, uniqueMeshPairs: cache.size, windows });
  }

  for (const [x, y, z] of edits) assert.ok(combined.world.set(x, y, z, 0));
  const payload = JSON.parse(JSON.stringify(combined.portable()));
  assert.equal(payload.world.edits.length, 4);
  const cold = await openP0TileWorld(seed, tiles.toReversed(), options);
  assert.deepEqual(cold.identity, combined.identity);
  assert.throws(() => isolated[0].restore(payload), /identity/i);
  const restored = cold.restore(payload);
  assert.deepEqual(restored.save(), combined.world.save());
  for (const [x, y, z, id] of edits) {
    assert.equal(restored.get(x, y, z), 0);
    assert.ok(restored.set(x, y, z, id));
  }
  assert.equal(restored.edits.size, 0);
  assert.equal(JSON.stringify(baseline.save()), baselineSave);
  epoch = 'two-tile-replay-v2';
  assert.throws(() => cold.restore(payload), /Stale/);
  console.log('P0 TWO TILES ' + JSON.stringify({ seed, tiles, manifest: combined.identity.manifestSha,
    counts: combined.counts, sites, portableEdits: edits.length }));
});
