import assert from 'node:assert/strict';
import test from 'node:test';
import { BLOCK, chunkWindow, collides, meshChunk, raycast } from '../src/voxel.mjs';
import { runtimeMeshKey, runtimeSectionForY } from '../src/world-height.mjs';
import { planHeightStream } from '../src/world-height-stream.mjs';
import { validateUpperSectionGeometry, UPPER_GPU_OWNERS, UPPER_RESIDENT_BYTES } from '../src/world-height-budget.mjs';
import { ShatteredPeaksStrataWorld } from '../src/manual-biomes/shattered-peaks-strata.mjs';
import { openSkyshardWitness, surveySkyshard } from '../src/manual-biomes/shattered-peaks-skyshard.mjs';

test('two rooted Skyshard formations preserve the mountain source and qualify native upper geometry', () => {
  const results = [];
  for (const [seed, tx, tz, root, expected] of [[179, -46, -1, [-366, 42, -6], 76], [42, -49, -3, [-388, 73, -21], 80]]) {
    const terrain = new ShatteredPeaksStrataWorld(seed), formation = surveySkyshard(terrain, tx, tz);
    assert.ok(formation);
    assert.equal(formation.name, 'The Skyshard');
    assert.deepEqual(formation.origin, root);
    assert.equal(formation.cells.length, expected);
    assert.equal(formation.footings.length, 13);
    const world = openSkyshardWitness(terrain, formation), owners = new Set();
    const crystalCount = formation.cells.filter(row => row[3] === BLOCK.CRYSTAL).length;
    assert.ok(crystalCount > formation.cells.length / 2);
    for (const [x, y, z, id] of formation.cells) {
      assert.equal(terrain.get(x, y, z), BLOCK.AIR);
      assert.equal(world.get(x, y, z), id);
      assert.notEqual(world.get(x, y - 1, z), BLOCK.AIR);
      owners.add(runtimeMeshKey(Math.floor(x / 16), Math.floor(z / 16), runtimeSectionForY(y)));
    }
    for (const [x, y, z] of formation.footings) assert.equal(world.get(x, y, z), terrain.get(x, y, z));
    const [x, y, z] = root, tip = formation.cells.reduce((top, row) => row[1] > top[1] ? row : top).slice(0, 3);
    assert.equal(tip[1], y + 12);
    assert.equal(collides(world, x + .5, y + 1.01, z + .5), true);
    assert.deepEqual(raycast(world, [tip[0] + .5, tip[1] + 4, tip[2] + .5], [0, -1, 0], 7)?.hit, tip);
    assert.equal(surveySkyshard(terrain, tx, tz, { reservedAt: (...cell) => cell.every((value, i) => value === tip[i]) }), null);
    const pose = { x: x + .5, feet: y + 5, z: z + 5.5 };
    const chosen = planHeightStream(world, pose, chunkWindow(pose.x, pose.z, 2).map(owner => ({ ...owner, section: 0 })));
    assert.ok([...owners].every(key => chosen.some(row => runtimeMeshKey(row.cx, row.cz, row.section) === key)));
    let upperOwners = 0, upperBytes = 0;
    for (const { cx, cz, section } of chosen.filter(owner => owner.section > 0)) {
      const mesh = meshChunk(world, cx, cz, section), bytes = validateUpperSectionGeometry(mesh, new Float32Array());
      upperOwners += Number(bytes > 0);
      upperBytes += bytes;
      if (owners.has(runtimeMeshKey(cx, cz, section))) assert.notDeepEqual(mesh, meshChunk(terrain, cx, cz, section));
    }
    assert.ok(chosen.length <= 25 && upperOwners <= UPPER_GPU_OWNERS && upperBytes <= UPPER_RESIDENT_BYTES);
    assert.equal(terrain.edits.size, 0);
    assert.throws(() => world.save(), /separate save profile/);
    results.push({ seed, root, tip, cells: formation.cells.length, crystalCount, owners: [...owners], upperOwners, upperBytes });
  }
  console.log('SHATTERED PEAKS SKYSHARD ' + JSON.stringify(results));
});
