import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { on } from 'node:events';
import { Worker } from 'node:worker_threads';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { openP0TileWorld, P0_TILE_BASE } from '../../src/manual-biomes/forgotten-sands-tile-world.mjs';
import { P0_MAX_COLUMNS_PER_STEP } from '../../src/manual-biomes/forgotten-sands-grounded-probe.mjs';

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
  const slices = {}, peakGapMs = {};
  let afterSlice = performance.now();
  const combined = await openP0TileWorld(seed, tiles, { ...options, async yieldControl({ stage, columns, frames }) {
    peakGapMs[stage] = Math.max(peakGapMs[stage] ?? 0, Math.round(performance.now() - afterSlice));
    slices[stage] = (slices[stage] ?? 0) + 1;
    if (columns !== undefined) assert.ok(columns >= 0 && columns <= P0_MAX_COLUMNS_PER_STEP);
    if (frames !== undefined) assert.ok(frames > 0 && frames <= 120);
    await new Promise(resolve => setImmediate(resolve));
    afterSlice = performance.now();
  } });
  assert.deepEqual(Object.keys(slices).sort(), ['approach', 'assemble', 'native-scan', 'survey', 'walk']);
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
    counts: combined.counts, sites, portableEdits: edits.length, slices, peakGapMs }));
});

test('a reservation revision during the second tile discards the pending source', async () => {
  let epoch = 'build-r1', firstTileSliced = false, secondTileInterrupted = false;
  await assert.rejects(openP0TileWorld(10301, [[1, -1], [1, 0]], {
    P, V, F, H, N, reserved: () => false, revision: () => epoch,
    async yieldControl({ stage, tile }) {
      await new Promise(resolve => setImmediate(resolve));
      if (stage !== 'assemble') return;
      if (tile[1] === -1) firstTileSliced = true;
      if (tile[1] === 0) {
        secondTileInterrupted = true;
        epoch = 'build-r2';
      }
    },
  }), /Stale detached tile world/);
  assert.ok(firstTileSliced && secondTileInterrupted);
});

test('cold tile-worker construction transfers exact meshes and retires canceled builds', async () => {
  const worker = new Worker(new URL('./source-worker.mjs', import.meta.url), { workerData: { root } });
  const stream = on(worker, 'message', { signal: AbortSignal.timeout(30000) });
  let hostTicks = 0;
  const timer = setInterval(() => hostTicks++, 5);
  const observed = [];
  async function expect(type, id) {
    for (;;) {
      const { value: [message] } = await stream.next();
      observed.push({ type: message.type, id: message.id });
      if (message.type === 'failed') throw Error(message.message);
      if (message.type === type && message.id === id) return message;
    }
  }
  const seed = 10301, tiles = [[1, -1], [1, 0]], revision = 'two-tile-replay-v1';
  try {
    worker.postMessage({ type: 'build', id: 1, seed, tiles, revision });
    assert.deepEqual((await expect('assembling', 1)).tile, tiles[0]);
    worker.postMessage({ type: 'cancel', id: 1 });
    await expect('canceled', 1);
    worker.postMessage({ type: 'sample', id: 1, site: 0 });
    await expect('refused', 1);

    const before = hostTicks;
    worker.postMessage({ type: 'build', id: 2, seed, tiles, revision });
    const ready = await expect('ready', 2);
    const ticksDuringBuild = hostTicks - before;
    assert.ok(ticksDuringBuild > 0, 'An active cold build must permit callbacks on the host thread');
    assert.ok(!observed.some(message => message.type === 'ready' && message.id === 1));

    const ordinary = await openP0TileWorld(seed, tiles, { P, V, F, H, N, reserved: () => false, revision: () => revision });
    assert.deepEqual(ready.identity, ordinary.identity);
    assert.deepEqual(ready.counts, ordinary.counts);
    const { manifestSha } = ready.identity;
    worker.postMessage({ type: 'sample', id: 2, site: 0, manifestSha: 'wrong' });
    await expect('refused', 2);
    let transferred = 0;
    for (const site of [0, 1]) {
      worker.postMessage({ type: 'sample', id: 2, site, manifestSha });
      const message = await expect('meshes', 2);
      assert.equal(message.site, site);
      assert.equal(message.manifestSha, manifestSha);
      assert.equal(message.meshes.length, 2);
      for (const { cx, cz, section, vertices } of message.meshes) {
        assert.ok(vertices instanceof Float32Array && vertices.byteLength > 0);
        assert.deepEqual(vertices, V.meshChunk(ordinary.world, cx, cz, section));
        transferred += vertices.byteLength;
      }
    }
    console.log('P0 TILE WORKER ' + JSON.stringify({ seed, manifestSha, transferred, ticksDuringBuild }));
  } finally {
    clearInterval(timer);
    await stream.return();
    await worker.terminate();
  }
});
