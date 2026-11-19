import test from 'node:test';
import assert from 'node:assert/strict';
import {makeOrientationSidecar,restoreOrientationSidecar} from '../src/voxel-orientation-sidecar.mjs';
import {makeOrientationEditGuard} from '../src/voxel-orientation-edit-guard.mjs';

function loadLegacySave(payload) {
  assert.equal(payload.schema,1);
  const world=new Map(payload.edits.map(([x,y,z,id])=>[[x,y,z].join(','),id]));
  const read=(x,y,z)=>world.get([x,y,z].join(','))??0;
  return {world,read,save:()=>({schema:1,edits:[...world].map(([key,id])=>[...key.split(',').map(Number),id])})};
}

test('old schema-1 save recovers without any orientation metadata or payload migration',()=>{
  const original={schema:1,edits:[[2,-4,8,7],[3,-4,8,8]]};
  const bytes=JSON.stringify(original),loaded=loadLegacySave(JSON.parse(bytes));
  const orientation=restoreOrientationSidecar([],loaded.read);
  assert.equal(orientation.size(),0);
  assert.equal(orientation.get([2,-4,8],7),0);
  assert.equal(JSON.stringify(loaded.save()),bytes);
});

test('sidecar restore drops stale cell identity and preserves only matching rotations',()=>{
  const loaded=loadLegacySave({schema:1,edits:[[2,0,0,7],[3,0,0,8]]});
  const sidecar=restoreOrientationSidecar([
    {cell:[2,0,0],blockId:7,turns:3},
    {cell:[3,0,0],blockId:7,turns:2},
    {cell:[4,0,0],blockId:8,turns:1}
  ],loaded.read);
  assert.deepEqual(sidecar.snapshot(loaded.read),[{cell:[2,0,0],blockId:7,turns:3}]);
  const guard=makeOrientationEditGuard({readBlock:loaded.read,sidecar,
    writeBlock(x,y,z,id){loaded.world.set([x,y,z].join(','),id);return true;}});
  assert.equal(guard.edit([2,0,0],8,{expectedId:7}).applied,true);
  assert.deepEqual(sidecar.snapshot(loaded.read),[]);
  assert.deepEqual(loaded.save(),{schema:1,edits:[[2,0,0,8],[3,0,0,8]]});
});

test('failed stale edit does not destroy restored rotation; subsequent successful edit does',()=>{
  const loaded=loadLegacySave({schema:1,edits:[[0,0,0,8]]});
  const sidecar=makeOrientationSidecar([{cell:[0,0,0],blockId:8,turns:3}]);
  const guard=makeOrientationEditGuard({readBlock:loaded.read,sidecar,
    writeBlock(x,y,z,id){loaded.world.set([x,y,z].join(','),id);return true;}});
  assert.equal(guard.edit([0,0,0],7,{expectedId:7}).reason,'stale');
  assert.equal(sidecar.get([0,0,0],8),3);
  assert.equal(guard.edit([0,0,0],7,{expectedId:8}).applied,true);
  assert.equal(sidecar.size(),0);
});
