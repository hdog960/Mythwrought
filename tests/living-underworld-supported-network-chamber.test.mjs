import assert from 'node:assert/strict';
import test from 'node:test';
import { BLOCK, baseBlock, VoxelWorld, worldKey } from '../src/voxel.mjs';
import { sectionForY } from '../src/depth.mjs';
import { meshDepthSection } from '../src/depth-mesh.mjs';
import { FourRegionWorld, fourRegionProfile, M7_ENVIRONMENT_GENERATOR } from '../src/manual-biomes/profile-world.mjs';
import { engineWantedSections } from '../src/living-underworld/gallery-streaming-working-set.mjs';
import { traverseRetainedDescent } from '../src/living-underworld/retained-switchback-descent-route.mjs';
import { surveySupportedChamberAccess, surveySupportedNetworkChamber } from '../src/living-underworld/supported-network-chamber.mjs';
import { networkAirAt, planUnderworldRegion } from '../src/living-underworld/worldwide-network.mjs';

test('natural rock decks support broad native movement at multiple network depths', () => {
  const results = [];
  for (const [seed, rx, rz, layer, feet] of [[179, -3, -9, 0, -34], [42, -1, -1, 3, -179]]) {
    const source = new FourRegionWorld(seed, fourRegionProfile(seed, M7_ENVIRONMENT_GENERATOR));
    const legacy = new VoxelWorld(seed), originalSave = JSON.stringify(source.save());
    const originalProtected = (x, y, z) => legacy.naturalAndLandmarkBlock(x, y, z) !== baseBlock(x, y, z, seed);
    const options = { rx, rz, layer, originalProtected };
    const chamber = surveySupportedNetworkChamber(source, options);
    assert.ok(chamber);
    assert.equal(chamber.feet, feet);
    assert.equal(chamber.deck.length, 525);
    assert.equal(chamber.cuts.size, 2642);
    assert.equal(chamber.costs.faceGrowth, 1662);
    for (const { x, feet, z, headroom, support } of chamber.deck) {
      assert.equal(chamber.witness.get(x, feet - 1, z), support);
      for (let y = feet; y < feet + headroom; y++) assert.equal(chamber.witness.get(x, y, z), BLOCK.AIR);
      assert.notEqual(chamber.witness.get(x, feet + headroom, z), BLOCK.AIR);
    }
    for (const route of chamber.routes) {
      assert.equal(traverseRetainedDescent(chamber.witness, route).ok, true);
      assert.equal(traverseRetainedDescent(chamber.witness, [...route].reverse()).ok, true);
    }
    const { x, z } = chamber.hub;
    const owners = engineWantedSections(Math.floor(x / 16), Math.floor(z / 16), sectionForY(feet));
    let faces = 0, added = 0;
    for (const key of owners) {
      const coordinates = key.split(',').map(Number);
      const before = meshDepthSection(source, ...coordinates), after = meshDepthSection(chamber.witness, ...coordinates);
      faces += after.length / 54;
      added += (after.length - before.length) / 54;
    }
    assert.equal(owners.length, 27);
    assert.equal(added, chamber.costs.faceGrowth);
    const veto = worldKey(x, feet - 1, z);
    assert.equal(surveySupportedNetworkChamber(source, { ...options, originalProtected: (...point) =>
      worldKey(...point) === veto || originalProtected(...point) }), null);
    assert.equal(JSON.stringify(source.save()), originalSave);
    assert.throws(() => chamber.witness.save(), /separate world profile/);
    results.push({ seed, layer, feet, floorCells: chamber.deck.length, headroom: [3, 8], cuts: chamber.cuts.size,
      routes: chamber.routes.map(route => route.length), owners: owners.length, faces, added });
  }
  console.log('LIVING UNDERWORLD SUPPORTED CHAMBERS ' + JSON.stringify(results));
});

test('supported chamber decks connect both ways to the planned gallery tubes', () => {
  const results = [];
  for (const [seed, rx, rz, layer, linkCount, expectedCuts] of [[179, -3, -9, 0, 2, 3077], [42, -1, -1, 3, 4, 3515]]) {
    const source = new FourRegionWorld(seed, fourRegionProfile(seed, M7_ENVIRONMENT_GENERATOR));
    const legacy = new VoxelWorld(seed), save = JSON.stringify(source.save());
    const originalProtected = (x, y, z) => legacy.naturalAndLandmarkBlock(x, y, z) !== baseBlock(x, y, z, seed);
    const options = { rx, rz, layer, originalProtected };
    const access = surveySupportedChamberAccess(source, options);
    assert.ok(access);
    assert.equal(access.links.length, linkCount);
    assert.equal(access.cuts.size, expectedCuts);
    const { hub, room } = planUnderworldRegion(seed, rx, rz).layers[layer];
    for (const { x, feet, z, headroom, support } of access.chamber.deck) {
      assert.equal(access.witness.get(x, feet - 1, z), support);
      for (let dy = 0; dy < headroom; dy++) assert.equal(access.witness.get(x, feet + dy, z), BLOCK.AIR);
    }
    const corridors = [];
    for (const { route, support, clearance } of access.links) {
      assert.equal(route.length, 37);
      assert.deepEqual(route[0], { x: hub.x, feet: access.chamber.feet, z: hub.z });
      const end = route.at(-1);
      assert.ok(Math.abs(end.x - hub.x) > room.rx || Math.abs(end.z - hub.z) > room.rz);
      const keyPoint = key => key.split(',').map(Number);
      assert.ok([...support].every(key => {
        const cell = keyPoint(key);
        return access.witness.get(...cell) === source.get(...cell) && source.get(...cell) !== BLOCK.AIR;
      }));
      assert.ok([...clearance].every(key => {
        const cell = keyPoint(key);
        return networkAirAt(seed, ...cell) && access.witness.get(...cell) === BLOCK.AIR;
      }));
      assert.equal(traverseRetainedDescent(access.witness, route).ok, true);
      assert.equal(traverseRetainedDescent(access.witness, [...route].reverse()).ok, true);
      corridors.push({ end, supports: support.size, clearance: clearance.size });
    }
    const end = access.links[0].route.at(-1);
    const veto = worldKey(end.x, end.feet - 1, end.z);
    const guarded = surveySupportedChamberAccess(source, { ...options,
      originalProtected: (...cell) => worldKey(...cell) === veto || originalProtected(...cell) });
    assert.equal(guarded.links.length, linkCount - 1);
    assert.equal(guarded.witness.get(end.x, end.feet, end.z), source.get(end.x, end.feet, end.z));
    assert.equal(JSON.stringify(source.save()), save);
    results.push({ seed, layer, cuts: access.cuts.size, faces: access.costs.faceGrowth, corridors });
  }
  console.log('LIVING UNDERWORLD CHAMBER ACCESS ' + JSON.stringify(results));
});
