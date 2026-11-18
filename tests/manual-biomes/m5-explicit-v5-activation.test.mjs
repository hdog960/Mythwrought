import assert from 'node:assert/strict';
import {test} from 'node:test';
import {FourRegionWorld,fourRegionProfile,FOUR_REGION_GENERATOR,
  M5_EXPERIMENTAL_GENERATOR,M3_FOUR_REGION_GENERATOR,M2_FOUR_REGION_GENERATOR}
  from '../../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {M2_WORLD_MODE,planM2WorldChoice,openM2World,saveM2World,
  exportM2World,inspectM2WorldExport} from '../../src/manual-biomes/m2-runtime-bridge.mjs';
import {readFourRegionProfile} from '../../src/manual-biomes/profile-storage.mjs';
import {worldSlotKey} from '../../src/seeds.mjs';

class Storage {
  state=new Map();
  get length(){return this.state.size;}
  key(i){return [...this.state.keys()][i]??null;}
  getItem(k){return this.state.get(String(k))??null;}
  setItem(k,v){this.state.set(String(k),String(v));}
  removeItem(k){this.state.delete(String(k));}
}
const open=(storage,seed)=>openM2World(storage,planM2WorldChoice(String(seed)));
test('M5 v5 selector: unconfirmed/old/claimed seeds always fail without changing storage',()=>{
  const store=new Storage();
  assert.throws(()=>planM2WorldChoice('179',M2_WORLD_MODE.CREATE_FOUR_V5),
    /confirmation/);
  assert.throws(()=>planM2WorldChoice('179',M2_WORLD_MODE.IMPORT_PROFILE,
    {confirmed:true,generator:'unregistered'}),/Unknown/);
  assert.throws(()=>planM2WorldChoice('179',M2_WORLD_MODE.CREATE_FOUR,
    {confirmed:true,generator:M5_EXPERIMENTAL_GENERATOR}),/override/);
  assert.throws(()=>planM2WorldChoice('179',M2_WORLD_MODE.OPEN,
    {generator:M5_EXPERIMENTAL_GENERATOR}),/override/);
  assert.equal(store.length,0);
  // A selected but unsaved old seed is already claimed, even if no edits.
  store.setItem('mythwrought-v002-selected-seed','179');
  const raw=store.getItem('mythwrought-v002-selected-seed');
  assert.throws(()=>openM2World(store,planM2WorldChoice('179',
    M2_WORLD_MODE.CREATE_FOUR_V5,{confirmed:true})),/fresh|selected|existing/i);
  assert.equal(store.getItem('mythwrought-v002-selected-seed'),raw);
  assert.equal(store.getItem(worldSlotKey(179)),null);
});

test('M5 v5 selector: distinct explicit new world gets v5; normal new world stays v4',()=>{
 const store=new Storage();
 const normal=openM2World(store,planM2WorldChoice('181',
   M2_WORLD_MODE.CREATE_FOUR,{confirmed:true}));
 assert.equal(normal.base.generationProfile.generator,FOUR_REGION_GENERATOR);
 assert.equal(saveM2World(store,normal.world).ok,true);
 const experimental=openM2World(store,planM2WorldChoice('179',
   M2_WORLD_MODE.CREATE_FOUR_V5,{confirmed:true}));
 assert.equal(experimental.mode,'four-regions');
 assert.equal(experimental.base.generationProfile.generator,M5_EXPERIMENTAL_GENERATOR);
 assert.equal(saveM2World(store,experimental.world).ok,true);
 assert.equal(open(store,179).base.generationProfile.generator,M5_EXPERIMENTAL_GENERATOR);
 assert.equal(open(store,181).base.generationProfile.generator,FOUR_REGION_GENERATOR);
 assert.ok(readFourRegionProfile(store,179));
 assert.throws(()=>openM2World(store,planM2WorldChoice('179',
   M2_WORLD_MODE.CREATE_FOUR_V5,{confirmed:true})),/profile|Existing/i);
 const v5Before=store.getItem(worldSlotKey(179));
 assert.equal(open(store,179).world.get(-480,7,-12),
   experimental.world.get(-480,7,-12));
 assert.equal(store.getItem(worldSlotKey(179)),v5Before);
});

test('M5 v5 profile-aware imports: preserve exact v2,v3,v4,v5 generator and Pack2',()=>{
 const versions=[M2_FOUR_REGION_GENERATOR,M3_FOUR_REGION_GENERATOR,
   FOUR_REGION_GENERATOR,M5_EXPERIMENTAL_GENERATOR];
 for(let i=0;i<versions.length;i++){
   const version=versions[i],seed=191+i,store=new Storage();
   const source=new Pack2LiveWorld(new FourRegionWorld(seed,fourRegionProfile(seed,version)));
   const x=4+i,z=-4-i,y=7;
   assert.equal(source.set(x,y,z,3),true);
   assert.equal(source.placePack2(x,y+3,z,59,{}),true);
   const raw=exportM2World(source),examined=inspectM2WorldExport(raw);
   assert.equal(examined.world.base.generationProfile.generator,version);
   assert.throws(()=>planM2WorldChoice(String(seed),M2_WORLD_MODE.IMPORT_PROFILE,
      {confirmed:false,generator:version}),/confirmation/);
   const plan=planM2WorldChoice(String(seed),M2_WORLD_MODE.IMPORT_PROFILE,
     {confirmed:true,generator:version});
   const prepared=openM2World(store,plan);
   assert.equal(prepared.base.generationProfile.generator,version);
   const saved=saveM2World(store,examined.world);
   assert.equal(saved.ok,true,version+': '+JSON.stringify(saved));
   const cold=open(store,seed);
   assert.equal(cold.base.generationProfile.generator,version);
   assert.deepEqual(cold.world.save(),examined.world.save());
   assert.deepEqual(cold.world.pack2Snapshot(),examined.world.pack2Snapshot());
   assert.throws(()=>openM2World(store,plan),/profile|Existing/i,
     'import cannot overwrite any already-claimed seed');
 }
});

test('M5 v5 imported profile cannot collide with an existing legacy or profiled save',()=>{
 const store=new Storage();
 const saved=openM2World(store,planM2WorldChoice('201',
   M2_WORLD_MODE.CREATE_FOUR,{confirmed:true}));
 assert.equal(saveM2World(store,saved.world).ok,true);
 const raw=store.getItem(worldSlotKey(201));
 assert.throws(()=>openM2World(store,planM2WorldChoice('201',
   M2_WORLD_MODE.IMPORT_PROFILE,{confirmed:true,
     generator:M5_EXPERIMENTAL_GENERATOR})),/existing|profile/i);
 assert.equal(store.getItem(worldSlotKey(201)),raw);
 assert.equal(open(store,201).base.generationProfile.generator,FOUR_REGION_GENERATOR);
});
