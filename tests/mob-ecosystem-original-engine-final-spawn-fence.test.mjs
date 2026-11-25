// Controlled source-interface regressions, intended for actual original Node imports.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';

function fixture(stage='stable', options={}){
  const state={version:0,resident:true,stage};
  const world={
    revision(){return state.version;},
    residentAt(point){
      if(state.stage==='resident-edit')state.version++;
      if(state.stage==='resident-point')point[0]+=1;
      return state.resident;
    },
    volume(point){
      if(state.stage==='volume-edit')state.version++;
      if(state.stage==='volume-point')point[0]+=1;
      return 'clear';
    },
    grounded(point){
      if(state.stage==='ground-edit')state.version++;
      if(state.stage==='ground-point')point[0]+=1;
      if(state.stage==='ground-unload')state.resident=false;
      if(state.stage==='ground-throw')throw Error('source ground error');
      return state.stage!=='airborne';
    }
  };
  const engine=new MobEngine(world,179,{maxEntities:4,maxActive:2,...options});
  return {state,world,engine};
}
function assertEmpty(engine){
  assert.deepEqual(engine.counts(),{total:0,awake:0});
  assert.equal(engine.checkpoint().next,0);
  assert.deepEqual(engine.drainEvents(),[]);
}
for(const stage of ['volume-edit','volume-point','ground-edit','ground-point',
  'ground-unload','resident-edit','resident-point']){
  test('original spawn rejects '+stage+' without reserving an ID',()=>{
    const {engine,state}=fixture(stage);
    assert.equal(engine.spawn('deer',[8,4,8]),null);
    assertEmpty(engine);
    state.stage='stable';state.resident=true;
    assert.equal(engine.spawn('deer',[8,4,8]),'mob-4z-1');
    engine.dispose();
  });
}
test('ground read exception leaves original engine identity and events untouched',()=>{
  const {engine,state}=fixture('ground-throw');
  assert.throws(()=>engine.spawn('deer',[8,4,8]),/source ground error/);
  assertEmpty(engine);
  state.stage='stable';
  assert.equal(engine.spawn('deer',[8,4,8]),'mob-4z-1');
  engine.dispose();
});
test('stable original airborne admission remains supported',()=>{
  const {engine}=fixture('airborne');
  const id=engine.spawn('deer',[8,4,8]);
  assert.equal(id,'mob-4z-1');
  assert.equal(engine.get(id).grounded,false);
  engine.dispose();
});
test('stable original identity, awake slots, and checkpoint format remain unchanged',()=>{
  const {engine}=fixture();
  const ids=[engine.spawn('deer',[8,4,8]),engine.spawn('deer',[9,4,8]),
    engine.spawn('deer',[10,4,8])];
  assert.deepEqual(ids,['mob-4z-1','mob-4z-2','mob-4z-3']);
  assert.deepEqual(engine.counts(),{total:3,awake:2});
  assert.equal(engine.get(ids[2]).state,'dormant');
  assert.equal(engine.checkpoint().next,3);
  assert.deepEqual(engine.drainEvents().map(e=>e.id),ids);
  engine.dispose();
});
test('original no-revision/no-residency fixtures retain stable compatibility',()=>{
  const {engine,world}=fixture();
  delete world.revision;delete world.residentAt;
  assert.equal(engine.spawn('deer',[8,4,8]),'mob-4z-1');
  engine.dispose();
});
test('ground callback disposal cannot resurrect original engine',()=>{
  const {engine,world}=fixture();
  world.grounded=()=>{engine.dispose();return true;};
  assert.equal(engine.spawn('deer',[8,4,8]),null);
  assert.deepEqual(engine.counts(),{total:0,awake:0});
  assert.deepEqual(engine.drainEvents(),[]);
});
test('reentrant original ground callback cannot overfill roster capacity',()=>{
  const {engine,world}=fixture('stable',{maxEntities:1,maxActive:1});
  world.grounded=()=>{
    world.grounded=()=>true;
    assert.ok(engine.spawn('deer',[9,4,8]));
    return true;
  };
  assert.equal(engine.spawn('deer',[8,4,8]),null);
  assert.deepEqual(engine.counts(),{total:1,awake:1});
  assert.equal(engine.checkpoint().next,1);
  assert.deepEqual(engine.all()[0].position,[9,4,8]);
  engine.dispose();
});
