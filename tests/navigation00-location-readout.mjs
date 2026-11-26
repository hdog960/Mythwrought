import test from 'node:test';
import assert from 'node:assert/strict';
import {createNavigationLocationReadout as read} from '../src/navigation00/navigation-location-readout.mjs';
test('world coordinates remain unchanged and labels are legible',()=>{
  const p={x:-12.6,y:-210,z:4.3,yaw:0};const r=read(p);
  assert.deepEqual(r.coordinates,{x:-12.6,y:-210,z:4.3});
  assert.equal(r.coordinateLabel,'X -13  Y -210  Z 4');
  assert.equal(r.depthLabel,'Depth unknown');
  assert.equal(r.direction,'N');
});
test('heading wraps both directions and accepts game-supplied offset',()=>{
  assert.equal(read({x:0,y:0,z:0,yaw:-Math.PI/2}).direction,'W');
  assert.equal(read({x:0,y:0,z:0,yaw:2*Math.PI}).direction,'N');
  assert.equal(read({x:0,y:0,z:0,yaw:0},{headingOffset:90}).direction,'E');
});
test('depth is derived only from observed surface, never invented',()=>{
  const p={x:1,y:12,z:2,yaw:0};
  assert.equal(read(p,{surfaceY:30}).depth,18);
  assert.equal(read(p,{surfaceY:3}).depth,0);
});
test('rejects invalid inputs without modifying game state',()=>{
  const p={x:1,y:2,z:3,yaw:0};
  assert.throws(()=>read({...p,y:Infinity}));
  assert.throws(()=>read(p,{surfaceY:NaN}));
  assert.throws(()=>read(p,{decimals:10}));
  assert.throws(()=>read(p,{headingOffset:Infinity}));
  assert.deepEqual(p,{x:1,y:2,z:3,yaw:0});
});
