import test from 'node:test';
import assert from 'node:assert/strict';
import {inspectMountainV8OptInSeed as inspect}
  from '../src/manual-biomes/mountain-v8-opt-in-seed-preflight.mjs';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {worldSlotKey,SELECTED_SEED_KEY} from '../src/seeds.mjs';
import {activateFourRegionProfile,BIOME_PROFILE_SUFFIX}
  from '../src/manual-biomes/profile-storage.mjs';
import {M7_ENVIRONMENT_GENERATOR,fourRegionProfile}
  from '../src/manual-biomes/profile-world.mjs';

function storage(){
  const data=new Map();
  return {
    get length(){return data.size;},
    key(i){return [...data.keys()][i]??null;},
    getItem(k){return data.has(String(k))?data.get(String(k)):null;},
    setItem(k,v){data.set(String(k),String(v));},
    removeItem(k){data.delete(String(k));},
    snapshot(){return JSON.stringify([...data])}
  };
}
function inspectWithoutWrites(store,seed){
  const before=store.snapshot();
  const out=inspect(store,seed);
  assert.equal(store.snapshot(),before,'preflight must not mutate source storage');
  assert.equal(Object.isFrozen(out),true);
  assert.equal(out.safeToIntegrate,false);
  assert.equal(out.runtimeActivationAuthorized,false);
  assert.equal(out.approvedV8GeneratorIdentity,null);
  assert.equal(out.approvedV8MaterialMapping,null);
  return out;
}
test('unused original seeds are only preliminary read-only candidates',()=>{
  for(const seed of [179,2026]){
    const out=inspectWithoutWrites(storage(),seed);
    assert.equal(out.seed,seed);
    assert.equal(out.reason,'read-only-unclaimed-candidate');
    assert.equal(out.knownStorageUnclaimed,true);
  }
});
test('ordinary schema-1 save and edits block V8 candidate without mutation',()=>{
  const seed=179,store=storage(),world=new VoxelWorld(seed);
  assert.equal(world.set(0,-100,0,BLOCK.AIR),true);
  assert.equal(world.edits.size,1,'original deep-stone edit persisted');
  const bytes=JSON.stringify(world.save());
  store.setItem(worldSlotKey(seed),bytes);
  const out=inspectWithoutWrites(store,seed);
  assert.equal(out.reason,'existing-or-recovered-original-save');
  assert.equal(out.knownStorageUnclaimed,false);
  assert.equal(store.getItem(worldSlotKey(seed)),bytes);
});
test('authentic M7 generator sidecar remains owned by original profile',()=>{
  const seed=2026,store=storage();
  const profile=activateFourRegionProfile(store,seed,{
    explicitNewWorld:true,generator:M7_ENVIRONMENT_GENERATOR
  });
  assert.equal(profile.profile.generator,M7_ENVIRONMENT_GENERATOR);
  const out=inspectWithoutWrites(store,seed);
  assert.equal(out.reason,'existing-original-generation-profile');
  assert.equal(out.knownStorageUnclaimed,false);
  assert.throws(()=>fourRegionProfile(seed,'v8-new-opt-in'),/Unknown biome generator/);
});
test('corrupt M7 profile cannot be treated as an unused seed',()=>{
  const seed=179,store=storage();
  store.setItem(worldSlotKey(seed)+BIOME_PROFILE_SUFFIX,'not-json');
  assert.equal(inspectWithoutWrites(store,seed).reason,
    'damaged-conflicting-or-unverifiable-original');
});
test('cave owner, selected seed and other sidecar claims block opt-in',()=>{
  for(const [seed,key] of [
    [179,'mythwrought-caves-v1-seed-179'],
    [2026,'mythwrought-pack3-construction-v1:2026'],
    [179,SELECTED_SEED_KEY]
  ]){
    const store=storage();
    store.setItem(key,key===SELECTED_SEED_KEY?String(seed):'owner-state');
    const out=inspectWithoutWrites(store,seed);
    assert.equal(out.reason,'existing-selected-seed-or-owner-sidecar');
    assert.equal(out.knownStorageUnclaimed,false);
  }
});
test('damaged original schema-1 journal is fail-closed, no fallback',()=>{
  const seed=179,store=storage();
  store.setItem(worldSlotKey(seed)+'-integrity-v009','{bad journal');
  const out=inspectWithoutWrites(store,seed);
  assert.equal(out.reason,'damaged-conflicting-or-unverifiable-original');
});
test('missing storage enumeration cannot certify an unused seed',()=>{
  const out=inspect({getItem(){return null;}},179);
  assert.equal(out.knownStorageUnclaimed,false);
  assert.equal(out.reason,'unverifiable-original-storage');
  assert.equal(out.safeToIntegrate,false);
});
test('invalid original world seed is rejected before reading storage',()=>{
  for(const seed of [1.5,2**33,NaN,Infinity,'179'])
    assert.throws(()=>inspect(storage(),seed),/Invalid original world seed/);
});
