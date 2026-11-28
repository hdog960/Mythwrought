import test from 'node:test';
import assert from 'node:assert/strict';
import {createLavaSteam,STEAM_MATERIAL} from '../../../src/liquids/lava/content/steam.mjs';
const event=(sequence,over={})=>({kind:'lava-quench',committed:true,sequence,x:0,y:0,z:0,steamUnits:2,...over});
const make=(over={})=>createLavaSteam({isVisible:()=>true,...over});
test('committed quench only; invalid batch is atomic',()=>{
  const s=make();assert.throws(()=>s.ingest([event(1),event(2,{committed:false})]),TypeError);
  assert.deepEqual(s.stats(),{active:0,lastSequence:0});
  assert.throws(()=>s.ingest([event(2),event(1)]),TypeError);
  assert.throws(()=>s.ingest([event(1,{steamUnits:9})]),TypeError);
  assert.equal(s.ingest([event(1)]).emitted,4);
});
test('replay and initial watermark cannot emit twice',()=>{
  const s=make({initialSequence:4});assert.equal(s.ingest([event(3),event(4),event(5)]).duplicates,2);
  s.clear();assert.equal(s.ingest([event(5)]).emitted,0);assert.equal(s.stats().lastSequence,5);
});
test('particle and event budgets drop visual overflow without backlog',()=>{
  const s=make({maxParticles:5,maxEvents:2});
  assert.deepEqual(s.ingest([event(1),event(2)]),{emitted:5,dropped:3,duplicates:0,active:5});
  assert.throws(()=>s.ingest([event(3),event(4),event(5)]),RangeError);
  assert.equal(s.advance(24),0);assert.equal(s.ingest([event(2)]).emitted,0);
  assert.equal(s.ingest([event(3)]).emitted,4);
});
test('deterministic camera-relative packed samples rise, expand and fade',()=>{
  const x=2**40,a=make(),b=make();const e=event(4294967297,{x});
  a.ingest([e]);b.ingest([e]);const origin=[x,0,0],before=a.sample(origin);
  assert.deepEqual(before,b.sample(origin));assert.equal(before.stride,5);assert.equal(before.count,4);
  a.advance(5);b.advance(5);const after=a.sample(origin);assert.deepEqual(after,b.sample(origin));
  for(let i=0;i<after.count;i++){const j=i*5;assert.ok(after.data[j+1]>before.data[j+1]);assert.ok(after.data[j+3]>before.data[j+3]);assert.ok(after.data[j+4]<before.data[j+4]);}
  assert.equal(a.sample([0,0,0]).count,0);assert.equal(a.advance(19),0);
});
test('visibility suppresses unloaded/occluded particles and no replay on reload',()=>{
  let visible=false;const s=make({isVisible:()=>visible});assert.equal(s.ingest([event(1)]).dropped,4);
  visible=true;assert.equal(s.ingest([event(1)]).emitted,0);s.ingest([event(2)]);
  visible=false;assert.equal(s.sample([0,0,0]).count,0);assert.equal(s.advance(1),0);
  visible=true;assert.equal(s.sample([0,0,0]).count,0);
});
test('physical ceiling clips rising particles and invalid event bounds reject',()=>{
  const s=make();assert.throws(()=>s.ingest([event(1,{y:257})]),TypeError);
  s.ingest([event(1,{y:256})]);assert.equal(s.sample([0,256,0]).count,4);
  assert.equal(s.advance(10),0);
});
test('callback faults leave event watermark and existing particles unchanged',()=>{
  let fail=false;const s=make({isVisible:x=>{if(fail&&x===1)throw Error('visibility');return true;}});
  s.ingest([event(1)]);const before=s.stats();fail=true;
  assert.throws(()=>s.ingest([event(2),event(3,{x:1})]),/visibility/);assert.deepEqual(s.stats(),before);
  fail=false;assert.equal(s.ingest([event(2),event(3,{x:1})]).emitted,8);
});
test('presentation material and maximum packed buffer budget',()=>{
  const s=make({maxParticles:256,particlesPerUnit:4});s.ingest(Array.from({length:8},(_,i)=>event(i+1,{steamUnits:8})));
  assert.equal(s.sample([0,0,0]).data.byteLength,5120);
  assert.equal(STEAM_MATERIAL.depthWrite,false);assert.equal(STEAM_MATERIAL.depthTest,true);assert.equal(STEAM_MATERIAL.blend,'straight-alpha');
  assert.throws(()=>make({maxParticles:257}),RangeError);assert.throws(()=>s.advance(121),RangeError);
});
