import assert from 'node:assert/strict';
import test from 'node:test';
import { BLOCK, collides, meshChunk, raycast, worldKey } from '../../src/voxel.mjs';
import { stepPlayer } from '../../src/physics.mjs';
import { runtimeSectionForY } from '../../src/world-height.mjs';
import { FrostboundSixRegionsCandidate } from '../../src/frostbound/s4-silverwood-barrens.mjs';
import { openGlacierArchWitness, surveyGlacierArch } from '../../src/frostbound/s5-glacier-arch.mjs';

const directions = [[0, 1, 0], [0, -1, 0], [1, 0, 0], [-1, 0, 0], [0, 0, 1], [0, 0, -1]];

test('Glacierlands arches remain attached to native ice and leave a two-way supported approach', () => {
  const results = [];
  for (const [seed, x, z, axis, expectedOwners] of [[42, -160, 352, 'x', 2], [179, -97, 364, 'z', 4]]) {
    const source = new FrostboundSixRegionsCandidate(seed);
    const arch = surveyGlacierArch(source, x, z, axis);
    assert.ok(arch);
    assert.equal(arch.footings.length, 4);
    const world = openGlacierArchWitness(source, arch);
    const cells = new Map(arch.cells.map(([a, y, b, id]) => [worldKey(a, y, b), id]));
    const queue = arch.footings.map(([a, y, b]) => [a, y + 1, b]), supported = new Set(queue.map(p => worldKey(...p)));
    const owners = new Set();
    for (const [a, y, b, id] of arch.cells) {
      assert.equal(source.get(a, y, b), BLOCK.AIR);
      assert.equal(world.get(a, y, b), id);
      owners.add([Math.floor(a / 16), Math.floor(b / 16), runtimeSectionForY(y)].join(','));
    }
    for (let i = 0; i < queue.length; i++) {
      for (const direction of directions) {
        const cell = queue[i].map((value, axis) => value + direction[axis]), key = worldKey(...cell);
        if (!cells.has(key) || supported.has(key)) continue;
        supported.add(key);
        queue.push(cell);
      }
    }
    assert.equal(supported.size, arch.cells.length);
    assert.deepEqual(new Set(cells.values()), new Set([275, 276]));
    assert.equal(owners.size, expectedOwners);
    for (const point of arch.footings) assert.equal(world.get(...point), source.get(...point));

    const [sx, feet, sz] = arch.route[0], start = axis === 'x' ? sz + .5 : sx + .5;
    const player = { x: sx + .5, z: sz + .5, feet, yaw: axis === 'x' ? 0 : Math.PI / 2,
      vX: 0, vY: 0, vZ: 0, onGround: true, coyote: 0, jumpBuffer: 0 };
    const progress = () => (axis === 'x' ? player.z : player.x) - start;
    function walk(forward, pending) {
      let frames = 0;
      while (pending() && frames < 200) {
        const step = stepPlayer(world, player, { forward }, 1 / 60);
        assert.equal(step.hitWall, false);
        assert.ok(Math.abs(player.feet - feet) < .1 && !collides(world, player.x, player.feet, player.z));
        frames++;
      }
      assert.equal(pending(), false);
      return frames;
    }
    const forward = walk(1, () => progress() < 8.7);
    player.vX = player.vZ = 0;
    const reverse = walk(-1, () => progress() > .2);
    const roof = [x, arch.origin[1] + 7, z];
    assert.deepEqual(raycast(world, [x + .5, feet + 1.5, z + .5], [0, 1, 0], 7)?.hit, roof);
    for (const owner of owners) {
      const coordinates = owner.split(',').map(Number);
      assert.notDeepEqual(meshChunk(world, ...coordinates), meshChunk(source, ...coordinates));
    }
    const guarded = Object.create(source, { environmentCaves: { value: { get(a, y, b) {
      return a === roof[0] && y === roof[1] && b === roof[2] ? BLOCK.AIR : source.environmentCaves.get(a, y, b);
    } } } });
    assert.equal(surveyGlacierArch(guarded, x, z, axis), null);
    assert.throws(() => world.save(), /separate save profile/);
    results.push({ seed, origin: arch.origin, axis, cells: arch.cells.length, owners: [...owners], forward, reverse });
  }
  console.log('GLACIERLANDS ARCHES ' + JSON.stringify(results));
});
