import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,worldKey} from '../src/voxel.mjs';
import {descentWorld,descentRoute,descentTopologyCacheStats} from '../src/underground-switchback-descent.mjs';

// A full-depth topology contains many voxels. Visiting arbitrary preview
// origins must not retain an unbounded number of complete maps in memory.
test('deep topology cache is bounded and old readers survive LRU eviction',()=>{
  const world=new VoxelWorld(179);
  const origins=Array.from({length:6},(_,i)=>({x:192+i*320,z:192+i*320}));
  const first=descentWorld(world,origins[0]);
  const point=descentRoute(origins[0]).find(p=>p.floor===-130);
  assert.ok(point);
  assert.equal(first.get(point.x,point.feet,point.z),BLOCK.AIR);
  for(const origin of origins.slice(1)){
    const reader=descentWorld(world,origin);
    const p=descentRoute(origin).find(q=>q.floor===-130);
    assert.equal(reader.get(p.x,p.feet,p.z),BLOCK.AIR);
    const stats=descentTopologyCacheStats();
    assert.ok(stats.origins<=stats.limit);
    assert.equal(stats.limit,2);
  }
  assert.equal(descentTopologyCacheStats().origins,2);
  assert.equal(first.get(point.x,point.feet,point.z),BLOCK.AIR,
    'eviction must not invalidate a reader that was already handed out');
  const key=worldKey(point.x,point.feet,point.z);
  world.edits.set(key,BLOCK.DEEPSTONE);
  assert.equal(first.get(point.x,point.feet,point.z),BLOCK.DEEPSTONE);
  assert.equal(descentWorld(world,origins[0]).get(point.x,point.feet,point.z),BLOCK.DEEPSTONE);
  world.edits.delete(key);
  assert.equal(first.get(point.x,point.feet,point.z),BLOCK.AIR);
  assert.equal(descentTopologyCacheStats().origins,2);
});
