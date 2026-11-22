import test from 'node:test';
import assert from 'node:assert/strict';
import {captureOriginalGlobalCensusFence,assertOriginalGlobalCensusFenceUnchanged}
  from '../src/mobs/ecosystem-global-census-fence.mjs';

const deer=()=>({id:'d',species:{id:'deer'},yaw:0,state:'idle',health:10,
  grounded:true,homeChunk:'0,0,0',important:false,juvenile:false,
  motionMode:'walk',position:[9,4,8],velocity:[0,0,0],origin:[9,4,8]});
function setup(){let entities=[deer()],rev=0;
  return {engine:{all:()=>entities},world:{revision:()=>rev},
    setRevision:n=>rev=n,setMobs:next=>entities=next,getMobs:()=>entities};}

test('frozen source census ticket accepts stable original shape',()=>{
  const h=setup(),t=captureOriginalGlobalCensusFence(h);
  assert.ok(Object.isFrozen(t));assert.equal(t.revision,0);
  assert.equal(assertOriginalGlobalCensusFenceUnchanged(t,h),true);
});
test('first region callback changing edit revision must fail closed',()=>{
  const h=setup(),t=captureOriginalGlobalCensusFence(h);
  h.setRevision(1);
  assert.throws(()=>assertOriginalGlobalCensusFenceUnchanged(t,h),/Original world changed/);
});
test('source roster mutation without edit revision must fail closed',()=>{
  const h=setup(),t=captureOriginalGlobalCensusFence(h);
  h.getMobs()[0].health=2;
  assert.throws(()=>assertOriginalGlobalCensusFenceUnchanged(t,h),/roster changed/);
});
test('revision callback cannot change MobEngine roster during baseline',()=>{
  const h=setup();h.world.revision=()=>{h.getMobs()[0].state='dormant';return 0;};
  assert.throws(()=>captureOriginalGlobalCensusFence(h),/roster changed/);
});
test('source engine roster callback cannot change world after baseline',()=>{
  const h=setup();let rev=0,reads=0;h.world.revision=()=>rev;
  h.engine.all=()=>{if(++reads===2)rev++;return h.getMobs();};
  assert.throws(()=>captureOriginalGlobalCensusFence(h),/Original world changed/);
});
test('source mutations while asserting cannot create stable baseline',()=>{
  const h=setup(),t=captureOriginalGlobalCensusFence(h);let n=0;
  h.engine.all=()=>{if(++n===1)h.setRevision(1);return h.getMobs();};
  assert.throws(()=>assertOriginalGlobalCensusFenceUnchanged(t,h),/Original world changed/);
});
test('forged and cross-owner census tickets refused',()=>{
  const h=setup(),t=captureOriginalGlobalCensusFence(h);
  assert.throws(()=>assertOriginalGlobalCensusFenceUnchanged(Object.freeze({revision:0}),h),/Uncertified/);
  assert.throws(()=>assertOriginalGlobalCensusFenceUnchanged(t,{engine:{all:()=>[]},world:h.world}),/Uncertified/);
  assert.throws(()=>assertOriginalGlobalCensusFenceUnchanged(t,{engine:h.engine,world:{revision:()=>0}}),/Uncertified/);
});
test('invalid revision and malformed source roster remain prohibited',()=>{
  const h=setup();h.setRevision(-1);
  assert.throws(()=>captureOriginalGlobalCensusFence(h),/Invalid original world revision/);
  h.setRevision(0);h.setMobs([{id:'broken'}]);
  assert.throws(()=>captureOriginalGlobalCensusFence(h),/Invalid original MobEngine snapshot identity/);
});
test('original 128 MobEngine entity fence remains intact',()=>{
  const h=setup(),many=Array.from({length:129},(_,i)=>({...deer(),id:'mob'+i}));
  h.setMobs(many);
  assert.throws(()=>captureOriginalGlobalCensusFence(h),/Invalid original MobEngine roster size/);
});
