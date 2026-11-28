import test from 'node:test';
import assert from 'node:assert/strict';
import { BLOCK } from '../../src/voxel.mjs';
import { inspectWildsLandmarkWalk } from '../../src/manual-biomes/enchanted-wilds-landmark-walk.mjs';
import { WildsFamilyResearchWorld, wildsRegionAt } from '../../src/manual-biomes/enchanted-wilds-family-source.mjs';
import { WILDS_LANDMARKS } from '../../src/manual-biomes/enchanted-wilds-landmarks.mjs';

test('the six confirmed Wilds landmarks have native round-trip approaches from outside their footprints', () => {
  const found = new Map();
  let checked = 0, obstructed = 0, obstructionChecked = false;
  for (const seed of [179, 42, 2026]) {
    const world = new WildsFamilyResearchWorld(seed);
    for (let cz = -51; cz <= -24; cz++) for (let cx = -18; cx <= 16; cx++) {
      if (wildsRegionAt(cx * 16 + 8, cz * 16 + 8, seed) === null) continue;
      const plan = world.wildsSource.landmark(cx, cz);
      if (!plan || plan.id >= 6 || found.has(plan.id)) continue;
      checked++;
      const route = inspectWildsLandmarkWalk(world, plan);
      if (!route) { obstructed++; continue; }
      assert.ok(route.distance >= 6 && route.forward > 0 && route.reverse > 0);
      found.set(plan.id, { seed, name: plan.name, origin: plan.origin, turn: plan.turn, ...route });

      if (!obstructionChecked) {
        const floor = plan.approach.filter(([, y]) => y === plan.origin[1] + 1);
        const barrier = [floor[3], floor[9]];
        for (const cell of barrier) assert.ok(world.set(...cell, BLOCK.STONE));
        assert.equal(inspectWildsLandmarkWalk(world, plan), null);
        for (const cell of barrier) assert.ok(world.set(...cell, BLOCK.AIR));
        assert.equal(world.edits.size, 0);
        assert.deepEqual(inspectWildsLandmarkWalk(world, plan), route);
        obstructionChecked = true;
      }
    }
    if (found.size === 6) break;
  }
  assert.deepEqual([...found.keys()].sort((a, b) => a - b).map(id => WILDS_LANDMARKS[id]), WILDS_LANDMARKS.slice(0, 6));
  assert.ok(obstructionChecked);
  console.log('WILDS LANDMARK WALKS ' + JSON.stringify({ checked, obstructed, routes: [...found.values()] }));
});
