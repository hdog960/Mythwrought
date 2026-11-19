import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld} from '../src/voxel.mjs';
import {speciesRegistry} from '../src/mobs/species.mjs';
import {meshes} from '../mob-preview/models.mjs';
import {createLiveMobSession,mobSaveKey,LIVE_MOB_COUNT,classifyLiveBiome}
  from '../src/mobs/live-game.mjs';
import {createLiveMobRenderer} from '../src/mobs/live-render.mjs';
import {hostileTactics} from '../src/mobs/hostile-tactics.mjs';

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

test('ranged hostile attack visuals use original GPU mesh, never invisible damage',()=>{
  const projectileMeshes=['projectile','briar-spore','frost-splinter','void-mote'];
  assert.deepEqual([...new Set(Object.values(hostileTactics)
    .filter(t=>t.attack==='ranged')
    .map(t=>t.projectile??'projectile'))].sort(),projectileMeshes.sort());
  for(const id of projectileMeshes)
    assert.ok(meshes[id]?.length>=21,'Missing visible genuine '+id+' ranged model');
});

test('live creature sightline respects real Pack 5 authoritative shape raycast',()=>{
  const world=new VoxelWorld(179);
  world.pack5Collision=()=>false;
  const source=[.5,18,.5],dest=[1.5,18,.5];
  const make=()=>createLiveMobSession({
    world,seed:179,storage:memoryStorage(),resident:()=>true,
    biomeAt:()=> 'plains',skyAt:()=>({light:.8,dayPhase:'day'}),
    caveAt:()=>({underground:false}),playerAt:()=>[.5,18,.5]
  });
  const blocked=make();
  assert.equal(blocked.query.lineOfSight(source,dest),false,
    'Unknown loaded Pack 5 layer must NOT authorize hit through furnishing');
  blocked.dispose();
  const observed=[];
  world.pack5Layer={raycast(origin,direction,length){
    observed.push({origin,direction,length});
    return null;
  }};
  const clear=make();
  assert.equal(clear.query.lineOfSight(source,dest),true,
    'Verified empty Pack 5 ray must not disable all gameplay');
  assert.ok(observed.length);
  world.pack5Layer.raycast=()=>({distance:.3});
  assert.equal(clear.query.lineOfSight(source,dest),false,
    'Occupied Pack 5 fixture must stop the creature ray');
  world.pack5Layer.raycast=()=>{throw Error('Pack 5 shape unavailable');};
  assert.equal(clear.query.lineOfSight(source,dest),false,
    'Invalid Pack 5 shape service fails closed');
  clear.dispose();
});

test('actual-game creature commands are safe without eligible tame, mount, breed or pet',()=>{
  const {world,initial,build}=setup(811);
  const session=build();
  assert.equal(session.riderPosition(),null);
  assert.equal(session.steerMount(0,1,0),false);
  assert.match(session.toggleMount(),/No nearby tamed rideable/);
  assert.match(session.breedNearby(),/two nearby healthy matching adults/);
  assert.match(session.companionOrder('follow'),/No awake bonded companion/);
  assert.equal(session.dismount(),false);
  assert.equal(session.save(),true);
  assert.equal(JSON.stringify(world.save()),initial);
  session.dispose();
});
