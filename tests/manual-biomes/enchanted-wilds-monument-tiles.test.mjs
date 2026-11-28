import assert from 'node:assert/strict';
import test from 'node:test';
import { BLOCK } from '../../src/voxel.mjs';
import { WildsFamilyResearchWorld } from '../../src/manual-biomes/enchanted-wilds-family-source.mjs';
import { surveyWildsMonumentTile } from '../../src/manual-biomes/enchanted-wilds-monument-tiles.mjs';

function survey(world, tx, tz, id, limit) {
  let cursor = null, probes = 0, scans = 0;
  for (;;) {
    const result = surveyWildsMonumentTile(world, tx, tz, { ids: [id], limit, cursor });
    assert.ok(result.probes > 0 && result.probes <= limit);
    probes += result.probes;
    scans++;
    if (result.state !== 'pending') return { ...result, probes, scans };
    assert.equal(result.cursor.next, probes);
    cursor = JSON.parse(JSON.stringify(result.cursor));
  }
}

test('bounded Wilds tile scans find the same native placement across pause and resume schedules', () => {
  const world = new WildsFamilyResearchWorld(42), cold = new WildsFamilyResearchWorld(42);
  const first = survey(world, -2, -5, 12, 64), resumed = survey(cold, -2, -5, 12, 11);
  assert.equal(first.state, 'admitted');
  assert.equal(resumed.state, 'admitted');
  assert.equal(first.probes, 977);
  assert.equal(resumed.probes, first.probes);
  assert.equal(resumed.identity, first.identity);
  assert.deepEqual(resumed.entry.plan, first.entry.plan);
  assert.deepEqual(resumed.route, first.route);
  assert.deepEqual(first.entry.plan.origin, [-206, 9, -581]);
  assert.equal(first.route.distance, 11);
  const altar = survey(world, 12, -2, 15, 64);
  assert.equal(altar.state, 'admitted');
  assert.equal(altar.probes, 17096);
  assert.deepEqual(altar.entry.plan.origin, [1628, 11, -205]);
  assert.equal(altar.route.distance, 11);
  const initial = surveyWildsMonumentTile(world, -2, -5, { ids: [12], limit: 2 });
  assert.throws(() => surveyWildsMonumentTile(world, -2, -4, { ids: [12], cursor: initial.cursor }), /Stale/);
  assert.throws(() => surveyWildsMonumentTile(world, -2, -5, { ids: [15], cursor: initial.cursor }), /Stale/);
  assert.ok(world.set(0, 17, 0, BLOCK.STONE));
  assert.throws(() => surveyWildsMonumentTile(world, -2, -5, { ids: [12], cursor: initial.cursor }), /unedited/);
  console.log('WILDS PROCEDURAL MONUMENTS ' + JSON.stringify([first, resumed, altar].map(result => ({
    origin: result.entry.plan.origin, probes: result.probes, slices: result.scans, route: result.route.distance
  }))));
});
