import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,worldKey} from '../src/voxel.mjs';
import {
  descentRoute,descentVolumeEvidence,descentConnectivity,
  descentEntranceConnectivity,descentSurfaceSeam
} from '../src/underground-switchback-descent.mjs';

// Physical acceptance is a conjunction, not a count of planned route points.
// A disconnected or entirely solid band must fail even when other bands exist.
for(const seed of [179,1,2026,-77]){
  test('four-band physical occupancy and saved-edit failure gate seed '+seed,()=>{
    const world=new VoxelWorld(seed);
    const bands=descentVolumeEvidence(world);
    assert.equal(bands.length,4);
    for(const band of bands){
      assert.ok(band.air>0,'missing carved AIR in '+band.low+'..'+band.high);
      assert.ok(band.solid>0,'missing supported floor in '+band.low+'..'+band.high);
    }
    const baseline=descentConnectivity(world);
    assert.equal(baseline.connected,true,JSON.stringify(baseline.failures.slice(0,3)));
    assert.equal(baseline.surfaceConnected,false);
    const route=descentRoute();
    for(const [high,low] of [[-4,-45],[-46,-100],[-101,-155],[-156,-209]]){
      const point=route.find(p=>p.floor<=high&&p.floor>=low);
      assert.ok(point,'no physical route in '+low+'..'+high);
      const key=worldKey(point.x,point.feet+3,point.z);
      const old=world.edits.get(key);
      world.edits.set(key,BLOCK.DEEPSTONE);
      const broken=descentConnectivity(world);
      assert.equal(broken.connected,false,'overhead saved edit must block route in '+low+'..'+high);
      if(old===undefined)world.edits.delete(key);else world.edits.set(key,old);
      assert.equal(descentConnectivity(world).connected,true,'edit removal must restore route');
    }
    assert.equal(descentEntranceConnectivity(world).surfaceConnected,false);
    assert.equal(descentSurfaceSeam(world).runtimeVerified,false);
  });
}
