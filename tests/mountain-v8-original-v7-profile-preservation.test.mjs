// V8 integration PREPARATION: test the existing original V7 baseline only.
// Never invoke V8 generator, register IDs, save a real user world, or deploy.
// Exact original source owners: profile-world/profile-storage/m2-runtime-bridge.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,raycast,collides} from '../src/voxel.mjs';
import {worldSlotKey} from '../src/seeds.mjs';
import {M7_ENVIRONMENT_GENERATOR,fourRegionProfile}
  from '../src/manual-biomes/profile-world.mjs';
import {readFourRegionProfile,BIOME_PROFILE_SUFFIX}
  from '../src/manual-biomes/profile-storage.mjs';
import {M2_WORLD_MODE,planM2WorldChoice,openM2World,saveM2World,
  exportM2World,inspectM2WorldExport} from '../src/manual-biomes/m2-runtime-bridge.mjs';
import {PACK2_SIDECAR_SUFFIX} from '../src/pack2-world.mjs';
import {SAVE_JOURNAL_SUFFIX} from '../src/persistence.mjs';

function storage(){
  const values=new Map();
  return {
    get length(){return values.size;},
    key(i){return [...values.keys()][i]??null;},
    getItem(k){return values.has(k)?values.get(k):null;},
    setItem(k,v){values.set(String(k),String(v));},
    removeItem(k){values.delete(String(k));},
    snapshot(){return JSON.stringify([...values].sort((a,b)=>a[0].localeCompare(b[0])));}
  };
}
const choose=(store,seed=179)=>openM2World(store,
  planM2WorldChoice(String(seed),M2_WORLD_MODE.CREATE_ENVIRONMENT_V7,
    {confirmed:true}));
const open=(store,seed=179)=>openM2World(store,planM2WorldChoice(String(seed)));
const deep=-100; // original depth contract, outside surface generation.

test('original V7 profile persists schema-1 deep mine edits across the authoritative loader',()=>{
  const store=storage(),created=choose(store),world=created.world;
  assert.equal(created.base.generationProfile.generator,M7_ENVIRONMENT_GENERATOR);
  assert.equal(world.base.get(0,deep,0),BLOCK.DEEPSTONE);
  assert.equal(world.set(0,deep,0,BLOCK.AIR),true);
  const expected=JSON.stringify(world.save());
  assert.deepEqual(Object.keys(world.save()),['schema','seed','edits']);
  assert.equal(saveM2World(store,world).ok,true);
  assert.equal(store.getItem(worldSlotKey(179)),expected);
  const before=store.snapshot(),reopened=open(store);
  assert.equal(store.snapshot(),before,'normal load must not rewrite existing world');
  assert.equal(reopened.base.generationProfile.generator,M7_ENVIRONMENT_GENERATOR);
  assert.equal(JSON.stringify(reopened.world.save()),expected);
  assert.equal(reopened.world.get(0,deep,0),BLOCK.AIR);
  assert.equal(readFourRegionProfile(store,179).profile.generator,M7_ENVIRONMENT_GENERATOR);
});
test('original V7 Pack2 physical overlay remains a separate checksummed sidecar',()=>{
  const store=storage(),world=choose(store,2026).world;
  assert.equal(world.set(0,deep,0,BLOCK.AIR),true);
  assert.equal(world.placePack2(0,deep,0,59,{}),true);
  assert.equal(world.get(0,deep,0),59);
  const baseBefore=JSON.stringify(world.save());
  const packBefore=JSON.stringify(world.pack2Snapshot());
  const saved=saveM2World(store,world);
  assert.equal(saved.ok,true);
  assert.equal(store.getItem(worldSlotKey(2026)),baseBefore);
  assert.equal(typeof store.getItem(worldSlotKey(2026)+PACK2_SIDECAR_SUFFIX),'string');
  const recovered=open(store,2026);
  assert.equal(JSON.stringify(recovered.world.save()),baseBefore);
  assert.equal(JSON.stringify(recovered.world.pack2Snapshot()),packBefore);
  assert.equal(recovered.world.get(0,deep,0),59);
  assert.equal(recovered.base.get(0,deep,0),BLOCK.AIR);
});
test('damaged original V7 canonical save recovers verified journal without rewriting source bytes',()=>{
  const store=storage(),world=choose(store,179).world;
  assert.equal(world.set(0,deep,0,BLOCK.AIR),true);
  assert.equal(saveM2World(store,world).ok,true);
  const original=store.getItem(worldSlotKey(179));
  assert.equal(typeof store.getItem(worldSlotKey(179)+SAVE_JOURNAL_SUFFIX),'string');
  store.setItem(worldSlotKey(179),'{damaged-original');
  const before=store.snapshot();
  const restored=open(store,179);
  assert.equal(restored.recovered,true);
  assert.equal(restored.base.generationProfile.generator,M7_ENVIRONMENT_GENERATOR);
  assert.equal(JSON.stringify(restored.world.save()),original);
  assert.equal(store.snapshot(),before,'loading recovered source must not repair/overwrite');
  assert.equal(store.getItem(worldSlotKey(179)),'{damaged-original');
});
test('V7 profile and Pack2 export round-trip by inspection without changing storage',()=>{
  const store=storage(),world=choose(store,2026).world;
  assert.equal(world.set(0,deep,0,BLOCK.AIR),true);
  assert.equal(world.placePack2(0,deep,0,59,{}),true);
  const before=store.snapshot(),raw=exportM2World(world),inspected=inspectM2WorldExport(raw);
  assert.equal(store.snapshot(),before,'inspection may never write storage');
  assert.equal(inspected.mode,'four-regions');
  assert.equal(inspected.world.base.generationProfile.generator,M7_ENVIRONMENT_GENERATOR);
  assert.equal(JSON.stringify(inspected.world.save()),JSON.stringify(world.save()));
  assert.equal(JSON.stringify(inspected.world.pack2Snapshot()),
    JSON.stringify(world.pack2Snapshot()));
  const tampered=JSON.parse(raw);
  tampered.profile.generator='v8-new-opt-in';
  assert.throws(()=>inspectM2WorldExport(JSON.stringify(tampered)),
    /Unsupported|Unknown biome generator/);
});
test('original new-world routing rejects unapproved V8 and preserves existing M7 sidecar',()=>{
  const store=storage();
  const created=choose(store,179);
  const original=store.getItem(worldSlotKey(179)+BIOME_PROFILE_SUFFIX);
  assert.throws(()=>fourRegionProfile(179,'v8-new-opt-in'),/Unknown biome generator/);
  assert.throws(()=>planM2WorldChoice('179','create-new-v8',{confirmed:true}),
    /Unsupported manual biome world choice/);
  assert.throws(()=>choose(store),/World already has a generation profile/);
  assert.equal(store.getItem(worldSlotKey(179)+BIOME_PROFILE_SUFFIX),original);
  assert.equal(created.base.generationProfile.generator,M7_ENVIRONMENT_GENERATOR);
});
test('original mining ray and body collision still use real M7 deep AIR edits',()=>{
  const store=storage(),world=choose(store,179).world;
  const xs=[[0,deep,-1],[0,deep,0],[0,deep+1,-1],[0,deep+1,0]];
  for(const [x,y,z] of xs)assert.equal(world.set(x,y,z,BLOCK.AIR),true);
  assert.equal(collides(world,0.5,deep,0.5),false);
  assert.equal(world.set(0,deep,0,BLOCK.DEEPSTONE),true);
  assert.equal(collides(world,0.5,deep,0.5),true);
  const hit=raycast(world,[0.5,deep+0.5,-0.5],[0,0,1],4);
  assert.deepEqual(hit?.hit,[0,deep,0]);
  assert.equal(world.get(...hit.hit),BLOCK.DEEPSTONE);
});
