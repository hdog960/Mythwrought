import test from 'node:test';
import assert from 'node:assert/strict';
import {firstSolidVoxel,pickEnvironmentWithoutWall} from '../../src/nonblock-environments24/occlusion.mjs';
const clear=()=>false;
test('read-only occlusion sees solid blocks and player edits before candidate object',()=>{
 const s={pick:()=>({instanceKey:'candidate',distance:4})};
 assert.equal(pickEnvironmentWithoutWall(s,[0.5,0.5,0.5],[1,0,0],6,(x)=>x===2,clear),null);
 assert.equal(pickEnvironmentWithoutWall(s,[0.5,0.5,0.5],[1,0,0],6,clear,(x)=>x===2),null);
 assert.equal(pickEnvironmentWithoutWall(s,[0.5,0.5,0.5],[1,0,0],6,clear,clear).instanceKey,'candidate');
});
test('negative rays and origin-occupied voxels fail closed',()=>{
 assert.deepEqual(firstSolidVoxel([3.5,0.5,0.5],[-2,0,0],5,(x)=>x===1,clear).cell,[1,0,0]);
 assert.equal(firstSolidVoxel([0.5,0.5,0.5],[1,0,0],5,(x)=>x===0,clear).distance,0);
});
test('corner-touching occupied cells cannot be bypassed',()=>{
 const hit=firstSolidVoxel([0.5,0.5,0.5],[1,1,0],5,(x,y)=>x===1&&y===0,clear);
 assert.deepEqual(hit.cell,[1,0,0]);
});
test('invalid rays and missing world callbacks reject',()=>{
 assert.throws(()=>firstSolidVoxel([0,0,0],[0,0,0],4,clear,clear));
 assert.throws(()=>firstSolidVoxel([0,0,0],[1,0,0],129,clear,clear));
 assert.throws(()=>firstSolidVoxel([0,0,0],[1,0,0],4,null,clear));
});

test('foreign picker cannot extend reach or smuggle malformed hits',()=>{
 const pick=distance=>({pick:()=>({instanceKey:'object',distance})});
 const origin=[0.5,0.5,0.5],direction=[1,0,0];
 for(const distance of [-1,NaN,Infinity,4.001])
  assert.equal(pickEnvironmentWithoutWall(pick(distance),origin,direction,4,clear,clear),null);
 assert.equal(pickEnvironmentWithoutWall(pick(4),origin,direction,4,clear,clear).instanceKey,'object');
 assert.equal(pickEnvironmentWithoutWall(pick(4),origin,direction,4,(x)=>x===4,clear),null);
 assert.equal(pickEnvironmentWithoutWall(pick(0),origin,direction,4,(x)=>x===0,clear),null);
 assert.throws(()=>pickEnvironmentWithoutWall(pick(1),origin,[0,0,0],4,clear,clear));
 assert.throws(()=>pickEnvironmentWithoutWall({pick:()=>null},origin,direction,129,clear,clear));
 assert.throws(()=>pickEnvironmentWithoutWall(pick(1),origin,direction,4,null,clear));
});
