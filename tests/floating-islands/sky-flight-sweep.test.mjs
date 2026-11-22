import test from 'node:test';
import assert from 'node:assert/strict';
import {planSweptSkyFlight,SKY_SWEEP_MAX_METERS} from '../../src/floating-islands/sky-flight-sweep.mjs';
const point=(x,y,z)=>({x,y,z});
const run=(from,to,certifyPoint=()=>({safe:true}),other={})=>planSweptSkyFlight({
  from,to,worldToken:'seed179#3',expectedWorldToken:'seed179#3',certifyPoint,...other});
test('original G2 15-block travel in 50ms remains under safe swept budget',()=>{
  const a=run(point(0,35,0),point(.75,35,0));
  assert.equal(a.approved,true);assert.equal(a.samples,4);assert.equal(a.position.x,.75);
  assert.ok(SKY_SWEEP_MAX_METERS>=.75);
});
test('missing vertical sky section blocks the entire move, no partial motion',()=>{
  const a=run(point(0,35.7,0),point(0,36.2,0),p=>
    p.y>=36?{safe:false,reason:'Sky section not resident'}:{safe:true});
  assert.equal(a.approved,false);assert.equal(a.position.y,35.7);
  assert.match(a.reason,/not resident/);
});
test('sideways crossing x=16 at negative-z chunk seam cannot clip through world',()=>{
  const a=run(point(15.8,180,-.1),point(16.4,180,-.1),p=>
    p.x>=16?{safe:false,reason:'Physical island body collision'}:{safe:true});
  assert.equal(a.approved,false);assert.equal(a.position.x,15.8);
});
test('start point is checked again after changes to a mined or placed sky block',()=>{
  let calls=0;
  const a=run(point(4,100,4),point(4.1,100,4),()=>{calls++;return {safe:false,reason:'Body edited into obstruction'};});
  assert.equal(a.approved,false);assert.equal(calls,1);assert.equal(a.samples,1);
});
test('world change blocks before calling any obsolete source callback',()=>{
  let calls=0;
  const a=run(point(0,70,0),point(0,70.1,0),()=>{calls++;return {safe:true};},
    {worldToken:'seed2026#1'});
  assert.equal(a.approved,false);assert.equal(calls,0);
});
test('oversized per-frame teleport is refused without expensive sampling',()=>{
  let calls=0;
  const a=run(point(0,60,0),point(10000,60,0),()=>{calls++;return {safe:true};});
  assert.equal(a.approved,false);assert.equal(calls,0);
});
test('physical host throw blocks movement without consuming more time',()=>{
  const a=run(point(5,41,5),point(5,41.25,5),()=>{throw new Error('GPU lost');});
  assert.equal(a.approved,false);assert.match(a.reason,/source threw/);
});
test('no-op flight still requires one safe body certification',()=>{
  let calls=0;
  const a=run(point(12000,240,-13000),point(12000,240,-13000),()=>{calls++;return {safe:true};});
  assert.equal(a.approved,true);assert.equal(a.changed,false);assert.ok(calls>=1);
});
test('diagonal near world coordinate 10k is deterministic and bounded',()=>{
  const pos=point(12004.5,180.2,-12040.5),to=point(12004.8,180.55,-12040.6);
  const a=run(pos,to),b=run(pos,to);
  assert.deepEqual(a,b);assert.equal(a.approved,true);assert.ok(a.samples<=5);
});
test('unsafe input and oversized step are not silently clamped',()=>{
  assert.throws(()=>run(point(NaN,20,0),point(0,20,0)),/finite/);
  assert.throws(()=>run(point(0,20,0),point(1,20,0),()=>({safe:true}),{step:.5}),/finite/);
});
test('world changes mid-sweep after first physical callback, so old G2 move is blocked',()=>{
  let token='seed179#3',calls=0;
  const a=run(point(4,90,4),point(4.5,90,4),()=>{
    calls++;if(calls===2)token='seed2026#4';return {safe:true};
  },{readCurrentWorldToken:()=>token});
  assert.equal(a.approved,false);assert.equal(a.position.x,4);
  assert.match(a.reason,/World changed during/);
});
test('active source identity is revalidated at every swept point',()=>{
  let checks=0;
  const a=run(point(0,35,0),point(0,35.5,0),()=>({safe:true}),
    {readCurrentWorldToken:()=>{checks++;return 'seed179#3';}});
  assert.equal(a.approved,true);assert.ok(checks>=6);
});
