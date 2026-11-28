import assert from 'node:assert/strict';
import test from 'node:test';
import { BLOCK, chunkWindow, collides, meshChunk, raycast } from '../src/voxel.mjs';
import { runtimeMeshKey, runtimeSectionForY } from '../src/world-height.mjs';
import { planHeightStream } from '../src/world-height-stream.mjs';
import { validateUpperSectionGeometry, UPPER_GPU_OWNERS, UPPER_RESIDENT_BYTES } from '../src/world-height-budget.mjs';
import { ShatteredPeaksStrataWorld } from '../src/manual-biomes/shattered-peaks-strata.mjs';
import { openShatteredPineWitness, surveyShatteredPine } from '../src/manual-biomes/shattered-peaks-conifers.mjs';

test('native mountain pines root on real meadow and loam with original upper-owner limits', () => {
  const variants = [
    [179, -66, -9, 'dwarf', 'emerald-highlands', [-524, 70, -68]],
    [42, -48, 14, 'tall', 'ironpine-highlands', [-382, 62, 117]]
  ];
  const results = [];
  for (const [seed, tx, tz, kind, name, root] of variants) {
    const terrain = new ShatteredPeaksStrataWorld(seed), tree = surveyShatteredPine(terrain, tx, tz, kind);
    assert.ok(tree);
    assert.equal(tree.region, name);
    assert.deepEqual(tree.support, root);
    assert.equal(tree.cells.length, kind === 'dwarf' ? 13 : 16);
    const world = openShatteredPineWitness(terrain, tree), [x, y, z] = root;
    const top = Math.max(...tree.cells.map(cell => cell[1]));
    assert.equal(top - y, kind === 'dwarf' ? 5 : 8);
    assert.equal(world.get(...root), terrain.get(...root));
    const nativeOwners = new Set();
    for (const [x, y, z, id] of tree.cells) {
      assert.equal(terrain.get(x, y, z), BLOCK.AIR);
      assert.equal(world.get(x, y, z), id);
      nativeOwners.add(runtimeMeshKey(Math.floor(x / 16), Math.floor(z / 16), runtimeSectionForY(y)));
    }
    assert.equal(collides(terrain, x + .5, y + 1.01, z + .5), false);
    assert.equal(collides(world, x + .5, y + 1.01, z + .5), true);
    assert.deepEqual(raycast(world, [x + .5, top + 3, z + .5], [0, -1, 0], 6)?.hit, [x, top, z]);
    const pose = { x: x + 1.5, feet: y + 2, z: z + .5 };
    const chosen = planHeightStream(world, pose, chunkWindow(pose.x, pose.z, 2).map(owner => ({ ...owner, section: 0 })));
    const selected = new Set(chosen.map(owner => runtimeMeshKey(owner.cx, owner.cz, owner.section)));
    assert.ok([...nativeOwners].every(key => selected.has(key)));
    let upperOwners = 0, upperBytes = 0;
    for (const { cx, cz, section } of chosen.filter(owner => owner.section > 0)) {
      const geometry = meshChunk(world, cx, cz, section);
      const bytes = validateUpperSectionGeometry(geometry, new Float32Array());
      if (bytes) upperOwners++;
      upperBytes += bytes;
      if (nativeOwners.has(runtimeMeshKey(cx, cz, section))) {
        assert.notDeepEqual(geometry, meshChunk(terrain, cx, cz, section));
      }
    }
    assert.ok(chosen.length <= 25 && upperOwners <= UPPER_GPU_OWNERS && upperBytes <= UPPER_RESIDENT_BYTES);
    assert.equal(terrain.edits.size, 0);
    assert.throws(() => world.save(), /separate save profile/);
    results.push({ seed, kind, name, root, top, nativeOwners: [...nativeOwners], upperOwners, upperBytes });
  }
  console.log('SHATTERED PEAKS ROOTED CONIFERS ' + JSON.stringify(results));
});
