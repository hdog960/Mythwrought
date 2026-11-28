import assert from 'node:assert/strict';
import test from 'node:test';
import { BLOCK, chunkWindow, collides, meshChunk } from '../src/voxel.mjs';
import { Pack2LiveWorld } from '../src/pack2-world.mjs';
import { pack2WaterSectionVertices } from '../src/pack2-integration.mjs';
import { runtimeMeshKey, runtimeSectionForY } from '../src/world-height.mjs';
import { validateUpperSectionGeometry, UPPER_GPU_OWNERS, UPPER_RESIDENT_BYTES } from '../src/world-height-budget.mjs';
import { planHeightStream } from '../src/world-height-stream.mjs';
import { ShatteredPeaksStrataWorld } from '../src/manual-biomes/shattered-peaks-strata.mjs';
import { openSkywaterPoolWitness, surveySkywaterPool } from '../src/manual-biomes/shattered-peaks-skywater.mjs';

test('Skywater headwater pools use native upper water with a fully sealed rocky bank', () => {
  const results = [];
  for (const [seed, x, z, level] of [[179, -361, 34, 38], [19777, -374, 121, 41]]) {
    const terrain = new ShatteredPeaksStrataWorld(seed), pool = surveySkywaterPool(terrain, x, z);
    assert.ok(pool);
    assert.deepEqual(pool.origin, [x, level, z]);
    assert.equal(pool.cells.length, 9);
    assert.equal(pool.cuts.length, 9);
    assert.equal(pool.sill.length, 5);
    assert.equal(pool.shores.length, 7);
    const world = openSkywaterPoolWitness(terrain, pool), dry = new Pack2LiveWorld(terrain);
    for (const [a, y, b] of pool.cells) {
      assert.equal(world.get(a, y, b), 76);
      assert.deepEqual(world.getPack2State(a, y, b), { id: 76, level: 0, flow: 'still', source: true });
      assert.notEqual(world.get(a, y - 1, b), BLOCK.AIR);
      for (const [dx, dz] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        assert.notEqual(world.get(a + dx, y, b + dz), BLOCK.AIR);
      }
    }
    assert.equal(collides(dry, x + .5, level + .04, z + .5), true);
    assert.equal(collides(world, x + .5, level + .04, z + .5), false);
    assert.equal(collides(world, x + .5, level - .04, z + .5), true);
    assert.ok(pool.cuts.every(point => terrain.originalNatural(...point) === BLOCK.AIR));
    assert.ok(pool.sill.every(point => terrain.get(...point) === BLOCK.AIR && world.get(...point) !== BLOCK.AIR));

    const [sx, sz] = pool.shores[0], feet = terrain.terraceColumn(sx, sz).topY + 1;
    const player = { x: sx + .5, z: sz + .5, feet };
    assert.equal(collides(world, player.x, feet + .01, player.z), false);
    assert.equal(collides(world, player.x, feet - .02, player.z), true);
    const floor = chunkWindow(player.x, player.z, 2).map(owner => ({ ...owner, section: 0 }));
    const chosen = planHeightStream(world, player, floor);
    const waterKeys = new Set(pool.cells.map(([x, y, z]) =>
      runtimeMeshKey(Math.floor(x / 16), Math.floor(z / 16), runtimeSectionForY(y))));
    assert.ok([...waterKeys].every(key => chosen.some(({ cx, cz, section }) => runtimeMeshKey(cx, cz, section) === key)));
    let waterBytes = 0, upperBytes = 0, upperOwners = 0;
    for (const { cx, cz, section } of chosen.filter(owner => owner.section > 0)) {
      const fluid = pack2WaterSectionVertices(world, cx, cz, section);
      const opaque = meshChunk(world, cx, cz, section);
      const bytes = validateUpperSectionGeometry(opaque, fluid);
      if (bytes) upperOwners++;
      upperBytes += bytes;
      waterBytes += fluid.byteLength;
      if (fluid.length) {
        assert.equal(pack2WaterSectionVertices(dry, cx, cz, section).byteLength, 0);
        assert.notDeepEqual(opaque, meshChunk(dry, cx, cz, section));
      }
    }
    assert.ok(waterBytes > 0 && chosen.length <= 25 && upperOwners <= UPPER_GPU_OWNERS && upperBytes <= UPPER_RESIDENT_BYTES);
    assert.equal(terrain.edits.size, 0);
    assert.throws(() => world.base.save(), /separate world profile/);
    assert.ok(terrain.set(x, level, z, BLOCK.WOOD));
    assert.equal(surveySkywaterPool(terrain, x, z), null);
    results.push({ seed, level, waterCells: pool.cells.length, nativeShore: pool.shores.length,
      upperOwners, upperBytes, waterBytes, waterKeys: [...waterKeys] });
  }
  console.log('SHATTERED PEAKS SKYWATER POOLS ' + JSON.stringify(results));
});
