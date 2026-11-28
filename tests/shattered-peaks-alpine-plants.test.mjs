import assert from 'node:assert/strict';
import test from 'node:test';
import { BLOCK, chunkWindow, collides, meshChunk, raycast } from '../src/voxel.mjs';
import { runtimeMeshKey, runtimeSectionForY } from '../src/world-height.mjs';
import { planHeightStream } from '../src/world-height-stream.mjs';
import { validateUpperSectionGeometry, UPPER_GPU_OWNERS, UPPER_RESIDENT_BYTES } from '../src/world-height-budget.mjs';
import { ShatteredPeaksStrataWorld } from '../src/manual-biomes/shattered-peaks-strata.mjs';
import { openShatteredAlpinePlantWitness, surveyShatteredAlpinePlant } from '../src/manual-biomes/shattered-peaks-alpine-plants.mjs';

test('existing V8 flower and heather silhouettes remain passable on native upper meadows', () => {
  const results = [];
  const terrain = new ShatteredPeaksStrataWorld(179);
  for (const [tx, tz, kind, ids] of [[-82, 18, 'low-heather', [509, 510]], [-81, 18, 'alpine-flower', [507, 508]]]) {
    const specimen = surveyShatteredAlpinePlant(terrain, tx, tz);
    assert.equal(specimen?.kind, kind);
    assert.equal(specimen.region, 'emerald-highlands');
    assert.deepEqual(specimen.cells.map(cell => cell[3]), ids);
    assert.deepEqual(surveyShatteredAlpinePlant(terrain, tx, tz), specimen);
    const world = openShatteredAlpinePlantWitness(terrain, specimen), [x, y, z] = specimen.support;
    assert.equal(world.get(x, y, z), terrain.get(x, y, z));
    assert.equal(collides(world, x + .5, y + 1.01, z + .5), false);
    assert.equal(collides(world, x + .5, y + .99, z + .5), true);
    for (const [a, b, c, id] of specimen.cells) {
      assert.equal(terrain.get(a, b, c), BLOCK.AIR);
      assert.equal(world.get(a, b, c), id);
      assert.equal(surveyShatteredAlpinePlant(terrain, tx, tz, { reservedAt: (k, l, m) =>
        k === a && l === b && m === c }), null);
    }
    const target = raycast(world, [x + .5, y + 4, z + .5], [0, -1, 0], 5);
    assert.deepEqual(target?.hit, [x, y + 2, z]);
    const pose = { x: x + .5, feet: y + 1, z: z + .5 }, section = runtimeSectionForY(y + 2);
    const legacy = chunkWindow(pose.x, pose.z, 2).map(owner => ({ ...owner, section: 0 }));
    const owners = planHeightStream(world, pose, legacy);
    const ownerKey = runtimeMeshKey(Math.floor(x / 16), Math.floor(z / 16), section);
    let upperBytes = 0, upperOwners = 0, specimenBytes = 0;
    for (const { cx, cz, section } of owners.filter(owner => owner.section > 0)) {
      const candidate = meshChunk(world, cx, cz, section);
      const bytes = validateUpperSectionGeometry(candidate, new Float32Array());
      upperBytes += bytes;
      upperOwners += Number(bytes > 0);
      if (runtimeMeshKey(cx, cz, section) === ownerKey) specimenBytes = bytes - meshChunk(terrain, cx, cz, section).byteLength;
    }
    assert.ok(specimenBytes > 0 && owners.length <= 25 && upperOwners <= UPPER_GPU_OWNERS && upperBytes <= UPPER_RESIDENT_BYTES);
    assert.equal(terrain.edits.size, 0);
    assert.throws(() => world.save(), /separate save profile/);
    results.push({ kind, region: specimen.region, support: specimen.support, ids, ownerKey, specimenBytes, upperOwners, upperBytes });
  }
  console.log('SHATTERED PEAKS ALPINE PLANTS ' + JSON.stringify(results));
});
