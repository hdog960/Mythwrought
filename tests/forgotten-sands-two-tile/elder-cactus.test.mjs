import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { surveyDesertCactusStand } from '../../src/manual-biomes/forgotten-sands-cactus-stand.mjs';
import { surveyElderCactus } from '../../src/manual-biomes/forgotten-sands-elder-cactus.mjs';
import { createRestoredDesertResearchWorld } from '../../src/manual-biomes/forgotten-sands-restored-ground.mjs';
import { P0_TILE_BASE } from '../../src/manual-biomes/forgotten-sands-tile-world.mjs';

const root = process.env.P0_CURRENT_SOURCE;
assert.ok(root, 'P0_CURRENT_SOURCE must point to the pinned game source checkout');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), P0_TILE_BASE);
const load = path => import(pathToFileURL(resolve(root, path)).href);
const [P, V] = await Promise.all(['src/manual-biomes/profile-world.mjs', 'src/voxel.mjs'].map(load));

test('existing cactus arms and ribs form a bent ancient specimen with native body and ray checks', () => {
  const seed = 10301, Host = createRestoredDesertResearchWorld(P.FourRegionWorld, V.terrainHeight);
  const world = new Host(seed, P.fourRegionProfile(seed, P.M8_MOUNTAIN_GENERATOR));
  const stand = surveyDesertCactusStand(world, 9, -1, 'ancient');
  assert.deepEqual(stand.support, [621, 8, -25]);
  const elder = surveyElderCactus(world, stand, { height: 17, orientation: 0 });
  assert.ok(elder);
  const rotated = surveyElderCactus(world, stand, { height: 17, orientation: 1 });
  assert.ok(rotated);
  assert.equal(elder.mesh.byteLength, elder.triangles * 3 * 36);
  assert.ok(elder.triangles <= 216);
  assert.equal(elder.positions.length, rotated.positions.length);
  assert.notDeepEqual(elder.positions, rotated.positions);
  const [x, y, z] = elder.anchor;
  const heights = elder.positions.filter((value, index) => index % 3 === 1);
  assert.equal(Math.min(...heights), y);
  assert.equal(Math.max(...heights), y + 17);
  assert.equal(V.collides(world, x + .5, y + .01, z + .5), false);
  assert.equal(V.collides(elder.witness, x + .5, y + .01, z + .5), true);
  assert.equal(V.collides(elder.witness, x - 3.5, y + .01, z + .5), false);
  const root = elder.pick([x - 3, y + .75, z + .5], [1, 0, 0], 6);
  const crown = elder.pick([x - 2, y + 16.5, z + 1.12], [1, 0, 0], 8);
  assert.ok(root && crown && crown.point[0] > root.point[0] + .8);
  assert.ok(elder.collisionCells.every(key => world.get(...key.split(',').map(Number)) === V.BLOCK.AIR));
  const protectedCell = elder.collisionCells.find(key => Number(key.split(',')[1]) >= 20);
  assert.ok(protectedCell);
  const guarded = Object.create(world, {
    get: { value: (...point) => world.get(...point) },
    environmentCaves: { value: { get(...point) {
      return V.worldKey(...point) === protectedCell ? V.BLOCK.AIR : world.environmentCaves.get(...point);
    } } }
  });
  assert.equal(surveyElderCactus(guarded, stand), null);
  assert.equal(world.edits.size, 0);
  assert.throws(() => elder.witness.save(), /durable object profile/);
  console.log('FORGOTTEN SANDS ELDER CACTUS ' + JSON.stringify({ seed, anchor: elder.anchor,
    height: elder.height, triangles: elder.triangles, bytes: elder.mesh.byteLength,
    collisionCells: elder.collisionCells.length, root: root.point, crown: crown.point }));
});
