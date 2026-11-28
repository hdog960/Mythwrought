import assert from 'node:assert/strict';
import { BLOCK, collides, raycast } from '../../src/voxel.mjs';
import { candidateVertices, createCandidateScene } from '../../src/nonblock/candidate-scene.mjs';
import { planEnvironmentalScenery } from '../../src/nonblock/staged-habitats.mjs';
import { planRetainedGalleryScenery } from '../../src/living-underworld/retained-gallery-scenery.mjs';
import { GALLERY_CONSTRUCTION_LIMITS } from '../../src/living-underworld/physical-gallery-construction.mjs';

const worldId = 'mythwrought-retained-gallery-scenery-research-v1';

function findNaturalSightline(world, scene, object) {
  const [x, y, z] = object.anchor;
  for (const [dx, dz] of [[0, 0], [-1, 0], [1, 0], [0, -1], [0, 1], [2, 0], [0, 2]]) {
    const a = x + dx + .5, b = z + dz + .5;
    for (const feet of [y, y - 1, y + 1, y - 2]) {
      if (collides(world, a, feet + .01, b) || !collides(world, a, feet - .03, b)) continue;
      const eye = [a, feet + 1.55, b], positions = object.positions;
      for (let i = 0; i < positions.length; i += 9) {
        const direction = eye.map((point, axis) =>
          (positions[i + axis] + positions[i + 3 + axis] + positions[i + 6 + axis]) / 3 - point);
        if (scene.pick(eye, direction, 4)?.instanceKey === object.instanceKey) return { eye, direction };
      }
    }
  }
  return null;
}

export function qualifyRetainedGalleryScenery({ projection, capture, onWitness }) {
  const originalSave = JSON.stringify(projection.original.save());
  const anchors = [...new Set([...capture.cuts, ...projection.future])].map(key => key.split(',').map(Number));
  const originalAir = new Set(anchors.map(anchor => anchor.join(',')));
  const witnesses = new Map(), families = new Map();
  let checked = 0, maxReads = 0, maxObjects = 0, maxBytes = 0;
  for (let cx = -41; cx <= -39; cx++) for (let cz = -136; cz <= -134; cz++) for (let band = -8; band <= -3; band++) {
    const cache = new Map();
    function get(x, y, z) {
      const key = [x, y, z].join(',');
      if (!cache.has(key)) {
        assert.ok(cache.size < GALLERY_CONSTRUCTION_LIMITS.originalNaturalReads);
        cache.set(key, capture.halo.has(key) ? projection.projectedAt(x, y, z) : projection.original.get(x, y, z));
      }
      return cache.get(key);
    }
    const world = Object.create(projection.original, { get: { value: get }, naturalAndLandmarkBlock: { value: get } });
    const prior = planEnvironmentalScenery(world, cx, cz, { caveSection: band });
    const extra = planRetainedGalleryScenery(world, anchors, { cx, cz, band, prior });
    const records = new Map();
    const storage = { getItem: key => records.get(key) ?? null, setItem: (key, value) => records.set(key, value),
      removeItem: key => records.delete(key) };
    const open = () => createCandidateScene(world.seed, worldId, [...prior, ...extra], { storage,
      blockAt: (...point) => world.get(...point) !== BLOCK.AIR, voxelPick: (...ray) => raycast(world, ...ray) });
    const scene = open(), visible = scene.visible();
    const keys = new Set(extra.map(row => row.anchor.join(',')));
    const objects = visible.filter(object => keys.has(object.anchor.join(',')));
    assert.equal(objects.length, extra.length);
    maxObjects = Math.max(maxObjects, visible.length);
    maxBytes = Math.max(maxBytes, candidateVertices(visible).byteLength);
    assert.ok(visible.length <= 27);
    assert.ok(extra.length <= 6);
    for (const object of objects) {
      const key = object.anchor.join(',');
      assert.ok(originalAir.has(key));
      assert.equal(world.get(...object.anchor), BLOCK.AIR);
      assert.equal(object.colliders.length, 0);
      assert.ok(object.supports.every(point => [BLOCK.STONE, BLOCK.DEEPSTONE].includes(world.get(...point))));
      if (!families.has(object.sceneId)) families.set(object.sceneId, new Set());
      families.get(object.sceneId).add(key);
      if (witnesses.has(object.sceneId)) continue;
      const sightline = findNaturalSightline(world, scene, object);
      if (!sightline) continue;
      const { eye, direction } = sightline;
      const hit = scene.pick(eye, direction, 4);
      assert.equal(hit?.instanceKey, object.instanceKey);
      assert.ok(scene.breakHit(hit, eye, direction));
      const reopened = open().visible();
      assert.ok(!reopened.some(row => row.instanceKey === object.instanceKey));
      onWitness?.({ object, eye, direction, visible, reopened });
      witnesses.set(object.sceneId, { anchor: object.anchor, owner: [cx, cz, band], eye });
    }
    checked++;
    maxReads = Math.max(maxReads, cache.size);
  }
  assert.equal(witnesses.size, 3);
  assert.equal(JSON.stringify(projection.original.save()), originalSave);
  return { checked, maxReads, maxObjects, maxBytes, worldWrites: 0,
    families: Object.fromEntries([...families].map(([id, anchors]) => [id, anchors.size])),
    witnesses: Object.fromEntries(witnesses) };
}
