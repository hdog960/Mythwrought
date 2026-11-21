import test from 'node:test';
import assert from 'node:assert/strict';
import {VoxelWorld} from '../src/voxel.mjs';
import {createWorldQuery} from '../src/mobs/world-query.mjs';
import {MobEngine} from '../src/mobs/engine.mjs';
import {PopulationManager} from '../src/mobs/ecology.mjs';
import {arena} from './mobs/fixture.mjs';

function sample(biome='meadow',diagnostics=true){
  const query=createWorldQuery(arena({floor:3,bounds:[-8,17,-8,17]}),{
    resident:()=>true,observe:()=>({biome,light:.8,hazard:false})
  });
  const engine=new MobEngine(query,61);
  const ecology=new PopulationManager(engine,query,{seed:61,species:['deer'],diagnostics});
  for(let i=0;i<120;i++)
    ecology.advance(.5,[-2,4,3],[{cx:0,cz:0,section:0,feet:4}]);
  return {engine,ecology};
}

test('optional counters preserve the original deterministic spawn sequence',()=>{
  const original=sample('meadow',false),instrumented=sample('meadow',true);
  assert.equal(original.ecology.diagnostics(),null);
  assert.deepEqual(original.engine.all(),instrumented.engine.all());
  const snapshot=instrumented.ecology.diagnostics();
  assert.equal(snapshot.spawned,4);
  assert.equal(snapshot.total,4);
  assert.ok(snapshot.attempted>=snapshot.spawned);
  assert.ok(Object.isFrozen(snapshot)&&Object.isFrozen(snapshot.rejected));
});

test('natural habitat rejection is counted without false births',()=>{
  const {engine,ecology}=sample('desert',true);
  const snapshot=ecology.diagnostics();
  assert.equal(snapshot.spawned,0);
  assert.equal(engine.counts().total,0);
  assert.ok(snapshot.rejected.biome>0,JSON.stringify(snapshot));
});

test('missing real voxel residency has a bounded diagnostic reason',()=>{
  const query=createWorldQuery(arena({floor:3,bounds:[-8,17,-8,17]}),{
    resident:()=>false,observe:()=>({biome:'meadow',light:.8,hazard:false})
  });
  const engine=new MobEngine(query,61);
  assert.throws(()=>new PopulationManager(engine,query,{diagnostics:'yes'}),/Invalid ecology options/);
  const ecology=new PopulationManager(engine,query,{seed:61,species:['deer'],diagnostics:true});
  for(let i=0;i<120;i++)ecology.advance(.5,[-2,4,3],[{cx:0,cz:0,section:0,feet:4}]);
  const snapshot=ecology.diagnostics();
  assert.equal(snapshot.spawned,0);
  assert.ok(snapshot.rejected['unknown-voxels']>0,JSON.stringify(snapshot));
  assert.equal(Object.keys(snapshot.rejected).length,20);
});

test('real VoxelWorld baseline records natural attempts without injecting any mobs',()=>{
  for(const seed of [179,379,1001]){
    const world=new VoxelWorld(seed);
    const query=createWorldQuery(world,{resident:()=>true,
      observe:()=>({biome:'meadow',light:.8,hazard:false})});
    const engine=new MobEngine(query,seed);
    const ecology=new PopulationManager(engine,query,{seed,species:['deer'],diagnostics:true});
    for(let i=0;i<90;i++)
      ecology.advance(.5,[0,10,0],[{cx:0,cz:0,section:0,feet:10}]);
    const snapshot=ecology.diagnostics();
    assert.ok(snapshot.attempted>0,'Original scheduling did not attempt any positions');
    assert.ok(snapshot.spawned>=engine.counts().total);
    console.log('MYTHWROUGHT_MOB_NATIVE_REAL_VOXEL '+JSON.stringify({seed,...snapshot}));
    engine.dispose();
  }
});
