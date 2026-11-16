import test from 'node:test';
import assert from 'node:assert/strict';
import {makeOrientationSidecar} from '../src/voxel-orientation-sidecar.mjs';
import {commitOrientedBatch} from '../src/voxel-orientation-batch.mjs';
function fixture() {
 const cells=[[1,0,0],[2,0,0],[3,0,0]], ids=new Map(cells.map(c=>[c.join(','),4]));
 const sidecar=makeOrientationSidecar();cells.forEach(c=>sidecar.set(c,4,2));
 const readIdentity=c=>ids.get(c.join(','));
 const rollback=c=>{ids.set(c.join(','),4);return true;};
 const run=(edit,options={})=>commitOrientedBatch({cells,sidecar,readIdentity,rollback,edit,...options});
 return {cells,ids,sidecar,readIdentity,run};
}
test('successful multi-cell replacement invalidates every old orientation',async()=>{
 const f=fixture();assert.equal(await f.run(c=>{f.ids.set(c.join(','),5);return true;}),true);
 for(const c of f.cells){assert.equal(f.readIdentity(c),5);assert.equal(f.sidecar.get(c,4),0);}
});
test('late failed cell rolls back all written cells in reverse and retains orientation',async()=>{
 const f=fixture(),order=[];
 await assert.rejects(f.run((c,i)=>{f.ids.set(c.join(','),5);return i!==2;},{
  rollback:(c,i)=>{order.push(i);f.ids.set(c.join(','),4);return true;}
 }),/not acknowledged/);
 assert.deepEqual(order,[2,1,0]);
 for(const c of f.cells){assert.equal(f.readIdentity(c),4);assert.equal(f.sidecar.get(c,4),2);}
});
test('incomplete undo fails closed only on untrusted cells',async()=>{
 const f=fixture();
 await assert.rejects(f.run((c,i)=>{f.ids.set(c.join(','),5);return i!==1;},{
  rollback:(c,i)=>{if(i===1)return false;f.ids.set(c.join(','),4);return true;}
 }),AggregateError);
 assert.equal(f.sidecar.get(f.cells[1],4),0);
 assert.equal(f.sidecar.get(f.cells[0],4),2);
});
test('preflight failure never writes, duplicate coordinates rejected',async()=>{
 const f=fixture();let writes=0;
 await assert.rejects(f.run(()=>{writes++;return true;},{readIdentity:()=>255}),/Invalid original identity/);
 assert.equal(writes,0);
 await assert.rejects(f.run(()=>true,{cells:[f.cells[0],f.cells[0]]}),/Duplicate batch cell/);
});
test('overlapping batch rejects while first is pending, then releases lock',async()=>{
 const f=fixture();let release;const gate=new Promise(resolve=>{release=resolve;});
 const pending=f.run(async()=>{await gate;return true;});
 await assert.rejects(f.run(()=>true),/Overlapping batch edit/);
 release();await pending;
 assert.equal(await f.run(()=>true),true);
});
