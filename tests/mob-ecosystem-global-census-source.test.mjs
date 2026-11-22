// Source-native original MobEngine integration, no live PopulationManager edits.
// This test must execute in an authentic full MYTHWROUGHT checkout.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
import {createGlobalEcologyClock,previewGlobalEcologySelection}
  from '../src/mobs/ecosystem-global-clock.mjs';
import {prepareGlobalMobTick}
  from '../src/mobs/ecosystem-global-preflight.mjs';

const normalRegion=()=>({cx:0,cz:0,section:0,feet:4});
function world(){
  let revision=0;
  return {
    revision(){return revision;},
    edit(){revision++;},
    residentAt(){return true;},
    volume(point){return point[1]<4?'solid':'clear';},
    grounded(point){return point[1]>=4&&point[1]<4.04;},
    environment(){return {biome:'meadow',light:.8,hazard:false};},
    medium(){return 'air';}
  };
}
function harness(){
  const w=world(),engine=new MobEngine(w,179,{maxEntities:32,maxActive:8});
  const id=engine.spawn('deer',[9,4,8]);
  assert.ok(id,'original source MobEngine must admit a deer');
  const clock=createGlobalEcologyClock(),observer=[8,4,8];
  const args=region=>({clock,seconds:.5,regions:[region],engine,
    world:w,seed:179,observer,biome:'meadow',light:.8});
  return {w,engine,id,clock,observer,args};
}
function mutationRegion(mutator,readAt=5){
  let reads=0;
  return {get cx(){if(++reads===readAt)mutator();return 0;},
    cz:0,section:0,feet:4};
}

test('original source world edit during second region preview cannot establish late revision baseline',()=>{
  const h=harness();
  assert.throws(()=>prepareGlobalMobTick(h.args(mutationRegion(()=>h.w.edit()))),
    /Original world changed during regional poll/);
  assert.equal(h.w.revision(),1);
  assert.equal(h.engine.get(h.id).state,'idle');
  assert.equal(previewGlobalEcologySelection(h.clock,{
    seconds:.5,regions:[normalRegion()]
  }).reason,'selected','failed preflight must not consume original clock');
  h.engine.dispose();
});

test('MobEngine roster changed between original global reconcile and regional poll is rejected',()=>{
  const h=harness();
  const selected=mutationRegion(()=>h.engine.transition(h.id,'dormant'));
  assert.throws(()=>prepareGlobalMobTick(h.args(selected)),
    /Original MobEngine roster changed during inspection/);
  assert.equal(h.engine.get(h.id).state,'dormant',
    'Read-only research must not undo original-engine callback changes');
  assert.equal(previewGlobalEcologySelection(h.clock,{
    seconds:.5,regions:[normalRegion()]
  }).reason,'selected');
  h.engine.dispose();
});

test('original source first region getter edit refuses before any regional poll',()=>{
  const h=harness();
  assert.throws(()=>prepareGlobalMobTick(h.args(mutationRegion(()=>h.w.edit(),1))),
    /Original world changed during regional poll/);
  assert.equal(previewGlobalEcologySelection(h.clock,{
    seconds:.5,regions:[normalRegion()]
  }).reason,'selected');
  h.engine.dispose();
});

test('source original MobEngine stable global selection keeps first-visit cooldown',()=>{
  const h=harness();
  const result=prepareGlobalMobTick(h.args(normalRegion()));
  assert.equal(result.reason,'selected');
  assert.equal(result.kind,'cooldown');
  assert.equal(result.attempts,0);
  assert.equal(h.engine.get(h.id).state,'idle');
  h.engine.dispose();
});

test('original clock interval avoids new full-roster scanning',()=>{
  const h=harness();
  let calls=0;
  const engine={all(){calls++;throw Error('No not-due roster scan');}};
  const w={revision(){calls++;throw Error('No not-due world revision scan');}};
  const result=prepareGlobalMobTick({...h.args(normalRegion()),
    engine,world:w,seconds:.1});
  assert.equal(result.reason,'interval');
  assert.equal(calls,0);
  h.engine.dispose();
});
