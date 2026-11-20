import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,worldKey} from '../src/voxel.mjs';
import {LEGACY_WORLD_MIN_Y} from '../src/depth.mjs';
import {
  descentProtectedOpeningPlan,descentEntranceApproach,descentSurfaceSeam
} from '../src/underground-switchback-descent.mjs';

for(const seed of [179,1,2026,-77]){
  test('surface owner receives exact read-only legacy opening, seed '+seed,()=>{
    const world=new VoxelWorld(seed);
    const before=new Map(world.edits);
    const plan=descentProtectedOpeningPlan(world);
    assert.ok(plan.cells.length>0);
    assert.equal(plan.safeToApply,false);
    assert.equal(plan.runtimeVerified,false);
    assert.equal(plan.requiresSurfaceOwner,true);
    assert.deepEqual(world.edits,before,'proposal must never mutate saves');
    const keys=new Set(plan.cells.map(c=>worldKey(c.x,c.y,c.z)));
    assert.equal(keys.size,plan.cells.length,'legacy cells must be deduplicated');
    assert.ok(plan.cells.every(c=>c.y>=LEGACY_WORLD_MIN_Y&&c.id===BLOCK.AIR));
    const expected=new Set();
    for(const step of descentEntranceApproach())
      for(let y=step.feet;y<=step.feet+3;y++)
        if(y>=LEGACY_WORLD_MIN_Y)expected.add(worldKey(step.x,y,step.z));
    assert.deepEqual(keys,expected,'must cover entire protected headroom, not just one opening');
    const conflict=plan.cells[0],key=worldKey(conflict.x,conflict.y,conflict.z);
    world.edits.set(key,BLOCK.DEEPSTONE);
    const blocked=descentProtectedOpeningPlan(world);
    assert.ok(blocked.playerConflicts.some(c=>worldKey(c.x,c.y,c.z)===key));
    assert.ok(blocked.blocked.some(c=>worldKey(c.x,c.y,c.z)===key));
    assert.equal(world.edits.get(key),BLOCK.DEEPSTONE,'must not overwrite player edit');
    assert.equal(descentSurfaceSeam(world).runtimeVerified,false);
    assert.equal(Object.isFrozen(blocked.cells),true);
    assert.equal(Object.isFrozen(blocked.cells[0]),true);
  });
}
