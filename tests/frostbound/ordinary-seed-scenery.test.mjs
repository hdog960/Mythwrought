import test from 'node:test';
import assert from 'node:assert/strict';
import { FrostboundSceneryCandidate, SNOW_SCENERY } from '../../src/frostbound/s3-scenery.mjs';
import { FourRegionWorld, fourRegionProfile, M8_MOUNTAIN_GENERATOR } from '../../src/manual-biomes/profile-world.mjs';
import { v6BiomeAt } from '../../src/manual-biomes/v6-balanced-biomes.mjs';
import { candidateVertices } from '../../src/nonblock/candidate-scene.mjs';
import { collides, meshChunk, raycast } from '../../src/voxel.mjs';

const seeds = [42, -741, 10301, 90210, -28480];
const snowCaps = new Set([272, 276, 279]);

function qualifyLogInteraction(world, { cx, cz, placement }) {
  const [x, y, z] = placement.anchor;
  const records = new Map();
  const storage = {
    getItem: key => records.get(key) ?? null,
    setItem: (key, value) => records.set(key, value),
    removeItem: key => records.delete(key),
  };
  const open = candidate => candidate.sceneryScene(cx, cz, { storage, voxelPick: (...ray) => raycast(candidate, ...ray) });
  const scene = open(world);
  const log = scene.visible().find(row => row.sceneId === SNOW_SCENERY.fallenLog &&
    row.anchor.every((coord, axis) => coord === placement.anchor[axis]));
  assert.ok(log);

  const body = [x + .5, y + .04, z + .5];
  assert.equal(collides(world, ...body), false, 'The empty terrain pocket must be walkable');
  world.stagedNonblockCollision = scene.bodyIntersects;
  try {
    assert.equal(collides(world, ...body), true, 'The original player collision path must include the log');
    const eye = [body[0], y + 1.7, body[2]], down = [0, -1, 0];
    const hit = scene.pick(eye, down, 3);
    assert.equal(hit?.instanceKey, log.instanceKey);
    assert.ok(scene.breakHit(hit, eye, down));
    assert.equal(collides(world, ...body), false);
  } finally {
    delete world.stagedNonblockCollision;
  }

  const cold = new FrostboundSceneryCandidate(world.seed);
  const reopened = open(cold);
  assert.ok(cold.sceneryChunk(cx, cz).some(row => row.sceneId === placement.sceneId &&
    row.anchor.every((coord, axis) => coord === placement.anchor[axis])));
  assert.ok(!reopened.visible().some(row => row.instanceKey === log.instanceKey));
  assert.equal(reopened.bodyIntersects([x + .4, y + .04, z + .4, x + .6, y + .6, z + .6]), false);
  assert.equal(records.size, 2);
  assert.equal(world.edits.size, 0);
  return { anchor: placement.anchor, variant: placement.variant };
}

test('Frostbound scenery covers ordinary snow seeds and keeps solid logs out of protected terrain', () => {
  const report = [];
  for (const seed of seeds) {
    const world = new FrostboundSceneryCandidate(seed);
    const original = new FourRegionWorld(seed, fourRegionProfile(seed, M8_MOUNTAIN_GENERATOR));
    const originalSave = JSON.stringify(original.save());
    const families = {}, logs = new Map();
    let chunks = 0, empty = 0, maxInstances = 0, maxBytes = 0;

    // Cross the near-spawn snow tile, its warped borders, and neighboring biomes.
    for (let cx = -9; cx <= 9; cx++) for (let cz = 11; cz <= 51; cz++) {
      chunks++;
      const layout = world.sceneryChunk(cx, cz);
      if (!layout.length) empty++;
      assert.ok(layout.length <= 3);
      for (const placement of layout) {
        const { anchor: [x, y, z], sceneId, variant } = placement;
        families[sceneId] = (families[sceneId] ?? 0) + 1;
        const region = v6BiomeAt(x, z, seed);
        assert.equal(region?.name, 'snow');
        assert.ok(region.weight >= .72);
        assert.ok(snowCaps.has(world.get(x, y - 1, z)));
        assert.equal(world.get(x, y, z), 0);
        if (sceneId !== SNOW_SCENERY.fallenLog) continue;

        assert.ok(region.weight >= .8);
        const alongZ = variant % 2 === 1;
        for (const side of [-1, 0, 1]) {
          const a = x + (alongZ ? 0 : side), b = z + (alongZ ? side : 0);
          assert.ok(snowCaps.has(world.get(a, y - 1, b)));
          assert.equal(world.get(a, y, b), 0);
          for (let dy = -2; dy <= 1; dy++) assert.equal(world.environmentCaves.get(a, y + dy, b), undefined);
        }
        if (!logs.has(alongZ) && !collides(world, x + .5, y + .04, z + .5) && world.get(x, y + 1, z) === 0) {
          logs.set(alongZ, { cx, cz, placement });
        }
      }
      if (cx % 4 === 0 && cz % 4 === 0) {
        const objects = world.sceneryScene(cx, cz).visible();
        const packed = candidateVertices(objects);
        assert.ok(objects.length <= 27);
        assert.ok(packed.every(Number.isFinite));
        maxInstances = Math.max(maxInstances, objects.length);
        maxBytes = Math.max(maxBytes, packed.byteLength);
      }
    }

    assert.equal(Object.keys(families).length, Object.keys(SNOW_SCENERY).length);
    assert.equal(logs.size, 2, 'Both log orientations must have reachable terrain pockets');
    const interactions = [...logs.values()].map(witness => qualifyLogInteraction(world, witness));
    for (const [cx, cz] of [[0, 0], [32, 0]]) {
      assert.deepEqual(world.sceneryLayout(cx, cz), []);
      assert.deepEqual(meshChunk(world, cx, cz), meshChunk(original, cx, cz));
    }
    assert.equal(JSON.stringify(original.save()), originalSave);
    report.push({ seed, chunks, empty, families, maxInstances, maxBytes, interactions });
  }
  console.log('FROSTBOUND ORDINARY SEEDS ' + JSON.stringify(report));
});
