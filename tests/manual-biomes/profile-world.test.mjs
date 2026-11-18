import assert from 'node:assert/strict';
import {test} from 'node:test';
import {VoxelWorld,BLOCK,terrainHeight,meshChunk,chunkCoord} from '../../src/voxel.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {saveWorldSafe} from '../../src/persistence.mjs';
import {SURFACE_BIOME_REGIONS,surfaceBiomeHeight} from '../../src/surface-regions/regions.mjs';
import {FourRegionWorld,fourRegionProfile,validateFourRegionProfile,
  restoreFourRegionWorld} from '../../src/manual-biomes/profile-world.mjs';
import {loadFourRegionWorld,saveFourRegionWorld,readFourRegionProfile,
  exportFourRegionWorld,inspectFourRegionExport,activateFourRegionProfile,
  BIOME_PROFILE_SUFFIX} from '../../src/manual-biomes/profile-storage.mjs';
import {worldSlotKey,SELECTED_SEED_KEY} from '../../src/seeds.mjs';

class LocalStorage{
  data=new Map();
  get length(){return this.data.size;}
  key(i){return [...this.data.keys()][i]??null;}
  getItem(k){return this.data.has(String(k))?this.data.get(String(k)):null;}
  setItem(k,v){this.data.set(String(k),String(v));}
  removeItem(k){this.data.delete(String(k));}
}
const key=(x,y,z)=>x+','+y+','+z;
const center=(region,seed=179)=>{
  const x=region.x,z=region.z,oldTop=terrainHeight(x,z,seed);
  return {x,z,oldTop,top:Math.max(oldTop,surfaceBiomeHeight(x,z,seed))};
};

test('M0: legacy seed 179/7/2201 gets identical voxels and schema-1 bytes without profile',()=>{
  for(const seed of [179,7,2201]){
    const storage=new LocalStorage(),legacy=new VoxelWorld(seed);
    const original=JSON.stringify(legacy.save());
    assert.equal(loadFourRegionWorld(storage,seed).mode,'legacy');
    assert.equal(JSON.stringify(loadFourRegionWorld(storage,seed).world.save()),original);
    for(const r of SURFACE_BIOME_REGIONS)for(const y of [-3,0,2,5,10,19]){
      assert.equal(loadFourRegionWorld(storage,seed).world.get(r.x,y,r.z),
        legacy.get(r.x,y,r.z),r.name+' untouched');
    }
    const r=SURFACE_BIOME_REGIONS[0],c=center(r,seed);
    assert.equal(legacy.set(c.x,c.oldTop,c.z,BLOCK.STONE),true);
    assert.equal(saveWorldSafe(storage,legacy).ok,true);
    const bytes=storage.getItem(worldSlotKey(seed));
    const restored=loadFourRegionWorld(storage,seed);
    assert.equal(restored.mode,'legacy');
    assert.equal(storage.getItem(worldSlotKey(seed)),bytes);
    assert.equal(JSON.stringify(restored.world.save()),JSON.stringify(legacy.save()));
    assert.equal(readFourRegionProfile(storage,seed),null);
    assert.throws(()=>activateFourRegionProfile(storage,seed,{explicitNewWorld:true}),
      /Existing seed\/save/);
  }
});

test('M1: generator identity rejects unrecognized versions/fields/seeds',()=>{
  const p=fourRegionProfile(179);
  assert.deepEqual(validateFourRegionProfile(p,179),p);
  for(const malformed of [{...p,generator:'next'}, {...p,version:2},
    {...p,seed:7}, {...p,extra:1}])
    assert.throws(()=>validateFourRegionProfile(malformed,179));
});

test('M1: all four physical baseline surfaces are authoritative in one world',()=>{
  const world=new FourRegionWorld(179),legacy=new VoxelWorld(179);
  assert.equal(world instanceof VoxelWorld,true);
  for(const r of SURFACE_BIOME_REGIONS){
    const {x,z,top,oldTop}=center(r);
    assert.equal(world.get(x,top,z),r.surface,r.name+' biome top');
    assert.equal(world.naturalAndLandmarkBlock(x,top,z),r.surface);
    assert.equal(world.get(x,top+1,z),BLOCK.AIR,r.name+' first headroom');
    assert.equal(world.get(x,top+2,z),BLOCK.AIR,r.name+' second headroom');
    assert.notEqual(world.get(x,top-1,z),BLOCK.AIR,r.name+' supported');
    assert.equal(world.get(x,-30,z),legacy.get(x,-30,z),'deep caves unchanged');
    assert.ok(top>=oldTop,'no lowering of legacy floor');
    assert.equal(world.set(x,top,z,r.surface),true,'placing natural biome block');
    assert.equal(world.edits.has(key(x,top,z)),false,'natural biome no-op is not an edit');
    assert.equal(world.biomeCellCount,0,'no-op must not inflate biome count');
  }
  assert.ok(world.cachedBiomeColumns<=world.maxCachedColumns);
  assert.equal(world.save().schema,1);
});

test('M1: mining raised shelf + legacy-equivalent edits persist across profile restore',()=>{
  const world=new FourRegionWorld(179),r=SURFACE_BIOME_REGIONS[0],c=center(r);
  const oldId=new VoxelWorld(179).get(c.x,c.oldTop,c.z);
  assert.notEqual(world.get(c.x,c.oldTop,c.z),oldId,
    'selected center must differ from legacy baseline for this regression');
  assert.equal(world.set(c.x,c.oldTop,c.z,oldId),true);
  assert.equal(world.get(c.x,c.oldTop,c.z),oldId);
  assert.ok(world.edits.has(key(c.x,c.oldTop,c.z)),
    'old legacy baseline is a real PROFILE edit, not a natural no-op');
  assert.equal(world.set(c.x,c.top,c.z,BLOCK.AIR),true);
  assert.equal(world.get(c.x,c.top,c.z),BLOCK.AIR);
  // Cached neighbor read must never resurrect the excavated position.
  world.get(c.x+1,c.top,c.z);
  const payload=world.save();
  assert.equal(payload.schema,1);
  const revived=restoreFourRegionWorld(payload,world.profile);
  assert.deepEqual(revived.save(),payload,'schema-1 profiled roundtrip exactly');
  assert.equal(revived.get(c.x,c.oldTop,c.z),oldId);
  assert.equal(revived.get(c.x,c.top,c.z),BLOCK.AIR);
  assert.equal(revived.set(c.x,c.oldTop,c.z,
    revived.naturalAndLandmarkBlock(c.x,c.oldTop,c.z)),true);
  assert.equal(revived.edits.has(key(c.x,c.oldTop,c.z)),false);
});

test('M1: explicit fresh-only profile activation and reload of edited raised terrain',()=>{
  const storage=new LocalStorage();
  assert.equal(loadFourRegionWorld(storage,179).mode,'legacy');
  assert.throws(()=>activateFourRegionProfile(storage,179),/Explicit NEW/);
  const created=loadFourRegionWorld(storage,179,{enableNew:true});
  assert.equal(created.mode,'four-regions');
  assert.equal(created.created,true);
  const world=created.world;
  const r=SURFACE_BIOME_REGIONS[2],c=center(r);
  assert.equal(world.get(c.x,c.top,c.z),r.surface);
  world.set(c.x,c.top,c.z,BLOCK.AIR);
  world.set(c.x,c.oldTop,c.z,BLOCK.WOOD);
  const expected=JSON.stringify(world.save());
  const status=saveFourRegionWorld(storage,world);
  assert.equal(status.ok,true);
  assert.equal(storage.getItem(worldSlotKey(179)),expected);
  const loaded=loadFourRegionWorld(storage,179);
  assert.equal(loaded.mode,'four-regions');
  assert.equal(JSON.stringify(loaded.world.save()),expected);
  assert.equal(loaded.world.get(c.x,c.top,c.z),BLOCK.AIR);
  assert.equal(loaded.world.get(c.x,c.oldTop,c.z),BLOCK.WOOD);
  assert.throws(()=>loadFourRegionWorld(storage,179,{enableNew:true}),/already/);
  assert.equal(readFourRegionProfile(storage,179).profile.generator,world.profile.generator);
});

test('M1: persisted legacy-equivalent edit is not stripped by profile-aware loader',()=>{
  const storage=new LocalStorage(),world=activateFourRegionProfile(storage,179,{explicitNewWorld:true});
  const r=SURFACE_BIOME_REGIONS[3],c=center(r),legacy=new VoxelWorld(179);
  const oldId=legacy.get(c.x,c.oldTop,c.z);
  assert.notEqual(world.get(c.x,c.oldTop,c.z),oldId);
  world.set(c.x,c.oldTop,c.z,oldId);
  assert.equal(saveFourRegionWorld(storage,world).ok,true);
  const saved=storage.getItem(worldSlotKey(179));
  assert.equal(loadFourRegionWorld(storage,179).world.edits.has(key(c.x,c.oldTop,c.z)),true);
  assert.equal(storage.getItem(worldSlotKey(179)),saved,'no storage rewriting during load');
});

test('M1: profile identity can recover from a valid journal but never silently become legacy',()=>{
  const storage=new LocalStorage();
  activateFourRegionProfile(storage,179,{explicitNewWorld:true});
  const keyBase=worldSlotKey(179)+BIOME_PROFILE_SUFFIX;
  const validJournal=storage.getItem(keyBase+'-journal');
  storage.setItem(keyBase,'damaged primary');
  assert.equal(readFourRegionProfile(storage,179).source,'journal');
  assert.equal(loadFourRegionWorld(storage,179).recovered,true);
  storage.setItem(keyBase+'-journal','damaged journal');
  assert.throws(()=>loadFourRegionWorld(storage,179),/Damaged biome profile/);
  storage.setItem(keyBase+'-journal',validJournal);
  assert.equal(loadFourRegionWorld(storage,179).mode,'four-regions');
});

test('M1: existing seed-sidecars, old selection or explored-map history forbid activation',()=>{
  for(const [k,v] of [['mythwrought-v002-world-179-pack5-live-v1','{}'],
    [SELECTED_SEED_KEY,'179'],['mythwrought-exploration-v1-179','{}']]){
    const storage=new LocalStorage();storage.setItem(k,v);
    assert.throws(()=>activateFourRegionProfile(storage,179,{explicitNewWorld:true}),
      /fresh|Existing world sidecar|Previously selected/);
    assert.equal(storage.getItem(k),v,'do not change old user data');
  }
});

test('M1: signed 32-bit seed and malformed edit/rotation payloads fail closed',()=>{
  const p=fourRegionProfile(-77);
  assert.throws(()=>fourRegionProfile(2**38));
  const payload={schema:1,seed:-77,edits:[[512,5,0,3],[512,5,0,3]]};
  assert.throws(()=>restoreFourRegionWorld(payload,p),/Duplicate|noncanonical/);
  assert.throws(()=>restoreFourRegionWorld({schema:1,seed:2,edits:[]},p));
  assert.throws(()=>restoreFourRegionWorld({schema:1,seed:-77,edits:[],rotations:[[1,1,1,1]]},p));
});

test('M1: explicit export inspection recreates exact biome profile; no storage import side effects',()=>{
  const storage=new LocalStorage(),world=activateFourRegionProfile(storage,179,
    {explicitNewWorld:true});
  const c=center(SURFACE_BIOME_REGIONS[1]);
  world.set(c.x,c.top,c.z,BLOCK.AIR);
  const raw=exportFourRegionWorld(world),copy=inspectFourRegionExport(raw);
  assert.deepEqual(copy.profile,world.profile);
  assert.deepEqual(copy.save(),world.save());
  assert.throws(()=>inspectFourRegionExport(JSON.stringify({...JSON.parse(raw),version:2})));
  assert.equal(storage.getItem(worldSlotKey(179)),null);
});

test('M1: Pack2 wrapper accepts a true VoxelWorld subclass without new pack or schema IDs',()=>{
  const base=new FourRegionWorld(179),pack=new Pack2LiveWorld(base);
  const c=center(SURFACE_BIOME_REGIONS[0]),original=pack.get(c.x,c.top,c.z);
  assert.equal(original,SURFACE_BIOME_REGIONS[0].surface);
  assert.equal(pack.set(c.x,c.top,c.z,BLOCK.AIR),true);
  assert.equal(pack.get(c.x,c.top,c.z),BLOCK.AIR);
  assert.equal(pack.save().schema,1);
  assert.equal(pack.base.generationProfile.generator,base.profile.generator);
});

test('M1: genuine mesher accepts editable profile and unchanged separate legacy world',()=>{
  const profile=new FourRegionWorld(179),legacy=new VoxelWorld(179);
  const r=SURFACE_BIOME_REGIONS[0],c=center(r);
  const a=meshChunk(profile,chunkCoord(c.x),chunkCoord(c.z));
  const b=meshChunk(legacy,chunkCoord(c.x),chunkCoord(c.z));
  assert.ok(a&&b);
  profile.set(c.x,c.top,c.z,BLOCK.AIR);
  assert.ok(meshChunk(profile,chunkCoord(c.x),chunkCoord(c.z)));
  assert.equal(profile.get(c.x,c.top,c.z),BLOCK.AIR);
  assert.notEqual(legacy.get(c.x,c.top,c.z),BLOCK.AIR);
});
