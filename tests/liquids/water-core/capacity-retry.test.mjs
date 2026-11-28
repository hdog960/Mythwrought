import test from 'node:test';
import assert from 'node:assert/strict';
import {createLiquidEngine} from '../../../src/liquids/core/engine.mjs';
const definitions=[{id:'water',gravityLimit:8,lateralLimit:4},{id:'lava',gravityLimit:2,lateralLimit:1}];
const world=(opts={})=>createLiquidEngine({definitions,maxCells:2,maxVisits:4,isLoaded:()=>true,isOpen:()=>true,...opts});
const copy=o=>JSON.parse(JSON.stringify(o));
const totals=e=>e.save().cells.reduce((a,c)=>[a[0]+c.units,a[1]+(c.quantities.trace??0)],[0,0]);

test('distant capacity release retries without explicit wake and preserves quantities',()=>{
  let calls=0;const e=world({isOpen:()=>{calls++;return true;}});
  e.insert(0,0,0,'lava',8,{trace:17});e.insert(100,0,0,'lava',8,{trace:13});
  const r=e.tick();assert.equal(r.moved,0);assert.equal(r.pending,0);
  assert.deepEqual(e.save().capacityBlocked,[[0,0,0],[100,0,0]]);
  const before=e.save();calls=0;
  for(let i=0;i<100;i++)assert.equal(e.tick().visited,0);
  assert.equal(calls,0);assert.deepEqual(e.save(),before);
  const removed=e.extract(100,0,0,8);assert.equal(removed.quantities.trace,13);
  const next=e.tick(1);assert.equal(next.moved,2);assert.deepEqual(next.changed,[[0,0,0],[0,-1,0]]);
  assert.deepEqual(totals(e),[8,17]);assert.equal(e.save().cells.length,2);
});

test('lateral cap rejection is dormant, then retries when space opens',()=>{
  const e=world({isOpen:(x,y,z)=>y===0&&z===0});
  e.insert(0,0,0,'water',8,{trace:9});e.insert(100,0,0,'water',8);e.tick();
  assert.equal(e.tick().visited,0);e.extract(100,0,0,8);
  assert.equal(e.tick(1).moved,4);assert.equal(e.getCell(1,0,0).units,4);assert.deepEqual(totals(e),[8,9]);
});

test('oldest eligible waiter gets first available slot, each retry counts as a visit',()=>{
  const e=world({maxCells:4});
  for(const x of [0,20,40,60])e.insert(x,0,0,'lava',8);
  e.tick();assert.deepEqual(e.save().capacityBlocked,[[0,0,0],[20,0,0],[40,0,0],[60,0,0]]);
  e.extract(60,0,0,8);e.extract(40,0,0,8);
  const a=e.tick(1);assert.equal(a.visited,1);assert.equal(a.moved,2);assert.equal(e.getCell(0,-1,0).units,2);
  const b=e.tick(1);assert.equal(b.visited,1);assert.equal(b.moved,2);assert.equal(e.getCell(20,-1,0).units,2);
  assert.equal(e.save().cells.length,4);assert.deepEqual(totals(e),[16,0]);
});

test('local wake can enable whole-cell transfer at cap; retired waiters do not spin',()=>{
  let closed=false;const e=world({isOpen:(x,y,z)=>!closed||y===0});
  e.insert(0,0,0,'lava',8);e.insert(100,0,0,'lava',8);e.tick();
  e.extract(0,0,0,6);assert.equal(e.tick(1).moved,2);assert.equal(e.getCell(0,-1,0).units,2);
  closed=true;e.wake(100,0,0);e.wake(0,-1,0);e.tick();
  assert.deepEqual(e.save().capacityBlocked,[[100,0,0]]); // lateral split still possible
  assert.equal(e.tick().visited,0);
  e.extract(100,0,0,8);assert.equal(e.save().capacityBlocked,undefined);
});

test('unloaded or sealed waiter retires on retry, normal queue is not starved',()=>{
  let loaded=true;const e=world({maxCells:3,isLoaded:x=>x!==0||loaded});
  for(const x of [0,20,40])e.insert(x,0,0,'lava',8);e.tick();loaded=false;
  e.extract(40,0,0,8);assert.equal(e.tick(1).visited,1);assert.equal(e.getCell(0,0,0).units,8);
  assert.deepEqual(e.save().capacityBlocked,[[20,0,0]]);
  assert.equal(e.tick(1).moved,2);assert.equal(e.getCell(20,-1,0).units,2);
  loaded=true;e.wake(0,0,0);assert.ok(e.save().pending.some(p=>p[0]===0));
});

test('snapshot preserves exact dormant and active FIFO order; old v1 remains readable',()=>{
  const a=world({maxCells:3});for(const x of [0,20,40])a.insert(x,0,0,'lava',8,{trace:x+1});a.tick();
  a.extract(40,0,0,8);const state=copy(a.save()),b=world({maxCells:3,snapshot:state});
  assert.deepEqual(b.save(),state);for(let i=0;i<12;i++){assert.deepEqual(b.tick(1),a.tick(1));assert.deepEqual(b.save(),a.save());}
  const c=world({snapshot:{version:1,cells:[],pending:[]}});assert.deepEqual(c.save(),{version:1,cells:[],pending:[]});
});

test('malformed, duplicate, missing and overlapping capacity queue entries reject',()=>{
  const e=world();e.insert(0,0,0,'lava',8);e.insert(100,0,0,'lava',8);e.tick();const s=e.save();
  for(const bad of [null,{},[[0,0,0],[0,0,0]],[[1,0,0]],[[0,257,0]],[[0,0]],[[0,0,0],[100,0,0],[2,0,0]]])
    assert.throws(()=>world({snapshot:{...s,capacityBlocked:bad}}),TypeError);
  assert.throws(()=>world({snapshot:{...s,pending:[[0,0,0]],capacityBlocked:[[0,0,0]]}}),TypeError);
});

test('large dormant queue uses no callbacks at cap and bounded visits after release',()=>{
  let calls=0;const e=world({maxCells:1024,isOpen:()=>{calls++;return true;}});
  for(let i=0;i<1024;i++)e.insert(i*3,0,0,'lava',8);
  for(let i=0;i<256;i++)assert.equal(e.tick().visited,4);
  assert.equal(e.save().capacityBlocked.length,1024);calls=0;
  assert.equal(e.tick().visited,0);assert.equal(calls,0);
  e.extract(3069,0,0,8);calls=0;const r=e.tick(1);
  assert.equal(r.visited,1);assert.equal(r.moved,2);assert.ok(calls<=7);assert.equal(e.save().cells.length,1024);
});
