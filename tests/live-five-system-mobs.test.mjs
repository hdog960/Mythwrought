import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld} from '../src/voxel.mjs';
import {speciesRegistry} from '../src/mobs/species.mjs';
import {meshes} from '../mob-preview/models.mjs';
import {createLiveMobSession,mobSaveKey,LIVE_MOB_COUNT,classifyLiveBiome}
  from '../src/mobs/live-game.mjs';
import {createLiveMobRenderer} from '../src/mobs/live-render.mjs';

function memoryStorage(){
  const entries=new Map();
  return {
    getItem:key=>entries.has(key)?entries.get(key):null,
    setItem:(key,value)=>entries.set(key,String(value)),
    removeItem:key=>entries.delete(key)
  };
}
function setup(seed=179,storage=memoryStorage()){
  const world=new VoxelWorld(seed);
  const initial=JSON.stringify(world.save());
  const build=()=>createLiveMobSession({
    world,seed,storage,
    resident:()=>true,
    biomeAt:()=> 'plains',
    skyAt:()=>({light:.8,dayPhase:'day'}),
    caveAt:()=>({underground:false}),
    playerAt:()=>[0,10,0]
  });
  return {world,initial,storage,build};
}

test('live integrated catalog has exactly 20 passive and 20 hostile authored 3D meshes',()=>{
  assert.equal(LIVE_MOB_COUNT,40);
  assert.equal(speciesRegistry.length,40);
  assert.equal(new Set(speciesRegistry.map(x=>x.id)).size,40);
  assert.equal(speciesRegistry.filter(x=>x.classification==='passive').length,20);
  assert.equal(speciesRegistry.filter(x=>x.classification==='hostile').length,20);
  for(const entry of speciesRegistry){
    assert.equal(entry.implementation,'preview','creature not simulation-ready: '+entry.id);
    assert.ok(meshes[entry.id] instanceof Float32Array,'missing genuine model '+entry.id);
    assert.equal(meshes[entry.id].length%7,0,'invalid model vertex '+entry.id);
    assert.ok(meshes[entry.id].length>=21,'model too small '+entry.id);
  }
  assert.equal(typeof createLiveMobRenderer,'function');
});

test('live session uses independent checksummed sidecar without modifying schema-1 world',()=>{
  const {world,initial,storage,build}=setup(179);
  const original=storage.getItem(mobSaveKey(179));
  assert.equal(original,null);
  const first=build();
  assert.equal(first.status().species,40);
  assert.equal(first.status().readonly,false);
  assert.equal(first.status().counts.total,0);
  assert.equal(first.save(),true);
  assert.equal(JSON.stringify(world.save()),initial);
  const stored=storage.getItem(mobSaveKey(179));
  assert.ok(stored?.includes('checksum'));
  first.dispose();
  const second=build();
  assert.equal(second.status().species,40);
  assert.equal(second.status().damaged,false);
  assert.equal(second.save(),true);
  assert.equal(storage.getItem(mobSaveKey(179)),stored);
  assert.equal(JSON.stringify(world.save()),initial);
  second.dispose();
});

test('damaged companion or mob sidecar fails closed without rewriting existing data',()=>{
  const {world,initial,storage,build}=setup(379);
  const key=mobSaveKey(379),data='corrupt-creature-checkpoint';
  storage.setItem(key,data);
  const instance=build();
  assert.equal(instance.status().readonly,true);
  assert.equal(instance.status().damaged,true);
  assert.equal(instance.save(),false);
  assert.equal(storage.getItem(key),data);
  assert.equal(JSON.stringify(world.save()),initial);
  instance.dispose();
});

test('unified V6/Cave biome adapter preserves five source biome identities',()=>{
  for(const [name,result] of [
    ['plains','meadow'],['mountain','alpine'],['desert','desert'],
    ['snow','snow'],['enchanted','forest'],['cave','cave']])
    assert.equal(classifyLiveBiome(name,0,false),result);
  assert.equal(classifyLiveBiome('plains',-40,true),'cave');
  assert.throws(()=>mobSaveKey(2**33),/int32/);
});

test('creature occupancy uses original surface section 0 and exact offset deep sections',()=>{
  const sections=[];
  const world=new VoxelWorld(1001);
  const session=createLiveMobSession({
    world,seed:1001,storage:memoryStorage(),
    resident:(cx,cz,section)=>{sections.push(section);return true;},
    biomeAt:()=> 'plains',
    skyAt:()=>({light:.8,dayPhase:'day'}),
    caveAt:()=>({underground:true}),
    playerAt:()=>[0,10,0]
  });
  for(const [y,section] of [[19,0],[17,0],[16,0],[0,0],[-3,0],
    [-4,-1],[-16,-1],[-19,-1],[-20,-2],[-35,-2],[-36,-3]]){
    sections.length=0;
    assert.equal(session.query.environment([.5,y,.5]).hazard,false,
      'valid resident creature section at '+y);
    assert.equal(session.query.residentAt([.5,y,.5]),true);
    assert.ok(sections.includes(section),
      'Y '+y+' must use game depth section '+section+', got '+JSON.stringify(sections));
    assert.ok(sections.every(value=>value===section),
      'No false section lookup at Y '+y+': '+JSON.stringify(sections));
  }
  session.dispose();
});
