// Current Mountain/Snow production Mob geometry contract. Uses actual owner
// descriptors, never changes their registration, terrain or save namespace.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK} from '../src/voxel.mjs';
import {ENVIRONMENT_GROUND} from '../src/environment-ground.mjs';
import {FourRegionWorld,fourRegionProfile,M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR,
  SNOW_P1_GENERATOR,M8_MOUNTAIN_GENERATOR} from '../src/manual-biomes/profile-world.mjs';
import {MOUNTAIN_V8_MATERIAL_IDS,MOUNTAIN_V8_MATERIAL as M,mountainV8Material}
  from '../src/manual-biomes/mountain-v8-materials.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {createM7MobCollisionReader} from '../src/mobs/ecosystem-world-geometry.mjs';
import {createLiveMobSession} from '../src/mobs/live-game.mjs';
const body=Object.freeze({radius:.08,height:.12});
const profiles=[M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR,SNOW_P1_GENERATOR,M8_MOUNTAIN_GENERATOR];
const session=world=>createLiveMobSession({world,seed:179,
  storage:{getItem:()=>null,setItem(){throw Error('No writes');}},
  resident:()=>true,biomeAt:()=> 'mountain',caveAt:()=>({underground:false}),
  skyAt:()=>({light:.8,dayPhase:'day'}),playerAt:()=>[2,4,2],allowWrites:()=>false});
for(const generator of profiles)test('owner-approved profile and real environmental ground '+generator,()=>{
  for(const id of Object.values(ENVIRONMENT_GROUND)){
    const source={base:{generationProfile:{generator}},get:()=>id};
    const reader=createM7MobCollisionReader(source);
    assert.equal(reader.get(0,4,0),BLOCK.STONE);
    assert.equal(source.get(0,4,0),id);
    assert.equal(reader.set,undefined);
  }
  const source={base:{generationProfile:{generator}},get:(x,y,z)=>y===3?M.stone:BLOCK.AIR};
  const live=session(source);
  try{
    assert.equal(live.query.grounded([.5,4,.5],body),generator===M8_MOUNTAIN_GENERATOR);
  }finally{live.dispose();}
});
test('exact thirteen V8 material body semantics, not a full-cube trunk or solid flowers',()=>{
  for(const id of MOUNTAIN_V8_MATERIAL_IDS){
    const source={base:{generationProfile:{generator:M8_MOUNTAIN_GENERATOR}},
      get:(x,y,z)=>x===0&&y===4&&z===0?id:BLOCK.AIR};
    const reader=createM7MobCollisionReader(source);
    assert.equal(reader.mobMountainShape(id),mountainV8Material(id));
    assert.equal(reader.get(0,4,0),id);
    const live=session(source);
    try{
      const solid=mountainV8Material(id).solid;
      assert.equal(live.query.volume([.5,4.5,.5],body),solid?'solid':'clear');
      assert.equal(live.query.volume([.1,4.5,.1],body),id<=506?'solid':'clear');
      assert.equal(live.query.lineOfSight([-.5,4.56,.5],[1.5,4.56,.5]),!solid);
    }finally{live.dispose();}
  }
  assert.throws(()=>createM7MobCollisionReader({base:{generationProfile:{generator:'mountain-v8-unapproved'}},get:()=>500}),/exact M7 generator/);
});
test('actual owner seed179 natural V8 pine retains partial trunk, registered ground and source saves',()=>{
  const base=new FourRegionWorld(179,fourRegionProfile(179,M8_MOUNTAIN_GENERATOR));
  const world=new Pack2LiveWorld(base),x=-470,y=13,z=5;
  const before=JSON.stringify(base.save()),beforePack=JSON.stringify(world.pack2Snapshot());
  assert.equal(world.get(x,y-1,z),M['alpine-grass']);
  assert.equal(world.get(x,y,z),M['conifer-trunk']);
  const live=session(world);
  try{
    assert.equal(live.query.volume([x+.5,y+.5,z+.5],body),'solid');
    assert.equal(live.query.volume([x+.1,y+.5,z+.1],body),'clear');
    assert.equal(live.query.grounded([x+.1,y,z+.1],body),true);
    assert.equal(live.query.environment([x+.1,y,z+.1]).biome,'alpine');
  }finally{live.dispose();}
  assert.equal(JSON.stringify(base.save()),before);assert.equal(JSON.stringify(world.pack2Snapshot()),beforePack);
});
