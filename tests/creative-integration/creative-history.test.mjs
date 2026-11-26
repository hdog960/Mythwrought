import assert from 'node:assert/strict';
import test from 'node:test';
import {createCreativeHistory} from '../../src/creative-integration/creative-history.mjs';
const token='179#1',other='2026#2';
const entry=(before=0,after=3,target=[1,2,3],worldToken=token)=>({worldToken,owner:'core',target,before,after});
function owner(state=3){return {worldToken:token,read:()=>state,apply:(e,value)=>{state=value;return true;},get:()=>state,set:value=>{state=value;}};}
test('verified edit, undo and redo transfer only on owner readback',()=>{
  const h=createCreativeHistory(),a=owner();assert.equal(h.record(entry()),true);
  assert.equal(h.undo(a).ok,true);assert.equal(a.get(),0);assert.equal(h.status().redo,1);
  assert.equal(h.redo(a).ok,true);assert.equal(a.get(),3);assert.equal(h.status().undo,1);
});
test('undo preserves exact structured owner state and rotation',()=>{
  const h=createCreativeHistory(),before={id:110,rotation:1},after={id:110,rotation:2};
  const a=owner({rotation:2,id:110});h.record(entry(before,after));
  before.rotation=3;assert.equal(h.undo(a).ok,true);assert.deepEqual(a.get(),{id:110,rotation:1});
});
test('world mismatch cannot call owner or consume history',()=>{
  const h=createCreativeHistory();h.record(entry());let calls=0;
  assert.equal(h.undo({worldToken:other,read:()=>++calls,apply:()=>++calls}).ok,false);
  assert.equal(calls,0);assert.equal(h.status().undo,1);
});
test('unrelated edit conflict never overwrites owner and clears history',()=>{
  const h=createCreativeHistory(),a=owner(4);h.record(entry());
  assert.equal(h.undo(a).ok,false);assert.equal(a.get(),4);assert.equal(h.status().undo,0);
});
test('owner rejection with intact state preserves undo for later',()=>{
  const h=createCreativeHistory(),a=owner();h.record(entry());
  assert.equal(h.undo({...a,apply:()=>false}).ok,false);assert.equal(h.status().undo,1);
  assert.equal(h.undo(a).ok,true);
});
test('truthy nonboolean and incorrect owner readback never count as success',()=>{
  const h=createCreativeHistory(),a=owner();h.record(entry());
  assert.equal(h.undo({...a,apply:()=>({ok:true})}).ok,false);assert.equal(h.status().undo,1);
  assert.equal(h.undo({...a,apply:()=>true}).ok,false);assert.equal(h.status().undo,1);
});
test('unverified partial owner mutation invalidates history rather than forging rollback',()=>{
  const h=createCreativeHistory(),a=owner();h.record(entry());
  assert.equal(h.undo({...a,apply:()=>{a.set(4);throw Error('write failed');}}).ok,false);
  assert.equal(h.status().undo,0);assert.equal(h.status().redo,0);assert.equal(a.get(),4);
});
test('new successful edit invalidates redo, bounded history evicts oldest',()=>{
  const h=createCreativeHistory({limit:2}),a=owner();h.record(entry(1,2));h.record(entry(2,3));
  assert.equal(h.undo(a).ok,true);h.record(entry(2,4));assert.equal(h.status().redo,0);
  h.record(entry(4,5));assert.equal(h.status().undo,2);
});
test('new world and explicit reset cannot replay previous seed',()=>{
  const h=createCreativeHistory();h.record(entry());h.record(entry(0,3,[1,2,3],other));
  assert.deepEqual(h.status(),{worldToken:other,undo:1,redo:0});h.reset();
  assert.equal(h.undo(owner()).ok,false);
});
test('no-op and malformed records do not enter history',()=>{
  const h=createCreativeHistory();assert.equal(h.record(entry(3,3)),false);
  assert.throws(()=>h.record(entry(0,NaN)));assert.throws(()=>h.record(entry(0,3,undefined,0)));
  assert.equal(h.status().undo,0);
});
