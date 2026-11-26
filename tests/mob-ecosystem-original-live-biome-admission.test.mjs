// Detached original-source M7 mob host contract. Uses the real original
// MobHostView, createWorldQuery, MobEngine/PopulationManager import graph.
// Synthetic floor only: NOT a generated original M7 21-site world test.
import test from 'node:test';
import assert from 'node:assert/strict';
import {classifyLiveBiome,createLiveMobSession}
  from '../src/mobs/live-game.mjs';
import {createMobHostView} from '../src/mobs/host-view.mjs';
import {spawnEligible} from '../src/mobs/ecology.mjs';
import {getSpecies} from '../src/mobs/species.mjs';
import {BLOCK} from '../src/voxel.mjs';

function floorWorld(feet=4){
  return {get(x,y,z){return y<feet?BLOCK.STONE:BLOCK.AIR;}};
}
function host(name,{resident=true,feet=4,cave=false}={}){
  const world=floorWorld(feet);
  return createMobHostView(world,{
    resident:()=>resident,
    revision:()=>0,
    biomeAt:()=>({id:classifyLiveBiome(name,feet,cave),hazard:false}),
    skyAt:()=>({light:feet<0?.25:.8,dayPhase:'day'}),
    caveAt:()=>({ready:true,climbable:false})
  });
}

for(const [name,expected] of [
  ['plains','meadow'],['mountain','alpine'],['desert','desert'],
  ['snow','snow'],['enchanted','forest'],['forest','forest'],
  ['meadow','meadow'],['cave','cave']
]){
  test(`original accepted surface biome ${name} remains ${expected}`,()=>{
    assert.equal(classifyLiveBiome(name,4,false),expected);
  });
}

test('original deep cave ownership remains explicit and depth-bounded',()=>{
  assert.equal(classifyLiveBiome('plains',-34,true),'cave');
  assert.equal(classifyLiveBiome('plains',-3,true),'meadow');
  assert.equal(classifyLiveBiome('plains',-34,'true'),'meadow',
    'A string must not impersonate the original boolean cave witness');
  assert.equal(classifyLiveBiome('plains',NaN,true),'meadow');
});

test('unrecognized or missing original terrain identity is never silently a meadow',()=>{
  for(const name of [undefined,null,'','unregistered','wetland','volcanic',
    'alpine','constructor','__proto__','toString']){
    assert.equal(classifyLiveBiome(name,4,false),null,
      `Unknown original biome ${String(name)} must fail closed`);
  }
});

test('real original MobHostView/world-query rejects unknown source biome',()=>{
  for(const name of [undefined,null,'unregistered','constructor']){
    const query=host(name),environment=query.environment([8.5,4,8.5]);
    assert.equal(environment.biome,null);
    assert.equal(environment.hazard,true);
    assert.equal(environment.light,null);
    assert.equal(query.residentAt([8.5,4,8.5]),true,
      'Resident geometry alone cannot authenticate an unknown biome');
  }
});

test('original real spawnEligible rejects a missing-biome deer on supported ground',()=>{
  const point=[8.5,4,8.5],observer=[-2,4,8.5],query=host(undefined);
  const deer=getSpecies('deer');
  assert.equal(query.grounded(point,deer.body),true);
  assert.equal(spawnEligible(query,deer,point,observer),false);
});

test('known plains stays physically supported and source eligible',()=>{
  const point=[8.5,4,8.5],observer=[-2,4,8.5],query=host('plains');
  const environment=query.environment(point);
  assert.equal(environment.biome,'meadow');
  assert.equal(environment.hazard,false);
  assert.equal(query.grounded(point,getSpecies('deer').body),true);
  assert.equal(spawnEligible(query,getSpecies('deer'),point,observer),true);
});

test('unresident original source chunk remains blocked with valid biome',()=>{
  const point=[8.5,4,8.5],query=host('plains',{resident:false});
  assert.equal(query.environment(point).hazard,true);
  assert.equal(query.volume(point,getSpecies('deer').body),'unknown');
  assert.equal(spawnEligible(query,getSpecies('deer'),point,[-2,4,8.5]),false);
});

test('original deep cave host remains cave when explicitly certified',()=>{
  const point=[8.5,-34,8.5],query=host('plains',{feet:-34,cave:true});
  assert.equal(query.environment(point).biome,'cave');
  assert.equal(query.environment(point).hazard,false);
  assert.equal(query.grounded(point,getSpecies('slime').body),true);
});

test('actual live mob session exposes hazardous query for unrecognized biome',()=>{
  const world=floorWorld(),storage={getItem(){return null;},setItem(){}};
  const session=createLiveMobSession({
    world,seed:179,storage,resident:()=>true,
    biomeAt:()=>undefined,
    skyAt:()=>({light:.8,dayPhase:'day'}),
    caveAt:()=>({underground:false}),playerAt:()=>[8,4,8]
  });
  try{
    const environment=session.query.environment([8.5,4,8.5]);
    assert.equal(environment.biome,null);
    assert.equal(environment.hazard,true);
    assert.equal(session.engine.counts().total,0);
  }finally{session.dispose();}
});
