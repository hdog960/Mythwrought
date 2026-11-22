import test from 'node:test';
import assert from 'node:assert/strict';
import {createG2FlightState,armG2Flight,selectG2FlightProfile}
  from '../../src/creative-integration/g2-flight.mjs';
import {createSkyPrefetchState} from '../../src/floating-islands/sky-creative-bridge.mjs';
import {planNativeG2SkyStep} from '../../src/floating-islands/sky-native-g2.mjs';
const token='seed179#0';
const point=(x,y,z)=>({x,y,z});
const active=()=>selectG2FlightProfile(armG2Flight(
  createG2FlightState({position:point(0,35.5,0),
    heightBounds:{minFeet:-210,maxFeet:256},worldToken:token}),
  {enabled:true,isRegionReady:()=>true,isBodyClear:()=>true}),'travel');
function run(extra={}){
  return planNativeG2SkyStep({g2State:active(),intent:{dt:.05,strafe:1,forward:0,vertical:0,yaw:0,pitch:0},
    skyPrefetchState:createSkyPrefetchState(token),worldToken:token,
    readCurrentWorldToken:()=>token,isBaseRegionReady:()=>true,
    isBaseBodyClear:()=>true,isSkyResident:()=>true,isSkyBodyClear:()=>true,...extra});
}
test('original G2 travel profile steps by exactly 0.75m',()=>{
  const r=run();assert.equal(r.approved,true);assert.equal(r.position.x,.75);
  assert.equal(r.skyRequests.length,0);assert.equal(r.worldWrites,0);
});
test('real upper section missing at start refuses movement and requests upper namespace',()=>{
  const r=run({isSkyResident:()=>false});
  assert.equal(r.approved,false);
  assert.equal(r.position.x,0);
  assert.ok(r.skyRequests.every(p=>p.key.startsWith('sky:')));
});
test('original G2 cannot move through source physical obstruction',()=>{
  const r=run({isSkyBodyClear:p=>p.x<.3});
  assert.equal(r.approved,false);assert.equal(r.position.x,0);
});
test('stale world identity stops original G2 and never advances player',()=>{
  const r=run({readCurrentWorldToken:()=> 'seed2026#2'});
  assert.equal(r.approved,false);assert.equal(r.position.x,0);
});
test('prefetch region does not fabricate native 0-section GPU requests',()=>{
  const r=run({isSkyResident:()=>false,skyPrefetchPoints:[point(16.5,35.5,0)]});
  assert.equal(r.approved,false);
  assert.equal(r.nativeRequests.length,0);
  assert.ok(r.skyRequests.length<=2);
});
