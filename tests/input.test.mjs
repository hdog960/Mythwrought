import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizedStick,safePointerDelta,stickLookDelta,selectedLookMode,isWorldControlTarget} from '../src/input.mjs';

test('touch deadzone prevents resting-finger drift',()=>{
  assert.deepEqual(normalizedStick(0,0,44),{x:0,y:0});
  assert.deepEqual(normalizedStick(2,1,44),{x:0,y:0});
  assert.deepEqual(normalizedStick(-2,0,44),{x:0,y:0});
});
test('stick is radially clamped and never faster diagonally',()=>{
  for(const [x,y] of [[0,100],[100,0],[-100,-100],[23,23],[-37,9]]){
    const v=normalizedStick(x,y,45);
    assert.ok(Math.hypot(v.x,v.y)<=1+1e-12);
  }
  assert.deepEqual(normalizedStick(90,0,40),{x:1,y:0});
  assert.throws(()=>normalizedStick(0,0,0));
});
test('pointer deltas filter jitter and cap sudden focus jumps',()=>{
  assert.deepEqual(safePointerDelta(.1,-.1),{x:0,y:0});
  assert.deepEqual(safePointerDelta(12,-4),{x:12,y:-4});
  const d=safePointerDelta(1000,1200);
  assert.ok(Math.abs(Math.hypot(d.x,d.y)-58)<1e-9);
  assert.throws(()=>safePointerDelta(Infinity,0));
});
test('stick camera rate uses time-based speed with bounded frame delta',()=>{
  const a=stickLookDelta({x:1,y:-1},.016);
  const b=stickLookDelta({x:1,y:-1},.032);
  assert.ok(Math.abs(b.x-2*a.x)<1e-10);
  assert.ok(stickLookDelta({x:1,y:1},10).x<=185*.05);
});
test('look mode and keyboard focus gracefully ignore invalid controls',()=>{
  assert.equal(selectedLookMode('stick'),'stick');
  assert.equal(selectedLookMode('swipe'),'swipe');
  assert.equal(selectedLookMode('bad'),'swipe');
  assert.equal(isWorldControlTarget({tagName:'INPUT'}),false);
  assert.equal(isWorldControlTarget({tagName:'DIV',isContentEditable:true}),false);
  assert.equal(isWorldControlTarget({tagName:'CANVAS'}),true);
});

import {MAX_PITCH,clampLook,forwardVector} from '../src/camera.mjs';
test('builder can aim almost straight down and up without crossing the vertical singularity',()=>{
  assert.ok(MAX_PITCH>1.54&&MAX_PITCH<Math.PI/2);
  const down=clampLook(0,0,0,2000);
  assert.equal(down.pitch,-MAX_PITCH);
  assert.ok(forwardVector(down.yaw,down.pitch)[1]<-.999,'Downward ray should reach blocks directly beneath the player');
  assert.equal(clampLook(0,0,0,-2000).pitch,MAX_PITCH);
  assert.equal(clampLook(0,down.pitch,0,500).pitch,-MAX_PITCH,'Pitch cannot flip after over-drag');
  assert.ok(forwardVector(0,down.pitch).every(Number.isFinite));
});
