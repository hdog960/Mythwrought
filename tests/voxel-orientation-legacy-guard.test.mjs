import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverOptionalOrientation} from '../src/voxel-orientation-recovery.mjs';
import {applyLegacyVoxelEdit} from '../src/voxel-orientation-legacy-guard.mjs';

test('old schema-1 load and same-ID replacement clear optional turns without save mutation',async()=>{
 const save={schema:1,edits:[[1,2,3,7]]},bytes=JSON.stringify(save);
 const world=new Map([['1,2,3',7]]);
 const read=(x,y,z)=>world.get([x,y,z].join(','))??0;
 const {sidecar}=recoverOptionalOrientation([{cell:[1,2,3],blockId:7,turns:3}],read);
 assert.equal(sidecar.get([1,2,3],7),3);
 assert.equal(await applyLegacyVoxelEdit({cell:[1,2,3],sidecar,readBlock:read,
  writeBlock:async(c,id)=>{world.set(c.join(','),id);return true;},nextId:7}),true);
 assert.equal(sidecar.get([1,2,3],7),0);
 assert.equal(JSON.stringify(save),bytes);
});
test('rejected edit preserves turns; rejected partial edit and thrown mutation invalidate',async()=>{
 const world=new Map([['0,0,0',7]]),read=(x,y,z)=>world.get([x,y,z].join(','));
 const {sidecar}=recoverOptionalOrientation([{cell:[0,0,0],blockId:7,turns:2}],read);
 const base={cell:[0,0,0],sidecar,readBlock:read,nextId:8};
 assert.equal(await applyLegacyVoxelEdit({...base,writeBlock:()=>false}),false);
 assert.equal(sidecar.get([0,0,0],7),2);
 assert.equal(await applyLegacyVoxelEdit({...base,writeBlock:()=>{world.set('0,0,0',8);return false;}}),false);
 assert.equal(sidecar.get([0,0,0],7),0);
 sidecar.set([0,0,0],8,1);
 await assert.rejects(applyLegacyVoxelEdit({...base,nextId:7,writeBlock:()=>{world.set('0,0,0',7);throw Error('disk');}}),/disk/);
 assert.equal(sidecar.size(),0);
});
test('invalid arguments do not invoke world writer',async()=>{
 let writes=0;
 await assert.rejects(applyLegacyVoxelEdit({cell:[1,2,NaN],sidecar:{invalidateEdit(){}},
 readBlock:()=>7,writeBlock:()=>{writes++;return true;},nextId:7}),TypeError);
 assert.equal(writes,0);
});
