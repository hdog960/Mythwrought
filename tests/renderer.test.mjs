import test from 'node:test';
import assert from 'node:assert/strict';
import {clampLook,forwardVector,compassDegrees,MAX_PITCH} from '../src/camera.mjs';
import {SKY_VERTEX_SHADER,SKY_FRAGMENT_SHADER,DISTANCE_FOG_COLOR} from '../src/sky.mjs';

test('camera horizontal/vertical look maintains finite bounded angles on large touches',()=>{
  const p=clampLook(Math.PI,-.1,200,1000,1.5);
  assert.ok(p.yaw>=-Math.PI&&p.yaw<Math.PI);
  assert.equal(p.pitch,-MAX_PITCH);
  assert.equal(clampLook(0,0,0,-1000).pitch,MAX_PITCH);
  assert.throws(()=>clampLook(0,0,NaN,1));
});
test('camera scales input sensitivity and preserves correct compass headings',()=>{
  const slow=clampLook(0,0,40,0,.5),fast=clampLook(0,0,40,0,1.8);
  assert.ok(fast.yaw>slow.yaw);
  assert.equal(compassDegrees(Math.PI),0);
  assert.equal(compassDegrees(0),180);
  assert.equal(compassDegrees(Math.PI/2),90);
});
test('forward direction is unit length and tracks pitch',()=>{
  for(const yaw of [-6,-3,0,.4,2])for(const pitch of [-1.3,0,1.3]){
    const v=forwardVector(yaw,pitch);
    assert.ok(Math.abs(Math.hypot(...v)-1)<1e-12);
    assert.ok(Math.abs(v[1]-Math.sin(pitch))<1e-12);
  }
});
test('procedural sky GLSL exposes a real fullscreen renderer',()=>{
  assert.match(SKY_VERTEX_SHADER,/gl_VertexID/);
  assert.match(SKY_FRAGMENT_SHADER,/gl_FragCoord/);
  assert.match(SKY_FRAGMENT_SHADER,/uResolution/);
  assert.deepEqual(DISTANCE_FOG_COLOR.length,3);
});
