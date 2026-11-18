import test from 'node:test';
import assert from 'node:assert/strict';
import { createShapeEditTransactions } from '../../src/interactions/shape-edit-transaction.mjs';
function fixture() {
 const blocks = new Map([['0,0,0', 3]]), orientations = new Map([['0,0,0', 2]]);
 const key = (x,y,z) => `${x},${y},${z}`;
 const api = createShapeEditTransactions({ readBlock:(...p)=>blocks.get(key(...p))??0, readOrientation:(...p)=>orientations.get(key(...p))??null, writeBlock:(...p)=>blocks.set(key(...p.slice(0,3)),p[3]), writeOrientation:(...p)=>orientations.set(key(...p.slice(0,3)),p[3]) });
 return {api,blocks,orientations};
}
test('replacement invalidates orientation and rejects stale snapshots',()=>{const {api}=fixture();const a=api.snapshot([0,0,0]);const b=api.apply(a,4);assert.equal(b.ok,true);assert.equal(b.snapshot.orientation,null);assert.deepEqual(api.apply(a,5),{ok:false,reason:'stale'});});
test('same block orientation must be explicit; quarter turns validated',()=>{const {api}=fixture();const s=api.snapshot([0,0,0]);assert.equal(api.apply(s,3,3).snapshot.orientation,3);assert.equal(api.apply(api.snapshot([0,0,0]),3,4).reason,'orientation');});
test('old save without orientation restores null safely',()=>{const {api}=fixture();const s=api.snapshot([1,2,3]);assert.equal(s.orientation,null);assert.equal(api.apply(s,3).snapshot.orientation,null);});
test('out-of-band block edit is detected even without revision update',()=>{const {api,blocks}=fixture();const s=api.snapshot([0,0,0]);blocks.set('0,0,0',8);assert.equal(api.apply(s,4).reason,'stale');});
test('coordinate and sentinel guards',()=>{const {api}=fixture();assert.throws(()=>api.snapshot([0.5,0,0]));assert.equal(api.apply(api.snapshot([0,0,0]),255).reason,'invalid');});

test('orientation-only out-of-band edit invalidates pending transaction',()=>{const {api,orientations}=fixture();const old=api.snapshot([0,0,0]);orientations.set('0,0,0',1);assert.deepEqual(api.apply(old,4),{ok:false,reason:'stale'});});
test('failed orientation write restores original block and orientation',()=>{
 const blocks=new Map([['0,0,0',3]]), orientations=new Map([['0,0,0',2]]);
 let fail=true;
 const api=createShapeEditTransactions({
  readBlock:()=>blocks.get('0,0,0'),readOrientation:()=>orientations.get('0,0,0'),
  writeBlock:(_x,_y,_z,v)=>blocks.set('0,0,0',v),
  writeOrientation:(_x,_y,_z,v)=>{if(fail){fail=false;throw new Error('injected failure');}orientations.set('0,0,0',v);}
 });
 const old=api.snapshot([0,0,0]);
 assert.deepEqual(api.apply(old,4,1),{ok:false,reason:'write-failed'});
 assert.equal(blocks.get('0,0,0'),3);
 assert.equal(orientations.get('0,0,0'),2);
 assert.equal(api.apply(old,4,1).ok,true);
});
test('different cells do not invalidate each other',()=>{const {api}=fixture();const a=api.snapshot([0,0,0]);const b=api.snapshot([1,0,0]);assert.equal(api.apply(a,4).ok,true);assert.equal(api.apply(b,3,1).ok,true);});
