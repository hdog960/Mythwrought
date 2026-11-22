import {test} from 'node:test';
import assert from 'node:assert/strict';
import {ENVIRONMENT_GROUND as G} from '../../src/environment-ground.mjs';
import {resolveEnchantedTreeOverlap as merge}
  from '../../src/manual-biomes/enchanted-tree-overlap.mjs';

test('bark always survives neighboring enchanted crown cells, independent of iteration',()=>{
  for(const other of [G.aetherLeaves,G.moonLeaves,G.aetherBark]){
    assert.equal(merge(G.aetherBark,other),G.aetherBark);
    assert.equal(merge(other,G.aetherBark),G.aetherBark);
  }
});
test('moonleaves outrank aetherleaves and order never changes overlapping leaf material',()=>{
  assert.equal(merge(G.aetherLeaves,G.moonLeaves),G.moonLeaves);
  assert.equal(merge(G.moonLeaves,G.aetherLeaves),G.moonLeaves);
});
test('all candidate overlap triples commute, including multi-chunk sites in different orders',()=>{
  const ids=[G.aetherLeaves,G.moonLeaves,G.aetherBark];
  for(const a of ids)for(const b of ids)for(const c of ids){
    const ordered=merge(merge(a,b),c);
    assert.equal(ordered,merge(merge(b,c),a));
    assert.equal(ordered,merge(merge(c,a),b));
  }
});
test('existing non-enchanted trees are never replaced by opt-in enchanted canopy spillover',()=>{
  assert.equal(merge(undefined,G.aetherBark),G.aetherBark);
  for(const original of [G.coldNeedles,G.snowyNeedles,0,3,258])
    for(const incoming of [G.aetherBark,G.aetherLeaves,G.moonLeaves])
      assert.equal(merge(original,incoming),original,
        'experimental canopy cannot overwrite a prior non-enchanted voxel');
  // The original caller deliberately retains its own write-order semantics:
  // unrelated non-candidate writes are never passed through this function.
  assert.equal(merge(G.aetherBark,G.coldNeedles),G.coldNeedles);
});
