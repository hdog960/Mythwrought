import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld,BLOCK} from '../src/voxel.mjs';
import {Pack2LiveWorld,savePack2LiveWorld} from '../src/pack2-world.mjs';
import {saveFingerprint,saveWorldSafe} from '../src/persistence.mjs';
import {worldSlotKey} from '../src/seeds.mjs';
import {FourRegionWorld,fourRegionProfile,M8_MOUNTAIN_GENERATOR,M7_ENVIRONMENT_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {BIOME_PROFILE_SUFFIX} from '../src/manual-biomes/profile-storage.mjs';
import {hasValidatedV6SkyProfile} from '../src/sky-v6-adapter.mjs';
function fixture(seed,generator){
 const data=new Map(),storage={getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,String(v))};
 const profile=fourRegionProfile(seed,generator),raw=JSON.stringify(profile),record=JSON.stringify({version:1,raw,checksum:saveFingerprint(raw)});
 const key=worldSlotKey(seed)+BIOME_PROFILE_SUFFIX;
 storage.setItem(key,record);storage.setItem(key+'-journal',record);
 return {data,storage,key,profile,world:new FourRegionWorld(seed,profile)};
}
test('candidate V8 profile rejects stale legacy direct canonical and Pack2 writes without changing any bytes',()=>{
 const f=fixture(20811,M8_MOUNTAIN_GENERATOR),old=new VoxelWorld(20811),before=[...f.data];
 assert.equal(saveWorldSafe(f.storage,old).ok,false);
 assert.equal(savePack2LiveWorld(f.storage,new Pack2LiveWorld(old)).ok,false);
 assert.deepEqual([...f.data],before);
 assert.equal(saveWorldSafe(f.storage,f.world,{select:false}).ok,true);
 assert.equal(savePack2LiveWorld(f.storage,new Pack2LiveWorld(f.world)).ok,true);
});
test('candidate V8 damaged or missing identity cannot write, even on same profile',()=>{
 const f=fixture(20811,M8_MOUNTAIN_GENERATOR);
 f.data.delete(f.key+'-journal');
 const before=[...f.data];
 assert.equal(saveWorldSafe(f.storage,f.world).ok,false);
 assert.equal(savePack2LiveWorld(f.storage,new Pack2LiveWorld(f.world)).ok,false);
 assert.deepEqual([...f.data],before);
});
test('historical M7 and V8 profile sky authority both valid, historical save still works',()=>{
 for(const generator of [M7_ENVIRONMENT_GENERATOR,M8_MOUNTAIN_GENERATOR]){
  const f=fixture(20812,generator),wrapped=new Pack2LiveWorld(f.world);
  assert.equal(hasValidatedV6SkyProfile(wrapped),true);
  assert.equal(saveWorldSafe(f.storage,f.world,{select:false}).ok,true);
 }
});
