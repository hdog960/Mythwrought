import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { openDesertWorldwyrmWitness, surveyDesertWorldwyrm } from '../../src/manual-biomes/forgotten-sands-worldwyrm.mjs';
import { createRestoredDesertResearchWorld } from '../../src/manual-biomes/forgotten-sands-restored-ground.mjs';
import { P0_TILE_BASE } from '../../src/manual-biomes/forgotten-sands-tile-world.mjs';

const root = process.env.P0_CURRENT_SOURCE;
assert.ok(root, 'P0_CURRENT_SOURCE must point to the pinned game source checkout');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), P0_TILE_BASE);
const load = path => import(pathToFileURL(resolve(root, path)).href);
const [P, V, { stepPlayer }] = await Promise.all(['src/manual-biomes/profile-world.mjs', 'src/voxel.mjs', 'src/physics.mjs'].map(load));
const faces = [[-1, 0, 0], [1, 0, 0], [0, -1, 0], [0, 1, 0], [0, 0, -1], [0, 0, 1]];

function walk(world, route, axis) {
  const [x, feet, z] = route[0], end = route.at(-1), component = axis === 'x' ? 0 : 2;
  const direction = Math.sign(end[component] - route[0][component]);
  const yaw = axis === 'x' ? direction * Math.PI / 2 : direction === 1 ? 0 : Math.PI;
  const actor = { x: x + .5, z: z + .5, feet, yaw, vX: 0, vY: 0, vZ: 0, onGround: true, coyote: 0, jumpBuffer: 0 };
  const coordinate = () => axis === 'x' ? actor.x : actor.z;
  let frames = 0;
  while ((end[component] + .5 - coordinate()) * direction > .09 && frames < 500) {
    const result = stepPlayer(world, actor, { forward: 1 }, 1 / 60);
    assert.equal(result.hitWall, false);
    assert.equal(V.collides(world, actor.x, actor.feet, actor.z), false);
    frames++;
  }
  for (let tick = 0; tick < 25; tick++) stepPlayer(world, actor, {}, 1 / 60);
  assert.ok(actor.onGround && frames < 500 && Math.abs(actor.feet - end[1]) < .16);
  return frames;
}

test('six grounded ribs and an original source fossil bed support a 24-block interior walk', () => {
  const Host = createRestoredDesertResearchWorld(P.FourRegionWorld, V.terrainHeight), results = [];
  for (const [seed, site, expected] of [[42, { x: 711, z: -230, axis: 'z' }, 158], [10301, { x: 621, z: -200, axis: 'x' }, 154]]) {
    const source = new Host(seed, P.fourRegionProfile(seed, P.M8_MOUNTAIN_GENERATOR));
    const plan = surveyDesertWorldwyrm(source, site);
    assert.equal(plan?.cells.length, expected);
    assert.equal(plan.footings.length, 12);
    assert.equal(plan.route.length, 25);
    const world = openDesertWorldwyrmWitness(source, plan), owners = new Set();
    const layout = new Set(plan.cells.map(([x, y, z]) => [x, y, z].join(',')));
    const queue = [plan.cells[0].slice(0, 3)], seen = new Set([queue[0].join(',')]);
    for (let i = 0; i < queue.length; i++) for (const face of faces) {
      const point = queue[i].map((value, index) => value + face[index]), key = point.join(',');
      if (layout.has(key) && !seen.has(key)) { seen.add(key); queue.push(point); }
    }
    assert.equal(seen.size, layout.size);
    for (const [x, y, z, id] of plan.cells) {
      assert.equal(source.get(x, y, z), V.BLOCK.AIR);
      assert.equal(world.get(x, y, z), id);
      assert.ok(id === 262 || id === 264);
      owners.add(`${Math.floor(x / 16)},${Math.floor(z / 16)}`);
    }
    for (const [x, y, z] of plan.footings) {
      assert.equal(world.get(x, y, z), source.get(x, y, z));
      assert.equal(world.get(x, y + 1, z), 264);
    }
    const [x, feet, z] = plan.route[10], roof = [x, plan.origin[1] + 5, z];
    assert.deepEqual(V.raycast(world, [x + .5, feet + 1.55, z + .5], [0, 1, 0], 7)?.hit, roof);
    assert.equal(surveyDesertWorldwyrm(source, { ...site, reservedAt: (...cell) =>
      cell.every((value, index) => value === roof[index]) }), null);
    const forward = walk(world, plan.route, site.axis), reverse = walk(world, [...plan.route].reverse(), site.axis);
    for (const owner of owners) {
      const chunk = owner.split(',').map(Number);
      assert.notDeepEqual(V.meshChunk(world, ...chunk), V.meshChunk(source, ...chunk));
    }
    assert.equal(source.edits.size, 0);
    assert.throws(() => world.save(), /separate profile/);
    results.push({ seed, origin: plan.origin, axis: plan.axis, cells: plan.cells.length,
      footings: plan.footings.length, owners: owners.size, forward, reverse });
  }
  console.log('FORGOTTEN SANDS WORLDWYRMS ' + JSON.stringify(results));
});
