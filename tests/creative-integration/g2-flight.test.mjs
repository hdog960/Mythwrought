import test from 'node:test';
import assert from 'node:assert/strict';
import {G2_FLIGHT_SPEEDS,G2_MAX_FRAME_SECONDS,createG2FlightState,
 armG2Flight,selectG2FlightProfile,planG2FlightStep,holdG2Flight}
 from '../../src/creative-integration/g2-flight.mjs';
const bounds={minFeet:-200,maxFeet:24};
const pos={x:0,y:6,z:0};
const host=Object.freeze({worldToken:'seed:179',isRegionReady:()=>true,
 isBodyClear:()=>true,sectionForY:y=>y<0?-1:0});
const start=()=>armG2Flight(createG2FlightState({position:pos,heightBounds:bounds,worldToken:'seed:179'}),
 {enabled:true,isRegionReady:host.isRegionReady,isBodyClear:host.isBodyClear});
const step=(s,intent={},override={})=>planG2FlightStep(s,{dt:.05,...intent},{...host,...override});
test('G2A starts feature-off, deeply immutable and without hidden world side effects',()=>{
 const s=createG2FlightState({position:pos,heightBounds:bounds,worldToken:'seed:179'});
 assert.equal(s.mode,'off');assert.equal(s.prefetch.pending.length,0);
 assert.ok(Object.isFrozen(s.position));assert.ok(Object.isFrozen(s.prefetch));
 assert.equal(planG2FlightStep(s,{dt:1},{}).state,s);
 assert.equal(armG2Flight(s,{enabled:false}).mode,'off');
});
test('G2A requires explicit real readiness AND complete player-body clearance before arming',()=>{
 const s=createG2FlightState({position:pos,heightBounds:bounds,worldToken:'seed:179'});
 assert.throws(()=>armG2Flight(s,{enabled:true}),/readiness/);
 assert.equal(armG2Flight(s,{enabled:true,isRegionReady:()=>false,isBodyClear:()=>true}).mode,'off');
 assert.equal(armG2Flight(s,{enabled:true,isRegionReady:()=>true,isBodyClear:()=>false}).mode,'off');
 assert.equal(start().mode,'flight');
});
test('G2A preserves exactly four distinct speed profiles',()=>{
 assert.deepEqual(G2_FLIGHT_SPEEDS,{precision:1.4,normal:4,fast:8,travel:15});
 for(const [name,speed] of Object.entries(G2_FLIGHT_SPEEDS)){
   const s=selectG2FlightProfile(start(),name);
   const p=step(s,{forward:1});
   assert.ok(Math.abs(p.state.position.z-speed*G2_MAX_FRAME_SECONDS)<1e-8,name);
   assert.equal(p.state.position.y,6);
 }
 assert.throws(()=>selectG2FlightProfile(start(),'turbo'),/unknown/);
});
test('G2A frame time caps at 50 ms and rejects non-finite or over-range inputs',()=>{
 assert.equal(step(start(),{forward:1,dt:100}).state.position.z,.2);
 for(const bad of [{forward:NaN},{vertical:Infinity},{forward:1.1},{yaw:NaN},{pitch:Infinity}])
   assert.throws(()=>step(start(),bad),/flight:/);
});
test('G2A diagonals including vertical motion normalize to selected speed',()=>{
 const p=step(start(),{forward:1,strafe:1,vertical:1}).state.position;
 const distance=Math.hypot(p.x,p.y-6,p.z);
 assert.ok(Math.abs(distance-0.2)<1e-8);
});
test('G2A yaw rotates flight but does not adjust vertical position',()=>{
 const p=step(start(),{forward:1,yaw:Math.PI/2}).state.position;
 assert.ok(Math.abs(p.x-.2)<1e-8);assert.ok(Math.abs(p.z)<1e-8);assert.equal(p.y,6);
});
test('G2A altitude bounds prevent unsafe overshoot, never clamp into a colliding surface',()=>{
 const s=armG2Flight(createG2FlightState({position:{x:0,y:23.95,z:0},
  heightBounds:bounds,worldToken:'seed:179'}),{enabled:true,isRegionReady:host.isRegionReady,isBodyClear:host.isBodyClear});
 const r=step(s,{vertical:1});
 assert.equal(r.state.blocked,true);assert.deepEqual(r.state.position,s.position);
 assert.match(r.state.reason,/altitude/);
});
test('G2A segment-checks full body collisions and preserves prior position',()=>{
 const out=step(start(),{forward:1},{isBodyClear:p=>p.z<.1});
 assert.equal(out.state.blocked,true);assert.equal(out.state.position.z,0);
 assert.match(out.state.reason,/Physical collision/);
});
test('G2A refuses unloaded regions and emits bounded plans, not actual chunk work',()=>{
 let count=0;
 const out=step(start(),{forward:1},{isRegionReady:p=>{count++;return p.z<.1;}});
 assert.ok(count>0);assert.equal(out.state.blocked,true);
 assert.equal(out.state.position.z,0);assert.ok(out.requests.length<=2);
 assert.ok(out.state.prefetch.pending.length<=6);assert.match(out.state.reason,/Unloaded/);
});
test('G2A cannot change worlds without blocking and keeping original position',()=>{
 const s=start(),r=step(s,{forward:1},{worldToken:'seed:different'});
 assert.equal(r.state.blocked,true);assert.equal(r.state.position.z,0);
 assert.deepEqual(r.requests,[]);assert.match(r.state.reason,/World changed/);
});
test('G2A demands collision, readiness and vertical section authorities',()=>{
 for(const key of ['isRegionReady','isBodyClear','sectionForY']){
  const bad={...host};delete bad[key];
  assert.throws(()=>planG2FlightStep(start(),{forward:1,dt:.05},bad),/reader required/);
 }
});
test('G2A explicit hold retains hover and clears pending prefetch without changing world',()=>{
 const flight=step(start(),{forward:1},{isRegionReady:p=>p.z<=0});
 const held=holdG2Flight(flight.state,'Foreground lost');
 assert.equal(held.mode,'flight');assert.equal(held.blocked,true);
 assert.equal(held.prefetch.pending.length,0);
 assert.equal(held.reason,'Foreground lost');assert.deepEqual(held.position,flight.state.position);
});
test('G2A malformed starting coordinates/bounds/tokens fail closed',()=>{
 for(const args of [
  {position:{x:Infinity,y:6,z:0},heightBounds:bounds,worldToken:'ok'},
  {position:pos,heightBounds:{minFeet:12,maxFeet:10},worldToken:'ok'},
  {position:pos,heightBounds:bounds,worldToken:''},
  {position:{x:0,y:50,z:0},heightBounds:bounds,worldToken:'ok'}])
  assert.throws(()=>createG2FlightState(args),/G2 flight/);
});
