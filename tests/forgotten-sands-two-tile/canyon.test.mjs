import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { openDesertCanyonWitness, surveyDesertCanyon } from '../../src/manual-biomes/forgotten-sands-canyon.mjs';
import { createRestoredDesertResearchWorld } from '../../src/manual-biomes/forgotten-sands-restored-ground.mjs';
import { P0_TILE_BASE } from '../../src/manual-biomes/forgotten-sands-tile-world.mjs';

const root = process.env.P0_CURRENT_SOURCE;
assert.ok(root, 'P0_CURRENT_SOURCE must point to the pinned game source checkout');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), P0_TILE_BASE);
const load = path => import(pathToFileURL(resolve(root, path)).href);
const [P, V, { stepPlayer }] = await Promise.all(['src/manual-biomes/profile-world.mjs', 'src/voxel.mjs', 'src/physics.mjs'].map(load));

function walk(world, route) {
  const [x, feet, z] = route[0];
  const player = { x: x + .5, z: z + .5, feet, yaw: 0, vX: 0, vY: 0, vZ: 0, onGround: true, coyote: 0, jumpBuffer: 0 };
  let frames = 0;
  for (const [a, level, b] of route.slice(1)) {
    let reached = false;
    for (let tick = 0; tick < 110; tick++) {
      const dx = a + .5 - player.x, dz = b + .5 - player.z, distance = Math.hypot(dx, dz);
      if (distance < .13 && Math.abs(player.feet - level) < .12 && player.onGround) {
        reached = true;
        break;
      }
      if (distance > .03) player.yaw = Math.atan2(dx, dz);
      stepPlayer(world, player, { forward: distance > .03 ? 1 : 0 }, 1 / 60);
      frames++;
      assert.equal(V.collides(world, player.x, player.feet, player.z), false);
    }
    assert.equal(reached, true, JSON.stringify({ point: [a, level, b], player }));
  }
  return frames;
}

test('dry river cuts preserve source rock, native mesh and two-way canyon floor traversal', () => {
  const Host = createRestoredDesertResearchWorld(P.FourRegionWorld, V.terrainHeight), rows = [];
  for (const [seed, site, expectedCuts] of [[42, { x: 460, z: -175, axis: 'z' }, 313],
    [10301, { x: 564, z: -175, axis: 'x' }, 332]]) {
    const source = new Host(seed, P.fourRegionProfile(seed, P.M8_MOUNTAIN_GENERATOR));
    const canyon = surveyDesertCanyon(source, site);
    assert.ok(canyon);
    assert.equal(canyon.cells.length, expectedCuts);
    assert.equal(canyon.stations.length, 31);
    const witness = openDesertCanyonWitness(source, canyon), owners = new Set();
    for (const [x, y, z] of canyon.cells) {
      assert.notEqual(source.get(x, y, z), V.BLOCK.AIR);
      assert.equal(witness.get(x, y, z), V.BLOCK.AIR);
      owners.add(`${Math.floor(x / 16)},${Math.floor(z / 16)}`);
    }
    for (const [x, y, z] of canyon.floors) assert.equal(witness.get(x, y, z), source.get(x, y, z));
    const [x, feet, z] = canyon.stations[15];
    assert.deepEqual(V.raycast(witness, [x + .5, feet + 5, z + .5], [0, -1, 0], 7)?.hit, [x, feet - 1, z]);
    const guarded = surveyDesertCanyon(source, { ...site, reservedAt: (a, y, b) => a === x && y === feet && b === z });
    assert.equal(guarded, null);
    const forward = walk(witness, canyon.stations), reverse = walk(witness, [...canyon.stations].reverse());
    for (const owner of owners) {
      const region = owner.split(',').map(Number);
      assert.notDeepEqual(V.meshChunk(witness, ...region), V.meshChunk(source, ...region));
    }
    assert.deepEqual(V.meshChunk(witness, 0, 0), V.meshChunk(source, 0, 0));
    const original = source.get(x, feet, z);
    assert.notEqual(original, V.BLOCK.AIR);
    assert.equal(source.set(x, feet, z, V.BLOCK.WOOD), true);
    assert.equal(witness.get(x, feet, z), V.BLOCK.WOOD);
    assert.equal(witness.naturalAndLandmarkBlock(x, feet, z), V.BLOCK.AIR);
    assert.equal(source.set(x, feet, z, original), true);
    assert.equal(witness.get(x, feet, z), V.BLOCK.AIR);
    assert.equal(source.edits.size, 0);
    assert.throws(() => witness.save(), /separate world profile/);
    rows.push({ seed, origin: canyon.origin, stations: canyon.stations.length, deep: canyon.deep,
      cuts: canyon.cells.length, owners: owners.size, forward, reverse });
  }
  console.log('FORGOTTEN SANDS CANYONS ' + JSON.stringify(rows));
});
