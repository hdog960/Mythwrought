// Original live MobEngine/PopulationManager spawn admission read consistency.
// Uses original-import Node ESM. The worlds below are controlled physical
// fixtures, NOT authentic M7 FourRegionWorld / iPhone acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager,spawnEligible} from '../src/mobs/ecology.mjs';
import {getSpecies} from '../src/mobs/species.mjs';
import {sectionForY} from '../src/depth.mjs';

const POINT=[8.5,4,8.5],OBSERVER=[-2,4,8.5];
function mutableSource(stage='stable'){
  const state={revision:0,resident:true};
  let point,observer;
  function change(where) {
    if(stage===where+'-revision')state.revision++;
    if(stage===where+'-unload')state.resident=false;
    if(stage===where+'-point')point[0]+=1;
    if(stage===where+'-observer')observer[0]-=1;
  }
  const world={
    revision(){return state.revision;},
    environment(){change('environment');return {biome:'meadow',light:.8,hazard:false};},
    grounded(){change('grounded');return true;},
    residentAt(){return state.resident;},
    volume(){return 'clear';},
    medium(){return 'air';}
  };
  return {world,state,
    qualify(){
      point=[...POINT];observer=[...OBSERVER];
      return spawnEligible(world,getSpecies('deer'),point,observer);
    }
  };
}
function flatWorld({biome='meadow',floor=4,light=.8,editDuringEnvironment=false}={}){
  let revision=0;
  return {revision(){return revision;},
    environment(){if(editDuringEnvironment)revision++;return {biome,light,hazard:false};},
    volume(point){return point[1]<floor?'solid':'clear';},
    grounded(point){return point[1]>=floor && point[1]<floor+.04;},
    residentAt(){return true;},
    medium(){return 'air';},
    revisionValue(){return revision;}
  };
}
function firstTick(seed,{biome='meadow',floor=4,light=.8,editDuringEnvironment=false}={}){
  const world=flatWorld({biome,floor,light,editDuringEnvironment});
  const engine=new MobEngine(world,seed,{maxEntities:128,maxActive:32});
  const manager=new PopulationManager(engine,world,{seed,spawnOnFirstVisit:true});
  try{
    const region={cx:0,cz:0,section:sectionForY(floor),feet:floor};
    const result=manager.advance(.5,[8,floor,8],[region]);
    const newborn=result.spawned===null?null:engine.get(result.spawned);
    return {result,counts:engine.counts(),newborn,revision:world.revisionValue()};
  }finally{engine.dispose();}
}

test('stable original source habitat, observer and supported ground still admit deer',()=>{
  const s=mutableSource();
  assert.equal(s.qualify(),true);
  assert.equal(s.state.revision,0);
  assert.equal(s.state.resident,true);
});

for(const phase of ['environment','grounded']){
  for(const mutation of ['revision','point','observer','unload']){
    test(`original source spawn admission rejects ${mutation} during ${phase} callback`,()=>{
      const s=mutableSource(phase+'-'+mutation);
      assert.equal(s.qualify(),false,
        'No stale source biome, observer, world or residency may admit a mob');
    });
  }
}

test('stable original source without a revision hook remains backward-compatible',()=>{
  const s=mutableSource();
  delete s.world.revision;
  assert.equal(s.qualify(),true,
    'Optional revision authority does not ban source-compatible world fixtures');
});

test('unresident original source is rejected even if environment and support look safe',()=>{
  const s=mutableSource();
  s.state.resident=false;
  assert.equal(s.qualify(),false);
});

test('original MobEngine and PopulationManager refuse a source-edited newborn',()=>{
  const result=firstTick(1,{editDuringEnvironment:true});
  assert.equal(result.result.spawned,null);
  assert.equal(result.counts.total,0);
  assert.ok(result.revision>0);
  assert.ok(result.result.evaluated<=6);
});

test('original MobEngine retains first-tick seed-1 meadow cow on stable source',()=>{
  const result=firstTick(1);
  assert.ok(result.result.spawned);
  assert.equal(result.newborn?.species.id,'cow');
  assert.deepEqual(result.newborn?.position,[.5,4,10.5]);
  assert.equal(result.counts.total,1);
  assert.equal(result.revision,0);
});

test('six original V6/cave habitat baselines preserve 384 stable source first ticks',()=>{
  const cases=[
    {biome:'meadow',floor:4,light:.8,births:28},
    {biome:'forest',floor:4,light:.8,births:44},
    {biome:'desert',floor:4,light:.8,births:13},
    {biome:'snow',floor:4,light:.8,births:19},
    {biome:'alpine',floor:4,light:.8,births:32},
    // Historical 43 births changed to 47 under the accepted cave-column permutation.
    {biome:'cave',floor:-34,light:.25,births:47}
  ];
  for(const scene of cases){
    let admitted=0;
    for(let seed=1;seed<=64;seed++){
      const result=firstTick(seed,scene);
      assert.ok(result.result.evaluated>=0&&result.result.evaluated<=6);
      assert.equal(result.counts.total,result.newborn?1:0);
      if(result.newborn){
        admitted++;
        assert.ok(result.newborn.species.habitat.biomes.includes(scene.biome));
        assert.equal(sectionForY(Math.floor(result.newborn.position[1])),
          sectionForY(scene.floor));
      }
    }
    assert.equal(admitted,scene.births,
      'Original deterministic physical-flat source baseline must not drift');
  }
});
