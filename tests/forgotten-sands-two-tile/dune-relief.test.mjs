import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import test from 'node:test';
import { openDesertDuneWitness, surveyDesertDuneRelief } from '../../src/manual-biomes/forgotten-sands-dune-relief.mjs';
import { createRestoredDesertResearchWorld } from '../../src/manual-biomes/forgotten-sands-restored-ground.mjs';
import { P0_TILE_BASE } from '../../src/manual-biomes/forgotten-sands-tile-world.mjs';

const root = process.env.P0_CURRENT_SOURCE;
assert.ok(root, 'P0_CURRENT_SOURCE must point to the pinned game source checkout');
assert.equal(execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(), P0_TILE_BASE);
const load = path => import(pathToFileURL(resolve(root, path)).href);
const [P, V] = await Promise.all(['src/manual-biomes/profile-world.mjs', 'src/voxel.mjs'].map(load));

test('physical wind dunes rise gently over registered caps and taper around reserved source', () => {
  const Host = createRestoredDesertResearchWorld(P.FourRegionWorld, V.terrainHeight), results = [];
  for (const [seed, count] of [[42, 2411], [10301, 2551]]) {
    const source = new Host(seed, P.fourRegionProfile(seed, P.M8_MOUNTAIN_GENERATOR));
    const plan = surveyDesertDuneRelief(source, 510, -75);
    assert.ok(plan);
    assert.equal(plan.cells.length, count);
    assert.deepEqual(plan, surveyDesertDuneRelief(source, 510, -75));
    const world = openDesertDuneWitness(source, plan);
    const rises = new Map(plan.columns.map(([x, z, base, top]) => [x + ',' + z, top - base]));
    let peak;
    for (const [x, z, base, top] of plan.columns) {
      assert.ok(top <= 19 && top > base);
      assert.equal(world.get(x, base, z), source.get(x, base, z));
      assert.equal(world.get(x, top, z), 257);
      for (let y = base + 1; y <= top; y++) {
        assert.equal(source.get(x, y, z), V.BLOCK.AIR);
        assert.ok(world.get(x, y, z) === 257 || world.get(x, y, z) === 261);
      }
      for (const [dx, dz] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        assert.ok(Math.abs(top - base - (rises.get((x + dx) + ',' + (z + dz)) ?? 0)) <= 1);
      }
      if (!peak || top - base > peak[3] - peak[2]) peak = [x, z, base, top];
    }
    const [x, z, base, top] = peak;
    assert.equal(top - base, 6);
    assert.deepEqual(V.raycast(world, [x + .5, top + 3, z + .5], [0, -1, 0], 5)?.hit, [x, top, z]);
    const mesh = [Math.floor(x / 16), Math.floor(z / 16), 0];
    assert.notDeepEqual(V.meshChunk(world, ...mesh), V.meshChunk(source, ...mesh));
    assert.deepEqual(V.meshChunk(world, 0, 0, 0), V.meshChunk(source, 0, 0, 0));
    const guarded = surveyDesertDuneRelief(source, 510, -75, { reservedAt: (a, y, b) => a === x && y === base + 1 && b === z });
    assert.ok(guarded?.cells.length > 0 && guarded.cells.length < plan.cells.length);
    assert.ok(guarded.columns.every(([a, b]) => a !== x || b !== z));
    assert.equal(source.edits.size, 0);
    assert.throws(() => world.save(), /separate world profile/);
    results.push({ seed, peak, columns: plan.columns.length, addedCells: plan.cells.length, afterVeto: guarded.cells.length });
  }
  console.log('FORGOTTEN SANDS DUNES ' + JSON.stringify(results));
});
