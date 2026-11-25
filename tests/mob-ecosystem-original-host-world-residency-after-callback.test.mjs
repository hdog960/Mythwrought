// ORIGINAL MYTHWROUGHT source host/query resilience regression contract.
// Only controlled source-world callbacks are mocked; import the ORIGINAL
// MobEngine/PopulationManager/species/world-query through native ESM.
// This is NOT generated M7, iPhone performance or PWA acceptance.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createMobHostView} from '../src/mobs/host-view.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager,spawnEligible} from '../src/mobs/ecology.mjs';
import {getSpecies} from '../src/mobs/species.mjs';
import {BLOCK} from '../src/voxel.mjs';

function scene(mode='stable',{floor=4,initiallyResident=true}={}){
  const state={resident:initiallyResident,revision:0,residentReads:0,revisionReads:0};
  const mutate=(step,point)=>{
    if(mode===step+'-revision')state.revision++;
    if(mode===step+'-unload')state.resident=false;
    if(mode===step+'-point')point[1]+=1;
  };
  const world={get(x,y,z){return y<floor?BLOCK.STONE:BLOCK.AIR;}};
  const query=createMobHostView(world,{
    resident(){state.residentReads++;return state.resident;},
    revision(){state.revisionReads++;return state.revision;},
    biomeAt(point){mutate('biome',point);return{id:floor<0?'cave':'meadow',hazard:false};},
    caveAt(point){mutate('cave',point);return{ready:true,climbable:false};},
    skyAt(point){mutate('sky',point);return{light:floor<0?.25:.8,dayPhase:'day'};},
    objectsAt(point){
      mutate('objects',point);
      return [{id:'safe-bridge',kind:'switch',position:[9,floor,9],permitted:true},
        {id:'private-unsafe',kind:'door',position:[9,floor,8],permitted:false}];
    }
  });
  return {world,query,state,point:[8.5,floor,8.5]};
}

test('original stable host keeps certified meadow and bounded object permissions',()=>{
  const s=scene(),environment=s.query.environment(s.point);
  assert.equal(environment.biome,'meadow');
  assert.equal(environment.hazard,false);
  assert.equal(environment.light,.8);
  assert.deepEqual(environment.objects,[{
    id:'safe-bridge',kind:'switch',position:[9,4,9]
  }]);
  assert.ok(s.state.residentReads>=2,'Post-supplier authoritative residency recheck');
  assert.equal(s.state.revisionReads,2,'One initial and one final source revision');
  assert.equal(s.query.grounded(s.point,getSpecies('deer').body),true);
});

for(const phase of ['biome','cave','sky','objects']){
  test(`a ${phase} callback editing source world cannot report a safe mob environment`,()=>{
    const s=scene(phase+'-revision'),environment=s.query.environment(s.point);
    assert.equal(s.state.revision,1);
    assert.equal(environment.biome,null);
    assert.equal(environment.hazard,true);
    assert.equal(environment.light,null);
  });
}

for(const phase of ['sky','objects']){
  test(`a ${phase} callback unloading the selected source chunk blocks habitat`,()=>{
    const s=scene(phase+'-unload'),environment=s.query.environment(s.point);
    assert.equal(s.state.resident,false);
    assert.equal(environment.biome,null);
    assert.equal(environment.hazard,true);
  });
}

for(const phase of ['biome','sky','objects']){
  test(`a ${phase} callback moving the source query point invalidates its habitat`,()=>{
    const s=scene(phase+'-point'),environment=s.query.environment(s.point);
    assert.deepEqual(s.point,[8.5,4,8.5],'Caller-owned observer input is not rewritten');
    assert.equal(environment.biome,null);
    assert.equal(environment.hazard,true);
  });
}

test('original deep section -2 still classifies a stable, physical cave normally',()=>{
  const s=scene('stable',{floor:-34}),environment=s.query.environment(s.point);
  assert.equal(environment.biome,'cave');
  assert.equal(environment.hazard,false);
  assert.equal(s.query.grounded(s.point,getSpecies('slime').body),true);
});

test('unloaded source chunk is rejected before any environment suppliers can admit it',()=>{
  const s=scene('stable',{initiallyResident:false});
  const env=s.query.environment(s.point);
  assert.equal(env.biome,null);
  assert.equal(env.hazard,true);
  assert.equal(s.state.residentReads,1);
});

test('actual original spawnEligible does not accept sky-edited source ground',()=>{
  const s=scene('sky-revision'),point=s.point;
  assert.equal(s.query.grounded(point,getSpecies('deer').body),true);
  assert.equal(spawnEligible(s.query,getSpecies('deer'),point,[-2,4,8.5]),false);
  assert.equal(s.state.revision,1);
});

test('stable original spawnEligible keeps valid physical meadow admission',()=>{
  const s=scene(),point=s.point;
  assert.equal(spawnEligible(s.query,getSpecies('deer'),point,[-2,4,8.5]),true);
});

test('actual original MobEngine/PopulationManager refuses birth after sky source edit',()=>{
  const s=scene('sky-revision'),engine=new MobEngine(s.query,1,{
    maxEntities:32,maxActive:8
  });
  const manager=new PopulationManager(engine,s.query,{
    seed:1,spawnOnFirstVisit:true
  });
  const result=manager.advance(.5,[8,4,8],[{cx:0,cz:0,section:0,feet:4}]);
  assert.equal(result.spawned,null);
  assert.equal(engine.counts().total,0);
  assert.ok(s.state.revision>0);
  engine.dispose();
});

test('actual original manager still admits supported first-visit seed-1 meadow newborn',()=>{
  const s=scene(),engine=new MobEngine(s.query,1,{
    maxEntities:32,maxActive:8
  });
  const manager=new PopulationManager(engine,s.query,{
    seed:1,spawnOnFirstVisit:true
  });
  const result=manager.advance(.5,[8,4,8],[{cx:0,cz:0,section:0,feet:4}]);
  assert.ok(result.spawned,'Known source seed-1 flat meadow newborn baseline');
  assert.equal(engine.counts().total,1);
  assert.equal(engine.get(result.spawned)?.species.id,'cow');
  engine.dispose();
});
