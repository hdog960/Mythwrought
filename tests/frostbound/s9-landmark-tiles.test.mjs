import assert from 'node:assert/strict';
import test from 'node:test';
import { BLOCK } from '../../src/voxel.mjs';
import { FrostboundSixRegionsCandidate } from '../../src/frostbound/s4-silverwood-barrens.mjs';
import { surveyGlacierBridgeTile } from '../../src/frostbound/s9-landmark-tiles.mjs';

function survey(world, tx, tz, limit) {
  let cursor = null, probes = 0, slices = 0;
  for (;;) {
    const result = surveyGlacierBridgeTile(world, tx, tz, { cursor, limit });
    assert.ok(result.probes >= 0 && result.probes <= limit);
    probes += result.probes;
    slices++;
    if (result.state !== 'pending') return { ...result, probes, slices };
    assert.equal(result.cursor.next, probes);
    cursor = JSON.parse(JSON.stringify(result.cursor));
  }
}

test('Glacier Bridge placement is sparse and stable across tiles, seeds and work schedules', () => {
  const world = new FrostboundSixRegionsCandidate(42), cold = new FrostboundSixRegionsCandidate(42);
  const first = survey(world, -1, 2, 13), resumed = survey(cold, -1, 2, 64);
  assert.equal(first.state, 'admitted');
  assert.equal(first.probes, 2375);
  assert.deepEqual(first.bridge.origin, [-112, 9, 362]);
  assert.deepEqual(resumed.bridge, first.bridge);
  assert.deepEqual(resumed.walk, first.walk);
  assert.equal(resumed.probes, first.probes);
  const neighbor = survey(world, -1, 3, 64);
  assert.deepEqual(neighbor.bridge.origin, [-109, 5, 403]);
  assert.ok(Math.abs(neighbor.bridge.origin[2] - first.bridge.origin[2]) > first.bridge.span + neighbor.bridge.span);
  const other = survey(new FrostboundSixRegionsCandidate(-28480), -2, 2, 17);
  assert.deepEqual(other.bridge.origin, [-162, 10, 351]);
  for (const [result, tx, tz] of [[first, -1, 2], [neighbor, -1, 3], [other, -2, 2]]) {
    assert.ok(result.walk?.forward > 0 && result.walk.reverse > 0);
    for (const [x, , z] of [...result.bridge.cells, ...result.bridge.route]) {
      assert.equal(Math.floor(x / 128), tx);
      assert.equal(Math.floor(z / 128), tz);
    }
  }
  const initial = surveyGlacierBridgeTile(world, -1, 2, { limit: 2 });
  assert.throws(() => surveyGlacierBridgeTile(world, -1, 3, { cursor: initial.cursor }), /Stale/);
  assert.throws(() => surveyGlacierBridgeTile(new FrostboundSixRegionsCandidate(179), -1, 2, { cursor: initial.cursor }), /Stale/);
  assert.ok(world.set(0, 17, 0, BLOCK.STONE));
  assert.throws(() => surveyGlacierBridgeTile(world, -1, 2, { cursor: initial.cursor }), /unedited/);
  console.log('FROSTBOUND BRIDGE TILE PLACEMENTS ' + JSON.stringify([first, resumed, neighbor, other].map(result =>
    ({ origin: result.bridge.origin, probes: result.probes, slices: result.slices, walk: result.walk }))));
});
