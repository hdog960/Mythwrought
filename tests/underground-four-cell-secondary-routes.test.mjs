// :36 candidate: secondary loops and the entrance must honor the same physical
// four-cell body envelope as the main descent, including saved player edits.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {descentRoute,descentEntranceApproach,descentLoopConnectivity,descentEntranceConnectivity,descentWorld,descentSurfaceSeam} from '../src/underground-switchback-descent.mjs';

for(const seed of [179,1,2026,-77]){
  test('secondary routes have physical four-cell clearance, seed '+seed,()=>{
    const world=new VoxelWorld(seed);
    const loops=descentLoopConnectivity(world);
    assert.equal(loops.connected,true,JSON.stringify(loops.levels.filter(x=>!x.connected).slice(0,1)));
    const entrance=descentEntranceConnectivity(world);
    // The first approach step reaches the protected legacy Y=-3 envelope.
    // Without a :24-approved surface breach, a fresh world MUST report it
    // blocked rather than falsely certify a playable entrance.
    assert.equal(entrance.approachConnected,false);
    assert.ok(entrance.failures.some(f=>f.step===0&&f.reason==='blocked-headroom'));
    assert.equal(entrance.surfaceConnected,false);
    assert.equal(entrance.requiresSurfaceOwner,true);
  });
  test('saved high obstruction invalidates secondary gallery, seed '+seed,()=>{
    const world=new VoxelWorld(seed);
    const anchor=descentRoute().find(p=>p.floor===-80);
    assert.ok(anchor);
    // At the -80 anchor the loop checker includes the branch origin (d=0,t=0).
    assert.equal(world.set(anchor.x,anchor.floor+4,anchor.z,BLOCK.WOOD),true);
    const saved=world.save(),restored=VoxelWorld.restore(saved);
    const loops=descentLoopConnectivity(restored);
    assert.equal(loops.connected,false);
    assert.ok(loops.levels.some(l=>l.failures.some(f=>f.reason==='blocked-headroom'&&f.height===4)));
    assert.deepEqual(restored.save(),saved);
  });
  test('saved high obstruction invalidates entrance, seed '+seed,()=>{
    const world=new VoxelWorld(seed);
    const p=descentEntranceApproach()[3];
    assert.equal(world.set(p.x,p.feet+3,p.z,BLOCK.WOOD),true);
    const saved=world.save(),restored=VoxelWorld.restore(saved);
    const entrance=descentEntranceConnectivity(restored);
    assert.equal(entrance.approachConnected,false);
    assert.ok(entrance.failures.some(f=>f.reason==='blocked-headroom'&&f.height===3));
    assert.equal(descentWorld(restored).get(p.x,p.feet+3,p.z),BLOCK.WOOD);
    assert.deepEqual(restored.save(),saved);
  });
}

// The protected surface breach remains closed until :24/manual integration.
// A player-built WOOD platform is non-air but must never count as geological
// bearing support for a cave stair, even if every other voxel is untouched.
for(const seed of [179,1,2026,-77]){
  test('surface seam rejects saved non-stone stair footing without mutation, seed '+seed,()=>{
    const world=new VoxelWorld(seed);
    const p=descentEntranceApproach()[2];
    assert.equal(world.set(p.x,p.floor,p.z,BLOCK.WOOD),true);
    const saved=world.save(),restored=VoxelWorld.restore(saved);
    const seam=descentSurfaceSeam(restored);
    assert.equal(seam.clear,false);
    assert.equal(seam.runtimeVerified,false);
    assert.ok(seam.failures.some(f=>f.x===p.x&&f.y===p.floor&&f.z===p.z&&f.reason==='missing-solid-support'));
    assert.equal(descentWorld(restored).get(p.x,p.floor,p.z),BLOCK.WOOD);
    assert.deepEqual(restored.save(),saved);
  });
}
