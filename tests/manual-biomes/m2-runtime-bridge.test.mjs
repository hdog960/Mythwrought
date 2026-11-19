import assert from 'node:assert/strict';
import {test} from 'node:test';
import {VoxelWorld,BLOCK,terrainHeight} from '../../src/voxel.mjs';
import {worldSlotKey,SELECTED_SEED_KEY} from '../../src/seeds.mjs';
import {Pack2LiveWorld} from '../../src/pack2-world.mjs';
import {SURFACE_BIOME_REGIONS,surfaceBiomeHeight} from '../../src/surface-regions/regions.mjs';
import {FourRegionWorld} from '../../src/manual-biomes/profile-world.mjs';
import {BIOME_PROFILE_SUFFIX,readFourRegionProfile} from '../../src/manual-biomes/profile-storage.mjs';
import {M2_WORLD_MODE,planM2WorldChoice,openM2World,saveM2World,
  exportM2World,inspectM2WorldExport} from '../../src/manual-biomes/m2-runtime-bridge.mjs';

class Storage{
  state=new Map();
  get length(){return this.state.size;}
  key(index){return [...this.state.keys()][index]??null;}
  getItem(k){return this.state.get(String(k))??null;}
  setItem(k,v){this.state.set(String(k),String(v));}
  removeItem(k){this.state.delete(String(k));}
}
const center=(r,seed=179)=>({x:r.x,z:r.z,
  top:Math.max(terrainHeight(r.x,r.z,seed),surfaceBiomeHeight(r.x,r.z,seed))});
const choice=(seed,mode=M2_WORLD_MODE.OPEN,confirmed=false)=>
  planM2WorldChoice(String(seed),mode,{confirmed});
const makeFour=(storage,seed=179)=>openM2World(storage,
  choice(seed,M2_WORLD_MODE.CREATE_FOUR,true));

test('M2: explicit new-world selection pure, fail-closed, no legacy auto-conversion',()=>{
  const store=new Storage(),before=store.length;
  assert.deepEqual(choice(179),{seed:179,mode:M2_WORLD_MODE.OPEN,confirmed:false});
  assert.throws(()=>choice(179,M2_WORLD_MODE.CREATE_FOUR),/explicit/);
  assert.throws(()=>choice(179,'auto',true),/Unsupported/);
  assert.throws(()=>openM2World(store,{seed:179,mode:M2_WORLD_MODE.CREATE_FOUR,
    confirmed:false}),/Invalid\/unconfirmed/);
  assert.equal(store.length,before);
});

test('M2: unprofiled existing seed opens same production Pack2 wrapper with legacy bytes',()=>{
  const store=new Storage(),loaded=openM2World(store,choice(179));
  assert.equal(loaded.mode,'legacy');
  assert.equal(loaded.created,false);
  assert.ok(loaded.world instanceof Pack2LiveWorld);
  assert.ok(loaded.base instanceof VoxelWorld);
  assert.equal(loaded.world.base,loaded.base);
  assert.equal(readFourRegionProfile(store,179),null);
  assert.equal(store.length,0,'opening a new legacy world cannot store profile metadata');
});

test('M2: actual physical Pack2 wrapper reads four canonical authored surface regions',()=>{
  const store=new Storage(),loaded=makeFour(store),world=loaded.world;
  assert.equal(loaded.created,true);
  assert.equal(loaded.mode,'four-regions');
  assert.ok(loaded.base instanceof FourRegionWorld);
  assert.ok(world instanceof Pack2LiveWorld);
  assert.equal(world.base,loaded.base);
  for(const r of SURFACE_BIOME_REGIONS){
    const {x,z,top}=center(r);
    assert.equal(world.get(x,top,z),r.surface,'correct '+r.name+' ground');
    assert.equal(world.get(x,top+1,z),BLOCK.AIR,r.name+' first headroom');
    assert.equal(world.get(x,-30,z),new VoxelWorld(179).get(x,-30,z),
      r.name+' legacy deep substrate');
  }
  assert.equal(store.getItem(worldSlotKey(179)),null,
    'fresh new-world metadata does not eagerly write schema-1 edits');
});

test('M2: authoritative mountain shelf edits + schema-1 persisted through live wrapper',()=>{
  const store=new Storage(),live=makeFour(store).world;
  const r=SURFACE_BIOME_REGIONS[2],{x,z,top}=center(r);
  assert.equal(live.get(x,top,z),r.surface);
  assert.equal(live.set(x,top,z,BLOCK.AIR),true);
  assert.equal(live.get(x,top,z),BLOCK.AIR);
  const saved=saveM2World(store,live);
  assert.equal(saved.ok,true,JSON.stringify(saved));
  const raw=store.getItem(worldSlotKey(179));
  assert.equal(JSON.parse(raw).schema,1);
  const reopened=openM2World(store,choice(179));
  assert.equal(reopened.mode,'four-regions');
  assert.equal(reopened.world.get(x,top,z),BLOCK.AIR);
  assert.equal(JSON.stringify(reopened.world.save()),raw);
});

test('M2: pack2 placement above genuinely generated biome height saves with profile',()=>{
  const store=new Storage(),live=makeFour(store).world;
  const r=SURFACE_BIOME_REGIONS[0],{x,z,top}=center(r),y=top+2;
  assert.equal(live.get(x,y,z),BLOCK.AIR);
  assert.equal(live.placePack2(x,y,z,59,{}),true);
  assert.equal(live.get(x,y,z),59);
  const before=live.pack2Snapshot();
  const saved=saveM2World(store,live);
  assert.equal(saved.ok,true,JSON.stringify(saved));
  const loaded=openM2World(store,choice(179)).world;
  assert.equal(loaded.get(x,y,z),59);
  assert.deepEqual(loaded.pack2Snapshot(),before);
  assert.equal(loaded.base instanceof FourRegionWorld,true);
  assert.equal(loaded.save().schema,1);
});

test('M2: a legacy-world mine/place stays ordinary schema-1, without profile creation',()=>{
  const store=new Storage(),live=openM2World(store,choice(7)).world;
  const y=terrainHeight(10,12,7);
  assert.equal(live.set(10,y,12,BLOCK.STONE),true);
  assert.equal(saveM2World(store,live).ok,true);
  assert.equal(readFourRegionProfile(store,7),null);
  assert.equal(openM2World(store,choice(7)).world.get(10,y,12),BLOCK.STONE);
  assert.equal(JSON.parse(store.getItem(worldSlotKey(7))).schema,1);
});

test('M2: an edited or existing seed cannot be silently activated as a new biome world',()=>{
  const store=new Storage(),existing=openM2World(store,choice(179)).world;
  existing.set(0,terrainHeight(0,0),0,BLOCK.STONE);
  assert.equal(saveM2World(store,existing).ok,true);
  const unchanged=store.getItem(worldSlotKey(179));
  assert.throws(()=>makeFour(store),/Existing seed\/save/);
  assert.equal(store.getItem(worldSlotKey(179)),unchanged);
  assert.equal(readFourRegionProfile(store,179),null);
});

test('M2: reopening existing profiled seed with NEW intent is refused without mutations',()=>{
  const store=new Storage();makeFour(store);
  const before=[...store.state.entries()];
  assert.throws(()=>makeFour(store),/existing profile/);
  assert.deepEqual([...store.state.entries()],before);
  assert.equal(openM2World(store,choice(179)).mode,'four-regions');
});

test('M2: damaged generator identity blocks load, save and legacy fallback',()=>{
  const store=new Storage(),live=makeFour(store).world;
  const k=worldSlotKey(179)+BIOME_PROFILE_SUFFIX;
  store.setItem(k,'broken');
  store.setItem(k+'-journal','broken');
  const before=[...store.state.entries()];
  assert.throws(()=>openM2World(store,choice(179)),/Damaged biome profile/);
  assert.throws(()=>saveM2World(store,live),/Damaged biome profile/);
  assert.deepEqual([...store.state.entries()],before);
});

test('M2: exported biome bundle roundtrips profile, actual edits and Pack 2 shapes',()=>{
  const store=new Storage(),live=makeFour(store).world;
  const r=SURFACE_BIOME_REGIONS[1],{x,z,top}=center(r);
  assert.equal(live.set(x,top,z,BLOCK.AIR),true);
  assert.equal(live.placePack2(x,top+2,z,59,{}),true);
  const before=[...store.state.entries()];
  const raw=exportM2World(live),inspected=inspectM2WorldExport(raw);
  assert.equal(inspected.mode,'four-regions');
  assert.ok(inspected.world.base instanceof FourRegionWorld);
  assert.equal(inspected.world.get(x,top,z),BLOCK.AIR);
  assert.equal(inspected.world.get(x,top+2,z),59);
  assert.equal(JSON.stringify(inspected.world.save()),JSON.stringify(live.save()));
  assert.deepEqual(inspected.world.pack2Snapshot(),live.pack2Snapshot());
  assert.deepEqual([...store.state.entries()],before,'inspection is read-only');
});

test('M2: exported legacy bundle cannot acquire or drop an implicit profile',()=>{
  const store=new Storage(),legacy=openM2World(store,choice(5)).world;
  const raw=exportM2World(legacy),candidate=inspectM2WorldExport(raw);
  assert.equal(candidate.mode,'legacy');
  assert.ok(candidate.world.base instanceof VoxelWorld);
  assert.equal(candidate.world.base instanceof FourRegionWorld,false);
  assert.equal(candidate.seed,5);
  const parsed=JSON.parse(raw);
  assert.throws(()=>inspectM2WorldExport(JSON.stringify({...parsed,profile:{}})),
    /Profile-bearing export/);
});

test('M2: malformed/incomplete biome bundle fails instead of being flattened to legacy',()=>{
  const store=new Storage(),live=makeFour(store).world;
  const full=JSON.parse(exportM2World(live));
  const {pack2,...missingPack2}=full;
  assert.throws(()=>inspectM2WorldExport(JSON.stringify(missingPack2)),/Incomplete/);
  assert.throws(()=>inspectM2WorldExport(JSON.stringify({...full,version:2})),/Unsupported/);
  assert.throws(()=>inspectM2WorldExport(JSON.stringify({...full,profile:{}})));
  assert.throws(()=>inspectM2WorldExport(JSON.stringify({...full,
    pack2:{...full.pack2,seed:7}})));
});

test('M2: player-selected seed isolation and no write to prior world',()=>{
  const store=new Storage(),first=makeFour(store,179).world;
  const top=center(SURFACE_BIOME_REGIONS[0]).top;
  first.set(512,top,0,BLOCK.AIR);
  assert.equal(saveM2World(store,first).ok,true);
  const prior=[store.getItem(worldSlotKey(179)),store.getItem(
    worldSlotKey(179)+BIOME_PROFILE_SUFFIX)];
  const second=makeFour(store,2026).world;
  assert.equal(second.seed,2026);
  assert.equal(saveM2World(store,second).ok,true);
  assert.deepEqual([store.getItem(worldSlotKey(179)),store.getItem(
    worldSlotKey(179)+BIOME_PROFILE_SUFFIX)],prior);
});

test('M2: prepared Save on Pack2 corruption is fail-closed and does not claim success',()=>{
  const store=new Storage(),world=makeFour(store).world;
  const r=SURFACE_BIOME_REGIONS[0],{x,z,top}=center(r);
  assert.equal(world.placePack2(x,top+2,z,59,{}),true);
  assert.equal(saveM2World(store,world).ok,true);
  const packed=worldSlotKey(179)+'-pack2-live-v1';
  store.setItem(packed+'-journal','corrupt journal bytes');
  const previousBase=store.getItem(worldSlotKey(179));
  world.set(x,top,z,BLOCK.AIR);
  const result=saveM2World(store,world);
  assert.equal(result.ok,false);
  assert.equal(result.stage,'pack2');
  assert.equal(result.partialCommit,false);
  assert.equal(store.getItem(worldSlotKey(179)),previousBase);
});

test('M2: selection requires exact approved intent, including negative seeds',()=>{
  const store=new Storage();
  assert.equal(planM2WorldChoice('-77',M2_WORLD_MODE.CREATE_FOUR,
    {confirmed:true}).seed,-77);
  assert.throws(()=>openM2World(store,{seed:179,mode:M2_WORLD_MODE.OPEN,
    confirmed:true}),/Invalid/);
  assert.throws(()=>openM2World(store,{seed:179,mode:M2_WORLD_MODE.CREATE_FOUR,
    confirmed:1}),/Invalid/);
  assert.equal(store.length,0);
});
