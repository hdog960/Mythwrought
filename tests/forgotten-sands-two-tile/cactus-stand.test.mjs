import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { openDesertCactusWitness, surveyDesertCactusStand } from '../../src/manual-biomes/forgotten-sands-cactus-stand.mjs';
import { createRestoredDesertResearchWorld } from '../../src/manual-biomes/forgotten-sands-restored-ground.mjs';
import { P0_TILE_BASE } from '../../src/manual-biomes/forgotten-sands-tile-world.mjs';

const root = process.env.P0_CURRENT_SOURCE;
assert.ok(root, 'P0_CURRENT_SOURCE must point to the pinned game source checkout');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), P0_TILE_BASE);
const load = path => import(pathToFileURL(resolve(root, path)).href);
const [P, V, H, geometry, S] = await Promise.all([
  'src/manual-biomes/profile-world.mjs', 'src/voxel.mjs', 'src/world-height.mjs',
  'src/world-height-budget.mjs', 'src/world-height-stream.mjs'
].map(load));

test('three rooted cactus ages use existing partial collision and native section meshes', () => {
  const seed = 10301, profile = P.fourRegionProfile(seed, P.M8_MOUNTAIN_GENERATOR);
  const Baseline = createRestoredDesertResearchWorld(P.FourRegionWorld, V.terrainHeight);
  const source = new Baseline(seed, profile), stands = [];
  for (const [age, range, column] of [['juvenile', [2, 3], 6], ['mature', [5, 10], 8], ['ancient', [12, 18], 9]]) {
    const choices = [-2, -1, 0, 1].map(z => surveyDesertCactusStand(source, column, z, age)).filter(Boolean);
    const stand = age === 'ancient' ? choices.find(candidate => candidate.cells.at(-1)[1] >= 20) : choices[0];
    assert.ok(stand, 'rooted ' + age);
    assert.ok(stand.height >= range[0] && stand.height <= range[1]);
    assert.equal(stand.cells.length, stand.height);
    stands.push(stand);
  }
  const candidate = openDesertCactusWitness(source, stands, H.physicalRegionAt);
  const results = [];
  for (const stand of stands) {
    const [x, y, z] = stand.support;
    assert.equal(candidate.get(...stand.support), source.get(...stand.support));
    for (const cell of stand.cells) {
      assert.equal(source.get(...cell), V.BLOCK.AIR);
      assert.equal(candidate.get(...cell), 268);
    }
    assert.deepEqual(V.raycast(candidate, [x + .5, y + stand.height + 3, z + .5], [0, -1, 0], 6)?.hit, stand.cells.at(-1));
    assert.equal(V.collides(candidate, x + .5, y + 1.01, z + .5), true);
    const cx = Math.floor(x / 16), cz = Math.floor(z / 16), topSection = H.runtimeSectionForY(y + stand.height);
    const mesh = V.meshChunk(candidate, cx, cz, topSection);
    assert.ok(mesh.byteLength > 0);
    assert.notDeepEqual(mesh, V.meshChunk(source, cx, cz, topSection));
    if (topSection > 0) {
      const player = { x: x + .5, z: z + .5, feet: y + stand.height };
      const want = S.planHeightStream(candidate, player,
        V.chunkWindow(player.x, player.z, 2).map(row => ({ ...row, section: 0 })));
      assert.ok(want.length <= 25 && want.some(row => row.cx === cx && row.cz === cz && row.section === topSection));
      assert.ok(geometry.validateUpperSectionGeometry(mesh, new Float32Array()) <= geometry.UPPER_SECTION_BYTES);
    }
    results.push({ age: stand.age, height: stand.height, support: stand.support, topSection, bytes: mesh.byteLength });
  }
  assert.equal(source.edits.size, 0);
  assert.throws(() => candidate.save(), /separate save profile/);
  console.log('FORGOTTEN SANDS CACTUS STANDS ' + JSON.stringify(results));
});
