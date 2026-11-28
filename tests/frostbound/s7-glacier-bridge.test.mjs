import assert from 'node:assert/strict';
import test from 'node:test';
import { BLOCK, meshChunk, raycast } from '../../src/voxel.mjs';
import { FrostboundSixRegionsCandidate } from '../../src/frostbound/s4-silverwood-barrens.mjs';
import { inspectGlacierBridgeWalk, openGlacierBridgeWitness, surveyGlacierBridge } from '../../src/frostbound/s7-glacier-bridge.mjs';

test('Glacier Bridge spans a real gap with original ice banks and a two-way native walk', () => {
  const results = [];
  for (const [seed, site] of [[179, { x: -154, z: 332, axis: 'z', span: 9 }],
    [10301, { x: -130, z: 335, axis: 'x', span: 11 }]]) {
    const source = new FrostboundSixRegionsCandidate(seed), bridge = surveyGlacierBridge(source, site);
    assert.ok(bridge);
    assert.equal(bridge.banks.length, 6);
    const world = openGlacierBridgeWitness(source, bridge);
    const owners = new Set();
    for (const [x, y, z, id] of bridge.cells) {
      assert.equal(source.get(x, y, z), BLOCK.AIR);
      assert.equal(world.get(x, y, z), id);
      owners.add([Math.floor(x / 16), Math.floor(z / 16)].join(','));
    }
    for (const [x, y, z] of bridge.banks) {
      assert.equal(world.get(x, y, z), source.get(x, y, z));
      for (let dy = y + 1; dy <= bridge.origin[1]; dy++) assert.notEqual(world.get(x, dy, z), BLOCK.AIR);
    }
    const gap = bridge.route.filter(([x, feet, z]) => world.get(x, feet - 2, z) === BLOCK.AIR);
    assert.equal(gap.length, bridge.deepFloor);
    const [x, feet, z] = gap[Math.floor(gap.length / 2)];
    assert.deepEqual(raycast(world, [x + .5, feet + 2, z + .5], [0, -1, 0], 5)?.hit, [x, feet - 1, z]);
    assert.equal(world.get(x, feet - 1, z), 275);
    const walk = inspectGlacierBridgeWalk(source, bridge);
    assert.ok(walk?.forward > 0 && walk.reverse > 0);
    for (const owner of owners) {
      const coordinates = owner.split(',').map(Number);
      assert.notDeepEqual(meshChunk(world, ...coordinates), meshChunk(source, ...coordinates));
    }
    const guarded = Object.create(source, { environmentCaves: { value: { get(a, y, b) {
      return a === x && y === feet - 1 && b === z ? BLOCK.AIR : source.environmentCaves.get(a, y, b);
    } } } });
    assert.equal(surveyGlacierBridge(guarded, site), null);
    assert.throws(() => world.save(), /separate save profile/);
    results.push({ seed, origin: bridge.origin, span: bridge.span, gap: bridge.deepFloor,
      banks: bridge.banks.length, cells: bridge.cells.length, owners: owners.size, ...walk });
  }
  console.log('FROSTBOUND GLACIER BRIDGES ' + JSON.stringify(results));
});
