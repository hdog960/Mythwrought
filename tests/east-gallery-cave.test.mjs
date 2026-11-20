import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {eastGalleryCaveWorld,eastGalleryTrace,eastGalleryChamberTrace,eastGalleryConnectionTrace} from '../src/east-gallery-cave.mjs';
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

for(const seed of [179,17,918]){
  test('entire east chamber is body-traversable with 35 supported cells seed '+seed,()=>{
    const world=new VoxelWorld(seed);
    const result=eastGalleryChamberTrace(world);
    assert.equal(result.cells.length,35);
    assert.equal(result.reachableCount,35,JSON.stringify(result.unreachable));
    assert.equal(result.walkable,true);
    assert.ok(result.edges.every(edge=>edge.clear));
    assert.deepEqual(eastGalleryChamberTrace(world),result);
  });
}
test('side-pocket player edit is preserved and full chamber traversal reports obstruction',()=>{
  const world=new VoxelWorld(179);
  const before=eastGalleryChamberTrace(world);
  assert.equal(before.walkable,true);
  const side=before.cells.find(c=>c.d===6&&c.t===before.cells[0].t+3);
  assert.ok(side);
  world.set(side.x,side.y??before.entry.y,side.z,BLOCK.STONE);
  const after=eastGalleryChamberTrace(world);
  assert.equal(after.walkable,false);
  assert.ok(after.unreachable.some(c=>c.x===side.x&&c.z===side.z));
  assert.equal(eastGalleryCaveWorld(world).get(side.x,before.entry.y,side.z),BLOCK.STONE);
  assert.equal(world.save().schema,1);
  assert.equal(world.save().edits.length,1);
});

for(const seed of [179,17,918]){
  test('south gallery aisle joins east chamber by swept cardinal player-body route seed '+seed,()=>{
    const world=new VoxelWorld(seed);
    const trace=eastGalleryConnectionTrace(world);
    assert.equal(trace.samples.length,16);
    assert.equal(trace.transitions.length,15);
    assert.ok(trace.samples.every(s=>s.supported&&s.headroom&&s.bodyClear),JSON.stringify(trace.samples));
    assert.ok(trace.transitions.every(t=>t.cardinal&&t.clear),JSON.stringify(trace.transitions));
    assert.equal(trace.walkable,true);
    assert.deepEqual(eastGalleryConnectionTrace(world),trace);
  });
}
test('saved obstruction in the connecting throat blocks route but remains saved',()=>{
  const world=new VoxelWorld(179);
  const route=eastGalleryConnectionTrace(world);
  assert.equal(route.walkable,true);
  const throat=route.samples[6];
  world.set(throat.x,throat.feet,throat.z,BLOCK.STONE);
  const blocked=eastGalleryConnectionTrace(world);
  assert.equal(blocked.walkable,false);
  assert.equal(eastGalleryCaveWorld(world).get(throat.x,throat.feet,throat.z),BLOCK.STONE);
  assert.equal(world.save().schema,1);
  assert.equal(world.save().edits.length,1);
});
