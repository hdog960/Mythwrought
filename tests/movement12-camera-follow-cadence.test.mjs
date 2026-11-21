import test from 'node:test';
import assert from 'node:assert/strict';
import {auditCameraFollowTrace as audit} from '../src/movement12/camera-follow-audit.mjs';
for(const fps of [30,60,120]){
 test(`constant-speed follow at ${fps} FPS`,()=>{
  const s=Array.from({length:12},(_,i)=>({time:i/fps,player:{x:2*i/fps,y:1,z:0},camera:{x:2*i/fps,y:1,z:0}}));
  assert.equal(audit(s).safe,true);
 });
 test(`acceleration spike at ${fps} FPS`,()=>{
  const s=Array.from({length:12},(_,i)=>({time:i/fps,player:{x:0,y:0,z:0},camera:{x:0,y:0,z:0}}));
  s[6].camera.x=0.2;
  assert.equal(audit(s,{maxLag:1,maxJerk:250}).reason,'camera-acceleration-spike');
 });
}
test('unequal intervals use velocity midpoint separation',()=>{
 const times=[0,0.01,0.05,0.06];
 const s=times.map((t,i)=>({time:t,player:{x:[0,0.0001,0.0041,0.0061][i],y:0,z:0},camera:{x:[0,0.0001,0.0041,0.0061][i],y:0,z:0}}));
 assert.equal(audit(s,{maxJerk:4.1}).safe,true);
 assert.equal(audit(s,{maxJerk:3.9}).reason,'camera-acceleration-spike');
});
test('reversed uneven intervals yield same acceleration',()=>{
 const s=[0,0.04,0.05].map((t,i)=>({time:t,player:{x:[0,0.004,0.006][i],y:0,z:0},camera:{x:[0,0.004,0.006][i],y:0,z:0}}));
 assert.equal(audit(s,{maxJerk:4.1}).safe,true);
 assert.equal(audit(s,{maxJerk:3.9}).reason,'camera-acceleration-spike');
});
