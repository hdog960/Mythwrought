import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,worldKey} from '../src/voxel.mjs';
import {descentEntranceHandoff,descentSurfaceSeam,descentEntranceConnectivity,descentConnectivity,descentRoute} from '../src/underground-switchback-descent.mjs';

// A synthetic surface-owner reader is deliberately not a production generator.
// It proves the narrow :24 handoff without touching legacy terrain or edits.
for(const seed of [179,1,2026,-77]){
  test('surface handoff remains closed until legacy roof is opened: '+seed,()=>{
    const world=new VoxelWorld(seed);
    const before=new Map(world.edits);
    const handoff=descentEntranceHandoff();
    const closed=descentSurfaceSeam(world);
    assert.equal(closed.clear,false,'untouched surface must not be certified');
    assert.equal(closed.runtimeVerified,false);
    assert.equal(descentEntranceConnectivity(world).approachConnected,false,'protected legacy headroom blocks the complete approach');
    assert.equal(descentConnectivity(world).surfaceConnected,false);
    assert.deepEqual(world.edits,before,'probe must never write a save');
    const opened=new Set();
    for(const p of handoff.approach)
      for(let y=p.feet;y<=p.feet+3;y++)
        if(y>=-3)opened.add(worldKey(p.x,y,p.z));
    const ownerView={
      seed:world.seed,edits:world.edits,
      get(x,y,z){return opened.has(worldKey(x,y,z))?BLOCK.AIR:world.get(x,y,z);}
    };
    const result=descentSurfaceSeam(ownerView);
    assert.equal(result.clear,true,JSON.stringify(result.failures));
    assert.equal(descentEntranceConnectivity(ownerView).approachConnected,true,'surface-owner opening must restore full four-cell approach');
    assert.equal(result.runtimeVerified,false,'synthetic geometry is not WebGL2 proof');
    assert.deepEqual(world.edits,before,'owner mock must not alter original saves');
    const route=descentRoute();
    assert.ok(route.some(p=>p.floor<=-200),'deep route must still exist');
  });
}
