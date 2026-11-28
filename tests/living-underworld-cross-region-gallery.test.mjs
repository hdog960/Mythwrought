import assert from 'node:assert/strict';
import test from 'node:test';
import { BLOCK, baseBlock, VoxelWorld, worldKey } from '../src/voxel.mjs';
import { depthMeshKey, sectionForY } from '../src/depth.mjs';
import { meshDepthSection } from '../src/depth-mesh.mjs';
import { FourRegionWorld, fourRegionProfile, M7_ENVIRONMENT_GENERATOR } from '../src/manual-biomes/profile-world.mjs';
import { surveyCrossRegionGallery } from '../src/living-underworld/cross-region-gallery.mjs';
import { traverseRetainedDescent } from '../src/living-underworld/retained-switchback-descent-route.mjs';

test('native galleries carry a supported player across both axes of the original network boundary', () => {
  const results = [];
  for (const [seed, rx, rz, axis, level, portal] of [
    [179, -3, -9, 'x', 0, [-512, -30, -2178]],
    [179, -3, -9, 'z', 2, [-645, -123, -2048]],
    [42, -1, -1, 'x', 1, [0, -77, -85]]
  ]) {
    const world = new FourRegionWorld(seed, fourRegionProfile(seed, M7_ENVIRONMENT_GENERATOR));
    const legacy = new VoxelWorld(seed), originalSave = JSON.stringify(world.save());
    const originalProtected = (x, y, z) => legacy.naturalAndLandmarkBlock(x, y, z) !== baseBlock(x, y, z, seed);
    const conditions = { rx, rz, axis, level, reach: 16, originalProtected };
    const entry = surveyCrossRegionGallery(world, conditions);
    assert.ok(entry);
    assert.deepEqual([entry.portal.x, entry.portal.y, entry.portal.z], portal);
    assert.equal(entry.cuts.size, 297);
    assert.ok(entry.costs.ok);
    assert.equal(entry.route.length, 33);
    const [first, last] = [entry.route[0], entry.route.at(-1)];
    assert.notEqual(Math.floor(first[axis] / 256), Math.floor(last[axis] / 256));
    assert.equal(traverseRetainedDescent(entry.witness, entry.route).ok, true);
    assert.equal(traverseRetainedDescent(entry.witness, [...entry.route].reverse()).ok, true);

    const owners = new Map();
    for (const key of entry.support) {
      const point = key.split(',').map(Number), previous = world.get(...point);
      assert.notEqual(previous, BLOCK.AIR);
      assert.equal(entry.witness.get(...point), previous);
    }
    for (const key of entry.clearance) {
      const point = key.split(',').map(Number);
      assert.equal(entry.witness.get(...point), BLOCK.AIR);
      const [x, y, z] = point, coordinates = [Math.floor(x / 16), Math.floor(z / 16), sectionForY(y)];
      owners.set(depthMeshKey(...coordinates), coordinates);
    }
    let bytes = 0;
    for (const coordinates of owners.values()) {
      const native = meshDepthSection(entry.witness, ...coordinates);
      assert.notDeepEqual(native, meshDepthSection(world, ...coordinates));
      bytes += native.byteLength;
    }
    const veto = [...entry.support][0];
    assert.equal(surveyCrossRegionGallery(world, { ...conditions, originalProtected: (...point) =>
      worldKey(...point) === veto || originalProtected(...point) }), null);
    assert.equal(JSON.stringify(world.save()), originalSave);
    assert.throws(() => entry.witness.save(), /durable profile/);
    results.push({ seed, axis, level, portal, cuts: entry.cuts.size, faces: entry.costs.faceGrowth,
      floors: entry.support.size, stations: entry.route.length, owners: [...owners.keys()], bytes });
  }
  console.log('LIVING UNDERWORLD PORTAL CROSSINGS ' + JSON.stringify(results));
});
