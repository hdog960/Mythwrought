import test from 'node:test';
import assert from 'node:assert/strict';
import { classifyPaths, laneForPath, LANES } from '../../scripts/ci/scope.mjs';

test('recognizes exactly the five manual pack lanes', () => {
  for (let i = 1; i <= 5; i++) {
    const lane = `pack-${i}`;
    assert.equal(laneForPath(`src/block-packs/${lane}/manifest.json`), lane);
    assert.equal(laneForPath(`tests/block-packs/${lane}/geometry.test.mjs`), lane);
  }
});

test('recognizes four independent building lanes and their owned docs', () => {
  for (let i = 1; i <= 4; i++) {
    const lane = `roadmap-${i}`;
    for (const root of ['src', 'tests', 'docs']) {
      assert.equal(laneForPath(`${root}/building-pool/${lane}/manifest.json`), lane);
    }
  }
});

test('isolated changes run only their corresponding lane suites', () => {
  assert.deepEqual(classifyPaths([
    'src/block-packs/pack-3/geometry.mjs',
    'tests/block-packs/pack-3/geometry.test.mjs',
  ]), { mode: 'isolated', lanes: ['pack-3'], reason: 'exclusive-lane-paths-only' });
  assert.deepEqual(classifyPaths([
    'src/building-pool/roadmap-4/manifest.json',
    'src/block-packs/pack-1/manifest.mjs',
  ]).lanes, ['pack-1', 'roadmap-4']);
});

test('all shared engine, saves, CI, automation and unknown paths force full verification', () => {
  for (const path of [
    'src/main.mjs', 'src/voxel.mjs', 'src/blocks.mjs',
    'tests/browser-smoke.mjs', 'index.html', 'package.json',
    '.github/workflows/ci.yml', 'scripts/ci/select-scope.mjs',
    'docs/INTEGRATION_CHECKPOINTS.md', 'src/biome130/ice.mjs',
    'docs/block-packs/pack-1/notes.md',
    'src/block-packs/pack-6/test.mjs',
    'src/building-pool/roadmap-5/test.mjs',
    'src/block-packs/pack-1/../pack-2/test.mjs',
    'README.md',
  ]) {
    assert.equal(classifyPaths(['src/block-packs/pack-1/a.mjs', path]).mode, 'full', path);
  }
});

test('missing change lists and suspicious names fail closed', () => {
  assert.equal(classifyPaths([]).mode, 'full');
  assert.equal(classifyPaths(null).mode, 'full');
  assert.equal(classifyPaths(['src/block-packs/pack-1/a\nb.mjs']).mode, 'full');
  assert.equal(classifyPaths(['src\\block-packs\\pack-1\\a.mjs']).mode, 'full');
  assert.equal(LANES.length, 9);
});
