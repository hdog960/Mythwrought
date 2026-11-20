import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,VoxelWorld,worldKey} from '../src/voxel.mjs';
import {WORLD_MIN_Y,LEGACY_WORLD_MIN_Y} from '../src/depth.mjs';
import {
  descentRoute,descentConnectivity,descentEvidence,descentVolumeEvidence,
  descentEntranceApproach,descentEntranceConnectivity,descentSurfaceSeam,
  descentEntranceHandoff,descentWorld
} from '../src/underground-switchback-descent.mjs';

// A four-band failure-injection gate: a route array alone is not physical
// connectivity, and a simulated surface opening is not live-game evidence.
// Every probe is read-only except deliberate edits to disposable test worlds.
const bands=[
  {name:'upper',high:-4,low:-45},
  {name:'middle',high:-46,low:-100},
  {name:'lower',high:-101,low:-155},
  {name:'deepest',high:-156,low:WORLD_MIN_Y+1}
];
for(const seed of [179,1,2026,-77]){
  test('four-band obstruction and saved-edit precedence: '+seed,()=>{
    const world=new VoxelWorld(seed);
    const route=descentRoute();
    const baseline=descentConnectivity(world);
    assert.equal(baseline.connected,true,JSON.stringify(baseline.failures.slice(0,3)));
    assert.equal(baseline.surfaceConnected,false);
    assert.ok(baseline.bands.every(n=>n>0));
    const volumes=descentVolumeEvidence(world);
    const evidence=descentEvidence(world);
    assert.equal(volumes.length,4);
    for(let i=0;i<4;i++){
      assert.ok(volumes[i].air>0&&volumes[i].solid>0,bands[i].name);
      assert.equal(evidence[i].invalid,0,bands[i].name);
    }
    assert.equal(world.edits.size,0,'candidate generation must not persist edits');
    for(const band of bands){
      const p=route.find(s=>s.floor<=band.high&&s.floor>=band.low);
      assert.ok(p,band.name+' has an authored step');
      const key=worldKey(p.x,p.feet+3,p.z);
      const old=world.edits.get(key);
      world.edits.set(key,BLOCK.DEEPSTONE);
      assert.equal(descentWorld(world).get(p.x,p.feet+3,p.z),BLOCK.DEEPSTONE);
      const blocked=descentConnectivity(world);
      assert.equal(blocked.connected,false,band.name+' must fail on saved roof obstruction');
      assert.ok(blocked.failures.some(f=>f.reason==='blocked-or-unsupported'),band.name);
      assert.ok(descentEvidence(world).some(e=>e.invalid>0),band.name);
      if(old===undefined)world.edits.delete(key);else world.edits.set(key,old);
      assert.equal(descentConnectivity(world).connected,true,band.name+' must recover');
      const floorKey=worldKey(p.x,p.floor,p.z);
      const prior=world.edits.get(floorKey);
      world.edits.set(floorKey,BLOCK.AIR);
      assert.equal(descentConnectivity(world).connected,false,band.name+' missing floor');
      if(prior===undefined)world.edits.delete(floorKey);else world.edits.set(floorKey,prior);
      assert.equal(descentConnectivity(world).connected,true);
    }
    assert.equal(world.edits.size,0,'test cleanup must restore original edits');
  });
  test('surface-owner seam and player edit rejection: '+seed,()=>{
    const world=new VoxelWorld(seed);
    const approach=descentEntranceApproach();
    const opening=descentEntranceHandoff().opening;
    assert.equal(opening.y,LEGACY_WORLD_MIN_Y);
    assert.equal(descentSurfaceSeam(world).clear,false);
    assert.equal(descentEntranceConnectivity(world).approachConnected,false);
    const opened=new Set();
    for(const p of approach)for(let y=p.feet;y<=p.feet+3;y++)
      if(y>=LEGACY_WORLD_MIN_Y)opened.add(worldKey(p.x,y,p.z));
    const owner={seed:world.seed,edits:world.edits,
      get(x,y,z){return opened.has(worldKey(x,y,z))?BLOCK.AIR:world.get(x,y,z);}};
    assert.equal(descentSurfaceSeam(owner).clear,true);
    assert.equal(descentEntranceConnectivity(owner).approachConnected,true);
    const p=approach.at(-1);
    const key=worldKey(p.x,p.floor,p.z);
    world.edits.set(key,BLOCK.AIR);
    assert.equal(descentSurfaceSeam(owner).clear,false,'saved missing floor invalidates opening');
    assert.equal(descentEntranceConnectivity(owner).approachConnected,false);
    world.edits.delete(key);
    assert.equal(descentSurfaceSeam(owner).clear,true);
    assert.equal(descentSurfaceSeam(owner).runtimeVerified,false);
    assert.equal(world.edits.size,0);
  });
}
