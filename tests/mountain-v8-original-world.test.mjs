// Authentic-source read-only acceptance, not a V8 integration or browser test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK,terrainHeight} from '../src/voxel.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {surveyMountainV8OriginalWorld as survey}
  from '../src/manual-biomes/mountain-v8-original-world.mjs';

test('real original-world reader never edits, converts or saves a V7 world',()=>{
  const seed=179,world=new VoxelWorld(seed),before=JSON.stringify(world.save());
  const sites=[[-512,0],[-516,0],[-520,0],[-524,8],[-508,12],[-536,-12]];
  for(const [x,z] of sites){
    const got=survey(x,z,seed,{world});
    if(got){
      assert.equal(got.originalSource,'VoxelWorld.naturalAndLandmarkBlock');
      assert.equal(got.heightSource,'terrainHeight');
      assert.equal(got.biomeSource,'v6BiomeAt');
      assert.equal(got.safeToIntegrate,false);
      assert.equal(got.noLiveV7Dispatch,true);
      assert.equal(got.legacyTop,terrainHeight(x,z,seed));
      assert.equal(v6BiomeAt(x,z,seed)?.name,'mountain');
    }
  }
  assert.equal(JSON.stringify(world.save()),before,'read-only original terrain survey changed schema-1 bytes');
  assert.equal(world.edits.size,0);
});
test('genuine protected cave AIR and foreign biomes are never promoted into V8 terrain',()=>{
  const seed=179,world=new VoxelWorld(seed);
  // Physical original cave throat previously verified at seed179; reject
  // any proposal over protected AIR instead of filling or converting it.
  for(let x=-488;x<=-484;x++)for(let z=23;z<=25;z++){
    const top=terrainHeight(x,z,seed);
    assert.equal(world.naturalAndLandmarkBlock(x,top,z),BLOCK.AIR);
    assert.equal(survey(x,z,seed,{world}),null);
  }
  for(const [x,z] of [[0,0],[512,0],[0,512],[0,-512]])
    assert.equal(survey(x,z,seed,{world}),null);
  assert.equal(world.edits.size,0);
});
test('rejects already edited, foreign seed and invalid coordinates without touching edits',()=>{
  const world=new VoxelWorld(179);
  assert.equal(survey(0,0,2026,{world}),null);
  assert.equal(survey(NaN,0,179,{world}),null);
  assert.equal(survey(0,Infinity,179,{world}),null);
  assert.equal(survey(0,0,179.5,{world}),null);
  world.edits.set('0,3,0',BLOCK.STONE);
  assert.equal(survey(-512,0,179,{world}),null);
  assert.equal(world.edits.size,1);
});

test('rejects profiled world subclasses even when save maps happen to be empty',()=>{
  class ProfiledWorld extends VoxelWorld{}
  const profiled=new ProfiledWorld(179);
  assert.equal(profiled.edits.size,0);
  assert.equal(survey(-512,0,179,{world:profiled}),null,
    'An opt-in profile must never masquerade as the pristine legacy source');
});
