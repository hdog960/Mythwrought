import test from 'node:test';
import assert from 'node:assert/strict';
import {makeOrientationSidecar} from '../src/voxel-orientation-sidecar.mjs';
import {makeOrientationEditGuard} from '../src/voxel-orientation-edit-guard.mjs';

function fixture() {
 const world=new Map([['-2,3,4',8],['1,0,0',7]]);
 const sidecar=makeOrientationSidecar();
 sidecar.set([-2,3,4],8,3);sidecar.set([1,0,0],7,2);
 let writes=0,allowed=true;
 const readBlock=(x,y,z)=>world.get([x,y,z].join(','))??0;
 const guard=makeOrientationEditGuard({readBlock,sidecar,
  writeBlock(x,y,z,id){writes++;if(!allowed)return false;world.set([x,y,z].join(','),id);return true;}});
 return {world,sidecar,guard,readBlock,writes:()=>writes,deny:()=>{allowed=false;}};
}
test('successful replacement, removal, and same-ID replacement clear rotations',()=>{
 const f=fixture();
 assert.deepEqual(f.guard.edit([-2,3,4],7,{expectedId:8}),{applied:true,previousId:8,nextId:7});
 assert.equal(f.sidecar.get([-2,3,4],8),0);
 assert.equal(f.guard.edit([1,0,0],7).reason,'unchanged');
 assert.equal(f.sidecar.get([1,0,0],7),2);
 assert.equal(f.guard.edit([1,0,0],7,{replaceSameId:true}).applied,true);
 assert.equal(f.sidecar.get([1,0,0],7),0);
});
test('stale precondition and rejected writer preserve world and orientation',()=>{
 const f=fixture();
 assert.equal(f.guard.edit([-2,3,4],0,{expectedId:7}).reason,'stale');
 assert.equal(f.writes(),0);
 f.deny();
 assert.equal(f.guard.edit([-2,3,4],0,{expectedId:8}).reason,'rejected');
 assert.equal(f.readBlock(-2,3,4),8);
 assert.equal(f.sidecar.get([-2,3,4],8),3);
});
test('legacy schema-1 snapshot remains byte-for-byte unchanged',()=>{
 const f=fixture(),legacy={schema:1,edits:[[-2,3,4,8]]};
 const before=JSON.stringify(legacy);
 f.guard.edit([-2,3,4],0);
 assert.equal(JSON.stringify(legacy),before);
 assert.deepEqual(f.sidecar.snapshot(f.readBlock),[{cell:[1,0,0],blockId:7,turns:2}]);
});
test('external edits are reconciled, invalid cells and sentinel rejected',()=>{
 const f=fixture();
 f.world.set('-2,3,4',0);
 assert.equal(f.guard.reconcile([-2,3,4],8),false);
 assert.equal(f.sidecar.size(),1);
 assert.throws(()=>f.guard.edit([0.5,0,0],1),TypeError);
 assert.throws(()=>f.guard.edit([0,0,0],255),TypeError);
 assert.equal(f.writes(),0);
});
test('reentrant writer cannot recursively mutate a second cell',()=>{
 const world=new Map([['0,0,0',4]]);
 const sidecar=makeOrientationSidecar();sidecar.set([0,0,0],4,1);
 let guard;
 guard=makeOrientationEditGuard({sidecar,readBlock:(x,y,z)=>world.get([x,y,z].join(','))??0,
  writeBlock(){assert.throws(()=>guard.edit([1,0,0],2),/Reentrant/);world.set('0,0,0',5);return true;}});
 assert.equal(guard.edit([0,0,0],5).applied,true);
 assert.equal(sidecar.size(),0);
});
