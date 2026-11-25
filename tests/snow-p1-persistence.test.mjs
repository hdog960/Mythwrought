import test from 'node:test';
import assert from 'node:assert/strict';
import {FourRegionWorld,fourRegionProfile,SNOW_P1_GENERATOR,ENCHANTED_P2_GENERATOR,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {meshChunk,BLOCK} from '../src/voxel.mjs';
import {M2_WORLD_MODE,planM2WorldChoice,openM2World,saveM2World,exportM2World,inspectM2WorldExport} from '../src/manual-biomes/m2-runtime-bridge.mjs';
import {readFourRegionProfile} from '../src/manual-biomes/profile-storage.mjs';
import {worldSlotKey,SELECTED_SEED_KEY} from '../src/seeds.mjs';
function storage(){
 const values=new Map();
 return {get length(){return values.size},key:i=>[...values.keys()][i]??null,
  getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,String(v)),removeItem:k=>values.delete(k),values};
}
test('Snow P1 explicit fresh-only profile, real mining/building persistence, old slots and export parity',()=>{
 const store=storage();
 const old=openM2World(store,planM2WorldChoice('179',M2_WORLD_MODE.CREATE_ENCHANTED_P2,{confirmed:true}));
 assert.equal(old.base.generationProfile.generator,ENCHANTED_P2_GENERATOR);
 assert.equal(old.world.set(0,18,0,BLOCK.STONE),true);
 assert.equal(saveM2World(store,old.world).ok,true);
 const protectedRows=[...store.values].filter(([k])=>k.startsWith(worldSlotKey(179)));
 const create=seed=>planM2WorldChoice(String(seed),M2_WORLD_MODE.CREATE_SNOW_P1,{confirmed:true});
 assert.throws(()=>planM2WorldChoice('2026',M2_WORLD_MODE.CREATE_SNOW_P1),/confirmation/);
 assert.throws(()=>openM2World(store,create(179)));
 const seed=2026,opened=openM2World(store,create(seed)),w=opened.world;
 assert.equal(opened.created,true);assert.equal(w.base.generationProfile.generator,SNOW_P1_GENERATOR);
 assert.equal(w.base.enchantedTreesEnabled,true);
 const mine=[-44,11,499],build=[-44,17,499];
 assert.equal(w.get(...mine),407);assert.equal(w.base.snowS17NaturalNeedleAt(...mine),407);
 assert.equal(w.get(...build),0);
 assert.equal(w.set(...mine,0),true);assert.equal(w.set(...build,3),true);
 assert.equal(w.base.snowS17NaturalNeedleAt(...mine),undefined);
 const status=saveM2World(store,w);assert.equal(status.ok,true,JSON.stringify(status));
 assert.equal(readFourRegionProfile(store,seed).profile.generator,SNOW_P1_GENERATOR);
 const r=openM2World(store,planM2WorldChoice(String(seed)));
 assert.equal(r.world.get(...mine),0);assert.equal(r.world.get(...build),3);
 assert.deepEqual(r.world.save(),w.save());
 const imported=inspectM2WorldExport(exportM2World(r.world));
 assert.equal(imported.world.base.generationProfile.generator,SNOW_P1_GENERATOR);
 assert.deepEqual(imported.world.save(),w.save());
 assert.deepEqual(imported.world.pack2Snapshot(),w.pack2Snapshot());
 assert.equal(r.world.set(...mine,407),true);
 assert.equal(r.world.base.snowS17NaturalNeedleAt(...mine),407);
 assert.equal(saveM2World(store,r.world).ok,true);
 assert.throws(()=>openM2World(store,create(seed)));
 assert.deepEqual(protectedRows.map(([k])=>[k,store.getItem(k)]),protectedRows);
 assert.equal(openM2World(store,planM2WorldChoice('179')).base.generationProfile.generator,ENCHANTED_P2_GENERATOR);
 console.log('SNOW_P1_PERSISTENCE '+JSON.stringify({seed,mine,build,oldSlotRows:protectedRows.length,profile:r.base.generationProfile.generator,saveReloadExport:true,occupiedSeedRefused:true}));
});
