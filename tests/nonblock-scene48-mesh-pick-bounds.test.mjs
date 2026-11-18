import test from 'node:test';
import assert from 'node:assert/strict';
import {meshSelectionBounds} from '../src/nonblock-scene48/mesh-pick-bounds.mjs';
import {describeNonblockObject,NONBLOCK_FAMILY_IDS} from '../src/nonblock-scene48/nonblock-object-v1.mjs';
test('all eight family selection volumes enclose every authored mesh vertex',()=>{
 for(const sceneId of NONBLOCK_FAMILY_IDS){
  const o=describeNonblockObject({sceneId,seed:17,anchor:[3,0,-4]});
  const b=meshSelectionBounds(o.render.mesh,o.anchor);
  assert.equal(o.render.mesh.positions.length,o.render.triangleCount*9);
  for(let i=0;i<o.render.mesh.positions.length;i+=3)for(let k=0;k<3;k++){
   const v=o.anchor[k]+o.render.mesh.positions[i+k];
   assert.ok(v>=b.min[k]-1e-6&&v<=b.max[k]+1e-6,sceneId+' vertex outside '+k);
  }
 }
});
test('rotation and scale produce bounded conservative envelope',()=>{
 const mesh={positions:new Float32Array([0,0,0,1,0,0,0,1,0])};
 const b=meshSelectionBounds(mesh,[2,3,4],{yaw:Math.PI/2,scale:1.5});
 assert.ok(b.min[2]>=4&&b.max[2]>=5.5-1e-6);
 assert.ok(b.max[1]>=4.5);
});
test('nonfinite geometry and invalid scale fail closed',()=>{
 assert.throws(()=>meshSelectionBounds({positions:new Float32Array([NaN,0,0,0,0,0,0,0,0])},[0,0,0]),/nonfinite/);
 assert.throws(()=>meshSelectionBounds({positions:new Float32Array(9)},[0,0,0],{scale:0}),/invalid/);
});
