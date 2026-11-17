import test from 'node:test';
import assert from 'node:assert/strict';
import {createG2ControlState,enterG2ControlOwnership,dispatchG2Control,
 readG2ControlIntent,clearG2Controls,resumeG2Controls,releaseG2ControlOwnership}
 from '../../src/creative-integration/g2-control-state.mjs';
const start=()=>enterG2ControlOwnership(createG2ControlState(),{featureEnabled:true,flightReady:true});
const ev=(s,type,more={})=>dispatchG2Control(s,{type,...more});
test('G2A owns no native DOM handlers and begins Explore-only with zero flight intent',()=>{
 const s=createG2ControlState();assert.equal(s.owner,'explore');assert.equal(s.paused,true);
 assert.equal(readG2ControlIntent(s).forward,0);assert.equal(readG2ControlIntent(s).vertical,0);
 assert.ok(Object.isFrozen(s));assert.ok(Object.isFrozen(s.controls));
});
test('G2A refuses flight-input capture without feature gate and verified arm',()=>{
 const s=createG2ControlState();
 assert.equal(enterG2ControlOwnership(s,{flightReady:true}).owner,'explore');
 assert.equal(enterG2ControlOwnership(s,{featureEnabled:true}).owner,'explore');
 assert.equal(start().owner,'creative-flight');
});
test('G2A two independent pointer owners cannot steal each other',()=>{
 let s=start();s=ev(s,'pointerdown',{zone:'move',id:1});
 s=ev(s,'pointerdown',{zone:'look',id:2});
 assert.equal(s.controls.pointers.length,2);
 const stolen=ev(s,'pointerdown',{zone:'move',id:9});
 assert.equal(stolen,s);
 const duplicate=ev(s,'pointerdown',{zone:'up',id:1});assert.equal(duplicate,s);
 s=ev(s,'pointermove',{id:1,x:.8,y:-1});
 s=ev(s,'pointermove',{id:2,x:.4,y:.2});
 assert.equal(readG2ControlIntent(s).forward,1);
 assert.equal(readG2ControlIntent(s).lookX,.4);
 assert.equal(readG2ControlIntent(s).strafe,.8);
});
test('G2A releases only the owning pad, preserving the other thumb',()=>{
 let s=start();
 s=ev(s,'pointerdown',{zone:'move',id:1});
 s=ev(s,'pointerdown',{zone:'look',id:2});
 s=ev(s,'pointermove',{id:1,x:.5,y:-.7});
 s=ev(s,'pointermove',{id:2,x:-.4,y:.2});
 s=ev(s,'pointerup',{id:1});
 assert.equal(readG2ControlIntent(s).forward,0);
 assert.equal(readG2ControlIntent(s).lookX,-.4);
 s=ev(s,'pointercancel',{id:2});
 assert.equal(readG2ControlIntent(s).lookX,0);
});
test('G2A held UP/DOWN separately affect vertical flight until finger release',()=>{
 let s=start();s=ev(s,'pointerdown',{zone:'up',id:10});
 assert.equal(readG2ControlIntent(s).vertical,1);
 s=ev(s,'pointerdown',{zone:'down',id:11});
 assert.equal(readG2ControlIntent(s).vertical,0);
 s=ev(s,'pointerup',{id:10});
 assert.equal(readG2ControlIntent(s).vertical,-1);
 s=ev(s,'pointercancel',{id:11});
 assert.equal(readG2ControlIntent(s).vertical,0);
});
test('G2A landing button is a request, never an unauthorized gravity transition',()=>{
 let s=start();s=ev(s,'pointerdown',{zone:'land',id:3});
 assert.equal(readG2ControlIntent(s).landRequested,true);
 assert.equal(s.owner,'creative-flight');
 assert.equal(releaseG2ControlOwnership(s,{landed:false}).owner,'creative-flight');
 s=ev(s,'pointerup',{id:3});assert.equal(readG2ControlIntent(s).landRequested,false);
});
test('G2A keyboard mappings never override native focus and can be cancelled',()=>{
 let s=start();
 s=ev(s,'key',{code:'KeyW',pressed:true});
 s=ev(s,'key',{code:'KeyE',pressed:true});
 assert.equal(readG2ControlIntent(s).forward,1);
 assert.equal(readG2ControlIntent(s).vertical,1);
 assert.equal(ev(s,'key',{code:'Delete',pressed:true}),s);
 s=ev(s,'key',{code:'KeyE',pressed:false});
 assert.equal(readG2ControlIntent(s).vertical,0);
});
test('G2A pointer IDs must be valid and move axes finite',()=>{
 let s=start();assert.equal(ev(s,'pointerdown',{zone:'move',id:-1}),s);
 s=ev(s,'pointerdown',{zone:'move',id:1});
 assert.throws(()=>ev(s,'pointermove',{id:1,x:NaN,y:0}),/invalid stick/);
 const after=ev(s,'pointermove',{id:1,x:3,y:-3});
 assert.deepEqual(after.controls.move,{x:1,y:-1});
});
test('G2A blur, hidden, contextloss, orientation and overlay cancel every held input',()=>{
 for(const type of ['blur','hidden','orientationchange','pointercancelall','contextlost','overlay-open','worldchange']){
  let s=start();s=ev(s,'pointerdown',{zone:'up',id:1});
  s=ev(s,'key',{code:'KeyW',pressed:true});
  s=ev(s,type);
  assert.equal(s.paused,true,type);assert.equal(s.controls.pointers.length,0,type);
  assert.equal(readG2ControlIntent(s).vertical,0,type);
  assert.equal(readG2ControlIntent(s).forward,0,type);
 }
});
test('G2A resume requires external flight safety and clears old inputs',()=>{
 let s=start();s=ev(s,'pointerdown',{zone:'move',id:1});
 s=ev(s,'pointermove',{id:1,x:1,y:1});s=clearG2Controls(s);
 assert.equal(resumeG2Controls(s,{flightStillSafe:false}),s);
 s=resumeG2Controls(s,{flightStillSafe:true});
 assert.equal(s.paused,false);assert.equal(readG2ControlIntent(s).strafe,0);
});
test('G2A only restores ordinary Explore ownership after verified landing',()=>{
 let s=start();s=releaseG2ControlOwnership(s,{landed:false});
 assert.equal(s.owner,'creative-flight');assert.equal(s.paused,true);
 s=releaseG2ControlOwnership(s,{landed:true});
 assert.equal(s.owner,'explore');assert.equal(s.controls.pointers.length,0);
});
