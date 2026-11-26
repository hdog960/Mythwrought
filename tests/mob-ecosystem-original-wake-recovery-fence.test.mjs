// Native-format original MobEngine lifecycle regression, synthetic source callbacks.
import test from 'node:test';
import assert from 'node:assert/strict';
import {MobEngine} from '../src/mobs/engine.mjs';
function fixture(kind,stage='stable'){
  let version=0,resident=true,armed=false,engine,id;
  const world={
    revision(){return version;},
    residentAt(p){if(armed&&stage==='resident-point')p[0]+=1;return resident;},
    volume(p){if(armed&&kind==='wake')change(p);return 'clear';},
    grounded(p){if(armed&&kind==='recover')change(p);return true;}
  };
  function change(p){
    armed=false;
    if(stage==='revision')version++;
    if(stage==='point')p[0]+=1;
    if(stage==='unload')resident=false;
    if(stage==='dispose')engine.dispose();
    if(stage==='remove')engine.transition(id,'removed');
    if(stage==='capacity')engine.spawn('deer',[12,4,8]);
    if(stage==='resident-point')armed=true;
    if(stage==='throw')throw Error('source failure');
  }
  engine=new MobEngine(world,179,{maxEntities:4,maxActive:1});
  id=engine.spawn('deer',[8,4,8],{dormant:kind==='wake'});
  if(kind==='recover')engine.damage(id,100,{recoverable:true});
  engine.drainEvents();armed=true;
  return {engine,id,world,attempt:()=>kind==='wake'?engine.transition(id,'idle'):engine.recover(id)};
}
for(const kind of ['wake','recover']){
  for(const stage of ['revision','point','unload','resident-point','dispose','remove','capacity']){
    test(kind+' rejects '+stage+' before publishing an awake slot',()=>{
      const {engine,id,attempt}=fixture(kind,stage);
      assert.equal(attempt(),false);
      const expected=stage==='capacity'?1:0;
      assert.equal(engine.counts().awake,expected);
      if(stage==='dispose'||stage==='remove')assert.equal(engine.get(id),undefined);
      else{
        const mob=engine.get(id);
        assert.equal(mob.state,kind==='wake'?'dormant':'downed');
        assert.deepEqual(mob.position,[8,4,8]);
        if(kind==='recover')assert.equal(mob.health,0);
      }
      assert.equal(engine.drainEvents().some(e=>e.id===id&&e.state==='idle'),false);
      engine.dispose();
    });
  }
  test(kind+' stable admission retains identity and awake count',()=>{
    const {engine,id,attempt}=fixture(kind);
    assert.equal(attempt(),true);
    assert.equal(engine.counts().awake,1);
    assert.equal(engine.get(id).state,'idle');
    assert.ok(engine.get(id).health>0);
    assert.equal(engine.drainEvents().filter(e=>e.id===id&&e.state==='idle').length,1);
    engine.dispose();
  });
  test(kind+' source exception preserves state and awake count',()=>{
    const {engine,id,attempt}=fixture(kind,'throw');
    assert.throws(attempt,/source failure/);
    assert.equal(engine.counts().awake,0);
    assert.equal(engine.get(id).state,kind==='wake'?'dormant':'downed');
    assert.deepEqual(engine.drainEvents(),[]);
    engine.dispose();
  });
  test(kind+' keeps legacy stable sources without optional hooks',()=>{
    const {engine,id,attempt,world}=fixture(kind);
    delete world.revision;delete world.residentAt;
    assert.equal(attempt(),true);
    assert.equal(engine.get(id).state,'idle');
    engine.dispose();
  });
}
