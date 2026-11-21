import test from 'node:test';
import assert from 'node:assert/strict';
import {CURRENT_INSTALLED_GENERATOR,GENERATION_AUTHORITY_ABI,WORLD_SAVE_SCHEMA,
  inspectWorldGeneration,currentWorldMetadata,seedHasAnySavedData,
  chooseUnusedCurrentSeed} from '../src/creative-integration/current-world.mjs';
import {M6_BALANCED_GENERATOR,FOUR_REGION_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {worldSlotKey,SELECTED_SEED_KEY,LEGACY_WORLD_KEY,DEFAULT_WORLD_SEED} from '../src/seeds.mjs';
import {GAME_RELEASE} from '../src/app-update.mjs';
const memory=entries=>{
  const store=new Map(entries);
  return {getItem:k=>store.has(k)?store.get(k):null,
    get length(){return store.size;},key:i=>[...store.keys()][i]??null};
};
test('Current world uses real installed accepted V6 authority, distinct from schema and release',()=>{
  assert.equal(CURRENT_INSTALLED_GENERATOR,M6_BALANCED_GENERATOR);
  assert.equal(WORLD_SAVE_SCHEMA,1);
  const current=inspectWorldGeneration({seed:567,base:{generationProfile:{generator:M6_BALANCED_GENERATOR}}});
  assert.equal(current.state,'current');
  const obsolete=inspectWorldGeneration({seed:567,base:{generationProfile:{generator:FOUR_REGION_GENERATOR}}});
  assert.equal(obsolete.state,'obsolete');
  assert.equal(inspectWorldGeneration({seed:179}).state,'legacy');
  assert.equal(inspectWorldGeneration({seed:'179'}).state,'unknown');
  const metadata=currentWorldMetadata({creativeCatalog:'g1:test',mobCatalog:'mobs:40'});
  assert.deepEqual(metadata,{authority:GENERATION_AUTHORITY_ABI,gameRelease:GAME_RELEASE,
    generator:M6_BALANCED_GENERATOR,worldSaveSchema:1,creativeCatalog:'g1:test',mobCatalog:'mobs:40'});
  assert.throws(()=>currentWorldMetadata({creativeCatalog:'x'}));
});
test('Existing schema-1, journal, cave, creature and future sidecars block seed reuse',()=>{
  for(const key of [worldSlotKey(42),worldSlotKey(42)+'-backup-v009',
    'mythwrought-caves-v1-seed-42.backup','mythwrought-mobs-v1-seed-42',
    'mythwrought.pack5.builder.seed.42','unrecognized-v10-feature-seed-42.journal']){
    assert.equal(seedHasAnySavedData(memory([[key,'preserved']]),42),true,key);
  }
  assert.equal(seedHasAnySavedData(memory([[SELECTED_SEED_KEY,'42']]),42),true,
    'The selected legacy seed remains reserved without an existing world slot');
  assert.equal(seedHasAnySavedData(memory([[LEGACY_WORLD_KEY,'original schema-1 bytes']]),
    DEFAULT_WORLD_SEED),true,'An original pre-slot world must block seed reuse');
  assert.equal(seedHasAnySavedData(memory([[LEGACY_WORLD_KEY,'old world']]),42),false,
    'Legacy fixed-slot data must not falsely reserve unrelated seeds');
  assert.equal(seedHasAnySavedData(memory([[SELECTED_SEED_KEY,'43']]),42),false,
    'Only the selected seed should be reserved');
  assert.equal(seedHasAnySavedData(memory([[worldSlotKey(43),'different world']]),42),false);
  assert.throws(()=>seedHasAnySavedData({getItem(){return null;}},42),/enumerate/);
});
test('New seed selection rejects occupied identities, validates entropy and never mutates storage',()=>{
  const storage=memory([[worldSlotKey(-7),'immutable'],['mythwrought-caves-v1-seed-8','immutable']]);
  let values=[-7,8,300],reads=0;
  assert.equal(chooseUnusedCurrentSeed(storage,()=>values[reads++]),300);
  assert.equal(reads,3);
  assert.equal(storage.getItem(worldSlotKey(-7)),'immutable');
  assert.throws(()=>chooseUnusedCurrentSeed(storage,()=>-7,2),/unused world seed/);
  assert.throws(()=>chooseUnusedCurrentSeed(storage,()=>1.7),/invalid signed int32/);
  assert.throws(()=>chooseUnusedCurrentSeed(storage,()=>0,0),/seed chooser/);
});
