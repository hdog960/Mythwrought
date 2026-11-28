import assert from 'node:assert/strict';
import test from 'node:test';
import { FrostboundSixRegionsCandidate } from '../../src/frostbound/s4-silverwood-barrens.mjs';
import { openMirrorfrostPondWitness, surveyMirrorfrostPond } from '../../src/frostbound/s5-frozen-pond.mjs';
import { Pack2LiveWorld } from '../../src/pack2-world.mjs';
import { pack2WaterSectionVertices } from '../../src/pack2-integration.mjs';
import { BLOCK, collides, meshChunk, raycast, worldKey } from '../../src/voxel.mjs';

test('natural Mirrorfrost ponds hold packed water beneath solid selectable ice across a chunk seam', () => {
  const results = [];
  for (const [seed, x, z, expectedArea] of [[42, 142, 427, 21], [10301, 114, 374, 12], [179, 142, 322, 57]]) {
    const source = new FrostboundSixRegionsCandidate(seed);
    const pond = surveyMirrorfrostPond(source, x, z);
    assert.ok(pond);
    assert.equal(pond.ice.length, expectedArea);
    assert.equal(pond.iceY, pond.ice[0][1]);
    const frozen = new Pack2LiveWorld(openMirrorfrostPondWitness(source, pond));
    const open = new Pack2LiveWorld(openMirrorfrostPondWitness(source, pond, { iceCover: false }));
    const dry = new Pack2LiveWorld(source);
    for (const cell of pond.ice) {
      assert.equal(frozen.get(...cell), 275);
      assert.equal(open.get(...cell), BLOCK.AIR);
      assert.equal(source.get(...cell), BLOCK.AIR);
    }
    for (const point of pond.snowRemoved) assert.ok([272, 275].includes(source.get(...point)));
    for (const [wx, wy, wz] of pond.water) {
      const water = frozen.getPack2State(wx, wy, wz);
      assert.deepEqual(water, { id: 76, level: 0, flow: 'still', source: true });
      assert.deepEqual(open.getPack2State(wx, wy, wz), water);
      assert.equal(dry.getPack2State(wx, wy, wz), null);
      for (const [dx, dz] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        assert.ok(frozen.get(wx + dx, wy, wz + dz) !== BLOCK.AIR);
      }
    }
    for (const bank of pond.shore) assert.equal(frozen.get(...bank), source.get(...bank));
    const y = pond.iceY;
    assert.deepEqual(raycast(frozen, [x + .5, y + 4, z + .5], [0, -1, 0], 6)?.hit, [x, y, z]);
    assert.equal(collides(frozen, x + .5, y + 1.02, z + .5), false);
    assert.equal(collides(frozen, x + .5, y + .97, z + .5), true);
    assert.equal(collides(open, x + .5, y + .97, z + .5), false);

    const owners = new Set(pond.ice.map(([px, , pz]) => Math.floor(px / 16) + ',' + Math.floor(pz / 16)));
    if (seed === 42) assert.equal(owners.size, 2);
    if (seed === 179) assert.equal(owners.size, 4);
    let opaqueBytes = 0, waterBytes = 0;
    for (const key of owners) {
      const [cx, cz] = key.split(',').map(Number);
      const entries = frozen.pack2WaterSectionEntries(cx, cz, 0);
      assert.ok(entries.length > 0 && entries.every(([key]) =>
        pond.water.some(point => worldKey(...point) === key)));
      const terrain = meshChunk(frozen, cx, cz, 0);
      assert.notDeepEqual(terrain, meshChunk(dry, cx, cz, 0));
      opaqueBytes += terrain.byteLength;
      const fluids = pack2WaterSectionVertices(frozen, cx, cz, 0);
      assert.ok(fluids.byteLength > 0);
      assert.deepEqual(fluids, pack2WaterSectionVertices(open, cx, cz, 0));
      waterBytes += fluids.byteLength;
    }
    assert.deepEqual(meshChunk(frozen, 0, 0, 0), meshChunk(dry, 0, 0, 0));
    assert.equal(source.edits.size, 0);
    assert.throws(() => frozen.base.save(), /separate save profile/);

    const protectedKey = worldKey(...pond.ice[0]);
    const guarded = Object.create(source, { environmentCaves: { value: { get(...point) {
      return worldKey(...point) === protectedKey ? BLOCK.AIR : source.environmentCaves.get(...point);
    } } } });
    assert.equal(surveyMirrorfrostPond(guarded, x, z), null);
    results.push({ seed, x, z, y, ice: pond.ice.length, water: pond.water.length, bank: pond.shore.length,
      owners: [...owners], opaqueBytes, waterBytes });
  }
  console.log('MIRRORFROST FROZEN PONDS ' + JSON.stringify(results));
});
