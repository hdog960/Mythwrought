import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_WORLD_SEED,worldSeedFromText,worldSlotKey} from '../src/seeds.mjs';
import {VoxelWorld,terrainHeight} from '../src/voxel.mjs';

test('seed text and numeric inputs convert repeatably including overflow',()=>{
  assert.equal(DEFAULT_WORLD_SEED,179);
  assert.equal(worldSeedFromText('  +179 '),179);
  assert.equal(worldSeedFromText('-1'),-1);
  assert.equal(worldSeedFromText('4294967295'),-1);
  assert.equal(worldSeedFromText('-2147483648'),-2147483648);
  assert.equal(worldSeedFromText('18446744073709551616'),0);
  assert.equal(worldSeedFromText('Moonlit Vale'),worldSeedFromText('Moonlit Vale'));
  assert.equal(worldSeedFromText('é'),worldSeedFromText('e\u0301'));
  assert.notEqual(worldSeedFromText('Moonlit Vale'),worldSeedFromText('Obsidian Deep'));
  assert.throws(()=>worldSeedFromText(''));
  assert.throws(()=>worldSeedFromText('a'.repeat(81)));
});
test('different seeds create independent deterministic terrain and edit slots',()=>{
  const a=worldSeedFromText('Moonlit Vale'),b=worldSeedFromText('Obsidian Deep');
  const heights=(s)=>Array.from({length:64},(_,i)=>terrainHeight(i*13-169,i*23-258,s));
  assert.deepEqual(heights(a),heights(worldSeedFromText('Moonlit Vale')));
  assert.notDeepEqual(heights(a),heights(b));
  const w=new VoxelWorld(a);w.set(12,15,-4,4);
  assert.equal(VoxelWorld.restore(w.save()).get(12,15,-4),4);
  assert.notEqual(worldSlotKey(a),worldSlotKey(b));
  assert.throws(()=>worldSlotKey(2**40));
  assert.throws(()=>worldSlotKey(1.5));
});
