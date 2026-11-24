// Current-production compatibility: historical M7 and versioned Enchanted P2
// retain the owner's exact collision registry. Controlled cells, real query.
import test from 'node:test';
import assert from 'node:assert/strict';
import {BLOCK,chunkCoord} from '../src/voxel.mjs';
import {sectionForY} from '../src/depth.mjs';
import {findSafeSpawn} from '../src/physics.mjs';
import {FourRegionWorld,fourRegionProfile} from '../src/manual-biomes/profile-world.mjs';
import {Pack2LiveWorld} from '../src/pack2-world.mjs';
import {v6BiomeAt} from '../src/manual-biomes/v6-balanced-biomes.mjs';
import {M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR,isEnvironmentGenerator,
  ENVIRONMENT_GROUND} from '../src/environment-ground.mjs';
import {createM7MobCollisionReader} from '../src/mobs/ecosystem-world-geometry.mjs';
import {createLiveMobSession} from '../src/mobs/live-game.mjs';
import {getSpecies} from '../src/mobs/species.mjs';

function fixture(generator,id){
  const source={base:{generationProfile:{generator}},
    get(x,y,z){return y<4?id:BLOCK.AIR;},
    set(){throw Error('Do not mutate terrain');}};
  const live=createLiveMobSession({world:source,seed:179,
    storage:{getItem:()=>null,setItem(){throw Error('No persistence');}},
    resident:()=>true,biomeAt:()=>'enchanted',
    caveAt:()=>({underground:false}),skyAt:()=>({light:.8,dayPhase:'day'}),
    playerAt:()=>[8,4,8],allowWrites:()=>false});
  return {source,live};
}
for(const generator of [M7_ENVIRONMENT_GENERATOR,ENCHANTED_P2_GENERATOR]){
  test('owner-approved '+generator+' supports all eleven registered environmental IDs',()=>{
    assert.equal(isEnvironmentGenerator(generator),true);
    for(const id of Object.values(ENVIRONMENT_GROUND)){
      const {source,live}=fixture(generator,id);
      try{
        const point=[8.5,4,8.5],body=getSpecies('fox').body;
        const reader=createM7MobCollisionReader(source);
        assert.equal(reader.get(8,3,8),BLOCK.STONE);
        assert.equal(source.get(8,3,8),id);
        assert.equal(reader.set,undefined);
        assert.equal(live.query.volume(point,body),'clear');
        assert.equal(live.query.grounded(point,body),true);
        assert.equal(live.query.environment(point).biome,'forest');
      }finally{live.dispose();}
    }
  });
}
test('legacy and unrecognized aliases cannot acquire environmental collision semantics',()=>{
  for(const generator of ['legacy','mythwrought-five-surface-regions-v6',
    ENCHANTED_P2_GENERATOR+'-unapproved',null]){
    assert.equal(isEnvironmentGenerator(generator),false);
    const {source,live}=fixture(generator,400);
    try{
      assert.throws(()=>createM7MobCollisionReader(source),/exact M7 generator/);
      assert.equal(live.query.grounded([8.5,4,8.5],getSpecies('fox').body),false);
      assert.equal(source.get(8,3,8),400);
    }finally{live.dispose();}
  }
});

test('actual current Enchanted P2 world yields physically supported registered forest terrain',()=>{
  const seed=179,base=new FourRegionWorld(seed,fourRegionProfile(seed,ENCHANTED_P2_GENERATOR));
  const world=new Pack2LiveWorld(base),before=JSON.stringify(base.save()),beforePack=JSON.stringify(world.pack2Snapshot());
  const ids=new Set(Object.values(ENVIRONMENT_GROUND)),witnesses=[];
  for(const [dx,dz] of [[0,0],[-8,0],[8,0],[0,-8],[0,8]]){
    const player=findSafeSpawn(world,dx,-512+dz);
    assert.equal(v6BiomeAt(player.x,player.z,seed)?.name,'enchanted');
    const point=[player.x,player.feet,player.z],cx=chunkCoord(player.x),cz=chunkCoord(player.z);
    const section=sectionForY(player.feet);
    const raw=world.get(Math.floor(player.x),player.feet-1,Math.floor(player.z));
    if(!ids.has(raw))continue;
    const live=createLiveMobSession({world,seed,
      storage:{getItem:()=>null,setItem(){throw Error('No writes');}},allowWrites:()=>false,
      resident:(x,z,s)=>s===section&&Math.abs(x-cx)<=2&&Math.abs(z-cz)<=2,
      biomeAt:()=> 'enchanted',skyAt:()=>({light:.8,dayPhase:'day'}),
      caveAt:()=>({underground:false}),playerAt:()=>point});
    try{
      const reader=createM7MobCollisionReader(world);
      assert.equal(reader.get(Math.floor(player.x),player.feet-1,Math.floor(player.z)),BLOCK.STONE);
      assert.equal(world.get(Math.floor(player.x),player.feet-1,Math.floor(player.z)),raw);
      assert.equal(live.query.environment(point).biome,'forest');
      const body=getSpecies('fox').body;
      if(live.query.volume(point,body)==='clear'&&live.query.grounded(point,body))witnesses.push({point,raw});
    }finally{live.dispose();}
  }
  console.log('MYTHWROUGHT_P2_MOB_PHYSICAL_SUPPORT '+JSON.stringify({seed,witnesses}));
  assert.ok(witnesses.length>0,'No physically supported registered P2 forest terrain witness');
  assert.equal(JSON.stringify(base.save()),before);assert.equal(JSON.stringify(world.pack2Snapshot()),beforePack);
});
