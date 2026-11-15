import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {eastGalleryCaveWorld,eastGalleryTrace} from '../src/east-gallery-cave.mjs';
import {CAVE_CANDIDATE} from '../src/experimental-cave-route.mjs';

for(const seed of [179,17,918]){
  test('east gallery deterministic walkable stone-floored chamber seed '+seed,()=>{
    const world=new VoxelWorld(seed),a=eastGalleryTrace(world);
    assert.equal(a.samples.length,9);
    assert.equal(a.transitions.length,8);
    assert.deepEqual(a.blockedTransitions,[]);
    assert.deepEqual(a.failures,[]);
    assert.equal(a.walkable,true,JSON.stringify(a.samples.filter(p=>!p.supported||!p.headroom||!p.bodyClear)));
    const reader=eastGalleryCaveWorld(world);
    assert.equal(reader.get(a.chamber.x,a.chamber.y,a.chamber.z),BLOCK.AIR);
    assert.equal(reader.get(a.chamber.x,a.chamber.y-1,a.chamber.z),BLOCK.STONE);
    assert.deepEqual(eastGalleryTrace(world),a);
  });
}
test('opt-in only; preserves base world and saved edit overrides',()=>{
  const world=new VoxelWorld(179),trace=eastGalleryTrace(world);
  const original=world.get(trace.chamber.x,trace.chamber.y,trace.chamber.z);
  const reader=eastGalleryCaveWorld(world);
  assert.equal(world.get(trace.chamber.x,trace.chamber.y,trace.chamber.z),original);
  assert.equal(world.save().schema,1);
  world.set(trace.chamber.x,trace.chamber.y,trace.chamber.z,BLOCK.WOOD);
  assert.equal(reader.get(trace.chamber.x,trace.chamber.y,trace.chamber.z),BLOCK.WOOD);
  assert.equal(world.save().edits.length,1);
});

test('saved obstruction in east chamber invalidates player-body route without erasing edit',()=>{
  const world=new VoxelWorld(179);
  const initial=eastGalleryTrace(world);
  assert.equal(initial.walkable,true);
  const middle=initial.samples[4];
  world.set(middle.x,middle.feet,middle.z,BLOCK.STONE);
  const blocked=eastGalleryTrace(world);
  assert.equal(blocked.walkable,false);
  assert.ok(blocked.failures.some(p=>p.x===middle.x&&p.z===middle.z));
  assert.equal(eastGalleryCaveWorld(world).get(middle.x,middle.feet,middle.z),BLOCK.STONE);
  assert.equal(world.save().schema,1);
  assert.equal(world.save().edits.length,1);
});
