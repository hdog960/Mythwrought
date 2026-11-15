import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,collides} from '../src/voxel.mjs';
import {CAVE_CANDIDATE,caveRoute} from '../src/experimental-cave-route.mjs';
import {southGalleryCaveWorld,southGalleryTrace} from '../src/south-gallery-cave.mjs';

for(const seed of [179,1,2026,-77]){
  test('south gallery has real floors, headroom, and deterministic route: '+seed,()=>{
    const world=new VoxelWorld(seed),saved=JSON.stringify(world.save());
    const gallery=southGalleryCaveWorld(world),trace=southGalleryTrace(world);
    assert.equal(trace.samples.length,8);
    assert.equal(trace.walkable,true,JSON.stringify(trace.failures));
    assert.deepEqual(trace.failures,[]);
    assert.deepEqual(trace.blockedTransitions,[]);
    assert.equal(trace.transitions.length,7);
    assert.ok(trace.bodyHeight>1&&trace.bodyRadius>0);
    for(const point of trace.samples){
      assert.equal(point.bodyClear,true);
      assert.equal(collides(gallery,point.x+.5,point.feet,point.z+.5),false);
    }
    const t=CAVE_CANDIDATE.length-11,x=CAVE_CANDIDATE.x+t;
    const floor=caveRoute(seed).floorAt(t);
    for(let d=5;d<=10;d++){
      const z=CAVE_CANDIDATE.z+d;
      assert.equal(gallery.get(x,floor,z),BLOCK.STONE);
      for(let y=floor+1;y<=floor+5;y++)assert.equal(gallery.get(x,y,z),BLOCK.AIR);
    }
    assert.equal(JSON.stringify(world.save()),saved);
    assert.deepEqual(southGalleryTrace(new VoxelWorld(seed)),trace);
  });
}
test('saved player placement wins over south gallery carving',()=>{
  const world=new VoxelWorld(179),t=CAVE_CANDIDATE.length-11;
  const x=CAVE_CANDIDATE.x+t,z=CAVE_CANDIDATE.z+8;
  const y=caveRoute(179).floorAt(t)+1;
  assert.equal(world.set(x,y,z,BLOCK.WOOD),true);
  const saved=JSON.stringify(world.save());
  assert.equal(southGalleryCaveWorld(world).get(x,y,z),BLOCK.WOOD);
  assert.equal(southGalleryTrace(world).walkable,false);
  assert.equal(JSON.stringify(world.save()),saved);
});

test('a saved wall at the throat blocks physical traversal without modifying edits',()=>{
  const world=new VoxelWorld(179),before=southGalleryTrace(world);
  const point=before.samples[1];
  assert.equal(world.set(point.x,point.feet,point.z,BLOCK.STONE),true);
  const saved=JSON.stringify(world.save());
  const trace=southGalleryTrace(world);
  assert.equal(trace.walkable,false);
  assert.ok(trace.failures.some(p=>p.z===point.z&&!p.bodyClear));
  assert.equal(JSON.stringify(world.save()),saved);
});
