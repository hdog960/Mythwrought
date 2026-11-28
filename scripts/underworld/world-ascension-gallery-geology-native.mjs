import assert from 'node:assert/strict';
import { BLOCK, raycast } from '../../src/voxel.mjs';
import { meshReadOnlySharedBatch } from '../../src/living-underworld/shared-native-mesh-snapshot.mjs';
import { surveyGalleryWallGeology } from '../../src/living-underworld/retained-gallery-geology.mjs';

export function qualifyGalleryWallGeology({ capture, projection, owners }) {
  const air = [...new Set([...capture.cuts, ...projection.future])];
  const anchors = air.map(key => key.split(',').map(Number));
  const view = Object.create(projection.original, { get: { value(x, y, z) {
    const key = [x, y, z].join(',');
    return capture.cuts.has(key) || projection.future.has(key) ? BLOCK.AIR : projection.original.get(x, y, z);
  } } });
  const options = { anchors, protectedCells: capture.floors, allowedOwners: new Set(owners.keys()) };
  const changes = surveyGalleryWallGeology(view, options);
  const reversed = surveyGalleryWallGeology(view, { ...options, anchors: [...anchors].reverse() });
  assert.deepEqual([...reversed].map(([key]) => key), [...changes].map(([key]) => key));
  const candidate = Object.create(view, { get: { value(x, y, z) {
    return changes.get([x, y, z].join(','))?.id ?? view.get(x, y, z);
  } } });
  for (const point of anchors) assert.equal(candidate.get(...point), BLOCK.AIR);
  for (const key of capture.floors) {
    const point = key.split(',').map(Number);
    assert.equal(candidate.get(...point), view.get(...point));
  }
  const materials = new Map(), counts = new Map();
  for (const { cell, air, id, owner, host } of changes.values()) {
    assert.equal(view.get(...cell), host);
    assert.equal(candidate.get(...cell), id);
    counts.set(owner, (counts.get(owner) ?? 0) + 1);
    if (materials.has(id)) continue;
    const direction = cell.map((value, i) => value - air[i]);
    assert.deepEqual(raycast(candidate, air.map(value => value + .5), direction, 2)?.hit, cell);
    materials.set(id, { cell, host, owner });
  }
  assert.deepEqual(new Set(materials.keys()), new Set([BLOCK.ORE, BLOCK.CRYSTAL]));
  const keys = [...materials.values()].map(row => row.owner);
  const before = meshReadOnlySharedBatch(view, keys), after = meshReadOnlySharedBatch(candidate, keys);
  assert.equal(before.ok, true);
  assert.equal(after.ok, true);
  const meshes = after.meshes.map(({ key, vertices }, i) => {
    const baseline = before.meshes[i].vertices;
    assert.equal(vertices.byteLength, baseline.byteLength);
    assert.notDeepEqual(vertices, baseline);
    for (let j = 0; j < vertices.length; j += 9) {
      for (const field of [0, 1, 2, 6, 7]) assert.equal(vertices[j + field], baseline[j + field]);
    }
    return { key, bytes: vertices.byteLength };
  });
  const maxOwnerChanges = Math.max(...counts.values());
  assert.ok(maxOwnerChanges <= 8);
  return { changes: changes.size, owners: counts.size, maxOwnerChanges, airParity: air.length,
    floorParity: capture.floors.size, materials: Object.fromEntries(materials), meshes };
}
